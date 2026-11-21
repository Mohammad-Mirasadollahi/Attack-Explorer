import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'kaspersky-cosmicstrand-uefi-spi-rootkit',
    briefing: {
      headline:
        'CosmicStrand infects the motherboard SPI flash firmware image inside the CSMCORE DXE driver, chaining a 4-stage memory hook relay (CSMCORE -> bootmgfw.efi -> winload.efi -> ntoskrnl.exe) across every boot to disable PatchGuard and deploy a kernel C2 implant.',
      storyAnalogy:
        'Imagine a ghost etched directly into the silicon blueprint of a building’s foundation (SPI Flash Chip). Even if the owner bulldozes the interior walls and installs a brand-new hard drive and operating system, the moment the main power breaker is flipped on, the ghost whispers to the foundation controller (CSMCORE), who whispers to the elevator operator (bootmgfw.efi), who whispers to the floor manager (winload.efi), who finally slips a mind-control chip into the building director (ntoskrnl.exe) before the director even opens their eyes.',
      plainSummary:
        'In this scenario (T1542.001, CosmicStrand Motherboard SPI Flash UEFI Rootkit (CSMCORE -> ntoskrnl.exe Chain)), the attacker follows one continuous arc: motherboard SPI Flash Infection of CSMCORE DXE, then multi-Hop Boot Hooking Relay, then patchGuard Neutralization, ntoskrnl.exe. Steps #1–#3 examine #1 Motherboard SPI Flash Infection of CSMCORE DXE; #2 Multi-Hop Boot Hooking Relay; #3 PatchGuard Neutralization, ntoskrnl.exe. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection pivots on EDR kernel integrity scan) detecting inline telemetry correlated across the documented kill chain.',
      diagramTopologySummary:
        'Motherboard SPI Flash (CSMCORE DXE) -> Boot Chain (bootmgfw -> winload.efi) -> Patched ntoskrnl.exe & Kernel Implant -> CosmicStrand C2 Server -> Kaspersky GReAT Firmware Scanner.',
      documentedAdvisory:
        'Kaspersky GReAT CosmicStrand UEFI Firmware Rootkit Technical Report / Qihoo 360 Early SPI Analysis / MITRE ATT&CK T1542.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1542.001',
        plainTitle: 'Motherboard SPI Flash Infection of CSMCORE DXE Driver (HandleProtocol Hook)',
        storyAnalogy:
          'Before the computer even knows what a hard drive is, a modified chip on the motherboard wakes up and places a tap on the firmware’s main telephone switchboard (HandleProtocol).',
        simpleExplanation:
          'CosmicStrand modified the UEFI firmware image stored inside the motherboard’s physical 8MB SPI NOR flash chip, specifically patching the CSMCORE DXE driver (GUID {A062CF1F-8473-4AA3-8793-600BC4FFE9A8}). When the UEFI Driver Execution Environment (DXE) loaded CSMCORE, the patched entry point jumped to shellcode appended in the .reloc section, which hooked EFI_BOOT_SERVICES.HandleProtocol (the core UEFI Boot Service function invoked later when locating and loading the OS boot manager).',
        howItWorksInPractice:
          'Because the infection resides entirely inside the motherboard’s SPI flash chip, replacing the SSD/NVMe drive or reinstalling Windows from a clean ISO has zero effect on the rootkit. In the documented EDR exchange from CosmicStrand C2 Server to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ALERT T1542.001 (confirming that the Stage 1: Motherboard SPI Flash Infection of CSMCORE DXE Driver (HandleProtocol Hook) request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: Multi-Hop Boot Hooking Relay (bootmgfw.efi -> winload.efi)).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Motherboard SPI Flash (CSMCORE DXE) to the Boot Chain (bootmgfw -> winload.efi) as HandleProtocol is hooked.',
        detectionAndEvidence:
          'Dump the motherboard SPI flash ROM using CHIPSEC or dedicated UEFI firmware scanners (hardware-level inspection tools that read flash memory directly) and flag unexpected modifications to the CSMCORE DXE module entry point or .reloc section. Correlate Sysmon or Windows Security Event telemetry for T1542.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1542.003',
        plainTitle: 'Multi-Hop Boot Hooking Relay (bootmgfw.efi -> winload.efi)',
        storyAnalogy:
          'Like a baton passed in a relay race entirely in RAM, each boot component patches the next component in memory right before handing over control, without ever touching a file on the hard drive.',
        simpleExplanation:
          'When HandleProtocol was called during boot, CosmicStrand scanned memory for bootmgfw.efi and placed an inline hook on Archpx64TransferTo64BitApplicationAsm. When bootmgfw.efi loaded winload.efi into RAM and called that function, the hook scanned winload.efi for the byte signature of OslArchTransferToKernel (the final OS loader routine that switches the CPU into kernel execution and jumps to ntoskrnl.exe’s entry point) and hooked it in memory.',
        howItWorksInPractice:
          'Because bootmgfw.efi, winload.efi, and ntoskrnl.exe on the disk partition are never modified on disk, offline disk forensics and file-hash checks report 100% clean Microsoft system binaries. In the documented EDR exchange from Perimeter Firewall & NDR Tap to Motherboard SPI Flash (CSMCORE DXE), Motherboard SPI Flash (CSMCORE DXE) responds with ALERT T1542.003 (confirming that the Stage 2: Multi-Hop Boot Hooking Relay (bootmgfw.efi -> winload.efi) request succeeded on Motherboard SPI Flash (CSMCORE DXE) and establishing the runtime state required for Step #3 Stage 3: PatchGuard Neutralization, ntoskrnl.exe ZwCreateSection Hook & Kernel C2).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Boot Chain (bootmgfw -> winload.efi) to the Kaspersky GReAT Firmware Scanner and into the Windows Kernel handoff.',
        detectionAndEvidence:
          'Perform pre-OS boot integrity verification and live kernel memory scanning comparing the in-RAM .text code sections of ntoskrnl.exe against the clean on-disk PE binary (exposing unauthorized pre-boot inline hooks injected before the kernel started). Correlate Sysmon or Windows Security Event telemetry for T1542.003 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1014',
        plainTitle: 'PatchGuard Neutralization, ntoskrnl.exe ZwCreateSection Hook & Kernel C2',
        storyAnalogy:
          'Right before the Windows kernel takes its first breath, the relay runner disables the kernel’s self-inspection alarm (PatchGuard) and plants a hidden radio inside the kernel’s own code pages.',
        simpleExplanation:
          'At the OslArchTransferToKernel handoff, before ntoskrnl.exe even executed its first instruction, CosmicStrand patched KiFilterFiberContext in ntoskrnl.exe RAM to immediately return (preventing Windows Kernel Patch Protection / PatchGuard from initializing), copied its shellcode into unused .text section slack space inside ntoskrnl.exe, and placed an inline hook on ZwCreateSection (waiting for smss.exe to map \KnownDlls\ntdll.dll as a signal that the OS network stack is ready before mapping its final kernel-mode C2 implant).',
        howItWorksInPractice:
          'Once Windows networking initialized, the kernel implant resolved its C2 domain via raw kernel sockets (tdi.sys) to fetch second-stage user/kernel payloads. In the documented EDR exchange from Motherboard SPI Flash (CSMCORE DXE) to Boot Chain (bootmgfw -> winload.efi), Boot Chain (bootmgfw -> winload.efi) responds with ALERT T1014 (confirming that the Stage 3: PatchGuard Neutralization, ntoskrnl.exe ZwCreateSection Hook & Kernel C2 request succeeded on Boot Chain (bootmgfw -> winload.efi) and completing the final execution objective of CosmicStrand Motherboard SPI Flash UEFI Rootkit (CSMCORE -> ntoskrnl.exe Chain)).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the winload.efi hook into the Patched ntoskrnl.exe & Kernel Implant and out to the CosmicStrand C2 Server.',
        detectionAndEvidence:
          'Live kernel memory forensics (Volatility / EDR kernel integrity scan) detecting inline hooks on ntoskrnl.exe!ZwCreateSection and patched bytes at ntoskrnl.exe!KiFilterFiberContext.',
      },
    ],
  };
