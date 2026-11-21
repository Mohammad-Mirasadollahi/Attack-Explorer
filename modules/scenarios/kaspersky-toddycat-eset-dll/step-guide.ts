import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'kaspersky-toddycat-eset-dll',
    briefing: {
      headline: 'Scenario Briefing: ToddyCat APT (CVE-2024-11859), Abusing an ESET Command-Line Scanner for DLL Search-Order Hijacking',
      storyAnalogy:
        'Imagine a thief who brings a genuine, uniformed security officer (ESET Command Line Scanner ecls.exe) into a building, knowing that the officer has a habit of picking up whichever walkie-talkie (version.dll) is sitting on the nearest table before checking the official equipment locker (System32). The thief places a rigged walkie-talkie (version.dll) on the table right next to the officer; when the officer turns it on, the rigged walkie-talkie still forwards normal radio calls to headquarters so the officer doesn’t suspect a thing, while secretly running ToddyCat’s TCESB spy radio inside the officer’s own uniform.',
      plainSummary:
        'In this scenario (CVE-2024-11859, Kaspersky GReAT - ToddyCat APT: ESET Scanner DLL Proxying (CVE-2024-11859) & TCESB Loader) on WKS-19 (10.10.30), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: launching the Signed ESET Scanner Alongside, then proxying Legitimate DLL Exports While, then establishing an Encrypted C2 Channel. Steps #1–#3 walk that chain end-to-end by covering Launching the Signed ESET Scanner Alongside, then Proxying Legitimate DLL Exports While, then Establishing an Encrypted C2 Channel, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 7 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Node ①/② stages the signed ecls.exe binary and malicious version.dll on Node ③ (Target Workstation/Server). Running ecls.exe on Node ③ loads Node ④ (Trojanized version.dll & TCESB Loader), which decrypts the C2 implant communicating with Node ⑤ while Node ⑥ (SIEM / EDR) detects the unsigned DLL load.',
      documentedAdvisory: 'Kaspersky GReAT ToddyCat Report · ESET Advisory CVE-2024-11859 · MITRE ATT&CK T1574.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1574.001',
        plainTitle: 'Launching the Signed ESET Scanner (ecls.exe) Alongside a Malicious version.dll',
        storyAnalogy:
          'The attacker places a real, digitally signed ESET scanner (ecls.exe) and a forged helper library (version.dll) in the same folder (C:\\ProgramData\\ESET\\). Because of CVE-2024-11859, the moment ecls.exe starts, it grabs the version.dll sitting right next to it instead of the real Windows System32\\version.dll.',
        simpleExplanation:
          'On workstation GOV-WKS-19 (10.10.30.18), the attacker drops a standalone, validly signed copy of ESET Command Line Scanner (ecls.exe, an authentic antivirus utility whose valid digital signature passes Windows AppLocker and antivirus file checks) into a writable folder like C:\\ProgramData\\ESET\\ right next to a malicious library named version.dll. Because of CVE-2024-11859 (where ecls.exe did not restrict its DLL load path to System32), the moment ecls.exe starts, Windows loads the attacker’s version.dll from C:\\ProgramData\\ESET\\ before checking C:\\Windows\\System32\\version.dll.',
        howItWorksInPractice:
          'Unlike KnownDLLs (such as kernel32.dll or ntdll.dll, which Windows forces every program to load exclusively from System32), version.dll is not on the Default KnownDLLs list, so any executable that imports version.dll without specifying LOAD_LIBRARY_SEARCH_SYSTEM32 will load a local version.dll from its own folder first. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #1→ shows Node ③ (Signed ecls.exe) loading Node ④ (Malicious version.dll via CVE-2024-11859), with ⇠#1 logging Sysmon EventID 7.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 7 & ESET Advisory CVE-2024-11859: ecls.exe loading unsigned version.dll from outside System32.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1140',
        plainTitle: 'Proxying Legitimate DLL Exports While Decrypting the ToddyCat TCESB Payload in Memory',
        storyAnalogy:
          'If the rigged version.dll didn’t know how to answer normal version-check questions, ecls.exe would crash immediately. So the rigged DLL acts as a middleman ("Export Proxying"): it forwards every real question to C:\\Windows\\System32\\version.dll while quietly decrypting ToddyCat’s TCESB backdoor in the background.',
        simpleExplanation:
          'If the attacker’s version.dll failed to answer the normal version-check functions that ecls.exe calls on startup (like GetFileVersionInfoW), ecls.exe would crash immediately with an error popup. To prevent a crash, the malicious version.dll uses DLL Export Proxying (forwarding every normal API call straight through to the real C:\\Windows\\System32\\version.dll so ecls.exe runs smoothly), while its background thread reads an encrypted file from disk and decrypts ToddyCat’s TCESB backdoor directly into RAM.',
        howItWorksInPractice:
          'By adding linker export forwarders in the malicious DLL’s Export Address Table (pointing functions like GetFileVersionInfoW to C:\\Windows\\System32\\version.GetFileVersionInfoW), the host program continues to work normally while the attacker’s decrypted shellcode runs in the same process memory. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #2→ inside Node ④ decrypts the TCESB payload into executable memory while proxying exports, and ⇠#2 confirms stage 2 initialization.',
        detectionAndEvidence:
          'Documented by Kaspersky GReAT: Dual loading of version.dll (both local unsigned and System32 signed) inside ecls.exe process memory. Correlate Sysmon or Windows Security Event telemetry for T1620 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1071.001',
        plainTitle: 'Establishing an Encrypted C2 Channel From Inside the Trusted ESET Process',
        storyAnalogy:
          'The malware now phones home from inside the signed ecls.exe process. However, defenders catch the trick because ecls.exe is an offline command-line file scanner, it has zero reason to ever open an outbound HTTPS connection to the internet!',
        simpleExplanation:
          'Running inside the memory space of the signed ecls.exe process (so process lists show a legitimate ESET security scanner), the decrypted TCESB backdoor opens an encrypted HTTPS tunnel on TCP port 443 to ToddyCat command-and-control server 203.0.113.142:443 to harvest domain credentials and browser cookies. Quoting the story beat above, that physical action maps onto [object Object] and [object Object] (the exact host or protocol control point this stage must exercise before the next kill-chain move can start).',
        howItWorksInPractice:
          'Why is this still detectable by defenders? Because ecls.exe is a standalone, offline on-demand file scanner that never connects to the internet during normal operation, meaning any Sysmon EventID 3 (NetworkConnect) log showing ecls.exe opening an outbound TCP/443 socket is an immediate indicator of compromise. In the documented Sysmon EID 3 exchange from ecls.exe (Signed ESET Scanner) to version.dll Proxy & TCESB RAM, version.dll Proxy & TCESB RAM responds with ACK TLS 1.3 (confirming that the ECLS.EXE C2 BEACON request succeeded on version.dll Proxy & TCESB RAM and completing the final execution objective of Kaspersky GReAT, ToddyCat APT: ESET Scanner DLL Proxying (CVE-2024-11859) & TCESB Loader).',
        diagramAlignment:
          'On the diagram, arrow #3→ connects Node ④ (ecls.exe / TCESB) to Node ⑤ (External C2) and triggers an alert on Node ⑥ (SIEM / EDR).',
        detectionAndEvidence:
          'Documented in Sysmon EventID 3 (NetworkConnect): Standalone command-line scanner ecls.exe initiating outbound TCP/443 connections.',
      },
    ],
  };
