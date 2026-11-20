import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
