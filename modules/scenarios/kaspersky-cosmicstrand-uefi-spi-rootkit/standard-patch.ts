import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a saboteur who does not break into a bank lobby at all, but instead carves a hidden mechanical detour directly into the stone foundation chip poured beneath the building. Even if the owners demolish every floor and replace every safe inside, the stone foundation still triggers a three-person baton relay every morning at sunrise, switching off the building alarm clock before the bank governor even takes a single step.',
      storyMappings: [
        {
          storyTerm: 'Stone foundation chip beneath the building',
          technicalTerm: 'Motherboard 8MB SPI NOR flash chip storing UEFI firmware',
          tone: 'amber',
        },
        {
          storyTerm: 'Carved mechanical detour inside the foundation',
          technicalTerm: 'Patched CSMCORE DXE UEFI driver hooking HandleProtocol',
          tone: 'sky',
        },
        {
          storyTerm: 'Three-person morning baton relay',
          technicalTerm: 'Boot hook chain across bootmgfw.efi, winload.efi, and OslArchTransferToKernel',
          tone: 'rose',
        },
        {
          storyTerm: 'Switching off the building alarm clock before the governor wakes',
          technicalTerm: 'Neutralizing PatchGuard (KiFilterFiberContext) and hooking ZwCreateSection in ntoskrnl.exe',
          tone: 'emerald',
        },
      ],
      plainSummary:
        'Detailed by Kaspersky GReAT in July 2022, CosmicStrand is an advanced China-nexus UEFI firmware rootkit (persistent pre-boot malware embedded directly inside motherboard flash memory rather than the hard drive) targeting ASUS and Gigabyte H81 motherboards. Because it resides inside the physical SPI NOR flash chip (the motherboard soldered chip that initializes hardware before any disk is read), it survives complete operating system reinstallations and hard drive replacements, executing a multi-hop boot hook chain from the CSMCORE DXE driver into ntoskrnl.exe to neutralize PatchGuard and establish kernel-level command and control.',
    },
    steps: {
      1: {
        storyAnalogy:
          'Deep beneath the building floor, the saboteur chisels a secret trigger straight into the permanent stone foundation block that wakes up first every morning. Because that block lives outside the replaceable floors and storage rooms, tearing out every hard drive in the building never removes the trap.',
        storyMappings: [
          {
            storyTerm: 'Permanent stone foundation block',
            technicalTerm: 'Physical 8MB SPI NOR flash chip on ASUS or Gigabyte H81 motherboards',
            tone: 'amber',
          },
          {
            storyTerm: 'Chiseled secret trigger inside the block',
            technicalTerm: 'Modified CSMCORE DXE driver (GUID {A062CF1F-8473-4AA3-87AF-993111011898})',
            tone: 'sky',
          },
          {
            storyTerm: 'Morning wake-up handshake intercepted',
            technicalTerm: 'Inline hook placed on UEFI Boot Services HandleProtocol',
            tone: 'rose',
          },
          {
            storyTerm: 'Surviving full floor replacement',
            technicalTerm: 'Persistence across complete Windows reinstalls and disk swaps',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Dump the motherboard SPI flash ROM using CHIPSEC or dedicated UEFI firmware scanners (hardware-level inspection tools that read flash memory directly) and flag unexpected modifications to the CSMCORE DXE module entry point or .reloc section.',
      },
      2: {
        storyAnalogy:
          'As dawn breaks, the foundation trap passes a hidden baton up a three-stage hallway relay: first catching the front-gate opener as it unlocks the lobby, then tagging the floor-captain loader as it prepares the main hall, making sure the trap rides all the way up to the governor desk.',
        storyMappings: [
          {
            storyTerm: 'Front-gate opener caught at the lobby',
            technicalTerm: 'bootmgfw.efi hooked at Archpx64TransferTo64BitApplicationAsm',
            tone: 'amber',
          },
          {
            storyTerm: 'Floor-captain loader preparing the main hall',
            technicalTerm: 'winload.efi hooked during OS loader preparation',
            tone: 'sky',
          },
          {
            storyTerm: 'Passing the hidden baton upward',
            technicalTerm: 'Multi-hop pre-OS inline hooking chain bridging firmware to OS loader',
            tone: 'rose',
          },
          {
            storyTerm: 'Governor desk handoff point',
            technicalTerm: 'OslArchTransferToKernel transition right before ntoskrnl.exe starts',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Perform pre-OS boot integrity verification and live kernel memory scanning comparing the in-RAM .text code sections of ntoskrnl.exe against the clean on-disk PE binary (exposing unauthorized pre-boot inline hooks injected before the kernel started).',
      },
      3: {
        storyAnalogy:
          'One heartbeat before the bank governor opens his eyes, the baton carrier unhooks the master watchdog bell so nobody notices tampered blueprints, plants a secret listener on the room-opening ledger, and opens a hidden courier line straight from the governor private study.',
        storyMappings: [
          {
            storyTerm: 'Unhooking the master watchdog bell',
            technicalTerm: 'Patching KiFilterFiberContext in ntoskrnl.exe RAM to bypass PatchGuard',
            tone: 'amber',
          },
          {
            storyTerm: 'Secret listener on the room-opening ledger',
            technicalTerm: 'Kernel hook placed on ZwCreateSection inside ntoskrnl.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Governor private study',
            technicalTerm: 'Ring-0 Windows kernel execution context prior to user-mode boot',
            tone: 'rose',
          },
          {
            storyTerm: 'Hidden courier line',
            technicalTerm: 'Kernel-level shellcode deployment and remote C2 payload retrieval',
            tone: 'emerald',
          },
        ],
      },
    },
  };
