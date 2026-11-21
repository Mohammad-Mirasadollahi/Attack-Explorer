import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'blackbasta-qakbot-backstab-ransomware',
    briefing: {
      headline:
        'Black Basta affiliates (Storm-1811) flood victim inboxes with spam before calling via Microsoft Teams impersonating IT Help Desk to coerce Windows Quick Assist execution, deploy Backstab (PROCEXP.SYS BYOVD) to blind EDR, and detonate ChaCha20 encryption (.basta).',
      storyAnalogy:
        'Imagine an extortion crew dumps 2,000 junk mail catalogs through an employee’s mail slot in five minutes. While the employee is overwhelmed, the crew rings the internal office video intercom wearing an "IT Help Desk" badge, says "We see your mailbox is glitching, press Ctrl+Win+Q so we can fix it," and tricks the employee into opening the side service door (QuickAssist.exe), through which they blind the guards (Backstab) and lock the building.',
      plainSummary:
        'In this scenario (T1566.004, Black Basta Teams Vishing, Quick Assist, Backstab EDR Bypass & ChaCha20 (AA24-131A)), the attacker follows one continuous arc: email Bombing, External Microsoft Teams Vishing, then backstab EDR Handle Killer, then vssadmin Shadow Wipe. Steps #1–#3 examine #1 Email Bombing, External Microsoft Teams Vishing; #2 Backstab EDR Handle Killer; #3 vssadmin Shadow Wipe. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'Storm-1811 / Black Basta Operator -> Microsoft Teams External Federation -> Workstation (QuickAssist.exe Session) -> Enterprise Shares (.basta ChaCha20) -> CISA AA24-131A / Defender XDR Sensor.',
      documentedAdvisory:
        'CISA / FBI / HHS Joint Advisory AA24-131A (#StopRansomware: Black Basta) / Microsoft Storm-1811 Analysis / Trend Micro Report',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1566.004',
        plainTitle: 'Email Bombing, External Microsoft Teams Vishing & QuickAssist.exe Abuse',
        storyAnalogy:
          'First the scammer jams the victim’s mailbox with thousands of magazines to create panic, then calls on the internal intercom pretending to be the mailroom technician offering to clean it up.',
        simpleExplanation:
          'Storm-1811 bombarded the target’s corporate email address with thousands of automated newsletter registrations (creating both distraction and a believable pretext for an urgent IT call, while burying real security alert emails in the flood), then initiated an external federated Microsoft Teams call impersonating "IT Help Desk" and instructed the user to launch C:\\Windows\\System32\\QuickAssist.exe (a pre-installed, Microsoft-signed remote support binary that establishes an encrypted outbound screen-sharing and remote-control session via *.remoteassistance.support.services.microsoft.com).',
        howItWorksInPractice:
          'Because QuickAssist.exe is natively included in Windows 10/11 and communicates exclusively with legitimate *.microsoft.com relay servers over HTTPS, standard perimeter firewalls and web proxies allow the session by default. In the documented EventID 1 exchange from Storm-1811 / Black Basta Operator to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK 1 (confirming that the C:\Windows\System32\QuickAssist.exe request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: Backstab EDR Handle Killer & SoftPerfect / Rclone Lateral Staging).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Storm-1811 Operator through Microsoft Teams External Federation to the Workstation (QuickAssist.exe Session).',
        detectionAndEvidence:
          'Correlating high-volume inbound SMTP spam spikes with external Microsoft Teams calls and Sysmon EventID 1 execution of QuickAssist.exe.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: 'Backstab EDR Handle Killer & SoftPerfect / Rclone Lateral Staging',
        storyAnalogy:
          'Once inside via the remote-support screen, the intruder runs a tool that pries open the fingers of the security guards so they drop their weapons, maps the floorplan, and bags up the files.',
        simpleExplanation:
          'Inside the QuickAssist.exe session, the operator used curl.exe or msiexec.exe to stage payloads, executed Backstab (backstab.exe -n MsMpEng.exe -k, an open-source BYOVD utility that loads the signed Sysinternals PROCEXP.SYS driver to enumerate and forcibly close every kernel object and file handle held by Protected Process Light EDR agents), scanned internal subnets with SoftPerfect Network Scanner (netscan.exe), and exfiltrated sensitive shares using rclone.exe.',
        howItWorksInPractice:
          'Closing all kernel handles held by an EDR process via Backstab renders the security sensor deaf and unable to inspect files or processes even if the main user-mode .exe appears running in Task Manager. In the documented EventID 1 exchange from Perimeter Firewall & NDR Tap to Microsoft Teams External Federation, Microsoft Teams External Federation responds with ALERT 1 (confirming that the C:\Users\Public\backstab.exe -n MsMpEng.exe -k request succeeded on Microsoft Teams External Federation and establishing the runtime state required for Step #3 Stage 3: vssadmin Shadow Wipe & Black Basta ChaCha20/RSA-4096 Encryption (.basta)).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Workstation (QuickAssist.exe) to the CISA AA24-131A / Defender XDR Sensor as Backstab and netscan.exe execute.',
        detectionAndEvidence:
          'Sysmon EventID 1 & 6 alerting on QuickAssist.exe spawning cmd.exe/powershell.exe/msiexec.exe and backstab.exe loading PROCEXP.SYS.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1486',
        plainTitle: 'vssadmin Shadow Wipe & Black Basta ChaCha20/RSA-4096 Encryption (.basta)',
        storyAnalogy:
          'After deleting the building’s backup snapshots, the encryptor races through every shared folder, scrambling 64 bytes out of every 192 bytes so files are ruined in seconds.',
        simpleExplanation:
          'Pivoting across the domain with PsExec or WMI, the operator ran vssadmin.exe delete shadows /all /quiet to destroy Volume Shadow Copies and executed the C++ Black Basta encryptor (basta.exe -forcepath, which uses a multi-threaded XChaCha20 stream cipher to encrypt 64-byte blocks alternating with 128-byte unencrypted gaps for maximum throughput, protects the per-file key with RSA-4096, appends .basta, and drops readme.faa.txt).',
        howItWorksInPractice:
          'By encrypting 64 bytes and skipping 128 bytes across large files, Black Basta corrupts multi-terabyte file servers in minutes before administrators can pull network cables. In the documented EventID 11 exchange from Microsoft Teams External Federation to Workstation (QuickAssist.exe Session), Workstation (QuickAssist.exe Session) responds with ACK 11 (confirming that the basta.exe request succeeded on Workstation (QuickAssist.exe Session) and completing the final execution objective of Black Basta Teams Vishing, Quick Assist, Backstab EDR Bypass & ChaCha20 (AA24-131A)).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the Workstation deploying basta.exe across Enterprise Shares (.basta ChaCha20).',
        detectionAndEvidence:
          'EDR behavioral blocking of vssadmin.exe delete shadows and detection of .basta file renames and readme.faa.txt ransom note creation.',
      },
    ],
  };
