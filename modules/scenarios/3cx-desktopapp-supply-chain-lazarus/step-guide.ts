import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: '3cx-desktopapp-supply-chain-lazarus',
    briefing: {
      headline: 'Scenario Briefing: 3CXDesktopApp Supply Chain Attack (CVE-2023-29059), Trojanized ffmpeg.dll, GitHub .ico Dead-Drop & Gopuram',
      storyAnalogy:
        'Imagine a thief (Lazarus Group) who wants to break into a corporate phone system company (3CX). First, they poison an older trading program (X_TRADER) that a 3CX software engineer happens to install on their computer; that gives the thief access to 3CX’s official software factory! Inside the factory, the thief swaps out one helper library (ffmpeg.dll) inside the official 3CXDesktopApp installer before the factory stamps its genuine digital signature on the package. When thousands of companies install the update, 3CXDesktopApp.exe loads the rigged ffmpeg.dll, which reads secret encrypted instructions hidden after a 0xFEEDFACE bookmark inside a neighbor file (d3dcompiler_47.dll), checks innocent-looking icon files (icon1.ico) on GitHub to find the active command server, and steals browser passwords (ICONICSTEALER) or plants the Gopuram spyware!',
      plainSummary:
        'Synthesizing CrowdStrike (Labyrinth Chollima), Kaspersky GReAT (Gopuram), and Mandiant (UNC4736) analyses (March–April 2023), CVE-2023-29059 ("SmoothOperator") is a cascading supply chain compromise where North Korean threat actors trojanized the official Windows and macOS builds of 3CXDesktopApp (versions 18.12.407 and 18.12.416). When the validly signed 3CXDesktopApp.exe starts, it sideloads a trojanized ffmpeg.dll, which reads an RC4-encrypted shellcode blob embedded after marker 0xFEEDFACE inside d3dcompiler_47.dll, fetches AES-encrypted C2 URLs appended to .ico files on GitHub (IconStorages), and deploys ICONICSTEALER or the Gopuram backdoor in memory.',
      diagramTopologySummary:
        'On the diagram: Node ① (3CX Update Server & GitHub IconStorages Dead-Drop) delivers the signed installer to Node ②/③ (Enterprise Workstation running 3CXDesktopApp.exe). Node ④ (ffmpeg.dll & d3dcompiler_47.dll 0xFEEDFACE Loader) decrypts the stage-2 shellcode, resolves C2 from GitHub .ico files, and loads Node ⑤ (ICONICSTEALER & Gopuram in memory), alerted by Node ⑥ (EDR / SIEM).',
      documentedAdvisory: 'CrowdStrike Labyrinth Chollima · Kaspersky GReAT Gopuram & Mandiant UNC4736 · CVE-2023-29059 · MITRE T1195.002',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1195.002',
        plainTitle: 'Sideloading Trojanized ffmpeg.dll & Decrypting the 0xFEEDFACE Blob in d3dcompiler_47.dll',
        storyAnalogy:
          'When the user opens the validly signed 3CXDesktopApp.exe, it automatically loads ffmpeg.dll from its own folder. The rigged ffmpeg.dll opens d3dcompiler_47.dll, flips to page bookmark FE ED FA CE, and decrypts the hidden shellcode using RC4 key "3jB(2bsG#@c7".',
        simpleExplanation:
          'When an employee launches the legitimately signed 3CXDesktopApp.exe softphone client, Windows loads the co-located library ffmpeg.dll (which was trojanized inside 3CX’s build pipeline, CVE-2023-29059). Inside ffmpeg.dll, a malicious initialization thread creates the event AVMonitorEvent, opens the neighboring file d3dcompiler_47.dll (a legitimate-looking Direct3D shader library whose valid digital signature was stripped so an encrypted payload could be appended after the 4-byte magic marker 0xFEEDFACE), and decrypts that payload directly into RWX memory using the RC4 stream cipher with hardcoded key "3jB(2bsG#@c7".',
        howItWorksInPractice:
          'Why split the malware across three files (3CXDesktopApp.exe + ffmpeg.dll + d3dcompiler_47.dll)? Because 3CXDesktopApp.exe keeps its valid 3CX digital signature, ffmpeg.dll contains only a tiny RC4 reader with no C2 URLs, and the encrypted shellcode sits inert inside d3dcompiler_47.dll.',
        diagramAlignment:
          'On the diagram, arrow #1→ shows Node ③ (3CXDesktopApp.exe) sideloading Node ④ (ffmpeg.dll & d3dcompiler_47.dll), and ⇠#1 decrypts the 0xFEEDFACE RC4 shellcode into memory.',
        detectionAndEvidence:
          'Documented by CrowdStrike, Mandiant & Kaspersky: Sysmon EventID 7 loading unsigned ffmpeg.dll (SHA256: 7986bbae...) and 0xFEEDFACE marker in d3dcompiler_47.dll.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1102.001',
        plainTitle: 'Fetching icon1.ico..icon14.ico from GitHub to Decrypt the Active C2 Domain',
        storyAnalogy:
          'Instead of hardcoding a C2 server address that defenders could block on Day 1, the malware downloads normal-looking .ico icon files from a public GitHub repository (IconStorages) and reads an AES-encrypted web address glued to the very end of the icon file.',
        simpleExplanation:
          'Once decrypted in memory, the stage-2 shellcode uses a Dead Drop Resolver (MITRE T1102.001, connecting to a trusted public service like GitHub so corporate firewalls allow the traffic) by sending an HTTPS GET request to raw.githubusercontent.com/IconStorages/images/main/icon1.ico (through icon14.ico). At the very end of the valid icon image sits an appended Base64 string prefixed with "$" (which the malware extracts and decrypts using AES-GCM to reveal the real command-and-control URL, such as https://akamaicontainer.com/gl or https://msstorageboxes.com/eb).',
        howItWorksInPractice:
          'Even after GitHub took down the IconStorages repository, the shellcode also contained a fallback list of hardcoded C2 domains disguised to look like Akamai, Azure, and Microsoft storage services. In the documented Sysmon EID 22 (DNS) / HTTPS exchange from Perimeter Firewall & NDR Tap to Enterprise Workstation (3CX), Enterprise Workstation (3CX) responds with ACK AES-GCM C2 URL (confirming that the GITHUB .ICO DEAD-DROP request succeeded on Enterprise Workstation (3CX) and establishing the runtime state required for Step #3 IN-MEMORY ICONICSTEALER & KASPERSKY GOPURAM BACKDOOR DEPLOYMENT).',
        diagramAlignment:
          'On the diagram, arrow #2→ fetches icon*.ico from Node ① (GitHub IconStorages Dead-Drop) to Node ④, and ⇠#2 returns the AES-GCM encrypted C2 string.',
        detectionAndEvidence:
          'Documented by SentinelOne, Huntress & Mandiant: 3CXDesktopApp.exe querying raw.githubusercontent.com/IconStorages/* or akamaicontainer.com.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1555.003',
        plainTitle: 'Executing In-Memory ICONICSTEALER & Deploying Kaspersky’s Gopuram Backdoor',
        storyAnalogy:
          'The C2 server sends back a memory-only thief (ICONICSTEALER) that raids Chrome, Edge, and Brave browser databases, and if the victim works at a cryptocurrency exchange, the operator sends in the heavy-duty Gopuram espionage backdoor.',
        simpleExplanation:
          'Connecting to the decrypted C2 URL with an encrypted "tutma=" cookie, the loader downloads and reflectively loads a third-stage DLL strictly in memory: ICONICSTEALER (an information stealer documented by Mandiant and CrowdStrike that enumerates the workstation and reads SQLite History and Login Data files from Google Chrome, Microsoft Edge, Brave, and Mozilla Firefox). Furthermore, as Kaspersky GReAT uncovered, on high-value cryptocurrency and financial victims the threat actor deployed Gopuram (a sophisticated modular C2 backdoor used exclusively by the Lazarus group).',
        howItWorksInPractice:
          'Mandiant subsequently traced how the 3CX supply chain attack itself began: Lazarus had earlier trojanized the website installer for Trading Technologies’ X_TRADER software, which an employee at 3CX downloaded, creating a supply-chain-to-supply-chain cascade. In the documented EDR Memory / File Access exchange from Enterprise Workstation (3CX) to ffmpeg.dll & d3dcompiler_47.dll, ffmpeg.dll & d3dcompiler_47.dll responds with ACK In-Memory DLL (confirming that the ICONICSTEALER & GOPURAM request succeeded on ffmpeg.dll & d3dcompiler_47.dll and completing the final execution objective of CrowdStrike, Kaspersky & Mandiant, Lazarus (SmoothOperator): 3CXDesktopApp Supply Chain & Gopuram).',
        diagramAlignment:
          'On the diagram, arrow #3→ executes Node ⑤ (ICONICSTEALER & Gopuram) inside 3CXDesktopApp.exe while Node ⑥ (EDR / SIEM) flags the browser database reads and C2 beacon.',
        detectionAndEvidence:
          'Documented by CrowdStrike, Mandiant & Kaspersky GReAT: 3CXDesktopApp.exe reading Chrome/Edge User Data\\Default\\History and loading Gopuram in memory.',
      },
    ],
  };
