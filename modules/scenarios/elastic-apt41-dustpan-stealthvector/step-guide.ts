import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'elastic-apt41-dustpan-stealthvector',
    briefing: {
      headline: 'Scenario Briefing: APT41 (Earth Freybug), DUSTPAN Dropper & STEALTHVECTOR / DUSTTRAP Multi-Stage Chain',
      storyAnalogy:
        'Imagine a Russian nesting doll of disguises: first, a trusted Windows system utility (wermgr.exe) is woken up; inside it sits a hollow launcher (DUSTPAN), which unpacks an encrypted memory-only command center (STEALTHVECTOR), which in turn unlocks a modular toolkit (DUSTTRAP) that talks directly to the Windows kernel (ntdll.dll) so user-mode security cameras never see it.',
      plainSummary:
        'Synthesizing independent research from Google Mandiant (DUSTPAN & DUSTTRAP), Elastic Security Labs (DodgeBox & STEALTHVECTOR), and Trend Micro (Earth Freybug), this scenario examines the multi-stage memory-only loader chain used by APT41. Rather than putting their full backdoor in a single file that analysts could easily reverse-engineer, APT41 uses a chain of hollow loaders: a legitimate Windows process (wermgr.exe, Windows Error Reporting, documented by Trend Micro as chosen because it regularly makes outbound HTTPS connections) is spawned and injected with Mandiant’s DUSTPAN launcher, which decrypts Elastic’s STEALTHVECTOR orchestrator in memory (which overwrites ntdll.dll in RAM to wipe out user-mode EDR hooks and spoofs thread call stacks), which in turn loads the 16-plugin DUSTTRAP framework.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Scheduled Task / Service Trigger), follow the hollowing of wermgr.exe on Node ③ (Enterprise Server), trace the in-memory decryption of DUSTPAN → STEALTHVECTOR → DUSTTRAP inside Node ④ (Multi-Stage Memory Pipeline), and follow the encrypted C2 channel to Node ⑤ monitored by Node ⑥ (SIEM / Elastic EDR).',
      documentedAdvisory: 'Mandiant DUSTPAN/DUSTTRAP · Elastic Security Labs DodgeBox/STEALTHVECTOR · Trend Micro Earth Freybug · MITRE T1620',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1055',
        plainTitle: 'DUSTPAN Launcher Injects Into Windows Error Reporting (wermgr.exe)',
        storyAnalogy:
          'The outer nesting doll opens: the dropper starts the official Windows Error Reporting manager (wermgr.exe) and slips the DUSTPAN stage-1 loader into its memory.',
        simpleExplanation:
          'The initial persistence trigger executes the DUSTPAN stage-1 loader (a lightweight launcher documented by Mandiant that contains zero C2 domains or post-exploitation tools of its own, so if an analyst captures the file on disk they learn nothing about the final implant). DUSTPAN immediately spawns C:\\Windows\\System32\\wermgr.exe (Windows Error Reporting Manager, documented by Trend Micro’s Earth Freybug research as chosen because wermgr.exe is a Microsoft-signed binary that legitimately connects to external HTTPS servers to upload crash reports, allowing C2 traffic to blend in) and injects its decryption stub into wermgr.exe’s memory.',
        howItWorksInPractice:
          'By immediately transferring execution into C:\\Windows\\System32\\wermgr.exe via remote memory allocation and APC/thread hijacking, all subsequent stages execute under the process identity and digital signature of a built-in Windows telemetry binary.',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ③ (DUSTPAN Dropper) injecting into Node ④ (wermgr.exe Process Memory), and return arrow ⇠#1 confirming the in-memory stub is active.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 8 / 10 & Trend Micro Earth Freybug report: remote thread or APC injection targeting C:\\Windows\\System32\\wermgr.exe from a non-system parent process.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1140',
        plainTitle: 'STEALTHVECTOR Unhooking ntdll.dll, Call-Stack Spoofing & Decrypting DUSTTRAP',
        storyAnalogy:
          'Before opening the inner nesting doll (DUSTTRAP), the STEALTHVECTOR stage brings in a fresh, un-bugged copy of the Windows system phonebook (ntdll.dll) from disk, wiping out all the wiretaps that the endpoint’s EDR security agent had placed on the phone lines.',
        simpleExplanation:
          'Running inside wermgr.exe, the STEALTHVECTOR stage (analyzed by Elastic Security Labs) reads a clean copy of C:\\Windows\\System32\\ntdll.dll from disk and overwrites the .text code section of the already-loaded ntdll.dll in RAM (because user-mode EDR agents monitor a program by placing 5-byte JMP "wiretap" hooks at the start of system functions inside ntdll.dll in memory, so pasting the clean bytes from disk right over the hooked bytes erases all of the EDR’s user-mode wiretaps). Simultaneously, it constructs synthetic thread call-stack frames (RtlUserThreadStart → BaseThreadInitThunk, so EDR memory walkers see a normal Windows call stack instead of unbacked shellcode) and ChaCha20/AES-GCM-decrypts Mandiant’s DUSTTRAP backdoor directly in memory.',
        howItWorksInPractice:
          'To unhook ntdll.dll, STEALTHVECTOR calls VirtualProtect on the in-memory ntdll.dll .text section (temporarily changing it from Read-Execute 0x20 to Read-Write-Execute 0x40), copies the clean .text bytes from the on-disk ntdll.dll file, and restores 0x20 permissions, silencing user-mode API hooks before DUSTTRAP initializes.',
        diagramAlignment:
          'On the diagram, arrow #2→ inside Node ④ unhooks ntdll.dll and decrypts DUSTTRAP in RAM, and ⇠#2 initializes the 16-plugin dispatch table.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs & Mandiant: VirtualProtect on ntdll.dll .text section (RX → RWX → RX) inside wermgr.exe followed by unbacked PE execution.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1071.001',
        plainTitle: 'Loading DUSTTRAP’s 16 Plugins in Memory & Beaconing Over Custom mTLS',
        storyAnalogy:
          'With the phone lines un-tapped, the innermost doll (DUSTTRAP) snaps modular tool attachments (keylogger, credential harvester, file manager) directly into RAM as the remote operator requests them.',
        simpleExplanation:
          'With ntdll.dll unhooked inside wermgr.exe, the DUSTTRAP core opens a mutual-TLS channel (requiring both client and server certificates so security researchers cannot probe the C2 server or replay traffic) to APT41’s command infrastructure, and loads 16 specialized in-memory plugins (file manager, shell executor, credential harvester, Active Directory recon, streamed into RAM only when needed so the full toolkit never sits on the victim’s hard drive).',
        howItWorksInPractice:
          'Although unhooking ntdll.dll blinds user-mode API hooks inside wermgr.exe, Kernel-mode Event Tracing for Windows (EtwTiLogProtectVM) and Sysmon EventID 3 still catch the ntdll.dll permission change paired with wermgr.exe connecting to a non-Microsoft IP address. In the documented Sysmon EID 3 exchange from Signed Host Binary (taskhost.exe) to DodgeBox Stack-Spoofing & DUSTTRAP, DodgeBox Stack-Spoofing & DUSTTRAP responds with ACK TLS 1.3 (confirming that the WORKER TLS C2 request succeeded on DodgeBox Stack-Spoofing & DUSTTRAP and completing the final execution objective of Elastic & Mandiant, APT41 (Brass Typhoon): DodgeBox, Call-Stack Spoofing & DUSTPAN Loader).',
        diagramAlignment:
          'On the diagram, arrow #3→ connects Node ④ (wermgr.exe running DUSTTRAP) to Node ⑤ (APT41 C2 Server) while Node ⑥ (SIEM / Kernel ETW) detects the ntdll remapping and network beacon.',
        detectionAndEvidence:
          'Documented in Kernel ETW (EtwTiLogProtectVM) & Sysmon EventID 3: ntdll.dll code page modification paired with persistent outbound TLS from wermgr.exe to non-Microsoft IPs.',
      },
    ],
  };
