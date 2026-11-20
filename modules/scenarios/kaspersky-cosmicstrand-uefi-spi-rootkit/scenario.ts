import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'kaspersky-cosmicstrand-uefi-spi-rootkit',
    title: 'CosmicStrand Motherboard SPI Flash UEFI Rootkit (CSMCORE -> ntoskrnl.exe Chain)',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'T1542.001',
    description:
      'CosmicStrand infects the motherboard SPI flash firmware image inside the CSMCORE DXE driver. Across every boot—surviving OS reinstalls and hard-drive replacements—it hooks a 4-stage relay from CSMCORE -> bootmgfw.efi -> winload.efi -> ntoskrnl.exe, disabling PatchGuard and deploying a kernel-mode C2 implant.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'CosmicStrand C2 Server', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Motherboard SPI Flash (CSMCORE DXE)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Boot Chain (bootmgfw -> winload.efi)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Kaspersky GReAT Firmware Scanner', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Patched ntoskrnl.exe & Kernel Implant', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Motherboard SPI Flash Infection of CSMCORE DXE Driver (HandleProtocol Hook)',
        narration:
          'Residing inside the physical SPI flash chip on H81-chipset motherboards, CosmicStrand modifies the legitimate CSMCORE DXE driver, patching its entry point to jump into a malicious .reloc section that hooks the UEFI Boot Services HandleProtocol function.',
        activeNodes: ['firewall', 'target'],
        mitreTactic: 'Persistence (T1542.001 - System Firmware)',
        technicalCommands: [
          'SPI Flash Firmware Region: Patched CSMCORE DXE driver GUID {A062CF1F-8473-4AA3-8793-600BC4FFE9A8}',
          'Hook EFI_BOOT_SERVICES.HandleProtocol -> Intercepts loading of bootmgfw.efi',
        ],
        defenseMitigation:
          'Enable Intel Boot Guard / AMD Platform Secure Boot hardware root-of-trust and BIOS Write Protection (`BiosLock` / `BLE` + `SMM_BWP`) to prevent unauthorized SPI flash modifications.',
        logs: [
          {
            id: 'cosmic-1',
            timestamp: '00:00:01.120',
            source: 'EDR',
            severity: 'critical',
            raw: 'UEFI Firmware Integrity Alert (Kaspersky GReAT) | SPI Flash Image: Infected CSMCORE DXE Driver | GUID: A062CF1F-8473-4AA3-8793-600BC4FFE9A8 | Anomaly: Entry point redirected to .reloc section hooking HandleProtocol',
            parsedFields: {
              InfectedDxeDriver: 'CSMCORE ({A062CF1F-8473-4AA3-8793-600BC4FFE9A8})',
              HookedBootService: 'EFI_BOOT_SERVICES.HandleProtocol',
              PersistenceLayer: 'Physical Motherboard SPI Flash Chip (Survives Disk Wipe)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Multi-Hop Boot Hooking Relay (bootmgfw.efi -> winload.efi)',
        narration:
          'When UEFI loads the Windows Boot Manager (bootmgfw.efi), the HandleProtocol hook patches Archpx64TransferTo64BitApplicationAsm in RAM. When bootmgfw.efi loads winload.efi, the hook intercepts OslArchTransferToKernel right before execution transfers to the Windows kernel.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1542.003 - Bootkit Hooking Relay)',
        technicalCommands: [
          'Hook 1 (bootmgfw.efi): Patch Archpx64TransferTo64BitApplicationAsm in RAM',
          'Hook 2 (winload.efi): Patch OslArchTransferToKernel prior to kernel handoff',
        ],
        defenseMitigation:
          'Dump and audit motherboard SPI flash images using `CHIPSEC` (`chipsec_util spi dump`) and verify DXE driver hashes against vendor golden firmware images.',
        logs: [
          {
            id: 'cosmic-2',
            timestamp: '00:00:03.450',
            source: 'EDR',
            severity: 'critical',
            raw: 'Pre-OS Memory Hook Chain Detected | StageA: bootmgfw.efi (Archpx64TransferTo64BitApplicationAsm) -> StageB: winload.efi (OslArchTransferToKernel) | Note: Zero disk modifications on C:\\ or ESP',
            parsedFields: {
              BootManagerHook: 'bootmgfw.efi!Archpx64TransferTo64BitApplicationAsm',
              OsLoaderHook: 'winload.efi!OslArchTransferToKernel',
              DiskFootprint: 'None (Purely RAM-propagated from SPI Flash)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: PatchGuard Neutralization, ntoskrnl.exe ZwCreateSection Hook & Kernel C2',
        narration:
          'Inside OslArchTransferToKernel, CosmicStrand patches KiFilterFiberContext in ntoskrnl.exe to disable Kernel Patch Protection (PatchGuard), copies shellcode into the .text section slack space of ntoskrnl.exe, hooks ZwCreateSection, and maps its final kernel C2 implant into space when smss.exe starts.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Command and Control & Privilege Escalation (T1014 - Rootkit)',
        technicalCommands: [
          'Disable PatchGuard: Patch ntoskrnl.exe!KiFilterFiberContext -> xor eax, eax; ret',
          'Hook ntoskrnl.exe!ZwCreateSection -> Maps kernel shellcode polling UDP/TCP C2',
        ],
        defenseMitigation:
          'Reflash the physical SPI NOR flash chip using an external hardware programmer (or replace the motherboard) and enforce Hypervisor-Protected Code Integrity (HVCI).',
        logs: [
          {
            id: 'cosmic-3',
            timestamp: '00:00:12.880',
            source: 'EDR',
            severity: 'critical',
            raw: 'Kernel Memory Integrity Alert | Module: ntoskrnl.exe | PatchedFunctions: KiFilterFiberContext (PatchGuard Disabled), ZwCreateSection (Inline Hook in .text slack space) | NetworkActivity: Kernel-mode socket beacon to CosmicStrand C2',
            parsedFields: {
              PatchGuardBypass: 'ntoskrnl.exe!KiFilterFiberContext patched',
              KernelInlineHook: 'ntoskrnl.exe!ZwCreateSection (.text slack space)',
              RootkitFamily: 'CosmicStrand UEFI SPI Rootkit',
            },
          },
        ],
        packets: [],
      },
    ],
  };
