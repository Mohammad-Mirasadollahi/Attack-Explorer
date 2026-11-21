import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'amsi-reflective-dll',
    briefing: {
      headline: 'Scenario Briefing: In-Memory AMSI Patching & Reflective DLL Injection (MITRE T1562.001 / T1620)',
      storyAnalogy:
        'Imagine a burglar inside a jewelry store where every bag is inspected by an X-ray scanner at the counter (AMSI). Before pulling any tools out of their coat, the burglar reaches into the X-ray machine’s display wire inside their own room and solders a tiny jumper so the screen permanently flashes "BAG IS CLEAN". With the scanner blinded, they assemble their custom lockpick right in their hands without ever setting a tool down on the floor (the hard drive).',
      plainSummary:
        'In this scenario (T1562.001, Fileless AMSI Memory Bypass & Reflective DLL Injection) on DEV-WKS-09 (10.10.4), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: locating amsi.dll in PowerShell’s Memory, then overwriting 6 Bytes of AmsiScanBuffer So, then reflectively Loading a 512 KB .NET / PE. Steps #1–#3 walk that chain end-to-end by covering Locating amsi.dll in PowerShell’s Memory, then Overwriting 6 Bytes of AmsiScanBuffer So, then Reflectively Loading a 512 KB .NET / PE, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on EDR Event 4104 correlated across the documented kill chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ③ (DEV-WKS-09 10.10.4.55) and Node ④ (powershell.exe PID 6120), follow Step #1 (#1→) unlocking amsi.dll!AmsiScanBuffer (0x7FF91A042480), Step #2 (#2→) writing the 6-byte patch and triggering Node ⑥ (Defender ATP / Kernel ETW Sensor), and Step #3 (#3→) reflectively loading the unbacked 512 KB CLR assembly at 0x024A80000.',
      documentedAdvisory: 'MITRE ATT&CK T1562.001 & T1620 · Microsoft Defender EtwTiLogProtectVM · PowerShell EventID 4104 · DotNETRuntime ETW',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1562.001',
        plainTitle: 'Locating amsi.dll in PowerShell’s Memory & Making AmsiScanBuffer Writable',
        storyAnalogy:
          'The intruder locates the exact inspection box (amsi.dll) mounted inside their room and unlocks its metal protective cover (changing memory protection from Read-Execute to Read-Write-Execute) so the internal wiring can be altered.',
        simpleExplanation:
          'Every PowerShell process automatically loads C:\\Windows\\System32\\amsi.dll (the Windows Antimalware Scan Interface library that inspects scripts before they run) into its own user-mode memory space. Running inside powershell.exe (PID 6120, launched with -NoP -NonI -W Hidden -Exec Bypass under CORP\\admin_clark), the attacker uses .NET P/Invoke to call LoadLibrary("amsi.dll") and GetProcAddress("AmsiScanBuffer"), receiving the function’s in-memory export address 0x7FF91A042480 (which pinpoints the exact byte offset where AMSI starts inspecting scripts), and prepares VirtualProtect to flip that page from PAGE_EXECUTE_READ (0x20) to PAGE_EXECUTE_READWRITE (0x40).',
        howItWorksInPractice:
          'Because amsi.dll operates in user mode (Ring 3, sharing the same virtual address space and permissions as powershell.exe PID 6120 rather than being isolated in the Windows kernel), any code running inside PowerShell can resolve amsi.dll!AmsiScanBuffer at 0x7FF91A042480 via P/Invoke (though executing this first stager script triggers a Warning-level PowerShell Operational Event ID 4104 ScriptBlock log before the patch is written).',
        diagramAlignment:
          'On the diagram, Step #1 / Link #1 (#1→ / ⇠#1) shows Node ③ (DEV-WKS-09) and Node ④ (powershell.exe PID 6120) resolving amsi.dll!AmsiScanBuffer (0x7FF91A042480) and logging PowerShell Event ID 4104 (Warning).',
        detectionAndEvidence:
          'Documented in PowerShell EventID 4104 (ScriptBlockLogging, Level=Warning) & Win32 API telemetry: P/Invoke resolving amsi.dll!AmsiScanBuffer (0x7FF91A042480) and preparing VirtualProtect(0x40).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: 'Overwriting 6 Bytes of AmsiScanBuffer So Every Scan Immediately Returns "Clean"',
        storyAnalogy:
          'With the inspection cover open, the intruder replaces the scanner’s sensor circuit with a 6-byte shortcut that immediately stamps "E_INVALIDARG / CLEAN" and exits before the camera even turns on.',
        simpleExplanation:
          'After calling VirtualProtect(0x7FF91A042480, 6, 0x40) (which unlocks the code page and returns the previous protection 0x20), powershell.exe (PID 6120) uses [System.Runtime.InteropServices.Marshal]::Copy to overwrite the first 6 bytes of AmsiScanBuffer (4C 8B DC 49 89 5B) with B8 57 00 07 80 C3 (which disassembles to "mov eax, 0x80070057; ret", instructing the CPU to immediately return error code E_INVALIDARG and exit the function). From this instant on, whenever PowerShell hands a script or assembly buffer to AMSI, AmsiScanBuffer returns E_INVALIDARG at byte 0 (which PowerShell treats as a non-detection, allowing subsequent payloads to run uninspected).',
        howItWorksInPractice:
          'AmsiScanBuffer normally validates its arguments and passes the script buffer to the registered antivirus provider. Overwriting its 6-byte prologue at 0x7FF91A042480 in RAM triggers a Copy-on-Write page split in PID 6120’s Virtual Address Descriptor (VAD) tree (converting the shared signed amsi.dll .text page into a private modified page that Kernel ETW TiProtectVM and EDR integrity scanners flag).',
        diagramAlignment:
          'On the diagram, Step #2 / Link #2 (#2→ / ⇠#2) runs from Node ④ (powershell.exe PID 6120) to amsi.dll (0x7FF91A042480) and Node ⑥ (Event 4104 & EDR), logging the 6-byte prologue patch.',
        detectionAndEvidence:
          'Documented by Microsoft-Windows-Threat-Intelligence ETW & EDR Memory Scanner: 6-byte prologue modification at amsi.dll!AmsiScanBuffer (0x7FF91A042480: 4C 8B DC -> B8 57 00 07 80 C3) creating a private Copy-on-Write page.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1620',
        plainTitle: 'Reflectively Loading a 512 KB .NET / PE Agent Directly From a Byte Array in RAM',
        storyAnalogy:
          'Now that the room’s X-ray scanner is blind, the intruder unfolds a complete communication radio directly out of a memorized blueprint in their head ([Reflection.Assembly]::Load), never placing a single file onto the floor where a floor sensor could spot it.',
        simpleExplanation:
          'With AMSI blinded inside PID 6120 (because normally calling Assembly::Load in .NET 4.8+ triggers an automatic AmsiScanBuffer check on the byte array, which would have caught the unencrypted DLL if Step 2 had not patched it first), the attacker decodes the stage-2 payload in RAM and invokes [System.Reflection.Assembly]::Load([byte[]]$dllBytes). The reflective loader allocates a 512 KB private RWX heap region at base address 0x024A80000 (mapping the MZ/PE headers, resolving imports, and invoking the agent entry point directly in memory without ever writing a .dll file to the hard drive or registering in the PEB Ldr module list).',
        howItWorksInPractice:
          'Reflective code loading parses the PE/COFF headers from a raw byte array and maps the 512 KB executable image into anonymous private heap memory (0x024A80000 with RWX protection, bypassing Sysmon Event ID 7 file-backed DLL load callbacks while leaving an unbacked MZ 4D 5A header in private RAM that PE-sieve and .NET Runtime ETW detect). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, Step #3 / Link #3 (#3→ / ⇠#3) maps the 512 KB reflective assembly into Node ④ (Reflective PE Heap 0x024A80000 RWX) inside powershell.exe (PID 6120), while Node ⑥ (Event 4104 & EDR) alerts on the unbacked executable heap image.',
        detectionAndEvidence:
          'Documented in PE-sieve / Moneta Memory Scanner & DotNETRuntime ETW: unbacked 512 KB RWX PE image ("MZ" 4D 5A header) detected in private heap at 0x024A80000 inside powershell.exe (PID 6120) with no backing file on disk. Correlate Sysmon or Windows Security Event telemetry for T1620 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
