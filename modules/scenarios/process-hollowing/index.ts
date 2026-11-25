import { PROCESS_HOLLOWING_TELEMETRY } from './telemetry';
import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'process-hollowing',
  code: 'T1055.012',
  name: 'Process Hollowing & Cobalt Strike Beacon Loader',
  shortSubtitle: 'Malware Analysis · svchost.exe Memory Unmapping & PE Injection',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 4,
  overview: 'In Process Hollowing (MITRE ATT&CK T1055.012), Invoice_Q4.exe on a victim workstation runs Cobalt Strike Beacon inside Microsoft-signed svchost.exe so AV and allowlisting treat it as a trusted Windows host. The arc: pause a real svchost.exe, empty its code from RAM, write Beacon in, wake the thread under the trusted name, then open HTTPS C2. Steps #1–#4 cover process/thread mechanics; Step #5 covers C2; Memory shows why live RAM no longer matches the signed on-disk file. Primary detection: Sysmon ProcessCreate / ProcessAccess / ProcessTampering with anomalous HTTPS from bare svchost.exe.',
  specs: [
    { term: 'MITRE TECHNIQUE', value: 'T1055.012 (Process Hollowing)' },
    { term: 'KEY WIN32 APIS', value: 'CreateProcessW, NtUnmapViewOfSection, VirtualAllocEx, WriteProcessMemory, SetThreadContext, ResumeThread' },
    { term: 'DETECTION SOURCES', value: 'Sysmon EID 1, 8, 10, 25 (ProcessTampering) · ETW Ti' },
    { term: 'TARGET PROCESS', value: 'C:\\Windows\\System32\\svchost.exe (PID: 4892)' },
    { term: 'MALWARE FAMILY', value: 'GuLoader / Cobalt Strike Beacon v4.9' },
    { term: 'RISK LEVEL', value: 'CRITICAL (Bypass Host Firewall & Basic AV)' },
  ],
  nodes: [
    {
      id: 'dropper',
      label: 'Invoice_Q4.exe',
      sublabel: 'PID 3104 (Loader)',
      role: 'attacker',
      x: 18,
      y: 58,
      details: {
        osOrType: 'Win32 Packed Loader (InnoSetup)',
        pidOrPort: 'PID 3104 · PPID 2410 (explorer.exe)',
        privilege: 'Medium Integrity (CORP\\j.smith)',
        artifacts: ['SHA256: 8f4e2b9c...e19a', 'Imports: kernel32.dll, ntdll.dll'],
        description: 'Initial packed dropper executed by the user. Responsible for decrypting the embedded payload and hollowing a legitimate system process.' } },
    {
      id: 'ntdll',
      label: 'Kernel / NTDLL API',
      sublabel: 'ntdll.dll · Syscalls',
      role: 'memory',
      x: 42,
      y: 34,
      details: {
        osOrType: 'Windows Native API Subsystem',
        pidOrPort: 'Ring 3 → Ring 0 Transition',
        privilege: 'User/Kernel Bridge',
        artifacts: ['NtUnmapViewOfSection', 'NtAllocateVirtualMemory', 'NtWriteVirtualMemory', 'NtSetContextThread'],
        description: 'Low-level Windows Native API subsystem invoked by the loader to manipulate the virtual address space of the suspended target process.' } },
    {
      id: 'svchost',
      label: 'svchost.exe',
      sublabel: 'PID 4892 (Hollowed)',
      role: 'process',
      x: 54,
      y: 62,
      details: {
        osOrType: 'Hollowed System Process',
        pidOrPort: 'PID 4892 · Base 0x00400000',
        privilege: 'Medium Integrity · Unbacked RWX',
        artifacts: ['CreationFlags: 0x00000004 (CREATE_SUSPENDED)', 'EAX EntryPoint Patched -> 0x004014A0'],
        description: 'Legitimate Windows binary spawned in CREATE_SUSPENDED mode whose original PE sections were unmapped and replaced with Cobalt Strike.' } },
    {
      id: 'edr_sysmon',
      label: 'Sysmon & EDR Sensor',
      sublabel: 'EID 1 / 10 / 25',
      role: 'firewall_siem',
      x: 78,
      y: 28,
      details: {
        osOrType: 'Sysmon v15.1 + ETW Threat Intel',
        pidOrPort: 'Microsoft-Windows-Sysmon/Operational',
        privilege: 'SYSTEM Telemetry Sensor',
        artifacts: ['Event ID 25: Image is replaced', 'GrantedAccess: 0x1FFFFF'],
        description: 'Kernel telemetry and Sysmon sensor capturing Process Tampering (EID 25) and suspicious cross-process memory allocation.' } },
    {
      id: 'c2_server',
      label: 'Attacker C2 Server',
      sublabel: '185.220.101.42:443',
      role: 'attacker',
      x: 84,
      y: 68,
      details: {
        osOrType: 'Cobalt Strike TeamServer',
        pidOrPort: 'TCP/443 (Malleable HTTPS Profile)',
        privilege: 'External Threat Actor',
        artifacts: ['JA3: 72a589da586844d7f0818ce684948eea', 'URI: /jquery-3.3.1.min.js'],
        description: 'External Command & Control server receiving encrypted HTTPS beacon callbacks originating from the hollowed svchost.exe process.' } },
  ],
  processTree: [
    {
      pid: 2410,
      ppid: 1820,
      name: 'explorer.exe',
      commandLine: 'C:\\Windows\\Explorer.EXE',
      user: 'CORP\\j.smith',
      integrity: 'Medium',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: ['ShellExecuteExW'] },
    {
      pid: 3104,
      ppid: 2410,
      name: 'Invoice_Q4.exe',
      commandLine: '"C:\\Users\\j.smith\\Downloads\\Invoice_Q4.exe"',
      user: 'CORP\\j.smith',
      integrity: 'Medium',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'CreateProcessW(CREATE_SUSPENDED)',
        'NtUnmapViewOfSection',
        'VirtualAllocEx(PAGE_EXECUTE_READWRITE)',
        'WriteProcessMemory',
        'SetThreadContext',
        'ResumeThread',
      ] },
    {
      pid: 4892,
      ppid: 3104,
      name: 'svchost.exe',
      commandLine: 'C:\\Windows\\System32\\svchost.exe',
      user: 'CORP\\j.smith',
      integrity: 'Medium',
      status: 'hollowed',
      activeFromStage: 1,
      apiCalls: ['WinHttpOpen', 'WinHttpConnect(185.220.101.42:443)', 'VirtualProtect'],
      memoryBlocks: [
        {
          address: '0x00400000',
          section: 'PE Header (Injected)',
          permissions: 'RW-',
          size: '4 KB',
          status: 'injected',
          description:
            'Injected MZ/PE header (4D 5A 90 00) written via WriteProcessMemory at 0x00400000 after NtUnmapViewOfSection stripped the original svchost.exe image (why 0x00400000 & RW-: reusing the exact PEB ImageBaseAddress avoids breaking internal pointer relocations, and keeping the 4 KB header page RW- instead of RWX lets the loader parse section tables without flagging an executable header).',
          hexPreview: '4D 5A 90 00 03 00 00 00 04 00 00 00 FF FF 00 00  MZ..............' },
        {
          address: '0x00401000',
          section: '.text (Cobalt Strike)',
          permissions: 'RWX',
          size: '264 KB',
          status: 'shellcode',
          description:
            'Unbacked PAGE_EXECUTE_READWRITE (0x40) memory region at Base+0x1000 containing the unpacked Cobalt Strike Beacon code (why RWX & unbacked: VirtualAllocEx allocated private RAM with simultaneous Read+Write+Execute permissions so Invoice_Q4.exe could copy 264 KB of shellcode and immediately jump to RCX = 0x004014A0 via ResumeThread, leaving a private executable VAD page that does not match C:\\Windows\\System32\\svchost.exe on disk).',
          hexPreview: 'FC 48 83 E4 F0 E8 C0 00 00 00 41 51 41 50 52 51  .H........AQAPRQ' },
        {
          address: '0x7FF8B4200000',
          section: 'ntdll.dll (.text)',
          permissions: 'R-X',
          size: '1,920 KB',
          status: 'clean',
          description:
            'Standard Windows native system library mapped into the process address space with Read-Execute (R-X) permissions (why present & clean: every Windows process requires ntdll.dll in high user-mode memory to transition API calls like NtUnmapViewOfSection and RtlUserThreadStart into the kernel via syscall stubs).',
          hexPreview: '4C 8B D1 B8 2A 00 00 00 F6 04 25 08 03 FE 7F 01  L...*.....%.....' },
      ] },
  ],
  stages: [
    {
      index: 1,
      title: 'CREATE SUSPENDED TARGET PROCESS',
      subtitle: 'Spawning svchost.exe with dwCreationFlags = 0x4',
      description: 'Acting as the intruder hiring an official armored bank truck, the loader (Invoice_Q4.exe, PID 3104) invokes CreateProcessW (Windows’ standard API for launching a new program) to spawn C:\\Windows\\System32\\svchost.exe (chosen because it carries a valid Microsoft digital signature) with dwCreationFlags set to CREATE_SUSPENDED (0x00000004, a pause flag that freezes the program before its first instruction runs so the loader gets a safe window to swap its memory). Just like hitting the garage freeze switch before the route starts, Windows initializes the process address space and primary thread (TID 4896) at ntdll!RtlUserThreadStart (Windows’ thread launchpad) with SuspendCount = 1 (keeping the thread inert) and hands back two golden master keys: Process Master Key hProcess = 0x01C4 (a permission handle unlocking svchost.exe’s memory so the loader can read, empty, and rewrite RAM in Steps #2 and #3) and Thread Master Key hThread = 0x01C8 (a permission handle unlocking the paused thread’s CPU controls so the loader can steer and wake it in Step #4). In Sysmon Event ID 1 (Windows’ process-creation log), a non-services.exe parent spawning svchost.exe without "-k" service-group flags is an immediate anomaly.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1106',
      mitreTechniqueName: 'Native API: CreateProcessW',
      activeNodeIds: ['dropper', 'svchost', 'edr_sysmon'],
      compromisedNodeIds: ['dropper'],
      keySpecs: [
        { term: 'API CALL', value: 'CreateProcessW("C:\\Windows\\System32\\svchost.exe")' },
        { term: 'CREATION FLAGS', value: '0x00000004 (CREATE_SUSPENDED)' },
        { term: 'ANOMALOUS PARENT', value: 'Invoice_Q4.exe (Expected: services.exe)' },
      ] },
    {
      index: 2,
      title: 'UNMAP LEGITIMATE MEMORY IMAGE',
      subtitle: 'Querying PEB ImageBaseAddress & unmapping section',
      description: 'Using the cargo-door master key (hProcess = 0x01C4, granting memory access inside the frozen truck), the loader queries the target Process Environment Block (PEB, Windows’ internal process data table) via NtQueryInformationProcess (the native syscall that retrieves kernel process metadata) to locate the ImageBaseAddress at 0x00400000 (the exact starting slot in RAM where Windows placed svchost.exe). Emptying every genuine bank gold crate out of the back, it calls NtUnmapViewOfSection(hProcess = 0x01C4, BaseAddress = 0x00400000) from ntdll.dll (Windows’ core system-call library), completely detaching the signed Microsoft svchost.exe code from virtual memory (returning STATUS_SUCCESS = 0x00000000 so the 0x00400000 slot is empty) while keeping the trusted armored shell and PID 4892 alive.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1055.012',
      mitreTechniqueName: 'Process Injection: Process Hollowing',
      activeNodeIds: ['dropper', 'ntdll', 'svchost'],
      compromisedNodeIds: ['dropper', 'svchost'],
      keySpecs: [
        { term: 'NATIVE SYSCALL', value: 'NtUnmapViewOfSection(hProcess, 0x00400000)' },
        { term: 'TARGET IMAGE BASE', value: '0x00400000 (Read from PEB + 0x10)' },
        { term: 'MEMORY STATE', value: 'Original svchost.exe sections unmapped' },
      ] },
    {
      index: 3,
      title: 'ALLOCATE RWX & WRITE MALICIOUS PE',
      subtitle: 'VirtualAllocEx (PAGE_EXECUTE_READWRITE) + WriteProcessMemory',
      description: 'Unlocking a secret high-clearance cargo bay inside the hollowed truck using Process Master Key hProcess = 0x01C4, the loader calls VirtualAllocEx (Windows’ API for reserving memory inside another process) at 0x00400000 (reusing the original base address so internal malware pointers do not break) with flProtect = PAGE_EXECUTE_READWRITE (0x40, known as RWX so the memory can be written now and executed as CPU instructions immediately afterward). Marching its covert crew and mission crate up the rear ramp, it invokes WriteProcessMemory (Windows’ cross-process memory copy API) to stream the unpacked Cobalt Strike PE headers ("MZ" / 4D 5A, the Windows executable signature) and sections (.text for machine code, .rdata for read-only constants, and .data for variables) into svchost.exe. This seals the 270,336-byte payload inside an unbacked MEM_PRIVATE RWX region without touching disk and triggers Sysmon Event ID 10 (ProcessAccess logging GrantedAccess = 0x1FFFFF full-control access).',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1055.012',
      mitreTechniqueName: 'Process Hollowing: Memory Write',
      activeNodeIds: ['dropper', 'ntdll', 'svchost', 'edr_sysmon'],
      compromisedNodeIds: ['dropper', 'svchost'],
      keySpecs: [
        { term: 'MEMORY PROTECTION', value: 'PAGE_EXECUTE_READWRITE (0x40 - RWX)' },
        { term: 'BYTES WRITTEN', value: '270,336 Bytes (MZ Header + 4 PE Sections)' },
        { term: 'SYSMON ARTIFACT', value: 'Event ID 10 (GrantedAccess: 0x1FFFFF)' },
      ] },
    {
      index: 4,
      title: 'PATCH THREAD CONTEXT & RESUME',
      subtitle: 'Redirecting Thread EntryPoint & triggering Sysmon EID 25',
      description: 'Using the second golden master key (Thread Master Key hThread = 0x01C8, unlocking the frozen truck’s front cab and ignition controls), the loader reads the suspended thread’s CPU registers via GetThreadContext (Windows’ API for inspecting a paused thread’s register state) and overwrites the entry-point register RCX (the 64-bit CPU register where a newly suspended Windows thread stores its upcoming startup address) to 0x004014A0 (Base 0x00400000 + EntryPoint RVA 0x14A0, pointing directly at the injected Beacon’s first instruction) via SetThreadContext. Shattering the freeze lock and releasing the handbrake via ResumeThread (which drops SuspendCount from 1 to 0 so the CPU scheduler starts running TID 4896) launches the Beacon inside svchost.exe—the exact moment Windows Kernel ETW and Sysmon Event ID 25 (ProcessTampering) flag "Image is replaced" because live RAM no longer matches the signed file on disk.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1055.012',
      mitreTechniqueName: 'Thread Context Hijacking & Execution',
      activeNodeIds: ['dropper', 'svchost', 'edr_sysmon'],
      compromisedNodeIds: ['dropper', 'svchost'],
      keySpecs: [
        { term: 'NEW ENTRY POINT', value: 'RCX = 0x004014A0 (AddressOfEntryPoint)' },
        { term: 'KERNEL DETECTION', value: 'Sysmon Event ID 25 (Image is replaced)' },
        { term: 'THREAD STATE', value: 'Resumed (Running as PID 4892)' },
      ] },
    {
      index: 5,
      title: 'OUTBOUND C2 BEACON OVER HTTPS',
      subtitle: 'Malleable C2 communication disguised as jQuery traffic',
      description: 'Rolling past the bank checkpoint guard in the official uniform, Cobalt Strike executes inside C:\\Windows\\System32\\svchost.exe (PID 4892, so path-based host firewalls trust outbound connections from the signed Windows binary). Opening its hidden courier line to the remote warehouse, the Beacon loads winhttp.dll (Windows’ built-in HTTP client library) and establishes an encrypted TLS 1.3 session over TCP port 443 (standard HTTPS web traffic chosen to blend in with employee browsing) to 185.220.101.42:443 mimicking GET /jquery-3.3.1.min.js (a Malleable C2 disguise hiding encrypted victim data in cookies). Like the control-room radar spotting an unscheduled trip, SOC analysts catch this by correlating Sysmon Event ID 3 (NetworkConnect logging bare svchost.exe without "-k" flags) with TLS JA3 fingerprint 72a589da586844d7f0818ce684948eea (a hash uniquely identifying Cobalt Strike’s TLS handshake) and Sysmon Event ID 25.',
      mitreTacticPhase: 6,
      mitreTechniqueId: 'T1071.001',
      mitreTechniqueName: 'Application Layer Protocol: Web C2',
      activeNodeIds: ['svchost', 'edr_sysmon', 'c2_server'],
      compromisedNodeIds: ['dropper', 'svchost', 'c2_server'],
      keySpecs: [
        { term: 'C2 DESTINATION', value: '185.220.101.42:443 (HTTPS)' },
        { term: 'MALLEABLE PROFILE', value: 'GET /jquery-3.3.1.min.js' },
        { term: 'JA3 FINGERPRINT', value: '72a589da586844d7f0818ce684948eea' },
      ] },
  ],
  telemetry: PROCESS_HOLLOWING_TELEMETRY };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'process-hollowing',
    briefing: {
      headline: 'Scenario Briefing: Process Hollowing (MITRE T1055.012), Running Malware Inside a Trusted Windows Process',
      storyAnalogy:
        'Imagine an intruder who wants to enter a high-security bank without raising an alarm. Instead of breaking down the front door in a ski mask, they hire an official armored bank truck, freeze it inside the garage before the driver even starts the route, and pocket two golden master keys: the first master key unlocks the rear cargo doors so they can empty all the legal bank gold and load their own covert crew inside, and the second master key unlocks the driver cab so they can reprogram the GPS route and release the brake. When the truck rolls out, every security camera and guard at the gate still sees the bank’s own trusted license plate and uniform.',
      plainSummary:
        'In this scenario (T1055.012, Process Hollowing & Cobalt Strike Beacon Loader) on WKS-04 (10.10.4), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: launching a Legitimate Windows Process, then hollowing Out the Original svchost.exe Code, then allocating Writable-Executable Memory, then hijacking the CPU Thread Context. Steps #1–#5 walk that chain end-to-end by covering Launching a Legitimate Windows Process, then Hollowing Out the Original svchost.exe Code, then Allocating Writable-Executable Memory, then Hijacking the CPU Thread Context, then Outbound HTTPS Command-and-Control Beacon. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
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
          'The attacker’s goal on Victim Laptop WKS-04 (10.10.4.15) is to run Beacon without triggering antivirus or application-allowlisting rules that would block an unknown new .exe on disk. Acting as the intruder at the dispatch desk, the initial loader (Invoice_Q4.exe, PID 3104, the stage-1 file executed on that host) calls CreateProcessW (Windows’ standard user-mode API for launching a new program) to hire our "official armored bank truck", a real Windows system binary: C:\\Windows\\System32\\svchost.exe (PID 4892, chosen because svchost.exe carries a valid Microsoft digital signature, so security tools and analysts naturally expect to see it running in the background). Hitting the "garage freeze switch" means passing the creation flag CREATE_SUSPENDED = 0x00000004 (which instructs the Windows kernel to assemble the process container in RAM and create its main worker thread TID 4896, but pause it at the starting line before its first line of code can execute). In response, the Windows kernel hands back a populated PROCESS_INFORMATION structure (Windows’ startup receipt) containing the "two golden master keys": Process Master Key hProcess = 0x01C4 (a numeric permission handle that unlocks svchost.exe’s virtual memory so Invoice_Q4.exe can inspect, erase, and inject code into it during Steps #2 and #3) and Thread Master Key hThread = 0x01C8 (a separate permission handle that unlocks the paused thread’s CPU controls so Invoice_Q4.exe can redirect its starting address and wake it up in Step #4).',
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
  };

export * from './choreography';
export * from './telemetry';
