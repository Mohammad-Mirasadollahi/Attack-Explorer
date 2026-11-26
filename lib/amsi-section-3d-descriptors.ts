import type { Section3DDescriptor, Section3DKey } from './section-3d-registry';

/**
 * Bespoke 3D stage descriptors for #002 Fileless AMSI Memory Bypass & Reflective DLL Injection
 * (`amsi-reflective-dll`) — Automated X-Ray Inspection Chamber & Zero-Floor Levitation Workshop.
 * All Story copy (`storyCue`, `callout.title`, `storyMapping.storyTerm`, `phase.storyExcerpt`)
 * is 100% jargon-free plain English matching Director's Blueprint #002.
 */
export const AMSI_REFLECTIVE_DLL_SECTION_SCENES: Partial<
  Record<Section3DKey, Section3DDescriptor>
> = {
  briefing: {
    scenarioId: 'amsi-reflective-dll',
    sectionKey: 'briefing',
    sceneKind: 'amsi-xray-briefing',
    stageBadge: '3D STORY · FULL 5-ACT FILM',
    mitreId: 'T1562.001 / T1620',
    title: 'Automated X-Ray Inspection Chamber & Zero-Floor Levitation Workshop',
    storyCue:
      'Inside a single glass-walled precision workshop, a covert technician unbolts the X-Ray belt’s own side circuit hatch, swaps six live copper fuses for a brass short-circuit jumper that silences the watchtower overhead, and assembles a hovering drone mid-air from a ceiling air-tube without tipping the zero-kilogram floor scale.',
    technicalCue:
      'Hidden PowerShell (PID 5412) locates amsi.dll!AmsiScanBuffer (0x7FF9C2142840), unlocks the page with VirtualProtect (0x20 -> 0x40), writes B8 57 00 07 80 C3 (E_INVALIDARG), re-locks RX, then executes WebClient.DownloadData + [Assembly]::Load($bytes) in unbacked MEM_PRIVATE RWX RAM.',
    storyMappings: [
      {
        storyTerm: 'Single Glass-Walled Precision Workshop',
        technicalTerm: 'powershell.exe (PID 5412) Shared Ring 3 Address Space',
        tone: 'sky',
      },
      {
        storyTerm: 'X-Ray Tunnel & 6-Pin Side Circuit Box',
        technicalTerm: 'amsi.dll!AmsiScanBuffer @ 0x7FF9C2142840',
        tone: 'sky',
      },
      {
        storyTerm: 'Elevated Watchtower Security Booth',
        technicalTerm: 'Windows Defender Antimalware Provider (MpOav.dll)',
        tone: 'emerald',
      },
      {
        storyTerm: 'Brass Master Wrench & Blue Glass Hatch',
        technicalTerm: 'VirtualProtect (PAGE_EXECUTE_READ 0x20 -> RWX 0x40)',
        tone: 'amber',
      },
      {
        storyTerm: '6-Pin Brass Short-Circuit Jumper',
        technicalTerm: '6-Byte Patch B8 57 00 07 80 C3 (E_INVALIDARG; ret)',
        tone: 'rose',
      },
      {
        storyTerm: 'Sealed Warehouse Door & 0.0 kg Floor Scale',
        technicalTerm: 'Untouched NTFS Disk (0 Bytes / No Sysmon EID 11)',
        tone: 'emerald',
      },
      {
        storyTerm: 'Overhead Air-Tube & Mid-Air Levitation Ring',
        technicalTerm: 'WebClient.DownloadData + Reflective MEM_PRIVATE RWX Load',
        tone: 'rose',
      },
    ],
    accentHex: '#06B6D4',
    secondaryHex: '#A855F7',
    durationSec: 20,
    callouts: [
      {
        id: 'xray-chamber',
        tag: 'INSPECTION BELT · SAME ROOM',
        title: 'X-Ray Circuit Chamber',
        subtitle: 'amsi.dll!AmsiScanBuffer · 0x7FF9C2142840',
        tone: 'sky',
      },
      {
        id: 'levitation-ring',
        tag: 'ZERO FLOOR CONTACT',
        title: 'Mid-Air Levitation Ring',
        subtitle: 'Unbacked MEM_PRIVATE RWX · 0x000001E4A2100000',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. X-Ray Guard',
        stageTag: 'ACT 1 · BASELINE',
        title: 'Live X-Ray Belt Stops the Red Contraband Canister',
        storyExcerpt:
          'A clean green parcel glides smoothly through the cyan scanner beam, then a crimson contraband canister trips the watchtower siren and slams the heavy steel drop-gate shut.',
        technicalParallel:
          'Before tampering, PowerShell invokes amsi.dll!AmsiScanBuffer -> MpOav.dll, allowing Windows Defender to inspect and block malicious script blocks.',
        accentHex: '#06B6D4',
        startSec: 0,
        endSec: 3.6,
      },
      {
        id: 2,
        shortLabel: '2. Hatch Unlock',
        stageTag: 'ACT 2 · UNLOCK',
        title: 'Technician Unbolts the Side Glass Safety Hatch',
        storyExcerpt:
          'Walking across the same workshop floor, the technician turns the hex bolt with a brass wrench as the paper-tape printer unrolls and a violet hinge sensor flashes.',
        technicalParallel:
          'GetProcAddress resolves 0x7FF9C2142840 (logged in PowerShell EID 4104); VirtualProtect flips 0x20 RX -> 0x40 RWX and fires kernel EtwTiLogProtectVM.',
        accentHex: '#F59E0B',
        startSec: 3.6,
        endSec: 7.6,
      },
      {
        id: 3,
        shortLabel: '3. 6-Pin Swap',
        stageTag: 'ACT 3 · BYPASS',
        title: 'Six Copper Fuses Pulled & Brass Jumper Seated',
        storyExcerpt:
          'All six glowing copper inspection fuses lift out, the solid six-pin brass jumper snaps in, the overhead watchtower wire goes dark, and the glass hatch clicks shut.',
        technicalParallel:
          'Marshal.Copy overwrites 4C 8B DC 49 89 5B with B8 57 00 07 80 C3 (mov eax, 0x80070057; ret) and VirtualProtect restores PAGE_EXECUTE_READ (0x20).',
        accentHex: '#E11D48',
        startSec: 7.6,
        endSec: 12.4,
      },
      {
        id: 4,
        shortLabel: '4. Air-Tube Build',
        stageTag: 'ACT 4 · FILELESS',
        title: 'Air-Tube Drops Floating Parts Onto the Levitation Ring',
        storyExcerpt:
          'The warehouse door stays padlocked at zero kilograms while ceiling air-tube parts converge mid-air into a hovering drone and test pulses bounce off the rigged jumper.',
        technicalParallel:
          'WebClient.DownloadData streams 184 KB into RAM (zero Sysmon EID 11); [Assembly]::Load maps an unbacked MEM_PRIVATE RWX PE at 0x000001E4A2100000.',
        accentHex: '#A855F7',
        startSec: 12.4,
        endSec: 16.8,
      },
      {
        id: 5,
        shortLabel: '5. Blind Tower',
        stageTag: 'ACT 5 · WITNESS',
        title: 'Watchtower Reads Clean While Forensic Witnesses Glow',
        storyExcerpt:
          'Upstairs the security booth displays all clear above the hovering drone, yet the reeled-out paper tape and violet hinge beacon expose the sabotage.',
        technicalParallel:
          'Defender sees nothing via AMSI, but SOC correlation joins PowerShell EID 4104, kernel EtwTiLogProtectVM, Sysmon EID 3, and CLR ETW EID 152.',
        accentHex: '#10B981',
        startSec: 16.8,
        endSec: 20,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.4, 5.2, 13.8], target: [0.0, 2.2, 0.0] },
      { id: 'VIEW_A', label: 'Hatch Lock', position: [-3.8, 3.1, 6.2], target: [-2.6, 2.0, 0.4] },
      { id: 'VIEW_B', label: 'Fuse Cutaway', position: [-3.1, 2.6, 5.1], target: [-3.1, 2.0, 0.2] },
      { id: 'VIEW_C', label: 'Watchtower Contrast', position: [5.4, 5.8, 11.4], target: [0.4, 2.6, -0.8] },
    ],
  },

  'step-1': {
    scenarioId: 'amsi-reflective-dll',
    sectionKey: 'step-1',
    sceneKind: 'amsi-step1-lookup',
    stageBadge: '3D STEP #1 · ADDRESS LOOKUP',
    mitreId: 'T1059.001',
    title: 'Workshop Address Magnifier & Pre-Bypass Paper-Tape Printer',
    storyCue:
      'A glowing brass magnifier sweeps across the scanner cabinet serial plaque inside the same room to lock onto the exact circuit box address while an overhead paper-tape printer records the entire lookup.',
    technicalCue:
      'Hidden PowerShell (PID 5412) calls LoadLibrary("amsi.dll") + GetProcAddress("AmsiScanBuffer") -> 0x7FF9C2142840 while PowerShell Operational Event ID 4104 captures the full plaintext script block.',
    storyMappings: [
      { storyTerm: 'Brass Address Magnifier', technicalTerm: 'LoadLibrary + GetProcAddress Export Resolution', tone: 'sky' },
      { storyTerm: 'Scanner Cabinet Serial Plaque', technicalTerm: 'amsi.dll!AmsiScanBuffer @ 0x7FF9C2142840', tone: 'amber' },
      { storyTerm: 'Overhead Paper-Tape Printer', technicalTerm: 'PowerShell Operational Event ID 4104 (Script Block Log)', tone: 'emerald' },
      { storyTerm: 'Shared Workshop Bench', technicalTerm: 'Same-Process Ring 3 Visibility (No Admin Required)', tone: 'rose' },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#F59E0B',
    durationSec: 12,
    callouts: [
      {
        id: 'step1-plaque',
        tag: 'LIVE EXPORT TARGET',
        title: 'Scanner Serial Plaque',
        subtitle: 'amsi.dll!AmsiScanBuffer @ 0x7FF9C2142840',
        tone: 'sky',
      },
      {
        id: 'step1-tape',
        tag: 'PRE-BYPASS WITNESS',
        title: 'Paper-Tape Transcript',
        subtitle: 'PowerShell Operational Event ID 4104',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Enter Room',
        stageTag: 'STEP #1 · LAUNCH',
        title: 'Hidden Technician Reaches the Shared Workbench',
        storyExcerpt:
          'Slipping into the room without opening a front window, the technician sets the brass magnifier over the scanner’s own cabinet plaque.',
        technicalParallel:
          'winword.exe (PID 3820) spawns powershell.exe -NoP -W Hidden -Enc (PID 5412), logged in Sysmon Event ID 1.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 4,
      },
      {
        id: 2,
        shortLabel: '2. Lock Address',
        stageTag: 'STEP #1 · RESOLVE',
        title: 'Magnifier Beam Locks Onto the Live Circuit Address',
        storyExcerpt:
          'The glowing scan lens glides right and snaps amber onto the stamped brass coordinates of the inspection circuit box.',
        technicalParallel:
          'P/Invoke LoadLibrary("amsi.dll") + GetProcAddress(hAmsi, "AmsiScanBuffer") resolves 0x7FF9C2142840 inside PID 5412.',
        accentHex: '#F59E0B',
        startSec: 4,
        endSec: 8,
      },
      {
        id: 3,
        shortLabel: '3. Tape Witness',
        stageTag: 'STEP #1 · LOGGED',
        title: 'Paper-Tape Printer Captures the Entire Setup Plan',
        storyExcerpt:
          'Overhead, the mechanical transcript ribbon unrolls every command before the technician ever touches the glass hatch.',
        technicalParallel:
          'PowerShell Operational EID 4104 logs the decoded script block containing amsi.dll, AmsiScanBuffer, and GetProcAddress.',
        accentHex: '#10B981',
        startSec: 8,
        endSec: 12,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.8, 4.6, 8.8], target: [0.4, 1.9, 0.0] },
      { id: 'VIEW_A', label: 'Plaque Macro', position: [-0.8, 3.2, 5.2], target: [-0.6, 1.7, 0.1] },
      { id: 'VIEW_B', label: 'Paper Printer', position: [3.4, 4.2, 5.6], target: [3.8, 3.2, -0.6] },
      { id: 'VIEW_C', label: 'Wide Desk', position: [-3.8, 5.2, 9.2], target: [0.4, 2.0, 0.0] },
    ],
  },

  'step-2': {
    scenarioId: 'amsi-reflective-dll',
    sectionKey: 'step-2',
    sceneKind: 'amsi-step2-protect',
    stageBadge: '3D STEP #2 · PAGE UNLOCK',
    mitreId: 'T1562.001',
    title: 'Bolted Blue Glass Safety Hatch & Violet UV Hinge Beacon',
    storyCue:
      'A brass master wrench twists the hex lock bolt on the X-Ray side cabinet, fracturing the blue safety seal so the glass hatch swings open in amber light while a violet hinge sensor flashes overhead.',
    technicalCue:
      'VirtualProtect(0x7FF9C2142840, 6, PAGE_EXECUTE_READWRITE [0x40], &oldProtect) forks a private Copy-on-Write page inside PID 5412 and triggers Ring 0 EtwTiLogProtectVM.',
    storyMappings: [
      { storyTerm: 'Bolted Blue Glass Hatch', technicalTerm: 'PAGE_EXECUTE_READ (0x20) Signed Code Protection', tone: 'sky' },
      { storyTerm: 'Brass Master Wrench Turning Bolt', technicalTerm: 'kernel32!VirtualProtect -> NtProtectVirtualMemory', tone: 'amber' },
      { storyTerm: 'Amber Unlocked Cavity Glow', technicalTerm: 'PAGE_EXECUTE_READWRITE (0x40) Copy-on-Write Window', tone: 'amber' },
      { storyTerm: 'Violet Hinge Crack Beacon', technicalTerm: 'Kernel ETW Threat Intel (EtwTiLogProtectVM)', tone: 'rose' },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#A855F7',
    durationSec: 12,
    callouts: [
      {
        id: 'step2-hatch',
        tag: 'MEMORY GUARD UNLOCKED',
        title: 'Glass Safety Hatch',
        subtitle: 'VirtualProtect 0x20 (RX) -> 0x40 (RWX)',
        tone: 'amber',
      },
      {
        id: 'step2-uv',
        tag: 'RING 0 WITNESS',
        title: 'Violet Hinge Sensor',
        subtitle: 'Kernel ETW-Ti :: EtwTiLogProtectVM',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Bolt Locked',
        stageTag: 'STEP #2 · SEALED',
        title: 'Blue Safety Glass Blocks Direct Wire Access',
        storyExcerpt:
          'The inspection fuses sit sealed behind bolted blue safety glass that prevents anyone from touching the live pins.',
        technicalParallel:
          'Signed amsi.dll!.text at 0x7FF9C2142840 is mapped shared SEC_IMAGE with PAGE_EXECUTE_READ (0x20).',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 4,
      },
      {
        id: 2,
        shortLabel: '2. Wrench Turn',
        stageTag: 'STEP #2 · UNLOCK',
        title: 'Brass Wrench Cracks Seal & Swings Hatch Open',
        storyExcerpt:
          'The technician cranks the hex lock bolt until the blue tamper seal snaps and the glass door swings wide in amber light.',
        technicalParallel:
          'VirtualProtect(0x7FF9C2142840, 6, 0x40, &old) creates a private writable Copy-on-Write 4 KB page for PID 5412.',
        accentHex: '#F59E0B',
        startSec: 4,
        endSec: 8,
      },
      {
        id: 3,
        shortLabel: '3. UV Witness',
        stageTag: 'STEP #2 · ALERT',
        title: 'Violet Hinge Sensor Fires Unstoppable Beacon',
        storyExcerpt:
          'The exact moment the hinge swings open, the violet detector on the frame pulses a clear tamper alert to the control room.',
        technicalParallel:
          'Ring 0 Microsoft-Windows-Threat-Intelligence logs EtwTiLogProtectVM (amsi.dll 0x20 -> 0x40), immune to user-mode bypass.',
        accentHex: '#A855F7',
        startSec: 8,
        endSec: 12,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [1.6, 3.8, 7.6], target: [-0.2, 2.5, 0.5] },
      { id: 'VIEW_A', label: 'Bolt Close-Up', position: [1.4, 2.7, 4.9], target: [0.5, 2.4, 1.0] },
      { id: 'VIEW_B', label: 'UV Sensor', position: [-3.2, 3.8, 5.4], target: [-1.8, 3.4, 1.0] },
      { id: 'VIEW_C', label: 'Wide Cabinet', position: [-3.4, 4.4, 8.8], target: [0.0, 2.4, 0.4] },
    ],
  },

  'step-3': {
    scenarioId: 'amsi-reflective-dll',
    sectionKey: 'step-3',
    sceneKind: 'amsi-step3-patch',
    stageBadge: '3D STEP #3 · 6-PIN SWAP',
    mitreId: 'T1562.001',
    title: 'Six-Pin Fuse Rack Cutaway & Short-Circuit Brass Jumper',
    storyCue:
      'Inside the open X-Ray circuit rack, all six glowing copper fuses lift out and a single solid six-pin brass U-jumper snaps in, turning the overhead watchtower wire dark before the glass hatch clicks shut again.',
    technicalCue:
      'Marshal.Copy overwrites 4C 8B DC 49 89 5B with B8 57 00 07 80 C3 (mov eax, 0x80070057 [E_INVALIDARG]; ret), silencing Defender (MpOav.dll), then VirtualProtect re-locks PAGE_EXECUTE_READ (0x20).',
    storyMappings: [
      { storyTerm: 'Six Glowing Copper Fuses', technicalTerm: 'Original Prologue Bytes 4C 8B DC 49 89 5B', tone: 'sky' },
      { storyTerm: 'Solid 6-Pin Brass U-Jumper', technicalTerm: 'Patched Bytes B8 57 00 07 80 C3 (E_INVALIDARG; ret)', tone: 'rose' },
      { storyTerm: 'Dark Overhead Alarm Wire', technicalTerm: 'Windows Defender Provider MpOav.dll Never Called', tone: 'amber' },
      { storyTerm: 'Glass Hatch Clicking Shut Again', technicalTerm: 'VirtualProtect Restores 0x20 RX (Still CoW Dirty)', tone: 'emerald' },
    ],
    accentHex: '#E11D48',
    secondaryHex: '#FACC15',
    durationSec: 12,
    callouts: [
      {
        id: 'step3-jumper',
        tag: '6-BYTE SHORT-CIRCUIT',
        title: 'Brass Jumper Seated',
        subtitle: 'B8 57 00 07 80 C3 (mov eax, E_INVALIDARG; ret)',
        tone: 'rose',
      },
      {
        id: 'step3-tower',
        tag: 'ALARM WIRE SEVERED',
        title: 'Dark Watchtower Booth',
        subtitle: 'Defender MpOav.dll Receives Zero Buffers',
        tone: 'amber',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Pull Fuses',
        stageTag: 'STEP #3 · EXTRACT',
        title: 'Six Live Copper Inspection Fuses Lift Out',
        storyExcerpt:
          'Inside the exposed cutaway rack, all six glowing copper pins slide cleanly out of their sockets.',
        technicalParallel:
          'Opening 6 bytes of AmsiScanBuffer (4C 8B DC 49 89 5B) are prepared for overwrite inside the unlocked 4 KB page.',
        accentHex: '#38BDF8',
        startSec: 0,
        endSec: 4,
      },
      {
        id: 2,
        shortLabel: '2. Seat Jumper',
        stageTag: 'STEP #3 · PATCH',
        title: 'Brass U-Jumper Cuts the Overhead Watchtower Wire',
        storyExcerpt:
          'The solid six-pin brass jumper locks into slots one through six; the overhead alarm cable dims to dead gray and test pulses bounce back.',
        technicalParallel:
          'Marshal.Copy writes B8 57 00 07 80 C3 so every scan returns E_INVALIDARG on instruction 1 without calling MpOav.dll.',
        accentHex: '#E11D48',
        startSec: 4,
        endSec: 8.5,
      },
      {
        id: 3,
        shortLabel: '3. Hatch Re-Lock',
        stageTag: 'STEP #3 · STEALTH',
        title: 'Glass Cover Swings Shut Over the Rigged Sockets',
        storyExcerpt:
          'The technician closes the blue glass hatch again so the cabinet looks sealed from a distance even though the jumper sits inside.',
        technicalParallel:
          'VirtualProtect restores PAGE_EXECUTE_READ (0x20), leaving a dirty private Copy-on-Write page detectable by EDR integrity diff.',
        accentHex: '#10B981',
        startSec: 8.5,
        endSec: 12,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [-0.3, 3.6, 7.6], target: [0.1, 2.7, 0.5] },
      { id: 'VIEW_A', label: 'Fuse Rack Macro', position: [-0.5, 2.9, 4.8], target: [-0.5, 2.7, 1.1] },
      { id: 'VIEW_B', label: 'Dead Wire & Tower', position: [3.6, 5.2, 6.8], target: [2.2, 4.1, -1.8] },
      { id: 'VIEW_C', label: 'Side Cutaway', position: [-5.2, 3.9, 6.6], target: [0.0, 2.6, 0.2] },
    ],
  },

  'step-4': {
    scenarioId: 'amsi-reflective-dll',
    sectionKey: 'step-4',
    sceneKind: 'amsi-step4-reflective',
    stageBadge: '3D STEP #4 · ZERO-DISK BUILD',
    mitreId: 'T1620',
    title: 'Zero-Kilogram Floor Scale vs. Mid-Air Pneumatic Drone Assembly',
    storyCue:
      'While the warehouse receiving door stays padlocked and its digital floor scale stays pinned at zero kilograms, an overhead pneumatic glass air-tube drops floating parts onto a levitation ring where they snap into a spinning drone mid-air.',
    technicalCue:
      'WebClient.DownloadData streams 184 KB over HTTPS (198.51.100.74:443) strictly into RAM (zero Sysmon EID 11); [Assembly]::Load($bytes) / ReflectiveLoader maps an unbacked MEM_PRIVATE RWX PE at 0x000001E4A2100000 logged by CLR ETW EID 152.',
    storyMappings: [
      { storyTerm: 'Padlocked Warehouse Door & 0.0 kg Scale', technicalTerm: 'Untouched NTFS Disk (Zero Sysmon EID 11)', tone: 'emerald' },
      { storyTerm: 'Overhead Pneumatic Glass Air-Tube', technicalTerm: 'WebClient.DownloadData HTTPS Byte Array Pull', tone: 'sky' },
      { storyTerm: 'Floating Levitation Assembly Ring', technicalTerm: 'Unbacked MEM_PRIVATE RWX @ 0x000001E4A2100000', tone: 'amber' },
      { storyTerm: 'Mid-Air Clockwork Reconnaissance Drone', technicalTerm: 'Reflective PE/CLR Payload Executing Live in RAM', tone: 'rose' },
    ],
    accentHex: '#A855F7',
    secondaryHex: '#10B981',
    durationSec: 12,
    callouts: [
      {
        id: 'step4-drone',
        tag: 'UNBACKED RAM EXEC',
        title: 'Mid-Air Hovering Drone',
        subtitle: 'Assembly.Load @ 0x000001E4A2100000 (RWX)',
        tone: 'rose',
      },
      {
        id: 'step4-scale',
        tag: 'ZERO DISK FOOTPRINT',
        title: 'Zero-Kilogram Floor Scale',
        subtitle: 'NTFS Disk Untouched · No Sysmon EID 11',
        tone: 'emerald',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Air-Tube Drop',
        stageTag: 'STEP #4 · STREAM',
        title: 'Pneumatic Ceiling Tube Drops Glowing Parts Into Mid-Air',
        storyExcerpt:
          'Loose metallic components whoosh straight down the glass air-tube without ever passing through the locked warehouse door.',
        technicalParallel:
          'Sysmon Event ID 3 logs powershell.exe (PID 5412) fetching 184 KB from 198.51.100.74:443 directly into a byte[] array.',
        accentHex: '#A855F7',
        startSec: 0,
        endSec: 4,
      },
      {
        id: 2,
        shortLabel: '2. Mid-Air Snap',
        stageTag: 'STEP #4 · MAP PE',
        title: 'Floating Parts Lock Together Above the Empty Floor',
        storyExcerpt:
          'Hovering cleanly above the floor, four radial fins and a spinning brass gear ring snap around the glowing core.',
        technicalParallel:
          'ReflectiveLoader / CLR allocates unbacked MEM_PRIVATE RWX (0x40), parses MZ/PE headers, and resolves relocations + IAT in RAM.',
        accentHex: '#E11D48',
        startSec: 4,
        endSec: 8,
      },
      {
        id: 3,
        shortLabel: '3. Zero Scale Proof',
        stageTag: 'STEP #4 · DETECT',
        title: 'Floor Scale Stays 0.0 kg While Runtime Logs Catch the Build',
        storyExcerpt:
          'Even though not a single gram touched the warehouse floor scale, the hovering drone has no warehouse receipt on record.',
        technicalParallel:
          'Zero Sysmon EID 11 fires, yet .NET Runtime ETW Event ID 152 logs AssemblyLoad with FullyQualifiedPath = "" (memory-only).',
        accentHex: '#10B981',
        startSec: 8,
        endSec: 12,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.4, 4.1, 9.6], target: [0.1, 2.1, 0.0] },
      { id: 'VIEW_A', label: 'Hovering Drone', position: [4.2, 3.3, 6.2], target: [2.3, 2.3, 0.2] },
      { id: 'VIEW_B', label: '0.0 kg Scale', position: [-3.4, 2.7, 5.8], target: [-2.3, 1.3, -0.2] },
      { id: 'VIEW_C', label: 'High Contrast', position: [0.2, 6.8, 9.4], target: [0.0, 2.0, 0.0] },
    ],
  },

  'memory-forensics': {
    scenarioId: 'amsi-reflective-dll',
    sectionKey: 'memory-forensics',
    sceneKind: 'amsi-memory-diff',
    stageBadge: '3D MEMORY · DISK vs LIVE RAM',
    mitreId: 'T1562.001 / T1620',
    title: 'Forensic Comparison Bench: Clean Vault Cassette vs. Live Workshop RAM',
    storyCue:
      'A sweeping forensic laser compares the clean blueprint vault holding six intact copper fuses against live workshop memory holding the rigged brass jumper beside a hovering untethered drone.',
    technicalCue:
      'Live PID 5412 RAM exposes two forensic proofs: dirty Copy-on-Write amsi.dll @ 0x7FF9C2142840 (B8 57 00 07 80 C3 vs disk 4C 8B DC 49 89 5B) and unbacked MEM_PRIVATE RWX PE @ 0x000001E4A2100000.',
    storyMappings: [
      { storyTerm: 'Left Plinth: Clean 6-Fuse Vault Cassette', technicalTerm: 'Signed On-Disk System32\\amsi.dll (4C 8B DC 49 89 5B)', tone: 'emerald' },
      { storyTerm: 'Center Plinth: Rigged Brass Jumper Block', technicalTerm: 'Dirty CoW RAM @ 0x7FF9C2142840 (B8 57 00 07 80 C3)', tone: 'amber' },
      { storyTerm: 'Right Floating Untethered Drone Ring', technicalTerm: 'Unbacked MEM_PRIVATE RWX PE @ 0x000001E4A2100000', tone: 'rose' },
      { storyTerm: 'Sweeping Crimson Comparison Laser', technicalTerm: 'PE-sieve / Moneta / Defender Memory Integrity Diff', tone: 'sky' },
    ],
    accentHex: '#10B981',
    secondaryHex: '#E11D48',
    durationSec: 14,
    callouts: [
      {
        id: 'mem-diff-amsi',
        tag: '6-BYTE INTEGRITY DIFF',
        title: 'Clean Fuses vs. Brass Jumper',
        subtitle: 'Disk 4C 8B DC 49 89 5B != RAM B8 57 00 07 80 C3',
        tone: 'amber',
      },
      {
        id: 'mem-diff-unbacked',
        tag: 'UNBACKED EXECUTABLE RAM',
        title: 'Untethered Floating Drone',
        subtitle: '0x000001E4A2100000 · MEM_PRIVATE RWX (4D 5A)',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Clean Vault',
        stageTag: 'MEMORY · BASELINE',
        title: 'On-Disk Blueprint Cassette Retains All Six Copper Fuses',
        storyExcerpt:
          'On the left plinth, the original sealed blueprint cassette sits completely intact with all six glowing copper pins in place.',
        technicalParallel:
          'C:\\Windows\\System32\\amsi.dll on NTFS remains untouched (4C 8B DC 49 89 5B) because Copy-on-Write forked only PID 5412.',
        accentHex: '#10B981',
        startSec: 0,
        endSec: 4.6,
      },
      {
        id: 2,
        shortLabel: '2. Dirty RAM Diff',
        stageTag: 'MEMORY · TAMPERED',
        title: 'Laser Sweep Exposes the Six-Pin Brass Jumper in Live RAM',
        storyExcerpt:
          'Sweeping onto the center plinth, the crimson scanner highlights the swapped solid brass jumper hiding inside the live fuse block.',
        technicalParallel:
          'Live amsi.dll!.text @ 0x7FF9C2142840 holds B8 57 00 07 80 C3 (E_INVALIDARG) in a private dirty page despite 0x20 RX restore.',
        accentHex: '#F59E0B',
        startSec: 4.6,
        endSec: 9.4,
      },
      {
        id: 3,
        shortLabel: '3. Unbacked Drone',
        stageTag: 'MEMORY · FILELESS',
        title: 'Hovering Drone Proves Untethered Execution With Zero Disk File',
        storyExcerpt:
          'On the right plinth, the spinning drone hovers in mid-air with zero floor tether, proving it was never loaded from a warehouse crate.',
        technicalParallel:
          '0x000001E4A2100000 (184 KB MEM_PRIVATE RWX, 4D 5A 90 00) + 0x000001E4A2150000 (96 KB CLR Heap) have FileObject = NULL.',
        accentHex: '#E11D48',
        startSec: 9.4,
        endSec: 14,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.6, 4.4, 10.6], target: [0.6, 1.9, 0.1] },
      { id: 'VIEW_A', label: 'Clean vs Dirty', position: [-1.4, 3.2, 6.4], target: [-1.4, 1.6, 0.2] },
      { id: 'VIEW_B', label: 'Unbacked Drone', position: [4.8, 3.6, 6.4], target: [4.5, 2.2, 0.1] },
      { id: 'VIEW_C', label: 'Overhead Bench', position: [0.6, 8.2, 7.6], target: [0.6, 1.6, 0.1] },
    ],
  },
};
