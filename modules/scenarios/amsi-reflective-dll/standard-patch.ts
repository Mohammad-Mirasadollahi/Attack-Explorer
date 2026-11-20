import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a secure bank workshop where every incoming blueprint script must pass beneath a wall-mounted inspection scanner before any worker is allowed to read it. A stealthy intruder locates the scanner\'s control panel right inside the workshop\'s own shared workspace, unlocks its glass cover, tapes a six-character override strip across the sensor lens so the scanner instantly flashes All Clear on every single blueprint, and then unfolds an entire invisible spy kit straight out of thin air without ever touching the floor.',
      storyMappings: [
        {
          storyTerm: 'Wall-mounted inspection scanner inside the shared workspace',
          technicalTerm: 'amsi.dll mapped directly inside the user-mode powershell.exe process space',
          tone: 'amber',
        },
        {
          storyTerm: 'Unlocking the scanner glass cover',
          technicalTerm: 'VirtualProtect changing AmsiScanBuffer memory page protection to PAGE_EXECUTE_READWRITE',
          tone: 'sky',
        },
        {
          storyTerm: 'Taping a six-character override strip across the lens',
          technicalTerm: 'Patching 6 bytes at AmsiScanBuffer entry (mov eax, 0x80070057; ret) returning E_INVALIDARG',
          tone: 'rose',
        },
        {
          storyTerm: 'Unfolding an invisible spy kit straight out of thin air',
          technicalTerm: 'Reflective .NET / PE loading ([System.Reflection.Assembly]::Load) purely from a byte array in RAM',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Standing inside the running workshop, the intruder asks the building directory for the exact wall hook holding the security scanner and turns a maintenance key to flip the scanner\'s protective glass from read-only into an unlocked writable panel.',
        storyMappings: [
          {
            storyTerm: 'Asking the directory for the scanner wall hook',
            technicalTerm: 'LoadLibrary("amsi.dll") and GetProcAddress("AmsiScanBuffer") address resolution',
            tone: 'amber',
          },
          {
            storyTerm: 'Protective glass set to read-only by default',
            technicalTerm: 'Default PAGE_EXECUTE_READ (.text section) protection on amsi.dll in RAM',
            tone: 'sky',
          },
          {
            storyTerm: 'Maintenance key unlocking the panel for writing',
            technicalTerm: 'VirtualProtect(addr, 6, 0x40, &old) granting PAGE_EXECUTE_READWRITE',
            tone: 'rose',
          },
          {
            storyTerm: 'Running workshop hosting both scanner and script',
            technicalTerm: 'Same-process user-mode powershell.exe address space sharing memory with amsi.dll',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Reaching straight into the unlocked control panel, the intruder pastes a tiny six-pin jumper strip right onto the scanner\'s starting wire so every time a new blueprint arrives, the scanner immediately skips inspection and waves it through with a blank clean stamp.',
        storyMappings: [
          {
            storyTerm: 'Tiny six-pin jumper strip on the starting wire',
            technicalTerm: 'x64 patch bytes B8 57 00 07 80 C3 (mov eax, 0x80070057; ret)',
            tone: 'amber',
          },
          {
            storyTerm: 'Skipping inspection and waving every script through',
            technicalTerm: 'AmsiScanBuffer returning E_INVALIDARG immediately before antivirus evaluation',
            tone: 'sky',
          },
          {
            storyTerm: 'Blinded in-process security guard',
            technicalTerm: 'Antimalware Scan Interface neutralized for the entire lifetime of that PowerShell session',
            tone: 'rose',
          },
          {
            storyTerm: 'Memory audit spotting the tampered wire',
            technicalTerm: 'EDR memory integrity check comparing in-RAM amsi.dll bytes against clean disk image',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'With the inspection scanner completely blind, the intruder unzips a compact folding spy toolkit directly inside live working space without ever setting a single parcel onto the floor, leaving floor watchmen with nothing to inspect.',
        storyMappings: [
          {
            storyTerm: 'Unzipping a spy toolkit directly inside live working space',
            technicalTerm: 'Reflective PE / .NET Assembly.Load(byte[]) loading a 512 KB implant straight from RAM',
            tone: 'amber',
          },
          {
            storyTerm: 'Never setting a single parcel onto the floor',
            technicalTerm: 'Fileless execution leaving zero malicious executable artifacts on NTFS disk',
            tone: 'sky',
          },
          {
            storyTerm: 'Blinded scanner letting the hidden kit pass silently',
            technicalTerm: 'Bypassed AMSI failing to inspect the decoded offensive assembly bytes',
            tone: 'rose',
          },
          {
            storyTerm: 'Runtime watchman still catching the launch',
            technicalTerm: 'ETW DotNETRuntime AssemblyLoad events and unbacked RWX memory scanning',
            tone: 'emerald',
          },
        ],
      },
    },
  };
