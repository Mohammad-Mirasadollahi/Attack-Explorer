import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'genshin-mhyprot2-ransomware-byovd',
    briefing: {
      headline:
        'Ransomware operators bring a standalone copy of the signed Genshin Impact anti-cheat kernel driver (mhyprot2.sys, CVE-2020-36603), complete a 64-bit Mersenne Twister handshake via IOCTL 0x80034000, and invoke IOCTL 0x81034000 (ZwTerminateProcess) to kill enterprise AV/EDR agents.',
      storyAnalogy:
        'Imagine a video-game referee (mhyprot2.sys) who was given a real police badge by the city (Microsoft WHCP Signature) so they could stop players from cheating on home PCs. A bank robber realizes that this referee will also obey orders inside a corporate bank vault, even if the video game isn’t installed, and commands the referee (IOCTL 0x81034000) to knock out every bank security guard in the building.',
      plainSummary:
        'In this scenario (T1068, Genshin Impact Anti-Cheat Driver (mhyprot2.sys) Ransomware BYOVD (CVE-2020-36603)), the attacker follows one continuous arc: dropping Standalone Signed mhyprot2.sys on, then opening \\\\.\\mhyprot2, then ring-0 ZwTerminateProcess Massacre via IOCTL. Steps #1–#3 examine #1 Dropping Standalone Signed mhyprot2.sys on; #2 Opening \\\\.\\mhyprot2; #3 Ring-0 ZwTerminateProcess Massacre via IOCTL. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates Sysmon Event 6 with the documented host and network chain.',
      diagramTopologySummary:
        'kill_svc.exe Ransomware Dropper -> Signed Anti-Cheat Driver (mhyprot2.sys) -> IOCTL 0x80034000 MT64 Handshake -> IOCTL 0x81034000 Ring-0 AV Wipe & Lock -> Trend Micro / Mandiant EDR Sensor.',
      documentedAdvisory:
        'Trend Micro Ransomware Abusing Genshin Impact Anti-Cheat Driver Report / NVD CVE-2020-36603 / Mandiant BYOVD Analysis',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1068',
        plainTitle: 'Dropping Standalone Signed mhyprot2.sys on Enterprise Domain Controller',
        storyAnalogy:
          'An attacker logs into a corporate Domain Controller that has never had a video game installed and unpacks a standalone, validly signed gaming anti-cheat driver.',
        simpleExplanation:
          'After compromising a server via RDP or stolen domain credentials, the ransomware operator dropped C:\\Users\\Public\\mhyprot2.sys (a 350KB 64-bit Windows kernel driver validly signed by miHoYo Co., Ltd. and countersigned by Microsoft in 2020) and registered it as a kernel driver service via sc.exe create mhyprot2 type= kernel (loading cleanly into Ring 0 without requiring the Genshin Impact game client to be installed on the machine).',
        howItWorksInPractice:
          'Consumer anti-cheat drivers are engineered with sweeping Ring-0 process and memory inspection capabilities to catch game cheats, making them prime targets for standalone BYOVD weaponization on enterprise servers. In the documented EventID 6 exchange from kill_svc.exe Ransomware Dropper to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK 6 (confirming that the Stage 1: Dropping Standalone Signed mhyprot2.sys on Enterprise Domain Controller request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: Opening \\.\mhyprot2 & Initializing MT19937-64 Encryption Seed (IOCTL 0x80034000)).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the kill_svc.exe Ransomware Dropper to the Signed Anti-Cheat Driver (mhyprot2.sys) as it loads onto the server.',
        detectionAndEvidence:
          'Sysmon EventID 6 (DriverLoaded) alerting whenever mhyprot2.sys (or any driver signed by miHoYo Co., Ltd.) is loaded on an enterprise workstation or server. Preserve the raw event fields and the related containment ticket for forensic replay.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1027',
        plainTitle: 'Opening \\\\.\\mhyprot2 & Initializing MT19937-64 Encryption Seed (IOCTL 0x80034000)',
        storyAnalogy:
          'To talk to the anti-cheat referee, the attacker’s tool sends a secret dice-roll seed (MT19937-64) that both sides use to scramble their messages.',
        simpleExplanation:
          'kill_svc.exe opened a handle to \\\\.\\mhyprot2 and issued DeviceIoControl with IOCTL 0x80034000 (passing a 24-byte initialization structure that seeds the driver’s internal 64-bit Mersenne Twister MT19937-64 pseudo-random number generator, which mhyprot2.sys uses to XOR-decrypt all subsequent IOCTL request buffers and XOR-encrypt responses).',
        howItWorksInPractice:
          'Because researchers had previously reverse-engineered mhyprot2.sys’s MT19937-64 key derivation and published open-source PoCs on GitHub (evil-mhyprot-cli), ransomware developers copied the exact handshake routine directly into kill_svc.exe. In the documented EDR exchange from Perimeter Firewall & NDR Tap to Signed Anti-Cheat Driver (mhyprot2.sys), Signed Anti-Cheat Driver (mhyprot2.sys) responds with ALERT T1027 (confirming that the Stage 2: Opening \\.\mhyprot2 & Initializing MT19937-64 Encryption Seed (IOCTL 0x80034000) request succeeded on Signed Anti-Cheat Driver (mhyprot2.sys) and establishing the runtime state required for Step #3 Stage 3: Ring-0 ZwTerminateProcess Massacre via IOCTL 0x81034000 & Mass Encryption).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Signed Anti-Cheat Driver (mhyprot2.sys) to the IOCTL 0x80034000 MT64 Handshake node and triggers the Trend Micro / Mandiant EDR Sensor.',
        detectionAndEvidence:
          'Monitoring CreateFileW handles to \\Device\\mhyprot2 and behavioral detection of 0x80034000 / 0x81034000 IOCTL sequences.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1562.001',
        plainTitle: 'Ring-0 ZwTerminateProcess Massacre via IOCTL 0x81034000 & Mass Encryption',
        storyAnalogy:
          'With the scrambled communication channel open, the attacker feeds the ID numbers of every antivirus guard into the anti-cheat driver, which terminates them from the kernel so the ransomware can lock the server.',
        simpleExplanation:
          'Once the 0x80034000 handshake succeeded, kill_svc.exe enumerated running endpoint security processes (Ntrtscan.exe, TmCCSF.exe, uiWatchDog.exe, MsMpEng.exe), XOR-encrypted each target Process ID with the MT19937-64 stream, and invoked IOCTL 0x81034000 (CVE-2020-36603, which calls PsLookupProcessByProcessId and ZwTerminateProcess in Ring 0 to forcefully terminate any process regardless of PPL status), immediately followed by mass ransomware encryption across the Domain Controller’s shares.',
        howItWorksInPractice:
          'mhyprot2.sys also exposes IOCTL 0x81054000 and 0x81064000 for arbitrary kernel/process memory reads (MmCopyVirtualMemory), giving attackers both an EDR killer and a kernel memory reader in a single signed binary. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the MT64 Handshake invoking IOCTL 0x81034000 Ring-0 AV Wipe & Lock.',
        detectionAndEvidence:
          'Blocking mhyprot2.sys via Microsoft Vulnerable Driver Blocklist / WDAC and alerting on sudden simultaneous termination (Sysmon EventID 5) of multiple AV/EDR services.',
      },
    ],
  };
