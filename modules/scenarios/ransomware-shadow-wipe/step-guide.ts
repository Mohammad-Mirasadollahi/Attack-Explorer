import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'ransomware-shadow-wipe',
    briefing: {
      headline: 'Scenario Briefing: Ransomware Pre-Encryption: Wiping Volume Shadow Copies (MITRE T1490 / T1486)',
      storyAnalogy:
        'Imagine an extortionist who plans to put heavy padlocks on every filing cabinet in an office and demand a ransom for the keys. Before clicking a single padlock shut, the first thing they do is walk into the back storage room and shred every photocopy and backup microfilm reel (vssadmin delete shadows /all /quiet), so the office manager cannot simply ignore the padlocks and pull out yesterday’s copies.',
      plainSummary:
        'This scenario (MITRE T1490 then T1486) follows LockBit 3.0 on a corporate file server: lb3_payload.exe (PID 5540) wipes all Volume Shadow Copy backups and turns off boot recovery, then encrypts shared data and leaves a ransom note. Step #1 covers shadow-copy deletion via vssadmin and recovery policy changes; Step #2 covers fast multi-threaded encryption and note placement. Primary detection hinges on Sysmon ProcessCreate showing a unknown parent spawning vssadmin delete shadows /all /quiet immediately before mass .lockbit renames.',
      diagramTopologySummary:
        'On the diagram: Start at Node ③ (Target File Server) and Node ④ (lb3_payload.exe PID 5540 → vssadmin.exe PID 5812), follow Step #1 (#1→) wiping all VSS shadow copies inside Node ⑤ (NTFS File System & VSS Subsystem), and trace Step #2 (#2→) performing high-speed intermittent file encryption (*.lockbit) and dropping Restore-My-Files.txt (4.1 KB) while Node ⑥ (EDR Canary & SIEM) triggers containment.',
      documentedAdvisory: 'CISA StopRansomware Guide · MITRE ATT&CK T1490 & T1486 · Sysmon EventID 1 / 11 · Windows EventID 8222',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1490',
        plainTitle: 'Deleting All Windows Volume Shadow Copies & Disabling Boot Recovery (vssadmin delete shadows /all /quiet)',
        storyAnalogy:
          'The extortionist slips into the archive room with an administrator master key, orders the archive clerk (vssadmin.exe / vssvc.exe) to silently incinerate every backup snapshot on the shelves without asking for confirmation (/quiet), and disconnects the emergency recovery switch (bcdedit recoveryenabled No).',
        simpleExplanation:
          'Before encrypting a single document, the LockBit 3.0 payload (C:\\Windows\\Temp\\lb3_payload.exe -pass a8f9102b, PID 5540, running with High/Administrator integrity under CORP\\admin_srv after registering mutex Global\\39481-LB3 and stopping backup services via ControlService) calls CreateProcessW to spawn C:\\Windows\\System32\\vssadmin.exe delete shadows /all /quiet (PID 5812, where "delete shadows /all" instructs the Windows Volume Shadow Copy Service to permanently erase every local backup snapshot on the drive so the victim cannot restore clean files for free, and "/quiet" suppresses confirmation prompts). Immediately after, it runs bcdedit /set {default} recoveryenabled No to disable Windows Automatic Repair boot recovery.',
        howItWorksInPractice:
          'When vssadmin.exe delete shadows /all /quiet (PID 5812, PPID 5540) executes, it invokes IVssBackupComponents::DeleteSnapshots over COM to the Volume Shadow Copy service (vssvc.exe) to drop all copy-on-write shadow storage diff areas on the NTFS volume (because this pre-encryption step happens before file encryption starts, an EDR rule that kills parent PID 5540 the instant Sysmon Event ID 1 logs vssadmin delete shadows stops the ransomware before data loss occurs).',
        diagramAlignment:
          'On the diagram, follow Step #1 / Link #1 (#1→ / ⇠#1) from Node ④ (lb3_payload.exe PID 5540 → vssadmin.exe PID 5812) to Node ⑤ (VSS & WMI Subsystem), wiping all VSS snapshots and triggering Sysmon Event ID 1 on Node ⑥ (EDR Canary & SIEM).',
        detectionAndEvidence:
          'Documented in Sysmon EventID 1 (ProcessId = 5812, CommandLine = "vssadmin.exe delete shadows /all /quiet", ParentProcessId = 5540, ParentImage = "C:\\Windows\\Temp\\lb3_payload.exe", User = CORP\\admin_srv).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1486',
        plainTitle: 'Multi-Threaded Intermittent File Encryption (AES-NI) & Dropping the Ransom Note',
        storyAnalogy:
          'With every backup copy destroyed and the emergency recovery switch disabled, the crew fans out across every floor using high-speed power tools to lock only the front latch (first 64 KB) of every filing cabinet in seconds, taping a ransom note (Restore-My-Files.txt) onto every desk.',
        simpleExplanation:
          'With local recovery paths eliminated, lb3_payload.exe (PID 5540) uses Windows I/O Completion Ports (an asynchronous multi-threaded disk subsystem that saturates all CPU cores at once) and Intermittent Encryption, encrypting only the first 64 KB of each file on D:\\Shares\\Finance\\* (such as renaming Q4_Budget.xlsx to Q4_Budget.xlsx.lockbit via MoveFileExW) using hardware-accelerated AES-256-NI + RSA-2048 session key wrapping (destroying each file’s 64 KB header so thousands of files are locked in seconds before defenders can react), and writes the 4.1 KB ransom note D:\\Shares\\Finance\\Restore-My-Files.txt in every directory.',
        howItWorksInPractice:
          'Full-file encryption on multi-gigabyte databases takes minutes and generates sustained disk I/O spikes that behavioral anti-ransomware minifilters easily spot. Encrypting only the first 64 KB header via MoveFileExW(*.lockbit) and dropping the 4.1 KB Restore-My-Files.txt note ruins file structures at a fraction of the I/O cost (triggering Sysmon Event ID 11 FileCreate alerts and EDR canary file tripwires that isolate the host).',
        diagramAlignment:
          'On the diagram, Step #2 / Link #2 (#2→ / ⇠#2) runs from Node ④ (lb3_payload.exe PID 5540) into Node ⑤ (NTFS File System D:\\Shares\\Finance\\*), renaming files to .lockbit and dropping Restore-My-Files.txt (4.1 KB) while Node ⑥ (EDR Canary & SIEM) triggers Sysmon Event ID 11 host isolation.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 11 (ProcessId = 5540, Image = C:\\Windows\\Temp\\lb3_payload.exe, TargetFilename = D:\\Shares\\Finance\\Restore-My-Files.txt [4.1 KB] and Q4_Budget.xlsx.lockbit) & EDR canary file tripwires.',
      },
    ],
  };
