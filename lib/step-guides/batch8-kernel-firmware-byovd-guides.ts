import type { RawScenarioStepGuideData } from '../scenario-step-guides';

export const BATCH8_KERNEL_FIRMWARE_BYOVD_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  'blacklotus-uefi-bootkit-cve-2022-21894': {
    scenarioId: 'blacklotus-uefi-bootkit-cve-2022-21894',
    briefing: {
      headline:
        'BlackLotus UEFI bootkit exploits CVE-2022-21894 ("Baton Drop") by staging vulnerable Microsoft-signed bootloaders on the EFI System Partition to bypass Secure Boot, disable BitLocker/HVCI, and load an unsigned Ring-0 kernel driver.',
      storyAnalogy:
        'Imagine a high-security building where every morning at 6:00 AM, a robot checks that the front-door guard has a genuine badge signed by the mayor before letting the guard turn on the security cameras. A burglar brings an retired guard from two years ago—who still holds a genuine badge signed by the mayor, because the mayor forgot to put that old badge on the "revoked" list—and hands the retired guard a rigged clipboard (`BCD`) that tricks them into leaving the security cameras unplugged for the rest of the day.',
      plainSummary:
        'Analyzed by ESET and the subject of a joint NSA/CISA advisory in 2023, BlackLotus is an 80-kilobyte C/Assembly UEFI bootkit capable of bypassing UEFI Secure Boot on fully updated Windows 11 systems. Using a "Bring Your Own Vulnerable Bootloader" (BYOVB) technique, it drops older, legitimately signed `bootmgfw.efi`, `hvloader.efi`, and `winload.efi` binaries onto the EFI System Partition and exploits CVE-2022-21894 ("Baton Drop") to disable Code Integrity in early boot, turn off BitLocker and HVCI, and load an unsigned kernel rootkit.',
      diagramTopologySummary:
        'BlackLotus User-Mode Installer -> EFI System Partition & NVRAM (MOK) -> Vulnerable winload.efi (CVE-2022-21894) -> Ring-0 Kernel Driver & Disabled HVCI -> ESET / CISA UEFI DBX & TPM Attestation.',
      documentedAdvisory:
        'ESET BlackLotus UEFI Bootkit Analysis / NSA & CISA Joint BlackLotus Mitigation Guide / CVE-2022-21894 ("Baton Drop")',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1542.003',
        plainTitle: 'EFI System Partition Staging & MOK NVRAM Variable Tampering',
        storyAnalogy:
          'The installer unlocks the hidden boot closet on the hard drive, places older signed boot guards inside, and registers its own key in a special firmware drawer that becomes invisible as soon as Windows finishes starting.',
        simpleExplanation:
          'Running as a local administrator, the BlackLotus installer mounted the hidden FAT32 `EFI System Partition (ESP)`, dropped legitimate Microsoft-signed copies of `bootmgfw.efi`, `hvloader.efi`, and `winload.efi` (which remained trusted by UEFI Secure Boot because their hashes had not yet been added to the UEFI `DBX` forbidden signature database), and called `ZwSetSystemEnvironmentValueEx` to write a `MokList` UEFI NVRAM variable with the `EFI_VARIABLE_BOOTSERVICE_ACCESS` flag (making the variable readable during early boot but completely invisible to the running OS after `ExitBootServices()` is called).',
        howItWorksInPractice:
          'By setting only `EFI_VARIABLE_NON_VOLATILE | EFI_VARIABLE_BOOTSERVICE_ACCESS` (omitting `EFI_VARIABLE_RUNTIME_ACCESS`), user-mode and kernel-mode security tools running after Windows boots cannot query or delete the NVRAM variable without rebooting.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the BlackLotus User-Mode Installer to the EFI System Partition & NVRAM (`MOK`) as vulnerable signed bootloaders are written.',
        detectionAndEvidence:
          'Sysmon EventID 11 file creation events inside `\\Device\\HarddiskVolume1\\EFI\\` and calls to `ZwSetSystemEnvironmentValueEx`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: '"Baton Drop" BCD Argument Truncation Exploit (CVE-2022-21894)',
        storyAnalogy:
          'During reboot, the older signed guard reads a deliberately cut-off instruction line on the boot clipboard, causing them to overwrite their own rulebook in memory.',
        simpleExplanation:
          'On the next boot, the staged vulnerable `bootmgfw.efi` / `winload.efi` parsed a custom Boot Configuration Data (`BCD`) store crafted by BlackLotus to trigger `CVE-2022-21894` (`Baton Drop`, a memory corruption and argument truncation flaw in `BlImgQueryCodeIntegrityBootOptions` that grants arbitrary physical memory write while UEFI Boot Services are still active), allowing BlackLotus to overwrite the in-memory Secure Boot and Code Integrity state and execute its own self-signed UEFI application.',
        howItWorksInPractice:
          'Because the exploit runs after UEFI firmware verifies `bootmgfw.efi`’s genuine Microsoft signature but before `ExitBootServices()`, BlackLotus hijacks the boot chain without modifying the motherboard’s physical SPI flash.',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the EFI System Partition & NVRAM to the Vulnerable `winload.efi` (`CVE-2022-21894`) while the ESET / CISA TPM Attestation sensor flags the PCR[4]/PCR[7] digest mismatch.',
        detectionAndEvidence:
          'TPM 2.0 Measured Boot attestation logs (WBCL) showing an outdated `winload.efi` hash in `PCR[4]` or `PCR[7]` Secure Boot policy changes.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1068',
        plainTitle: 'Disabling BitLocker / HVCI & Deploying Unsigned Ring-0 Kernel Driver',
        storyAnalogy:
          'Before waking up the main Windows operating system, the bootkit cuts the wires to the hypervisor shield and slips an invisible bodyguard into the kernel.',
        simpleExplanation:
          'With early-boot execution control, BlackLotus patched `hvloader.efi` and `winload.efi` (`OslFwpKernelSetupPhase1`) in RAM to neutralize `Hypervisor-Protected Code Integrity (HVCI / VBS)` and `BitLocker`, mapped an unsigned 64-bit Ring-0 kernel driver into `ntoskrnl.exe` memory space, and injected an HTTPS C2 downloader into `winlogon.exe` (while the kernel driver protected the bootkit’s ESP files and registry keys from deletion).',
        howItWorksInPractice:
          'Remediation required applying Microsoft’s `DBX` UEFI revocation update (KB5025885)—which adds the vulnerable bootloaders’ hashes to the motherboard’s UEFI NVRAM `DBX`—and wiping the EFI System Partition.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the patched `winload.efi` deploying the Ring-0 Kernel Driver & Disabled HVCI state and connecting back to the attacker C2.',
        detectionAndEvidence:
          'Windows CodeIntegrity / System Event Logs reporting unexpected HVCI/VBS disablement across reboots and network connections initiated by `winlogon.exe`.',
      },
    ],
  },
  'aukill-edr-killer-procxp152-byovd': {
    scenarioId: 'aukill-edr-killer-procxp152-byovd',
    briefing: {
      headline:
        'Ransomware affiliates deploy AuKill ("EDRKiller"), dropping an older Microsoft-signed Sysinternals Process Explorer driver (PROCEXP152.SYS v16.32) to send IOCTL 0x8335003C and 0x83350004 and terminate Protected Process Light (PPL) EDR agents from Ring 0.',
      storyAnalogy:
        'Imagine a building where normal workers are forbidden from touching the security cameras (`Protected Process Light`). However, an old master maintenance robot built by the building’s own manufacturer (`Sysinternals PROCEXP152.SYS`) has a valid master badge and will obey anyone who pushes its buttons (`IOCTL 0x8335003C`). A burglar wheels the old maintenance robot out of a backpack and orders it to unplug every security camera in the building.',
      plainSummary:
        'Dissected by Sophos X-Ops and Elastic Security Labs in 2023 across Medusa Locker and LockBit intrusions, AuKill is a C++ Bring Your Own Vulnerable Driver (BYOVD) tool. It drops version 16.32 of Microsoft’s signed Sysinternals Process Explorer kernel driver (`PROCEXP152.SYS`) into `System32\\drivers` and issues `DeviceIoControl` codes `0x8335003C` (open protected process handle) and `0x83350004` (close handle) to strip handles and kill PPL-protected EDR/AV services from Ring 0.',
      diagramTopologySummary:
        'AuKill User-Mode Controller -> SCM Service (PROCEXP152.SYS v16.32) -> DeviceIoControl (0x8335003C / 0004) -> Terminated PPL EDR & AV Services -> Sophos X-Ops / Elastic WDAC Blocklist.',
      documentedAdvisory:
        'Sophos X-Ops AuKill EDR Killer Technical Analysis / Elastic Security Labs BYOVD Detection Guide / Microsoft Vulnerable Driver Blocklist',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1543.003',
        plainTitle: 'Dropping & Registering Vulnerable Signed PROCEXP152.SYS v16.32',
        storyAnalogy:
          'Because the front gate only lets in tools carrying a genuine Microsoft signature, the attacker unpacks an older, Microsoft-signed diagnostic driver that has no caller check.',
        simpleExplanation:
          'Running with local administrator rights, `AuKill` unpacked an embedded resource containing version `16.32` of `PROCEXP152.SYS` into `C:\\Windows\\System32\\drivers\\PROCEXP152.SYS` and loaded it via `CreateServiceW` / `StartServiceW` (bypassing Windows Driver Signature Enforcement because `PROCEXP152.SYS` v16.32 carries a valid `Microsoft Windows Hardware Compatibility Publisher` Authenticode signature).',
        howItWorksInPractice:
          'While newer versions of Sysinternals Process Explorer (`v17.0+`) added security descriptor checks restricting driver access, version `16.32` permitted any local administrator process to open its device object.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the AuKill User-Mode Controller to the SCM Service (`PROCEXP152.SYS v16.32`) during driver installation.',
        detectionAndEvidence:
          'Sysmon EventID 6 (`DriverLoaded`) for `PROCEXP152.SYS` (version `16.32`) where the parent/creator process is not a signed `procexp.exe` or `procexp64.exe` binary.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: 'Opening \\\\.\\PROCEXP152 & Issuing IOCTL 0x8335003C / 0x83350004',
        storyAnalogy:
          'Once the maintenance robot is switched on in the kernel room, the attacker’s program sends rapid-fire remote control codes telling it which security guard badges to grab and tear up.',
        simpleExplanation:
          '`AuKill` opened a file handle to `\\\\.\\PROCEXP152` and spawned multiple worker threads that enumerated running processes and handles, invoking `DeviceIoControl` with `IOCTL 0x8335003C` (`IOCTL_OPEN_PROTECTED_PROCESS_HANDLE`, which calls `ZwOpenProcess` from Ring-0 kernel mode to return a full-access handle to any `Protected Process Light` PID) and `IOCTL 0x83350004` (`IOCTL_CLOSE_HANDLE`, which forces the kernel to close every active handle held by the target security service).',
        howItWorksInPractice:
          'Normally, Windows blocks user-mode administrators from opening `PROCESS_TERMINATE` handles to `PsProtectedSignerAntimalware-Light` (PPL) processes, but a `ZwOpenProcess` call originating from a Ring-0 kernel driver (`KernelMode` previous mode) bypasses PPL checks completely.',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the `PROCEXP152.SYS` service to the `DeviceIoControl (0x8335003C / 0004)` dispatch handler and triggers the Sophos X-Ops / Elastic WDAC sensor.',
        detectionAndEvidence:
          'ETW `Microsoft-Windows-Kernel-File` events showing non-Sysinternals binaries opening `\\Device\\PROCEXP152` and issuing IOCTLs `0x8335003C` or `0x83350004`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1486',
        plainTitle: 'Ring-0 Termination of PPL EDR Sensors & Ransomware Detonation',
        storyAnalogy:
          'With every camera and alarm ripped out from the inside, the ransomware crew walks in and locks every file server in silence.',
        simpleExplanation:
          'Using the Ring-0 handle returned by `0x8335003C` and the handle-closing primitive `0x83350004`, `AuKill` continuously terminated processes and services matching Microsoft Defender (`MsMpEng.exe`), Sophos, Elastic, SentinelOne, and Carbon Black, clearing the way for immediate detonation of `Medusa Locker` or `LockBit` ransomware.',
        howItWorksInPractice:
          '`AuKill` keeps its worker threads running in the background during encryption so if the Windows Service Control Manager attempts to restart a crashed EDR service, `AuKill` kills the new PID within milliseconds.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the `DeviceIoControl` handler neutralizing Terminated PPL EDR & AV Services.',
        detectionAndEvidence:
          'Enabling Microsoft’s Vulnerable Driver Blocklist (`SiPolicy.p7b` + HVCI) to prevent `PROCEXP152.SYS` v16.32 from loading in the first place.',
      },
    ],
  },
  'crowdstrike-poortry-burntcigar-byovd': {
    scenarioId: 'crowdstrike-poortry-burntcigar-byovd',
    briefing: {
      headline:
        'Threat actors (UNC3944 / RansomHub) use the STONESTOP loader to install POORTRY (BURNTCIGAR)—a custom malicious kernel rootkit signed via abused Microsoft WHQL attestation accounts—to wipe kernel notify callbacks and strip PPL protections.',
      storyAnalogy:
        'Instead of tricking an old maintenance robot, a syndicate sets up a fake hardware company, submits their own custom-built assassin robot to the official city licensing office (`WHQL Attestation Signing`), gets an official holographic seal stamped onto it, and walks it right into the central nervous system of the building where it erases the phone numbers of every security guard on the emergency call list (`PspCreateProcessNotifyRoutine`).',
      plainSummary:
        'Uncovered by Mandiant, CrowdStrike, and Sophos and addressed in Microsoft Security Advisory ADV220005, `STONESTOP` (user-mode loader) and `POORTRY` / `BURNTCIGAR` (kernel-mode rootkit) represent an evolution beyond traditional BYOVD. Rather than exploiting a bug in a legitimate third-party driver, attackers submitted their own purpose-built malicious kernel driver to Microsoft’s Windows Hardware Developer Program (WHQL attestation signing) to obtain a genuine Microsoft signature, using it to zero out kernel telemetry callbacks (`PspCreateProcessNotifyRoutine`) and strip `EPROCESS` PPL flags.',
      diagramTopologySummary:
        'STONESTOP User-Mode Loader -> WHQL-Signed POORTRY.sys Driver -> ntoskrnl PspCreateProcessNotifyRoutine -> Blinded Kernel Telemetry & LSASS Dump -> Mandiant / CrowdStrike Falcon Sensor.',
      documentedAdvisory:
        'Mandiant Prolific Driver Signing Abuse (STONESTOP / POORTRY) / Microsoft Security Advisory ADV220005 / CrowdStrike BURNTCIGAR Analysis',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1553.002',
        plainTitle: 'Loading Custom Malicious Driver POORTRY Signed via Abused WHQL Account',
        storyAnalogy:
          'The attacker presents a brand-new, custom-written rootkit that carries a genuine Microsoft hardware certification stamp obtained through a fraudulent developer account.',
        simpleExplanation:
          'The user-mode loader `STONESTOP` dropped `poortry.sys` (`BURNTCIGAR`) to disk and invoked `NtLoadDriver`. Because the threat actor had submitted `poortry.sys` through compromised or fraudulent accounts in the `Microsoft Windows Hardware Compatibility Program (WHQL Attestation Signing)` portal, the malicious driver bore a valid `Microsoft Windows Hardware Compatibility Publisher` signature and loaded cleanly into Ring 0 on modern Windows systems.',
        howItWorksInPractice:
          'Because `poortry.sys` was a brand-new custom binary rather than a known historical vulnerable driver, hash-based vulnerable driver blocklists did not block it until Microsoft revoked the underlying WHQL certificates in `ADV220005`.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the STONESTOP User-Mode Loader to the WHQL-Signed `POORTRY.sys` Driver as it loads into Ring 0.',
        detectionAndEvidence:
          'Sysmon EventID 6 driver loads from temp/user directories (`C:\\Windows\\Temp\\`, `C:\\ProgramData\\`) and enforcement of Microsoft ADV220005 / KB5020779 certificate revocations.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: 'Authenticated IOCTL Handshake & Kernel Notify Callback Array Wiping',
        storyAnalogy:
          'To stop researchers from analyzing the robot, it refuses to act until its controller whispers a secret cryptographic password—and then it erases the kernel’s notification phonebook so security tools never hear about new programs starting.',
        simpleExplanation:
          'Before executing commands, `POORTRY` required `STONESTOP` to complete a cryptographic challenge-response handshake over `DeviceIoControl` (preventing security analysts or competing malware from invoking its IOCTLs without the matching `STONESTOP` loader). Once authenticated, `POORTRY` scanned `ntoskrnl.exe` memory to locate the `PspCreateProcessNotifyRoutine`, `PspCreateThreadNotifyRoutine`, and `PspLoadImageNotifyRoutine` kernel callback arrays and overwrote the registered EDR driver callback pointers with `NULL` (blinding EDR kernel drivers so the Windows kernel no longer notified them when new processes, threads, or DLLs were created).',
        howItWorksInPractice:
          '`POORTRY` also unlinked registry (`CmUnRegisterCallback`) and object (`ObUnRegisterCallbacks`) filter callbacks and removed minifilter filesystem callbacks registered by endpoint security sensors.',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the WHQL-Signed `POORTRY.sys` Driver to `ntoskrnl PspCreateProcessNotifyRoutine` and triggers the Mandiant / CrowdStrike Falcon Sensor.',
        detectionAndEvidence:
          'EDR kernel callback integrity watchdogs that periodically verify their own function pointers remain present in `PspCreateProcessNotifyRoutine` and `ObRegisterCallbacks`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1003.001',
        plainTitle: 'EPROCESS Protection Bit Stripping, EDR Termination & LSASS Credential Dump',
        storyAnalogy:
          'Finally, the rootkit reaches into the kernel’s ID badge table, erases the "Protected" stamp next to the password vault (`lsass.exe`) and the security guards, kills the guards, and empties the vault.',
        simpleExplanation:
          '`POORTRY` performed `Direct Kernel Object Manipulation (DKOM)` against the opaque `EPROCESS` kernel structures of both EDR processes and `lsass.exe`, zeroing out their `_PS_PROTECTION` (`Protection`, `SignatureLevel`, and `SectionSignatureLevel` bytes in kernel memory) before calling `ZwTerminateProcess` on the EDR agents and allowing `STONESTOP` to dump `lsass.exe` memory without triggering PPL access-denied errors.',
        howItWorksInPractice:
          'UNC3944 (Scattered Spider) and multiple ransomware affiliates used `STONESTOP`/`POORTRY` on high-value telecom, BPO, and financial servers to silence EDR telemetry prior to credential dumping and VMware ESXi takeover.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the `ntoskrnl` tampering node to the Blinded Kernel Telemetry & LSASS Dump stage.',
        detectionAndEvidence:
          'Enabling Windows Credential Guard (Virtualization-Based Security `LsaIso.exe`) so LSASS secrets reside in VTL1 hypervisor memory unreachable even from Ring-0 VTL0 kernel drivers.',
      },
    ],
  },
  'linux-bpfdoor-ebpf-socket-filter-apt': {
    scenarioId: 'linux-bpfdoor-ebpf-socket-filter-apt',
    briefing: {
      headline:
        'Red Menshen deploys BPFDoor onto Linux servers, copying itself to /dev/shm/kdmtmpflush, unlinking the binary, masquerading as hald-addon-acpi, and attaching a kernel Berkeley Packet Filter (SO_ATTACH_FILTER) to passively sniff magic packets (0x7255 / 0x5293) ahead of iptables.',
      storyAnalogy:
        'Imagine a spy hiding inside a central post office who doesn’t rent a P.O. Box (`listening port`) and never makes outgoing phone calls (`beacons`). Instead, the spy stands invisibly beside the mail chute at the very entrance—ahead of the building’s security checkpoint (`iptables`)—watching every piece of mail addressed to anyone else. Only when a postcard arrives with a secret watermark (`0x7255`) does the spy step out and unlock a side door.',
      plainSummary:
        'Unmasked by PwC Threat Intelligence (attributing it to China-nexus APT Red Menshen) and analyzed in depth by Sandfly Security and Elastic, BPFDoor is a passive Linux/Solaris implant that evaded detection for over five years across telecom and government networks. It runs from unlinked RAM storage (`/dev/shm/kdmtmpflush (deleted)`), spoofs its process name in `ps`, opens zero listening TCP/UDP ports, and attaches a classic Berkeley Packet Filter (`SO_ATTACH_FILTER`) to a raw socket to inspect all inbound traffic at the NIC layer for magic bytes `0x7255` (UDP/ICMP) or `0x5293` (TCP).',
      diagramTopologySummary:
        'Red Menshen Operator (Magic Packet) -> Linux Host eth0 (Before iptables) -> Raw Socket BPF Filter (0x7255 / 0x5293) -> Masqueraded Shell (/dev/shm/kdmtmpflush) -> PwC / Sandfly / Elastic Linux Sensor.',
      documentedAdvisory:
        'PwC Threat Intelligence Red Menshen / BPFDoor Report / Sandfly Security BPFDoor Forensic Analysis / Elastic Security Labs Guide',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1036.004',
        plainTitle: 'In-Memory /dev/shm/kdmtmpflush Execution, Unlinking & Process Masquerading',
        storyAnalogy:
          'The spy copies their disguise into temporary RAM memory, burns the original file on disk, changes their file timestamp to 2008, and puts on a nametag reading "Linux Power Management Daemon."',
        simpleExplanation:
          'When launched as `root`, BPFDoor copied its ELF binary to `/dev/shm/kdmtmpflush` (the RAM-backed `tmpfs` shared memory filesystem), timestomped its modification date to `2008-10-30`, re-executed itself with `--init`, immediately deleted `/dev/shm/kdmtmpflush` from the filesystem (leaving the process running purely in RAM while `/proc/<pid>/exe` pointed to `/dev/shm/kdmtmpflush (deleted)`), and called `prctl(PR_SET_NAME)` plus `argv[0]` overwriting to masquerade as `hald-addon-acpi: listening on acpi kernel interface` or `/usr/libexec/postfix/master`.',
        howItWorksInPractice:
          'Standard administrator checks like `ps aux` displayed a convincing Linux system daemon name, while disk-based antivirus scans found nothing because the executable file had already been unlinked.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Red Menshen Operator to the Masqueraded Shell (`/dev/shm/kdmtmpflush`) during initial RAM staging.',
        detectionAndEvidence:
          'Scanning `/proc/[0-9]*/exe` symlinks for `/dev/shm/* (deleted)` and comparing `/proc/[pid]/comm` against the actual binary path in `/proc/[pid]/exe`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1205.002',
        plainTitle: 'Attaching Kernel Berkeley Packet Filter via setsockopt(SO_ATTACH_FILTER)',
        storyAnalogy:
          'Instead of opening a numbered door that shows up on the building directory (`netstat`), the spy installs a tiny sieve inside the main network pipe that only lets through packets carrying the secret watermark.',
        simpleExplanation:
          'BPFDoor called `socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP))` to create a raw packet socket and invoked `setsockopt(sock, SOL_SOCKET, SO_ATTACH_FILTER, &bpf_prog, ...)` (attaching a 30-instruction classic Berkeley Packet Filter bytecode program into the Linux kernel that inspects every frame arriving on the network card **before** `iptables` or `nftables` firewall rules are evaluated, dropping normal traffic so BPFDoor consumes 0% CPU until a packet containing magic bytes `0x7255` at UDP/ICMP offset or `0x5293` at TCP offset arrives).',
        howItWorksInPractice:
          'Because `AF_PACKET` sockets do not bind a TCP or UDP port, `netstat -tlpn`, `ss -tlpn`, and external port scanners (`nmap`) show zero open backdoor ports—and the attacker can send the magic packet to any port (even ports blocked by `iptables` or already used by Apache/SSH on port 443/22).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Linux Host `eth0` (`Before iptables`) to the Raw Socket BPF Filter (`0x7255 / 0x5293`) and triggers the PwC / Sandfly / Elastic Linux Sensor.',
        detectionAndEvidence:
          'Running `ss -0pb` on Linux to enumerate `AF_PACKET` raw sockets and their attached BPF bytecode filters (specifically looking for decimal constants `29269` (`0x7255`) and `21139` (`0x5293`)).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1205.001',
        plainTitle: 'Magic Packet Activation, iptables Port Redirection & Memory-Only PTY Shell',
        storyAnalogy:
          'When the secret postcard arrives, the spy checks the password written on it, temporarily bends the front-door mail tube (`SSH Port 22`) straight to their hidden room for the attacker’s IP address only, and erases the bend when finished.',
        simpleExplanation:
          'Upon receiving a TCP, UDP, or ICMP Echo packet containing `0x7255` / `0x5293` and a valid password hash, BPFDoor forked a child process, allocated a pseudo-terminal (`/dev/ptmx` without recording a login in `/var/log/wtmp` or `utmp`), and either connected back to the attacker with an RC4-encrypted reverse shell or executed `/sbin/iptables -t nat -A PREROUTING -p tcp -s <attacker_ip> --dport 22 -j REDIRECT --to-ports <ephemeral_port>` (hijacking inbound connections on legitimate port 22/80/443 exclusively for the attacker’s source IP while all other users still reached the real SSH/web server).',
        howItWorksInPractice:
          'As soon as the interactive session ended, BPFDoor executed `iptables -t nat -D PREROUTING ...` to delete the temporary NAT redirection rule and return to passive dormancy.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the Magic Packet from the Red Menshen Operator through `eth0` and the Raw Socket BPF Filter to activate the Masqueraded Shell.',
        detectionAndEvidence:
          'Network IDS rules matching `0x7255` / `0x5293` magic payloads and Linux auditd monitoring for `setsockopt` (`SO_ATTACH_FILTER`) and unexpected `iptables -t nat` invocations.',
      },
    ],
  },
  'kaspersky-cosmicstrand-uefi-spi-rootkit': {
    scenarioId: 'kaspersky-cosmicstrand-uefi-spi-rootkit',
    briefing: {
      headline:
        'CosmicStrand infects the motherboard SPI flash firmware image inside the CSMCORE DXE driver, chaining a 4-stage memory hook relay (CSMCORE -> bootmgfw.efi -> winload.efi -> ntoskrnl.exe) across every boot to disable PatchGuard and deploy a kernel C2 implant.',
      storyAnalogy:
        'Imagine a ghost etched directly into the silicon blueprint of a building’s foundation (`SPI Flash Chip`). Even if the owner bulldozes the interior walls and installs a brand-new hard drive and operating system, the moment the main power breaker is flipped on, the ghost whispers to the foundation controller (`CSMCORE`), who whispers to the elevator operator (`bootmgfw.efi`), who whispers to the floor manager (`winload.efi`), who finally slips a mind-control chip into the building director (`ntoskrnl.exe`) before the director even opens their eyes.',
      plainSummary:
        'Detailed by Kaspersky GReAT in July 2022, CosmicStrand is an advanced China-nexus UEFI firmware rootkit residing inside the physical SPI NOR flash chip of ASUS and Gigabyte H81 motherboards. Because it lives in motherboard firmware rather than on the hard drive, it survives full disk formatting and drive replacement. On every boot, its patched `CSMCORE` DXE driver hooks `HandleProtocol` to propagate a fileless in-memory hook chain through `bootmgfw.efi` and `winload.efi` directly into `ntoskrnl.exe`, disabling Kernel Patch Protection (PatchGuard) and deploying a Ring-0 implant.',
      diagramTopologySummary:
        'Motherboard SPI Flash (CSMCORE DXE) -> Boot Chain (bootmgfw -> winload.efi) -> Patched ntoskrnl.exe & Kernel Implant -> CosmicStrand C2 Server -> Kaspersky GReAT Firmware Scanner.',
      documentedAdvisory:
        'Kaspersky GReAT CosmicStrand UEFI Firmware Rootkit Technical Report / Qihoo 360 Early SPI Analysis / MITRE ATT&CK T1542.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1542.001',
        plainTitle: 'Motherboard SPI Flash Infection of CSMCORE DXE Driver (HandleProtocol Hook)',
        storyAnalogy:
          'Before the computer even knows what a hard drive is, a modified chip on the motherboard wakes up and places a tap on the firmware’s main telephone switchboard (`HandleProtocol`).',
        simpleExplanation:
          'CosmicStrand modified the UEFI firmware image stored inside the motherboard’s physical 8MB `SPI NOR flash chip`, specifically patching the `CSMCORE` DXE driver (`GUID {A062CF1F-8473-4AA3-8793-600BC4FFE9A8}`). When the UEFI Driver Execution Environment (`DXE`) loaded `CSMCORE`, the patched entry point jumped to shellcode appended in the `.reloc` section, which hooked `EFI_BOOT_SERVICES.HandleProtocol` (the core UEFI Boot Service function invoked later when locating and loading the OS boot manager).',
        howItWorksInPractice:
          'Because the infection resides entirely inside the motherboard’s SPI flash chip, replacing the SSD/NVMe drive or reinstalling Windows from a clean ISO has zero effect on the rootkit.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Motherboard SPI Flash (`CSMCORE DXE`) to the Boot Chain (`bootmgfw -> winload.efi`) as `HandleProtocol` is hooked.',
        detectionAndEvidence:
          'Dumping the SPI flash ROM via `CHIPSEC` or UEFI firmware scanners and detecting modifications to the `CSMCORE` DXE module entry point and `.reloc` section.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1542.003',
        plainTitle: 'Multi-Hop Boot Hooking Relay (bootmgfw.efi -> winload.efi)',
        storyAnalogy:
          'Like a baton passed in a relay race entirely in RAM, each boot component patches the next component in memory right before handing over control, without ever touching a file on the hard drive.',
        simpleExplanation:
          'When `HandleProtocol` was called during boot, CosmicStrand scanned memory for `bootmgfw.efi` and placed an inline hook on `Archpx64TransferTo64BitApplicationAsm`. When `bootmgfw.efi` loaded `winload.efi` into RAM and called that function, the hook scanned `winload.efi` for the byte signature of `OslArchTransferToKernel` (the final OS loader routine that switches the CPU into kernel execution and jumps to `ntoskrnl.exe`’s entry point) and hooked it in memory.',
        howItWorksInPractice:
          'Because `bootmgfw.efi`, `winload.efi`, and `ntoskrnl.exe` on the disk partition are never modified on disk, offline disk forensics and file-hash checks report 100% clean Microsoft system binaries.',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Boot Chain (`bootmgfw -> winload.efi`) to the Kaspersky GReAT Firmware Scanner and into the Windows Kernel handoff.',
        detectionAndEvidence:
          'Pre-OS boot integrity verification and kernel memory scanning comparing in-RAM `.text` sections of `ntoskrnl.exe` against the clean on-disk PE image.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1014',
        plainTitle: 'PatchGuard Neutralization, ntoskrnl.exe ZwCreateSection Hook & Kernel C2',
        storyAnalogy:
          'Right before the Windows kernel takes its first breath, the relay runner disables the kernel’s self-inspection alarm (`PatchGuard`) and plants a hidden radio inside the kernel’s own code pages.',
        simpleExplanation:
          'At the `OslArchTransferToKernel` handoff—before `ntoskrnl.exe` even executed its first instruction—CosmicStrand patched `KiFilterFiberContext` in `ntoskrnl.exe` RAM to immediately return (preventing Windows `Kernel Patch Protection / PatchGuard` from initializing), copied its shellcode into unused `.text` section slack space inside `ntoskrnl.exe`, and placed an inline hook on `ZwCreateSection` (waiting for `smss.exe` to map `\KnownDlls\ntdll.dll` as a signal that the OS network stack is ready before mapping its final kernel-mode C2 implant).',
        howItWorksInPractice:
          'Once Windows networking initialized, the kernel implant resolved its C2 domain via raw kernel sockets (`tdi.sys`) to fetch second-stage user/kernel payloads.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the `winload.efi` hook into the Patched `ntoskrnl.exe` & Kernel Implant and out to the CosmicStrand C2 Server.',
        detectionAndEvidence:
          'Live kernel memory forensics (`Volatility` / EDR kernel integrity scan) detecting inline hooks on `ntoskrnl.exe!ZwCreateSection` and patched bytes at `ntoskrnl.exe!KiFilterFiberContext`.',
      },
    ],
  },
  'sentinelone-terminator-zemana-byovd': {
    scenarioId: 'sentinelone-terminator-zemana-byovd',
    briefing: {
      headline:
        'Sold on cybercrime forums as "Terminator", this EDR killer drops a signed Zemana AntiMalware driver (zam64.sys), registers its own PID in the driver’s allowlist via unauthenticated IOCTL 0x80002010 (CVE-2021-31728), and loops IOCTL 0x80002048 to kill 24+ EDR/AV agents from Ring 0.',
      storyAnalogy:
        'Imagine an armored security van (`zam64.sys`) that promises it will only take orders from people whose names are written on its VIP clipboard. However, the van has a public window (`IOCTL 0x80002010`) where any stranger on the street can walk up and say, "Please write my name on the VIP clipboard!" Once their name is on the clipboard, the stranger uses the van’s roof cannon (`IOCTL 0x80002048`) to blast every police car on the block.',
      plainSummary:
        'Marketed on Russian cybercrime forums in May 2023 for $3,000 as a zero-day EDR bypass and rapidly reverse-engineered by SentinelOne and CrowdStrike, "Terminator" is a BYOVD wrapper abusing `zam64.sys` (a legitimate, Microsoft-signed kernel driver from Zemana AntiMalware vulnerable to CVE-2021-31728). Terminator drops `zam64.sys` under a random filename, calls `DeviceIoControl` with `0x80002010` to add its own PID to the driver’s internal trusted process list, and then loops `0x80002048` (`ZwTerminateProcess`) to kill processes belonging to 24 security vendors.',
      diagramTopologySummary:
        'Terminator.exe User-Mode Binary -> Signed Zemana Driver (zam64.sys) -> IOCTL 0x80002010 Allowlist Bypass -> IOCTL 0x80002048 Ring-0 Process Kill -> SentinelOne / CrowdStrike Behavioral IOA.',
      documentedAdvisory:
        'SentinelOne & CrowdStrike Technical Breakdown of "Terminator" EDR Killer / NVD CVE-2021-31728 (Zemana zam64.sys)',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1068',
        plainTitle: 'Dropping Randomized Signed Zemana Driver (zam64.sys) into System32\\drivers',
        storyAnalogy:
          'To avoid being recognized by name at the door, the attacker paints a random 8-letter name onto the side of the signed Zemana driver before loading it.',
        simpleExplanation:
          'When executed with administrator privileges, `Terminator.exe` wrote an embedded copy of `zam64.sys` (a kernel driver validly signed by `Zemana Ltd.` and countersigned by Microsoft) into `C:\\Windows\\System32\\drivers\\` using a randomly generated 5-to-10 character `.sys` filename (evading naive detection rules that only check if the file path ends in `zam64.sys`) and started the kernel service via the Service Control Manager.',
        howItWorksInPractice:
          'Regardless of the randomized `.sys` filename on disk, the driver’s `DriverEntry` routine always creates the fixed device symbolic link `\\\\.\\ZemanaAntiMalware` (or `\\\\.\\B94B8021-5217-4091-96E5-6353272B9429`).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the `Terminator.exe` User-Mode Binary to the Signed Zemana Driver (`zam64.sys`) as the randomized service is loaded.',
        detectionAndEvidence:
          'Sysmon EventID 6 matching the SHA-256 hash, PE `OriginalFileName` (`zam64.sys` / `zamguard64.sys`), or `Zemana Ltd.` certificate thumbprint regardless of filename.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1068',
        plainTitle: 'Self-Allowlisting Caller PID via Unauthenticated IOCTL 0x80002010 (CVE-2021-31728)',
        storyAnalogy:
          'The driver checks an internal VIP list before running dangerous commands—but leaves the "Add Me to the VIP List" button completely unguarded.',
        simpleExplanation:
          'Although `zam64.sys` checks an internal allowlist of trusted Process IDs before permitting privileged operations like process termination or raw disk access, it exposes `IOCTL 0x80002010` (`IOCTL_REGISTER_PROCESS`, tracked as `CVE-2021-31728`, which accepts any 4-byte DWORD Process ID from user mode and appends it to the driver’s Ring-0 trusted process table without verifying the caller’s executable signature). `Terminator.exe` simply passed `GetCurrentProcessId()` to `0x80002010` to authorize itself.',
        howItWorksInPractice:
          'Once a PID is registered via `0x80002010`, `zam64.sys` unlocks its full suite of administrative IOCTLs—including process termination, registry manipulation, and direct SCSI/disk read-write—for that caller.',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Signed Zemana Driver (`zam64.sys`) to the `IOCTL 0x80002010` Allowlist Bypass node and triggers the SentinelOne / CrowdStrike Behavioral IOA.',
        detectionAndEvidence:
          'Kernel ETW / EDR behavioral monitoring alerting on any process opening `\\\\.\\ZemanaAntiMalware` and issuing `IOCTL 0x80002010`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1562.001',
        plainTitle: 'Continuous Ring-0 Termination Loop via IOCTL 0x80002048',
        storyAnalogy:
          'Now recognized as a VIP by the kernel driver, the attacker’s program runs an endless loop telling the driver to shoot down every security process that appears.',
        simpleExplanation:
          'In an infinite `while (true)` loop, `Terminator.exe` called `CreateToolhelp32Snapshot` to enumerate active processes, compared each executable name against a hardcoded array of 24 security vendors (CrowdStrike, SentinelOne, Defender, Sophos, Cortex XDR, Kaspersky, McAfee, Trend Micro, etc.), and sent `IOCTL 0x80002048` with the matching PID (causing `zam64.sys` to call `ZwTerminateProcess` from Ring 0 and bypass User-Mode PPL protections).',
        howItWorksInPractice:
          'Modern EDRs neutralize Terminator prior to `0x80002048` by blocking the load of `zam64.sys` at `NtLoadDriver` / `DriverLoad` time using behavioral prevention and kernel blocklists.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the Allowlist Bypass node invoking `IOCTL 0x80002048` Ring-0 Process Kill against endpoint security agents.',
        detectionAndEvidence:
          'Pre-execution blocking of `zam64.sys` via Microsoft Vulnerable Driver Blocklist and EDR driver-load prevention policies.',
      },
    ],
  },
  'intezer-blackberry-symbiote-linux-ldpreload': {
    scenarioId: 'intezer-blackberry-symbiote-linux-ldpreload',
    briefing: {
      headline:
        'Symbiote is a parasitic Linux shared-object (.so) rootkit loaded via /etc/ld.so.preload into every running process, hooking libc and PAM to steal SSH credentials and hooking libpcap (pcap_compile) to inject BPF bytecode that hides its network traffic from tcpdump.',
      storyAnalogy:
        'Imagine a parasite that doesn’t walk around the building on its own legs (so no guard ever sees an intruder on the hallway cameras). Instead, it slips a pair of augmented-reality glasses (`/etc/ld.so.preload`) onto every single employee in the building the moment they wake up. When an administrator looks at the room directory (`ls`) or the network monitor (`tcpdump`), the glasses digitally erase the parasite and its network wires from the administrator’s field of view.',
      plainSummary:
        'Jointly disclosed by BlackBerry and Intezer in June 2022 targeting Latin American financial institutions, Symbiote is a userland Linux rootkit compiled as a shared object (`.so`) library rather than a standalone executable. By injecting itself into `/etc/ld.so.preload`, it infects every dynamically linked process on the machine, hooking `libc` (`fopen`, `getdents64`, `read`) to conceal its files and harvest `ssh`/`scp` keystrokes, hooking `pam_authenticate` for backdoor root SSH access, and hooking `libpcap` to rewrite BPF packet filters on the fly so `tcpdump` cannot see its C2 traffic.',
      diagramTopologySummary:
        'Symbiote DNS / HTTPS C2 Operator -> /etc/ld.so.preload (liblinux.so) -> Hooked sshd / PAM Credential Harvester -> Hooked tcpdump / libpcap BPF Scrubber -> BlackBerry / Intezer Static ELF Scanner.',
      documentedAdvisory:
        'BlackBerry & Intezer Joint Technical Report on Symbiote Linux Malware / MITRE ATT&CK T1574.006 (Dynamic Linker Hijacking)',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1574.006',
        plainTitle: 'Global Dynamic Linker Injection via /etc/ld.so.preload',
        storyAnalogy:
          'By adding its name to the master startup list of the Linux library loader, the恶意 shared library forces every program on the server to load it first before doing anything else.',
        simpleExplanation:
          'Rather than running as a separate process, Symbiote was deployed as a shared library (e.g., `/usr/lib/liblinux.so`) and added to `/etc/ld.so.preload` (a system-wide configuration file read by the GNU dynamic linker `/lib64/ld-linux-x86-64.so.2` that forces the specified `.so` library to be mapped into the address space of **every** dynamically linked process before `libc.so.6`), allowing Symbiote to override standard library functions (`fopen`, `readdir`, `getdents64`, `execve`) via symbol interposition.',
        howItWorksInPractice:
          'If an administrator runs `cat /etc/ld.so.preload`, `ls /usr/lib`, or `ldd /bin/ls` using standard dynamically linked system binaries, Symbiote’s hooked `fopen` and `getdents64` functions filter out its own filenames and return empty/clean results.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Symbiote C2 Operator to `/etc/ld.so.preload (liblinux.so)` as the shared library infects all dynamic processes.',
        detectionAndEvidence:
          'Inspecting `/etc/ld.so.preload` and `/proc/1/maps` using a **statically compiled** binary (which does not use `ld-linux.so` and is immune to `LD_PRELOAD` userland hooks) or kernel-level eBPF sensors.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1556.003',
        plainTitle: 'PAM Backdoor Authentication & ssh/scp libc_read Keystroke Harvesting',
        storyAnalogy:
          'Because the parasite is already inside the SSH server and client programs, it listens as administrators type passwords to other servers and unlocks the front door whenever its own secret password is used.',
        simpleExplanation:
          'When loaded inside `ssh` or `scp` client processes, Symbiote hooked `libc`’s `read()` function to capture administrator passwords and keystrokes into an RC4-encrypted stash file (`/var/tmp/.certs`). When loaded inside the `sshd` daemon, it hooked `pam_authenticate()` and `pam_acct_mgmt()` (granting instant `root` SSH login whenever the attacker authenticated with a hardcoded master password, while scrubbing `/var/log/auth.log` and `utmp`/`wtmp`).',
        howItWorksInPractice:
          'Harvesting outbound `ssh` and `scp` credentials from compromised jump boxes allowed the attackers to pivot laterally across segmented banking infrastructure.',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects `/etc/ld.so.preload (liblinux.so)` to the Hooked `sshd` / PAM Credential Harvester and triggers the BlackBerry / Intezer Static ELF Scanner.',
        detectionAndEvidence:
          'Kernel-level eBPF / `auditd` monitoring of `/proc/[pid]/maps` on `sshd` for unexpected shared objects outside `/lib/security/` and `/usr/lib/x86_64-linux-gnu/`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1014',
        plainTitle: 'libpcap Function Hooking & Kernel BPF Bytecode Scrubbing Against tcpdump',
        storyAnalogy:
          'When a forensic investigator plugs in a stethoscope (`tcpdump`) to listen to network traffic on the server, the parasite secretly rewrites the stethoscope’s filter so it goes deaf whenever the parasite speaks.',
        simpleExplanation:
          'To defeat live network forensics on the infected host, Symbiote hooked `pcap_compile()` in `libpcap` and `setsockopt(..., SO_ATTACH_FILTER, ...)` in `libc`. Whenever an analyst ran `tcpdump` or `tshark`, Symbiote intercepted the compiled `Berkeley Packet Filter (BPF)` bytecode array before it was handed to the kernel and prepended its own BPF instructions (which instructed the Linux kernel to silently drop any packet matching Symbiote’s C2 ports or DNS tunneling domain before copying packets to `tcpdump`).',
        howItWorksInPractice:
          'Symbiote also hooked `fopen("/proc/net/tcp")` and removed lines matching its active connections so `netstat` and `ss` could not see its sockets either.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces `/etc/ld.so.preload` hooking the `tcpdump / libpcap` BPF Scrubber while exfiltrating data to the Symbiote DNS / HTTPS C2 Operator.',
        detectionAndEvidence:
          'Capturing network traffic from an out-of-band switch SPAN port / network tap rather than on the host, and comparing `ss` output against raw kernel socket tables via eBPF.',
      },
    ],
  },
  'genshin-mhyprot2-ransomware-byovd': {
    scenarioId: 'genshin-mhyprot2-ransomware-byovd',
    briefing: {
      headline:
        'Ransomware operators bring a standalone copy of the signed Genshin Impact anti-cheat kernel driver (mhyprot2.sys, CVE-2020-36603), complete a 64-bit Mersenne Twister handshake via IOCTL 0x80034000, and invoke IOCTL 0x81034000 (ZwTerminateProcess) to kill enterprise AV/EDR agents.',
      storyAnalogy:
        'Imagine a video-game referee (`mhyprot2.sys`) who was given a real police badge by the city (`Microsoft WHCP Signature`) so they could stop players from cheating on home PCs. A bank robber realizes that this referee will also obey orders inside a corporate bank vault—even if the video game isn’t installed—and commands the referee (`IOCTL 0x81034000`) to knock out every bank security guard in the building.',
      plainSummary:
        'Investigated by Trend Micro in August 2022 and subsequently tracked by Mandiant and Kaspersky across multiple ransomware campaigns, `mhyprot2.sys` (CVE-2020-36603) is the kernel-mode anti-cheat driver for the popular game Genshin Impact. Because it carries a valid digital signature from miHoYo Co., Ltd., attackers drop the standalone `.sys` file onto enterprise Windows servers alongside a controller binary (`kill_svc.exe`), complete its MT19937-64 XOR handshake via `IOCTL 0x80034000`, and invoke `IOCTL 0x81034000` (`ZwTerminateProcess` in Ring 0) to mass-terminate EDR/AV processes.',
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
          'After compromising a server via RDP or stolen domain credentials, the ransomware operator dropped `C:\\Users\\Public\\mhyprot2.sys` (a 350KB 64-bit Windows kernel driver validly signed by `miHoYo Co., Ltd.` and countersigned by Microsoft in 2020) and registered it as a kernel driver service via `sc.exe create mhyprot2 type= kernel` (loading cleanly into Ring 0 without requiring the Genshin Impact game client to be installed on the machine).',
        howItWorksInPractice:
          'Consumer anti-cheat drivers are engineered with sweeping Ring-0 process and memory inspection capabilities to catch game cheats, making them prime targets for standalone BYOVD weaponization on enterprise servers.',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the `kill_svc.exe` Ransomware Dropper to the Signed Anti-Cheat Driver (`mhyprot2.sys`) as it loads onto the server.',
        detectionAndEvidence:
          'Sysmon EventID 6 (`DriverLoaded`) alerting whenever `mhyprot2.sys` (or any driver signed by `miHoYo Co., Ltd.`) is loaded on an enterprise workstation or server.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1027',
        plainTitle: 'Opening \\\\.\\mhyprot2 & Initializing MT19937-64 Encryption Seed (IOCTL 0x80034000)',
        storyAnalogy:
          'To talk to the anti-cheat referee, the attacker’s tool sends a secret dice-roll seed (`MT19937-64`) that both sides use to scramble their messages.',
        simpleExplanation:
          '`kill_svc.exe` opened a handle to `\\\\.\\mhyprot2` and issued `DeviceIoControl` with `IOCTL 0x80034000` (passing a 24-byte initialization structure that seeds the driver’s internal 64-bit `Mersenne Twister MT19937-64` pseudo-random number generator, which `mhyprot2.sys` uses to XOR-decrypt all subsequent IOCTL request buffers and XOR-encrypt responses).',
        howItWorksInPractice:
          'Because researchers had previously reverse-engineered `mhyprot2.sys`’s `MT19937-64` key derivation and published open-source PoCs on GitHub (`evil-mhyprot-cli`), ransomware developers copied the exact handshake routine directly into `kill_svc.exe`.',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Signed Anti-Cheat Driver (`mhyprot2.sys`) to the `IOCTL 0x80034000` MT64 Handshake node and triggers the Trend Micro / Mandiant EDR Sensor.',
        detectionAndEvidence:
          'Monitoring `CreateFileW` handles to `\\Device\\mhyprot2` and behavioral detection of `0x80034000` / `0x81034000` IOCTL sequences.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1562.001',
        plainTitle: 'Ring-0 ZwTerminateProcess Massacre via IOCTL 0x81034000 & Mass Encryption',
        storyAnalogy:
          'With the scrambled communication channel open, the attacker feeds the ID numbers of every antivirus guard into the anti-cheat driver, which terminates them from the kernel so the ransomware can lock the server.',
        simpleExplanation:
          'Once the `0x80034000` handshake succeeded, `kill_svc.exe` enumerated running endpoint security processes (`Ntrtscan.exe`, `TmCCSF.exe`, `uiWatchDog.exe`, `MsMpEng.exe`), XOR-encrypted each target Process ID with the `MT19937-64` stream, and invoked `IOCTL 0x81034000` (`CVE-2020-36603`, which calls `PsLookupProcessByProcessId` and `ZwTerminateProcess` in Ring 0 to forcefully terminate any process regardless of PPL status), immediately followed by mass ransomware encryption across the Domain Controller’s shares.',
        howItWorksInPractice:
          '`mhyprot2.sys` also exposes `IOCTL 0x81054000` and `0x81064000` for arbitrary kernel/process memory reads (`MmCopyVirtualMemory`), giving attackers both an EDR killer and a kernel memory reader in a single signed binary.',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the MT64 Handshake invoking `IOCTL 0x81034000` Ring-0 AV Wipe & Lock.',
        detectionAndEvidence:
          'Blocking `mhyprot2.sys` via Microsoft Vulnerable Driver Blocklist / WDAC and alerting on sudden simultaneous termination (Sysmon EventID 5) of multiple AV/EDR services.',
      },
    ],
  },
};
