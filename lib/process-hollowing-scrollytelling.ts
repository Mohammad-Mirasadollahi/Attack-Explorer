export type ProcessHollowingSubStepId =
  | '0A'
  | '0B'
  | '0C'
  | '0D'
  | '1A'
  | '1B'
  | '1C'
  | '1D'
  | '2A'
  | '2B'
  | '2C'
  | '2D'
  | '3A'
  | '3B'
  | '3C'
  | '3D'
  | '4A'
  | '4B'
  | '4C'
  | '4D'
  | '5A'
  | '5B'
  | '5C'
  | '5D';

export interface ProcessHollowingSubStepSpec {
  id: ProcessHollowingSubStepId;
  stageNumber: number; // 0..5
  subStepIndex: number; // 0..3 within stage
  badgeLabel: string;
  videoTimestampRef: string;
  headline: string;
  clauseNumber: string; // e.g., '#1.1'
  clauseTitle: string;
  narrativeSummary: string;
  technicalMechanism: string;
  apiSignature: string;
  kernelAndMemoryDelta: string;
  detectionEvidence: string;
}

export interface ProcessHollowingChapterSpec {
  stageNumber: number; // 0..5
  stageCode: string;
  title: string;
  subtitle: string;
  mitreCode: string;
  videoRangeRef: string;
  headerBannerLeft: string;
  headerBannerRight: string;
  storyAnalogy: string;
  commandLine: string;
  defenseRuleTitle: string;
  defenseRuleQuery: string;
  subSteps: ProcessHollowingSubStepSpec[];
}

export type ProcessHollowingTargetShapeId =
  | 'shape-dropper-pid3104'
  | 'shape-kernel-ring0-bridge'
  | 'shape-svchost-outer-shell'
  | 'shape-peb-0x7ffdf000'
  | 'shape-ram-0x00400000'
  | 'shape-vad-tree-monitor'
  | 'shape-thread-tid4896'
  | 'shape-firewall-gate'
  | 'shape-c2-malleable-stream'
  | 'shape-fft-spectrum-panel'
  | 'shape-sysmon-sensor-hud';

export type ProcessHollowingCameraMode =
  | 'WIDE_KILLCHAIN_OVERVIEW'
  | 'KERNEL_SPAWN_TWO_SHOT'
  | 'PEB_UNMAP_MACRO'
  | 'RWX_HEX_INJECTION_MACRO'
  | 'CPU_REGISTER_SWITCHBOARD'
  | 'DMZ_FIREWALL_FFT_ANALYZER';

export interface ProcessHollowingExtractedToken {
  token: string;
  category:
    | 'PROCESS'
    | 'SYSCALL'
    | 'HANDLE'
    | 'MEMORY'
    | 'REGISTER'
    | 'NETWORK'
    | 'DETECTION';
  targetShapeId: ProcessHollowingTargetShapeId;
  motionCue: string;
}

export interface ProcessHollowingMicroBeat {
  beatIndex: 0 | 1 | 2;
  code: 'MOTION ①' | 'MOTION ②' | 'MOTION ③';
  title: string;
  actorFrom: string;
  actorTo: string;
  vectorToken: string;
  targetShapeId: ProcessHollowingTargetShapeId;
  mutationSummary: string;
}

export interface ProcessHollowingSubStepCinematicSpec {
  subStepId: ProcessHollowingSubStepId;
  cameraMode: ProcessHollowingCameraMode;
  cameraLabel: string;
  primaryShapeId: ProcessHollowingTargetShapeId;
  secondaryShapeIds: ProcessHollowingTargetShapeId[];
  extractedTokens: ProcessHollowingExtractedToken[];
  microBeats: [
    ProcessHollowingMicroBeat,
    ProcessHollowingMicroBeat,
    ProcessHollowingMicroBeat,
  ];
}

export interface ProcessHollowingStageVisualState {
  stageNumber: number;
  activeSubStepId: ProcessHollowingSubStepId;
  subStepIndex: number; // 0..3
  stageProgress: number; // 0..1 within the stage
  overallProgress: number; // 0..1 across all 24 sub-steps
  subStepInternalProgress: number; // 0..1 within current sub-step
  activeMicroBeatIndex: 0 | 1 | 2;
  activeMicroBeat: ProcessHollowingMicroBeat;
  cinematicSpec: ProcessHollowingSubStepCinematicSpec;
  loaderHandlesText: string;
  kernelEprocessCreated: boolean;
  hasProcessHandle: boolean;
  hasThreadHandle: boolean;
  createSuspendedFlagActive: boolean;
  svchostThreadState: 'STANDBY' | 'FROZEN' | 'HIJACKED_RUNNING';
  pebQueried: boolean;
  peSectionsInspected: boolean;
  unmapSyscallActive: boolean;
  memoryUnmapped: boolean;
  rwxAllocated: boolean;
  peHeadersWritten: boolean;
  payloadWritten: boolean;
  vadAnomalyFlagged: boolean;
  payloadBytesCommitted: number;
  rcxEntryPoint: '0x00412000' | '0x004014A0';
  suspendCount: 1 | 0;
  tamperingEventFired: boolean;
  firewallPassed: boolean;
  malleableProfileActive: boolean;
  c2BeaconActive: boolean;
  fftSpectrumLocked: boolean;
  activeSysmonBadge: string;
}

export const PROCESS_HOLLOWING_SCENARIO_ID = 'process-hollowing';

export const PROCESS_HOLLOWING_SCROLL_CHAPTERS: ProcessHollowingChapterSpec[] = [
  {
    stageNumber: 0,
    stageCode: 'STAGE 00 · BRIEFING',
    title: 'Armored Bank Truck Analogy & Kill-Chain Architecture',
    subtitle:
      'Why adversaries hollow out trusted Microsoft-signed system binaries instead of executing raw malware directly',
    mitreCode: 'MITRE ATT&CK T1055.012 · DEFENSE EVASION',
    videoRangeRef: '00:00 – 01:33',
    headerBannerLeft: 'HOST: WKS-04.corp.local (10.10.4.15)',
    headerBannerRight: 'TECHNIQUE: T1055.012 PROCESS HOLLOWING',
    storyAnalogy:
      'Imagine an intruder who wants to pass through a heavily guarded checkpoint. Driving an unmarked getaway car triggers an immediate alarm. Instead, the intruder intercepts a real, armored bank truck inside a private garage while its engine is paused, removes the legitimate cargo from the cabin, loads their own covert crew inside, and drives out under the bank’s trusted license plates.',
    commandLine:
      'C:\\Users\\jdoe\\Downloads\\Invoice_Q4.exe -> C:\\Windows\\System32\\svchost.exe (PID: 4892) -> 185.220.101.42:443',
    defenseRuleTitle: 'Multi-Stage Behavioral Correlation (EID 1 + 10 + 25 + 3)',
    defenseRuleQuery:
      'host.name:"WKS-04.corp.local" AND process.executable:"C:\\Windows\\System32\\svchost.exe" AND event.code:("1" OR "10" OR "25" OR "3")',
    subSteps: [
      {
        id: '0A',
        stageNumber: 0,
        subStepIndex: 0,
        badgeLabel: '0A · UNTRUSTED DROPPER BLOCKED',
        videoTimestampRef: '00:00 – 00:28',
        headline: 'Direct Execution of Unsigned Invoice_Q4.exe Triggers Immediate Block',
        clauseNumber: '#0.1',
        clauseTitle: 'The Evasion Dilemma on Protected Endpoints',
        narrativeSummary:
          'When a user opens Invoice_Q4.exe (PID 3104) from the Downloads folder, any direct outbound network socket from an unsigned binary is immediately blocked by EDR and host firewall rules.',
        technicalMechanism:
          'Endpoint sensors verify the on-disk path (C:\\Users\\jdoe\\Downloads\\Invoice_Q4.exe) and missing Authenticode signature, blocking raw C2 sockets before a connection can complete.',
        apiSignature: 'Unsigned Dropper: Invoice_Q4.exe (PID 3104) ──✕──▶ Edge Firewall BLOCK',
        kernelAndMemoryDelta: 'Process Trust Level: UNTRUSTED (No Microsoft Authenticode Signature)',
        detectionEvidence: 'Application Allowlisting & Host Firewall Policy: Block Unsigned Outbound TCP/443',
      },
      {
        id: '0B',
        stageNumber: 0,
        subStepIndex: 1,
        badgeLabel: '0B · TRUSTED HOST CONTAINER',
        videoTimestampRef: '00:29 – 00:54',
        headline: 'Selecting Microsoft-Signed svchost.exe as the "Armored Bank Truck"',
        clauseNumber: '#0.1',
        clauseTitle: 'Abusing Built-In Windows Service Host Trust',
        narrativeSummary:
          'To bypass process-path allowlisting, the dropper targets C:\\Windows\\System32\\svchost.exe—a legitimate Microsoft-signed binary expected to communicate over HTTPS.',
        technicalMechanism:
          'Because svchost.exe carries a valid Microsoft Windows Production PCA signature on disk, perimeter and host firewalls grant it outbound network trust.',
        apiSignature: 'Target Host Binary: C:\\Windows\\System32\\svchost.exe (PID 4892 · Signed)',
        kernelAndMemoryDelta: 'Disk Signature: Microsoft Windows Publisher Verified (Catalog Signed)',
        detectionEvidence: 'Baseline Trust Check: Binary Path & On-Disk Hash Match Clean System32 Image',
      },
      {
        id: '0C',
        stageNumber: 0,
        subStepIndex: 2,
        badgeLabel: '0C · DISK VS. RAM SPLIT',
        videoTimestampRef: '00:55 – 01:14',
        headline: 'Keeping Disk Untouched While Swapping the Executable Image in RAM',
        clauseNumber: '#0.2',
        clauseTitle: 'In-Memory Hollowing vs. On-Disk Integrity',
        narrativeSummary:
          'Process Hollowing never modifies svchost.exe on the C: drive; instead, it hollows out PID 4892’s virtual memory at 0x00400000 and injects Cobalt Strike Beacon directly into RAM.',
        technicalMechanism:
          'Static file scanners inspecting C:\\Windows\\System32\\svchost.exe see the clean Microsoft binary, while volatile RAM at 0x00400000 executes unpacked Cobalt Strike shellcode.',
        apiSignature: 'NTFS Disk: Clean svchost.exe !== Volatile RAM (0x00400000): Cobalt Strike PE (264 KB)',
        kernelAndMemoryDelta: 'Memory Divergence: On-Disk SEC_IMAGE Unmapped -> In-Memory MEM_PRIVATE RWX',
        detectionEvidence: 'Memory Forensics Indicator: Process Image in RAM Diverges from File on Disk',
      },
      {
        id: '0D',
        stageNumber: 0,
        subStepIndex: 3,
        badgeLabel: '0D · 5-STAGE KILL-CHAIN MAP',
        videoTimestampRef: '01:15 – 01:33',
        headline: 'Complete 5-Stage Process Hollowing & Telemetry Correlation Pipeline',
        clauseNumber: '#0.2',
        clauseTitle: 'End-to-End API & Sysmon Sensor Architecture',
        narrativeSummary:
          'Across five sequential stages, the loader spawns, hollows, injects, hijacks, and beacons—leaving a deterministic trail of four Sysmon and SIEM telemetry events.',
        technicalMechanism:
          '#1 CreateProcessW(CREATE_SUSPENDED) -> #2 NtUnmapViewOfSection -> #3 VirtualAllocEx + WriteProcessMemory -> #4 SetThreadContext + ResumeThread -> #5 TLS 1.3 Beacon.',
        apiSignature: 'CreateProcessW -> NtUnmapViewOfSection -> WriteProcessMemory -> SetThreadContext -> TLS 1.3',
        kernelAndMemoryDelta: 'Target ImageBase: 0x00400000 | Entry Point Swap: 0x00412000 -> 0x004014A0',
        detectionEvidence: 'Full Telemetry Chain: Sysmon EID 1 -> Sysmon EID 10 -> Sysmon EID 25 -> Sysmon EID 3 + FFT',
      },
    ],
  },
  {
    stageNumber: 1,
    stageCode: 'STAGE 01 · SUSPENDED SPAWN',
    title: 'Process Creation & Kernel Handle Acquisition',
    subtitle:
      'Spawning a legitimate svchost.exe container in a frozen state and capturing full-control kernel handles',
    mitreCode: 'MITRE ATT&CK T1055.012 / T1106 · STEP 1',
    videoRangeRef: '01:34 – 02:22',
    headerBannerLeft: 'MITRE ATT&CK T1055.012 / T1106',
    headerBannerRight: 'Step 1: Process Creation & Handle Acquisition',
    storyAnalogy:
      'The loader rolls a legitimate armored truck (svchost.exe) onto the staging floor with its ignition frozen at the starting line. Before the driver can turn the key, the loader collects the master keys to both the vehicle cabin (hProcess) and the driver’s seat (hThread).',
    commandLine:
      'CreateProcessW(NULL, "C:\\Windows\\System32\\svchost.exe", ..., CREATE_SUSPENDED [0x00000004], ..., &si, &pi)',
    defenseRuleTitle: 'Sysmon Event ID 1: Non-Services Parent Spawning Orphan svchost.exe',
    defenseRuleQuery:
      'event.code:"1" AND process.executable:"C:\\Windows\\System32\\svchost.exe" AND NOT process.parent.executable:"C:\\Windows\\System32\\services.exe"',
    subSteps: [
      {
        id: '1A',
        stageNumber: 1,
        subStepIndex: 0,
        badgeLabel: '1A · CREATEPROCESSW CALL',
        videoTimestampRef: '01:34 – 01:46',
        headline: 'Untrusted Loader Invokes CreateProcessW() Targetting svchost.exe',
        clauseNumber: '#1.1',
        clauseTitle: 'Parent-Child Process Lineage Anomaly',
        narrativeSummary:
          'Invoice_Q4.exe (PID 3104) initiates a Win32 CreateProcessW() API call requesting the Windows kernel to instantiate C:\\Windows\\System32\\svchost.exe (PID 4892).',
        technicalMechanism:
          'Legitimate svchost.exe instances are always spawned by services.exe (PID 628) with a -k <group> flag. Here, Invoice_Q4.exe spawns svchost.exe directly with no arguments.',
        apiSignature: 'CreateProcessW(lpApplicationName: "C:\\Windows\\System32\\svchost.exe")',
        kernelAndMemoryDelta: 'Parent PID: 3104 (Invoice_Q4.exe) ──▶ Child PID: 4892 (svchost.exe)',
        detectionEvidence: 'Lineage Anomaly: Parent is Invoice_Q4.exe instead of C:\\Windows\\System32\\services.exe',
      },
      {
        id: '1B',
        stageNumber: 1,
        subStepIndex: 1,
        badgeLabel: '1B · RING-0 EPROCESS & PEB',
        videoTimestampRef: '01:47 – 01:58',
        headline: 'Kernel Allocates EPROCESS (PID 4892), PEB & Maps Signed svchost.exe',
        clauseNumber: '#1.1',
        clauseTitle: 'Ring-3 to Ring-0 ntdll!NtCreateUserProcess Bridge',
        narrativeSummary:
          'Transitioning from Ring-3 (kernel32.dll) into Ring-0 via ntdll!NtCreateUserProcess, the Windows Executive builds the child process container in RAM.',
        technicalMechanism:
          'The kernel allocates the EPROCESS object for PID 4892, initializes its Process Environment Block (PEB at 0x7FFDF000), and maps svchost.exe at base address 0x00400000.',
        apiSignature: 'ntdll!NtCreateUserProcess -> EPROCESS [PID 4892] + PEB [ImageBase = 0x00400000]',
        kernelAndMemoryDelta: 'Kernel Object Created: EPROCESS (PID 4892) | Initial Mapping: 0x00400000 (SEC_IMAGE)',
        detectionEvidence: 'Kernel Process Creation Callback (PsSetCreateProcessNotifyRoutineEx) Triggered',
      },
      {
        id: '1C',
        stageNumber: 1,
        subStepIndex: 2,
        badgeLabel: '1C · CREATE_SUSPENDED (0x4)',
        videoTimestampRef: '01:59 – 02:09',
        headline: 'Freezing Primary Thread TID 4896 Before Entry Point Execution',
        clauseNumber: '#1.2',
        clauseTitle: 'Pre-Entry Thread Suspension (SuspendCount = 1)',
        narrativeSummary:
          'By passing dwCreationFlags = CREATE_SUSPENDED (0x00000004), the loader forces the kernel to halt TID 4896 inside ntdll!RtlUserThreadStart before a single instruction of svchost.exe runs.',
        technicalMechanism:
          'The kernel sets KTHREAD.SuspendCount = 1 on TID 4896. The legitimate Microsoft entry point (0x00412000) is parked in register RCX, but the CPU scheduler is locked out.',
        apiSignature: 'dwCreationFlags = CREATE_SUSPENDED (0x00000004) -> KTHREAD.SuspendCount = 1',
        kernelAndMemoryDelta: 'Primary Thread (TID 4896) State: STANDBY -> FROZEN / SUSPENDED (RCX = 0x00412000)',
        detectionEvidence: 'Missing -k Service Group Flag on CommandLine ("C:\\Windows\\System32\\svchost.exe")',
      },
      {
        id: '1D',
        stageNumber: 1,
        subStepIndex: 3,
        badgeLabel: '1D · HANDLE RETURN (0x01C4/0x01C8)',
        videoTimestampRef: '02:10 – 02:22',
        headline: 'Acquiring hProcess (0x01C4) & hThread (0x01C8) Full-Control Handles',
        clauseNumber: '#1.3',
        clauseTitle: 'PROCESS_INFORMATION Structure Population & Sysmon EID 1',
        narrativeSummary:
          'As CreateProcessW() returns to Invoice_Q4.exe, the kernel populates the PROCESS_INFORMATION struct with two privileged handles that grant total control over the suspended child process.',
        technicalMechanism:
          'hProcess = 0x01C4 grants PROCESS_ALL_ACCESS (0x1FFFFF) to unmap and overwrite PID 4892’s memory. hThread = 0x01C8 grants THREAD_ALL_ACCESS to rewrite TID 4896’s registers.',
        apiSignature: 'PROCESS_INFORMATION { hProcess: 0x01C4 (0x1FFFFF), hThread: 0x01C8, PID: 4892, TID: 4896 }',
        kernelAndMemoryDelta: 'Kernel Handles Acquired: hProcess = 0x01C4 (Full Control) | hThread = 0x01C8',
        detectionEvidence: 'SYSMON EVENT ID 1 · ProcessCreate: Invoice_Q4.exe -> svchost.exe (Missing -k flag)',
      },
    ],
  },
  {
    stageNumber: 2,
    stageCode: 'STAGE 02 · MEMORY UNMAPPING',
    title: 'PEB Base Address Discovery & Section Unmapping',
    subtitle:
      'Locating the target ImageBaseAddress via PEB+0x10 and hollowing out legitimate code sections',
    mitreCode: 'MITRE ATT&CK T1055.012 · STEP 2: HOLLOWING',
    videoRangeRef: '02:23 – 03:00',
    headerBannerLeft: 'HOST: WKS-04.corp.local | TARGET: svchost.exe [PID: 4892]',
    headerBannerRight: 'STATE: CREATE_SUSPENDED',
    storyAnalogy:
      'Using the master cabin key (hProcess = 0x01C4), the loader checks the truck’s manifest (PEB+0x10) to find the exact cargo bay coordinates (0x00400000), then strips out all legitimate seats and cargo so the interior becomes an empty void.',
    commandLine:
      'NtQueryInformationProcess(hProcess: 0x01C4, ProcessBasicInformation) -> ReadProcessMemory(PEB+0x10) -> NtUnmapViewOfSection(hProcess: 0x01C4, BaseAddress: 0x00400000)',
    defenseRuleTitle: 'NTDLL API Telemetry: Remote Section Unmapping of Primary Image Base',
    defenseRuleQuery:
      'api.name:"NtUnmapViewOfSection" AND process.name:"Invoice_Q4.exe" AND target.process.name:"svchost.exe" AND target.base_address:"0x00400000"',
    subSteps: [
      {
        id: '2A',
        stageNumber: 2,
        subStepIndex: 0,
        badgeLabel: '2A · PEB+0x10 QUERY',
        videoTimestampRef: '02:23 – 02:33',
        headline: 'Querying Target PEB+0x10 to Locate ImageBaseAddress (0x00400000)',
        clauseNumber: '#2.1',
        clauseTitle: 'NtQueryInformationProcess & Remote PEB Read',
        narrativeSummary:
          'Before the loader can hollow out svchost.exe, it queries PID 4892’s Process Environment Block (PEB) to find the exact base address where Windows loaded the binary.',
        technicalMechanism:
          'Using hProcess (0x01C4), Invoice_Q4.exe calls NtQueryInformationProcess to locate PebBaseAddress (0x7FFDF000) and reads 8 bytes at offset PEB+0x10 -> 0x00400000.',
        apiSignature: 'ReadProcessMemory(hProcess: 0x01C4, PEB+0x10) ──▶ ImageBaseAddress = 0x00400000',
        kernelAndMemoryDelta: 'PEB Offset +0x10 Resolved: Target ImageBaseAddress = 0x00400000',
        detectionEvidence: 'Cross-Process PEB Read: ReadProcessMemory on remote PebBaseAddress + 0x10',
      },
      {
        id: '2B',
        stageNumber: 2,
        subStepIndex: 1,
        badgeLabel: '2B · SIGNED PE SECTIONS',
        videoTimestampRef: '02:34 – 02:44',
        headline: 'Inspecting Legitimate Microsoft svchost.exe Sections at 0x00400000',
        clauseNumber: '#2.1',
        clauseTitle: 'SEC_IMAGE Virtual Address Descriptor Layout',
        narrativeSummary:
          'At 0x00400000, PID 4892 currently holds the signed svchost.exe sections (.text, .rdata, .data) backed by the legitimate file on disk.',
        technicalMechanism:
          'The kernel VAD tree marks 0x00400000 as SEC_IMAGE mapped to C:\\Windows\\System32\\svchost.exe with strict W^X page protections (.text = PAGE_EXECUTE_READ).',
        apiSignature: '0x00400000 [SEC_IMAGE]: PE Header + .text (RX) + .rdata (R) + .data (RW)',
        kernelAndMemoryDelta: 'Active Mapping: 0x00400000 – 0x00442000 Backed by FILE_OBJECT (svchost.exe)',
        detectionEvidence: 'Baseline VAD State: SEC_IMAGE Mapping Verified Against System32 Catalog',
      },
      {
        id: '2C',
        stageNumber: 2,
        subStepIndex: 2,
        badgeLabel: '2C · NTUNMAPVIEWOFSECTION',
        videoTimestampRef: '02:45 – 02:53',
        headline: 'Invoking NtUnmapViewOfSection(0x01C4, 0x00400000) to Strip Legitimate Code',
        clauseNumber: '#2.2',
        clauseTitle: 'Native Syscall Tear-Down of Target ImageBase',
        narrativeSummary:
          'Invoice_Q4.exe invokes ntdll!NtUnmapViewOfSection(hProcess = 0x01C4, BaseAddress = 0x00400000), commanding the kernel Memory Manager to eject svchost.exe’s code from RAM.',
        technicalMechanism:
          'The system call crosses into Ring-0 (MiUnmapViewOfSection) and tears down page table entries for .text, .rdata, and .data at 0x00400000 while keeping PID 4892 alive.',
        apiSignature: 'ntdll!NtUnmapViewOfSection(hProcess: 0x01C4, BaseAddress: 0x00400000)',
        kernelAndMemoryDelta: 'Ejecting Pages @ 0x00400000: .text, .rdata, .data Unmapping from PID 4892',
        detectionEvidence: 'NTDLL Hooking / ETW-Ti Alert: Remote Unmapping of Process Primary ImageBase',
      },
      {
        id: '2D',
        stageNumber: 2,
        subStepIndex: 3,
        badgeLabel: '2D · HOLLOWED MEMORY VOID',
        videoTimestampRef: '02:54 – 03:00',
        headline: 'STATUS_SUCCESS (0x00000000) — 0x00400000 Is Now an Unmapped Memory Void',
        clauseNumber: '#2.2',
        clauseTitle: 'SEC_IMAGE VAD Unlinked & Hollow Container Ready',
        narrativeSummary:
          'NtUnmapViewOfSection returns STATUS_SUCCESS (0x00000000). The svchost.exe process shell still exists in Windows, but its 0x00400000 base address is completely empty.',
        technicalMechanism:
          'The SEC_IMAGE VAD node for 0x00400000 is unlinked. PID 4892 is now a "hollowed" shell waiting for a replacement executable image to be mapped at 0x00400000.',
        apiSignature: 'Return: STATUS_SUCCESS (0x00000000) ──▶ 0x00400000 [UNMAPPED MEMORY VOID]',
        kernelAndMemoryDelta: '0x00400000 Transition: Microsoft Signed PE Sections -> UNMAPPED MEMORY VOID',
        detectionEvidence: 'VAD Anomaly: Primary ImageBaseAddress (0x00400000) Unmapped on Active Process',
      },
    ],
  },
  {
    stageNumber: 3,
    stageCode: 'STAGE 03 · RWX INJECTION',
    title: 'Memory Allocation & Cobalt Strike PE Injection',
    subtitle:
      'Committing RWX private memory at 0x00400000 and writing 270,336 bytes of Cobalt Strike Beacon directly into RAM',
    mitreCode: 'MITRE ATT&CK T1055.012 · STEP 3: ALLOCATION & INJECTION',
    videoRangeRef: '03:01 – 03:40',
    headerBannerLeft: 'T1055.012 PROCESS HOLLOWING',
    headerBannerRight: 'STEP 3: ALLOCATION & INJECTION',
    storyAnalogy:
      'Into the hollowed-out cargo bay at 0x00400000, the loader installs a new high-powered engine and hidden radio transmitter (the 264 KB Cobalt Strike Beacon PE), bolting every section directly into RAM without ever touching the hard drive.',
    commandLine:
      'VirtualAllocEx(0x01C4, 0x00400000, 0x42000, MEM_COMMIT|MEM_RESERVE, PAGE_EXECUTE_READWRITE) -> WriteProcessMemory(0x01C4, 0x00400000, pBeaconBuffer, 270336)',
    defenseRuleTitle: 'Sysmon Event ID 10: Cross-Process Access with GrantedAccess 0x1FFFFF',
    defenseRuleQuery:
      'event.code:"10" AND process.executable:"*\\Invoice_Q4.exe" AND target.process.executable:"C:\\Windows\\System32\\svchost.exe" AND winlog.event_data.GrantedAccess:"0x1fffff"',
    subSteps: [
      {
        id: '3A',
        stageNumber: 3,
        subStepIndex: 0,
        badgeLabel: '3A · VIRTUALALLOCEX (RWX)',
        videoTimestampRef: '03:01 – 03:11',
        headline: 'Re-Allocating 0x00400000 (264 KB) with PAGE_EXECUTE_READWRITE (0x40)',
        clauseNumber: '#3.1',
        clauseTitle: 'Private RWX VAD Reservation at Vacated ImageBase',
        narrativeSummary:
          'With 0x00400000 vacated, Invoice_Q4.exe calls VirtualAllocEx() to reserve and commit 264 KB (270,336 bytes) at the exact same base address inside svchost.exe.',
        technicalMechanism:
          'Reusing 0x00400000 avoids base relocation issues, but creates a MEM_PRIVATE region with simultaneous Read, Write, and Execute (PAGE_EXECUTE_READWRITE = 0x40) permissions.',
        apiSignature: 'VirtualAllocEx(0x01C4, Base: 0x00400000, 264KB, MEM_COMMIT|MEM_RESERVE, RWX [0x40])',
        kernelAndMemoryDelta: '0x00400000 Region: 264 KB (0x42000 Bytes) Committed as MEM_PRIVATE | RWX',
        detectionEvidence: 'ETW-Ti / Memory Sensor: Remote RWX Allocation at Process ImageBaseAddress',
      },
      {
        id: '3B',
        stageNumber: 3,
        subStepIndex: 1,
        badgeLabel: '3B · MZ / PE HEADER WRITE',
        videoTimestampRef: '03:12 – 03:22',
        headline: 'Streaming DOS "MZ" (4D 5A 90 00) & NT "PE" Headers into 0x00400000',
        clauseNumber: '#3.2',
        clauseTitle: 'WriteProcessMemory of Unpacked Beacon Headers',
        narrativeSummary:
          'Invoice_Q4.exe begins calling WriteProcessMemory(), streaming the first 4 KB containing the DOS header (4D 5A 90 00) and NT PE headers (50 45 00 00) into 0x00400000.',
        technicalMechanism:
          'The injected PE header defines AddressOfEntryPoint = 0x000014A0 (RVA), meaning the executable entry point inside svchost.exe now sits at 0x004014A0.',
        apiSignature: 'WriteProcessMemory(0x01C4, 0x00400000, "4D 5A 90 00 ... 50 45 00 00", 4096)',
        kernelAndMemoryDelta: 'Payload Stream: 94,618 / 270,336 Bytes (35%) | MZ & PE Headers Mapped @ 0x00400000',
        detectionEvidence: 'Unbacked Executable Header: "MZ" (4D 5A) Magic Bytes Found in MEM_PRIVATE Region',
      },
      {
        id: '3C',
        stageNumber: 3,
        subStepIndex: 2,
        badgeLabel: '3C · SECTION STREAM (264 KB)',
        videoTimestampRef: '03:23 – 03:32',
        headline: 'Committing All 270,336 Bytes (.text, .rdata, .data) of Cobalt Strike Beacon',
        clauseNumber: '#3.2',
        clauseTitle: 'Full In-Memory Beacon Section Population',
        narrativeSummary:
          'WriteProcessMemory() finishes streaming the Cobalt Strike .text shellcode, .rdata malleable C2 profile tables, and .data configuration blocks (270,336 bytes total).',
        technicalMechanism:
          '100% of the 264 KB Cobalt Strike Beacon payload is now resident inside svchost.exe’s volatile RAM with lpNumberOfBytesWritten = 270,336 and zero files written to disk.',
        apiSignature: 'WriteProcessMemory(0x01C4, 0x00401000..0x00442000, BeaconSections, 270,336 Bytes)',
        kernelAndMemoryDelta: 'Payload Committed: 270,336 Bytes / 264 KB (100%) | Entry RVA Ready @ 0x004014A0',
        detectionEvidence: 'Cross-Process Write Complete: 270,336 Bytes Written from PID 3104 into PID 4892',
      },
      {
        id: '3D',
        stageNumber: 3,
        subStepIndex: 3,
        badgeLabel: '3D · SYSMON EID 10 & VAD ALERT',
        videoTimestampRef: '03:33 – 03:40',
        headline: 'Sysmon Event ID 10 (GrantedAccess 0x1FFFFF) & Unbacked RWX VAD Detection',
        clauseNumber: '#3.2',
        clauseTitle: 'Forensic VAD Discrepancy & ProcessAccess Telemetry',
        narrativeSummary:
          'Memory scanners and Sysmon immediately flag two high-confidence anomalies: an unbacked MEM_PRIVATE RWX PE image at 0x00400000 and a cross-process 0x1FFFFF handle access.',
        technicalMechanism:
          'Legitimate binaries use file-backed SEC_IMAGE pages (.text = RX). Here, 0x00400000 is MEM_PRIVATE with RWX (0x40) permissions accessed by Invoice_Q4.exe with GrantedAccess = 0x1FFFFF.',
        apiSignature: 'Sysmon EID 10: Source=Invoice_Q4.exe (3104) -> Target=svchost.exe (4892) [0x1FFFFF]',
        kernelAndMemoryDelta: 'VAD Forensics: MEM_PRIVATE RWX (0x40) at 0x00400000 !== Disk SEC_IMAGE (0x20)',
        detectionEvidence: 'SYSMON EVENT ID 10 · ProcessAccess (0x1FFFFF) Invoice_Q4.exe (3104) -> svchost.exe (4892) @ 0x00400000',
      },
    ],
  },
  {
    stageNumber: 4,
    stageCode: 'STAGE 04 · THREAD HIJACK',
    title: 'Context Hijacking (RCX Redirect) & Thread Resumption',
    subtitle:
      'Repointing TID 4896’s RCX register from 0x00412000 to 0x004014A0 and waking the hollowed process',
    mitreCode: 'MITRE ATT&CK T1055.012 · STEP 4: EXECUTION HIJACK',
    videoRangeRef: '03:41 – 04:35',
    headerBannerLeft: 'TARGET PROCESS: svchost.exe (PID: 4892)',
    headerBannerRight: 'STATUS: HOLLOWED / SUSPENDED -> HIJACKED & EXECUTING',
    storyAnalogy:
      'Before releasing the parking brake, the loader reaches into the driver’s dashboard (TID 4896 CPU context), switches the GPS ignition target (RCX register) from the old unmapped bank route (0x00412000) to the new Cobalt Strike engine (0x004014A0), and releases the brake via ResumeThread.',
    commandLine:
      'GetThreadContext(hThread: 0x01C8, &ctx) -> ctx.Rcx = 0x004014A0 -> SetThreadContext(hThread: 0x01C8, &ctx) -> ResumeThread(hThread: 0x01C8)',
    defenseRuleTitle: 'Sysmon Event ID 25: Process Tampering (Image is Replaced)',
    defenseRuleQuery:
      'event.code:"25" AND process.executable:"C:\\Windows\\System32\\svchost.exe" AND winlog.event_data.Type:"Image is replaced"',
    subSteps: [
      {
        id: '4A',
        stageNumber: 4,
        subStepIndex: 0,
        badgeLabel: '4A · GETTHREADCONTEXT (0x01C8)',
        videoTimestampRef: '03:41 – 03:54',
        headline: 'Capturing Frozen Thread TID 4896 Registers Pointing to Stale Entry 0x00412000',
        clauseNumber: '#4.1',
        clauseTitle: 'Pre-Hijack CONTEXT_FULL Register Snapshot',
        narrativeSummary:
          'Even after the Cobalt Strike payload is written into 0x00400000, the frozen primary thread TID 4896 still holds the original svchost.exe entry point (0x00412000) in its RCX register.',
        technicalMechanism:
          'Invoice_Q4.exe calls GetThreadContext(hThread = 0x01C8, ContextFlags = CONTEXT_FULL) to retrieve TID 4896’s CPU register block while SuspendCount remains 1.',
        apiSignature: 'GetThreadContext(hThread: 0x01C8) ──▶ RCX = 0x00412000 [Unmapped] | SuspendCount = 1',
        kernelAndMemoryDelta: 'TID 4896 Pointer -> [ UNMAPPED MEMORY ] Old Entry: 0x00412000 | STATE: FROZEN',
        detectionEvidence: 'Thread Context Inspection: RCX Points to Unmapped Original EntryPoint (0x00412000)',
      },
      {
        id: '4B',
        stageNumber: 4,
        subStepIndex: 1,
        badgeLabel: '4B · SETTHREADCONTEXT (RCX)',
        videoTimestampRef: '03:55 – 04:10',
        headline: 'Overwriting RCX Register from 0x00412000 to Cobalt Strike Entry 0x004014A0',
        clauseNumber: '#4.2',
        clauseTitle: 'Surgical CPU Entry-Point Register Redirect',
        narrativeSummary:
          'The loader modifies ctx.Rcx = 0x004014A0 in the captured CONTEXT struct and invokes SetThreadContext(hThread = 0x01C8) to commit the hijacked register into the kernel.',
        technicalMechanism:
          'On 64-bit Windows, ntdll!RtlUserThreadStart stores the user image entry point in RCX. Overwriting RCX redirects TID 4896 straight onto the injected Beacon stager at 0x004014A0.',
        apiSignature: 'SetThreadContext(hThread: 0x01C8, ctx.Rcx = 0x004014A0) ──▶ STATUS_SUCCESS',
        kernelAndMemoryDelta: 'CPU Register Mutation: RCX 0x00412000 ──▶ 0x004014A0 (Cobalt Strike EntryPoint)',
        detectionEvidence: 'Cross-Process Thread Modification: SetThreadContext Targeting Remote Primary Thread',
      },
      {
        id: '4C',
        stageNumber: 4,
        subStepIndex: 2,
        badgeLabel: '4C · RESUMETHREAD (WAKE)',
        videoTimestampRef: '04:11 – 04:23',
        headline: 'Calling ResumeThread(0x01C8) — SuspendCount Drops (1 -> 0) & Beacon Executes',
        clauseNumber: '#4.2',
        clauseTitle: 'Kernel Scheduler Release & In-Memory Execution',
        narrativeSummary:
          'Invoice_Q4.exe calls ResumeThread(hThread = 0x01C8), decrementing KTHREAD.SuspendCount from 1 to 0 and releasing TID 4896 onto the CPU scheduler.',
        technicalMechanism:
          'TID 4896 wakes up inside PID 4892 and immediately jumps to RCX = 0x004014A0, executing the Cobalt Strike Beacon under the trusted svchost.exe process identity.',
        apiSignature: 'ResumeThread(hThread: 0x01C8) ──▶ SuspendCount: 1 -> 0 | State: RUNNING',
        kernelAndMemoryDelta: 'RCX: 0x004014A0 | SuspendCount: 0 | STATUS: HIJACKED & EXECUTING',
        detectionEvidence: 'Thread Start Address Anomaly: Execution Begins Inside Unbacked MEM_PRIVATE RWX Page',
      },
      {
        id: '4D',
        stageNumber: 4,
        subStepIndex: 3,
        badgeLabel: '4D · SYSMON EID 25 TAMPERING',
        videoTimestampRef: '04:24 – 04:35',
        headline: 'Windows Kernel Emits Sysmon Event ID 25: ProcessTampering (Image is replaced)',
        clauseNumber: '#4.2',
        clauseTitle: 'High-Confidence Kernel Process Tampering Telemetry',
        narrativeSummary:
          'As the hollowed thread begins executing at 0x004014A0, Windows kernel process-tampering callbacks detect that PID 4892’s original image mapping was replaced.',
        technicalMechanism:
          'Sysmon logs Event ID 25 (ProcessTampering) with Type = "Image is replaced" for C:\\Windows\\System32\\svchost.exe (PID 4892), providing definitive forensic proof of hollowing.',
        apiSignature: 'Sysmon Event ID 25: Process="C:\\Windows\\System32\\svchost.exe" [4892] Type="Image is replaced"',
        kernelAndMemoryDelta: 'RCX: 0x004014A0 | SuspendCount: 0 | Sensor: SYSMON EID 25 FIRED',
        detectionEvidence: 'SYSMON EVENT ID 25 · ProcessTampering (Image is replaced) on svchost.exe [PID 4892]',
      },
    ],
  },
  {
    stageNumber: 5,
    stageCode: 'STAGE 05 · C2 BEACON & FFT',
    title: 'Firewall Evasion & Periodic HTTPS C2 Beaconing',
    subtitle:
      'Bypassing perimeter process inspection as trusted svchost.exe while SIEM FFT exposes the 60s heartbeat',
    mitreCode: 'MITRE ATT&CK T1071.001 / T1573.002 · STEP 5: C2 CHANNEL',
    videoRangeRef: '04:36 – 06:07',
    headerBannerLeft: 'SOURCE: WKS-04.corp.local (10.10.4.15 · svchost.exe [4892])',
    headerBannerRight: 'DESTINATION: 185.220.101.42:443 (TLS 1.3)',
    storyAnalogy:
      'The hijacked armored truck rolls smoothly past the perimeter checkpoint because guards only check the outer license plate (svchost.exe [TRUSTED] -> PASS). However, a traffic analyst watching the highway notices the truck sends an identical encrypted pulse every 60 seconds like clockwork.',
    commandLine:
      'svchost.exe (PID 4892) -> TCP/443 TLS 1.3 -> 185.220.101.42:443 (GET /jquery-3.3.1.min.js | Interval: 60s ± 20% Jitter)',
    defenseRuleTitle: 'Sysmon Event ID 3 + SIEM Fast Fourier Transform (FFT) Beacon Periodicity',
    defenseRuleQuery:
      'event.code:"3" AND process.executable:"C:\\Windows\\System32\\svchost.exe" AND destination.ip:"185.220.101.42" AND destination.port:443',
    subSteps: [
      {
        id: '5A',
        stageNumber: 5,
        subStepIndex: 0,
        badgeLabel: '5A · EDGE FIREWALL BYPASS',
        videoTimestampRef: '04:36 – 04:55',
        headline: 'Perimeter Firewall Approves Outbound TLS 1.3 Socket from Trusted svchost.exe',
        clauseNumber: '#5.1',
        clauseTitle: 'Application-Aware Host & Edge Firewall Evasion',
        narrativeSummary:
          'Now running inside PID 4892, the Cobalt Strike Beacon initializes WinHTTP to open an encrypted TLS 1.3 session from 10.10.4.15:52844 to external C2 server 185.220.101.42:443.',
        technicalMechanism:
          'When the host/edge firewall inspects the owning process path, it sees C:\\Windows\\System32\\svchost.exe signed by Microsoft and evaluates the policy rule as [TRUSTED] -> PASS.',
        apiSignature: 'Outbound TLS 1.3: 10.10.4.15:52844 (svchost.exe [4892]) ──▶ 185.220.101.42:443 [PASS]',
        kernelAndMemoryDelta: 'EDGE FIREWALL / DMZ INSPECT: svchost.exe [TRUSTED] -> PASS',
        detectionEvidence: 'SYSMON EVENT ID 3 · svchost.exe [PID 4892] -> 185.220.101.42:443 (Edge Firewall: PASS)',
      },
      {
        id: '5B',
        stageNumber: 5,
        subStepIndex: 1,
        badgeLabel: '5B · MALLEABLE C2 PROFILE',
        videoTimestampRef: '04:56 – 05:18',
        headline: 'Disguising C2 Traffic as GET /jquery-3.3.1.min.js Over TLS 1.3',
        clauseNumber: '#5.1',
        clauseTitle: 'Malleable HTTP Header & JA3 Fingerprint Camouflage',
        narrativeSummary:
          'To blend into normal enterprise web traffic, the Cobalt Strike Beacon wraps its encrypted metadata inside a Malleable C2 HTTP profile mimicking a jQuery CDN request.',
        technicalMechanism:
          'Each check-in sends HTTP/1.1 GET /jquery-3.3.1.min.js over TLS 1.3, but exhibits a characteristic WinHTTP TLS client fingerprint (JA3: 72a589da586844d7f0818ce684948eea) to an uncategorized IP.',
        apiSignature: 'GET /jquery-3.3.1.min.js | TLS 1.3 | JA3: 72a589da586844d7f0818ce684948eea',
        kernelAndMemoryDelta: 'Encrypted C2 Payload Camouflaged Inside Cookie & Static JS Response Body',
        detectionEvidence: 'JA3 + ASN Anomaly: svchost.exe Contacting Non-Microsoft IP 185.220.101.42:443',
      },
      {
        id: '5C',
        stageNumber: 5,
        subStepIndex: 2,
        badgeLabel: '5C · 60S HEARTBEAT TRAIN',
        videoTimestampRef: '05:19 – 05:42',
        headline: 'Time-Domain Beacon Pulses Every 60 Seconds (±20% Jitter)',
        clauseNumber: '#5.2',
        clauseTitle: 'Periodic Callback Cadence Across Time (t = 60s, 120s, 180s, 240s)',
        narrativeSummary:
          'Even with TLS encryption and 20% random sleep jitter (48s–72s intervals), the implanted Beacon must wake up on a regular schedule to poll 185.220.101.42:443 for operator commands.',
        technicalMechanism:
          'SIEM netflow and Sysmon EID 3 logs capture a rhythmic train of outbound TLS sessions from PID 4892 centered at t = 60s, 120s, 180s, and 240s.',
        apiSignature: 'Beacon Sleep Schedule: Δt = 60s ± 20% Jitter (t = 60s, 120s, 180s, 240s)',
        kernelAndMemoryDelta: 'Time-Series Cadence: 4 Consecutive Heartbeat Bursts Recorded on Port 443',
        detectionEvidence: 'Time-Series Beacon Hunter: Low Coefficient of Variation on Inter-Arrival Times',
      },
      {
        id: '5D',
        stageNumber: 5,
        subStepIndex: 3,
        badgeLabel: '5D · SIEM FFT SPECTRUM LOCK',
        videoTimestampRef: '05:43 – 06:07',
        headline: 'Fast Fourier Transform (FFT) Locks onto 0.0167 Hz Beacon Peak',
        clauseNumber: '#5.2',
        clauseTitle: 'Frequency-Domain Spectral Detection & Full Kill-Chain Triage',
        narrativeSummary:
          'Converting the outbound connection timestamps from the time domain into the frequency domain via Fast Fourier Transform (FFT) exposes a sharp spectral spike at f = 0.0167 Hz (1/60s).',
        technicalMechanism:
          'Random human browsing produces flat white noise in an FFT spectrum, whereas periodic C2 beaconing concentrates energy into a narrow fundamental frequency peak, triggering a high-severity SOC incident.',
        apiSignature: 'SIEM FFT Spectral Peak: f₀ = 0.0167 Hz (T = 60.0s) | SNR = +18.4 dB [CRITICAL]',
        kernelAndMemoryDelta: 'SIEM STATUS: FFT PERIODICITY MATCH @ t = 60s, 120s, 180s, 240s',
        detectionEvidence: 'SIEM FFT PERIODICITY MATCH · Correlated EID 1 + EID 10 + EID 25 + EID 3 Outbound Beacon',
      },
    ],
  },
];

export const ALL_PROCESS_HOLLOWING_SUBSTEPS: ProcessHollowingSubStepSpec[] =
  PROCESS_HOLLOWING_SCROLL_CHAPTERS.flatMap((chapter) => chapter.subSteps);

export function clampUnitProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function getChapterByStage(stageNumber: number): ProcessHollowingChapterSpec {
  const found = PROCESS_HOLLOWING_SCROLL_CHAPTERS.find(
    (chapter) => chapter.stageNumber === stageNumber
  );
  return found ?? PROCESS_HOLLOWING_SCROLL_CHAPTERS[0];
}

export function getSubStepById(
  subStepId: ProcessHollowingSubStepId
): ProcessHollowingSubStepSpec {
  const found = ALL_PROCESS_HOLLOWING_SUBSTEPS.find((item) => item.id === subStepId);
  return found ?? ALL_PROCESS_HOLLOWING_SUBSTEPS[0];
}

export const PROCESS_HOLLOWING_CINEMATIC_SPECS: Record<
  ProcessHollowingSubStepId,
  ProcessHollowingSubStepCinematicSpec
> = {
  '0A': {
    subStepId: '0A',
    cameraMode: 'WIDE_KILLCHAIN_OVERVIEW',
    cameraLabel: 'CAM 00 · ENDPOINT TRUST BOUNDARY',
    primaryShapeId: 'shape-dropper-pid3104',
    secondaryShapeIds: ['shape-firewall-gate'],
    extractedTokens: [
      {
        token: 'Invoice_Q4.exe (PID 3104)',
        category: 'PROCESS',
        targetShapeId: 'shape-dropper-pid3104',
        motionCue: 'Untrusted user-mode loader executing from Downloads folder',
      },
      {
        token: 'No Authenticode Signature',
        category: 'DETECTION',
        targetShapeId: 'shape-dropper-pid3104',
        motionCue: 'Missing Microsoft catalog signature triggers EDR scrutiny',
      },
      {
        token: 'Edge Firewall BLOCK (TCP/443)',
        category: 'NETWORK',
        targetShapeId: 'shape-firewall-gate',
        motionCue: 'Direct outbound C2 socket rejected by application firewall',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Untrusted Loader Spawn',
        actorFrom: 'C:\\Users\\jdoe\\Downloads\\',
        actorTo: 'Invoice_Q4.exe (PID 3104)',
        vectorToken: 'Unsigned PE64 Execution',
        targetShapeId: 'shape-dropper-pid3104',
        mutationSummary: 'PID 3104 initializes in user space with UNTRUSTED integrity badge',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Direct Socket Probe Blocked',
        actorFrom: 'Invoice_Q4.exe (PID 3104)',
        actorTo: 'Edge Firewall Gate',
        vectorToken: 'connect(185.220.101.42:443) ──✕──▶ BLOCK',
        targetShapeId: 'shape-firewall-gate',
        mutationSummary: 'Host firewall rejects unsigned binary attempting outbound TLS 1.3',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Pivot to Process Hollowing',
        actorFrom: 'Invoice_Q4.exe (PID 3104)',
        actorTo: 'Internal Beacon Buffer (264 KB)',
        vectorToken: 'Stage T1055.012 Hollowing Plan',
        targetShapeId: 'shape-dropper-pid3104',
        mutationSummary: 'Loader locks 270,336-byte Cobalt Strike PE in local buffer for injection',
      },
    ],
  },
  '0B': {
    subStepId: '0B',
    cameraMode: 'WIDE_KILLCHAIN_OVERVIEW',
    cameraLabel: 'CAM 00 · TRUSTED VESSEL SELECTION',
    primaryShapeId: 'shape-svchost-outer-shell',
    secondaryShapeIds: ['shape-firewall-gate'],
    extractedTokens: [
      {
        token: 'C:\\Windows\\System32\\svchost.exe',
        category: 'PROCESS',
        targetShapeId: 'shape-svchost-outer-shell',
        motionCue: 'Legitimate Windows Service Host binary chosen as outer container',
      },
      {
        token: 'Microsoft Windows PCA Signed',
        category: 'PROCESS',
        targetShapeId: 'shape-svchost-outer-shell',
        motionCue: 'Emerald Authenticode trust shield verified on disk',
      },
      {
        token: 'Firewall Allowlisted Binary',
        category: 'NETWORK',
        targetShapeId: 'shape-firewall-gate',
        motionCue: 'Perimeter firewall permits outbound HTTPS from System32 svchost.exe',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Target Binary Selection',
        actorFrom: 'Invoice_Q4.exe (PID 3104)',
        actorTo: 'System32\\svchost.exe',
        vectorToken: 'Select Host Vessel: svchost.exe',
        targetShapeId: 'shape-svchost-outer-shell',
        mutationSummary: 'Target blueprint locks onto C:\\Windows\\System32\\svchost.exe',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Authenticode Shield Verification',
        actorFrom: 'Windows Catalog Verifier',
        actorTo: 'svchost.exe Outer Shell',
        vectorToken: 'Publisher: Microsoft Windows [VERIFIED]',
        targetShapeId: 'shape-svchost-outer-shell',
        mutationSummary: 'Outer container illuminates with emerald Microsoft Authenticode shield',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Firewall Trust Preview',
        actorFrom: 'svchost.exe Outer Shell',
        actorTo: 'Edge Firewall Gate',
        vectorToken: 'Policy Check: ALLOW TCP/443',
        targetShapeId: 'shape-firewall-gate',
        mutationSummary: 'Firewall checkpoint pre-approves traffic originating from signed svchost.exe',
      },
    ],
  },
  '0C': {
    subStepId: '0C',
    cameraMode: 'WIDE_KILLCHAIN_OVERVIEW',
    cameraLabel: 'CAM 00 · DISK VS. RAM DUALITY',
    primaryShapeId: 'shape-ram-0x00400000',
    secondaryShapeIds: ['shape-svchost-outer-shell', 'shape-vad-tree-monitor'],
    extractedTokens: [
      {
        token: 'NTFS Disk: Clean svchost.exe',
        category: 'PROCESS',
        targetShapeId: 'shape-svchost-outer-shell',
        motionCue: 'On-disk executable in System32 is never altered',
      },
      {
        token: 'Volatile RAM @ 0x00400000',
        category: 'MEMORY',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: 'In-memory virtual address space where legitimate code is swapped',
      },
      {
        token: 'SEC_IMAGE -> MEM_PRIVATE RWX',
        category: 'DETECTION',
        targetShapeId: 'shape-vad-tree-monitor',
        motionCue: 'Kernel VAD tree divergence between disk image and private RAM',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'On-Disk File Integrity Preserved',
        actorFrom: 'NTFS C:\\Windows\\System32\\',
        actorTo: 'svchost.exe Outer Shell',
        vectorToken: 'SHA-256 Clean · Disk Untouched',
        targetShapeId: 'shape-svchost-outer-shell',
        mutationSummary: 'Static antivirus file scan sees 100% genuine Microsoft binary on disk',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'In-Memory Cavity Swap Preview',
        actorFrom: 'svchost.exe RAM (0x00400000)',
        actorTo: 'Cobalt Strike Beacon (264 KB)',
        vectorToken: 'Eject SEC_IMAGE -> Inject Beacon PE',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'Inner 0x00400000 rack lifts out legitimate code and slots in crimson Beacon PE',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'VAD Divergence Exposed',
        actorFrom: '0x00400000 RAM Rack',
        actorTo: 'Kernel VAD Tree Monitor',
        vectorToken: 'Disk !== RAM Divergence',
        targetShapeId: 'shape-vad-tree-monitor',
        mutationSummary: 'VAD Inspector highlights mismatch between signed outer shell and RWX inner core',
      },
    ],
  },
  '0D': {
    subStepId: '0D',
    cameraMode: 'WIDE_KILLCHAIN_OVERVIEW',
    cameraLabel: 'CAM 00 · 5-STAGE KILL-CHAIN & TELEMETRY MAP',
    primaryShapeId: 'shape-sysmon-sensor-hud',
    secondaryShapeIds: [
      'shape-kernel-ring0-bridge',
      'shape-ram-0x00400000',
      'shape-thread-tid4896',
      'shape-fft-spectrum-panel',
    ],
    extractedTokens: [
      {
        token: 'CreateProcessW -> NtUnmapViewOfSection',
        category: 'SYSCALL',
        targetShapeId: 'shape-kernel-ring0-bridge',
        motionCue: 'Stages 1 & 2: Spawn suspended container and unmap 0x00400000',
      },
      {
        token: 'VirtualAllocEx -> WriteProcessMemory',
        category: 'MEMORY',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: 'Stage 3: Allocate RWX buffer and stream 270,336-byte Beacon PE',
      },
      {
        token: 'SetThreadContext (RCX -> 0x004014A0)',
        category: 'REGISTER',
        targetShapeId: 'shape-thread-tid4896',
        motionCue: 'Stage 4: Redirect suspended thread entry point and resume execution',
      },
      {
        token: 'Sysmon EID 1 + 10 + 25 + 3 + FFT',
        category: 'DETECTION',
        targetShapeId: 'shape-sysmon-sensor-hud',
        motionCue: 'Full deterministic defender telemetry correlation chain',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Stages 1–3 Syscall Pipeline',
        actorFrom: 'PID 3104 Loader',
        actorTo: '0x00400000 RAM Rack',
        vectorToken: 'Spawn (0x4) -> Unmap -> Write 264 KB',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'Kill-chain stations ①, ②, and ③ illuminate along the top architecture bus',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Stages 4–5 Execution & C2 Pipeline',
        actorFrom: 'TID 4896 RCX Register',
        actorTo: '185.220.101.42:443 C2',
        vectorToken: 'RCX=0x004014A0 -> Resume -> TLS 1.3',
        targetShapeId: 'shape-thread-tid4896',
        mutationSummary: 'Stations ④ and ⑤ link CPU register hijack to outbound Malleable HTTPS stream',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: '4-Sensor Telemetry Lock',
        actorFrom: 'Kernel & Network Sensors',
        actorTo: 'Sysmon & SIEM FFT HUD',
        vectorToken: 'EID 1 -> EID 10 -> EID 25 -> EID 3 + FFT',
        targetShapeId: 'shape-sysmon-sensor-hud',
        mutationSummary: 'All 4 Sysmon Event IDs and the 0.0167 Hz FFT detector arm across the timeline',
      },
    ],
  },
  '1A': {
    subStepId: '1A',
    cameraMode: 'KERNEL_SPAWN_TWO_SHOT',
    cameraLabel: 'CAM 01 · WIN32 CREATEPROCESSW DISPATCH',
    primaryShapeId: 'shape-dropper-pid3104',
    secondaryShapeIds: ['shape-kernel-ring0-bridge'],
    extractedTokens: [
      {
        token: 'Invoice_Q4.exe (PID 3104)',
        category: 'PROCESS',
        targetShapeId: 'shape-dropper-pid3104',
        motionCue: 'Non-services parent initiating child process creation',
      },
      {
        token: 'CreateProcessW("...\\svchost.exe")',
        category: 'SYSCALL',
        targetShapeId: 'shape-kernel-ring0-bridge',
        motionCue: 'Win32 API call crossing Ring-3 into ntdll.dll',
      },
      {
        token: 'Parent != services.exe (PID 628)',
        category: 'DETECTION',
        targetShapeId: 'shape-sysmon-sensor-hud',
        motionCue: 'Process lineage anomaly: user dropper spawning system service host',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Prepare STARTUPINFOW & Structs',
        actorFrom: 'Invoice_Q4.exe (PID 3104)',
        actorTo: 'Local Stack Frame',
        vectorToken: 'ZeroMemory(&si, &pi)',
        targetShapeId: 'shape-dropper-pid3104',
        mutationSummary: 'Loader prepares STARTUPINFOW and empty PROCESS_INFORMATION receiver slots',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Dispatch CreateProcessW()',
        actorFrom: 'Invoice_Q4.exe (PID 3104)',
        actorTo: 'Ring-3 / Ring-0 Syscall Gate',
        vectorToken: 'CreateProcessW("C:\\Windows\\System32\\svchost.exe")',
        targetShapeId: 'shape-kernel-ring0-bridge',
        mutationSummary: 'Amber syscall packet travels along the upper conduit into kernel32/ntdll',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Lineage Sensor Observation',
        actorFrom: 'Ring-0 Process Manager',
        actorTo: 'Sysmon Lineage Tracker',
        vectorToken: 'ParentPID=3104 -> Target=svchost.exe',
        targetShapeId: 'shape-sysmon-sensor-hud',
        mutationSummary: 'Sensor flags anomalous parent Invoice_Q4.exe instead of services.exe',
      },
    ],
  },
  '1B': {
    subStepId: '1B',
    cameraMode: 'KERNEL_SPAWN_TWO_SHOT',
    cameraLabel: 'CAM 01 · RING-0 EPROCESS & PEB ALLOCATION',
    primaryShapeId: 'shape-svchost-outer-shell',
    secondaryShapeIds: [
      'shape-kernel-ring0-bridge',
      'shape-peb-0x7ffdf000',
      'shape-ram-0x00400000',
    ],
    extractedTokens: [
      {
        token: 'ntdll!NtCreateUserProcess',
        category: 'SYSCALL',
        targetShapeId: 'shape-kernel-ring0-bridge',
        motionCue: 'Ring-0 executive syscall instantiating child process object',
      },
      {
        token: 'EPROCESS [PID 4892]',
        category: 'PROCESS',
        targetShapeId: 'shape-svchost-outer-shell',
        motionCue: 'Kernel executive process block allocated for svchost.exe',
      },
      {
        token: 'PEB @ 0x7FFDF000',
        category: 'MEMORY',
        targetShapeId: 'shape-peb-0x7ffdf000',
        motionCue: 'Process Environment Block initialized with ImageBaseAddress',
      },
      {
        token: '0x00400000 [SEC_IMAGE]',
        category: 'MEMORY',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: 'Legitimate signed svchost.exe sections mapped into base memory',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Ring-0 Executive Transition',
        actorFrom: 'ntdll.dll (Ring-3)',
        actorTo: 'ntoskrnl.exe (Ring-0)',
        vectorToken: 'syscall -> NtCreateUserProcess',
        targetShapeId: 'shape-kernel-ring0-bridge',
        mutationSummary: 'CPU transitions to Ring-0 to construct the new process address space',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Allocate EPROCESS & PEB',
        actorFrom: 'Windows Kernel Executive',
        actorTo: 'svchost.exe (PID 4892)',
        vectorToken: 'EPROCESS [PID 4892] + PEB [0x7FFDF000]',
        targetShapeId: 'shape-peb-0x7ffdf000',
        mutationSummary: 'PID 4892 container and PEB control block materialize with emerald trust border',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Map Signed svchost.exe Sections',
        actorFrom: 'System32\\svchost.exe FileObject',
        actorTo: '0x00400000 Virtual Memory',
        vectorToken: 'MapViewOfSection(0x00400000, SEC_IMAGE)',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'Clean Microsoft .text (RX), .rdata (R), and .data (RW) map into 0x00400000',
      },
    ],
  },
  '1C': {
    subStepId: '1C',
    cameraMode: 'KERNEL_SPAWN_TWO_SHOT',
    cameraLabel: 'CAM 01 · PRE-ENTRY THREAD FREEZE (0x4)',
    primaryShapeId: 'shape-thread-tid4896',
    secondaryShapeIds: ['shape-svchost-outer-shell', 'shape-sysmon-sensor-hud'],
    extractedTokens: [
      {
        token: 'CREATE_SUSPENDED (0x00000004)',
        category: 'SYSCALL',
        targetShapeId: 'shape-thread-tid4896',
        motionCue: 'Creation flag instructing kernel to freeze primary thread before entry',
      },
      {
        token: 'TID 4896 (KTHREAD.SuspendCount = 1)',
        category: 'REGISTER',
        targetShapeId: 'shape-thread-tid4896',
        motionCue: 'Primary thread parked inside ntdll!RtlUserThreadStart',
      },
      {
        token: 'RCX = 0x00412000 (Original Entry)',
        category: 'REGISTER',
        targetShapeId: 'shape-thread-tid4896',
        motionCue: 'Legitimate svchost.exe entry point loaded in RCX but not yet executed',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Apply CREATE_SUSPENDED Bitmask',
        actorFrom: 'CreateProcessW Flags',
        actorTo: 'KTHREAD (TID 4896)',
        vectorToken: 'dwCreationFlags = 0x00000004',
        targetShapeId: 'shape-thread-tid4896',
        mutationSummary: 'Kernel intercepts thread startup before user-mode entry point execution',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Lock Thread at SuspendCount = 1',
        actorFrom: 'Kernel Scheduler',
        actorTo: 'TID 4896 Register Block',
        vectorToken: 'SuspendCount = 1 | RCX = 0x00412000',
        targetShapeId: 'shape-thread-tid4896',
        mutationSummary: 'TID 4896 freezes in cyan frost state at RtlUserThreadStart with RCX=0x00412000',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Flag Missing -k Service Group',
        actorFrom: 'PEB CommandLine',
        actorTo: 'Sysmon Sensor HUD',
        vectorToken: 'CmdLine: "svchost.exe" (No -k flag)',
        targetShapeId: 'shape-sysmon-sensor-hud',
        mutationSummary: 'Telemetry notes orphan svchost.exe spawned without -k <service_group>',
      },
    ],
  },
  '1D': {
    subStepId: '1D',
    cameraMode: 'KERNEL_SPAWN_TWO_SHOT',
    cameraLabel: 'CAM 01 · HANDLE RETURN & SYSMON EID 1',
    primaryShapeId: 'shape-dropper-pid3104',
    secondaryShapeIds: ['shape-svchost-outer-shell', 'shape-sysmon-sensor-hud'],
    extractedTokens: [
      {
        token: 'hProcess = 0x01C4 (0x1FFFFF)',
        category: 'HANDLE',
        targetShapeId: 'shape-dropper-pid3104',
        motionCue: 'PROCESS_ALL_ACCESS kernel handle returned to Invoice_Q4.exe',
      },
      {
        token: 'hThread = 0x01C8 (Full Control)',
        category: 'HANDLE',
        targetShapeId: 'shape-dropper-pid3104',
        motionCue: 'THREAD_ALL_ACCESS kernel handle enabling remote register rewrite',
      },
      {
        token: 'Sysmon EID 1 (ProcessCreate)',
        category: 'DETECTION',
        targetShapeId: 'shape-sysmon-sensor-hud',
        motionCue: 'Kernel process creation event logged with ParentImage=Invoice_Q4.exe',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Populate PROCESS_INFORMATION',
        actorFrom: 'Ring-0 Object Manager',
        actorTo: 'Return Conduit',
        vectorToken: '{ hProcess: 0x01C4, hThread: 0x01C8 }',
        targetShapeId: 'shape-svchost-outer-shell',
        mutationSummary: 'Kernel mints privileged handle descriptors 0x01C4 and 0x01C8 for PID 4892',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Return Master Keys to Loader',
        actorFrom: 'svchost.exe (PID 4892)',
        actorTo: 'Invoice_Q4.exe (PID 3104)',
        vectorToken: 'Return hProcess=0x01C4 | hThread=0x01C8',
        targetShapeId: 'shape-dropper-pid3104',
        mutationSummary: 'Cyan return pulses lock into Invoice_Q4.exe’s Acquired Kernel Handles vault',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Emit Sysmon Event ID 1',
        actorFrom: 'PsSetCreateProcessNotifyRoutineEx',
        actorTo: 'Sysmon Telemetry HUD',
        vectorToken: 'SYSMON EID 1: 3104 -> 4892',
        targetShapeId: 'shape-sysmon-sensor-hud',
        mutationSummary: 'Sysmon Event ID 1 badge latches active in the bottom forensic status bar',
      },
    ],
  },
  '2A': {
    subStepId: '2A',
    cameraMode: 'PEB_UNMAP_MACRO',
    cameraLabel: 'CAM 02 · REMOTE PEB+0x10 BASE DISCOVERY',
    primaryShapeId: 'shape-peb-0x7ffdf000',
    secondaryShapeIds: ['shape-dropper-pid3104', 'shape-ram-0x00400000'],
    extractedTokens: [
      {
        token: 'NtQueryInformationProcess(0x01C4)',
        category: 'SYSCALL',
        targetShapeId: 'shape-kernel-ring0-bridge',
        motionCue: 'Queries ProcessBasicInformation to locate remote PebBaseAddress',
      },
      {
        token: 'PEB+0x10 (0x7FFDF010)',
        category: 'MEMORY',
        targetShapeId: 'shape-peb-0x7ffdf000',
        motionCue: '8-byte pointer inside PEB holding target ImageBaseAddress',
      },
      {
        token: 'ImageBaseAddress = 0x00400000',
        category: 'MEMORY',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: 'Resolved starting virtual address of svchost.exe in RAM',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Query Remote PebBaseAddress',
        actorFrom: 'Invoice_Q4.exe (0x01C4)',
        actorTo: 'PEB @ 0x7FFDF000',
        vectorToken: 'NtQueryInformationProcess(ProcessBasicInformation)',
        targetShapeId: 'shape-peb-0x7ffdf000',
        mutationSummary: 'Loader uses handle 0x01C4 to locate PID 4892’s PEB at 0x7FFDF000',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Read 8 Bytes at PEB+0x10',
        actorFrom: 'PEB @ 0x7FFDF000',
        actorTo: 'PEB+0x10 Slot',
        vectorToken: 'ReadProcessMemory(0x01C4, PEB+0x10, 8)',
        targetShapeId: 'shape-peb-0x7ffdf000',
        mutationSummary: 'Scanner beam illuminates offset +0x10 inside the PEB structure',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Lock Target Base 0x00400000',
        actorFrom: 'PEB+0x10 Slot',
        actorTo: '0x00400000 RAM Rack',
        vectorToken: 'Resolved Base = 0x00400000',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'Base coordinate 0x00400000 locks into the unmapping targeting reticle',
      },
    ],
  },
  '2B': {
    subStepId: '2B',
    cameraMode: 'PEB_UNMAP_MACRO',
    cameraLabel: 'CAM 02 · LEGITIMATE SEC_IMAGE PE LAYOUT',
    primaryShapeId: 'shape-ram-0x00400000',
    secondaryShapeIds: ['shape-vad-tree-monitor', 'shape-svchost-outer-shell'],
    extractedTokens: [
      {
        token: '.text (RX) / .rdata (R) / .data (RW)',
        category: 'MEMORY',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: 'Legitimate Microsoft-signed svchost.exe code and data sections',
      },
      {
        token: 'SEC_IMAGE (File-Backed VAD)',
        category: 'MEMORY',
        targetShapeId: 'shape-vad-tree-monitor',
        motionCue: 'Kernel VAD node backed by C:\\Windows\\System32\\svchost.exe',
      },
      {
        token: '0x00400000 – 0x00442000',
        category: 'MEMORY',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: 'Virtual address range currently occupied by clean svchost.exe',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Zoom into 0x00400000 Memory Rack',
        actorFrom: 'Camera Lens',
        actorTo: '0x00400000 Virtual Address Space',
        vectorToken: 'Inspect VAD 0x00400000..0x00442000',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'Macro lens reveals the internal section anatomy of suspended svchost.exe',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Verify Signed Section Protections',
        actorFrom: '0x00400000 Memory Rack',
        actorTo: 'Section Slots (.text, .rdata, .data)',
        vectorToken: 'PE Header + .text [RX] + .rdata [R] + .data [RW]',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'Each legitimate section block glows emerald under W^X SEC_IMAGE protection',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Confirm FILE_OBJECT Backing',
        actorFrom: 'MMVAD Node',
        actorTo: 'System32\\svchost.exe Disk Image',
        vectorToken: 'VAD Type: SEC_IMAGE (Catalog Verified)',
        targetShapeId: 'shape-vad-tree-monitor',
        mutationSummary: 'VAD Monitor shows clean file-backed mapping prior to unmapping syscall',
      },
    ],
  },
  '2C': {
    subStepId: '2C',
    cameraMode: 'PEB_UNMAP_MACRO',
    cameraLabel: 'CAM 02 · NTDLL!NTUNMAPVIEWOFSECTION SYSCALL',
    primaryShapeId: 'shape-kernel-ring0-bridge',
    secondaryShapeIds: ['shape-ram-0x00400000', 'shape-dropper-pid3104'],
    extractedTokens: [
      {
        token: 'ntdll!NtUnmapViewOfSection',
        category: 'SYSCALL',
        targetShapeId: 'shape-kernel-ring0-bridge',
        motionCue: 'Native syscall tearing down mapped section view in remote process',
      },
      {
        token: 'hProcess = 0x01C4, Base = 0x00400000',
        category: 'HANDLE',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: 'Target process handle and base coordinate passed to MiUnmapViewOfSection',
      },
      {
        token: 'Ejecting .text / .rdata / .data',
        category: 'MEMORY',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: 'Page Table Entries (PTEs) for legitimate svchost.exe stripped from RAM',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Invoke NtUnmapViewOfSection',
        actorFrom: 'Invoice_Q4.exe (PID 3104)',
        actorTo: 'ntdll.dll Syscall Bridge',
        vectorToken: 'NtUnmapViewOfSection(0x01C4, 0x00400000)',
        targetShapeId: 'shape-kernel-ring0-bridge',
        mutationSummary: 'Loader fires high-priority unmap syscall targeting PID 4892 base address',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Ring-0 MiUnmapViewOfSection Tear-Down',
        actorFrom: 'Windows Memory Manager',
        actorTo: '0x00400000 Page Tables',
        vectorToken: 'Unlink SEC_IMAGE VAD & Flush PTEs',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'Kernel severs the FILE_OBJECT link and invalidates 0x00400000 page entries',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Eject Legitimate PE Sections',
        actorFrom: '0x00400000 RAM Rack',
        actorTo: 'Unmapped Page Pool',
        vectorToken: 'Strip .text, .rdata, .data Pages',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'Legitimate Microsoft code blocks dissolve and eject out of the memory rack',
      },
    ],
  },
  '2D': {
    subStepId: '2D',
    cameraMode: 'PEB_UNMAP_MACRO',
    cameraLabel: 'CAM 02 · HOLLOWED VIRTUAL ADDRESS CAVITY',
    primaryShapeId: 'shape-ram-0x00400000',
    secondaryShapeIds: ['shape-svchost-outer-shell', 'shape-vad-tree-monitor'],
    extractedTokens: [
      {
        token: 'STATUS_SUCCESS (0x00000000)',
        category: 'SYSCALL',
        targetShapeId: 'shape-kernel-ring0-bridge',
        motionCue: 'Kernel confirms complete unmapping of primary image section',
      },
      {
        token: '0x00400000 [UNMAPPED MEMORY VOID]',
        category: 'MEMORY',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: 'Vacated hollow cavity inside PID 4892 awaiting replacement payload',
      },
      {
        token: 'Outer svchost.exe Shell Alive',
        category: 'PROCESS',
        targetShapeId: 'shape-svchost-outer-shell',
        motionCue: 'Process container retains PID 4892 and Microsoft identity despite empty RAM',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Return STATUS_SUCCESS (0x0)',
        actorFrom: 'ntdll!NtUnmapViewOfSection',
        actorTo: 'Invoice_Q4.exe (PID 3104)',
        vectorToken: 'NTSTATUS = 0x00000000 (STATUS_SUCCESS)',
        targetShapeId: 'shape-kernel-ring0-bridge',
        mutationSummary: 'Syscall returns success confirming 0x00400000 is now completely unmapped',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Hollow Cavity Formed at 0x00400000',
        actorFrom: '0x00400000 Memory Rack',
        actorTo: 'MEM_FREE Void',
        vectorToken: '[ UNMAPPED MEMORY VOID · 0x00400000 ]',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: '0x00400000 turns into a dark dashed wireframe cavity with zero mapped pages',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Dual-Layer Hollow Vessel Ready',
        actorFrom: 'svchost.exe Outer Shell',
        actorTo: 'Kernel VAD Monitor',
        vectorToken: 'Outer Shell: SIGNED | Inner Core: VOID',
        targetShapeId: 'shape-svchost-outer-shell',
        mutationSummary: 'PID 4892 stands as an authentic Microsoft shell wrapping an empty memory void',
      },
    ],
  },
  '3A': {
    subStepId: '3A',
    cameraMode: 'RWX_HEX_INJECTION_MACRO',
    cameraLabel: 'CAM 03 · VIRTUALALLOCEX RWX COMMITMENT',
    primaryShapeId: 'shape-ram-0x00400000',
    secondaryShapeIds: ['shape-vad-tree-monitor', 'shape-dropper-pid3104'],
    extractedTokens: [
      {
        token: 'VirtualAllocEx(0x01C4, 0x00400000, 264KB)',
        category: 'SYSCALL',
        targetShapeId: 'shape-kernel-ring0-bridge',
        motionCue: 'Allocates 270,336 bytes (0x42000) at the vacated 0x00400000 base',
      },
      {
        token: 'MEM_COMMIT | MEM_RESERVE (0x3000)',
        category: 'MEMORY',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: 'Commits private physical RAM pages into the hollowed cavity',
      },
      {
        token: 'PAGE_EXECUTE_READWRITE (0x40 / RWX)',
        category: 'MEMORY',
        targetShapeId: 'shape-vad-tree-monitor',
        motionCue: 'Grants simultaneous Read, Write, and Execute permissions',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Dispatch VirtualAllocEx()',
        actorFrom: 'Invoice_Q4.exe (PID 3104)',
        actorTo: '0x00400000 Hollow Void',
        vectorToken: 'VirtualAllocEx(0x01C4, 0x00400000, 0x42000, 0x3000, 0x40)',
        targetShapeId: 'shape-kernel-ring0-bridge',
        mutationSummary: 'Loader requests 264 KB of private memory at exact base 0x00400000',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Ignite Crimson RWX Buffer',
        actorFrom: 'Windows Memory Manager',
        actorTo: '0x00400000 RAM Rack',
        vectorToken: 'Commit 270,336 Bytes [PAGE_EXECUTE_READWRITE]',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'Hollow cavity illuminates with crimson RWX border ready for raw PE injection',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Create MEM_PRIVATE VAD Node',
        actorFrom: '0x00400000 RAM Rack',
        actorTo: 'Kernel VAD Monitor',
        vectorToken: 'MMVAD: MEM_PRIVATE | RWX (0x40)',
        targetShapeId: 'shape-vad-tree-monitor',
        mutationSummary: 'Kernel links new private unbacked VAD node at 0x00400000',
      },
    ],
  },
  '3B': {
    subStepId: '3B',
    cameraMode: 'RWX_HEX_INJECTION_MACRO',
    cameraLabel: 'CAM 03 · WRITEPROCESSMEMORY MZ/PE HEADERS',
    primaryShapeId: 'shape-ram-0x00400000',
    secondaryShapeIds: ['shape-dropper-pid3104'],
    extractedTokens: [
      {
        token: 'WriteProcessMemory(0x01C4, 0x00400000)',
        category: 'SYSCALL',
        targetShapeId: 'shape-kernel-ring0-bridge',
        motionCue: 'Streams raw Cobalt Strike PE bytes across process boundary',
      },
      {
        token: '4D 5A 90 00 ("MZ" DOS Header)',
        category: 'MEMORY',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: 'Executable magic bytes written to base 0x00400000',
      },
      {
        token: '50 45 00 00 ("PE\\0\\0" NT Header)',
        category: 'MEMORY',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: '64-bit PE header defining AddressOfEntryPoint = 0x14A0',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Stream First 4 KB Header Packet',
        actorFrom: 'Invoice_Q4.exe Payload Buffer',
        actorTo: '0x00400000 Base Header Slot',
        vectorToken: 'WriteProcessMemory(0x01C4, 0x00400000, pHeaders, 4096)',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'First burst of crimson hex packets crosses the conduit into PID 4892',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Commit 4D 5A 90 00 & PE64 Headers',
        actorFrom: 'WriteProcessMemory Stream',
        actorTo: '0x00400000 Hex Matrix',
        vectorToken: '4D 5A 90 00 03 00 ... 50 45 00 00',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'Live hex matrix populates with MZ and PE64 headers (94,618 / 270,336 bytes)',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Define Entry RVA 0x000014A0',
        actorFrom: 'IMAGE_OPTIONAL_HEADER64',
        actorTo: '0x004014A0 Entry Slot',
        vectorToken: 'AddressOfEntryPoint = 0x14A0 -> 0x004014A0',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'PE header establishes new Beacon entry point at virtual address 0x004014A0',
      },
    ],
  },
  '3C': {
    subStepId: '3C',
    cameraMode: 'RWX_HEX_INJECTION_MACRO',
    cameraLabel: 'CAM 03 · 264 KB BEACON SECTION POPULATION',
    primaryShapeId: 'shape-ram-0x00400000',
    secondaryShapeIds: ['shape-dropper-pid3104'],
    extractedTokens: [
      {
        token: '270,336 Bytes / 264 KB (100%)',
        category: 'MEMORY',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: 'Complete Cobalt Strike Beacon image committed into volatile RAM',
      },
      {
        token: '.text Shellcode @ 0x00401000',
        category: 'MEMORY',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: 'Executable Beacon reflective loader and C2 tasking engine',
      },
      {
        token: '.rdata & .data C2 Config',
        category: 'MEMORY',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: 'Embedded Malleable C2 profile and target IP 185.220.101.42:443',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Stream .text Beacon Code',
        actorFrom: 'Invoice_Q4.exe (PID 3104)',
        actorTo: '0x00401000 (.text Section)',
        vectorToken: 'WriteProcessMemory(.text: FC 48 83 E4 F0 E8 C0)',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'Executable Cobalt Strike shellcode fills the .text section slot',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Stream .rdata & .data C2 Tables',
        actorFrom: 'Invoice_Q4.exe (PID 3104)',
        actorTo: '0x0042D000 (.rdata & .data)',
        vectorToken: 'WriteProcessMemory(270,336 / 270,336 Bytes · 100%)',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'Malleable C2 profile and encrypted sleep configuration reach 100% commitment',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Arm BeaconStart @ 0x004014A0',
        actorFrom: '0x00400000 RAM Rack',
        actorTo: '0x004014A0 Entry Point',
        vectorToken: 'Beacon Entry Armed @ 0x004014A0',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'All 264 KB of Cobalt Strike Beacon reside in RAM with zero disk footprint',
      },
    ],
  },
  '3D': {
    subStepId: '3D',
    cameraMode: 'RWX_HEX_INJECTION_MACRO',
    cameraLabel: 'CAM 03 · SYSMON EID 10 & VAD RWX ANOMALY',
    primaryShapeId: 'shape-vad-tree-monitor',
    secondaryShapeIds: ['shape-sysmon-sensor-hud', 'shape-ram-0x00400000'],
    extractedTokens: [
      {
        token: 'Sysmon EID 10 (GrantedAccess 0x1FFFFF)',
        category: 'DETECTION',
        targetShapeId: 'shape-sysmon-sensor-hud',
        motionCue: 'Cross-process full-access handle logged from PID 3104 to PID 4892',
      },
      {
        token: 'MEM_PRIVATE | RWX (Unbacked PE)',
        category: 'DETECTION',
        targetShapeId: 'shape-vad-tree-monitor',
        motionCue: 'MZ header inside private RWX memory without backing FILE_OBJECT',
      },
      {
        token: 'Volatility malfind / Moneta Match',
        category: 'DETECTION',
        targetShapeId: 'shape-vad-tree-monitor',
        motionCue: 'Memory forensics signature for hollowed primary image base',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Inspect Kernel MMVAD Node',
        actorFrom: 'Memory Forensics Scanner',
        actorTo: 'Kernel VAD Tree Monitor',
        vectorToken: 'Scan VAD @ 0x00400000 (PID 4892)',
        targetShapeId: 'shape-vad-tree-monitor',
        mutationSummary: 'Scanner compares PID 4892’s 0x00400000 VAD attributes against System32 disk file',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Flag Unbacked MEM_PRIVATE RWX',
        actorFrom: 'Kernel VAD Tree Monitor',
        actorTo: '0x00400000 RAM Rack',
        vectorToken: 'ALERT: MZ Header in MEM_PRIVATE | RWX (0x40)',
        targetShapeId: 'shape-vad-tree-monitor',
        mutationSummary: 'VAD Monitor flashes crimson: executable PE in private RWX memory has no disk backing',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Emit Sysmon Event ID 10',
        actorFrom: 'ObRegisterCallbacks Sensor',
        actorTo: 'Sysmon Telemetry HUD',
        vectorToken: 'SYSMON EID 10: GrantedAccess=0x1FFFFF',
        targetShapeId: 'shape-sysmon-sensor-hud',
        mutationSummary: 'Sysmon Event ID 10 latches onto the cross-process memory write handle',
      },
    ],
  },
  '4A': {
    subStepId: '4A',
    cameraMode: 'CPU_REGISTER_SWITCHBOARD',
    cameraLabel: 'CAM 04 · GETTHREADCONTEXT (TID 4896 SNAPSHOT)',
    primaryShapeId: 'shape-thread-tid4896',
    secondaryShapeIds: ['shape-dropper-pid3104', 'shape-ram-0x00400000'],
    extractedTokens: [
      {
        token: 'GetThreadContext(hThread: 0x01C8)',
        category: 'SYSCALL',
        targetShapeId: 'shape-thread-tid4896',
        motionCue: 'Reads x64 CONTEXT_FULL register block of frozen thread TID 4896',
      },
      {
        token: 'RCX = 0x00412000 (Stale Unmapped Entry)',
        category: 'REGISTER',
        targetShapeId: 'shape-thread-tid4896',
        motionCue: 'Register RCX still points to the old unmapped svchost.exe entry point',
      },
      {
        token: 'SuspendCount = 1 (FROZEN)',
        category: 'REGISTER',
        targetShapeId: 'shape-thread-tid4896',
        motionCue: 'Thread remains halted inside ntdll!RtlUserThreadStart',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Request CONTEXT_FULL via 0x01C8',
        actorFrom: 'Invoice_Q4.exe (PID 3104)',
        actorTo: 'TID 4896 Register Switchboard',
        vectorToken: 'GetThreadContext(0x01C8, CONTEXT_FULL)',
        targetShapeId: 'shape-thread-tid4896',
        mutationSummary: 'Loader queries the frozen CPU register state of primary thread TID 4896',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Inspect Stale RCX Pointer (0x00412000)',
        actorFrom: 'TID 4896 RCX Register',
        actorTo: 'Unmapped Old Entry (0x00412000)',
        vectorToken: 'RCX = 0x00412000 ──▶ [UNMAPPED MEMORY]',
        targetShapeId: 'shape-thread-tid4896',
        mutationSummary: 'Switchboard shows RCX pointing to dead address 0x00412000 from original svchost.exe',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Prepare Context Struct in Loader',
        actorFrom: 'TID 4896 Register Block',
        actorTo: 'Invoice_Q4.exe (PID 3104)',
        vectorToken: 'Copy CONTEXT_FULL Struct -> Local Buffer',
        targetShapeId: 'shape-dropper-pid3104',
        mutationSummary: 'Loader receives the register snapshot to overwrite ctx.Rcx in memory',
      },
    ],
  },
  '4B': {
    subStepId: '4B',
    cameraMode: 'CPU_REGISTER_SWITCHBOARD',
    cameraLabel: 'CAM 04 · SETTHREADCONTEXT RCX REDIRECT',
    primaryShapeId: 'shape-thread-tid4896',
    secondaryShapeIds: ['shape-ram-0x00400000', 'shape-kernel-ring0-bridge'],
    extractedTokens: [
      {
        token: 'SetThreadContext(hThread: 0x01C8)',
        category: 'SYSCALL',
        targetShapeId: 'shape-kernel-ring0-bridge',
        motionCue: 'Commits modified CPU register structure back into kernel KTHREAD',
      },
      {
        token: 'ctx.Rcx = 0x004014A0 (Beacon Entry)',
        category: 'REGISTER',
        targetShapeId: 'shape-thread-tid4896',
        motionCue: 'Overwrites RCX from 0x00412000 to Cobalt Strike entry point 0x004014A0',
      },
      {
        token: '0x00400000 + RVA 0x14A0',
        category: 'MEMORY',
        targetShapeId: 'shape-ram-0x00400000',
        motionCue: 'Execution vector locks onto injected Cobalt Strike .text stager',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Mutate ctx.Rcx = 0x004014A0',
        actorFrom: 'Invoice_Q4.exe (PID 3104)',
        actorTo: 'TID 4896 Register Switchboard',
        vectorToken: 'SetThreadContext(0x01C8, ctx.Rcx = 0x004014A0)',
        targetShapeId: 'shape-thread-tid4896',
        mutationSummary: 'Loader transmits modified CONTEXT struct across the kernel bridge',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Flip RCX Register Dial',
        actorFrom: 'RCX = 0x00412000 (Old)',
        actorTo: 'RCX = 0x004014A0 (New)',
        vectorToken: 'RCX: 0x00412000 ──▶ 0x004014A0',
        targetShapeId: 'shape-thread-tid4896',
        mutationSummary: 'RCX register dial physically flips from 0x00412000 to crimson 0x004014A0',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Lock Pointer Laser onto Beacon .text',
        actorFrom: 'TID 4896 RCX Register',
        actorTo: '0x004014A0 (Cobalt Strike .text)',
        vectorToken: 'Target Locked: Cobalt Strike EntryPoint',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'Execution pointer beam disconnects from dead void and locks onto 0x004014A0',
      },
    ],
  },
  '4C': {
    subStepId: '4C',
    cameraMode: 'CPU_REGISTER_SWITCHBOARD',
    cameraLabel: 'CAM 04 · RESUMETHREAD & SCHEDULER RELEASE',
    primaryShapeId: 'shape-thread-tid4896',
    secondaryShapeIds: ['shape-ram-0x00400000', 'shape-svchost-outer-shell'],
    extractedTokens: [
      {
        token: 'ResumeThread(hThread: 0x01C8)',
        category: 'SYSCALL',
        targetShapeId: 'shape-kernel-ring0-bridge',
        motionCue: 'Releases frozen primary thread onto the Windows CPU scheduler',
      },
      {
        token: 'SuspendCount: 1 -> 0',
        category: 'REGISTER',
        targetShapeId: 'shape-thread-tid4896',
        motionCue: 'Kernel decrements suspension counter, waking TID 4896',
      },
      {
        token: 'STATUS: HIJACKED & EXECUTING',
        category: 'PROCESS',
        targetShapeId: 'shape-svchost-outer-shell',
        motionCue: 'Cobalt Strike Beacon runs live inside signed svchost.exe (PID 4892)',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Invoke ResumeThread(0x01C8)',
        actorFrom: 'Invoice_Q4.exe (PID 3104)',
        actorTo: 'KTHREAD (TID 4896)',
        vectorToken: 'ResumeThread(hThread: 0x01C8)',
        targetShapeId: 'shape-thread-tid4896',
        mutationSummary: 'Wake pulse travels from loader to PID 4892’s primary thread',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Decrement SuspendCount 1 -> 0',
        actorFrom: 'KTHREAD.SuspendCount',
        actorTo: 'CPU Scheduler Queue',
        vectorToken: 'SuspendCount: 1 ──▶ 0 [RUNNING]',
        targetShapeId: 'shape-thread-tid4896',
        mutationSummary: 'Mechanical SuspendCount gauge drops to 0 and cyan freeze lock shatters',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Execute Beacon @ 0x004014A0',
        actorFrom: 'TID 4896 (RIP/RCX)',
        actorTo: '0x004014A0 Beacon Stager',
        vectorToken: 'jmp RCX (0x004014A0) -> Beacon Active',
        targetShapeId: 'shape-ram-0x00400000',
        mutationSummary: 'TID 4896 begins executing Cobalt Strike Beacon inside trusted svchost.exe',
      },
    ],
  },
  '4D': {
    subStepId: '4D',
    cameraMode: 'CPU_REGISTER_SWITCHBOARD',
    cameraLabel: 'CAM 04 · SYSMON EVENT ID 25 (PROCESS TAMPERING)',
    primaryShapeId: 'shape-sysmon-sensor-hud',
    secondaryShapeIds: ['shape-svchost-outer-shell', 'shape-thread-tid4896'],
    extractedTokens: [
      {
        token: 'Sysmon Event ID 25 (ProcessTampering)',
        category: 'DETECTION',
        targetShapeId: 'shape-sysmon-sensor-hud',
        motionCue: 'High-confidence kernel alert fired when hollowed thread resumes',
      },
      {
        token: 'Type: "Image is replaced"',
        category: 'DETECTION',
        targetShapeId: 'shape-sysmon-sensor-hud',
        motionCue: 'Kernel verifies primary image mapping no longer matches disk binary',
      },
      {
        token: 'svchost.exe [PID 4892] Compromised',
        category: 'PROCESS',
        targetShapeId: 'shape-svchost-outer-shell',
        motionCue: 'Outer identity remains svchost.exe while inner thread runs Beacon',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Kernel Image Verification Hook',
        actorFrom: 'TID 4896 Execution Start',
        actorTo: 'Windows Kernel Tampering Sensor',
        vectorToken: 'Verify Primary Image Mapping @ 0x00400000',
        targetShapeId: 'shape-sysmon-sensor-hud',
        mutationSummary: 'Kernel checks PID 4892 image backing as first user instruction dispatches',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Fire Sysmon EID 25 Alert',
        actorFrom: 'Sysmon Driver (SysmonDrv)',
        actorTo: 'Sysmon Telemetry HUD',
        vectorToken: 'SYSMON EID 25: Type="Image is replaced"',
        targetShapeId: 'shape-sysmon-sensor-hud',
        mutationSummary: 'Crimson Sysmon Event ID 25 badge locks into the forensic detection bar',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Dropper Cleanup & Autonomous Beacon',
        actorFrom: 'Invoice_Q4.exe (PID 3104)',
        actorTo: 'svchost.exe (PID 4892)',
        vectorToken: 'CloseHandle(0x01C4, 0x01C8) -> Autonomous C2',
        targetShapeId: 'shape-svchost-outer-shell',
        mutationSummary: 'Loader closes handles while hollowed svchost.exe continues running Beacon',
      },
    ],
  },
  '5A': {
    subStepId: '5A',
    cameraMode: 'DMZ_FIREWALL_FFT_ANALYZER',
    cameraLabel: 'CAM 05 · FIREWALL MASQUERADING BYPASS',
    primaryShapeId: 'shape-firewall-gate',
    secondaryShapeIds: ['shape-svchost-outer-shell', 'shape-sysmon-sensor-hud'],
    extractedTokens: [
      {
        token: 'svchost.exe [TRUSTED] -> PASS',
        category: 'NETWORK',
        targetShapeId: 'shape-firewall-gate',
        motionCue: 'Firewall inspects outer process path and approves outbound socket',
      },
      {
        token: '10.10.4.15:52844 -> 185.220.101.42:443',
        category: 'NETWORK',
        targetShapeId: 'shape-c2-malleable-stream',
        motionCue: 'Encrypted TLS 1.3 connection traversing edge DMZ firewall',
      },
      {
        token: 'Sysmon EID 3 (NetworkConnect)',
        category: 'DETECTION',
        targetShapeId: 'shape-sysmon-sensor-hud',
        motionCue: 'Logs svchost.exe initiating external connection to 185.220.101.42',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Initiate WinHTTP TLS 1.3 Socket',
        actorFrom: 'svchost.exe (PID 4892)',
        actorTo: 'Edge Firewall Gate',
        vectorToken: 'TCP SYN / TLS 1.3 ClientHello (:443)',
        targetShapeId: 'shape-firewall-gate',
        mutationSummary: 'Hollowed svchost.exe opens outbound HTTPS socket from 10.10.4.15:52844',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Firewall Verifies Outer Trust Shell',
        actorFrom: 'Edge Firewall Gate',
        actorTo: 'svchost.exe Outer Shell',
        vectorToken: 'Path: System32\\svchost.exe [TRUSTED] -> PASS',
        targetShapeId: 'shape-firewall-gate',
        mutationSummary: 'Firewall sees Microsoft-signed svchost.exe wrapper and opens outbound gate',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Log Sysmon Event ID 3',
        actorFrom: 'WFP Network Filter',
        actorTo: 'Sysmon Telemetry HUD',
        vectorToken: 'SYSMON EID 3: PID 4892 -> 185.220.101.42:443',
        targetShapeId: 'shape-sysmon-sensor-hud',
        mutationSummary: 'Sysmon Event ID 3 records outbound socket from PID 4892 to external IP',
      },
    ],
  },
  '5B': {
    subStepId: '5B',
    cameraMode: 'DMZ_FIREWALL_FFT_ANALYZER',
    cameraLabel: 'CAM 05 · MALLEABLE C2 HTTP PROFILE',
    primaryShapeId: 'shape-c2-malleable-stream',
    secondaryShapeIds: ['shape-firewall-gate', 'shape-svchost-outer-shell'],
    extractedTokens: [
      {
        token: 'GET /jquery-3.3.1.min.js',
        category: 'NETWORK',
        targetShapeId: 'shape-c2-malleable-stream',
        motionCue: 'Malleable C2 URI disguised as benign static jQuery CDN asset',
      },
      {
        token: 'TLS 1.3 (185.220.101.42:443)',
        category: 'NETWORK',
        targetShapeId: 'shape-c2-malleable-stream',
        motionCue: 'Encrypted transport channel hiding C2 tasking payloads',
      },
      {
        token: 'JA3: 72a589da586844d7f0818ce684948eea',
        category: 'DETECTION',
        targetShapeId: 'shape-c2-malleable-stream',
        motionCue: 'Characteristic WinHTTP TLS client fingerprint on non-Microsoft ASN',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Wrap Metadata in Malleable Profile',
        actorFrom: 'Beacon C2 Engine',
        actorTo: 'HTTPS Request Envelope',
        vectorToken: 'GET /jquery-3.3.1.min.js (Cookie: Base64 Meta)',
        targetShapeId: 'shape-c2-malleable-stream',
        mutationSummary: 'Beacon encodes host metadata inside a fake jQuery CDN GET request',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Traverse DMZ to 185.220.101.42:443',
        actorFrom: 'Edge Firewall [PASS]',
        actorTo: 'C2 Server (185.220.101.42:443)',
        vectorToken: 'TLS 1.3 Application Data Stream',
        targetShapeId: 'shape-c2-malleable-stream',
        mutationSummary: 'Encrypted packet capsules stream through the approved firewall conduit',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Flag JA3 & Destination ASN Mismatch',
        actorFrom: 'NDR TLS Inspector',
        actorTo: 'C2 Conduit HUD',
        vectorToken: 'JA3: 72a589da... -> Non-Microsoft IP',
        targetShapeId: 'shape-c2-malleable-stream',
        mutationSummary: 'Network telemetry notes svchost.exe contacting uncategorized external IP',
      },
    ],
  },
  '5C': {
    subStepId: '5C',
    cameraMode: 'DMZ_FIREWALL_FFT_ANALYZER',
    cameraLabel: 'CAM 05 · 60-SECOND HEARTBEAT CADENCE',
    primaryShapeId: 'shape-fft-spectrum-panel',
    secondaryShapeIds: ['shape-c2-malleable-stream'],
    extractedTokens: [
      {
        token: 'Δt = 60s ± 20% Jitter',
        category: 'NETWORK',
        targetShapeId: 'shape-fft-spectrum-panel',
        motionCue: 'Beacon sleep timer polling C2 server roughly once per minute',
      },
      {
        token: 't = 60s, 120s, 180s, 240s',
        category: 'NETWORK',
        targetShapeId: 'shape-fft-spectrum-panel',
        motionCue: 'Consecutive outbound TLS bursts plotted on the time-domain axis',
      },
      {
        token: 'Rhythmic Callback Train',
        category: 'DETECTION',
        targetShapeId: 'shape-fft-spectrum-panel',
        motionCue: 'Low inter-arrival variance despite random sleep jitter',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Emit Periodic 60s Heartbeats',
        actorFrom: 'svchost.exe (PID 4892)',
        actorTo: '185.220.101.42:443',
        vectorToken: 'Pulse Train: t=60s, 120s, 180s, 240s',
        targetShapeId: 'shape-c2-malleable-stream',
        mutationSummary: 'Four consecutive TLS beacon pulses travel across the C2 conduit',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Plot Time-Domain Spike Train',
        actorFrom: 'NetFlow Timestamp Buffer',
        actorTo: 'SIEM Time-Series Chart',
        vectorToken: 'Δt ≈ 60.0s (±20% Jitter Window)',
        targetShapeId: 'shape-fft-spectrum-panel',
        mutationSummary: 'Time-series analyzer records rhythmic amplitude spikes at 60s intervals',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Feed Timestamps into FFT Pipeline',
        actorFrom: 'Time-Domain Signal x(t)',
        actorTo: 'Discrete Fourier Transform F(ω)',
        vectorToken: 'Compute F(ω) = ∑ x(t)·e^{-i2πft}',
        targetShapeId: 'shape-fft-spectrum-panel',
        mutationSummary: 'SIEM transforms jittered time timestamps into frequency-domain spectrum',
      },
    ],
  },
  '5D': {
    subStepId: '5D',
    cameraMode: 'DMZ_FIREWALL_FFT_ANALYZER',
    cameraLabel: 'CAM 05 · SIEM FFT SPECTRUM LOCK (0.0167 HZ)',
    primaryShapeId: 'shape-fft-spectrum-panel',
    secondaryShapeIds: ['shape-sysmon-sensor-hud', 'shape-c2-malleable-stream'],
    extractedTokens: [
      {
        token: 'FFT Peak: f₀ = 0.0167 Hz (T = 60s)',
        category: 'DETECTION',
        targetShapeId: 'shape-fft-spectrum-panel',
        motionCue: 'Fundamental harmonic frequency spike stripping away sleep jitter',
      },
      {
        token: 'SNR = +18.4 dB [CRITICAL LOCK]',
        category: 'DETECTION',
        targetShapeId: 'shape-fft-spectrum-panel',
        motionCue: 'High signal-to-noise ratio above background traffic noise floor',
      },
      {
        token: 'Correlated EID 1 + 10 + 25 + 3',
        category: 'DETECTION',
        targetShapeId: 'shape-sysmon-sensor-hud',
        motionCue: 'Complete 5-stage Process Hollowing incident locked by SOC',
      },
    ],
    microBeats: [
      {
        beatIndex: 0,
        code: 'MOTION ①',
        title: 'Isolate Fundamental Frequency Peak',
        actorFrom: 'FFT Spectrum Analyzer',
        actorTo: 'f₀ = 0.0167 Hz Bin',
        vectorToken: 'Peak Locked @ f₀ = 1/60s = 0.0167 Hz',
        targetShapeId: 'shape-fft-spectrum-panel',
        mutationSummary: 'Sharp spectral spike rises at 0.0167 Hz (+18.4 dB above noise floor)',
      },
      {
        beatIndex: 1,
        code: 'MOTION ②',
        title: 'Confirm Periodic C2 Beaconing',
        actorFrom: 'FFT Detector',
        actorTo: 'SIEM Incident Engine',
        vectorToken: 'FFT PERIODICITY MATCH @ t=60s,120s,180s,240s',
        targetShapeId: 'shape-fft-spectrum-panel',
        mutationSummary: 'SIEM status banner switches to crimson FFT PERIODICITY MATCH',
      },
      {
        beatIndex: 2,
        code: 'MOTION ③',
        title: 'Correlate Full Kill-Chain Telemetry',
        actorFrom: 'SIEM Correlation Engine',
        actorTo: 'Sysmon Telemetry HUD',
        vectorToken: 'EID 1 + EID 10 + EID 25 + EID 3 + FFT',
        targetShapeId: 'shape-sysmon-sensor-hud',
        mutationSummary: 'Full Process Hollowing & Cobalt Strike C2 kill-chain verified and contained',
      },
    ],
  },
};

export function getProcessHollowingSubStepCinematicSpec(
  subStepId: ProcessHollowingSubStepId
): ProcessHollowingSubStepCinematicSpec {
  return (
    PROCESS_HOLLOWING_CINEMATIC_SPECS[subStepId] ??
    PROCESS_HOLLOWING_CINEMATIC_SPECS['0A']
  );
}

/**
 * Given a stage number (0..5) and a normalized progress within that stage (0..1),
 * computes the exact deterministic visual state for the sticky animated diagram.
 */
export function computeProcessHollowingVisualState(
  stageNumber: number,
  rawStageProgress: number
): ProcessHollowingStageVisualState {
  const chapter = getChapterByStage(stageNumber);
  const stageProgress = clampUnitProgress(rawStageProgress);
  const subStepCount = chapter.subSteps.length;
  const scaledSubStep = stageProgress * subStepCount;
  const subStepIndex = Math.min(
    subStepCount - 1,
    Math.floor(scaledSubStep)
  );
  const activeSubStep = chapter.subSteps[subStepIndex] ?? chapter.subSteps[0];
  const subStepInternalProgress = clampUnitProgress(
    scaledSubStep - subStepIndex
  );
  const activeMicroBeatIndex = Math.min(
    2,
    Math.floor(subStepInternalProgress * 3)
  ) as 0 | 1 | 2;
  const cinematicSpec = getProcessHollowingSubStepCinematicSpec(
    activeSubStep.id
  );
  const activeMicroBeat =
    cinematicSpec.microBeats[activeMicroBeatIndex] ??
    cinematicSpec.microBeats[0];

  const globalIndex = ALL_PROCESS_HOLLOWING_SUBSTEPS.findIndex(
    (s) => s.id === activeSubStep.id
  );
  const overallProgress = clampUnitProgress(
    (globalIndex + subStepInternalProgress) /
      ALL_PROCESS_HOLLOWING_SUBSTEPS.length
  );

  // Stage-specific visual state derivation across 4 sub-steps per stage (A, B, C, D)
  const isAtLeast1B =
    stageNumber > 1 || (stageNumber === 1 && subStepIndex >= 1);
  const isAtLeast1C =
    stageNumber > 1 || (stageNumber === 1 && subStepIndex >= 2);
  const isAtLeast1D =
    stageNumber > 1 || (stageNumber === 1 && subStepIndex >= 3);

  const isAtLeast2A = stageNumber >= 2;
  const isAtLeast2B =
    stageNumber > 2 || (stageNumber === 2 && subStepIndex >= 1);
  const isAtLeast2C =
    stageNumber > 2 || (stageNumber === 2 && subStepIndex >= 2);
  const isAtLeast2D =
    stageNumber > 2 || (stageNumber === 2 && subStepIndex >= 3);

  const isAtLeast3A = stageNumber >= 3;
  const isAtLeast3B =
    stageNumber > 3 || (stageNumber === 3 && subStepIndex >= 1);
  const isAtLeast3C =
    stageNumber > 3 || (stageNumber === 3 && subStepIndex >= 2);
  const isAtLeast3D =
    stageNumber > 3 || (stageNumber === 3 && subStepIndex >= 3);

  const isAtLeast4B =
    stageNumber > 4 || (stageNumber === 4 && subStepIndex >= 1);
  const isAtLeast4C =
    stageNumber > 4 || (stageNumber === 4 && subStepIndex >= 2);
  const isAtLeast4D =
    stageNumber > 4 || (stageNumber === 4 && subStepIndex >= 3);

  const isAtLeast5A = stageNumber >= 5;
  const isAtLeast5B =
    stageNumber === 5 && subStepIndex >= 1;
  const isAtLeast5C =
    stageNumber === 5 && subStepIndex >= 2;
  const isAtLeast5D =
    stageNumber === 5 && subStepIndex >= 3;

  const svchostThreadState: 'STANDBY' | 'FROZEN' | 'HIJACKED_RUNNING' = isAtLeast4C
    ? 'HIJACKED_RUNNING'
    : isAtLeast1C
      ? 'FROZEN'
      : 'STANDBY';

  const loaderHandlesText = isAtLeast1D
    ? 'hProcess = 0x01C4 (Full Control) | hThread = 0x01C8'
    : '[ Awaiting Child Process Creation ]';

  let payloadBytesCommitted = 0;
  if (stageNumber > 3 || isAtLeast3C) {
    payloadBytesCommitted = 270336;
  } else if (stageNumber === 3 && activeSubStep.id === '3B') {
    payloadBytesCommitted = 94618;
  }

  let activeSysmonBadge = 'Sysmon Sensor Armed · Monitoring PID 3104 & PID 4892';
  if (stageNumber === 1) {
    if (isAtLeast1D) {
      activeSysmonBadge =
        'SYSMON EVENT ID 1 · ProcessCreate: Invoice_Q4.exe -> svchost.exe (Missing -k flag)';
    } else if (isAtLeast1C) {
      activeSysmonBadge =
        'KERNEL THREAD HOLD · KTHREAD.SuspendCount = 1 on TID 4896 (CREATE_SUSPENDED)';
    } else if (isAtLeast1B) {
      activeSysmonBadge =
        'RING-0 EXEC · ntdll!NtCreateUserProcess Allocated EPROCESS [PID 4892] & PEB';
    }
  } else if (stageNumber === 2) {
    if (isAtLeast2D) {
      activeSysmonBadge =
        'NTDLL TELEMETRY · NtUnmapViewOfSection(0x01C4, 0x00400000) -> STATUS_SUCCESS (Void)';
    } else if (isAtLeast2C) {
      activeSysmonBadge =
        'SYSCALL DISPATCH · MiUnmapViewOfSection Tearing Down SEC_IMAGE @ 0x00400000';
    } else {
      activeSysmonBadge =
        'PEB INSPECTION · ReadProcessMemory(PEB+0x10) -> ImageBaseAddress = 0x00400000';
    }
  } else if (stageNumber === 3) {
    if (isAtLeast3C) {
      activeSysmonBadge =
        'SYSMON EVENT ID 10 · ProcessAccess (0x1FFFFF) Invoice_Q4.exe (3104) -> svchost.exe (4892) @ 0x00400000';
    } else if (isAtLeast3B) {
      activeSysmonBadge =
        'MEMORY STREAM · WriteProcessMemory Copying MZ (4D 5A) & PE Headers -> 0x00400000';
    } else {
      activeSysmonBadge =
        'MEMORY VAD ALERT · VirtualAllocEx(0x00400000, 264 KB, PAGE_EXECUTE_READWRITE)';
    }
  } else if (stageNumber === 4) {
    if (isAtLeast4C) {
      activeSysmonBadge =
        'SYSMON EVENT ID 25 · ProcessTampering (Image is replaced) on svchost.exe [PID 4892]';
    } else if (isAtLeast4B) {
      activeSysmonBadge =
        'REGISTER HIJACK · SetThreadContext Overwrote TID 4896 RCX: 0x00412000 -> 0x004014A0';
    } else {
      activeSysmonBadge =
        'THREAD CONTEXT HOLD · TID 4896 Suspended at Old Entry 0x00412000 (SuspendCount = 1)';
    }
  } else if (stageNumber === 5) {
    if (isAtLeast5C) {
      activeSysmonBadge =
        'SIEM FFT PERIODICITY MATCH · Sysmon EID 3 Outbound TLS 1.3 Beacon (Δt = 60s ± 20% Jitter)';
    } else {
      activeSysmonBadge =
        'SYSMON EVENT ID 3 · svchost.exe [PID 4892] -> 185.220.101.42:443 (Edge Firewall: PASS)';
    }
  }

  return {
    stageNumber: chapter.stageNumber,
    activeSubStepId: activeSubStep.id,
    subStepIndex,
    stageProgress,
    overallProgress,
    subStepInternalProgress,
    activeMicroBeatIndex,
    activeMicroBeat,
    cinematicSpec,
    loaderHandlesText,
    kernelEprocessCreated: isAtLeast1B,
    hasProcessHandle: isAtLeast1D,
    hasThreadHandle: isAtLeast1D,
    createSuspendedFlagActive: isAtLeast1C,
    svchostThreadState,
    pebQueried: isAtLeast2A,
    peSectionsInspected: isAtLeast2B,
    unmapSyscallActive: isAtLeast2C,
    memoryUnmapped: isAtLeast2D,
    rwxAllocated: isAtLeast3A,
    peHeadersWritten: isAtLeast3B,
    payloadWritten: isAtLeast3C,
    vadAnomalyFlagged: isAtLeast3D,
    payloadBytesCommitted,
    rcxEntryPoint: isAtLeast4B ? '0x004014A0' : '0x00412000',
    suspendCount: isAtLeast4C ? 0 : 1,
    tamperingEventFired: isAtLeast4D,
    firewallPassed: isAtLeast5A,
    malleableProfileActive: isAtLeast5B,
    c2BeaconActive: isAtLeast5C,
    fftSpectrumLocked: isAtLeast5D,
    activeSysmonBadge,
  };
}

