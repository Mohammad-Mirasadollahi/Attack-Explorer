import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a customs inspection checkpoint that stamps a bright red overseas warning label onto every shipping crate downloaded from the internet. A smuggler packs a poisoned shortcut inside a sealed virtual steel shipping container so only the outer crate gets the red warning stamp; when an employee double-clicks the crate to mount it as a fresh drive letter, the shortcut inside walks out completely unlabelled, yet forensic investigators catch the full delivery chain through the outer crate stamp, the virtual-drive mounting log, and the user folder-viewing diary.',
      storyMappings: [
        {
          storyTerm: 'Red overseas warning label stamped only on the outer crate',
          technicalTerm: 'NTFS Zone.Identifier:ZoneId=3 (Mark-of-the-Web) Alternate Data Stream on the .ISO/.VHD file',
          tone: 'amber',
        },
        {
          storyTerm: 'Mounting the sealed crate as a fresh drive letter',
          technicalTerm: 'vhdmp.sys mounting virtual disk logged in Microsoft-Windows-VHDMP-Operational EventID 1 / 12',
          tone: 'sky',
        },
        {
          storyTerm: 'User folder-viewing diary tracking browsing inside the mounted crate',
          technicalTerm: 'USRCLASS.DAT Shellbags recording E:\\ navigation and weaponized .LNK execution',
          tone: 'rose',
        },
        {
          storyTerm: 'Poisoned shortcut stepping out unlabelled',
          technicalTerm: 'ISO/VHD container bypassing SmartScreen MotW propagation on legacy Windows builds',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'When an employee downloads a phishing-delivered virtual disk archive through a browser, the filesystem attaches a hidden customs tag straight onto the outer archive file recording both that it came from the public internet and the exact web address that hosted it.',
        storyMappings: [
          {
            storyTerm: 'Phishing-delivered virtual disk archive',
            technicalTerm: 'Downloaded .ISO, .IMG, .VHD, or .VHDX container staged in Downloads',
            tone: 'amber',
          },
          {
            storyTerm: 'Hidden customs tag recording origin URL',
            technicalTerm: 'NTFS Alternate Data Stream filename.iso:Zone.Identifier (ZoneId=3, HostUrl, ReferrerUrl)',
            tone: 'sky',
          },
          {
            storyTerm: 'Inspecting the hidden tag during triage',
            technicalTerm: 'Reading Zone.Identifier streams to attribute the exact initial phishing delivery URL',
            tone: 'rose',
          },
          {
            storyTerm: 'Container trick isolating inner files',
            technicalTerm: 'Inner ISO/VHD files lacking NTFS ADS support to carry the outer Zone.Identifier flag',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Double-clicking the downloaded container prompts the operating system virtual-disk engine to mount it cleanly as a new removable drive letter such as E:, silently writing mount and surface timestamps into the system virtual-disk logbook.',
        storyMappings: [
          {
            storyTerm: 'Virtual-disk engine mounting a fresh drive letter',
            technicalTerm: 'Windows Virtual Disk driver vhdmp.sys attaching the container as volume E:\\',
            tone: 'amber',
          },
          {
            storyTerm: 'System virtual-disk logbook',
            technicalTerm: 'Microsoft-Windows-VHDMP-Operational EventID 1 and 12 recording exact ISO/VHD path',
            tone: 'sky',
          },
          {
            storyTerm: 'Presenting clean-looking inner lures',
            technicalTerm: 'Mounted volume displaying weaponized .LNK shortcuts alongside hidden DLL payloads',
            tone: 'rose',
          },
          {
            storyTerm: 'Proving container mount even after unmount',
            technicalTerm: 'VHDMP operational logs persisting long after the user ejects drive E:\\',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Inside the newly opened virtual drive window, the user clicks a disguised document shortcut that launches the hidden payload without SmartScreen warnings, while Windows Explorer quietly records the drive visit inside the user Shellbags diary and records the shortcut metadata.',
        storyMappings: [
          {
            storyTerm: 'User folder-viewing diary recording the drive visit',
            technicalTerm: 'USRCLASS.DAT Shellbags preserving evidence of Explorer browsing E:\\ contents',
            tone: 'amber',
          },
          {
            storyTerm: 'Disguised document shortcut triggering execution',
            technicalTerm: 'Weaponized .LNK file invoking cmd.exe / rundll32.exe / mshta.exe against hidden binaries',
            tone: 'sky',
          },
          {
            storyTerm: 'Hidden payload files tucked beside the shortcut',
            technicalTerm: 'Hidden (+h +s) DLLs or EXEs executed from the mounted container root',
            tone: 'rose',
          },
          {
            storyTerm: 'Link-file forensic goldmine',
            technicalTerm: 'Parsing .LNK target paths, working directories, and creation MachineIDs',
            tone: 'emerald',
          },
        ],
      },
    },
  };
