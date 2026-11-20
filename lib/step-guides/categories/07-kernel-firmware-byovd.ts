import type { CategoryStandardPatchMap } from './types';

/**
 * Category 7: KERNEL_FIRMWARE_BYOVD (11 scenarios)
 * Enforces MOD-01, MOD-02, MOD-03, MOD-08, and MOD-11 across all 11 kernel, firmware, and BYOVD scenarios.
 */
export const KERNEL_FIRMWARE_BYOVD_STANDARD_PATCHES: CategoryStandardPatchMap = {
  'blacklotus-uefi-bootkit-cve-2022-21894': {
    briefing: {
      storyAnalogy:
        'Imagine an armored bank vault whose morning startup ritual requires every opening clerk to carry a genuine royal seal. An intruder sneaks into the hidden startup closet and swaps in an older, still-stamped clerk handbook that contains a subtle wording loophole. At dawn, the older clerk trips over that wording loophole during the handoff ceremony, shuts off every vault alarm and glass shield before the main floor opens, and lets an unbadged master saboteur walk straight into the control room.',
      storyMappings: [
        {
          storyTerm: 'Hidden startup closet',
          technicalTerm: 'Hidden FAT32 EFI System Partition (\\Device\\HarddiskVolume1\\EFI\\)',
          tone: 'amber',
        },
        {
          storyTerm: 'Older, still-stamped clerk handbook',
          technicalTerm: 'Downgraded Microsoft-signed bootmgfw.efi, hvloader.efi, and winload.efi (BYOVB)',
          tone: 'sky',
        },
        {
          storyTerm: 'Wording loophole during the handoff ceremony',
          technicalTerm: 'CVE-2022-21894 Baton Drop BCD argument truncation exploit',
          tone: 'rose',
        },
        {
          storyTerm: 'Shutting off vault alarms to admit an unbadged saboteur',
          technicalTerm: 'In-RAM patching of HVCI, BitLocker, and Code Integrity to load an unsigned Ring-0 driver',
          tone: 'emerald',
        },
      ],
      plainSummary:
        'Analyzed by ESET and detailed in a joint NSA and CISA advisory in 2023, BlackLotus is an 80-kilobyte C and Assembly UEFI bootkit (pre-operating-system firmware malware that executes before the Windows kernel starts) capable of bypassing UEFI Secure Boot on fully updated Windows 11 hosts. Using a Bring Your Own Vulnerable Bootloader (BYOVB) chain, it stages older, legitimately signed Microsoft bootloaders onto the hidden EFI System Partition (the dedicated boot partition read by motherboard firmware at power-on) and exploits CVE-2022-21894 (Baton Drop, a Boot Configuration Data argument truncation flaw) to disable HVCI, BitLocker, and Driver Signature Enforcement before loading an unsigned Ring-0 kernel rootkit.',
    },
    steps: {
      1: {
        storyAnalogy:
          'Using stolen manager keys while the bank is running, the intruder unlocks the hidden dawn-startup closet, plants older officially stamped opening manuals inside, and scribbles a custom startup note onto the motherboard permanent chalk ledger so the building reads the planted manuals on the next morning reboot.',
        storyMappings: [
          {
            storyTerm: 'Hidden dawn-startup closet',
            technicalTerm: 'Mounted hidden FAT32 EFI System Partition (ESP)',
            tone: 'amber',
          },
          {
            storyTerm: 'Older officially stamped opening manuals',
            technicalTerm: 'Legitimately signed older copies of bootmgfw.efi, hvloader.efi, and winload.efi',
            tone: 'sky',
          },
          {
            storyTerm: 'Motherboard permanent chalk ledger',
            technicalTerm: 'UEFI NVRAM variables modified via ZwSetSystemEnvironmentValueEx',
            tone: 'rose',
          },
          {
            storyTerm: 'Stolen manager keys',
            technicalTerm: 'Local Administrator privileges used by the BlackLotus installer',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor Sysmon EventID 11 (FileCreate logging every new binary written to disk) targeting \\Device\\HarddiskVolume1\\EFI\\ alongside kernel auditing for unexpected calls to ZwSetSystemEnvironmentValueEx (which modifies persistent UEFI NVRAM boot variables used to redirect the boot sequence).',
      },
      2: {
        storyAnalogy:
          'When the bank powers up at dawn, the older stamped clerk reads a specially folded morning checklist planted by the intruder. A clever fold in the checklist cuts off the safety instructions mid-sentence, letting the intruder take direct command of the opening relay while the front-door seal check still flashes green.',
        storyMappings: [
          {
            storyTerm: 'Older stamped clerk starting at dawn',
            technicalTerm: 'Vulnerable signed bootmgfw.efi and winload.efi executing during early boot',
            tone: 'amber',
          },
          {
            storyTerm: 'Specially folded morning checklist',
            technicalTerm: 'Crafted Boot Configuration Data (BCD) store triggering CVE-2022-21894',
            tone: 'sky',
          },
          {
            storyTerm: 'Cutting off safety instructions mid-sentence',
            technicalTerm: 'Baton Drop BCD argument truncation bypassing Secure Boot verification',
            tone: 'rose',
          },
          {
            storyTerm: 'Front-door seal check flashing green',
            technicalTerm: 'UEFI Secure Boot signature check satisfied by the unrevoked Microsoft binary',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Inspect TPM 2.0 Measured Boot attestation logs (Windows Boot Configuration Logs, WBCL, which cryptographically record every bootloader hash executed at power-on) for downgraded winload.efi hashes in PCR[4] or unexpected Secure Boot policy alterations in PCR[7].',
      },
      3: {
        storyAnalogy:
          'Holding control of the early-morning opening relay, the intruder erases the glass integrity shields and disk locks straight from the building active workspace before the main operating floor wakes up, then marches an unbadged kernel saboteur straight into the vault engine room.',
        storyMappings: [
          {
            storyTerm: 'Erasing glass integrity shields in active workspace',
            technicalTerm: 'In-RAM patching of hvloader.efi and winload.efi (OslFwpKernelSetupPhase1)',
            tone: 'amber',
          },
          {
            storyTerm: 'Disabled vault locks and shields',
            technicalTerm: 'Neutralized HVCI, VBS, BitLocker protections, and Code Integrity',
            tone: 'sky',
          },
          {
            storyTerm: 'Unbadged kernel saboteur',
            technicalTerm: 'Unsigned Ring-0 kernel rootkit driver loaded without driver signing enforcement',
            tone: 'rose',
          },
          {
            storyTerm: 'Main operating floor waking up',
            technicalTerm: 'Windows kernel startup with compromised winlogon.exe network beacons',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Audit Windows CodeIntegrity and System Event Logs for unexpected HVCI or VBS disablement across reboots (indicating pre-OS security tampering) paired with EDR network telemetry flagging outbound connections initiated by winlogon.exe (the Windows logon process that should never beacon externally).',
      },
    },
  },

  'aukill-edr-killer-procxp152-byovd': {
    briefing: {
      storyAnalogy:
        'Imagine a secure office building whose maintenance wing still honors an outdated, genuinely stamped inspector pass card. An intruder drops that retired inspector card onto the desk, opens the inspector service hatch using two special code knocks (one knock to hand over a master guard badge and a second knock to yank out a security guard radio wire), and loops through every hallway knocking out every building alarm before unlocking the safe for ransomware.',
      storyMappings: [
        {
          storyTerm: 'Outdated, genuinely stamped inspector pass card',
          technicalTerm: 'Signed vulnerable Sysinternals PROCEXP152.SYS v16.32 kernel driver (BYOVD)',
          tone: 'amber',
        },
        {
          storyTerm: 'Inspector service hatch',
          technicalTerm: 'Kernel device symbolic link \\\\.\\PROCEXP152 exposed to user-mode callers',
          tone: 'sky',
        },
        {
          storyTerm: 'Two special code knocks (master badge knock and wire-yank knock)',
          technicalTerm: 'IOCTL 0x8335003C (open privileged handle) and IOCTL 0x83350004 (close handle)',
          tone: 'rose',
        },
        {
          storyTerm: 'Knocking out every building alarm before unlocking the safe',
          technicalTerm: 'Ring-0 termination of PPL-protected EDR sensors prior to ransomware execution',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Carrying stolen manager keys, the intruder unpacks a retired but legitimately stamped maintenance-inspector pass card from a briefcase, slides it onto the official building driver rack, and activates it even though no real maintenance engineer is present in the room.',
        storyMappings: [
          {
            storyTerm: 'Retired legitimately stamped pass card',
            technicalTerm: 'Embedded Microsoft-signed Sysinternals PROCEXP152.SYS v16.32',
            tone: 'amber',
          },
          {
            storyTerm: 'Official building driver rack',
            technicalTerm: 'C:\\Windows\\System32\\drivers\\PROCEXP152.SYS registered as a kernel service',
            tone: 'sky',
          },
          {
            storyTerm: 'Briefcase carrying the embedded card',
            technicalTerm: 'AuKill C++ user-mode BYOVD loader running with Administrator rights',
            tone: 'rose',
          },
          {
            storyTerm: 'No real maintenance engineer present',
            technicalTerm: 'Driver loaded by an untrusted binary rather than signed procexp64.exe',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 6 (DriverLoaded, recording kernel drivers loaded alongside their signature and hash) for PROCEXP152.SYS version 16.32 whenever the creating or loading process is not a legitimately signed procexp.exe or procexp64.exe binary (exposing BYOVD weaponization).',
      },
      2: {
        storyAnalogy:
          'The intruder steps up to the newly opened inspector service hatch with a team of helpers and taps two distinct control knocks: the first knock forces the kernel hatch to hand back an all-powerful master handle to protected security guards, and the second knock tells the hatch to snip any open lock handles held by those guards.',
        storyMappings: [
          {
            storyTerm: 'Inspector service hatch',
            technicalTerm: 'Device handle opened to \\\\.\\PROCEXP152 via CreateFile',
            tone: 'amber',
          },
          {
            storyTerm: 'First control knock granting a master handle',
            technicalTerm: 'DeviceIoControl IOCTL 0x8335003C opening full-access Ring-0 process handles',
            tone: 'sky',
          },
          {
            storyTerm: 'Second control knock snipping open lock handles',
            technicalTerm: 'DeviceIoControl IOCTL 0x83350004 forcibly closing target process handles',
            tone: 'rose',
          },
          {
            storyTerm: 'Team of helpers enumerating guards',
            technicalTerm: 'Multi-threaded AuKill worker routines scanning running endpoint security PIDs',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor ETW Microsoft-Windows-Kernel-File and IOCTL telemetry (kernel tracing that records user-mode binaries opening protected device links) for non-Sysinternals processes opening \\Device\\PROCEXP152 and issuing IOCTL 0x8335003C or 0x83350004 (capturing the live privilege abuse handshake).',
      },
      3: {
        storyAnalogy:
          'Armed with both the master handle knock and the wire-snipping knock, the intruder runs endlessly from floor to floor shutting down every armored security monitor even when the monitors try to restart themselves, leaving the whole building blind for the ransomware crew.',
        storyMappings: [
          {
            storyTerm: 'Armored security monitors',
            technicalTerm: 'Protected Process Light (PPL) EDR services such as MsMpEng.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Master handle knock and wire-snipping knock',
            technicalTerm: 'Paired IOCTL 0x8335003C termination and IOCTL 0x83350004 handle closure loop',
            tone: 'sky',
          },
          {
            storyTerm: 'Running endlessly even as monitors restart',
            technicalTerm: 'Continuous AuKill watchdog loop terminating respawning EDR services',
            tone: 'rose',
          },
          {
            storyTerm: 'Blinded building ready for the ransomware crew',
            technicalTerm: 'Unmonitored endpoint enabling Medusa Locker or LockBit mass encryption',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'crowdstrike-poortry-burntcigar-byovd': {
    briefing: {
      storyAnalogy:
        'Imagine a heist crew that skips stealing an old inspector badge and instead hijacks the government badge-printing office to stamp their own custom saboteur card. Once inside the building control room, the saboteur requires a secret spoken handshake before cutting every alarm wire on the central watchboard and erasing the armored insignia from both the security guards and the vault master ledger.',
      storyMappings: [
        {
          storyTerm: 'Custom saboteur card stamped by a hijacked badge office',
          technicalTerm: 'POORTRY / BURNTCIGAR custom kernel rootkit signed via abused WHQL account',
          tone: 'amber',
        },
        {
          storyTerm: 'Secret spoken handshake at the control room door',
          technicalTerm: 'Cryptographic challenge-response DeviceIoControl handshake from STONESTOP',
          tone: 'sky',
        },
        {
          storyTerm: 'Cutting every alarm wire on the central watchboard',
          technicalTerm: 'Zeroing PspCreateProcessNotifyRoutine and ObRegisterCallbacks arrays',
          tone: 'rose',
        },
        {
          storyTerm: 'Erasing armored insignia from guards and the vault ledger',
          technicalTerm: 'DKOM stripping of _PS_PROTECTION bits on EDR processes and lsass.exe',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'The intruder street runner walks up to the building core checkpoint holding a purpose-built saboteur pass that carries an authentic official government wax seal obtained through a hijacked signing office, so the checkpoint doors swing wide open without raising an alarm.',
        storyMappings: [
          {
            storyTerm: 'Intruder street runner',
            technicalTerm: 'STONESTOP user-mode loader invoking NtLoadDriver',
            tone: 'amber',
          },
          {
            storyTerm: 'Purpose-built saboteur pass',
            technicalTerm: 'Malicious kernel driver poortry.sys (BURNTCIGAR)',
            tone: 'sky',
          },
          {
            storyTerm: 'Authentic government wax seal from a hijacked office',
            technicalTerm: 'Fraudulently obtained Microsoft WHQL / Windows Hardware Dev Center attestation signature',
            tone: 'rose',
          },
          {
            storyTerm: 'Building core checkpoint',
            technicalTerm: 'Windows Driver Signature Enforcement (DSE) kernel load check',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Inside the core control room, the saboteur refuses orders from anyone until the street runner completes a secret coded knock-and-reply exchange. Once verified, the saboteur snips every central notification bell wire so the security office stops receiving alerts whenever new workers enter or inspect the building.',
        storyMappings: [
          {
            storyTerm: 'Secret coded knock-and-reply exchange',
            technicalTerm: 'Cryptographic challenge-response authentication over DeviceIoControl',
            tone: 'amber',
          },
          {
            storyTerm: 'Central notification bell wires',
            technicalTerm: 'Kernel callback arrays PspCreateProcessNotifyRoutine and ObRegisterCallbacks',
            tone: 'sky',
          },
          {
            storyTerm: 'Snipping the bell wires',
            technicalTerm: 'POORTRY overwriting EDR kernel callback pointers in Ring-0 memory',
            tone: 'rose',
          },
          {
            storyTerm: 'Blinded security office',
            technicalTerm: 'EDR sensors stripped of process creation and handle-access visibility',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Deploy EDR kernel callback integrity watchdogs (periodic kernel-level self-checks that verify sensor function pointers remain intact inside PspCreateProcessNotifyRoutine and ObRegisterCallbacks) and alert immediately when any callback entry is zeroed or replaced.',
      },
      3: {
        storyAnalogy:
          'Walking directly into the central staff ledger, the saboteur rubs out the armored-protection stamp next to every security guard and the master credential vault, stripping away their immunity so the street runner can dismiss every guard and empty the vault unopposed.',
        storyMappings: [
          {
            storyTerm: 'Central staff ledger',
            technicalTerm: 'Kernel opaque _EPROCESS structures tracking active Windows processes',
            tone: 'amber',
          },
          {
            storyTerm: 'Rubbing out the armored-protection stamp',
            technicalTerm: 'Direct Kernel Object Manipulation (DKOM) zeroing _PS_PROTECTION bits',
            tone: 'sky',
          },
          {
            storyTerm: 'Dismissed security guards',
            technicalTerm: 'Terminated EDR agent processes after PPL immunity removal',
            tone: 'rose',
          },
          {
            storyTerm: 'Emptied master credential vault',
            technicalTerm: 'Unprotected lsass.exe memory dumped for enterprise credentials',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'linux-bpfdoor-ebpf-socket-filter-apt': {
    briefing: {
      storyAnalogy:
        'Imagine a silent spy who moves into a temporary hallway locker inside a busy central post office, burns the paper lease behind them, and clips on a maintenance janitor badge. Instead of renting an office doorway that shows up on the building floor plan, the spy snaps a tiny acoustic sieve straight onto the main mail chute and sleeps invisibly for years until a single envelope carrying a secret wax seal drops past the chute, waking the spy to open a private back staircase.',
      storyMappings: [
        {
          storyTerm: 'Temporary hallway locker with a burned paper lease',
          technicalTerm: 'Unlinked ELF binary executing from RAM-backed /dev/shm/kdmtmpflush',
          tone: 'amber',
        },
        {
          storyTerm: 'Maintenance janitor badge',
          technicalTerm: 'Masqueraded argv[0] process name disguising the active implant',
          tone: 'sky',
        },
        {
          storyTerm: 'Tiny acoustic sieve on the main mail chute with no doorway',
          technicalTerm: 'Raw AF_PACKET socket with SO_ATTACH_FILTER classic BPF bytecode and zero open ports',
          tone: 'rose',
        },
        {
          storyTerm: 'Envelope carrying a secret wax seal opening a back staircase',
          technicalTerm: 'Magic packet (0x7255 / 0x5293) triggering iptables redirect and memory-only PTY shell',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Upon entering the post office with master keys, the spy steps into a temporary memory-only hallway locker, backdates the locker stamp by more than a decade, shreds the locker key tag so nothing appears on the shelf, and pins on a routine building-service nametag.',
        storyMappings: [
          {
            storyTerm: 'Memory-only hallway locker',
            technicalTerm: 'RAM-backed tmpfs staging file /dev/shm/kdmtmpflush',
            tone: 'amber',
          },
          {
            storyTerm: 'Backdating the locker stamp by a decade',
            technicalTerm: 'Timestomping file modification time to 2008-10-30',
            tone: 'sky',
          },
          {
            storyTerm: 'Shredding the locker key tag',
            technicalTerm: 'Self-unlinking binary leaving a /proc/<pid>/exe (deleted) trace',
            tone: 'rose',
          },
          {
            storyTerm: 'Routine building-service nametag',
            technicalTerm: 'Masqueraded process name hiding BPFDoor in ps output',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Scan /proc/[0-9]*/exe symbolic links across Linux hosts for targets pointing to /dev/shm/* (deleted) (which exposes memory-backed binaries that erased themselves from disk) and compare /proc/[pid]/comm against the actual resolved binary path in /proc/[pid]/exe.',
      },
      2: {
        storyAnalogy:
          'Refusing to open a visible service window that guards check every hour, the spy clips a tiny 30-step mechanical sieve directly onto the main incoming mail chute. Every letter streaming into the building passes silently over that sieve, which ignores ordinary mail and waits only for the spy secret emblem.',
        storyMappings: [
          {
            storyTerm: 'Visible service window checked by guards',
            technicalTerm: 'Standard listening TCP/UDP socket visible to netstat or ss',
            tone: 'amber',
          },
          {
            storyTerm: 'Main incoming mail chute',
            technicalTerm: 'Raw packet socket created via socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP))',
            tone: 'sky',
          },
          {
            storyTerm: '30-step mechanical sieve',
            technicalTerm: 'Classic BPF bytecode filter attached via setsockopt(SO_ATTACH_FILTER)',
            tone: 'rose',
          },
          {
            storyTerm: 'Secret emblem watched by the sieve',
            technicalTerm: 'Hardcoded magic packet signatures (0x7255 or 0x5293) across TCP, UDP, or ICMP',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'The instant a passing letter carries the secret wax stamp and matching passphrase, the spy wakes up, briefly swings a hidden wall panel to steer the caller around the lobby metal detector, and opens a private, trace-free speaking tube straight into the post office basement.',
        storyMappings: [
          {
            storyTerm: 'Passing letter with secret wax stamp and passphrase',
            technicalTerm: 'Magic TCP, UDP, or ICMP packet bearing 0x7255 / 0x5293 and valid password hash',
            tone: 'amber',
          },
          {
            storyTerm: 'Swinging a wall panel around the metal detector',
            technicalTerm: 'Dynamic iptables NAT/PREROUTING rule redirecting traffic past host firewalls',
            tone: 'sky',
          },
          {
            storyTerm: 'Private trace-free speaking tube',
            technicalTerm: 'Forked child process allocating a /dev/ptmx pseudo-terminal without utmp logging',
            tone: 'rose',
          },
          {
            storyTerm: 'Post office basement access',
            technicalTerm: 'Interactive root shell session lasting only while the magic session stays active',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'kaspersky-cosmicstrand-uefi-spi-rootkit': {
    briefing: {
      storyAnalogy:
        'Imagine a saboteur who does not break into a bank lobby at all, but instead carves a hidden mechanical detour directly into the stone foundation chip poured beneath the building. Even if the owners demolish every floor and replace every safe inside, the stone foundation still triggers a three-person baton relay every morning at sunrise, switching off the building alarm clock before the bank governor even takes a single step.',
      storyMappings: [
        {
          storyTerm: 'Stone foundation chip beneath the building',
          technicalTerm: 'Motherboard 8MB SPI NOR flash chip storing UEFI firmware',
          tone: 'amber',
        },
        {
          storyTerm: 'Carved mechanical detour inside the foundation',
          technicalTerm: 'Patched CSMCORE DXE UEFI driver hooking HandleProtocol',
          tone: 'sky',
        },
        {
          storyTerm: 'Three-person morning baton relay',
          technicalTerm: 'Boot hook chain across bootmgfw.efi, winload.efi, and OslArchTransferToKernel',
          tone: 'rose',
        },
        {
          storyTerm: 'Switching off the building alarm clock before the governor wakes',
          technicalTerm: 'Neutralizing PatchGuard (KiFilterFiberContext) and hooking ZwCreateSection in ntoskrnl.exe',
          tone: 'emerald',
        },
      ],
      plainSummary:
        'Detailed by Kaspersky GReAT in July 2022, CosmicStrand is an advanced China-nexus UEFI firmware rootkit (persistent pre-boot malware embedded directly inside motherboard flash memory rather than the hard drive) targeting ASUS and Gigabyte H81 motherboards. Because it resides inside the physical SPI NOR flash chip (the motherboard soldered chip that initializes hardware before any disk is read), it survives complete operating system reinstallations and hard drive replacements, executing a multi-hop boot hook chain from the CSMCORE DXE driver into ntoskrnl.exe to neutralize PatchGuard and establish kernel-level command and control.',
    },
    steps: {
      1: {
        storyAnalogy:
          'Deep beneath the building floor, the saboteur chisels a secret trigger straight into the permanent stone foundation block that wakes up first every morning. Because that block lives outside the replaceable floors and storage rooms, tearing out every hard drive in the building never removes the trap.',
        storyMappings: [
          {
            storyTerm: 'Permanent stone foundation block',
            technicalTerm: 'Physical 8MB SPI NOR flash chip on ASUS or Gigabyte H81 motherboards',
            tone: 'amber',
          },
          {
            storyTerm: 'Chiseled secret trigger inside the block',
            technicalTerm: 'Modified CSMCORE DXE driver (GUID {A062CF1F-8473-4AA3-87AF-993111011898})',
            tone: 'sky',
          },
          {
            storyTerm: 'Morning wake-up handshake intercepted',
            technicalTerm: 'Inline hook placed on UEFI Boot Services HandleProtocol',
            tone: 'rose',
          },
          {
            storyTerm: 'Surviving full floor replacement',
            technicalTerm: 'Persistence across complete Windows reinstalls and disk swaps',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Dump the motherboard SPI flash ROM using CHIPSEC or dedicated UEFI firmware scanners (hardware-level inspection tools that read flash memory directly) and flag unexpected modifications to the CSMCORE DXE module entry point or .reloc section.',
      },
      2: {
        storyAnalogy:
          'As dawn breaks, the foundation trap passes a hidden baton up a three-stage hallway relay: first catching the front-gate opener as it unlocks the lobby, then tagging the floor-captain loader as it prepares the main hall, making sure the trap rides all the way up to the governor desk.',
        storyMappings: [
          {
            storyTerm: 'Front-gate opener caught at the lobby',
            technicalTerm: 'bootmgfw.efi hooked at Archpx64TransferTo64BitApplicationAsm',
            tone: 'amber',
          },
          {
            storyTerm: 'Floor-captain loader preparing the main hall',
            technicalTerm: 'winload.efi hooked during OS loader preparation',
            tone: 'sky',
          },
          {
            storyTerm: 'Passing the hidden baton upward',
            technicalTerm: 'Multi-hop pre-OS inline hooking chain bridging firmware to OS loader',
            tone: 'rose',
          },
          {
            storyTerm: 'Governor desk handoff point',
            technicalTerm: 'OslArchTransferToKernel transition right before ntoskrnl.exe starts',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Perform pre-OS boot integrity verification and live kernel memory scanning comparing the in-RAM .text code sections of ntoskrnl.exe against the clean on-disk PE binary (exposing unauthorized pre-boot inline hooks injected before the kernel started).',
      },
      3: {
        storyAnalogy:
          'One heartbeat before the bank governor opens his eyes, the baton carrier unhooks the master watchdog bell so nobody notices tampered blueprints, plants a secret listener on the room-opening ledger, and opens a hidden courier line straight from the governor private study.',
        storyMappings: [
          {
            storyTerm: 'Unhooking the master watchdog bell',
            technicalTerm: 'Patching KiFilterFiberContext in ntoskrnl.exe RAM to bypass PatchGuard',
            tone: 'amber',
          },
          {
            storyTerm: 'Secret listener on the room-opening ledger',
            technicalTerm: 'Kernel hook placed on ZwCreateSection inside ntoskrnl.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Governor private study',
            technicalTerm: 'Ring-0 Windows kernel execution context prior to user-mode boot',
            tone: 'rose',
          },
          {
            storyTerm: 'Hidden courier line',
            technicalTerm: 'Kernel-level shellcode deployment and remote C2 payload retrieval',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'sentinelone-terminator-zemana-byovd': {
    briefing: {
      storyAnalogy:
        'Imagine a burglar carrying a genuinely stamped security-vendor master badge bought from an underground broker. After dropping that legitimate badge into the building engine room, the burglar walks up to an unguarded badge-enrollment desk that forgets to check identity, writes their own badge number onto the VIP master roster, and then walks in an endless loop shutting off every security camera and guard station across the building.',
      storyMappings: [
        {
          storyTerm: 'Genuinely stamped security-vendor master badge',
          technicalTerm: 'Signed vulnerable Zemana AntiMalware kernel driver (zam64.sys)',
          tone: 'amber',
        },
        {
          storyTerm: 'Unguarded badge-enrollment desk',
          technicalTerm: 'Unauthenticated IOCTL 0x80002010 self-allowlisting flaw (CVE-2021-31728)',
          tone: 'sky',
        },
        {
          storyTerm: 'VIP master roster',
          technicalTerm: 'Internal zam64.sys trusted Process ID allowlist in kernel memory',
          tone: 'rose',
        },
        {
          storyTerm: 'Endless loop shutting off every guard station',
          technicalTerm: 'Continuous while(true) IOCTL 0x80002048 Ring-0 termination of 24 EDR agents',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Holding administrator keys, the burglar unpacks a genuinely signed third-party security driver, stamps a random cover name onto its tag so simple filename checklists overlook it, and plugs it straight into the building core engine room.',
        storyMappings: [
          {
            storyTerm: 'Genuinely signed third-party security driver',
            technicalTerm: 'Embedded zam64.sys validly signed by Zemana Ltd. and countersigned by Microsoft',
            tone: 'amber',
          },
          {
            storyTerm: 'Random cover name on the tag',
            technicalTerm: 'Randomized driver filename written under C:\\Windows\\System32\\drivers\\',
            tone: 'sky',
          },
          {
            storyTerm: 'Burglar carrying administrator keys',
            technicalTerm: 'Terminator.exe user-mode wrapper executing with local admin rights',
            tone: 'rose',
          },
          {
            storyTerm: 'Building core engine room',
            technicalTerm: 'Windows Ring-0 kernel driver space accepting the signed driver',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Even though the driver only obeys badge numbers written on its VIP security roster, its enrollment window never checks who is asking to be added. The burglar simply taps the enrollment code and writes their own badge number straight onto the VIP list.',
        storyMappings: [
          {
            storyTerm: 'VIP security roster',
            technicalTerm: 'Internal zam64.sys allowlist of authorized caller Process IDs',
            tone: 'amber',
          },
          {
            storyTerm: 'Enrollment window that never checks identity',
            technicalTerm: 'Unauthenticated IOCTL 0x80002010 exposed by \\\\.\\ZemanaAntiMalware (CVE-2021-31728)',
            tone: 'sky',
          },
          {
            storyTerm: 'Writing their own badge number onto the list',
            technicalTerm: 'Terminator.exe registering its own PID as a trusted kernel caller',
            tone: 'rose',
          },
          {
            storyTerm: 'Privileged master controls unlocked',
            technicalTerm: 'Arbitrary Ring-0 process termination and raw disk access granted to the caller',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enable kernel ETW and EDR behavioral monitoring (low-level Windows kernel event tracing that watches device handle communications) alerting on any binary opening \\\\.\\ZemanaAntiMalware and sending IOCTL 0x80002010 (catching the exact CVE-2021-31728 self-allowlist abuse).',
      },
      3: {
        storyAnalogy:
          'Now accepted as a VIP security supervisor, the burglar paces the hallways in a relentless circle, comparing every guard uniform against a pocket hit-list of 24 known security agencies and flipping the master kill switch on every matching guard before they can sound the alarm.',
        storyMappings: [
          {
            storyTerm: 'Pacing the hallways in a relentless circle',
            technicalTerm: 'Infinite while(true) loop calling CreateToolhelp32Snapshot to scan active PIDs',
            tone: 'amber',
          },
          {
            storyTerm: 'Pocket hit-list of 24 security agencies',
            technicalTerm: 'Hardcoded array of 24 AV and EDR executable names targeted by Terminator.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Master kill switch',
            technicalTerm: 'IOCTL 0x80002048 invoking kernel-level process termination via zam64.sys',
            tone: 'rose',
          },
          {
            storyTerm: 'Silenced guard stations',
            technicalTerm: 'Terminated endpoint protection agents leaving the host defenseless',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enforce pre-execution blocking of zam64.sys via the Microsoft Vulnerable Driver Blocklist and HVCI driver-load policies (which reject known vulnerable driver hashes inside the kernel loader before any IOCTL device link can be created).',
      },
    },
  },

  'intezer-blackberry-symbiote-linux-ldpreload': {
    briefing: {
      storyAnalogy:
        'Imagine a parasitic mist that refuses to walk down a bank hallway as a visible stranger and instead weaves itself into the master uniform coatroom. Every clerk, courier, and auditor who puts on an official jacket automatically wears the parasite too: inside couriers it silently copies every vault passphrase spoken at the counter, and inside safety auditors it clouds their magnifying lenses so the spy own hidden tunnels vanish from every inspection log.',
      storyMappings: [
        {
          storyTerm: 'Master uniform coatroom',
          technicalTerm: 'Global dynamic linker preload file /etc/ld.so.preload',
          tone: 'amber',
        },
        {
          storyTerm: 'Parasitic mist woven into every official jacket',
          technicalTerm: 'Shared object library (/usr/lib/liblinux.so) injected into every running process',
          tone: 'sky',
        },
        {
          storyTerm: 'Copying vault passphrases whispered by couriers',
          technicalTerm: 'PAM backdoor and libc read() hooking inside ssh and scp harvesting keystrokes',
          tone: 'rose',
        },
        {
          storyTerm: 'Clouding safety auditor magnifying lenses',
          technicalTerm: 'Hooking pcap_compile() and setsockopt(SO_ATTACH_FILTER) to blind tcpdump',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Rather than hiring a separate intruder who would show up on the employee attendance sheet, the spy hangs a rigged lining inside the building universal uniform rack. From that second forward, every single worker who clocks in slips the hidden parasite onto their own sleeves automatically.',
        storyMappings: [
          {
            storyTerm: 'Universal uniform rack',
            technicalTerm: 'System-wide /etc/ld.so.preload dynamic linker configuration',
            tone: 'amber',
          },
          {
            storyTerm: 'Rigged lining hung on the rack',
            technicalTerm: 'Malicious ELF shared library (/usr/lib/liblinux.so)',
            tone: 'sky',
          },
          {
            storyTerm: 'No separate name on the attendance sheet',
            technicalTerm: 'No standalone malware process visible in ps or top listings',
            tone: 'rose',
          },
          {
            storyTerm: 'Every worker clocking in automatically wearing it',
            technicalTerm: 'Dynamic linker mapping Symbiote first into every newly launched Linux binary',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Riding inside the sleeves of every courier and gate clerk, the parasite silently transcribes every vault combination typed at the dispatch desk into a locked notebook, while secretly installing a master override phrase that lets the spy walk through the front gate under any clerk name.',
        storyMappings: [
          {
            storyTerm: 'Couriers typing vault combinations',
            technicalTerm: 'Administrator ssh and scp client sessions with hooked libc read()',
            tone: 'amber',
          },
          {
            storyTerm: 'Locked notebook storing copied combinations',
            technicalTerm: 'RC4-encrypted credential stash file hidden on disk (/var/tmp/...)',
            tone: 'sky',
          },
          {
            storyTerm: 'Master override phrase at the front gate',
            technicalTerm: 'PAM authentication backdoor permitting root login with a hardcoded password',
            tone: 'rose',
          },
          {
            storyTerm: 'Riding inside clerk sleeves',
            technicalTerm: 'In-process userland symbol interposition inside sshd and ssh clients',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Use kernel-level eBPF or auditd telemetry to inspect /proc/[pid]/maps on sshd (listing every shared library mapped into the SSH daemon straight from kernel memory) and alert on unexpected shared objects loaded outside /lib/security/ and /usr/lib/x86_64-linux-gnu/.',
      },
      3: {
        storyAnalogy:
          'Whenever building inspectors raise a magnifying glass to watch outgoing mail trucks for smuggling, the parasite riding inside the inspector own glasses silently swaps in tinted lenses that blot out the spy truck license plates before the report even reaches the page.',
        storyMappings: [
          {
            storyTerm: 'Inspectors watching outgoing mail trucks',
            technicalTerm: 'DFIR analysts running tcpdump or packet sniffers directly on the infected host',
            tone: 'amber',
          },
          {
            storyTerm: 'Swapping in tinted lenses inside the inspector glasses',
            technicalTerm: 'Hooking libpcap pcap_compile() and libc setsockopt(SO_ATTACH_FILTER)',
            tone: 'sky',
          },
          {
            storyTerm: 'Blotting out the spy truck license plates',
            technicalTerm: 'Injecting BPF bytecode exclusions that scrub C2 IP addresses and ports from captures',
            tone: 'rose',
          },
          {
            storyTerm: 'Off-site rooftop camera catching the truth',
            technicalTerm: 'Out-of-band switch SPAN port or hardware network tap immune to host hooks',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Capture network traffic from an out-of-band switch SPAN port or hardware network tap (which observes raw wire frames outside the compromised OS so host userland hooks cannot scrub them) and compare ss output against raw kernel socket tables via eBPF.',
      },
    },
  },

  'genshin-mhyprot2-ransomware-byovd': {
    briefing: {
      storyAnalogy:
        'Imagine a ransomware crew walking into an enterprise bank headquarters wearing an officially stamped security guard badge lifted straight from a popular video-game arcade. Because the bank front gate still trusts that arcade seal, the badge unlocks a direct hallway to the building master control switch; after speaking a scrambled sequence to initialize the switch, the crew shuts down every real bank guard and locks every vault.',
      storyMappings: [
        {
          storyTerm: 'Officially stamped guard badge from a video-game arcade',
          technicalTerm: 'Signed Genshin Impact anti-cheat kernel driver mhyprot2.sys (CVE-2020-36603)',
          tone: 'amber',
        },
        {
          storyTerm: 'Bank headquarters accepting the arcade badge',
          technicalTerm: 'Windows Domain Controller loading standalone C:\\Users\\Public\\mhyprot2.sys',
          tone: 'sky',
        },
        {
          storyTerm: 'Speaking a scrambled sequence at the control window',
          technicalTerm: 'IOCTL 0x80034000 seeding the driver 64-bit Mersenne Twister (MT19937-64) cipher',
          tone: 'rose',
        },
        {
          storyTerm: 'Shutting down every real bank guard before locking the vaults',
          technicalTerm: 'XOR-encoded IOCTL 0x81034000 Ring-0 ZwTerminateProcess loop killing AV/EDR agents',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'After sneaking into the bank central headquarters with stolen supervisor keys, the intruder drops an authentic, validly stamped arcade anti-cheat guard badge onto a public hallway table and registers it with the building core, even though no game machine exists anywhere in the bank.',
        storyMappings: [
          {
            storyTerm: 'Authentic arcade anti-cheat guard badge',
            technicalTerm: 'Standalone 350KB Microsoft-signed mhyprot2.sys kernel driver',
            tone: 'amber',
          },
          {
            storyTerm: 'Public hallway table',
            technicalTerm: 'Staging path C:\\Users\\Public\\mhyprot2.sys on an enterprise server',
            tone: 'sky',
          },
          {
            storyTerm: 'Bank central headquarters',
            technicalTerm: 'Compromised Windows Domain Controller or enterprise server',
            tone: 'rose',
          },
          {
            storyTerm: 'Registering it with the building core',
            technicalTerm: 'Loading mhyprot2.sys as a Ring-0 service without any Genshin Impact game installed',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'The intruder steps up to the arcade driver back window and feeds it a 24-byte starting cipher dial so both sides agree on a shared scrambling pattern, unlocking the driver hidden command panel without needing the real arcade machine.',
        storyMappings: [
          {
            storyTerm: 'Arcade driver back window',
            technicalTerm: 'Device handle opened to \\\\.\\mhyprot2 by kill_svc.exe',
            tone: 'amber',
          },
          {
            storyTerm: '24-byte starting cipher dial',
            technicalTerm: 'Initialization structure sent via DeviceIoControl IOCTL 0x80034000',
            tone: 'sky',
          },
          {
            storyTerm: 'Shared scrambling pattern',
            technicalTerm: 'Internal 64-bit Mersenne Twister (MT19937-64) encryption key stream',
            tone: 'rose',
          },
          {
            storyTerm: 'Hidden command panel unlocked',
            technicalTerm: 'Authenticated kernel command channel ready for process-termination requests',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor CreateFileW handle requests targeting \\Device\\mhyprot2 alongside behavioral EDR rules flagging the 0x80034000 followed by 0x81034000 IOCTL sequence (pinpointing active CVE-2020-36603 driver weaponization before security agents are killed).',
      },
      3: {
        storyAnalogy:
          'Sending scrambled guard badge numbers through the unlocked window one after another, the intruder commands the building core itself to evict every active security officer on the floor, clearing the way to slam padlocks across every file cabinet in the bank.',
        storyMappings: [
          {
            storyTerm: 'Scrambled guard badge numbers',
            technicalTerm: 'XOR-encrypted target security PIDs submitted via IOCTL 0x81034000',
            tone: 'amber',
          },
          {
            storyTerm: 'Building core evicting every security officer',
            technicalTerm: 'Ring-0 ZwTerminateProcess killing Ntrtscan.exe, TmCCSF.exe, uiWatchDog.exe, and MsMpEng.exe',
            tone: 'sky',
          },
          {
            storyTerm: 'Slamming padlocks across every file cabinet',
            technicalTerm: 'Uncontested ransomware mass encryption across the blinded enterprise host',
            tone: 'rose',
          },
          {
            storyTerm: 'Intruder dispatcher sending the hit list',
            technicalTerm: 'kill_svc.exe enumerating and feeding endpoint protection PIDs to mhyprot2.sys',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics': {
    briefing: {
      storyAnalogy:
        'Imagine a phantom eavesdropper inside a railway telegraph depot who moves into a temporary memory-only closet, shreds the paper entry receipt, puts on a station-cleaner badge, and clips an invisible wire sieve directly onto the main incoming telegraph cable so no open door appears on the depot map. During an emergency audit, a forensic inspector bypasses the front floor map completely, reads the raw cable-tap ledger, and uncovers both the invisible sieve and the brass locking pin keeping it alone.',
      storyMappings: [
        {
          storyTerm: 'Temporary memory-only closet with a shredded receipt',
          technicalTerm: 'Self-unlinked /dev/shm/kdmtmpflush binary visible as /proc/<pid>/exe (deleted)',
          tone: 'amber',
        },
        {
          storyTerm: 'Invisible wire sieve clipped onto the main telegraph cable',
          technicalTerm: 'AF_PACKET raw socket with SO_ATTACH_FILTER classic BPF bytecode',
          tone: 'sky',
        },
        {
          storyTerm: 'Front floor map showing no open door',
          technicalTerm: 'netstat -tulnp showing zero listening TCP or UDP ports',
          tone: 'rose',
        },
        {
          storyTerm: 'Raw cable-tap ledger and brass locking pin',
          technicalTerm: '/proc/net/packet, ss -0pb BPF dump, and /var/run/haldrund.pid mutex',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At launch, the eavesdropper dashes into a memory-only storage closet, tears up the closet doorway sign so disk inventories find nothing, and alters its own staff nametag to resemble a harmless background maintenance utility.',
        storyMappings: [
          {
            storyTerm: 'Memory-only storage closet',
            technicalTerm: 'tmpfs shared memory execution path /dev/shm/kdmtmpflush',
            tone: 'amber',
          },
          {
            storyTerm: 'Tearing up the closet doorway sign',
            technicalTerm: 'Unlinking on-disk executable leaving /proc/<pid>/exe (deleted) forensic trace',
            tone: 'sky',
          },
          {
            storyTerm: 'Altering its own staff nametag',
            technicalTerm: 'Overwriting argv[0] and calling prctl(PR_SET_NAME) to masquerade as a daemon',
            tone: 'rose',
          },
          {
            storyTerm: 'Launching into background duty',
            technicalTerm: 'Self-re-execution with --init flag detaching from the parent terminal',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Instead of opening a numbered ticket window that every night watchman checks, the eavesdropper clamps a raw acoustic sieve straight onto the main telegraph line so every passing signal is inspected silently until a secret trigger code arrives.',
        storyMappings: [
          {
            storyTerm: 'Numbered ticket window checked by watchmen',
            technicalTerm: 'Standard listening TCP/UDP socket listed by netstat -tulnp',
            tone: 'amber',
          },
          {
            storyTerm: 'Main telegraph line clamp',
            technicalTerm: 'socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP)) raw packet socket',
            tone: 'sky',
          },
          {
            storyTerm: 'Raw acoustic sieve',
            technicalTerm: 'Classic BPF bytecode filter attached via setsockopt(SOL_SOCKET, SO_ATTACH_FILTER)',
            tone: 'rose',
          },
          {
            storyTerm: 'Secret trigger code',
            technicalTerm: 'Magic packet sequence waking the passive implant on demand',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'A seasoned forensic investigator skips the front ticket map altogether and reads the depot master cable-clamp registry directly, exposing the hidden sieve bytecode, tracing it to the unlinked closet occupant, and spotting the single-occupancy brass lock pin left on the wall.',
        storyMappings: [
          {
            storyTerm: 'Depot master cable-clamp registry',
            technicalTerm: 'Kernel /proc/net/packet table listing all active AF_PACKET raw sockets',
            tone: 'amber',
          },
          {
            storyTerm: 'Exposing the hidden sieve bytecode',
            technicalTerm: 'ss -0pb dumping attached BPF filter instructions and owning process PIDs',
            tone: 'sky',
          },
          {
            storyTerm: 'Single-occupancy brass lock pin',
            technicalTerm: 'Mutex PID file /var/run/haldrund.pid preventing duplicate implant instances',
            tone: 'rose',
          },
          {
            storyTerm: 'Unlinked closet occupant',
            technicalTerm: 'Running implant correlated via /proc/<pid>/exe pointing to deleted /dev/shm file',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'dfir-linux-ld-so-preload-userland-rootkit-proc-maps': {
    briefing: {
      storyAnalogy:
        'Imagine an invisible tailor sneaking into a factory dressing room and sewing a rigged lining into the universal work coat hanging on the entrance rack. Every factory inspector who slips on a standard coat automatically sees blurred lenses that hide the tailor hidden doorway, until a forensic auditor arrives with sealed, self-contained binoculars from outside the factory and reads the raw room occupancy ledger directly.',
      storyMappings: [
        {
          storyTerm: 'Universal work coat hanging on the entrance rack',
          technicalTerm: 'System-wide dynamic linker file /etc/ld.so.preload',
          tone: 'amber',
        },
        {
          storyTerm: 'Rigged lining sewn into the coat',
          technicalTerm: 'Malicious shared library /usr/lib64/libudev-guardian.so',
          tone: 'sky',
        },
        {
          storyTerm: 'Blurred lenses hiding the tailor doorway',
          technicalTerm: 'Userland PLT/GOT hooks on readdir64() and fopen() hiding files and sockets',
          tone: 'rose',
        },
        {
          storyTerm: 'Sealed external binoculars reading the raw room ledger',
          technicalTerm: 'Statically linked busybox binary inspecting /proc/1/maps and /proc/self/map_files',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Under cover of night, the tailor slips a custom rigged coat lining into the supply shelf and writes its tag number onto the mandatory entrance-rack sheet. Even though the front-desk tools will soon be fooled, the tamper-proof security camera bolted above the rack records the exact moment the sheet is edited.',
        storyMappings: [
          {
            storyTerm: 'Custom rigged coat lining on the supply shelf',
            technicalTerm: 'Compiled ELF shared object placed at /usr/lib64/libudev-guardian.so',
            tone: 'amber',
          },
          {
            storyTerm: 'Mandatory entrance-rack sheet',
            technicalTerm: 'Path entry written into /etc/ld.so.preload',
            tone: 'sky',
          },
          {
            storyTerm: 'Tamper-proof camera bolted above the rack',
            technicalTerm: 'Kernel-level auditd syscall monitoring recording nametype=CREATE',
            tone: 'rose',
          },
          {
            storyTerm: 'Front-desk tools about to be fooled',
            technicalTerm: 'Standard dynamically linked Linux utilities (ps, ls, netstat, lsof)',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Every time a normal factory worker starts a routine floor check, the entrance dresser hands them the rigged coat first. Inside each worker goggles, the rigged lining intercepts every glance down the aisles and every glance at the attendance clipboard, erasing the intruder files and connections before the worker eyes can read them.',
        storyMappings: [
          {
            storyTerm: 'Entrance dresser handing out the rigged coat',
            technicalTerm: 'Dynamic linker /lib64/ld-linux-x86-64.so.2 loading /etc/ld.so.preload first',
            tone: 'amber',
          },
          {
            storyTerm: 'Intercepting every glance down the aisles',
            technicalTerm: 'PLT/GOT function hooking of libc readdir64() hiding directories and PIDs',
            tone: 'sky',
          },
          {
            storyTerm: 'Intercepting glances at the attendance clipboard',
            technicalTerm: 'Userland hooking of fopen() filtering /proc/net/tcp entries',
            tone: 'rose',
          },
          {
            storyTerm: 'Fooled routine floor checks',
            technicalTerm: 'Compromised output from dynamically linked ps, ls, netstat, and lsof',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Refusing to put on any factory coat at all, the forensic auditor walks in wearing completely self-contained outside gear and reads the raw hallway map posted inside the master guard station, immediately spotting the foreign rigged lining wrapped around every single worker in the building.',
        storyMappings: [
          {
            storyTerm: 'Self-contained outside gear skipping the coat rack',
            technicalTerm: 'Statically linked busybox binary immune to /etc/ld.so.preload injection',
            tone: 'amber',
          },
          {
            storyTerm: 'Raw hallway map inside the master guard station',
            technicalTerm: 'Kernel-generated /proc/1/maps and /proc/self/map_files memory mappings',
            tone: 'sky',
          },
          {
            storyTerm: 'Direct inspection without intermediary glasses',
            technicalTerm: 'Shell builtin read loop bypassing hooked userland libc file wrappers',
            tone: 'rose',
          },
          {
            storyTerm: 'Foreign lining wrapped around every worker',
            technicalTerm: 'Exposed /usr/lib64/libudev-guardian.so mapping across PID 1 and child processes',
            tone: 'emerald',
          },
        ],
      },
    },
  },

  'dfir-volatility3-malfind-vad-hollowing-kernel-callbacks': {
    briefing: {
      storyAnalogy:
        'Imagine a forensic detective freezing a busy courthouse in mid-motion to perform three surgical checks on the frozen rooms. First, the detective checks the floor-seating ledger for armed strangers sitting in unbacked private booths disguised in clerk robes; second, the detective compares the official front-desk attendance list against a physical walk through every hallway to catch a hidden worker who erased their own name; third, the detective inspects the master courthouse bell-pull board to spot silent security bells that were tampered with or replaced.',
      storyMappings: [
        {
          storyTerm: 'Freezing the courthouse in mid-motion',
          technicalTerm: 'Raw physical RAM acquisition (memdump.raw) analyzed with Volatility 3',
          tone: 'amber',
        },
        {
          storyTerm: 'Armed strangers in unbacked private booths wearing clerk robes',
          technicalTerm: 'windows.malfind flagging unbacked PAGE_EXECUTE_READWRITE VADs in svchost.exe',
          tone: 'sky',
        },
        {
          storyTerm: 'Front-desk attendance list versus physical hallway headcount',
          technicalTerm: 'windows.pslist (linked list) compared against windows.psscan (pool scan) detecting DKOM',
          tone: 'rose',
        },
        {
          storyTerm: 'Master courthouse bell-pull board',
          technicalTerm: 'windows.callbacks and windows.driverscan inspecting PspCreateProcessNotifyRoutine',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Walking through the courthouse room-assignment trees, the detective spotlights a private booth inside a trusted clerk office that has both writing and execution permissions turned on yet matches no official blueprint file on the shelf, revealing an executable payload hiding directly inside live workspace memory.',
        storyMappings: [
          {
            storyTerm: 'Room-assignment trees',
            technicalTerm: 'Kernel _MMVAD_SHORT / _MMVAD Virtual Address Descriptor balanced trees',
            tone: 'amber',
          },
          {
            storyTerm: 'Trusted clerk office',
            technicalTerm: 'Target host process svchost.exe (PID 2480)',
            tone: 'sky',
          },
          {
            storyTerm: 'Private booth with no blueprint file on the shelf',
            technicalTerm: 'Unbacked private PAGE_EXECUTE_READWRITE (RWX) memory region flagged by windows.malfind',
            tone: 'rose',
          },
          {
            storyTerm: 'Executable payload hiding inside live workspace',
            technicalTerm: 'In-memory MZ/PE header or shellcode recovered via windows.vadinfo and malfind',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Next, the detective holds the official front-desk employee chain in one hand while physically sweeping every office chair in the building with the other. One rogue loader erased its own link from the front-desk chain so ordinary roll calls skip straight past it, yet the physical chair sweep catches it sitting in plain sight.',
        storyMappings: [
          {
            storyTerm: 'Official front-desk employee chain',
            technicalTerm: 'Doubly linked Nt!PsActiveProcessHead list walked by windows.pslist and Task Manager',
            tone: 'amber',
          },
          {
            storyTerm: 'Erasing its own link from the chain',
            technicalTerm: 'Direct Kernel Object Manipulation (DKOM) unlinking _EPROCESS of kworker_win.exe (PID 5912)',
            tone: 'sky',
          },
          {
            storyTerm: 'Physical sweep of every office chair',
            technicalTerm: 'Pool-tag memory carving via windows.psscan locating unlinked _EPROCESS blocks',
            tone: 'rose',
          },
          {
            storyTerm: 'Hidden worker caught sitting in plain sight',
            technicalTerm: 'Process present in psscan output while absent from pslist output',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Finally, the detective opens the wooden panel behind the courthouse master bell-pull board and traces every wire back to its owner, verifying whether any rogue driver snipped the security alarm bells or wired its own silent bell onto the courthouse nervous system.',
        storyMappings: [
          {
            storyTerm: 'Courthouse master bell-pull board',
            technicalTerm: 'Kernel arrays PspCreateProcessNotifyRoutine, PspCreateThreadNotifyRoutine, and ObRegisterCallbacks',
            tone: 'amber',
          },
          {
            storyTerm: 'Tracing every wire back to its owner',
            technicalTerm: 'Volatility 3 windows.callbacks correlating callback addresses to loaded drivers',
            tone: 'sky',
          },
          {
            storyTerm: 'Auditing every badge holder in the engine room',
            technicalTerm: 'windows.driverscan enumerating all Ring-0 driver objects in RAM',
            tone: 'rose',
          },
          {
            storyTerm: 'Rogue driver tampering with security bells',
            technicalTerm: 'Unauthorized or unbacked kernel driver hooking or wiping EDR callbacks',
            tone: 'emerald',
          },
        ],
      },
    },
  },
};
