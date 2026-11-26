import { RANSOMWARE_SHADOW_WIPE_TELEMETRY } from './telemetry';
import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'ransomware-shadow-wipe',
  code: 'T1486 / T1490',
  name: 'LockBit Ransomware Behavioral Analysis: VSS Wipe & Fast Encryption',
  shortSubtitle: 'Ransomware · PsExec Staging, Shadow Wipe & IOCP Head-Only Encryption',
  category: 'RANSOMWARE_EXTORTION',
  severity: 'CRITICAL',
  primaryMitrePhase: 7,
  overview:
    'In LockBit Ransomware Behavioral Analysis: VSS Wipe & Fast Encryption (MITRE ATT&CK T1490 and T1486), an affiliate pivots from a breached jump-host onto corporate file server FS-CORP-01 to destroy local backups before locking thousands of files in seconds. The attack unfolds in one continuous arc: staging the LockBit binary over SMB via PsExec as SYSTEM, then deleting all Volume Shadow Copies and disabling Windows Recovery, then unleashing multi-threaded I/O Completion Port workers to encrypt only the first 4 KB to 64 KB header of every document, then bolting extortion notices across every folder and attempting to clear Security logs. Steps #1-#2 cover remote service staging and recovery sabotage; Steps #3-#4 cover high-speed head-only encryption and extortion artifacts. Primary detection: Windows System Event ID 7045, Sysmon Event ID 1 for vssadmin and bcdedit, high-velocity file-rename alerts, and Security Event ID 1102.',
  specs: [
    { term: 'MITRE TECHNIQUES', value: 'T1569.002 (PsExec) · T1490 (Shadow Wipe) · T1486 (Head-Only Encrypt)' },
    { term: 'KEY TOOLS & APIS', value: 'PSEXESVC, vssadmin.exe, bcdedit.exe, CreateIoCompletionPort, wevtutil.exe' },
    { term: 'DETECTION SOURCES', value: 'WinSec 5145 & 1102 · System 7045 & 7036 · Sysmon EID 1, 11, 13' },
    { term: 'TARGET HOST', value: 'FS-CORP-01 (10.10.50.14) · D:\\Finance_Shares\\, D:\\HR_Records\\' },
    { term: 'CIPHER MECHANISM', value: 'Intermittent Head-Only (First 4 KB-64 KB · ChaCha20 + RSA-2048)' },
    { term: 'EXTORTION ARTIFACTS', value: '.lockbit File Renames · Restore-My-Files.txt · Wallpaper Registry Hijack' },
  ],
  nodes: [
    {
      id: 'jump_host',
      label: 'JUMP-OPS-02',
      sublabel: '10.10.15.8 (Breached RDP)',
      role: 'attacker',
      x: 16,
      y: 50,
      details: {
        osOrType: 'Compromised Admin Jump-Host',
        pidOrPort: 'SMB TCP/445 -> \\\\FS-CORP-01\\ADMIN$',
        privilege: 'Stolen Domain Admin Token',
        artifacts: ['PsExec.exe \\\\FS-CORP-01 -s -d lb3_black.exe', 'Lateral SMB Share Write'],
        description:
          'Breached administrative jump-host used by the LockBit affiliate to push lb3_black.exe over SMB TCP 445 and register a remote SYSTEM service on FS-CORP-01.',
      },
    },
    {
      id: 'file_server',
      label: 'FS-CORP-01',
      sublabel: '10.10.50.14 (File Server)',
      role: 'server',
      x: 42,
      y: 36,
      details: {
        osOrType: 'Windows Server 2022 File Server',
        pidOrPort: 'D:\\Finance_Shares\\ · 4,820 Files',
        privilege: 'NT AUTHORITY\\SYSTEM (PSEXESVC)',
        artifacts: ['C:\\Windows\\PSEXESVC.exe', 'D:\\Finance_Shares\\*.lockbit', 'Restore-My-Files.txt'],
        description:
          'Primary corporate file server hosting Finance, HR, and CAD shared folders targeted for rapid parallel head-only encryption.',
      },
    },
    {
      id: 'lockbit_worker',
      label: 'lb3_black.exe',
      sublabel: 'PID 6412 (IOCP Worker Pool)',
      role: 'process',
      x: 56,
      y: 66,
      details: {
        osOrType: 'LockBit 3.0 Encryptor Binary',
        pidOrPort: 'PID 6412 · 8 IOCP Threads',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'CreateIoCompletionPort multi-thread queue',
          'ChaCha20 + RSA-2048 first 4 KB-64 KB stripe',
          'HKCU\\Control Panel\\Desktop\\Wallpaper override',
        ],
        description:
          'High-speed LockBit ransomware payload executing as SYSTEM to destroy Volume Shadow Copies and encrypt document headers in parallel.',
      },
    },
    {
      id: 'vss_archive',
      label: 'VSS & WinRE Backups',
      sublabel: 'Shadow Copies (Wiped -> 0)',
      role: 'victim_host',
      x: 78,
      y: 66,
      details: {
        osOrType: 'Volume Shadow Copy & Boot Recovery',
        pidOrPort: 'vssadmin.exe / bcdedit.exe',
        privilege: 'VSS Service Stopped (EID 7036)',
        artifacts: [
          'vssadmin.exe delete shadows /all /quiet',
          'bcdedit /set {default} recoveryenabled No',
          '0 local recovery snapshots remaining',
        ],
        description:
          'Local Windows Volume Shadow Copy snapshots and boot-time recovery options systematically destroyed before file encryption starts.',
      },
    },
    {
      id: 'siem_audit',
      label: 'SIEM & EDR Audit',
      sublabel: 'EID 7045 / 1 / 7036 / 1102',
      role: 'firewall_siem',
      x: 80,
      y: 24,
      details: {
        osOrType: 'Remote Append-Only SIEM & EDR Console',
        pidOrPort: '10.10.99.10 (Telemetry Collector)',
        privilege: 'Out-of-Band Tamper-Resistant Log',
        artifacts: [
          'System EID 7045 (PSEXESVC installed)',
          'Sysmon EID 1 (vssadmin delete shadows)',
          'WinSec EID 1102 (Security log cleared)',
        ],
        description:
          'Centralized SIEM and EDR console preserving service creation, shadow-copy deletion, mass file-rename velocity, and the unerasable EID 1102 audit-clear alert.',
      },
    },
  ],
  processTree: [
    {
      pid: 684,
      ppid: 512,
      name: 'services.exe',
      commandLine: 'C:\\Windows\\System32\\services.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: ['CreateServiceW(PSEXESVC)', 'StartServiceW'],
    },
    {
      pid: 5892,
      ppid: 684,
      name: 'PSEXESVC.exe',
      commandLine: 'C:\\Windows\\PSEXESVC.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: ['CreateProcessW(C:\\Windows\\lb3_black.exe -pass 8f91c2a0)'],
    },
    {
      pid: 6412,
      ppid: 5892,
      name: 'lb3_black.exe',
      commandLine: 'C:\\Windows\\lb3_black.exe -pass 8f91c2a0',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'CreateProcessW(vssadmin.exe delete shadows /all /quiet)',
        'CreateProcessW(bcdedit.exe /set {default} recoveryenabled No)',
        'CreateIoCompletionPort(INVALID_HANDLE_VALUE, 0, 0, 8)',
        'WriteFile(First 4 KB-64 KB ChaCha20 Header)',
        'MoveFileExW(*.lockbit)',
        'CreateFileW(Restore-My-Files.txt)',
        'RegSetValueExW(Desktop\\Wallpaper)',
      ],
    },
    {
      pid: 6504,
      ppid: 6412,
      name: 'vssadmin.exe',
      commandLine: 'vssadmin.exe delete shadows /all /quiet',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: ['IVssBackupComponents::DeleteSnapshots'],
    },
    {
      pid: 6540,
      ppid: 6412,
      name: 'bcdedit.exe',
      commandLine: 'bcdedit.exe /set {default} recoveryenabled No',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: ['NtSetSystemEnvironmentValueEx(WinRE Disabled)'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'Remote PsExec Service Staging Over SMB (ADMIN$ -> FS-CORP-01)',
      subtitle: 'Lateral Deployment via PSEXESVC as NT AUTHORITY\\SYSTEM',
      description:
        'From breached jump-host JUMP-OPS-02 (10.10.15.8), the affiliate copies lb3_black.exe over SMB TCP 445 into \\\\FS-CORP-01\\ADMIN$ and registers service PSEXESVC to launch LockBit as SYSTEM.',
      mitreTacticPhase: 2,
      mitreTechniqueId: 'T1569.002',
      mitreTechniqueName: 'System Services: Service Execution',
      activeNodeIds: ['jump_host', 'file_server', 'siem_audit'],
      compromisedNodeIds: ['jump_host', 'file_server'],
      keySpecs: [
        { term: 'SOURCE JUMP-HOST', value: 'JUMP-OPS-02 (10.10.15.8) -> SMB TCP/445' },
        { term: 'SERVICE EVENT', value: 'System EID 7045 (PSEXESVC -> lb3_black.exe)' },
        { term: 'PRIVILEGE', value: 'NT AUTHORITY\\SYSTEM on FS-CORP-01' },
      ],
    },
    {
      index: 2,
      title: 'Backup & Recovery Destruction (vssadmin, wmic, bcdedit)',
      subtitle: 'Inhibiting System Recovery & Stopping Volume Shadow Copy Service',
      description:
        'Before locking a single document, lb3_black.exe purges all Volume Shadow Copies via vssadmin delete shadows /all /quiet, disables Windows Recovery via bcdedit, and halts the VSS service.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1490',
      mitreTechniqueName: 'Inhibit System Recovery',
      activeNodeIds: ['lockbit_worker', 'vss_archive', 'siem_audit'],
      compromisedNodeIds: ['jump_host', 'file_server', 'lockbit_worker', 'vss_archive'],
      keySpecs: [
        { term: 'SHADOW WIPE', value: 'vssadmin.exe delete shadows /all /quiet (Sysmon EID 1)' },
        { term: 'BOOT SABOTAGE', value: 'bcdedit.exe /set {default} recoveryenabled No' },
        { term: 'SERVICE STOP', value: 'System EID 7036 (Volume Shadow Copy -> Stopped)' },
      ],
    },
    {
      index: 3,
      title: 'High-Speed Intermittent Head-Only Encryption via I/O Completion Ports',
      subtitle: 'Multi-Threaded First 4 KB-64 KB ChaCha20 + RSA-2048 Locking',
      description:
        'LockBit launches a CreateIoCompletionPort worker pool across all CPU cores, encrypting only the opening 4 KB to 64 KB header of each file before renaming 4,820 documents to .lockbit in seconds.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1486',
      mitreTechniqueName: 'Data Encrypted for Impact',
      activeNodeIds: ['lockbit_worker', 'file_server', 'siem_audit'],
      compromisedNodeIds: ['jump_host', 'file_server', 'lockbit_worker', 'vss_archive'],
      keySpecs: [
        { term: 'CONCURRENCY', value: 'CreateIoCompletionPort (8 Asynchronous Worker Threads)' },
        { term: 'PARTIAL STRIPE', value: 'Head-Only Encryption (First 4 KB-64 KB per Document)' },
        { term: 'VELOCITY', value: '4,820 Files Renamed to .lockbit in 11.4 Seconds' },
      ],
    },
    {
      index: 4,
      title: 'Ransom Note Drop, Wallpaper Override & Audit Log Clear Attempt',
      subtitle: 'Restore-My-Files.txt, Desktop Hijack & Un-Erasable EID 1102 Witness',
      description:
        'Worker threads write Restore-My-Files.txt inside every locked directory, hijack the desktop wallpaper registry value, and run wevtutil cl Security—triggering Security Event ID 1102 in the SIEM.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1070.004',
      mitreTechniqueName: 'Indicator Removal: Clear Windows Event Logs',
      activeNodeIds: ['lockbit_worker', 'file_server', 'siem_audit'],
      compromisedNodeIds: ['jump_host', 'file_server', 'lockbit_worker', 'vss_archive'],
      keySpecs: [
        { term: 'EXTORTION NOTE', value: 'Restore-My-Files.txt Dropped Everywhere (Sysmon EID 11)' },
        { term: 'DESKTOP HIJACK', value: 'Sysmon EID 13 (HKCU\\Control Panel\\Desktop\\Wallpaper)' },
        { term: 'SIEM WITNESS', value: 'WinSec EID 1102 (Security Audit Log Cleared)' },
      ],
    },
  ],
  telemetry: RANSOMWARE_SHADOW_WIPE_TELEMETRY,
};

export const stepGuide: RawScenarioStepGuideData = {
  scenarioId: 'ransomware-shadow-wipe',
  briefing: {
    headline:
      'Scenario Briefing: LockBit Ransomware Behavioral Analysis — VSS Wipe & Fast Encryption (MITRE T1490 / T1486)',
    storyAnalogy:
      'Picture a busy municipal records hall divided into two wings: on the left sits a climate-controlled safety archive with four spinning silver microfilm backup reels beside an emergency green recovery lever, and on the right stand four glass-fronted filing vaults stacked with crisp white paper ledgers. Suddenly, an armored brass dispatch capsule shoots down an overhead service chute from a remote hallway, unlocks the hall master breaker, and wakes a roaring industrial ribbon shredder. Before touching a single active ledger, the saboteur feeds all four silver backup reels straight into the shredder teeth until silver confetti fills the bin and snaps the green recovery lever clean off its hinge. Instantly, four synchronized overhead stamping arms plunge in parallel across all four filing vaults—stamping a blazing crimson lock band strictly across the top header strip of every ledger stack while leaving the lower white pages untouched—slamming four heavy cast-iron padlocks shut and bolting a giant crimson extortion notice across the glass entrance door while the ceiling audit lamp flashes bright violet.',
    plainSummary:
      'In this scenario (MITRE ATT&CK T1569.002, T1490, and T1486) targeting corporate file server FS-CORP-01 (10.10.50.14), a LockBit 3.0 affiliate executes an automated recovery-destruction and rapid head-only encryption blitz. The attack unfolds in one continuous arc: remote PsExec service deployment over SMB as SYSTEM, then systematic Volume Shadow Copy deletion and boot-recovery disabling, then high-speed multi-threaded I/O Completion Port encryption of only the opening 4 KB to 64 KB of every document, then mass extortion-note placement paired with an Event Log clearing attempt. Steps #1-#4 trace each forensic artifact from System Event ID 7045 through Sysmon Event ID 1, mass .lockbit renames, and Security Event ID 1102.',
    diagramTopologySummary:
      'On the diagram: Start at Node ① (JUMP-OPS-02 10.10.15.8) pushing the PsExec service to Node ② (FS-CORP-01 10.10.50.14), watch Node ③ (lb3_black.exe PID 6412) wipe Node ④ (VSS & WinRE Backups) before encrypting Node ② shares at high speed, while Node ⑤ (SIEM & EDR Audit) captures Event IDs 7045, 1, 7036, 11, and 1102.',
    documentedAdvisory:
      'CISA / FBI / MS-ISAC Joint Advisory AA23-165A (LockBit 3.0) · Microsoft VSS & Sysmon EID 1/11 · MITRE T1490 & T1486',
  },
  steps: [
    {
      stepNumber: 1,
      mitreId: 'T1569.002',
      plainTitle: 'Staging LockBit Over SMB & Installing Remote PSEXESVC as SYSTEM',
      storyAnalogy:
        'From an outside hallway chute, an armored brass dispatch capsule streaks straight into the records hall service hatch, latches tightly into the wall socket, and pulls the heavy master power breaker all the way down—granting full building-wide master control while an overhead ceiling audit ticker immediately stamps a warning light.',
      simpleExplanation:
        'The LockBit affiliate begins from an already compromised administrative jump-host named JUMP-OPS-02 (10.10.15.8, holding stolen Domain Administrator credentials) and reaches corporate file server FS-CORP-01 (10.10.50.14) across SMB TCP port 445 (Windows file-sharing protocol used for remote administration). First, the operator copies the ransomware binary lb3_black.exe directly into the hidden \\\\FS-CORP-01\\ADMIN$ administrative share (which maps to C:\\Windows\\ on the file server). Next, PsExec.exe instructs the remote Windows Service Control Manager (services.exe, PID 684) to register and start a temporary service named PSEXESVC (PID 5892) running under NT AUTHORITY\\SYSTEM (the highest local privilege on Windows, capable of stopping backup services and overwriting any shared folder). Immediately, PSEXESVC spawns C:\\Windows\\lb3_black.exe -pass 8f91c2a0 (passing a required runtime decryption password so automated sandboxes cannot execute the binary without the affiliate key).',
      howItWorksInPractice:
        'Remote PsExec execution follows a deterministic RPC and SMB sequence: the attacker authenticates over SMB TCP 445 (recorded in Windows Security Event ID 5145 when the executable writes to the ADMIN$ share), connects to the remote SVCCTL named pipe (Service Control Manager RPC interface used to create Windows services over the network), invokes CreateServiceW for PSEXESVC, and calls StartServiceW (which immediately writes Windows System Event ID 7045 with ServiceName = PSEXESVC and AccountName = LocalSystem). Running lb3_black.exe with the -pass command-line switch is a documented LockBit 3.0 anti-analysis guard (the binary decrypts its own configuration and RSA-2048 public key in memory only when the correct operator password is supplied on the command line).',
      diagramAlignment:
        'On the diagram, Step #1 travels from Node ① (JUMP-OPS-02 10.10.15.8) over SMB TCP 445 into Node ② (FS-CORP-01 10.10.50.14), launching Node ③ (lb3_black.exe PID 6412) while Node ⑤ (SIEM & EDR Audit) records Event ID 5145 and System Event ID 7045.',
      detectionAndEvidence:
        'Documented in Windows Security Event ID 5145 (network share write to ADMIN$ from 10.10.15.8) correlated with Windows System Event ID 7045 (PSEXESVC installed as LocalSystem) and Sysmon Event ID 1 (PSEXESVC.exe launching lb3_black.exe with a -pass argument).',
    },
    {
      stepNumber: 2,
      mitreId: 'T1490',
      plainTitle: 'Shredding All Volume Shadow Copies & Snapping Boot Recovery',
      storyAnalogy:
        'Before touching a single active ledger drawer, the saboteur marches straight to the left safety archive, pulls all four spinning silver backup reels off their spindles, and feeds them directly into a roaring twin-roller steel shredder until silver ribbons overflow the floor bin—then slams a striker across the green emergency recovery lever, snapping the handle cleanly off its hinge.',
      simpleExplanation:
        'A smart ransomware operator never starts encrypting active files while Windows still holds clean Volume Shadow Copies (automatic point-in-time filesystem snapshots managed by the Volume Shadow Copy Service that let administrators restore encrypted folders in minutes without paying a ransom). Running with NT AUTHORITY\\SYSTEM privileges inside FS-CORP-01, lb3_black.exe (PID 6412) launches vssadmin.exe delete shadows /all /quiet (PID 6504, instructing Windows to wipe every stored shadow snapshot silently with no confirmation prompt) and wmic.exe shadowcopy delete /nointeractive (a backup WMI method ensuring no snapshots survive). Immediately afterward, it runs bcdedit.exe /set {default} recoveryenabled No and bootstatuspolicy ignoreallfailures (PID 6540, disabling the built-in Windows Recovery Environment so rebooting the server cannot trigger automatic startup repair), and sends stop commands to the VSS and database services so open corporate files release their locks.',
      howItWorksInPractice:
        'Under the hood, vssadmin.exe calls the COM interface IVssBackupComponents::DeleteSnapshots (instructing the volsnap.sys storage filter driver to discard every copy-on-write diff area stored inside System Volume Information), while bcdedit.exe writes directly to the Boot Configuration Data store (flipping the WinRE recovery flags so emergency recovery menus stay unavailable). Because these native Windows utilities execute as separate child processes of lb3_black.exe, Sysmon Event ID 1 (ProcessCreate logging both the exact command lines and parent PID 6412) combined with Windows System Event ID 7036 (logging the Volume Shadow Copy service entering the Stopped state) provide one of the highest-confidence, lowest-false-positive ransomware indicators in DFIR.',
      diagramAlignment:
        'On the diagram, Step #2 drives from Node ③ (lb3_black.exe PID 6412) directly into Node ④ (VSS & WinRE Backups), purging every local snapshot while Node ⑤ (SIEM & EDR Audit) captures Sysmon Event ID 1 and System Event ID 7036.',
      detectionAndEvidence:
        'Documented in Sysmon Event ID 1 (lb3_black.exe spawning vssadmin.exe delete shadows /all /quiet and bcdedit.exe /set {default} recoveryenabled No) paired with Windows System Event ID 7036 (VSS service stopped) and VSS Event ID 8224.',
    },
    {
      stepNumber: 3,
      mitreId: 'T1486',
      plainTitle: 'High-Speed Parallel Head-Only Encryption via I/O Completion Ports',
      storyAnalogy:
        'With every backup reel reduced to silver confetti, four synchronized overhead stamping arms sweep down across all four glass filing vaults at blistering speed—visibly scorching a crimson lock band strictly across the top header strip of each ledger stack while leaving the lower white pages completely untouched—and snap four heavy crimson cast-iron padlocks across the vault latches.',
      simpleExplanation:
        'Traditional ransomware that encrypts every single megabyte of a 20-gigabyte database or CAD archive runs slowly, giving defenders precious minutes to pull the network plug. LockBit 3.0 defeats that defense with two engineering optimizations working together: first, lb3_black.exe uses Windows I/O Completion Ports (an asynchronous kernel thread-pool mechanism via CreateIoCompletionPort that keeps all CPU cores and disk queues saturated simultaneously without waiting on slow sequential reads). Second, it performs intermittent head-only encryption—for each target file across D:\\Finance_Shares\\, D:\\HR_Records\\, and D:\\CAD_Archives\\, worker threads generate a unique ChaCha20 symmetric key (wrapped safely with the attacker embedded RSA-2048 public key so nobody can decrypt without the private key), encrypt ONLY the opening 4 KB to 64 KB header stripe (enough to make Excel, SQL, PDF, and CAD files completely unreadable), and rename each file with the .lockbit extension—locking 4,820 documents in just 11.4 seconds.',
      howItWorksInPractice:
        'During Stage 3, lb3_black.exe calls CreateIoCompletionPort (creating a kernel-managed completion queue shared by 8 parallel worker threads matched to FS-CORP-01 logical cores) and dispatches overlapped asynchronous ReadFile and WriteFile operations (eliminating idle CPU wait time between disk I/O bursts). Because each file only requires encrypting its initial 4 KB to 64 KB block (typically the ZIP central header, PDF catalog, or database page zero) plus appending a 256-byte RSA-2048 encrypted session-key footer before calling MoveFileExW to append .lockbit, total disk bytes written stay tiny while business impact hits 100%—leaving behind a sharp high-entropy spike in Windows Security Event ID 4663 (Object Access write bursts) and EDR canary-file tripwires.',
      diagramAlignment:
        'On the diagram, Step #3 pulses rapidly between Node ③ (lb3_black.exe PID 6412) and Node ② (FS-CORP-01 D:\\Finance_Shares\\), locking 4,820 files to .lockbit while Node ⑤ (SIEM & EDR Audit) registers the high-velocity WinSec Event ID 4663 I/O burst.',
      detectionAndEvidence:
        'Documented in EDR Behavioral Ransomware Telemetry (4,820 files header-encrypted and renamed to .lockbit in 11.4 seconds via CreateIoCompletionPort) correlated with Windows Security Event ID 4663 rapid write bursts and canary-file alerts.',
    },
    {
      stepNumber: 4,
      mitreId: 'T1070.004',
      plainTitle: 'Dropping Extortion Notices, Hijacking Wallpaper & Triggering Audit Clear EID 1102',
      storyAnalogy:
        'With every filing vault padlocked shut, a mechanical placard press bolts a giant crimson extortion notice directly onto the glass entrance door and flips the hall display monitor solid red—and when the saboteur tries to smash the overhead audit ticker to erase their tracks, a protected ceiling glass beacon flares unmistakable bright violet across the entire room.',
      simpleExplanation:
        'Once encryption wraps up across FS-CORP-01, LockBit ensures victims immediately see the extortion demand and tries to slow down forensic responders. Worker threads drop Restore-My-Files.txt inside every affected folder (logged by Sysmon Event ID 11 FileCreate, containing the victim personal ID and Tor negotiation portal), generate a custom bitmap image, and overwrite HKCU\\Control Panel\\Desktop\\Wallpaper in the Windows Registry (logged by Sysmon Event ID 13 RegistryEvent so anyone logging into FS-CORP-01 sees the LockBit ransom wall). Finally, lb3_black.exe invokes wevtutil.exe cl Security (attempting to wipe local Windows Security logs before self-deleting)—an action that automatically forces Windows to write an unerasable Security Event ID 1102 ("The audit log was cleared") straight into the remote append-only SIEM.',
      howItWorksInPractice:
        'Mass creation of identical ransom note filenames (Restore-My-Files.txt across hundreds of directories logged by Sysmon Event ID 11) combined with registry persistence edits on Control Panel\\Desktop\\Wallpaper (Sysmon Event ID 13 via RegSetValueExW) provides immediate post-impact scoping of every affected share. Critically, Windows protects audit-log tampering by mandating that any successful wevtutil.exe cl Security or OpenEventLog/ClearEventLog call generates Event ID 1102 as the very first entry of the fresh log—confirming hostile anti-forensics even if local historical logs were purged before forwarding.',
      diagramAlignment:
        'On the diagram, Step #4 completes from Node ③ (lb3_black.exe PID 6412) across Node ② (FS-CORP-01) and fires an unerasable Event ID 1102 witness directly into Node ⑤ (SIEM & EDR Audit).',
      detectionAndEvidence:
        'Documented in Sysmon Event ID 11 (mass Restore-My-Files.txt creation), Sysmon Event ID 13 (Desktop\\Wallpaper registry override), and Windows Security Event ID 1102 (Security Audit Log cleared via wevtutil.exe cl Security).',
    },
  ],
};

export * from './choreography';
export * from './telemetry';
