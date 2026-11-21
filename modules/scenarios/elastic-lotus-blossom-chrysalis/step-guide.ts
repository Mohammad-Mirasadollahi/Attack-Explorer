import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'elastic-lotus-blossom-chrysalis',
    briefing: {
      headline: 'Scenario Briefing: Lotus Blossom APT, DLL Side-Loading (WinGUp / MsMpEng) & "Chrysalis / Sagerunex" Backdoor',
      storyAnalogy:
        'Imagine a celebrity who only travels with their trusted personal assistant (mpclient.dll / libcurl.dll). Windows has a habit of checking the hotel lobby (the current folder) for the assistant before checking the official headquarters (System32). The attacker places an imposter wearing a name tag that says mpclient.dll right in the lobby next to a genuine, digitally signed program (MsMpEng.exe or Notepad++ GUP.exe). When the genuine program starts up, it hires the imposter standing right next to it.',
      plainSummary:
        'In this scenario (T1574.002, Elastic Security Labs - Lotus Blossom APT: WinGUp DLL Side-Loading & CHRYSALIS Backdoor), the attacker follows one continuous arc: dropping a Legitimate Signed Binary Alongside, then aPI Hashing, then establishing Persistence. Steps #1–#3 examine #1 Dropping a Legitimate Signed Binary Alongside; #2 API Hashing; #3 Establishing Persistence. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates Sysmon Event 7 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ①/② (Initial Perimeter Compromise), trace the staging of the signed host binary and trojanized DLL on Node ③ (Enterprise Server), follow the DLL side-loading and RC4/XOR payload decryption inside Node ④ (Chrysalis In-Memory Backdoor), and observe the HTTPS C2 tunnel to Node ⑤ detected by Node ⑥ (SIEM / Elastic EDR).',
      documentedAdvisory: 'Elastic Security Labs CHRYSALIS Report · Cisco Talos Sagerunex Analysis · MITRE ATT&CK G0030 / T1574.002',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1574.002',
        plainTitle: 'Dropping a Legitimate Signed Binary (GUP.exe / MsMpEng.exe) Alongside a Trojanized Companion DLL',
        storyAnalogy:
          'The intruder drops a 3-piece kit into a quiet folder (C:\\ProgramData\\Comms\\): (1) a real, digitally signed executable, (2) a trojanized helper library with the exact name the executable looks for (mpclient.dll / libcurl.dll), and (3) a locked box of encrypted shellcode (chrysalis.dat).',
        simpleExplanation:
          'Across campaigns analyzed by Elastic Security Labs and Cisco Talos, the attacker stages a 3-file triad inside a writable folder like C:\\ProgramData\\Comms\\: (1) a genuine, digitally signed executable (such as Microsoft’s MsMpEng.exe or Notepad++ WinGUp GUP.exe, authentic signed binaries whose valid digital certificates prevent antivirus from blocking the .exe launch), (2) a malicious companion DLL named mpclient.dll or libcurl.dll placed in that exact same folder (exploiting Windows’ default DLL search order, which checks the application’s current directory before C:\\Windows\\System32), and (3) an encrypted data file named chrysalis.dat or conf.bin (containing the actual backdoor in scrambled form so static file scanners see only random bytes).',
        howItWorksInPractice:
          'When the signed host binary starts from C:\\ProgramData\\Comms\\, the Windows loader (ntdll!LdrLoadDll) resolves its Import Address Table (IAT), sees an import for mpclient.dll / libcurl.dll, finds the attacker’s unsigned DLL sitting in the local directory first, and maps it directly into the trusted process.',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ③ (Signed Host Binary) loading Node ④ (Malicious Side-Loaded DLL in C:\\ProgramData\\Comms\\), and return arrow ⇠#1 executing DllMain.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 7 (ImageLoaded): a signed system/vendor executable (MsMpEng.exe or GUP.exe) running from a non-standard directory (C:\\ProgramData\\) and loading an unsigned DLL.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1140',
        plainTitle: 'API Hashing & Decrypting the "chrysalis.dat" Shellcode Blob Purely in RAM',
        storyAnalogy:
          'Once the imposter assistant (mpclient.dll / libcurl.dll) is invited inside the VIP suite, they quietly unlock the third file (chrysalis.dat) in memory, so no antivirus scanner looking at the hard drive ever sees the real weapon.',
        simpleExplanation:
          'Once the signed binary loads the trojanized DLL and calls its exported startup function (keeping the malicious DLL tiny and using custom 32-bit API hashing instead of plaintext function names like VirtualAlloc so static analysts see no suspicious imports), the DLL opens the companion file chrysalis.dat / conf.bin from disk, decrypts its bytes in RAM using a custom RC4/XOR key, and copies the unpacked Chrysalis / Sagerunex shellcode into an executable memory buffer (meaning the actual APT backdoor code only ever exists in volatile memory, never unencrypted on the hard drive).',
        howItWorksInPractice:
          'Splitting the infection chain across three files (a clean signed .exe, a minimal loader .dll using API hashing, and an encrypted .dat/.bin blob) defeats traditional signature scanners: the .exe is 100% legitimate, the .dll contains only a simple file-read and XOR/RC4 loop, and the .dat file has no PE header ("MZ") on disk. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #2→ inside Node ④ reads and decrypts chrysalis.dat into a VirtualAlloc buffer, and ⇠#2 transfers execution to the unpacked Chrysalis / Sagerunex implant.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs & Cisco Talos: private executable memory allocation (VirtualAlloc RW → RX) inside a side-loaded process immediately after reading a local .dat / .bin file. Correlate Sysmon or Windows Security Event telemetry for T1027.007 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1071.001',
        plainTitle: 'Establishing Persistence & Beaconing Over HTTPS Using Corporate Proxy Credentials',
        storyAnalogy:
          'Wearing the trusted program’s badge, the decrypted backdoor reads the employee’s own internet proxy pass from Windows (WinInet) and blends its outbound HTTPS messages right into normal office web traffic.',
        simpleExplanation:
          'Running inside the trusted host binary, the decrypted Chrysalis/Sagerunex implant registers a persistent Windows service or Registry Run key (pointing to the legitimate signed .exe so startup monitors see a signed binary), and calls Windows WinInet APIs (InternetOpenW and HttpSendRequestW, chosen instead of raw sockets because WinInet automatically reads the logged-in employee’s corporate proxy settings and cached NTLM/Kerberos credentials, allowing the C2 beacon to pass right through strict enterprise web proxies).',
        howItWorksInPractice:
          'In many enterprise networks, direct outbound TCP/443 connections are blocked unless traffic authenticates through a corporate HTTP proxy. Using WinInet with INTERNET_OPEN_TYPE_PRECONFIG lets the malware piggyback on Windows’ built-in proxy configuration and user credentials automatically. In the documented Sysmon EID 3 exchange from GUP.exe (Signed WinGUp) to libcurl.dll & CHRYSALIS RAM, libcurl.dll & CHRYSALIS RAM responds with ACK TLS 1.2 (confirming that the HTTPS C2 BEACON request succeeded on libcurl.dll & CHRYSALIS RAM and completing the final execution objective of Elastic Security Labs, Lotus Blossom APT: WinGUp DLL Side-Loading & CHRYSALIS Backdoor).',
        diagramAlignment:
          'On the diagram, arrow #3→ connects Node ④ (Chrysalis Backdoor) out to Node ⑤ (Lotus Blossom HTTPS C2) while Node ⑥ (SIEM) correlates the side-loaded DLL with the outbound beacon.',
        detectionAndEvidence:
          'Documented in Elastic & Talos advisories: Sysmon EventID 3 outbound HTTPS connection from a binary executing out of C:\\ProgramData\\ with an unsigned side-loaded module.',
      },
    ],
  };
