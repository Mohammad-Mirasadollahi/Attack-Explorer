import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'kaspersky-operation-triangulation',
    briefing: {
      headline: 'Scenario Briefing: Operation Triangulation, Zero-Click iMessage Font Exploit & Undocumented Hardware DMA Bypass',
      storyAnalogy:
        'Imagine someone slips an invisible envelope under a locked door (Zero-Click iMessage), and the automatic mail-sorting machine (IMAgent) jams on a rigged font instruction (ADJUST, CVE-2023-41990) before the homeowner even knows a letter arrived. Once inside, the intruder discovers that the vault’s memory walls are protected by an unbreakable software lock (Apple PPL). Instead of fighting the software guard, the intruder walks over to a secret, undocumented maintenance panel wired directly into the silicon chip (MMIO DMA Registers, CVE-2023-38606) and orders the hardware’s own Direct Memory Access crane to lift the vault roof from the outside.',
      plainSummary:
        'In this scenario (CVE-2023-41990, Kaspersky GReAT - Operation Triangulation: Zero-Click Font Exploit, MMIO & TriangleDB), the attacker follows one continuous arc: zero-Click iMessage Attachment Triggers the TrueType, then bypassing Hardware Memory Protection, then deleting Message Traces. Steps #1–#3 examine #1 Zero-Click iMessage Attachment Triggers the TrueType; #2 Bypassing Hardware Memory Protection; #3 Deleting Message Traces. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates process, authentication, and network telemetry for CVE-2023-41990 across the documented kill chain.',
      diagramTopologySummary:
        'On the diagram: Node ① (Triangulation Delivery Server) sends the invisible iMessage attachment through Node ② (APNs Push Gateway) to Node ③ (iOS IMAgent Process). Inside the device, Node ④ (FontParser CVE-2023-41990 & Hardware MMIO DMA CVE-2023-38606) patches kernel memory and launches Node ⑤ (TriangleDB In-Memory Implant), detected via forensic traces on Node ⑥ (Kaspersky Mobile Forensics / SIEM).',
      documentedAdvisory: 'Kaspersky GReAT Operation Triangulation Series · CVE-2023-41990 & CVE-2023-38606 · MITRE T1068',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1203',
        plainTitle: 'Zero-Click iMessage Attachment Triggers the TrueType Font "ADJUST" Bug (CVE-2023-41990)',
        storyAnalogy:
          'An invisible iMessage arrives while the phone is sitting untouched on a table. As the background mail-preview clerk (IMAgent) tries to render a custom font inside the attachment, an obsolete 1990s font command (ADJUST) tricks the clerk into writing outside the page boundary.',
        simpleExplanation:
          'The target iPhone receives an iMessage containing a disguised PDF/archive attachment with an embedded TrueType font. Even while the phone is locked in a pocket, the background daemon IMAgent (the iOS process that automatically pre-processes incoming iMessage attachments before showing a notification) parses the font using libFontParser.dylib. Inside the font, an obsolete 1990s TrueType bytecode instruction named ADJUST (opcode 0x8F/0x90, CVE-2023-41990) triggers an out-of-bounds memory write, giving the attacker instant code execution inside IMAgent with zero user clicks ("Zero-Click").',
        howItWorksInPractice:
          'TrueType fonts are not just static shapes; they contain a Turing-complete virtual machine (font hinting bytecode) designed in the early 1990s. Abusing the legacy ADJUST instruction corrupts the C++ vtable on the heap inside IMAgent before any UI notification is ever rendered. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #1→ delivers the zero-click iMessage payload from Node ①/② to Node ③ (IMAgent FontParser), and ⇠#1 triggers RCE in userland.',
        detectionAndEvidence:
          'Inspect iOS MobileBackup archives and Sysdiagnose bundles (structured device diagnostic snapshots) for anomalous IMAgent attachment processing immediately followed by automated message deletion without corresponding user interaction. Correlate Sysmon or Windows Security Event telemetry for T1203 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1068',
        plainTitle: 'Bypassing Hardware Memory Protection via Undocumented MMIO Registers (CVE-2023-38606)',
        storyAnalogy:
          'Even after taking over the kernel, the chip’s hardware Page Protection Layer (PPL) blocks any software from altering protected memory pages. So the exploit talks directly to an undocumented hardware controller on the Apple Silicon die (0x206040000) and commands its hardware DMA engine to overwrite the protected RAM directly, going completely around the CPU’s software guard.',
        simpleExplanation:
          'Even after escalating into the iOS kernel, Apple Silicon chips enforce a hardware-backed Page Protection Layer (PPL, which blocks even the operating system kernel itself from modifying protected user-signing tables or injecting unsigned code). To bypass PPL, the exploit writes directly to undocumented physical Memory-Mapped I/O (MMIO) hardware registers at address 0x206040000 (CVE-2023-38606, an unmapped hardware debugging/DMA block built into the Apple A12–A16 System-on-Chip). By commanding this hardware DMA engine to write directly to physical RAM, the attacker overwrites PPL-protected kernel memory completely outside the CPU’s security checks.',
        howItWorksInPractice:
          'Because the CPU’s MMU/PPL checks only apply to memory writes executed by the CPU cores themselves, instructing an on-chip peripheral DMA engine via MMIO registers to write to physical memory bypasses PPL page-table write protection. In the documented CVE-2023-38606 MMIO exchange from Perimeter Firewall & NDR Tap to IMTransferAgent (Font & JSC), IMTransferAgent (Font & JSC) responds with ALERT Ring-0 / PPL (confirming that the MMIO DMA PPL BYPASS request succeeded on IMTransferAgent (Font & JSC) and establishing the runtime state required for Step #3 IN-MEMORY TRIANGLEDB IMPLANT DEPLOYMENT).',
        diagramAlignment:
          'On the diagram, arrow #2→ inside Node ④ writes to physical MMIO DMA registers to overwrite kernel memory, with ⇠#2 granting full kernel read/write.',
        detectionAndEvidence:
          'Documented by Kaspersky GReAT (37C3 presentation): Physical MMIO range writes at 0x206040000 bypassing PPL page table restrictions. Correlate Sysmon or Windows Security Event telemetry for T1068 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1620',
        plainTitle: 'Deleting Message Traces & Running the Memory-Only "TriangleDB" Implant',
        storyAnalogy:
          'Once inside the vault, the exploit shreds the incoming iMessage from sms.db so the user never sees a trace, and runs the TriangleDB spyware strictly in volatile RAM, leaving behind only subtle water-meter readings (DataUsage.sqlite network byte counters) that forensic investigators can spot.',
        simpleExplanation:
          'With full kernel privileges, the exploit first deletes the triggering iMessage record from sms.db and attachment caches (so the victim never sees an unread message and forensic investigators cannot extract the exploit file from the phone), then launches the TriangleDB spyware implant strictly in volatile RAM (meaning zero implant files are written to flash storage; if the phone is rebooted, the implant vanishes completely to avoid capture) while beaconing to 198.51.100.201:443.',
        howItWorksInPractice:
          'Even though TriangleDB deletes its iMessage entry and runs only in RAM, iOS automatically records how many bytes of cellular/Wi-Fi data each process uses inside DataUsage.sqlite, leaving orphaned network-usage rows and timestamp gaps that Kaspersky’s triangle_check forensic tool uses to prove infection. In the documented Mach-O TriangleDB exchange from IMTransferAgent (Font & JSC) to XNU Kernel & MMIO DMA Registers, XNU Kernel & MMIO DMA Registers responds with ALERT 220 KB Mach-O (confirming that the LOAD TRIANGLEDB request succeeded on XNU Kernel & MMIO DMA Registers and completing the final execution objective of Kaspersky GReAT, Operation Triangulation: Zero-Click Font Exploit, MMIO & TriangleDB).',
        diagramAlignment:
          'On the diagram, arrow #3→ deploys Node ⑤ (TriangleDB in RAM) and beacons out while Node ⑥ (Kaspersky MVT / SIEM) detects the DataUsage.sqlite & OSAnalytics anomalies.',
        detectionAndEvidence:
          'Run Kaspersky triangle_check against offline iOS backups (automated forensic artifact triage) to detect orphaned network usage entries in DataUsage.sqlite for system processes and telltale timestamp gaps in OSAnalytics logs. Correlate Sysmon or Windows Security Event telemetry for T1620 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
