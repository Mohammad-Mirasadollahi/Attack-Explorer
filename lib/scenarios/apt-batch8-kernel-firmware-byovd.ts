import { LegacyDraftScenario } from './normalize-legacy-draft-scenario';

export const APT_BATCH8_KERNEL_FIRMWARE_BYOVD_SCENARIOS: LegacyDraftScenario[] = [
  {
    id: 'blacklotus-uefi-bootkit-cve-2022-21894',
    title: 'BlackLotus UEFI Bootkit Baton Drop Secure Boot Bypass (CVE-2022-21894)',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'CVE-2022-21894',
    description:
      'The BlackLotus UEFI bootkit drops vulnerable Microsoft-signed boot binaries onto the EFI System Partition (ESP), writes a Boot Services-only MOK NVRAM variable, and exploits CVE-2022-21894 ("Baton Drop") in hvloader.efi / winload.efi to bypass UEFI Secure Boot, disable BitLocker/HVCI, and load an unsigned kernel driver.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'BlackLotus User-Mode Installer', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'EFI System Partition & NVRAM (MOK)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Vulnerable winload.efi (CVE-2022-21894)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'ESET / CISA UEFI DBX & TPM Attestation', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Ring-0 Kernel Driver & Disabled HVCI', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: EFI System Partition Staging & MOK NVRAM Variable Tampering',
        narration:
          'Running with local administrator privileges, the BlackLotus installer mounts the hidden FAT32 EFI System Partition (ESP), drops legitimate but vulnerable Microsoft-signed binaries (bootmgfw.efi, hvloader.efi, winload.efi) plus its own self-signed bootkit, and calls ZwSetSystemEnvironmentValueEx to enroll its key into the Machine Owner Key (MOK) UEFI NVRAM variable.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Persistence (T1542.003 - Bootkit)',
        technicalCommands: [
          'Mountvol S: /S -> Write \\EFI\\Microsoft\\Boot\\{bootmgfw.efi, hvloader.efi, winload.efi, grubx64.efi}',
          'ZwSetSystemEnvironmentValueEx("MokList", EFI_VARIABLE_NON_VOLATILE | EFI_VARIABLE_BOOTSERVICE_ACCESS)',
        ],
        defenseMitigation:
          'Apply Microsoft UEFI Secure Boot DBX revocation updates (KB5025885) so vulnerable signed bootmanagers cannot load on Secure Boot systems.',
        logs: [
          {
            id: 'lotus-1',
            timestamp: '02:04:11.310',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 11,
            ProcessName: 'installer.exe',
            raw: 'EventID: 11 | TargetFilename: \\Device\\HarddiskVolume1\\EFI\\Microsoft\\Boot\\hvloader.efi | API: ZwSetSystemEnvironmentValueEx(MokList) | Note: Vulnerable Microsoft-signed boot binaries staged on ESP for BYOVB attack',
            parsedFields: {
              EspPartition: '\\Device\\HarddiskVolume1\\EFI\\Microsoft\\Boot\\',
              StagedBinaries: 'bootmgfw.efi, hvloader.efi, winload.efi',
              NvramModified: 'MokList (Boot Services-Only Variable)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: "Baton Drop" BCD Argument Truncation Exploit (CVE-2022-21894)',
        narration:
          'Upon reboot, the vulnerable Microsoft-signed bootmgfw.efi / winload.efi processes a crafted Boot Configuration Data (BCD) store containing truncated, unaligned boot options (CVE-2022-21894 / Baton Drop), wiping out the Code Integrity enforcement state in memory while UEFI Boot Services remain active.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.001 - Disable or Modify Tools)',
        technicalCommands: [
          'BCD Option Injection: truncates /ov /ozz parameters inside BlImgQueryCodeIntegrityBootOptions',
          'CVE-2022-21894 ("Baton Drop"): Arbitrary physical memory write disables UEFI Secure Boot enforcement',
        ],
        defenseMitigation:
          'Monitor TPM 2.0 Measured Boot PCR[0..7] and WBCL (Windows Boot Configuration Log) digests via remote attestation to detect unexpected bootloader hashes.',
        logs: [
          {
            id: 'lotus-2',
            timestamp: '02:05:01.008',
            source: 'EDR',
            severity: 'critical',
            raw: 'TPM Measured Boot Attestation Alert | PCR[4] & PCR[7] Digest Mismatch | LoadedBootloader: winload.efi (Vulnerable Build 10.0.19041.1) | Exploit: CVE-2022-21894 (Baton Drop BCD Truncation)',
            parsedFields: {
              ExploitedCve: 'CVE-2022-21894 ("Baton Drop")',
              TargetFunction: 'BlImgQueryCodeIntegrityBootOptions',
              BootSecurityImpact: 'UEFI Secure Boot Bypassed in Early Boot',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Disabling BitLocker / HVCI & Deploying Unsigned Ring-0 Kernel Driver',
        narration:
          'Executing in the pre-OS environment, BlackLotus patches hvloader.efi and winload.efi in RAM to disable Hypervisor-Protected Code Integrity (HVCI) and BitLocker, then loads an unsigned 64-bit Windows kernel driver that protects its user-mode HTTP C2 loader (`winlogon.exe` injection) from EDR termination.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Privilege Escalation & Command and Control (T1068 / T1055)',
        technicalCommands: [
          'In-memory patch of OslFwpKernelSetupPhase1 -> Disables HVCI / VBS & BitLocker',
          'Load unsigned Ring-0 driver from ESP -> Injects HTTP C2 DLL into winlogon.exe',
        ],
        defenseMitigation:
          'Isolate affected hosts, reformat the EFI System Partition, clear custom UEFI NVRAM variables, and apply the latest DBX revocation list and firmware updates.',
        logs: [
          {
            id: 'lotus-3',
            timestamp: '02:05:14.772',
            source: 'EDR',
            severity: 'critical',
            EventCode: 6,
            raw: 'Kernel Integrity Alert | Event: HVCI / VBS Unexpectedly Disabled at Boot | LoadedDriver: Unsigned Memory-Mapped Ring-0 Driver | InjectedProcess: C:\\Windows\\System32\\winlogon.exe | Implant: BlackLotus UEFI Bootkit',
            parsedFields: {
              DisabledDefenses: 'HVCI, BitLocker, Windows Defender',
              KernelPayload: 'Unsigned Ring-0 Driver loaded via patched winload.efi',
              UserModeHost: 'winlogon.exe (HTTPS C2 Beacon)',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'aukill-edr-killer-procxp152-byovd',
    title: 'AuKill EDR Killer Abusing Signed Sysinternals PROCEXP152.SYS (BYOVD)',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'T1562.001',
    description:
      'Ransomware affiliates (Medusa Locker / LockBit) deploy AuKill ("EDRKiller"), which drops an outdated, Microsoft-signed Sysinternals Process Explorer driver (PROCEXP152.SYS v16.32) as a system service and sends IOCTL 0x8335003C and 0x83350004 to close handles and terminate Protected Process Light (PPL) EDR services from Ring 0.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'AuKill User-Mode Controller', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'SCM Service (PROCEXP152.SYS v16.32)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'DeviceIoControl (0x8335003C / 0004)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Sophos X-Ops / Elastic WDAC Blocklist', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Terminated PPL EDR & AV Services', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Dropping & Registering Vulnerable Signed PROCEXP152.SYS v16.32',
        narration:
          'AuKill unpacks an embedded copy of Sysinternals Process Explorer driver version 16.32 into C:\\Windows\\System32\\drivers\\PROCEXP152.SYS (or a disguised name like rentdrv2.sys) and registers it via CreateServiceW as a kernel driver.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Privilege Escalation (T1543.003 - Windows Service / BYOVD)',
        technicalCommands: [
          'Drop C:\\Windows\\System32\\drivers\\PROCEXP152.SYS (Signed by Microsoft Windows Hardware Compatibility Publisher)',
          'sc.exe create PROCEXP152 type= kernel binPath= "C:\\Windows\\System32\\drivers\\PROCEXP152.SYS" && sc.exe start PROCEXP152',
        ],
        defenseMitigation:
          'Enable the Microsoft Vulnerable Driver Blocklist (`SiPolicy.p7b`) and HVCI so legacy `PROCEXP152.SYS` versions (< v17.0) are blocked from loading into the kernel.',
        logs: [
          {
            id: 'aukill-1',
            timestamp: '04:11:02.119',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 6,
            raw: 'EventID: 6 (DriverLoaded) | ImageLoaded: C:\\Windows\\System32\\drivers\\PROCEXP152.SYS | Version: 16.32 | Signed: true | Signature: Microsoft Windows Hardware Compatibility Publisher | Note: Known BYOVD driver loaded by non-Sysinternals binary',
            parsedFields: {
              DriverPath: 'C:\\Windows\\System32\\drivers\\PROCEXP152.SYS',
              DriverVersion: '16.32 (Vulnerable to Unauthenticated IOCTL)',
              ToolName: 'AuKill (EDRKiller)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Opening \\\\.\\PROCEXP152 & Issuing IOCTL 0x8335003C / 0x83350004',
        narration:
          'AuKill opens a device handle to \\\\.\\PROCEXP152 and spawns continuous worker threads that enumerate running processes for EDR/AV names, invoking DeviceIoControl with IOCTL 0x8335003C (IOCTL_OPEN_PROTECTED_PROCESS_HANDLE) and IOCTL 0x83350004 (IOCTL_CLOSE_HANDLE).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.001 - Disable or Modify Tools)',
        technicalCommands: [
          'CreateFileW("\\\\.\\PROCEXP152", GENERIC_READ | GENERIC_WRITE, ...)',
          'DeviceIoControl(hDriver, 0x8335003C, &targetPid, ...) -> ZwOpenProcess + ZwTerminateProcess / ObCloseHandle (0x83350004)',
        ],
        defenseMitigation:
          'Alert on any process other than a verified `procexp64.exe` binary opening a handle to `\\\\.\\PROCEXP152` or loading `PROCEXP152.SYS`.',
        logs: [
          {
            id: 'aukill-2',
            timestamp: '04:11:03.450',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'aukill.exe',
            raw: 'Kernel Driver Abuse Alert | Caller: C:\\Users\\Public\\aukill.exe | DeviceObject: \\Device\\PROCEXP152 | IssuedIOCTLs: 0x8335003C (Open Protected Process), 0x83350004 (Close Handle) | Target: Protected Process Light (PPL) Security Agents',
            parsedFields: {
              DeviceHandle: '\\\\.\\PROCEXP152',
              OpenProcessIoctl: '0x8335003C',
              CloseHandleIoctl: '0x83350004',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Ring-0 Termination of PPL EDR Sensors & Ransomware Detonation',
        narration:
          'Because PROCEXP152.SYS executes in Ring 0, its calls to ZwTerminateProcess and ObCloseHandle bypass User-Mode Protected Process Light (PPL) boundaries, stripping all active handles and killing Microsoft Defender, Sophos, and Elastic agents immediately prior to LockBit/Medusa ransomware execution.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact)',
        technicalCommands: [
          'Ring-0 ZwTerminateProcess kills MsMpEng.exe, SophosHealth.exe, and elastic-agent.exe',
          'Launch ransomware encryptor across unmonitored host',
        ],
        defenseMitigation:
          'Combine kernel driver blocklists with tamper-resistant service heartbeats that automatically quarantine hosts from the network switch/VLAN if the EDR sensor stops reporting after a EventID 7045/Sysmon 6 driver load.',
        logs: [
          {
            id: 'aukill-3',
            timestamp: '04:11:05.890',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 5,
            raw: 'EventID: 5 (ProcessTerminated) | TerminatedProcesses: MsMpEng.exe, NisSrv.exe, SophosFileScanner.exe, elastic-agent.exe | Source: Kernel Driver PROCEXP152.SYS | FollowUp: Ransomware payload executed',
            parsedFields: {
              BypassedBoundary: 'Protected Process Light (PsProtectedSignerAntimalware-Light)',
              TerminatedAgents: 'MsMpEng.exe, SophosFileScanner.exe, elastic-agent.exe',
              MitreTechnique: 'T1562.001 (Disable or Modify Tools via BYOVD)',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'crowdstrike-poortry-burntcigar-byovd',
    title: 'STONESTOP & POORTRY / BURNTCIGAR WHQL-Signed Kernel Callback Wiper',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'T1562.001',
    description:
      'Threat actors (UNC3944 / Scattered Spider and RansomHub/ Cuba affiliates) use the STONESTOP loader to install POORTRY (BURNTCIGAR)—a custom malicious kernel driver signed via abused Microsoft WHQL attestation accounts—to zero out kernel process/thread/image notify callback arrays and terminate EDR processes.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'STONESTOP User-Mode Loader', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'WHQL-Signed POORTRY.sys Driver', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'ntoskrnl PspCreateProcessNotifyRoutine', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Mandiant / CrowdStrike Falcon Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Blinded Kernel Telemetry & LSASS Dump', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Loading Custom Malicious Driver POORTRY Signed via Abused WHQL Account',
        narration:
          'Unlike traditional BYOVD that abuses a bug in a legitimate third-party driver, STONESTOP loads POORTRY (BURNTCIGAR)—a purpose-built malicious kernel rootkit that attackers submitted through compromised Windows Hardware Developer Program (WHQL attestation signing) accounts to obtain a genuine Microsoft signature.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Defense Evasion (T1553.002 - Code Signing / Attestation Abuse)',
        technicalCommands: [
          'STONESTOP Loader: Drops C:\\Windows\\Temp\\poortry.sys (Signed by Microsoft Windows Hardware Compatibility Publisher)',
          'NtLoadDriver("\\Registry\\Machine\\System\\CurrentControlSet\\Services\\poortry")',
        ],
        defenseMitigation:
          'Apply Microsoft Security Advisory ADV220005 / KB5020779 certificate revocations and monitor kernel driver loads from non-standard directories (`C:\\Windows\\Temp\\`, `C:\\Users\\Public\\`).',
        logs: [
          {
            id: 'poor-1',
            timestamp: '15:20:11.402',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 6,
            raw: 'EventID: 6 (DriverLoaded) | ImageLoaded: C:\\Windows\\Temp\\poortry.sys | Signed: true | Signature: Microsoft Windows Hardware Compatibility Publisher (Attestation Signed - ADV220005 Revoked) | Loader: STONESTOP',
            parsedFields: {
              MaliciousDriver: 'POORTRY / BURNTCIGAR (poortry.sys)',
              UserModeLoader: 'STONESTOP',
              SigningMethod: 'Abused Microsoft WHQL Attestation Signing (ADV220005)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Authenticated IOCTL Handshake & Kernel Notify Callback Array Wiping',
        narration:
          'STONESTOP completes a cryptographic challenge-response handshake over DeviceIoControl with POORTRY, then instructs the driver to scan ntoskrnl.exe memory for PspCreateProcessNotifyRoutine, PspCreateThreadNotifyRoutine, and PspLoadImageNotifyRoutine and overwrite the registered EDR callback pointers with NULL.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.001 - Blind Kernel Telemetry Callbacks)',
        technicalCommands: [
          'POORTRY Handshake: Custom rolling XOR/ECDSA challenge before unlocking driver IOCTL dispatch table',
          'Wipe Kernel Callbacks: PspCreateProcessNotifyRoutine[i] = NULL; ObUnRegisterCallbacks(...)',
        ],
        defenseMitigation:
          'Utilize hypervisor-enforced kernel integrity monitoring and EDR sensor self-defense that detects unauthorized removal or zeroing of `PspCreateProcessNotifyRoutine` entries.',
        logs: [
          {
            id: 'poor-2',
            timestamp: '15:20:12.118',
            source: 'EDR',
            severity: 'critical',
            raw: 'CrowdStrike / Mandiant Kernel Tampering Alert | Driver: poortry.sys | Action: Zeroed PspCreateProcessNotifyRoutine, PspLoadImageNotifyRoutine, and CmCallbackListHead (Registry Callbacks) in ntoskrnl.exe',
            parsedFields: {
              TamperedKernelArrays: 'PspCreateProcessNotifyRoutine, PspLoadImageNotifyRoutine, CmCallbackListHead',
              EvasionGoal: 'Blind EDR to all subsequent process, thread, DLL, and registry events',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: EPROCESS Protection Bit Stripping, EDR Termination & LSASS Credential Dump',
        narration:
          'POORTRY locates the EPROCESS kernel structures of security agents and lsass.exe, zeroes out their _PS_PROTECTION (PPL) and SignatureLevel bytes in kernel memory, terminates the EDR user-mode services, and allows STONESTOP to dump LSASS credentials unhindered.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Credential Access (T1003.001 - LSASS Memory)',
        technicalCommands: [
          'Direct Kernel Object Manipulation (DKOM): *(BYTE*)(pEprocess + ProtectionOffset) = 0x00',
          'ZwTerminateProcess(hEdrProcess, 0) -> Dump lsass.exe memory',
        ],
        defenseMitigation:
          'Enable Windows Credential Guard (VBS/Isolated User Mode `LsaIso.exe`) so even Ring-0 DKOM against `EPROCESS` cannot read plaintext secrets stored inside VTL1.',
        logs: [
          {
            id: 'poor-3',
            timestamp: '15:20:14.905',
            source: 'EDR',
            severity: 'critical',
            raw: 'Kernel DKOM Alert | TargetObject: EPROCESS (lsass.exe & CSFalconService.exe) | ModifiedField: _PS_PROTECTION / SignatureLevel set to 0x00 | FollowUp: Unprotected LSASS memory read',
            parsedFields: {
              DkomTarget: 'EPROCESS._PS_PROTECTION (SignatureLevel / SectionSignatureLevel)',
              Impact: 'PPL Stripped & LSASS Memory Dumped',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'linux-bpfdoor-ebpf-socket-filter-apt',
    title: 'BPFDoor Passive Linux Rootkit & Classic BPF Magic Packet Filter (Red Menshen)',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'T1205.002',
    description:
      'Red Menshen (China-nexus APT) deploys BPFDoor onto Linux telecommunications and enterprise servers. BPFDoor copies itself to /dev/shm/kdmtmpflush, deletes its binary, masquerades as hald-addon-acpi, and attaches a kernel Berkeley Packet Filter (SO_ATTACH_FILTER) to a raw socket to passively await magic packets (0x7255 UDP/ICMP or 0x5293 TCP) before local iptables rules.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Red Menshen Operator (Magic Packet)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Linux Host eth0 (Before iptables)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Raw Socket BPF Filter (0x7255 / 0x5293)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'PwC / Sandfly / Elastic Linux Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Masqueraded Shell (/dev/shm/kdmtmpflush)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: In-Memory /dev/shm/kdmtmpflush Execution, Unlinking & Process Masquerading',
        narration:
          'Upon execution, BPFDoor copies itself into the RAM-backed tmpfs directory /dev/shm/kdmtmpflush, timestomps the file to 2008, re-executes with --init, immediately unlinks /dev/shm/kdmtmpflush from disk, and overwrites its argv[0] process title to masquerade as a system daemon (/usr/libexec/postfix/master or hald-addon-acpi).',
        activeNodes: ['attacker', 'ad'],
        mitreTactic: 'Defense Evasion (T1036.004 - Masquerade Task or Service / T1070.004)',
        technicalCommands: [
          'cp $0 /dev/shm/kdmtmpflush && chmod +x /dev/shm/kdmtmpflush && touch -t 200810300000 /dev/shm/kdmtmpflush',
          '/dev/shm/kdmtmpflush --init -> rm -f /dev/shm/kdmtmpflush -> prctl(PR_SET_NAME, "hald-addon-acpi")',
        ],
        defenseMitigation:
          'Mount `/dev/shm` with the `noexec,nosuid,nodev` mount options in `/etc/fstab` and monitor `/proc/[pid]/exe` for `(deleted)` binaries running from `/dev/shm`.',
        logs: [
          {
            id: 'bpf-1',
            timestamp: '03:02:11.104',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'kdmtmpflush',
            raw: 'Linux Forensics Alert (Sandfly) | PID: 2914 | SpoofedComm: hald-addon-acpi: listening on acpi kernel interface | RealExeSymlink: /dev/shm/kdmtmpflush (deleted) | Note: BPFDoor RAM-resident unlinked execution',
            parsedFields: {
              SpoofedProcessName: 'hald-addon-acpi / /usr/libexec/postfix/master',
              ProcExeSymlink: '/dev/shm/kdmtmpflush (deleted)',
              ThreatActor: 'Red Menshen',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Attaching Kernel Berkeley Packet Filter via setsockopt(SO_ATTACH_FILTER)',
        narration:
          'Without binding any TCP or UDP port (remaining invisible to netstat -tlpn and ss), BPFDoor opens a raw packet socket (socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP))) and calls setsockopt(..., SO_ATTACH_FILTER, ...) to load a 30-instruction classic BPF bytecode filter into the Linux kernel network stack.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence & Defense Evasion (T1205.002 - Socket Filters)',
        technicalCommands: [
          'sock = socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP))',
          'setsockopt(sock, SOL_SOCKET, SO_ATTACH_FILTER, &bpf_prog, sizeof(bpf_prog)) (Checks magic bytes 0x7255 UDP/ICMP or 0x5293 TCP)',
        ],
        defenseMitigation:
          'Audit active raw packet sockets across Linux servers via `ss -0pb` (which dumps attached BPF bytecode filters) and alert on processes holding `CAP_NET_RAW` that are not legitimate `tcpdump`/`dhclient` binaries.',
        logs: [
          {
            id: 'bpf-2',
            timestamp: '03:02:11.450',
            source: 'EDR',
            severity: 'critical',
            raw: 'Linux Socket Filter Alert (ss -0pb) | Process: hald-addon-acpi (PID 2914) | SocketType: AF_PACKET SOCK_RAW | Syscall: setsockopt(SOL_SOCKET, SO_ATTACH_FILTER) | FilterConstants: 0x7255 (29269), 0x5293 (21139)',
            parsedFields: {
              SocketCall: 'socket(AF_PACKET, SOCK_RAW) + setsockopt(SO_ATTACH_FILTER)',
              MagicHexConstants: '0x7255 (UDP/ICMP) & 0x5293 (TCP)',
              FirewallBypass: 'Inspects packets at NIC driver tap before iptables/nftables',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Magic Packet Activation, iptables Port Redirection & Memory-Only PTY Shell',
        narration:
          'After months of zero-traffic dormancy, the Red Menshen operator sends a single TCP/UDP/ICMP packet containing magic value 0x7255 or 0x5293 and an MD5-hashed password. The kernel BPF filter passes the packet to BPFDoor, which dynamically inserts an iptables PREROUTING REDIRECT rule or initiates an RC4-encrypted reverse PTY shell.',
        activeNodes: ['attacker', 'firewall', 'target', 'ad', 'siem'],
        mitreTactic: 'Command and Control (T1205.001 - Traffic Signaling)',
        technicalCommands: [
          'Magic Packet Received: UDP payload magic=0x7255 + pass=<valid_hash> + attacker_ip:port',
          '/sbin/iptables -t nat -A PREROUTING -p tcp -s <attacker_ip> --dport 22 -j REDIRECT --to-ports 42391 (Redirect SSH port to ephemeral BPFDoor PTY)',
        ],
        defenseMitigation:
          'Deploy network IDS signatures for `0x7255` / `0x5293` magic packet structures and monitor `iptables -t nat` for transient `PREROUTING REDIRECT` rules.',
        logs: [
          {
            id: 'bpf-3',
            timestamp: '09:44:18.902',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'iptables',
            CommandLine: '/sbin/iptables -t nat -A PREROUTING -p tcp -s 198.51.100.204 --dport 22 -j REDIRECT --to-ports 42391',
            raw: 'BPFDoor Activation Alert | Trigger: Magic Packet 0x7255 from 198.51.100.204 | Action: Spawned /dev/ptmx interactive shell & inserted iptables nat PREROUTING REDIRECT on port 22',
            parsedFields: {
              TriggerPacket: 'Magic 0x7255 from 198.51.100.204',
              NatRedirectRule: 'iptables -t nat -A PREROUTING --dport 22 -j REDIRECT --to-ports 42391',
              ShellDevice: '/dev/ptmx (No wtmp/utmp login record)',
            },
          },
        ],
        packets: [
          {
            id: 'bpf-pkt-1',
            timestamp: '09:44:18.880',
            protocol: 'UDP',
            sourceIp: '198.51.100.204',
            destIp: '203.0.113.19',
            port: 53,
            flag: 'NONE',
            payloadSize: 64,
            hexDump: '72 55 01 00 6A 75 73 74 66 6F 72 66 75 6E 00 00 C6 33 64 CC 11 5B',
            decodedString: 'BPFDoor Magic UDP Packet: Magic=0x7255 | Pass="justforfun" | Callback=198.51.100.204:4443',
          },
        ],
      },
    ],
  },
  {
    id: 'kaspersky-cosmicstrand-uefi-spi-rootkit',
    title: 'CosmicStrand Motherboard SPI Flash UEFI Rootkit (CSMCORE -> ntoskrnl.exe Chain)',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'T1542.001',
    description:
      'CosmicStrand infects the motherboard SPI flash firmware image inside the CSMCORE DXE driver. Across every boot—surviving OS reinstalls and hard-drive replacements—it hooks a 4-stage relay from CSMCORE -> bootmgfw.efi -> winload.efi -> ntoskrnl.exe, disabling PatchGuard and deploying a kernel-mode C2 implant.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'CosmicStrand C2 Server', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Motherboard SPI Flash (CSMCORE DXE)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Boot Chain (bootmgfw -> winload.efi)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Kaspersky GReAT Firmware Scanner', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Patched ntoskrnl.exe & Kernel Implant', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Motherboard SPI Flash Infection of CSMCORE DXE Driver (HandleProtocol Hook)',
        narration:
          'Residing inside the physical SPI flash chip on H81-chipset motherboards, CosmicStrand modifies the legitimate CSMCORE DXE driver, patching its entry point to jump into a malicious .reloc section that hooks the UEFI Boot Services HandleProtocol function.',
        activeNodes: ['firewall', 'target'],
        mitreTactic: 'Persistence (T1542.001 - System Firmware)',
        technicalCommands: [
          'SPI Flash Firmware Region: Patched CSMCORE DXE driver GUID {A062CF1F-8473-4AA3-8793-600BC4FFE9A8}',
          'Hook EFI_BOOT_SERVICES.HandleProtocol -> Intercepts loading of bootmgfw.efi',
        ],
        defenseMitigation:
          'Enable Intel Boot Guard / AMD Platform Secure Boot hardware root-of-trust and BIOS Write Protection (`BiosLock` / `BLE` + `SMM_BWP`) to prevent unauthorized SPI flash modifications.',
        logs: [
          {
            id: 'cosmic-1',
            timestamp: '00:00:01.120',
            source: 'EDR',
            severity: 'critical',
            raw: 'UEFI Firmware Integrity Alert (Kaspersky GReAT) | SPI Flash Image: Infected CSMCORE DXE Driver | GUID: A062CF1F-8473-4AA3-8793-600BC4FFE9A8 | Anomaly: Entry point redirected to .reloc section hooking HandleProtocol',
            parsedFields: {
              InfectedDxeDriver: 'CSMCORE ({A062CF1F-8473-4AA3-8793-600BC4FFE9A8})',
              HookedBootService: 'EFI_BOOT_SERVICES.HandleProtocol',
              PersistenceLayer: 'Physical Motherboard SPI Flash Chip (Survives Disk Wipe)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Multi-Hop Boot Hooking Relay (bootmgfw.efi -> winload.efi)',
        narration:
          'When UEFI loads the Windows Boot Manager (bootmgfw.efi), the HandleProtocol hook patches Archpx64TransferTo64BitApplicationAsm in RAM. When bootmgfw.efi loads winload.efi, the hook intercepts OslArchTransferToKernel right before execution transfers to the Windows kernel.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1542.003 - Bootkit Hooking Relay)',
        technicalCommands: [
          'Hook 1 (bootmgfw.efi): Patch Archpx64TransferTo64BitApplicationAsm in RAM',
          'Hook 2 (winload.efi): Patch OslArchTransferToKernel prior to kernel handoff',
        ],
        defenseMitigation:
          'Dump and audit motherboard SPI flash images using `CHIPSEC` (`chipsec_util spi dump`) and verify DXE driver hashes against vendor golden firmware images.',
        logs: [
          {
            id: 'cosmic-2',
            timestamp: '00:00:03.450',
            source: 'EDR',
            severity: 'critical',
            raw: 'Pre-OS Memory Hook Chain Detected | StageA: bootmgfw.efi (Archpx64TransferTo64BitApplicationAsm) -> StageB: winload.efi (OslArchTransferToKernel) | Note: Zero disk modifications on C:\\ or ESP',
            parsedFields: {
              BootManagerHook: 'bootmgfw.efi!Archpx64TransferTo64BitApplicationAsm',
              OsLoaderHook: 'winload.efi!OslArchTransferToKernel',
              DiskFootprint: 'None (Purely RAM-propagated from SPI Flash)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: PatchGuard Neutralization, ntoskrnl.exe ZwCreateSection Hook & Kernel C2',
        narration:
          'Inside OslArchTransferToKernel, CosmicStrand patches KiFilterFiberContext in ntoskrnl.exe to disable Kernel Patch Protection (PatchGuard), copies shellcode into the .text section slack space of ntoskrnl.exe, hooks ZwCreateSection, and maps its final kernel C2 implant into space when smss.exe starts.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Command and Control & Privilege Escalation (T1014 - Rootkit)',
        technicalCommands: [
          'Disable PatchGuard: Patch ntoskrnl.exe!KiFilterFiberContext -> xor eax, eax; ret',
          'Hook ntoskrnl.exe!ZwCreateSection -> Maps kernel shellcode polling UDP/TCP C2',
        ],
        defenseMitigation:
          'Reflash the physical SPI NOR flash chip using an external hardware programmer (or replace the motherboard) and enforce Hypervisor-Protected Code Integrity (HVCI).',
        logs: [
          {
            id: 'cosmic-3',
            timestamp: '00:00:12.880',
            source: 'EDR',
            severity: 'critical',
            raw: 'Kernel Memory Integrity Alert | Module: ntoskrnl.exe | PatchedFunctions: KiFilterFiberContext (PatchGuard Disabled), ZwCreateSection (Inline Hook in .text slack space) | NetworkActivity: Kernel-mode socket beacon to CosmicStrand C2',
            parsedFields: {
              PatchGuardBypass: 'ntoskrnl.exe!KiFilterFiberContext patched',
              KernelInlineHook: 'ntoskrnl.exe!ZwCreateSection (.text slack space)',
              RootkitFamily: 'CosmicStrand UEFI SPI Rootkit',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'sentinelone-terminator-zemana-byovd',
    title: 'Terminator EDR Killer Abusing Signed Zemana AntiMalware Driver (zam64.sys / CVE-2021-31728)',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'CVE-2021-31728',
    description:
      'Sold on underground forums as a universal EDR bypass, "Terminator" drops a legitimate, Microsoft-signed Zemana AntiMalware kernel driver (zam64.sys), registers its own process PID in the driver’s internal allowlist via IOCTL 0x80002010 (CVE-2021-31728), and loops IOCTL 0x80002048 to terminate CrowdStrike, SentinelOne, and Defender processes from Ring 0.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Terminator.exe User-Mode Binary', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Signed Zemana Driver (zam64.sys)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'IOCTL 0x80002010 Allowlist Bypass', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'SentinelOne / CrowdStrike Behavioral IOA', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'IOCTL 0x80002048 Ring-0 Process Kill', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Dropping Randomized Signed Zemana Driver (zam64.sys) into System32\\drivers',
        narration:
          'To evade static filename rules, Terminator drops the legitimate signed Zemana AntiMalware driver (zam64.sys) into C:\\Windows\\System32\\drivers\\ under a randomly generated 5-to-10 character filename (e.g., kdhf82.sys) and loads it via the Windows Service Control Manager.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Privilege Escalation & Defense Evasion (T1068 / T1036.005)',
        technicalCommands: [
          'Drop C:\\Windows\\System32\\drivers\\<random_8_chars>.sys (SHA256 matching signed Zemana zam64.sys)',
          'CreateServiceW + StartServiceW -> Creates device symlink \\\\.\\ZemanaAntiMalware',
        ],
        defenseMitigation:
          'Block `zam64.sys` and `zamguard64.sys` by file hash and signer certificate thumbprint rather than filename using WDAC / Microsoft Vulnerable Driver Blocklist.',
        logs: [
          {
            id: 'term-1',
            timestamp: '18:04:19.220',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 6,
            raw: 'EventID: 6 (DriverLoaded) | ImageLoaded: C:\\Windows\\System32\\drivers\\x89kqp.sys | OriginalFileName: zam64.sys | Signed: true | Signer: Zemana Ltd. | Note: CVE-2021-31728 Vulnerable Driver Loaded under randomized name',
            parsedFields: {
              RandomizedFileName: 'C:\\Windows\\System32\\drivers\\x89kqp.sys',
              OriginalDriverName: 'zam64.sys (Zemana AntiMalware)',
              ExploitedCve: 'CVE-2021-31728',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Self-Allowlisting Caller PID via Unauthenticated IOCTL 0x80002010 (CVE-2021-31728)',
        narration:
          'Although zam64.sys restricts dangerous IOCTLs to "trusted" processes, it exposes IOCTL 0x80002010 (IOCTL_REGISTER_PROCESS) without verifying the caller’s digital signature (CVE-2021-31728). Terminator sends its own PID to 0x80002010, adding itself to the driver’s privileged allowlist.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Privilege Escalation (T1068 - Exploitation for Privilege Escalation)',
        technicalCommands: [
          'hDev = CreateFileW("\\\\.\\ZemanaAntiMalware", ...)',
          'myPid = GetCurrentProcessId(); DeviceIoControl(hDev, 0x80002010, &myPid, sizeof(DWORD), ...) (Registers caller in Ring-0 trusted list)',
        ],
        defenseMitigation:
          'Kernel drivers must validate caller authenticity in Ring 0 using `SeLocateProcessImageName` and Windows Code Integrity verification rather than trusting a user-supplied PID registration IOCTL.',
        logs: [
          {
            id: 'term-2',
            timestamp: '18:04:19.510',
            source: 'EDR',
            severity: 'critical',
            raw: 'BYOVD IOCTL Registration Alert | Process: C:\\Users\\Admin\\Desktop\\Terminator.exe (PID 4812) | Device: \\\\.\\ZemanaAntiMalware | IOCTL: 0x80002010 (CVE-2021-31728 Trusted PID Registration Bypass)',
            parsedFields: {
              DeviceSymbolicLink: '\\\\.\\ZemanaAntiMalware',
              RegistrationIoctl: '0x80002010 (Unauthenticated Allowlist Addition)',
              RegisteredCallerPid: '4812 (Terminator.exe)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Continuous Ring-0 Termination Loop via IOCTL 0x80002048',
        narration:
          'Now trusted by zam64.sys, Terminator runs an infinite loop taking process snapshots (CreateToolhelp32Snapshot), matching process names against a hardcoded list of 24+ EDR/AV vendors, and sending IOCTL 0x80002048 (`ZwTerminateProcess` in Ring 0) to kill them.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.001 - Disable or Modify Tools)',
        technicalCommands: [
          'CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0) -> Match against 24 security vendor process names',
          'DeviceIoControl(hDev, 0x80002048, &edrPid, sizeof(DWORD), ...) -> Ring-0 ZwTerminateProcess',
        ],
        defenseMitigation:
          'Configure EDR anti-tamper policies to block service creation and `CreateFileW` access to `\\\\.\\ZemanaAntiMalware` before `0x80002010` can be invoked.',
        logs: [
          {
            id: 'term-3',
            timestamp: '18:04:20.105',
            source: 'EDR',
            severity: 'critical',
            raw: 'SentinelOne / CrowdStrike Behavioral Block | Process: Terminator.exe | Action: Issued IOCTL 0x80002048 (ZwTerminateProcess) via zam64.sys targeting SentinelAgent.exe & MsMpEng.exe',
            parsedFields: {
              TerminationIoctl: '0x80002048 (Ring-0 ZwTerminateProcess)',
              TargetedVendors: 'SentinelOne, CrowdStrike, Defender, Sophos, Cortex XDR',
              AttackClass: 'Commodity BYOVD EDR Killer ("Terminator")',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'intezer-blackberry-symbiote-linux-ldpreload',
    title: 'Symbiote Parasitic Linux LD_PRELOAD Rootkit & libpcap eBPF Bytecode Hooking',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'T1574.006',
    description:
      'Symbiote is a parasitic Linux shared-object (.so) rootkit targeting financial institutions. Loaded globally via /etc/ld.so.preload into every dynamic process, it hooks libc (read, fopen, getdents) to harvest SSH/PAM credentials and hide its files, and hooks libpcap (pcap_compile) to prepend custom BPF instructions that scrub its C2 traffic from tcpdump.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Symbiote DNS / HTTPS C2 Operator', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: '/etc/ld.so.preload (liblinux.so)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Hooked sshd / PAM Credential Harvester', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'BlackBerry / Intezer Static ELF Scanner', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Hooked tcpdump / libpcap BPF Scrubber', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Global Dynamic Linker Injection via /etc/ld.so.preload',
        narration:
          'Rather than running as a standalone executable process, Symbiote is compiled as a position-independent ELF shared library (/usr/lib/liblinux.so) and registered inside /etc/ld.so.preload, forcing the GNU dynamic linker (ld-linux.so) to map Symbiote into every dynamically linked process ahead of glibc.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Persistence & Privilege Escalation (T1574.006 - Dynamic Linker Hijacking)',
        technicalCommands: [
          'echo "/usr/lib/liblinux.so" > /etc/ld.so.preload',
          'Hook glibc: fopen, fopen64, readdir, getdents64, execve (Hides /etc/ld.so.preload and liblinux.so from ls/find/ldd)',
        ],
        defenseMitigation:
          'Inspect `/etc/ld.so.preload` and `/proc/1/maps` using a **statically linked** binary (such as `busybox` or a static Go security agent) that does not invoke `ld-linux.so` and therefore cannot be hooked by `LD_PRELOAD`.',
        logs: [
          {
            id: 'sym-1',
            timestamp: '12:09:33.112',
            source: 'EDR',
            severity: 'critical',
            raw: 'Static ELF Integrity Alert (Intezer / BlackBerry) | File: /etc/ld.so.preload | LoadedSharedObject: /usr/lib/liblinux.so (Symbiote) | HookedSymbols: fopen, getdents64, pam_authenticate, pcap_compile | Note: Hidden from dynamically linked ls/ldd',
            parsedFields: {
              PreloadConfig: '/etc/ld.so.preload',
              ParasiticLibrary: '/usr/lib/liblinux.so (Symbiote)',
              HookedLibcCalls: 'fopen, fopen64, readdir, getdents64, execve',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: PAM Backdoor Authentication & ssh/scp libc_read Keystroke Harvesting',
        narration:
          'Inside ssh and scp client processes, Symbiote hooks libc read() to capture administrator passwords and SSH keys to an RC4-encrypted file; inside sshd, it hooks pam_authenticate() to grant immediate root SSH access whenever a hidden master password is supplied.',
        activeNodes: ['firewall', 'target', 'attacker', 'siem'],
        mitreTactic: 'Credential Access & Persistence (T1556.003 - Pluggable Authentication Modules)',
        technicalCommands: [
          'Hook ssh/scp read() -> Captures keystrokes and encrypts with RC4 into /var/tmp/.certs',
          'Hook sshd pam_authenticate() -> If password == <hardcoded_symbiote_hash>, return PAM_SUCCESS',
        ],
        defenseMitigation:
          'Monitor `/proc/[pid]/maps` across `sshd` processes from kernel space (eBPF) for unexpected `.so` libraries loaded outside standard PAM and system library paths.',
        logs: [
          {
            id: 'sym-2',
            timestamp: '12:14:05.804',
            source: 'Auth',
            severity: 'critical',
            raw: 'PAM Memory Hook Alert | Process: /usr/sbin/sshd | HookedFunction: pam_authenticate (Redirected to /usr/lib/liblinux.so) | CredentialStash: /var/tmp/.certs (RC4 Encrypted)',
            parsedFields: {
              HookedDaemon: '/usr/sbin/sshd',
              HijackedFunction: 'pam_authenticate() & libc read()',
              StolenCredentialsFile: '/var/tmp/.certs',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: libpcap Function Hooking & Kernel BPF Bytecode Scrubbing Against tcpdump',
        narration:
          'When an incident responder runs tcpdump or Wireshark on the infected host, Symbiote hooks pcap_compile() and setsockopt(SO_ATTACH_FILTER), prepending its own classic BPF instructions to the analyst’s capture filter so the Linux kernel silently drops any packet matching Symbiote’s C2 ports or domains.',
        activeNodes: ['firewall', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Defense Evasion (T1014 - Rootkit / Network Capture Blindfolding)',
        technicalCommands: [
          'Hook libpcap!pcap_compile & setsockopt(SO_ATTACH_FILTER)',
          'Prepend BPF bytecode instructions: Drop packets matching Symbiote C2 IP/Port before handing buffer to tcpdump',
        ],
        defenseMitigation:
          'Perform packet capture on an external network tap or mirror port (SPAN) rather than running `tcpdump` directly on a potentially compromised Linux host.',
        logs: [
          {
            id: 'sym-3',
            timestamp: '12:19:44.019',
            source: 'EDR',
            severity: 'critical',
            raw: 'Network Forensics Evasion Alert | Process: /usr/sbin/tcpdump | HookedLibrary: libpcap.so (via /usr/lib/liblinux.so) | Action: Modified SO_ATTACH_FILTER BPF bytecode to exclude Symbiote C2 ports from packet capture',
            parsedFields: {
              TargetedTool: 'tcpdump / libpcap',
              EvasionMechanism: 'BPF Bytecode Prepending in setsockopt(SO_ATTACH_FILTER)',
              ForensicImpact: 'Local packet captures completely blind to Symbiote C2 traffic',
            },
          },
        ],
        packets: [],
      },
    ],
  },
  {
    id: 'genshin-mhyprot2-ransomware-byovd',
    title: 'Genshin Impact Anti-Cheat Driver (mhyprot2.sys) Ransomware BYOVD (CVE-2020-36603)',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'CVE-2020-36603',
    description:
      'Ransomware operators bring a standalone copy of the legitimate, Microsoft-signed Genshin Impact anti-cheat kernel driver (mhyprot2.sys), load it onto enterprise servers where the game is never installed, complete a 64-bit seed handshake via IOCTL 0x80034000, and invoke IOCTL 0x81034000 (ZwTerminateProcess) to wipe out endpoint protection.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'kill_svc.exe Ransomware Dropper', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Signed Anti-Cheat Driver (mhyprot2.sys)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'IOCTL 0x80034000 MT64 Handshake', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Trend Micro / Mandiant EDR Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'IOCTL 0x81034000 Ring-0 AV Wipe & Lock', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Dropping Standalone Signed mhyprot2.sys on Enterprise Domain Controller',
        narration:
          'After gaining administrative RDP access, the ransomware operator drops kill_svc.exe alongside mhyprot2.sys—a kernel-mode anti-cheat driver validly signed by miHoYo Co., Ltd. (timestamped 2020)—and registers it as a Windows kernel service.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Privilege Escalation & Defense Evasion (T1068 - Exploitation for Privilege Escalation)',
        technicalCommands: [
          'Drop C:\\Users\\Public\\mhyprot2.sys (Signed by miHoYo Co., Ltd. / Microsoft WHCP)',
          'sc.exe create mhyprot2 type= kernel binPath= "C:\\Users\\Public\\mhyprot2.sys" && sc.exe start mhyprot2',
        ],
        defenseMitigation:
          'Block gaming anti-cheat and hardware-overclocking kernel drivers (`mhyprot2.sys`, `RTCore64.sys`, `gdrv.sys`) on enterprise servers and workstations via WDAC.',
        logs: [
          {
            id: 'mhy-1',
            timestamp: '22:14:08.110',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 6,
            raw: 'EventID: 6 (DriverLoaded) | Host: DC01.corp.local | ImageLoaded: C:\\Users\\Public\\mhyprot2.sys | Signed: true | Signer: miHoYo Co., Ltd. | CveId: CVE-2020-36603 | Note: Gaming anti-cheat driver loaded on Windows Server',
            parsedFields: {
              DriverFile: 'C:\\Users\\Public\\mhyprot2.sys',
              Signer: 'miHoYo Co., Ltd. (Genshin Impact Anti-Cheat)',
              ExploitedCve: 'CVE-2020-36603',
              HostRole: 'Enterprise Domain Controller',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Opening \\\\.\\mhyprot2 & Initializing MT19937-64 Encryption Seed (IOCTL 0x80034000)',
        narration:
          'kill_svc.exe opens a handle to \\\\.\\mhyprot2 and sends IOCTL 0x80034000 to initialize the driver’s 64-bit Mersenne Twister (MT19937-64) PRNG key schedule, which mhyprot2.sys uses to XOR-decode subsequent user-mode IOCTL payloads.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1027 - Obfuscated IOCTL Payloads)',
        technicalCommands: [
          'hDriver = CreateFileW("\\\\.\\mhyprot2", GENERIC_READ | GENERIC_WRITE, ...)',
          'DeviceIoControl(hDriver, 0x80034000, &initSeedStruct, 0x18, ...) (Initializes MT19937-64 XOR cipher key)',
        ],
        defenseMitigation:
          'Monitor Sysmon EventID 6 driver loads and ETW `Microsoft-Windows-Kernel-File` device opens for `\\Device\\mhyprot2`.',
        logs: [
          {
            id: 'mhy-2',
            timestamp: '22:14:08.450',
            source: 'EDR',
            severity: 'critical',
            raw: 'BYOVD Device Handle Alert | Process: C:\\Users\\Public\\kill_svc.exe | Device: \\\\.\\mhyprot2 | HandshakeIOCTL: 0x80034000 (MT19937-64 PRNG Key Initialization)',
            parsedFields: {
              ControllerBinary: 'C:\\Users\\Public\\kill_svc.exe',
              DeviceObject: '\\\\.\\mhyprot2',
              HandshakeIoctl: '0x80034000',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Ring-0 ZwTerminateProcess Massacre via IOCTL 0x81034000 & Mass Encryption',
        narration:
          'kill_svc.exe loops through running endpoint security processes, encrypts each target PID with the MT19937-64 XOR key, and sends IOCTL 0x81034000 to mhyprot2.sys, which invokes ZwTerminateProcess from Ring 0 to kill AV/EDR services before launching the DeadBolt/LockBit ransomware payload.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Defense Evasion & Impact (T1562.001 / T1486)',
        technicalCommands: [
          'DeviceIoControl(hDriver, 0x81034000, &xorEncryptedTargetPid, ...) -> Ring-0 PsLookupProcessByProcessId + ZwTerminateProcess',
          'Deploy ransomware across unprotected Domain Controller and SMB shares',
        ],
        defenseMitigation:
          'Revoke or block `mhyprot2.sys` across all enterprise endpoints and enforce hardware-backed MFA on RDP/SMB administrative logons.',
        logs: [
          {
            id: 'mhy-3',
            timestamp: '22:14:09.902',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 5,
            raw: 'EventID: 5 (ProcessTerminated) | Driver: mhyprot2.sys (IOCTL 0x81034000) | TerminatedProcesses: Ntrtscan.exe, TmCCSF.exe, uiWatchDog.exe, MsMpEng.exe | FollowUp: Mass file encryption initiated',
            parsedFields: {
              KillIoctl: '0x81034000 (Ring-0 ZwTerminateProcess)',
              TerminatedProcesses: 'Ntrtscan.exe, TmCCSF.exe, uiWatchDog.exe, MsMpEng.exe',
              Impact: 'Complete Endpoint Protection Blindfolding & Ransomware Encryption',
            },
          },
        ],
        packets: [],
      },
    ],
  },
];
