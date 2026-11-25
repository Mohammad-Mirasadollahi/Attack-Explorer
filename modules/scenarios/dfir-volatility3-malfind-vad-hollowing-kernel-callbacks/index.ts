import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-volatility3-malfind-vad-hollowing-kernel-callbacks',
    title: 'Volatility Foundation, SANS FOR526 & Elastic DFIR — Volatility 3 windows.malfind, psscan vs pslist & Kernel Callbacks Memory Forensics',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'T1055',
    description:
      'Grounded in Official Volatility 3 Framework Documentation, SANS FOR526 Advanced Memory Forensics, and Elastic Security Labs memory analysis: a DFIR investigator analyzes a raw RAM capture (memdump.raw) using Volatility 3 plugins: (1) windows.malfind to detect private unbacked VAD regions with PAGE_EXECUTE_READWRITE (VAD_PROTECTION_EXECUTE_READWRITE) containing MZ/PE headers or shellcode prologues, (2) windows.psscan vs windows.pslist to uncover DKOM EPROCESS ActiveProcessLinks unlinking, and (3) windows.callbacks / windows.ssdt to detect kernel rootkit hooks.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Raw RAM Image (memdump.raw)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Volatility 3 DTB & PDB Layer', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'windows.malfind (RWX VADs)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'pslist vs psscan EPROCESS', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'windows.callbacks & vadinfo', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Volatility 3 windows.malfind & windows.vadinfo — Unbacked PAGE_EXECUTE_READWRITE VAD Detection',
        narration:
          'Running vol -f memdump.raw windows.malfind walks the kernel MMVAD (_MMVAD_SHORT / _MMVAD) balanced tree for every process. In svchost.exe (PID 2480), malfind flags a private memory region (PrivateMemory=1, Tag=VadS, Protection=PAGE_EXECUTE_READWRITE) with no backing file object (FileObject=None) whose first bytes contain an MZ / PE header (4D 5A 90 00) and a 64-bit function prologue (48 89 5C 24 08).',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Defense Evasion (T1055 - Process Injection: Unbacked RWX VAD Region)',
        technicalCommands: [
          'vol.py -f memdump.raw windows.malfind --pid 2480 --dump',
          'vol.py -f memdump.raw windows.vadinfo --pid 2480',
          'Kernel Structure: _MMVAD_SHORT (VadS) PrivateMemory=1 Protection=PAGE_EXECUTE_READWRITE (0x40)',
        ],
        defenseMitigation:
          'Compare _EPROCESS.SectionObject / VAD mapped file path against _PEB.Ldr loaded module lists using windows.ldrmodules (where InLoad=False, InInit=False, InMem=False indicates reflective injection).',
        logs: [
          {
            id: 'dfir-vol-1',
            timestamp: '10:00:01.100',
            source: 'Memory Scan',
            severity: 'critical',
            EventCode: 64,
            ProcessName: 'svchost.exe',
            CommandLine: 'vol.py -f memdump.raw windows.malfind --pid 2480 (VadS PAGE_EXECUTE_READWRITE)',
            raw: 'volatility3.plugins.windows.malfind: PID=2480 Process="svchost.exe" StartVPN=0x1d400000000 EndVPN=0x1d400042000 Tag="VadS" Protection="PAGE_EXECUTE_READWRITE" CommitCharge=66 PrivateMemory=1 Hexdump="4d 5a 90 00 03 00 00 00" Disasm="48 89 5c 24 08: mov qword ptr [rsp+8], rbx"',
            parsedFields: {
              VolatilityPlugin: 'windows.malfind + windows.ldrmodules',
              TargetProcess: 'svchost.exe (PID 2480)',
              VadTagAndProtection: 'VadS | PrivateMemory=1 | PAGE_EXECUTE_READWRITE',
              InjectedHeaderMagic: '4D 5A 90 00 (Reflectively Mapped PE)',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Direct Kernel Object Manipulation (DKOM) Detection — windows.pslist vs windows.psscan',
        narration:
          'To hide a user-mode loader (kworker_win.exe, PID 5912) from Task Manager and Get-Process, a kernel driver unlinks its _EPROCESS structure from the doubly linked Nt!PsActiveProcessHead (ActiveProcessLinks.Flink / Blink). While windows.pslist (which walks ActiveProcessLinks) does not show PID 5912, windows.psscan scans physical memory pool allocations for the "Proc" pool tag and _EPROCESS structures, immediately exposing the unlinked running process.',
        activeNodes: ['firewall', 'siem', 'ad'],
        mitreTactic: 'Defense Evasion (T1014 - Rootkit: DKOM EPROCESS ActiveProcessLinks Unlinking)',
        technicalCommands: [
          'vol.py -f memdump.raw windows.pslist  # Walks Nt!PsActiveProcessHead doubly-linked list',
          'vol.py -f memdump.raw windows.psscan  # Scans physical RAM pool headers for _EPROCESS objects',
          'Discrepancy: PID 5912 (kworker_win.exe, Offset 0xffffa80149201080) present in psscan + thrdscan, absent from pslist',
        ],
        defenseMitigation:
          'Always cross-compare windows.pslist against windows.psscan (and windows.thrdproc / ETHREAD scheduling lists, since the Windows kernel scheduler threads must remain linked to execute on a CPU).',
        logs: [
          {
            id: 'dfir-vol-2',
            timestamp: '10:02:15.400',
            source: 'Memory Scan',
            severity: 'critical',
            EventCode: 5912,
            ProcessName: 'kworker_win.exe',
            CommandLine: 'vol.py -f memdump.raw windows.psscan (DKOM Unlinked _EPROCESS at 0xffffa80149201080)',
            raw: 'volatility3.plugins.windows.psscan: PID=5912 PPID=612 ImageFileName="kworker_win.exe" Offset(P)=0xffffa80149201080 Threads=4 ExitTime=N/A InPsList=False Anomaly="DKOM Unlinked from ActiveProcessLinks"',
            parsedFields: {
              VolatilityPlugin: 'windows.psscan vs windows.pslist Cross-View Diff',
              HiddenProcess: 'kworker_win.exe (PID 5912, Active Threads=4, ExitTime=N/A)',
              PhysicalPoolOffset: '0xffffa80149201080',
              RootkitTechnique: 'DKOM ActiveProcessLinks.Flink/Blink Unlinking',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Kernel Notification Callback & Driver Inspection (windows.callbacks & windows.driverscan)',
        narration:
          'Running vol -f memdump.raw windows.callbacks and windows.driverscan enumerates kernel PspCreateProcessNotifyRoutine, PspCreateThreadNotifyRoutine, and ObRegisterCallbacks arrays, identifying an unknown kernel address (0xfffff8046b912400) pointing into an unbacked kernel pool allocation that intercepts process creation events.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.001 - Kernel Callback Array Inspection via Volatility 3)',
        technicalCommands: [
          'vol.py -f memdump.raw windows.callbacks',
          'vol.py -f memdump.raw windows.driverscan',
          'Callback Type: IoRegisterFsRegistrationChange / PsSetCreateProcessNotifyRoutine -> Module=UNKNOWN (0xfffff8046b912400)',
        ],
        defenseMitigation:
          'Enforce Hypervisor-Protected Code Integrity (HVCI / Memory Integrity) and Microsoft Vulnerable Driver Blocklist so unsigned or vulnerable kernel drivers cannot modify kernel callback arrays.',
        logs: [
          {
            id: 'dfir-vol-3',
            timestamp: '10:04:30.800',
            source: 'Memory Scan',
            severity: 'critical',
            EventCode: 300,
            ProcessName: 'System',
            CommandLine: 'vol.py -f memdump.raw windows.callbacks (PsSetCreateProcessNotifyRoutine -> UNKNOWN)',
            raw: 'volatility3.plugins.windows.callbacks: Type="GenericKernelCallback" Callback=0xfffff8046b912400 Module="UNKNOWN" Symbol="N/A" Detail="PspCreateProcessNotifyRoutine[9] points to unbacked NonPagedPoolNx"',
            parsedFields: {
              VolatilityPlugin: 'windows.callbacks + windows.driverscan',
              KernelArray: 'Nt!PspCreateProcessNotifyRoutine',
              CallbackPointer: '0xfffff8046b912400 (Module=UNKNOWN)',
            },
          },
        ],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a forensic detective freezing a busy courthouse in mid-motion to perform three surgical checks on the frozen rooms. First, the detective checks the floor-seating ledger for armed strangers sitting in unbacked private booths disguised in clerk robes; second, the detective compares the official front-desk attendance list against a physical walk through every hallway to catch a hidden worker who erased their own name; third, the detective inspects the master courthouse bell-pull board to spot silent security bells that were tampered with or replaced.',
      storyMappings: [
        {
          storyTerm: 'Freezing the courthouse in mid-motion',
          technicalTerm: 'Raw physical RAM acquisition (memdump.raw) analyzed with Volatility 3',
          tone: 'amber',
        },
        {
          storyTerm: 'Armed strangers in unbacked private booths wearing clerk robes',
          technicalTerm: 'windows.malfind flagging unbacked PAGE_EXECUTE_READWRITE VADs in svchost.exe',
          tone: 'sky',
        },
        {
          storyTerm: 'Front-desk attendance list versus physical hallway headcount',
          technicalTerm: 'windows.pslist (linked list) compared against windows.psscan (pool scan) detecting DKOM',
          tone: 'rose',
        },
        {
          storyTerm: 'Master courthouse bell-pull board',
          technicalTerm: 'windows.callbacks and windows.driverscan inspecting PspCreateProcessNotifyRoutine',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Walking through the courthouse room-assignment trees, the detective spotlights a private booth inside a trusted clerk office that has both writing and execution permissions turned on yet matches no official blueprint file on the shelf, revealing an executable payload hiding directly inside live workspace memory.',
        storyMappings: [
          {
            storyTerm: 'Room-assignment trees',
            technicalTerm: 'Kernel _MMVAD_SHORT / _MMVAD Virtual Address Descriptor balanced trees',
            tone: 'amber',
          },
          {
            storyTerm: 'Trusted clerk office',
            technicalTerm: 'Target host process svchost.exe (PID 2480)',
            tone: 'sky',
          },
          {
            storyTerm: 'Private booth with no blueprint file on the shelf',
            technicalTerm: 'Unbacked private PAGE_EXECUTE_READWRITE (RWX) memory region flagged by windows.malfind',
            tone: 'rose',
          },
          {
            storyTerm: 'Executable payload hiding inside live workspace',
            technicalTerm: 'In-memory MZ/PE header or shellcode recovered via windows.vadinfo and malfind',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Next, the detective holds the official front-desk employee chain in one hand while physically sweeping every office chair in the building with the other. One rogue loader erased its own link from the front-desk chain so ordinary roll calls skip straight past it, yet the physical chair sweep catches it sitting in plain sight.',
        storyMappings: [
          {
            storyTerm: 'Official front-desk employee chain',
            technicalTerm: 'Doubly linked Nt!PsActiveProcessHead list walked by windows.pslist and Task Manager',
            tone: 'amber',
          },
          {
            storyTerm: 'Erasing its own link from the chain',
            technicalTerm: 'Direct Kernel Object Manipulation (DKOM) unlinking _EPROCESS of kworker_win.exe (PID 5912)',
            tone: 'sky',
          },
          {
            storyTerm: 'Physical sweep of every office chair',
            technicalTerm: 'Pool-tag memory carving via windows.psscan locating unlinked _EPROCESS blocks',
            tone: 'rose',
          },
          {
            storyTerm: 'Hidden worker caught sitting in plain sight',
            technicalTerm: 'Process present in psscan output while absent from pslist output',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Finally, the detective opens the wooden panel behind the courthouse master bell-pull board and traces every wire back to its owner, verifying whether any rogue driver snipped the security alarm bells or wired its own silent bell onto the courthouse nervous system.',
        storyMappings: [
          {
            storyTerm: 'Courthouse master bell-pull board',
            technicalTerm: 'Kernel arrays PspCreateProcessNotifyRoutine, PspCreateThreadNotifyRoutine, and ObRegisterCallbacks',
            tone: 'amber',
          },
          {
            storyTerm: 'Tracing every wire back to its owner',
            technicalTerm: 'Volatility 3 windows.callbacks correlating callback addresses to loaded drivers',
            tone: 'sky',
          },
          {
            storyTerm: 'Auditing every badge holder in the engine room',
            technicalTerm: 'windows.driverscan enumerating all Ring-0 driver objects in RAM',
            tone: 'rose',
          },
          {
            storyTerm: 'Rogue driver tampering with security bells',
            technicalTerm: 'Unauthorized or unbacked kernel driver hooking or wiping EDR callbacks',
            tone: 'emerald',
          },
        ],
      },
    },
  };
