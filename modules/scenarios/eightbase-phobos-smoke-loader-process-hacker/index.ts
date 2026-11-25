import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'eightbase-phobos-smoke-loader-process-hacker',
    title: 'CISA AA24-045A & Cisco Talos — 8Base / Phobos Ransomware: SmokeLoader Delivery, Process Hacker (kprocesshacker.sys) Service Kill & AES-256 Encryption (.8base)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1486',
    description:
      'Grounded in CISA/FBI/MS-ISAC Joint Cybersecurity Advisory AA24-045A (#StopRansomware: Phobos / 8Base Ransomware) and Cisco Talos research: 8Base affiliates deliver a customized Phobos ransomware payload via SmokeLoader and SystemBC, use Process Hacker (`kprocesshacker.sys`) and batch scripts to kill security/backup services and wipe shadow copies, and encrypt files with AES-256 + RSA-1024 appending `.id[<id>].[support@8base.vc].8base`.',
    NodesGenerator: () => [
      { id: 'attacker', label: '8Base / Phobos Operator (SmokeLoader + SystemBC)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'ProcessHacker.exe (kprocesshacker.sys)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Windows Server (vssadmin + bcdedit + firewall off)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'CISA AA24-045A / Talos EDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Enterprise Shares (.8base + info.hta)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: SmokeLoader / SystemBC SOCKS5 Proxy & Process Hacker (`kprocesshacker.sys`) Staging',
        narration:
          '8Base affiliates gain initial access via exposed RDP or phishing attachments delivering `SmokeLoader` (which injects into `explorer.exe`), establish a persistent `SystemBC` Tor/SOCKS5 backdoor, and deploy `ProcessHacker.exe` (`kprocesshacker.sys`) alongside ` HRSword` / `GMER` to terminate endpoint antivirus and EDR agents.',
        activeNodes: ['attacker', 'firewall', 'target', 'siem'],
        mitreTactic: 'Initial Access & Defense Evasion (T1055 / T1562.001 / T1068)',
        technicalCommands: [
          'explorer.exe (Injected SmokeLoader payload downloads SystemBC SOCKS5 proxy & Phobos/8Base loader)',
          'sc.exe create KProcessHacker2 binPath= "C:\\Users\\Public\\kprocesshacker.sys" type= kernel && sc.exe start KProcessHacker2',
        ],
        defenseMitigation:
          'Block `kprocesshacker.sys` via Microsoft Vulnerable Driver Blocklist and monitor `explorer.exe` initiating outbound connections to unusual IP addresses.',
        logs: [
          {
            id: '8base-1',
            timestamp: '09:04:12.118',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 6,
            ProcessName: 'ProcessHacker.exe',
            raw: 'EventID: 6 | ImageLoaded: C:\\Users\\Public\\kprocesshacker.sys | InvokingProcess: ProcessHacker.exe | PrecedingLoader: SmokeLoader in explorer.exe + SystemBC | Advisory: CISA AA24-045A',
            parsedFields: {
              InitialLoader: 'SmokeLoader + SystemBC SOCKS5 Backdoor',
              KernelDriverAbused: 'kprocesshacker.sys (Process Hacker 2 Driver)',
              AdvisoryId: 'CISA AA24-045A (#StopRansomware: Phobos / 8Base)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: UAC Bypass, Windows Firewall Disablement (`netsh`) & Shadow Copy / Boot Recovery Wipe',
        narration:
          'The Phobos/8Base payload copies itself to `%APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup` and `HKLM\\...\\Run` for persistence, disables the Windows Firewall via `netsh advfirewall set allprofiles state off`, and executes `vssadmin`, `wmic`, `wbadmin`, and `bcdedit` in a tight loop to prevent system recovery.',
        activeNodes: ['target', 'siem'],
        mitreTactic: 'Defense Evasion & Impact Preparation (T1562.004 - Disable Firewall / T1490)',
        technicalCommands: [
          'vssadmin.exe delete shadows /all /quiet && wmic.exe shadowcopy delete',
          'bcdedit.exe /set {default} bootstatuspolicy ignoreallfailures && bcdedit.exe /set {default} recoveryenabled no',
          'netsh.exe advfirewall set allprofiles state off',
        ],
        defenseMitigation:
          'Alert on sequential execution of `vssadmin delete shadows`, `bcdedit /set {default} recoveryenabled no`, and `netsh advfirewall set allprofiles state off` within a 5-second window.',
        logs: [
          {
            id: '8base-2',
            timestamp: '09:06:31.509',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'netsh.exe',
            CommandLine: 'netsh.exe advfirewall set allprofiles state off',
            raw: 'EventID: 1 | ParentImage: C:\\Users\\Public\\phobos_8base.exe | Image: C:\\Windows\\System32\\netsh.exe | CommandLine: netsh advfirewall set allprofiles state off | PrecedingCommands: vssadmin delete shadows + bcdedit recoveryenabled no',
            parsedFields: {
              FirewallModification: 'netsh advfirewall set allprofiles state off',
              RecoveryInhibition: 'vssadmin + wmic shadowcopy + wbadmin + bcdedit',
              StartupPersistence: 'Startup Folder + HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Phobos AES-256-CBC Encryption, `.8base` Extension Rename & `info.hta` HTML Application Note',
        narration:
          '8Base encrypts all non-system files using AES-256-CBC (encrypting files under 1.5 MB completely and larger files partially before protecting the per-victim AES key with an embedded RSA-1024 public key), renames files to `<filename>.id[<8_hex_id>].[support@8base.vc].8base`, and launches `mshta.exe C:\\info.hta` to display a full-screen extortion notice.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact / T1218.005 - Mshta)',
        technicalCommands: [
          'phobos_8base.exe -> Encrypts files with AES-256-CBC + RSA-1024 -> *.id[A1B2C3D4].[support@8base.vc].8base',
          'mshta.exe "C:\\Users\\Public\\info.hta" (Displays HTML Application ransom demand)',
        ],
        defenseMitigation:
          'Block `mshta.exe` execution via Attack Surface Reduction (ASR) rules and isolate hosts creating `.8base` or `info.hta` artifacts.',
        logs: [
          {
            id: '8base-3',
            timestamp: '09:09:48.882',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'phobos_8base.exe',
            raw: 'EventID: 11 | Image: C:\\Users\\Public\\phobos_8base.exe | TargetFilename: D:\\Accounting\\Payroll.xlsx.id[8F2A1C9E].[support@8base.vc].8base | RansomNote: info.hta & info.txt',
            parsedFields: {
              RansomwareFamily: '8Base (Phobos Ransomware-as-a-Service Variant)',
              FilePattern: '*.id[<victim_id>].[support@8base.vc].8base',
              HtmlRansomNote: 'info.hta launched via mshta.exe',
            },
          },
        ],
        packets: [],
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a street-level burglary crew that slips into an office through an open desk door or booby-trapped attachment, opens a hidden relay pipe and borrows a signed technician wrench to disable security guards, then climbs past the desk confirmation prompt to tear down the firewall, snap the emergency-recovery levers off the wall, and clamp heavy locks onto every cabinet while popping open a full-screen ransom placard on every desk.',
      storyMappings: [
        {
          storyTerm: 'Hidden relay pipe and signed technician wrench disabling guards',
          technicalTerm: 'SmokeLoader, SystemBC SOCKS5 proxy, and Process Hacker (kprocesshacker.sys) BYOVD',
          tone: 'amber',
        },
        {
          storyTerm: 'Climbing past confirmation prompts to tear down fences and recovery levers',
          technicalTerm: 'UAC bypass, netsh firewall disablement, and vssadmin / bcdedit recovery wipe',
          tone: 'sky',
        },
        {
          storyTerm: 'Clamping heavy locks onto small files whole and huge files in chunks',
          technicalTerm: 'Phobos AES-256-CBC encryption renaming files with the .8base extension',
          tone: 'rose',
        },
        {
          storyTerm: 'Popping open a full-screen ransom placard on every desk',
          technicalTerm: 'info.hta HTML Application ransom notice launched via mshta.exe',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Slipping onto a victim workstation through an exposed remote-desktop doorway or poisoned email attachment, a compact delivery agent sets up a quiet relay pipe and deploys a signed system-diagnostics driver to knock out active endpoint guards.',
        storyMappings: [
          {
            storyTerm: 'Compact delivery agent from a poisoned doorway',
            technicalTerm: 'SmokeLoader delivered via exposed RDP or phishing attachments',
            tone: 'amber',
          },
          {
            storyTerm: 'Quiet relay pipe bridging back to operators',
            technicalTerm: 'SystemBC SOCKS5 proxy maintaining persistent C2 tunneling',
            tone: 'sky',
          },
          {
            storyTerm: 'Signed system-diagnostics wrench knocking out guards',
            technicalTerm: 'Abused Process Hacker kernel driver (kprocesshacker.sys) terminating security agents',
            tone: 'rose',
          },
          {
            storyTerm: 'Clearing the host before lockdown',
            technicalTerm: 'Initial foothold and defense evasion preparing for Phobos/8Base detonation',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Planting copies of itself inside both the morning startup folder and the master launch registry so it survives reboots, the payload hops past user permission prompts, shuts off the building firewall walls, and cuts off both shadow backups and emergency boot-repair switches.',
        storyMappings: [
          {
            storyTerm: 'Planting copies in the startup folder and launch registry',
            technicalTerm: 'Persistence in %APPDATA%\\...\\Startup and HKLM Run keys',
            tone: 'amber',
          },
          {
            storyTerm: 'Hopping past user permission prompts',
            technicalTerm: 'User Account Control (UAC) bypass elevating to high integrity',
            tone: 'sky',
          },
          {
            storyTerm: 'Shutting off the building firewall walls',
            technicalTerm: 'netsh advfirewall set allprofiles state off disabling host firewall rules',
            tone: 'rose',
          },
          {
            storyTerm: 'Cutting off backups and boot-repair switches',
            technicalTerm: 'Deleting Volume Shadow Copies and disabling Windows recovery via bcdedit',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Sweeping across every non-system drawer on the machine, the Phobos locking engine seals small documents completely and seals giant files rapidly in slices, stamps every locked item with an 8base tag, and pops open an interactive ransom placard right on the desktop.',
        storyMappings: [
          {
            storyTerm: 'Sealing small documents whole and giant files in slices',
            technicalTerm: 'Phobos AES-256-CBC full encryption under 1.5 MB and partial encryption on larger files',
            tone: 'amber',
          },
          {
            storyTerm: 'Stamping every locked item with a branded tag',
            technicalTerm: 'Encrypted files renamed with the .8base suffix and victim identifier',
            tone: 'sky',
          },
          {
            storyTerm: 'Interactive ransom placard popped onto the desktop',
            technicalTerm: 'info.hta HTML Application rendered automatically on infected hosts',
            tone: 'rose',
          },
          {
            storyTerm: 'Shared Phobos criminal family lineage',
            technicalTerm: '8Base affiliate configuration running atop the established Phobos encryptor',
            tone: 'emerald',
          },
        ],
      },
    },
  };
