import type { Section3DDescriptor, Section3DKey } from '@/lib/section-3d-registry';

/**
 * Bespoke 3D Story-to-Technical Section Descriptors for KERNEL_FIRMWARE_BYOVD (11 scenarios).
 */
export const KERNEL_FIRMWARE_BYOVD_3D_REGISTRY: Record<
  string,
  Partial<Record<Section3DKey, Section3DDescriptor>>
> = {
  "aukill-edr-killer-procxp152-byovd": {
    "briefing": {
      "scenarioId": "aukill-edr-killer-procxp152-byovd",
      "sectionKey": "briefing",
      "sceneKind": "krn-aukill-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1543.003",
      "title": "AuKill EDR Killer Abusing Signed Sysinternals PROCEXP152.SYS (BYOVD) — Story-to-Technical Overview",
      "storyCue": "Imagine a secure office building whose maintenance wing still honors an outdated, genuinely stamped inspector pass card. An intruder drops that retired inspector card onto the desk, opens the inspector service hatch using two special code knocks (one knock to hand over a master guard badge and a second knock to yank out a security guard radio wire), and loops through every hallway knocking out every building alarm before unlocking the safe for ransomware.",
      "technicalCue": "DEFENSE EVASION: Dropping & Registering Vulnerable Signed PROCEXP152.SYS v16.32 -> DEFENSE EVASION: Opening \\\\.\\PROCEXP152 & Issuing IOCTL 0x8335003C / 0x83350004 -> EXFIL & IMPACT: Ring-0 Termination of PPL EDR Sensors & Ransomware Detonation",
      "storyMappings": [
        {
          "storyTerm": "Outdated, genuinely stamped inspector pass card",
          "technicalTerm": "Signed vulnerable Sysinternals PROCEXP152.SYS v16.32 kernel driver (BYOVD)",
          "tone": "amber"
        },
        {
          "storyTerm": "Inspector service hatch",
          "technicalTerm": "Kernel device symbolic link \\\\.\\PROCEXP152 exposed to user-mode callers",
          "tone": "sky"
        },
        {
          "storyTerm": "Two special code knocks (master badge knock and wire-yank knock)",
          "technicalTerm": "IOCTL 0x8335003C (open privileged handle) and IOCTL 0x83350004 (close handle)",
          "tone": "rose"
        },
        {
          "storyTerm": "Knocking out every building alarm before unlocking the safe",
          "technicalTerm": "Ring-0 termination of PPL-protected EDR sensors prior to ransomware execution",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#FACC15",
      "durationSec": 18,
      "callouts": [
        {
          "id": "krn-aukill-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Outdated, genuinely stamped inspector…",
          "subtitle": "Signed vulnerable Sysinternals PROCEXP152.SYS v16.32 kernel…",
          "tone": "amber"
        },
        {
          "id": "krn-aukill-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Inspector service hatch",
          "subtitle": "Kernel device symbolic link \\\\.\\PROCEXP152 exposed to…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass Card",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "Dropping & Registering Vulnerable Signed PROCEXP152.SYS v16.32",
          "storyExcerpt": "Carrying stolen manager keys, the intruder unpacks a retired but legitimately stamped maintenance-inspector pass card from a briefcase, slides it onto the official building driver rack, and activates it…",
          "technicalParallel": "While newer versions of Sysinternals Process Explorer (v17.0+) added security descriptor checks restricting driver access, version 16.32 permitted any local administrator process to open its device object.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Up Team",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Opening \\\\.\\PROCEXP152 & Issuing IOCTL 0x8335003C / 0x83350004",
          "storyExcerpt": "The intruder steps up to the newly opened inspector service hatch with a team of helpers and taps two distinct control knocks: the first knock forces the kernel hatch to hand back an all-powerful master…",
          "technicalParallel": "Normally, Windows blocks user-mode administrators from opening PROCESS_TERMINATE handles to PsProtectedSignerAntimalware-Light (PPL) processes, but a ZwOpenProcess call originating from a Ring-0 kernel…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Two Code",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Ring-0 Termination of PPL EDR Sensors & Ransomware Detonation",
          "storyExcerpt": "Armed with both the master handle knock and the wire-snipping knock, the intruder runs endlessly from floor to floor shutting down every armored security monitor even when the monitors try to restart…",
          "technicalParallel": "AuKill keeps its worker threads running in the background during encryption so if the Windows Service Control Manager attempts to restart a crashed EDR service, AuKill kills the new PID within…",
          "accentHex": "#FACC15",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Kernel Vault",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Guard Station",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Old Badge",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "aukill-edr-killer-procxp152-byovd",
      "sectionKey": "step-1",
      "sceneKind": "krn-aukill-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "Dropping & Registering Vulnerable Signed PROCEXP152.SYS v16.32",
      "storyCue": "Carrying stolen manager keys, the intruder unpacks a retired but legitimately stamped maintenance-inspector pass card from a briefcase, slides it onto the official building driver rack, and activates it even though no real maintenance engineer is present in the room.",
      "technicalCue": "T1543.003 · DEFENSE EVASION — Running with local administrator rights, AuKill unpacked an embedded resource containing version 16.32 of PROCEXP152.SYS into C:\\Windows\\System32\\drivers\\PROCEXP152.SYS and loaded it via…",
      "storyMappings": [
        {
          "storyTerm": "Retired legitimately stamped pass card",
          "technicalTerm": "Embedded Microsoft-signed Sysinternals PROCEXP152.SYS v16.32",
          "tone": "amber"
        },
        {
          "storyTerm": "Official building driver rack",
          "technicalTerm": "C:\\Windows\\System32\\drivers\\PROCEXP152.SYS registered as a kernel service",
          "tone": "sky"
        },
        {
          "storyTerm": "Briefcase carrying the embedded card",
          "technicalTerm": "AuKill C++ user-mode BYOVD loader running with Administrator rights",
          "tone": "rose"
        },
        {
          "storyTerm": "No real maintenance engineer present",
          "technicalTerm": "Driver loaded by an untrusted binary rather than signed procexp64.exe",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-aukill-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Retired legitimately stamped pass card",
          "subtitle": "Embedded Microsoft-signed Sysinternals PROCEXP152.SYS v16.32",
          "tone": "amber"
        },
        {
          "id": "krn-aukill-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Official building driver rack",
          "subtitle": "C:\\Windows\\System32\\drivers\\PROCEXP152.SYS registered as a…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass Card",
          "stageTag": "STEP 01 · SETUP",
          "title": "Retired legitimately stamped pass card",
          "storyExcerpt": "Carrying stolen manager keys, the intruder unpacks a retired but legitimately stamped maintenance-inspector pass card from a briefcase, slides it onto the official building driver rack, and…",
          "technicalParallel": "While newer versions of Sysinternals Process Explorer (v17.0+) added security descriptor checks restricting driver access, version 16.32 permitted any local administrator process to open its device object.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Rack",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Official building driver rack",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses official building driver rack to advance toward briefcase carrying the embedded card.",
          "technicalParallel": "Running with local administrator rights, AuKill unpacked an embedded resource containing version 16.32 of PROCEXP152.SYS into C:\\Windows\\System32\\drivers\\PROCEXP152.SYS and loaded it via CreateServiceW /…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Card",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "No real maintenance engineer present",
          "storyExcerpt": "Behind the scenes, no real maintenance engineer present captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert on Sysmon EventID 6 (DriverLoaded, recording kernel drivers loaded alongside their signature and hash) for PROCEXP152.SYS version 16.32 whenever the creating or loading process is not a…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Kernel Vault",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Guard Station",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Old Badge",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1543.003"
    },
    "step-2": {
      "scenarioId": "aukill-edr-killer-procxp152-byovd",
      "sectionKey": "step-2",
      "sceneKind": "krn-aukill-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Opening \\\\.\\PROCEXP152 & Issuing IOCTL 0x8335003C / 0x83350004",
      "storyCue": "The intruder steps up to the newly opened inspector service hatch with a team of helpers and taps two distinct control knocks: the first knock forces the kernel hatch to hand back an all-powerful master handle to protected security guards, and the second knock tells the hatch to snip any open lock handles held by those guards.",
      "technicalCue": "T1562.001 · DEFENSE EVASION — AuKill opened a file handle to \\\\.\\PROCEXP152 and spawned multiple worker threads that enumerated running processes and handles, invoking DeviceIoControl with IOCTL 0x8335003C…",
      "storyMappings": [
        {
          "storyTerm": "Inspector service hatch",
          "technicalTerm": "Device handle opened to \\\\.\\PROCEXP152 via CreateFile",
          "tone": "amber"
        },
        {
          "storyTerm": "First control knock granting a master handle",
          "technicalTerm": "DeviceIoControl IOCTL 0x8335003C opening full-access Ring-0 process handles",
          "tone": "sky"
        },
        {
          "storyTerm": "Second control knock snipping open lock handles",
          "technicalTerm": "DeviceIoControl IOCTL 0x83350004 forcibly closing target process handles",
          "tone": "rose"
        },
        {
          "storyTerm": "Team of helpers enumerating guards",
          "technicalTerm": "Multi-threaded AuKill worker routines scanning running endpoint security PIDs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-aukill-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Inspector service hatch",
          "subtitle": "Device handle opened to \\\\.\\PROCEXP152 via CreateFile",
          "tone": "amber"
        },
        {
          "id": "krn-aukill-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "First control knock granting a master…",
          "subtitle": "DeviceIoControl IOCTL 0x8335003C opening full-access Ring-0…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Team",
          "stageTag": "STEP 02 · SETUP",
          "title": "Inspector service hatch",
          "storyExcerpt": "The intruder steps up to the newly opened inspector service hatch with a team of helpers and taps two distinct control knocks: the first knock forces the kernel hatch to hand back an…",
          "technicalParallel": "Normally, Windows blocks user-mode administrators from opening PROCESS_TERMINATE handles to PsProtectedSignerAntimalware-Light (PPL) processes, but a ZwOpenProcess call originating from a Ring-0 kernel…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Open",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "First control knock granting a master handle",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses first control knock granting a master handle to advance toward second control knock snipping open lock handles.",
          "technicalParallel": "AuKill opened a file handle to \\\\.\\PROCEXP152 and spawned multiple worker threads that enumerated running processes and handles, invoking DeviceIoControl with IOCTL 0x8335003C…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Open Lock",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Team of helpers enumerating guards",
          "storyExcerpt": "Behind the scenes, team of helpers enumerating guards captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Monitor ETW Microsoft-Windows-Kernel-File and IOCTL telemetry (kernel tracing that records user-mode binaries opening protected device links) for non-Sysinternals processes opening \\Device\\PROCEXP152 and…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Kernel Vault",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Guard Station",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Old Badge",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1562.001"
    },
    "step-3": {
      "scenarioId": "aukill-edr-killer-procxp152-byovd",
      "sectionKey": "step-3",
      "sceneKind": "krn-aukill-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Ring-0 Termination of PPL EDR Sensors & Ransomware Detonation",
      "storyCue": "Armed with both the master handle knock and the wire-snipping knock, the intruder runs endlessly from floor to floor shutting down every armored security monitor even when the monitors try to restart themselves, leaving the whole building blind for the ransomware crew.",
      "technicalCue": "T1486 · EXFIL & IMPACT — Using the Ring-0 handle returned by 0x8335003C and the handle-closing primitive 0x83350004, AuKill continuously terminated processes and services matching Microsoft Defender (MsMpEng.exe)…",
      "storyMappings": [
        {
          "storyTerm": "Armored security monitors",
          "technicalTerm": "Protected Process Light (PPL) EDR services such as MsMpEng.exe",
          "tone": "amber"
        },
        {
          "storyTerm": "Master handle knock and wire-snipping knock",
          "technicalTerm": "Paired IOCTL 0x8335003C termination and IOCTL 0x83350004 handle closure loop",
          "tone": "sky"
        },
        {
          "storyTerm": "Running endlessly even as monitors restart",
          "technicalTerm": "Continuous AuKill watchdog loop terminating respawning EDR services",
          "tone": "rose"
        },
        {
          "storyTerm": "Blinded building ready for the ransomware crew",
          "technicalTerm": "Unmonitored endpoint enabling Medusa Locker or LockBit mass encryption",
          "tone": "emerald"
        }
      ],
      "accentHex": "#FACC15",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-aukill-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Armored security monitors",
          "subtitle": "Protected Process Light (PPL) EDR services such as MsMpEng.exe",
          "tone": "amber"
        },
        {
          "id": "krn-aukill-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Master handle knock and wire-snipping…",
          "subtitle": "Paired IOCTL 0x8335003C termination and IOCTL 0x83350004…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Both Runs",
          "stageTag": "STEP 03 · SETUP",
          "title": "Armored security monitors",
          "storyExcerpt": "Armed with both the master handle knock and the wire-snipping knock, the intruder runs endlessly from floor to floor shutting down every armored security monitor even when the monitors try to…",
          "technicalParallel": "AuKill keeps its worker threads running in the background during encryption so if the Windows Service Control Manager attempts to restart a crashed EDR service, AuKill kills the new PID within…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Wire-snipping",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Master handle knock and wire-snipping knock",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses master handle knock and wire-snipping knock to advance toward running endlessly even as monitors restart.",
          "technicalParallel": "Using the Ring-0 handle returned by 0x8335003C and the handle-closing primitive 0x83350004, AuKill continuously terminated processes and services matching Microsoft Defender (MsMpEng.exe), Sophos…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Even",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Blinded building ready for the ransomware crew",
          "storyExcerpt": "Behind the scenes, blinded building ready for the ransomware crew captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Enabling Microsoft’s Vulnerable Driver Blocklist (SiPolicy.p7b + HVCI) to prevent PROCEXP152.SYS v16.32 from loading in the first place.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Kernel Vault",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Guard Station",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Old Badge",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1486"
    }
  },
  "blacklotus-uefi-bootkit-cve-2022-21894": {
    "briefing": {
      "scenarioId": "blacklotus-uefi-bootkit-cve-2022-21894",
      "sectionKey": "briefing",
      "sceneKind": "krn-blacklotus-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1542.003",
      "title": "BlackLotus UEFI Bootkit Baton Drop Secure Boot Bypass (CVE-2022-21894) — Story-to-Technical Overview",
      "storyCue": "Imagine an armored bank vault whose morning startup ritual requires every opening clerk to carry a genuine royal seal. An intruder sneaks into the hidden startup closet and swaps in an older, still-stamped clerk handbook that contains a subtle wording loophole. At dawn, the older clerk trips over that wording loophole during the handoff ceremony, shuts off every vault alarm and glass shield before the main floor opens, and lets an unbadged master saboteur walk straight into the control room.",
      "technicalCue": "PERSISTENCE: EFI System Partition Staging & MOK NVRAM Variable Tampering -> DEFENSE EVASION: \"Baton Drop\" BCD Argument Truncation Exploit (CVE-2022-21894) -> DEFENSE EVASION: Disabling BitLocker / HVCI & Deploying Unsigned Ring-0 Kernel Driver",
      "storyMappings": [
        {
          "storyTerm": "Hidden startup closet",
          "technicalTerm": "Hidden FAT32 EFI System Partition (\\Device\\HarddiskVolume1\\EFI\\)",
          "tone": "amber"
        },
        {
          "storyTerm": "Older, still-stamped clerk handbook",
          "technicalTerm": "Downgraded Microsoft-signed bootmgfw.efi, hvloader.efi, and winload.efi (BYOVB)",
          "tone": "sky"
        },
        {
          "storyTerm": "Wording loophole during the handoff ceremony",
          "technicalTerm": "CVE-2022-21894 Baton Drop BCD argument truncation exploit",
          "tone": "rose"
        },
        {
          "storyTerm": "Shutting off vault alarms to admit an unbadged saboteur",
          "technicalTerm": "In-RAM patching of HVCI, BitLocker, and Code Integrity to load an unsigned Ring-0 driver",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "krn-blacklotus-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Hidden startup closet",
          "subtitle": "Hidden FAT32 EFI System Partition (\\Device\\HarddiskVolume1\\EFI\\)",
          "tone": "amber"
        },
        {
          "id": "krn-blacklotus-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Older, still-stamped clerk handbook",
          "subtitle": "Downgraded Microsoft-signed bootmgfw.efi, hvloader.efi, and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Dawn-startup",
          "stageTag": "STAGE 01 · PERSISTENCE",
          "title": "EFI System Partition Staging & MOK NVRAM Variable Tampering",
          "storyExcerpt": "Using stolen manager keys while the bank is running, the intruder unlocks the hidden dawn-startup closet, plants older officially stamped opening manuals inside, and scribbles a custom startup note onto…",
          "technicalParallel": "By setting only EFI_VARIABLE_NON_VOLATILE | EFI_VARIABLE_BOOTSERVICE_ACCESS (omitting EFI_VARIABLE_RUNTIME_ACCESS), user-mode and kernel-mode security tools running after Windows boots cannot query or…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Dawn",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "\"Baton Drop\" BCD Argument Truncation Exploit (CVE-2022-21894)",
          "storyExcerpt": "When the bank powers up at dawn, the older stamped clerk reads a specially folded morning checklist planted by the intruder. A clever fold in the checklist cuts off the safety instructions mid-sentence…",
          "technicalParallel": "Because the exploit runs after UEFI firmware verifies bootmgfw.efi’s genuine Microsoft signature but before ExitBootServices(), BlackLotus hijacks the boot chain without modifying the motherboard’s…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Disk Main",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Disabling BitLocker / HVCI & Deploying Unsigned Ring-0 Kernel Driver",
          "storyExcerpt": "Holding control of the early-morning opening relay, the intruder erases the glass integrity shields and disk locks straight from the building active workspace before the main operating floor wakes up…",
          "technicalParallel": "Remediation required applying Microsoft’s DBX UEFI revocation update (KB5025885), which adds the vulnerable bootloaders’ hashes to the motherboard’s UEFI NVRAM DBX, and wiping the EFI System Partition.",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Boot Chip",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Kernel Floor",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Boot Chain",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "blacklotus-uefi-bootkit-cve-2022-21894",
      "sectionKey": "step-1",
      "sceneKind": "krn-blacklotus-step-1",
      "stageBadge": "STEP #1 · PERSISTENCE",
      "title": "EFI System Partition Staging & MOK NVRAM Variable Tampering",
      "storyCue": "Using stolen manager keys while the bank is running, the intruder unlocks the hidden dawn-startup closet, plants older officially stamped opening manuals inside, and scribbles a custom startup note onto the motherboard permanent chalk ledger so the building reads the planted manuals on the next morning reboot.",
      "technicalCue": "T1542.003 · PERSISTENCE — Running as a local administrator, the BlackLotus installer mounted the hidden FAT32 EFI System Partition (ESP), dropped legitimate Microsoft-signed copies of bootmgfw.efi, hvloader.efi, and…",
      "storyMappings": [
        {
          "storyTerm": "Hidden dawn-startup closet",
          "technicalTerm": "Mounted hidden FAT32 EFI System Partition (ESP)",
          "tone": "amber"
        },
        {
          "storyTerm": "Older officially stamped opening manuals",
          "technicalTerm": "Legitimately signed older copies of bootmgfw.efi, hvloader.efi, and winload.efi",
          "tone": "sky"
        },
        {
          "storyTerm": "Motherboard permanent chalk ledger",
          "technicalTerm": "UEFI NVRAM variables modified via ZwSetSystemEnvironmentValueEx",
          "tone": "rose"
        },
        {
          "storyTerm": "Stolen manager keys",
          "technicalTerm": "Local Administrator privileges used by the BlackLotus installer",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-blacklotus-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Hidden dawn-startup closet",
          "subtitle": "Mounted hidden FAT32 EFI System Partition (ESP)",
          "tone": "amber"
        },
        {
          "id": "krn-blacklotus-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Older officially stamped opening manuals",
          "subtitle": "Legitimately signed older copies of bootmgfw.efi…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Dawn-startup",
          "stageTag": "STEP 01 · SETUP",
          "title": "Hidden dawn-startup closet",
          "storyExcerpt": "Using stolen manager keys while the bank is running, the intruder unlocks the hidden dawn-startup closet, plants older officially stamped opening manuals inside, and scribbles a custom startup…",
          "technicalParallel": "By setting only EFI_VARIABLE_NON_VOLATILE | EFI_VARIABLE_BOOTSERVICE_ACCESS (omitting EFI_VARIABLE_RUNTIME_ACCESS), user-mode and kernel-mode security tools running after Windows boots cannot query or…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Older officially stamped opening manuals",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses older officially stamped opening manuals to advance toward motherboard permanent chalk ledger.",
          "technicalParallel": "Running as a local administrator, the BlackLotus installer mounted the hidden FAT32 EFI System Partition (ESP), dropped legitimate Microsoft-signed copies of bootmgfw.efi, hvloader.efi, and winload.efi…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Keys",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Stolen manager keys",
          "storyExcerpt": "Behind the scenes, stolen manager keys captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Monitor Sysmon EventID 11 (FileCreate logging every new binary written to disk) targeting \\Device\\HarddiskVolume1\\EFI\\ alongside kernel auditing for unexpected calls to ZwSetSystemEnvironmentValueEx…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Boot Chip",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Kernel Floor",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Boot Chain",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1542.003"
    },
    "step-2": {
      "scenarioId": "blacklotus-uefi-bootkit-cve-2022-21894",
      "sectionKey": "step-2",
      "sceneKind": "krn-blacklotus-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "\"Baton Drop\" BCD Argument Truncation Exploit (CVE-2022-21894)",
      "storyCue": "When the bank powers up at dawn, the older stamped clerk reads a specially folded morning checklist planted by the intruder. A clever fold in the checklist cuts off the safety instructions mid-sentence, letting the intruder take direct command of the opening relay while the front-door seal check still flashes green.",
      "technicalCue": "T1562.001 · DEFENSE EVASION — On the next boot, the staged vulnerable bootmgfw.efi / winload.efi parsed a custom Boot Configuration Data (BCD) store crafted by BlackLotus to trigger CVE-2022-21894 (Baton Drop, a memory…",
      "storyMappings": [
        {
          "storyTerm": "Older stamped clerk starting at dawn",
          "technicalTerm": "Vulnerable signed bootmgfw.efi and winload.efi executing during early boot",
          "tone": "amber"
        },
        {
          "storyTerm": "Specially folded morning checklist",
          "technicalTerm": "Crafted Boot Configuration Data (BCD) store triggering CVE-2022-21894",
          "tone": "sky"
        },
        {
          "storyTerm": "Cutting off safety instructions mid-sentence",
          "technicalTerm": "Baton Drop BCD argument truncation bypassing Secure Boot verification",
          "tone": "rose"
        },
        {
          "storyTerm": "Front-door seal check flashing green",
          "technicalTerm": "UEFI Secure Boot signature check satisfied by the unrevoked Microsoft binary",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-blacklotus-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Older stamped clerk starting at dawn",
          "subtitle": "Vulnerable signed bootmgfw.efi and winload.efi executing…",
          "tone": "amber"
        },
        {
          "id": "krn-blacklotus-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Specially folded morning checklist",
          "subtitle": "Crafted Boot Configuration Data (BCD) store triggering…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Dawn",
          "stageTag": "STEP 02 · SETUP",
          "title": "Older stamped clerk starting at dawn",
          "storyExcerpt": "When the bank powers up at dawn, the older stamped clerk reads a specially folded morning checklist planted by the intruder.",
          "technicalParallel": "Because the exploit runs after UEFI firmware verifies bootmgfw.efi’s genuine Microsoft signature but before ExitBootServices(), BlackLotus hijacks the boot chain without modifying the motherboard’s…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Fold Cuts",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Specially folded morning checklist",
          "storyExcerpt": "A clever fold in the checklist cuts off the safety instructions mid-sentence, letting the intruder take direct command of the opening relay while the front-door seal check still flashes green.",
          "technicalParallel": "On the next boot, the staged vulnerable bootmgfw.efi / winload.efi parsed a custom Boot Configuration Data (BCD) store crafted by BlackLotus to trigger CVE-2022-21894 (Baton Drop, a memory corruption and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Off Mid-sentence",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Front-door seal check flashing green",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across front-door seal check flashing green while locking down cutting off safety instructions mid-sentence.",
          "technicalParallel": "Inspect TPM 2.0 Measured Boot attestation logs (Windows Boot Configuration Logs, WBCL, which cryptographically record every bootloader hash executed at power-on) for downgraded winload.efi hashes in…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Boot Chip",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Kernel Floor",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Boot Chain",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1562.001"
    },
    "step-3": {
      "scenarioId": "blacklotus-uefi-bootkit-cve-2022-21894",
      "sectionKey": "step-3",
      "sceneKind": "krn-blacklotus-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Disabling BitLocker / HVCI & Deploying Unsigned Ring-0 Kernel Driver",
      "storyCue": "Holding control of the early-morning opening relay, the intruder erases the glass integrity shields and disk locks straight from the building active workspace before the main operating floor wakes up, then marches an unbadged kernel saboteur straight into the vault engine room.",
      "technicalCue": "T1068 · DEFENSE EVASION — With early-boot execution control, BlackLotus patched hvloader.efi and winload.efi (OslFwpKernelSetupPhase1) in RAM to neutralize Hypervisor-Protected Code Integrity (HVCI / VBS) and BitLocker…",
      "storyMappings": [
        {
          "storyTerm": "Erasing glass integrity shields in active workspace",
          "technicalTerm": "In-RAM patching of hvloader.efi and winload.efi (OslFwpKernelSetupPhase1)",
          "tone": "amber"
        },
        {
          "storyTerm": "Disabled vault locks and shields",
          "technicalTerm": "Neutralized HVCI, VBS, BitLocker protections, and Code Integrity",
          "tone": "sky"
        },
        {
          "storyTerm": "Unbadged kernel saboteur",
          "technicalTerm": "Unsigned Ring-0 kernel rootkit driver loaded without driver signing enforcement",
          "tone": "rose"
        },
        {
          "storyTerm": "Main operating floor waking up",
          "technicalTerm": "Windows kernel startup with compromised winlogon.exe network beacons",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-blacklotus-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Erasing glass integrity shields in…",
          "subtitle": "In-RAM patching of hvloader.efi and winload.efi…",
          "tone": "amber"
        },
        {
          "id": "krn-blacklotus-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Disabled vault locks and shields",
          "subtitle": "Neutralized HVCI, VBS, BitLocker protections, and Code Integrity",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Disk Main",
          "stageTag": "STEP 03 · SETUP",
          "title": "Erasing glass integrity shields in active workspace",
          "storyExcerpt": "Holding control of the early-morning opening relay, the intruder erases the glass integrity shields and disk locks straight from the building active workspace before the main operating floor…",
          "technicalParallel": "Remediation required applying Microsoft’s DBX UEFI revocation update (KB5025885), which adds the vulnerable bootloaders’ hashes to the motherboard’s UEFI NVRAM DBX, and wiping the EFI System Partition.",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Disabled vault locks and shields",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses disabled vault locks and shields to advance toward unbadged kernel saboteur.",
          "technicalParallel": "With early-boot execution control, BlackLotus patched hvloader.efi and winload.efi (OslFwpKernelSetupPhase1) in RAM to neutralize Hypervisor-Protected Code Integrity (HVCI / VBS) and BitLocker, mapped an…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Main Up",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Main operating floor waking up",
          "storyExcerpt": "Behind the scenes, main operating floor waking up captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Audit Windows CodeIntegrity and System Event Logs for unexpected HVCI or VBS disablement across reboots (indicating pre-OS security tampering) paired with EDR network telemetry flagging outbound…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Boot Chip",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Kernel Floor",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Boot Chain",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1068"
    }
  },
  "crowdstrike-poortry-burntcigar-byovd": {
    "briefing": {
      "scenarioId": "crowdstrike-poortry-burntcigar-byovd",
      "sectionKey": "briefing",
      "sceneKind": "krn-poortry-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1553.002",
      "title": "STONESTOP & POORTRY / BURNTCIGAR WHQL-Signed Kernel Callback Wiper — Story-to-Technical Overview",
      "storyCue": "Imagine a heist crew that skips stealing an old inspector badge and instead hijacks the government badge-printing office to stamp their own custom saboteur card. Once inside the building control room, the saboteur requires a secret spoken handshake before cutting every alarm wire on the central watchboard and erasing the armored insignia from both the security guards and the vault master ledger.",
      "technicalCue": "DEFENSE EVASION: Loading Custom Malicious Driver POORTRY Signed via Abused WHQL Account -> DEFENSE EVASION: Authenticated IOCTL Handshake & Kernel Notify Callback Array Wiping -> CREDENTIAL ACCESS: EPROCESS Protection Bit Stripping, EDR Termination & LSASS Credential Dump",
      "storyMappings": [
        {
          "storyTerm": "Custom saboteur card stamped by a hijacked badge office",
          "technicalTerm": "POORTRY / BURNTCIGAR custom kernel rootkit signed via abused WHQL account",
          "tone": "amber"
        },
        {
          "storyTerm": "Secret spoken handshake at the control room door",
          "technicalTerm": "Cryptographic challenge-response DeviceIoControl handshake from STONESTOP",
          "tone": "sky"
        },
        {
          "storyTerm": "Cutting every alarm wire on the central watchboard",
          "technicalTerm": "Zeroing PspCreateProcessNotifyRoutine and ObRegisterCallbacks arrays",
          "tone": "rose"
        },
        {
          "storyTerm": "Erasing armored insignia from guards and the vault ledger",
          "technicalTerm": "DKOM stripping of _PS_PROTECTION bits on EDR processes and lsass.exe",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "krn-poortry-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Custom saboteur card stamped by a…",
          "subtitle": "POORTRY / BURNTCIGAR custom kernel rootkit signed via abused…",
          "tone": "amber"
        },
        {
          "id": "krn-poortry-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Secret spoken handshake at the control…",
          "subtitle": "Cryptographic challenge-response DeviceIoControl handshake…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Card",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "Loading Custom Malicious Driver POORTRY Signed via Abused WHQL Account",
          "storyExcerpt": "The intruder street runner walks up to the building core checkpoint holding a purpose-built saboteur pass that carries an authentic official government wax seal obtained through a hijacked signing…",
          "technicalParallel": "Because poortry.sys was a brand-new custom binary rather than a known historical vulnerable driver, hash-based vulnerable driver blocklists did not block it until Microsoft revoked the underlying WHQL…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Room Door",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Authenticated IOCTL Handshake & Kernel Notify Callback Array Wiping",
          "storyExcerpt": "Inside the core control room, the saboteur refuses orders from anyone until the street runner completes a secret coded knock-and-reply exchange. Once verified, the saboteur snips every central…",
          "technicalParallel": "POORTRY also unlinked registry (CmUnRegisterCallback) and object (ObUnRegisterCallbacks) filter callbacks and removed minifilter filesystem callbacks registered by endpoint security sensors.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Wire",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "EPROCESS Protection Bit Stripping, EDR Termination & LSASS Credential Dump",
          "storyExcerpt": "Walking directly into the central staff ledger, the saboteur rubs out the armored-protection stamp next to every security guard and the master credential vault, stripping away their immunity so the…",
          "technicalParallel": "UNC3944 (Scattered Spider) and multiple ransomware affiliates used STONESTOP/POORTRY on high-value telecom, BPO, and financial servers to silence EDR telemetry prior to credential dumping and VMware ESXi…",
          "accentHex": "#F59E0B",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Badge Office",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Control Room",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Driver Pass",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "crowdstrike-poortry-burntcigar-byovd",
      "sectionKey": "step-1",
      "sceneKind": "krn-poortry-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "Loading Custom Malicious Driver POORTRY Signed via Abused WHQL Account",
      "storyCue": "The intruder street runner walks up to the building core checkpoint holding a purpose-built saboteur pass that carries an authentic official government wax seal obtained through a hijacked signing office, so the checkpoint doors swing wide open without raising an alarm.",
      "technicalCue": "T1553.002 · DEFENSE EVASION — The user-mode loader STONESTOP dropped poortry.sys (BURNTCIGAR) to disk and invoked NtLoadDriver.",
      "storyMappings": [
        {
          "storyTerm": "Intruder street runner",
          "technicalTerm": "STONESTOP user-mode loader invoking NtLoadDriver",
          "tone": "amber"
        },
        {
          "storyTerm": "Purpose-built saboteur pass",
          "technicalTerm": "Malicious kernel driver poortry.sys (BURNTCIGAR)",
          "tone": "sky"
        },
        {
          "storyTerm": "Authentic government wax seal from a hijacked office",
          "technicalTerm": "Fraudulently obtained Microsoft WHQL / Windows Hardware Dev Center attestation signature",
          "tone": "rose"
        },
        {
          "storyTerm": "Building core checkpoint",
          "technicalTerm": "Windows Driver Signature Enforcement (DSE) kernel load check",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-poortry-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Intruder street runner",
          "subtitle": "STONESTOP user-mode loader invoking NtLoadDriver",
          "tone": "amber"
        },
        {
          "id": "krn-poortry-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Purpose-built saboteur pass",
          "subtitle": "Malicious kernel driver poortry.sys (BURNTCIGAR)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Core",
          "stageTag": "STEP 01 · SETUP",
          "title": "Intruder street runner",
          "storyExcerpt": "The intruder street runner walks up to the building core checkpoint holding a purpose-built saboteur pass that carries an authentic official government wax seal obtained through a hijacked…",
          "technicalParallel": "Because poortry.sys was a brand-new custom binary rather than a known historical vulnerable driver, hash-based vulnerable driver blocklists did not block it until Microsoft revoked the underlying WHQL…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Pass",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Purpose-built saboteur pass",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses purpose-built saboteur pass to advance toward authentic government wax seal from a hijacked office.",
          "technicalParallel": "The user-mode loader STONESTOP dropped poortry.sys (BURNTCIGAR) to disk and invoked NtLoadDriver.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Wax Seal",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Building core checkpoint",
          "storyExcerpt": "Behind the scenes, building core checkpoint captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Sysmon EventID 6 driver loads from temp/user directories (C:\\Windows\\Temp\\, C:\\ProgramData\\) and enforcement of Microsoft ADV220005 / KB5020779 certificate revocations.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Badge Office",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Control Room",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Driver Pass",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1553.002"
    },
    "step-2": {
      "scenarioId": "crowdstrike-poortry-burntcigar-byovd",
      "sectionKey": "step-2",
      "sceneKind": "krn-poortry-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Authenticated IOCTL Handshake & Kernel Notify Callback Array Wiping",
      "storyCue": "Inside the core control room, the saboteur refuses orders from anyone until the street runner completes a secret coded knock-and-reply exchange. Once verified, the saboteur snips every central notification bell wire so the security office stops receiving alerts whenever new workers enter or inspect the building.",
      "technicalCue": "T1562.001 · DEFENSE EVASION — Before executing commands, POORTRY required STONESTOP to complete a cryptographic challenge-response handshake over DeviceIoControl (preventing security analysts or competing malware from…",
      "storyMappings": [
        {
          "storyTerm": "Secret coded knock-and-reply exchange",
          "technicalTerm": "Cryptographic challenge-response authentication over DeviceIoControl",
          "tone": "amber"
        },
        {
          "storyTerm": "Central notification bell wires",
          "technicalTerm": "Kernel callback arrays PspCreateProcessNotifyRoutine and ObRegisterCallbacks",
          "tone": "sky"
        },
        {
          "storyTerm": "Snipping the bell wires",
          "technicalTerm": "POORTRY overwriting EDR kernel callback pointers in Ring-0 memory",
          "tone": "rose"
        },
        {
          "storyTerm": "Blinded security office",
          "technicalTerm": "EDR sensors stripped of process creation and handle-access visibility",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-poortry-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Secret coded knock-and-reply exchange",
          "subtitle": "Cryptographic challenge-response authentication over…",
          "tone": "amber"
        },
        {
          "id": "krn-poortry-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Central notification bell wires",
          "subtitle": "Kernel callback arrays PspCreateProcessNotifyRoutine and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Core Room",
          "stageTag": "STEP 02 · SETUP",
          "title": "Secret coded knock-and-reply exchange",
          "storyExcerpt": "Inside the core control room, the saboteur refuses orders from anyone until the street runner completes a secret coded knock-and-reply exchange.",
          "technicalParallel": "POORTRY also unlinked registry (CmUnRegisterCallback) and object (ObUnRegisterCallbacks) filter callbacks and removed minifilter filesystem callbacks registered by endpoint security sensors.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Bell",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Central notification bell wires",
          "storyExcerpt": "Once verified, the saboteur snips every central notification bell wire so the security office stops receiving alerts whenever new workers enter or inspect the building.",
          "technicalParallel": "Before executing commands, POORTRY required STONESTOP to complete a cryptographic challenge-response handshake over DeviceIoControl (preventing security analysts or competing malware from invoking its…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Bell",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Blinded security office",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across blinded security office while locking down snipping the bell wires.",
          "technicalParallel": "Deploy EDR kernel callback integrity watchdogs (periodic kernel-level self-checks that verify sensor function pointers remain intact inside PspCreateProcessNotifyRoutine and ObRegisterCallbacks) and…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Badge Office",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Control Room",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Driver Pass",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1562.001"
    },
    "step-3": {
      "scenarioId": "crowdstrike-poortry-burntcigar-byovd",
      "sectionKey": "step-3",
      "sceneKind": "krn-poortry-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "EPROCESS Protection Bit Stripping, EDR Termination & LSASS Credential Dump",
      "storyCue": "Walking directly into the central staff ledger, the saboteur rubs out the armored-protection stamp next to every security guard and the master credential vault, stripping away their immunity so the street runner can dismiss every guard and empty the vault unopposed.",
      "technicalCue": "T1003.001 · CREDENTIAL ACCESS — POORTRY performed Direct Kernel Object Manipulation (DKOM) against the opaque EPROCESS kernel structures of both EDR processes and lsass.exe, zeroing out their _PS_PROTECTION (Protection…",
      "storyMappings": [
        {
          "storyTerm": "Central staff ledger",
          "technicalTerm": "Kernel opaque _EPROCESS structures tracking active Windows processes",
          "tone": "amber"
        },
        {
          "storyTerm": "Rubbing out the armored-protection stamp",
          "technicalTerm": "Direct Kernel Object Manipulation (DKOM) zeroing _PS_PROTECTION bits",
          "tone": "sky"
        },
        {
          "storyTerm": "Dismissed security guards",
          "technicalTerm": "Terminated EDR agent processes after PPL immunity removal",
          "tone": "rose"
        },
        {
          "storyTerm": "Emptied master credential vault",
          "technicalTerm": "Unprotected lsass.exe memory dumped for enterprise credentials",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-poortry-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Central staff ledger",
          "subtitle": "Kernel opaque _EPROCESS structures tracking active Windows…",
          "tone": "amber"
        },
        {
          "id": "krn-poortry-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Rubbing out the armored-protection stamp",
          "subtitle": "Direct Kernel Object Manipulation (DKOM) zeroing…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Rubs Out",
          "stageTag": "STEP 03 · SETUP",
          "title": "Central staff ledger",
          "storyExcerpt": "Walking directly into the central staff ledger, the saboteur rubs out the armored-protection stamp next to every security guard and the master credential vault, stripping away their immunity so…",
          "technicalParallel": "UNC3944 (Scattered Spider) and multiple ransomware affiliates used STONESTOP/POORTRY on high-value telecom, BPO, and financial servers to silence EDR telemetry prior to credential dumping and VMware ESXi…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Out",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Rubbing out the armored-protection stamp",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses rubbing out the armored-protection stamp to advance toward dismissed security guards.",
          "technicalParallel": "POORTRY performed Direct Kernel Object Manipulation (DKOM) against the opaque EPROCESS kernel structures of both EDR processes and lsass.exe, zeroing out their _PS_PROTECTION (Protection, SignatureLevel…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Rubs Out",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Emptied master credential vault",
          "storyExcerpt": "Behind the scenes, emptied master credential vault captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Enabling Windows Credential Guard (Virtualization-Based Security LsaIso.exe) so LSASS secrets reside in VTL1 hypervisor memory unreachable even from Ring-0 VTL0 kernel drivers.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Badge Office",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Control Room",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Driver Pass",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1003.001"
    }
  },
  "dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics": {
    "briefing": {
      "scenarioId": "dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics",
      "sectionKey": "briefing",
      "sceneKind": "krn-dfir-bpfdoor-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1036.004",
      "title": "Linux BPFDoor Raw Socket Filter, /dev/shm Masquerading &… — Story-to-Technical Overview",
      "storyCue": "Imagine a phantom eavesdropper inside a railway telegraph depot who moves into a temporary memory-only closet, shreds the paper entry receipt, puts on a station-cleaner badge, and clips an invisible wire sieve directly onto the main incoming telegraph cable so no open door appears on the depot map. During an emergency audit, a forensic inspector bypasses the front floor map completely, reads the raw cable-tap ledger, and uncovers both the invisible sieve and the brass locking pin keeping it alone.",
      "technicalCue": "DEFENSE EVASION: Memory-Backed /dev/shm Execution, Self-Deletion & /proc/<pid>/exe (deleted) Artifact -> LATERAL & C2: Raw Packet Socket Creation & Classic BPF Bytecode Attachment (SO_ATTACH_FILTER) -> CREDENTIAL ACCESS: Forensic Discovery via /proc/net/packet, ss -0pb & /var/run/haldrund.pid Mutex",
      "storyMappings": [
        {
          "storyTerm": "Temporary memory-only closet with a shredded receipt",
          "technicalTerm": "Self-unlinked /dev/shm/kdmtmpflush binary visible as /proc/<pid>/exe (deleted)",
          "tone": "amber"
        },
        {
          "storyTerm": "Invisible wire sieve clipped onto the main telegraph cable",
          "technicalTerm": "AF_PACKET raw socket with SO_ATTACH_FILTER classic BPF bytecode",
          "tone": "sky"
        },
        {
          "storyTerm": "Front floor map showing no open door",
          "technicalTerm": "netstat -tulnp showing zero listening TCP or UDP ports",
          "tone": "rose"
        },
        {
          "storyTerm": "Raw cable-tap ledger and brass locking pin",
          "technicalTerm": "/proc/net/packet, ss -0pb BPF dump, and /var/run/haldrund.pid mutex",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "krn-dfir-bpfdoor-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Temporary memory-only closet with a…",
          "subtitle": "Self-unlinked /dev/shm/kdmtmpflush binary visible as…",
          "tone": "amber"
        },
        {
          "id": "krn-dfir-bpfdoor-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Invisible wire sieve clipped onto the…",
          "subtitle": "AF_PACKET raw socket with SO_ATTACH_FILTER classic BPF bytecode",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Sign",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "Memory-Backed /dev/shm Execution, Self-Deletion & /proc/<pid>/exe (deleted) Artifact",
          "storyExcerpt": "At launch, the eavesdropper dashes into a memory-only storage closet, tears up the closet doorway sign so disk inventories find nothing, and alters its own staff nametag to resemble a harmless background…",
          "technicalParallel": "Under the hood, the observed step executes ls -la /proc/*/exe 2>/dev/null | grep \"(deleted)\" (which executes the technical command / telemetry directive , ls -la /proc/*/exe 2>/dev/null | grep \"…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Wire Onto",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "Raw Packet Socket Creation & Classic BPF Bytecode Attachment (SO_ATTACH_FILTER)",
          "storyExcerpt": "Instead of opening a numbered ticket window that every night watchman checks, the eavesdropper clamps a raw acoustic sieve straight onto the main telegraph line so every passing signal is inspected…",
          "technicalParallel": "Under the hood, the observed step executes auditd SYSCALL Record: syscall=41 (socket) a0=17 (AF_PACKET) a1=3 (SOCK_RAW) a2=300 (ETH_P_ALL/IP) (which executes the technical command / telemetry directive…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Map No",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "Forensic Discovery via /proc/net/packet, ss -0pb & /var/run/haldrund.pid Mutex",
          "storyExcerpt": "A seasoned forensic investigator skips the front ticket map altogether and reads the depot master cable-clamp registry directly, exposing the hidden sieve bytecode, tracing it to the unlinked closet…",
          "technicalParallel": "Under the hood, the observed step executes cat /proc/net/packet # Lists sk, Type=3 (SOCK_RAW), Proto=0800, Running=1, Inode=29418 (which executes the technical command / telemetry directive , cat…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Wire Sieve",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Telegraph Line",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Packet Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics",
      "sectionKey": "step-1",
      "sceneKind": "krn-dfir-bpfdoor-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "Memory-Backed /dev/shm Execution, Self-Deletion & /proc/<pid>/exe (deleted) Artifact",
      "storyCue": "At launch, the eavesdropper dashes into a memory-only storage closet, tears up the closet doorway sign so disk inventories find nothing, and alters its own staff nametag to resemble a harmless background maintenance utility.",
      "technicalCue": "T1036.004 · DEFENSE EVASION — Upon startup, the implant copies its binary into tmpfs shared memory (/dev/shm/kdmtmpflush), executes the copy with --init, overwrites its command-line argv[0] via prctl(PR_SET_NAME) to mimic a…",
      "storyMappings": [
        {
          "storyTerm": "Memory-only storage closet",
          "technicalTerm": "tmpfs shared memory execution path /dev/shm/kdmtmpflush",
          "tone": "amber"
        },
        {
          "storyTerm": "Tearing up the closet doorway sign",
          "technicalTerm": "Unlinking on-disk executable leaving /proc/<pid>/exe (deleted) forensic trace",
          "tone": "sky"
        },
        {
          "storyTerm": "Altering its own staff nametag",
          "technicalTerm": "Overwriting argv[0] and calling prctl(PR_SET_NAME) to masquerade as a daemon",
          "tone": "rose"
        },
        {
          "storyTerm": "Launching into background duty",
          "technicalTerm": "Self-re-execution with --init flag detaching from the parent terminal",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-dfir-bpfdoor-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Memory-only storage closet",
          "subtitle": "tmpfs shared memory execution path /dev/shm/kdmtmpflush",
          "tone": "amber"
        },
        {
          "id": "krn-dfir-bpfdoor-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Tearing up the closet doorway sign",
          "subtitle": "Unlinking on-disk executable leaving /proc/<pid>/exe (deleted)…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Sign",
          "stageTag": "STEP 01 · SETUP",
          "title": "Memory-only storage closet",
          "storyExcerpt": "At launch, the eavesdropper dashes into a memory-only storage closet, tears up the closet doorway sign so disk inventories find nothing, and alters its own staff nametag to resemble a harmless…",
          "technicalParallel": "Under the hood, the observed step executes ls -la /proc/*/exe 2>/dev/null | grep \"(deleted)\" (which executes the technical command / telemetry directive , ls -la /proc/*/exe 2>/dev/null | grep \"…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Up Sign",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Tearing up the closet doorway sign",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses tearing up the closet doorway sign to advance toward altering its own staff nametag.",
          "technicalParallel": "Upon startup, the implant copies its binary into tmpfs shared memory (/dev/shm/kdmtmpflush), executes the copy with --init, overwrites its command-line argv[0] via prctl(PR_SET_NAME) to mimic a kernel…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Duty",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Launching into background duty",
          "storyExcerpt": "Behind the scenes, launching into background duty captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording ProcessId=4819 , PPID 1 systemd, not PPID 2 kthreadd, SpoofedCommName=[kdmtmpflush], ProcExeSymlink=/dev/shm/kdmtmpflush , deleted, ZeroPortFootprint=No…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Wire Sieve",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Telegraph Line",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Packet Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1036.004"
    },
    "step-2": {
      "scenarioId": "dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics",
      "sectionKey": "step-2",
      "sceneKind": "krn-dfir-bpfdoor-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "Raw Packet Socket Creation & Classic BPF Bytecode Attachment (SO_ATTACH_FILTER)",
      "storyCue": "Instead of opening a numbered ticket window that every night watchman checks, the eavesdropper clamps a raw acoustic sieve straight onto the main telegraph line so every passing signal is inspected silently until a secret trigger code arrives.",
      "technicalCue": "T1205.002 · LATERAL & C2 — Rather than binding a TCP or UDP port that would appear in netstat -tulnp, the implant invokes socket(AF_PACKET, SOCK_RAW, htons, ETH_P_IP) and calls setsockopt(SOL_SOCKET, SO_ATTACH_FILTER) to…",
      "storyMappings": [
        {
          "storyTerm": "Numbered ticket window checked by watchmen",
          "technicalTerm": "Standard listening TCP/UDP socket listed by netstat -tulnp",
          "tone": "amber"
        },
        {
          "storyTerm": "Main telegraph line clamp",
          "technicalTerm": "socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP)) raw packet socket",
          "tone": "sky"
        },
        {
          "storyTerm": "Raw acoustic sieve",
          "technicalTerm": "Classic BPF bytecode filter attached via setsockopt(SOL_SOCKET, SO_ATTACH_FILTER)",
          "tone": "rose"
        },
        {
          "storyTerm": "Secret trigger code",
          "technicalTerm": "Magic packet sequence waking the passive implant on demand",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-dfir-bpfdoor-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Numbered ticket window checked by watchmen",
          "subtitle": "Standard listening TCP/UDP socket listed by netstat -tulnp",
          "tone": "amber"
        },
        {
          "id": "krn-dfir-bpfdoor-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Main telegraph line clamp",
          "subtitle": "socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP)) raw packet socket",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Raw Onto",
          "stageTag": "STEP 02 · SETUP",
          "title": "Numbered ticket window checked by watchmen",
          "storyExcerpt": "Instead of opening a numbered ticket window that every night watchman checks, the eavesdropper clamps a raw acoustic sieve straight onto the main telegraph line so every passing signal is…",
          "technicalParallel": "Under the hood, the observed step executes auditd SYSCALL Record: syscall=41 (socket) a0=17 (AF_PACKET) a1=3 (SOCK_RAW) a2=300 (ETH_P_ALL/IP) (which executes the technical command / telemetry directive…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Main Line",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Main telegraph line clamp",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses main telegraph line clamp to advance toward raw acoustic sieve.",
          "technicalParallel": "Rather than binding a TCP or UDP port that would appear in netstat -tulnp, the implant invokes socket(AF_PACKET, SOCK_RAW, htons, ETH_P_IP) and calls setsockopt(SOL_SOCKET, SO_ATTACH_FILTER) to load a…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Code",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Secret trigger code",
          "storyExcerpt": "Behind the scenes, secret trigger code captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 41 (recording Syscall=41 , sys_socket AF_PACKET=17, SOCK_RAW=3, SocketOption=setsockopt, SOL_SOCKET, SO_ATTACH_FILTER, BpfMagicSignatures=0x7255 , TCP/UDP / 0x5293 , ICMP…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Wire Sieve",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Telegraph Line",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Packet Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1205.002"
    },
    "step-3": {
      "scenarioId": "dfir-linux-ebpf-bpfdoor-raw-socket-magic-packet-forensics",
      "sectionKey": "step-3",
      "sceneKind": "krn-dfir-bpfdoor-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Forensic Discovery via /proc/net/packet, ss -0pb & /var/run/haldrund.pid Mutex",
      "storyCue": "A seasoned forensic investigator skips the front ticket map altogether and reads the depot master cable-clamp registry directly, exposing the hidden sieve bytecode, tracing it to the unlinked closet occupant, and spotting the single-occupancy brass lock pin left on the wall.",
      "technicalCue": "T1205.002 · CREDENTIAL ACCESS — During live Linux DFIR triage, the responder inspects /proc/net/packet (which lists all active AF_PACKET sockets in the kernel) and runs ss -0pb (which dumps packet sockets, owning PIDs, and…",
      "storyMappings": [
        {
          "storyTerm": "Depot master cable-clamp registry",
          "technicalTerm": "Kernel /proc/net/packet table listing all active AF_PACKET raw sockets",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposing the hidden sieve bytecode",
          "technicalTerm": "ss -0pb dumping attached BPF filter instructions and owning process PIDs",
          "tone": "sky"
        },
        {
          "storyTerm": "Single-occupancy brass lock pin",
          "technicalTerm": "Mutex PID file /var/run/haldrund.pid preventing duplicate implant instances",
          "tone": "rose"
        },
        {
          "storyTerm": "Unlinked closet occupant",
          "technicalTerm": "Running implant correlated via /proc/<pid>/exe pointing to deleted /dev/shm file",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-dfir-bpfdoor-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Depot master cable-clamp registry",
          "subtitle": "Kernel /proc/net/packet table listing all active AF_PACKET raw…",
          "tone": "amber"
        },
        {
          "id": "krn-dfir-bpfdoor-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Exposing the hidden sieve bytecode",
          "subtitle": "ss -0pb dumping attached BPF filter instructions and owning…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Map It",
          "stageTag": "STEP 03 · SETUP",
          "title": "Depot master cable-clamp registry",
          "storyExcerpt": "A seasoned forensic investigator skips the front ticket map altogether and reads the depot master cable-clamp registry directly, exposing the hidden sieve bytecode, tracing it to the unlinked…",
          "technicalParallel": "Under the hood, the observed step executes cat /proc/net/packet # Lists sk, Type=3 (SOCK_RAW), Proto=0800, Running=1, Inode=29418 (which executes the technical command / telemetry directive , cat…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Lock",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Exposing the hidden sieve bytecode",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses exposing the hidden sieve bytecode to advance toward single-occupancy brass lock pin.",
          "technicalParallel": "During live Linux DFIR triage, the responder inspects /proc/net/packet (which lists all active AF_PACKET sockets in the kernel) and runs ss -0pb (which dumps packet sockets, owning PIDs, and attached BPF…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Lock Pin",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Unlinked closet occupant",
          "storyExcerpt": "Behind the scenes, unlinked closet occupant captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 800 (recording KernelProcTable=/proc/net/packet , Proto=0800 Type=3 Inode=29418, SocketDiagnostic=ss -0pb , Dumps classic BPF opcodes and PID 4819…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Wire Sieve",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Telegraph Line",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Packet Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1205.002"
    }
  },
  "dfir-linux-ld-so-preload-userland-rootkit-proc-maps": {
    "briefing": {
      "scenarioId": "dfir-linux-ld-so-preload-userland-rootkit-proc-maps",
      "sectionKey": "briefing",
      "sceneKind": "krn-dfir-ldpreload-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1574.006",
      "title": "Linux /etc/ld.so.preload Userland Rootkit & /proc/1/maps Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine an invisible tailor sneaking into a factory dressing room and sewing a rigged lining into the universal work coat hanging on the entrance rack. Every factory inspector who slips on a standard coat automatically sees blurred lenses that hide the tailor hidden doorway, until a forensic auditor arrives with sealed, self-contained binoculars from outside the factory and reads the raw room occupancy ledger directly.",
      "technicalCue": "PERSISTENCE: Shared Library Compilation & /etc/ld.so.preload Registration (auditd nametype=CREATE) -> DEFENSE EVASION: Global Dynamic Linker Injection & Userland PLT/GOT Hooking of readdir64() and fopen() -> CREDENTIAL ACCESS: Forensic Detection via /proc/1/maps, /proc/self/map_files & Statically Linked Busybox",
      "storyMappings": [
        {
          "storyTerm": "Universal work coat hanging on the entrance rack",
          "technicalTerm": "System-wide dynamic linker file /etc/ld.so.preload",
          "tone": "amber"
        },
        {
          "storyTerm": "Rigged lining sewn into the coat",
          "technicalTerm": "Malicious shared library /usr/lib64/libudev-guardian.so",
          "tone": "sky"
        },
        {
          "storyTerm": "Blurred lenses hiding the tailor doorway",
          "technicalTerm": "Userland PLT/GOT hooks on readdir64() and fopen() hiding files and sockets",
          "tone": "rose"
        },
        {
          "storyTerm": "Sealed external binoculars reading the raw room ledger",
          "technicalTerm": "Statically linked busybox binary inspecting /proc/1/maps and /proc/self/map_files",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "krn-dfir-ldpreload-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Universal work coat hanging on the…",
          "subtitle": "System-wide dynamic linker file /etc/ld.so.preload",
          "tone": "amber"
        },
        {
          "id": "krn-dfir-ldpreload-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Rigged lining sewn into the coat",
          "subtitle": "Malicious shared library /usr/lib64/libudev-guardian.so",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Coat",
          "stageTag": "STAGE 01 · PERSISTENCE",
          "title": "Shared Library Compilation & /etc/ld.so.preload Registration (auditd nametype=CREATE)",
          "storyExcerpt": "Under cover of night, the tailor slips a custom rigged coat lining into the supply shelf and writes its tag number onto the mandatory entrance-rack sheet. Even though the front-desk tools will soon be…",
          "technicalParallel": "Under the hood, the observed step executes auditctl -w /etc/ld.so.preload -p wa -k ld_preload_hijack (which executes the technical command / telemetry directive , auditctl -w /etc/ld.so.preload -p wa -k…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Out Coat",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Global Dynamic Linker Injection & Userland PLT/GOT Hooking of readdir64() and fopen()",
          "storyExcerpt": "Every time a normal factory worker starts a routine floor check, the entrance dresser hands them the rigged coat first. Inside each worker goggles, the rigged lining intercepts every glance down the…",
          "technicalParallel": "Under the hood, the observed step executes Dynamic Linker Loader: /lib64/ld-linux-x86-64.so.2 parses /etc/ld.so.preload prior to libc.so.6 (which executes the technical command / telemetry directive…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Self-contained",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "Forensic Detection via /proc/1/maps, /proc/self/map_files & Statically Linked Busybox",
          "storyExcerpt": "Refusing to put on any factory coat at all, the forensic auditor walks in wearing completely self-contained outside gear and reads the raw hallway map posted inside the master guard station, immediately…",
          "technicalParallel": "Under the hood, the observed step executes while read line; do echo \"$line\"; done < /proc/self/maps # Pure bash builtin bypasses external binary hooks (which executes the technical command / telemetry…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Coat Rack",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Process Map",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Lining Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-linux-ld-so-preload-userland-rootkit-proc-maps",
      "sectionKey": "step-1",
      "sceneKind": "krn-dfir-ldpreload-step-1",
      "stageBadge": "STEP #1 · PERSISTENCE",
      "title": "Shared Library Compilation & /etc/ld.so.preload Registration (auditd nametype=CREATE)",
      "storyCue": "Under cover of night, the tailor slips a custom rigged coat lining into the supply shelf and writes its tag number onto the mandatory entrance-rack sheet. Even though the front-desk tools will soon be fooled, the tamper-proof security camera bolted above the rack records the exact moment the sheet is edited.",
      "technicalCue": "T1574.006 · PERSISTENCE — The actor places a malicious ELF shared object at /usr/lib64/libudev-guardian.so and writes its path into /etc/ld.so.preload.",
      "storyMappings": [
        {
          "storyTerm": "Custom rigged coat lining on the supply shelf",
          "technicalTerm": "Compiled ELF shared object placed at /usr/lib64/libudev-guardian.so",
          "tone": "amber"
        },
        {
          "storyTerm": "Mandatory entrance-rack sheet",
          "technicalTerm": "Path entry written into /etc/ld.so.preload",
          "tone": "sky"
        },
        {
          "storyTerm": "Tamper-proof camera bolted above the rack",
          "technicalTerm": "Kernel-level auditd syscall monitoring recording nametype=CREATE",
          "tone": "rose"
        },
        {
          "storyTerm": "Front-desk tools about to be fooled",
          "technicalTerm": "Standard dynamically linked Linux utilities (ps, ls, netstat, lsof)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-dfir-ldpreload-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Custom rigged coat lining on the supply…",
          "subtitle": "Compiled ELF shared object placed at…",
          "tone": "amber"
        },
        {
          "id": "krn-dfir-ldpreload-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Mandatory entrance-rack sheet",
          "subtitle": "Path entry written into /etc/ld.so.preload",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Coat",
          "stageTag": "STEP 01 · SETUP",
          "title": "Custom rigged coat lining on the supply shelf",
          "storyExcerpt": "Under cover of night, the tailor slips a custom rigged coat lining into the supply shelf and writes its tag number onto the mandatory entrance-rack sheet.",
          "technicalParallel": "Under the hood, the observed step executes auditctl -w /etc/ld.so.preload -p wa -k ld_preload_hijack (which executes the technical command / telemetry directive , auditctl -w /etc/ld.so.preload -p wa -k…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Even Will",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Mandatory entrance-rack sheet",
          "storyExcerpt": "Even though the front-desk tools will soon be fooled, the tamper-proof security camera bolted above the rack records the exact moment the sheet is edited.",
          "technicalParallel": "The actor places a malicious ELF shared object at /usr/lib64/libudev-guardian.so and writes its path into /etc/ld.so.preload.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Rack",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Front-desk tools about to be fooled",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across front-desk tools about to be fooled while locking down tamper-proof camera bolted above the rack.",
          "technicalParallel": "Documented in Linux Audit Event 257 (recording AuditKey=ld_preload_hijack, CreatedFile=/etc/ld.so.preload, PreloadedLibrary=/usr/lib64/libudev-guardian.so, MitreTechnique=T1574.006 , Dynamic Linker…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Coat Rack",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Process Map",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Lining Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1574.006"
    },
    "step-2": {
      "scenarioId": "dfir-linux-ld-so-preload-userland-rootkit-proc-maps",
      "sectionKey": "step-2",
      "sceneKind": "krn-dfir-ldpreload-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Global Dynamic Linker Injection & Userland PLT/GOT Hooking of readdir64() and fopen()",
      "storyCue": "Every time a normal factory worker starts a routine floor check, the entrance dresser hands them the rigged coat first. Inside each worker goggles, the rigged lining intercepts every glance down the aisles and every glance at the attendance clipboard, erasing the intruder files and connections before the worker eyes can read them.",
      "technicalCue": "T1014 · DEFENSE EVASION — On every subsequent execution of a dynamically linked binary (such as ps, ls, netstat, or lsof), /lib64/ld-linux-x86-64.so.2 reads /etc/ld.so.preload and maps libudev-guardian.so before…",
      "storyMappings": [
        {
          "storyTerm": "Entrance dresser handing out the rigged coat",
          "technicalTerm": "Dynamic linker /lib64/ld-linux-x86-64.so.2 loading /etc/ld.so.preload first",
          "tone": "amber"
        },
        {
          "storyTerm": "Intercepting every glance down the aisles",
          "technicalTerm": "PLT/GOT function hooking of libc readdir64() hiding directories and PIDs",
          "tone": "sky"
        },
        {
          "storyTerm": "Intercepting glances at the attendance clipboard",
          "technicalTerm": "Userland hooking of fopen() filtering /proc/net/tcp entries",
          "tone": "rose"
        },
        {
          "storyTerm": "Fooled routine floor checks",
          "technicalTerm": "Compromised output from dynamically linked ps, ls, netstat, and lsof",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-dfir-ldpreload-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Entrance dresser handing out the rigged…",
          "subtitle": "Dynamic linker /lib64/ld-linux-x86-64.so.2 loading…",
          "tone": "amber"
        },
        {
          "id": "krn-dfir-ldpreload-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Intercepting every glance down the aisles",
          "subtitle": "PLT/GOT function hooking of libc readdir64() hiding…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Out Coat",
          "stageTag": "STEP 02 · SETUP",
          "title": "Entrance dresser handing out the rigged coat",
          "storyExcerpt": "Every time a normal factory worker starts a routine floor check, the entrance dresser hands them the rigged coat first.",
          "technicalParallel": "Under the hood, the observed step executes Dynamic Linker Loader: /lib64/ld-linux-x86-64.so.2 parses /etc/ld.so.preload prior to libc.so.6 (which executes the technical command / telemetry directive…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Down",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Intercepting every glance down the aisles",
          "storyExcerpt": "Inside each worker goggles, the rigged lining intercepts every glance down the aisles and every glance at the attendance clipboard, erasing the intruder files and connections before the worker…",
          "technicalParallel": "On every subsequent execution of a dynamically linked binary (such as ps, ls, netstat, or lsof), /lib64/ld-linux-x86-64.so.2 reads /etc/ld.so.preload and maps libudev-guardian.so before libc.so.6.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Fooled routine floor checks",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across fooled routine floor checks while locking down intercepting glances at the attendance clipboard.",
          "technicalParallel": "Documented in Linux Audit Event 9 (recording DynamicLinker=/lib64/ld-linux-x86-64.so.2, InjectedIntoProcess=/usr/bin/ps, /usr/bin/ls, /usr/bin/ss, HookMechanism=dlsym, RTLD_NEXT overriding libc…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Coat Rack",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Process Map",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Lining Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1014"
    },
    "step-3": {
      "scenarioId": "dfir-linux-ld-so-preload-userland-rootkit-proc-maps",
      "sectionKey": "step-3",
      "sceneKind": "krn-dfir-ldpreload-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Forensic Detection via /proc/1/maps, /proc/self/map_files & Statically Linked Busybox",
      "storyCue": "Refusing to put on any factory coat at all, the forensic auditor walks in wearing completely self-contained outside gear and reads the raw hallway map posted inside the master guard station, immediately spotting the foreign rigged lining wrapped around every single worker in the building.",
      "technicalCue": "T1574.006 · CREDENTIAL ACCESS — During DFIR triage, the analyst bypasses userland libc hooks by inspecting /proc/1/maps (or /proc/self/maps via a shell builtin read loop) and running a statically linked busybox binary (which…",
      "storyMappings": [
        {
          "storyTerm": "Self-contained outside gear skipping the coat rack",
          "technicalTerm": "Statically linked busybox binary immune to /etc/ld.so.preload injection",
          "tone": "amber"
        },
        {
          "storyTerm": "Raw hallway map inside the master guard station",
          "technicalTerm": "Kernel-generated /proc/1/maps and /proc/self/map_files memory mappings",
          "tone": "sky"
        },
        {
          "storyTerm": "Direct inspection without intermediary glasses",
          "technicalTerm": "Shell builtin read loop bypassing hooked userland libc file wrappers",
          "tone": "rose"
        },
        {
          "storyTerm": "Foreign lining wrapped around every worker",
          "technicalTerm": "Exposed /usr/lib64/libudev-guardian.so mapping across PID 1 and child processes",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-dfir-ldpreload-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Self-contained outside gear skipping the…",
          "subtitle": "Statically linked busybox binary immune to /etc/ld.so.preload…",
          "tone": "amber"
        },
        {
          "id": "krn-dfir-ldpreload-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Raw hallway map inside the master guard…",
          "subtitle": "Kernel-generated /proc/1/maps and /proc/self/map_files memory…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Self-contained",
          "stageTag": "STEP 03 · SETUP",
          "title": "Self-contained outside gear skipping the coat rack",
          "storyExcerpt": "Refusing to put on any factory coat at all, the forensic auditor walks in wearing completely self-contained outside gear and reads the raw hallway map posted inside the master guard station…",
          "technicalParallel": "Under the hood, the observed step executes while read line; do echo \"$line\"; done < /proc/self/maps # Pure bash builtin bypasses external binary hooks (which executes the technical command / telemetry…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Raw Map",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Raw hallway map inside the master guard station",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses raw hallway map inside the master guard station to advance toward direct inspection without intermediary glasses.",
          "technicalParallel": "During DFIR triage, the analyst bypasses userland libc hooks by inspecting /proc/1/maps (or /proc/self/maps via a shell builtin read loop) and running a statically linked busybox binary (which does not…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Put Any",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Foreign lining wrapped around every worker",
          "storyExcerpt": "Behind the scenes, foreign lining wrapped around every worker captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 918 (recording ForensicSource=/proc/1/maps & /proc/self/maps, UnownedSharedObject=/usr/lib64/libudev-guardian.so , RPM Unowned, VerificationTool=Statically linked busybox…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Coat Rack",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Process Map",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Lining Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1574.006"
    }
  },
  "dfir-volatility3-malfind-vad-hollowing-kernel-callbacks": {
    "briefing": {
      "scenarioId": "dfir-volatility3-malfind-vad-hollowing-kernel-callbacks",
      "sectionKey": "briefing",
      "sceneKind": "krn-dfir-vol3-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1055",
      "title": "Volatility 3 windows.malfind, psscan vs pslist & Kernel Callbacks Memory… — Story-to-Technical Overview",
      "storyCue": "Imagine a forensic detective freezing a busy courthouse in mid-motion to perform three surgical checks on the frozen rooms. First, the detective checks the floor-seating ledger for armed strangers sitting in unbacked private booths disguised in clerk robes; second, the detective compares the official front-desk attendance list against a physical walk through every hallway to catch a hidden worker who erased their own name; third, the detective inspects the master courthouse bell-pull board to spot silent security bells that were tampered with or replaced.",
      "technicalCue": "DEFENSE EVASION: Volatility 3 windows.malfind & windows.vadinfo — Unbacked PAGE_EXECUTE_READWRITE VAD Detection -> DEFENSE EVASION: Direct Kernel Object Manipulation (DKOM) Detection — windows.pslist vs windows.psscan -> DEFENSE EVASION: Kernel Notification Callback & Driver Inspection (windows.callbacks & windows.driverscan)",
      "storyMappings": [
        {
          "storyTerm": "Freezing the courthouse in mid-motion",
          "technicalTerm": "Raw physical RAM acquisition (memdump.raw) analyzed with Volatility 3",
          "tone": "amber"
        },
        {
          "storyTerm": "Armed strangers in unbacked private booths wearing clerk robes",
          "technicalTerm": "windows.malfind flagging unbacked PAGE_EXECUTE_READWRITE VADs in svchost.exe",
          "tone": "sky"
        },
        {
          "storyTerm": "Front-desk attendance list versus physical hallway headcount",
          "technicalTerm": "windows.pslist (linked list) compared against windows.psscan (pool scan) detecting DKOM",
          "tone": "rose"
        },
        {
          "storyTerm": "Master courthouse bell-pull board",
          "technicalTerm": "windows.callbacks and windows.driverscan inspecting PspCreateProcessNotifyRoutine",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#FACC15",
      "durationSec": 18,
      "callouts": [
        {
          "id": "krn-dfir-vol3-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Freezing the courthouse in mid-motion",
          "subtitle": "Raw physical RAM acquisition (memdump.raw) analyzed with…",
          "tone": "amber"
        },
        {
          "id": "krn-dfir-vol3-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Armed strangers in unbacked private…",
          "subtitle": "windows.malfind flagging unbacked PAGE_EXECUTE_READWRITE VADs…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room-assignment",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "Volatility 3 windows.malfind & windows.vadinfo — Unbacked PAGE_EXECUTE_READWRITE VAD Detection",
          "storyExcerpt": "Walking through the courthouse room-assignment trees, the detective spotlights a private booth inside a trusted clerk office that has both writing and execution permissions turned on yet matches no…",
          "technicalParallel": "Under the hood, the observed step executes vol.py -f memdump.raw windows.malfind --pid 2480 --dump (which Runs the Volatility 3 memory forensics analyzer against a captured physical RAM image…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Next One",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Direct Kernel Object Manipulation (DKOM) Detection — windows.pslist vs windows.psscan",
          "storyExcerpt": "Next, the detective holds the official front-desk employee chain in one hand while physically sweeping every office chair in the building with the other. One rogue loader erased its own link from the…",
          "technicalParallel": "Under the hood, the observed step executes vol.py -f memdump.raw windows.pslist # Walks Nt!PsActiveProcessHead doubly-linked list (which Runs the Volatility 3 memory forensics analyzer against a captured…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Bell-pull",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Kernel Notification Callback & Driver Inspection (windows.callbacks & windows.driverscan)",
          "storyExcerpt": "Finally, the detective opens the wooden panel behind the courthouse master bell-pull board and traces every wire back to its owner, verifying whether any rogue driver snipped the security alarm bells or…",
          "technicalParallel": "Under the hood, the observed step executes vol.py -f memdump.raw windows.callbacks (which Runs the Volatility 3 memory forensics analyzer against a captured physical RAM image , memory.dmp to walk kernel…",
          "accentHex": "#FACC15",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Memory Dump",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Callback Wall",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Sweep",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-volatility3-malfind-vad-hollowing-kernel-callbacks",
      "sectionKey": "step-1",
      "sceneKind": "krn-dfir-vol3-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "Volatility 3 windows.malfind & windows.vadinfo, Unbacked PAGE_EXECUTE_READWRITE VAD Detection",
      "storyCue": "Walking through the courthouse room-assignment trees, the detective spotlights a private booth inside a trusted clerk office that has both writing and execution permissions turned on yet matches no official blueprint file on the shelf, revealing an executable payload hiding directly inside live workspace memory.",
      "technicalCue": "T1055 · DEFENSE EVASION — Running vol -f memdump.raw windows.malfind walks the kernel MMVAD (_MMVAD_SHORT / _MMVAD) balanced tree for every process.",
      "storyMappings": [
        {
          "storyTerm": "Room-assignment trees",
          "technicalTerm": "Kernel _MMVAD_SHORT / _MMVAD Virtual Address Descriptor balanced trees",
          "tone": "amber"
        },
        {
          "storyTerm": "Trusted clerk office",
          "technicalTerm": "Target host process svchost.exe (PID 2480)",
          "tone": "sky"
        },
        {
          "storyTerm": "Private booth with no blueprint file on the shelf",
          "technicalTerm": "Unbacked private PAGE_EXECUTE_READWRITE (RWX) memory region flagged by windows.malfind",
          "tone": "rose"
        },
        {
          "storyTerm": "Executable payload hiding inside live workspace",
          "technicalTerm": "In-memory MZ/PE header or shellcode recovered via windows.vadinfo and malfind",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-dfir-vol3-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Room-assignment trees",
          "subtitle": "Kernel _MMVAD_SHORT / _MMVAD Virtual Address Descriptor…",
          "tone": "amber"
        },
        {
          "id": "krn-dfir-vol3-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Trusted clerk office",
          "subtitle": "Target host process svchost.exe (PID 2480)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room-assignment",
          "stageTag": "STEP 01 · SETUP",
          "title": "Room-assignment trees",
          "storyExcerpt": "Walking through the courthouse room-assignment trees, the detective spotlights a private booth inside a trusted clerk office that has both writing and execution permissions turned on yet…",
          "technicalParallel": "Under the hood, the observed step executes vol.py -f memdump.raw windows.malfind --pid 2480 --dump (which Runs the Volatility 3 memory forensics analyzer against a captured physical RAM image…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses No",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Trusted clerk office",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses trusted clerk office to advance toward private booth with no blueprint file on the shelf.",
          "technicalParallel": "Running vol -f memdump.raw windows.malfind walks the kernel MMVAD (_MMVAD_SHORT / _MMVAD) balanced tree for every process.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. No File",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Executable payload hiding inside live workspace",
          "storyExcerpt": "Behind the scenes, executable payload hiding inside live workspace captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Memory Scan Event 64 (recording VolatilityPlugin=windows.malfind + windows.ldrmodules, TargetProcess=svchost.exe , PID 2480, VadTagAndProtection=VadS | PrivateMemory=1 |…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Memory Dump",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Callback Wall",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Sweep",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1055"
    },
    "step-2": {
      "scenarioId": "dfir-volatility3-malfind-vad-hollowing-kernel-callbacks",
      "sectionKey": "step-2",
      "sceneKind": "krn-dfir-vol3-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Direct Kernel Object Manipulation (DKOM) Detection, windows.pslist vs windows.psscan",
      "storyCue": "Next, the detective holds the official front-desk employee chain in one hand while physically sweeping every office chair in the building with the other. One rogue loader erased its own link from the front-desk chain so ordinary roll calls skip straight past it, yet the physical chair sweep catches it sitting in plain sight.",
      "technicalCue": "T1014 · DEFENSE EVASION — To hide a user-mode loader (kworker_win.exe, PID 5912) from Task Manager and Get-Process, a kernel driver unlinks its _EPROCESS structure from the doubly linked Nt!PsActiveProcessHead…",
      "storyMappings": [
        {
          "storyTerm": "Official front-desk employee chain",
          "technicalTerm": "Doubly linked Nt!PsActiveProcessHead list walked by windows.pslist and Task Manager",
          "tone": "amber"
        },
        {
          "storyTerm": "Erasing its own link from the chain",
          "technicalTerm": "Direct Kernel Object Manipulation (DKOM) unlinking _EPROCESS of kworker_win.exe (PID 5912)",
          "tone": "sky"
        },
        {
          "storyTerm": "Physical sweep of every office chair",
          "technicalTerm": "Pool-tag memory carving via windows.psscan locating unlinked _EPROCESS blocks",
          "tone": "rose"
        },
        {
          "storyTerm": "Hidden worker caught sitting in plain sight",
          "technicalTerm": "Process present in psscan output while absent from pslist output",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-dfir-vol3-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Official front-desk employee chain",
          "subtitle": "Doubly linked Nt!PsActiveProcessHead list walked by…",
          "tone": "amber"
        },
        {
          "id": "krn-dfir-vol3-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Erasing its own link from the chain",
          "subtitle": "Direct Kernel Object Manipulation (DKOM) unlinking _EPROCESS…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Next One",
          "stageTag": "STEP 02 · SETUP",
          "title": "Official front-desk employee chain",
          "storyExcerpt": "Next, the detective holds the official front-desk employee chain in one hand while physically sweeping every office chair in the building with the other.",
          "technicalParallel": "Under the hood, the observed step executes vol.py -f memdump.raw windows.pslist # Walks Nt!PsActiveProcessHead doubly-linked list (which Runs the Volatility 3 memory forensics analyzer against a captured…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Own Link",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Erasing its own link from the chain",
          "storyExcerpt": "One rogue loader erased its own link from the front-desk chain so ordinary roll calls skip straight past it, yet the physical chair sweep catches it sitting in plain sight.",
          "technicalParallel": "To hide a user-mode loader (kworker_win.exe, PID 5912) from Task Manager and Get-Process, a kernel driver unlinks its _EPROCESS structure from the doubly linked Nt!PsActiveProcessHead…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Hidden worker caught sitting in plain sight",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across hidden worker caught sitting in plain sight while locking down physical sweep of every office chair.",
          "technicalParallel": "Documented in Memory Scan Event 5912 (recording VolatilityPlugin=windows.psscan vs windows.pslist Cross-View Diff, HiddenProcess=kworker_win.exe , PID 5912, Active Threads=4, ExitTime=N/A…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Memory Dump",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Callback Wall",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Sweep",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1014"
    },
    "step-3": {
      "scenarioId": "dfir-volatility3-malfind-vad-hollowing-kernel-callbacks",
      "sectionKey": "step-3",
      "sceneKind": "krn-dfir-vol3-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Kernel Notification Callback & Driver Inspection (windows.callbacks & windows.driverscan)",
      "storyCue": "Finally, the detective opens the wooden panel behind the courthouse master bell-pull board and traces every wire back to its owner, verifying whether any rogue driver snipped the security alarm bells or wired its own silent bell onto the courthouse nervous system.",
      "technicalCue": "T1562.001 · DEFENSE EVASION — Running vol -f memdump.raw windows.callbacks and windows.driverscan enumerates kernel PspCreateProcessNotifyRoutine, PspCreateThreadNotifyRoutine, and ObRegisterCallbacks arrays, identifying an…",
      "storyMappings": [
        {
          "storyTerm": "Courthouse master bell-pull board",
          "technicalTerm": "Kernel arrays PspCreateProcessNotifyRoutine, PspCreateThreadNotifyRoutine, and ObRegisterCallbacks",
          "tone": "amber"
        },
        {
          "storyTerm": "Tracing every wire back to its owner",
          "technicalTerm": "Volatility 3 windows.callbacks correlating callback addresses to loaded drivers",
          "tone": "sky"
        },
        {
          "storyTerm": "Auditing every badge holder in the engine room",
          "technicalTerm": "windows.driverscan enumerating all Ring-0 driver objects in RAM",
          "tone": "rose"
        },
        {
          "storyTerm": "Rogue driver tampering with security bells",
          "technicalTerm": "Unauthorized or unbacked kernel driver hooking or wiping EDR callbacks",
          "tone": "emerald"
        }
      ],
      "accentHex": "#FACC15",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-dfir-vol3-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Courthouse master bell-pull board",
          "subtitle": "Kernel arrays PspCreateProcessNotifyRoutine…",
          "tone": "amber"
        },
        {
          "id": "krn-dfir-vol3-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Tracing every wire back to its owner",
          "subtitle": "Volatility 3 windows.callbacks correlating callback addresses…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Bell-pull",
          "stageTag": "STEP 03 · SETUP",
          "title": "Courthouse master bell-pull board",
          "storyExcerpt": "Finally, the detective opens the wooden panel behind the courthouse master bell-pull board and traces every wire back to its owner, verifying whether any rogue driver snipped the security alarm…",
          "technicalParallel": "Under the hood, the observed step executes vol.py -f memdump.raw windows.callbacks (which Runs the Volatility 3 memory forensics analyzer against a captured physical RAM image , memory.dmp to walk kernel…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Wire Back",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Tracing every wire back to its owner",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses tracing every wire back to its owner to advance toward auditing every badge holder in the engine room.",
          "technicalParallel": "Running vol -f memdump.raw windows.callbacks and windows.driverscan enumerates kernel PspCreateProcessNotifyRoutine, PspCreateThreadNotifyRoutine, and ObRegisterCallbacks arrays, identifying an unknown…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Room",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Rogue driver tampering with security bells",
          "storyExcerpt": "Behind the scenes, rogue driver tampering with security bells captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Memory Scan Event 300 (recording VolatilityPlugin=windows.callbacks + windows.driverscan, KernelArray=Nt!PspCreateProcessNotifyRoutine, CallbackPointer=0xfffff8046b912400 , Module=UNKNOWN…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Memory Dump",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Callback Wall",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Sweep",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1562.001"
    }
  },
  "genshin-mhyprot2-ransomware-byovd": {
    "briefing": {
      "scenarioId": "genshin-mhyprot2-ransomware-byovd",
      "sectionKey": "briefing",
      "sceneKind": "krn-mhyprot2-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1068",
      "title": "Genshin Impact Anti-Cheat Driver (mhyprot2.sys) Ransomware BYOVD… — Story-to-Technical Overview",
      "storyCue": "Imagine a ransomware crew walking into an enterprise bank headquarters wearing an officially stamped security guard badge lifted straight from a popular video-game arcade. Because the bank front gate still trusts that arcade seal, the badge unlocks a direct hallway to the building master control switch; after speaking a scrambled sequence to initialize the switch, the crew shuts down every real bank guard and locks every vault.",
      "technicalCue": "DEFENSE EVASION: Dropping Standalone Signed mhyprot2.sys on Enterprise Domain Controller -> DEFENSE EVASION: Opening \\\\.\\mhyprot2 & Initializing MT19937-64 Encryption Seed (IOCTL 0x80034000) -> DEFENSE EVASION: Ring-0 ZwTerminateProcess Massacre via IOCTL 0x81034000 & Mass Encryption",
      "storyMappings": [
        {
          "storyTerm": "Officially stamped guard badge from a video-game arcade",
          "technicalTerm": "Signed Genshin Impact anti-cheat kernel driver mhyprot2.sys (CVE-2020-36603)",
          "tone": "amber"
        },
        {
          "storyTerm": "Bank headquarters accepting the arcade badge",
          "technicalTerm": "Windows Domain Controller loading standalone C:\\Users\\Public\\mhyprot2.sys",
          "tone": "sky"
        },
        {
          "storyTerm": "Speaking a scrambled sequence at the control window",
          "technicalTerm": "IOCTL 0x80034000 seeding the driver 64-bit Mersenne Twister (MT19937-64) cipher",
          "tone": "rose"
        },
        {
          "storyTerm": "Shutting down every real bank guard before locking the vaults",
          "technicalTerm": "XOR-encoded IOCTL 0x81034000 Ring-0 ZwTerminateProcess loop killing AV/EDR agents",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "krn-mhyprot2-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Officially stamped guard badge from a…",
          "subtitle": "Signed Genshin Impact anti-cheat kernel driver mhyprot2.sys…",
          "tone": "amber"
        },
        {
          "id": "krn-mhyprot2-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Bank headquarters accepting the arcade…",
          "subtitle": "Windows Domain Controller loading standalone…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Anti-cheat",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "Dropping Standalone Signed mhyprot2.sys on Enterprise Domain Controller",
          "storyExcerpt": "After sneaking into the bank central headquarters with stolen supervisor keys, the intruder drops an authentic, validly stamped arcade anti-cheat guard badge onto a public hallway table and registers it…",
          "technicalParallel": "Consumer anti-cheat drivers are engineered with sweeping Ring-0 process and memory inspection capabilities to catch game cheats, making them prime targets for standalone BYOVD weaponization on enterprise…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Back",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Opening \\\\.\\mhyprot2 & Initializing MT19937-64 Encryption Seed (IOCTL 0x80034000)",
          "storyExcerpt": "The intruder steps up to the arcade driver back window and feeds it a 24-byte starting cipher dial so both sides agree on a shared scrambling pattern, unlocking the driver hidden command panel without…",
          "technicalParallel": "Because researchers had previously reverse-engineered mhyprot2.sys’s MT19937-64 key derivation and published open-source PoCs on GitHub (evil-mhyprot-cli), ransomware developers copied the exact…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. One Core",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Ring-0 ZwTerminateProcess Massacre via IOCTL 0x81034000 & Mass Encryption",
          "storyExcerpt": "Sending scrambled guard badge numbers through the unlocked window one after another, the intruder commands the building core itself to evict every active security officer on the floor, clearing the way…",
          "technicalParallel": "mhyprot2.sys also exposes IOCTL 0x81054000 and 0x81064000 for arbitrary kernel/process memory reads (MmCopyVirtualMemory), giving attackers both an EDR killer and a kernel memory reader in a single…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Arcade Badge",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Bank Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Ring-0 Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "genshin-mhyprot2-ransomware-byovd",
      "sectionKey": "step-1",
      "sceneKind": "krn-mhyprot2-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "Dropping Standalone Signed mhyprot2.sys on Enterprise Domain Controller",
      "storyCue": "After sneaking into the bank central headquarters with stolen supervisor keys, the intruder drops an authentic, validly stamped arcade anti-cheat guard badge onto a public hallway table and registers it with the building core, even though no game machine exists anywhere in the bank.",
      "technicalCue": "T1068 · DEFENSE EVASION — After compromising a server via RDP or stolen domain credentials, the ransomware operator dropped C:\\Users\\Public\\mhyprot2.sys (a 350KB 64-bit Windows kernel driver validly signed by miHoYo…",
      "storyMappings": [
        {
          "storyTerm": "Authentic arcade anti-cheat guard badge",
          "technicalTerm": "Standalone 350KB Microsoft-signed mhyprot2.sys kernel driver",
          "tone": "amber"
        },
        {
          "storyTerm": "Public hallway table",
          "technicalTerm": "Staging path C:\\Users\\Public\\mhyprot2.sys on an enterprise server",
          "tone": "sky"
        },
        {
          "storyTerm": "Bank central headquarters",
          "technicalTerm": "Compromised Windows Domain Controller or enterprise server",
          "tone": "rose"
        },
        {
          "storyTerm": "Registering it with the building core",
          "technicalTerm": "Loading mhyprot2.sys as a Ring-0 service without any Genshin Impact game installed",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-mhyprot2-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Authentic arcade anti-cheat guard badge",
          "subtitle": "Standalone 350KB Microsoft-signed mhyprot2.sys kernel driver",
          "tone": "amber"
        },
        {
          "id": "krn-mhyprot2-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Public hallway table",
          "subtitle": "Staging path C:\\Users\\Public\\mhyprot2.sys on an enterprise…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Anti-cheat",
          "stageTag": "STEP 01 · SETUP",
          "title": "Authentic arcade anti-cheat guard badge",
          "storyExcerpt": "After sneaking into the bank central headquarters with stolen supervisor keys, the intruder drops an authentic, validly stamped arcade anti-cheat guard badge onto a public hallway table and…",
          "technicalParallel": "Consumer anti-cheat drivers are engineered with sweeping Ring-0 process and memory inspection capabilities to catch game cheats, making them prime targets for standalone BYOVD weaponization on enterprise…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Bank",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Public hallway table",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses public hallway table to advance toward bank central headquarters.",
          "technicalParallel": "After compromising a server via RDP or stolen domain credentials, the ransomware operator dropped C:\\Users\\Public\\mhyprot2.sys (a 350KB 64-bit Windows kernel driver validly signed by miHoYo Co., Ltd. and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Bank",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Registering it with the building core",
          "storyExcerpt": "Behind the scenes, registering it with the building core captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Sysmon EventID 6 (DriverLoaded) alerting whenever mhyprot2.sys (or any driver signed by miHoYo Co., Ltd.) is loaded on an enterprise workstation or server.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Arcade Badge",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Bank Vault",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Ring-0 Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1068"
    },
    "step-2": {
      "scenarioId": "genshin-mhyprot2-ransomware-byovd",
      "sectionKey": "step-2",
      "sceneKind": "krn-mhyprot2-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Opening \\\\.\\mhyprot2 & Initializing MT19937-64 Encryption Seed (IOCTL 0x80034000)",
      "storyCue": "The intruder steps up to the arcade driver back window and feeds it a 24-byte starting cipher dial so both sides agree on a shared scrambling pattern, unlocking the driver hidden command panel without needing the real arcade machine.",
      "technicalCue": "T1027 · DEFENSE EVASION — kill_svc.exe opened a handle to \\\\.\\mhyprot2 and issued DeviceIoControl with IOCTL 0x80034000 (passing a 24-byte initialization structure that seeds the driver’s internal 64-bit Mersenne…",
      "storyMappings": [
        {
          "storyTerm": "Arcade driver back window",
          "technicalTerm": "Device handle opened to \\\\.\\mhyprot2 by kill_svc.exe",
          "tone": "amber"
        },
        {
          "storyTerm": "24-byte starting cipher dial",
          "technicalTerm": "Initialization structure sent via DeviceIoControl IOCTL 0x80034000",
          "tone": "sky"
        },
        {
          "storyTerm": "Shared scrambling pattern",
          "technicalTerm": "Internal 64-bit Mersenne Twister (MT19937-64) encryption key stream",
          "tone": "rose"
        },
        {
          "storyTerm": "Hidden command panel unlocked",
          "technicalTerm": "Authenticated kernel command channel ready for process-termination requests",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-mhyprot2-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Arcade driver back window",
          "subtitle": "Device handle opened to \\\\.\\mhyprot2 by kill_svc.exe",
          "tone": "amber"
        },
        {
          "id": "krn-mhyprot2-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "24-byte starting cipher dial",
          "subtitle": "Initialization structure sent via DeviceIoControl IOCTL…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Back",
          "stageTag": "STEP 02 · SETUP",
          "title": "Arcade driver back window",
          "storyExcerpt": "The intruder steps up to the arcade driver back window and feeds it a 24-byte starting cipher dial so both sides agree on a shared scrambling pattern, unlocking the driver hidden command panel…",
          "technicalParallel": "Because researchers had previously reverse-engineered mhyprot2.sys’s MT19937-64 key derivation and published open-source PoCs on GitHub (evil-mhyprot-cli), ransomware developers copied the exact…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. 24-byte Dial",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "24-byte starting cipher dial",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses 24-byte starting cipher dial to advance toward shared scrambling pattern.",
          "technicalParallel": "kill_svc.exe opened a handle to \\\\.\\mhyprot2 and issued DeviceIoControl with IOCTL 0x80034000 (passing a 24-byte initialization structure that seeds the driver’s internal 64-bit Mersenne Twister…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Up Back",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Hidden command panel unlocked",
          "storyExcerpt": "Behind the scenes, hidden command panel unlocked captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Monitor CreateFileW handle requests targeting \\Device\\mhyprot2 alongside behavioral EDR rules flagging the 0x80034000 followed by 0x81034000 IOCTL sequence (pinpointing active CVE-2020-36603 driver…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Arcade Badge",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Bank Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Ring-0 Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1027"
    },
    "step-3": {
      "scenarioId": "genshin-mhyprot2-ransomware-byovd",
      "sectionKey": "step-3",
      "sceneKind": "krn-mhyprot2-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Ring-0 ZwTerminateProcess Massacre via IOCTL 0x81034000 & Mass Encryption",
      "storyCue": "Sending scrambled guard badge numbers through the unlocked window one after another, the intruder commands the building core itself to evict every active security officer on the floor, clearing the way to slam padlocks across every file cabinet in the bank.",
      "technicalCue": "T1562.001 · DEFENSE EVASION — Once the 0x80034000 handshake succeeded, kill_svc.exe enumerated running endpoint security processes (Ntrtscan.exe, TmCCSF.exe, uiWatchDog.exe, MsMpEng.exe), XOR-encrypted each target Process…",
      "storyMappings": [
        {
          "storyTerm": "Scrambled guard badge numbers",
          "technicalTerm": "XOR-encrypted target security PIDs submitted via IOCTL 0x81034000",
          "tone": "amber"
        },
        {
          "storyTerm": "Building core evicting every security officer",
          "technicalTerm": "Ring-0 ZwTerminateProcess killing Ntrtscan.exe, TmCCSF.exe, uiWatchDog.exe, and MsMpEng.exe",
          "tone": "sky"
        },
        {
          "storyTerm": "Slamming padlocks across every file cabinet",
          "technicalTerm": "Uncontested ransomware mass encryption across the blinded enterprise host",
          "tone": "rose"
        },
        {
          "storyTerm": "Intruder dispatcher sending the hit list",
          "technicalTerm": "kill_svc.exe enumerating and feeding endpoint protection PIDs to mhyprot2.sys",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-mhyprot2-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Scrambled guard badge numbers",
          "subtitle": "XOR-encrypted target security PIDs submitted via IOCTL…",
          "tone": "amber"
        },
        {
          "id": "krn-mhyprot2-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Building core evicting every security…",
          "subtitle": "Ring-0 ZwTerminateProcess killing Ntrtscan.exe, TmCCSF.exe…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. One Core",
          "stageTag": "STEP 03 · SETUP",
          "title": "Scrambled guard badge numbers",
          "storyExcerpt": "Sending scrambled guard badge numbers through the unlocked window one after another, the intruder commands the building core itself to evict every active security officer on the floor, clearing…",
          "technicalParallel": "mhyprot2.sys also exposes IOCTL 0x81054000 and 0x81064000 for arbitrary kernel/process memory reads (MmCopyVirtualMemory), giving attackers both an EDR killer and a kernel memory reader in a single…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Core",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Building core evicting every security officer",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses building core evicting every security officer to advance toward slamming padlocks across every file cabinet.",
          "technicalParallel": "Once the 0x80034000 handshake succeeded, kill_svc.exe enumerated running endpoint security processes (Ntrtscan.exe, TmCCSF.exe, uiWatchDog.exe, MsMpEng.exe), XOR-encrypted each target Process ID with the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. File",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Intruder dispatcher sending the hit list",
          "storyExcerpt": "Behind the scenes, intruder dispatcher sending the hit list captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Blocking mhyprot2.sys via Microsoft Vulnerable Driver Blocklist / WDAC and alerting on sudden simultaneous termination (Sysmon EventID 5) of multiple AV/EDR services.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Arcade Badge",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Bank Vault",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Ring-0 Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1562.001"
    }
  },
  "intezer-blackberry-symbiote-linux-ldpreload": {
    "briefing": {
      "scenarioId": "intezer-blackberry-symbiote-linux-ldpreload",
      "sectionKey": "briefing",
      "sceneKind": "krn-symbiote-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1574.006",
      "title": "Symbiote Parasitic Linux LD_PRELOAD Rootkit & libpcap eBPF Bytecode… — Story-to-Technical Overview",
      "storyCue": "Imagine a parasitic mist that refuses to walk down a bank hallway as a visible stranger and instead weaves itself into the master uniform coatroom. Every clerk, courier, and auditor who puts on an official jacket automatically wears the parasite too: inside couriers it silently copies every vault passphrase spoken at the counter, and inside safety auditors it clouds their magnifying lenses so the spy own hidden tunnels vanish from every inspection log.",
      "technicalCue": "PERSISTENCE: Global Dynamic Linker Injection via /etc/ld.so.preload -> CREDENTIAL ACCESS: PAM Backdoor Authentication & ssh/scp libc_read Keystroke Harvesting -> DEFENSE EVASION: libpcap Function Hooking & Kernel BPF Bytecode Scrubbing Against tcpdump",
      "storyMappings": [
        {
          "storyTerm": "Master uniform coatroom",
          "technicalTerm": "Global dynamic linker preload file /etc/ld.so.preload",
          "tone": "amber"
        },
        {
          "storyTerm": "Parasitic mist woven into every official jacket",
          "technicalTerm": "Shared object library (/usr/lib/liblinux.so) injected into every running process",
          "tone": "sky"
        },
        {
          "storyTerm": "Copying vault passphrases whispered by couriers",
          "technicalTerm": "PAM backdoor and libc read() hooking inside ssh and scp harvesting keystrokes",
          "tone": "rose"
        },
        {
          "storyTerm": "Clouding safety auditor magnifying lenses",
          "technicalTerm": "Hooking pcap_compile() and setsockopt(SO_ATTACH_FILTER) to blind tcpdump",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#22D3EE",
      "durationSec": 18,
      "callouts": [
        {
          "id": "krn-symbiote-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Master uniform coatroom",
          "subtitle": "Global dynamic linker preload file /etc/ld.so.preload",
          "tone": "amber"
        },
        {
          "id": "krn-symbiote-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Parasitic mist woven into every official…",
          "subtitle": "Shared object library (/usr/lib/liblinux.so) injected into…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Rack",
          "stageTag": "STAGE 01 · PERSISTENCE",
          "title": "Global Dynamic Linker Injection via /etc/ld.so.preload",
          "storyExcerpt": "Rather than hiring a separate intruder who would show up on the employee attendance sheet, the spy hangs a rigged lining inside the building universal uniform rack. From that second forward, every single…",
          "technicalParallel": "If an administrator runs cat /etc/ld.so.preload, ls /usr/lib, or ldd /bin/ls using standard dynamically linked system binaries, Symbiote’s hooked fopen and getdents64 functions filter out its own…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Mist",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "PAM Backdoor Authentication & ssh/scp libc_read Keystroke Harvesting",
          "storyExcerpt": "Riding inside the sleeves of every courier and gate clerk, the parasite silently transcribes every vault combination typed at the dispatch desk into a locked notebook, while secretly installing a master…",
          "technicalParallel": "Harvesting outbound ssh and scp credentials from compromised jump boxes allowed the attackers to pivot laterally across segmented banking infrastructure.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Mail",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "libpcap Function Hooking & Kernel BPF Bytecode Scrubbing Against tcpdump",
          "storyExcerpt": "Whenever building inspectors raise a magnifying glass to watch outgoing mail trucks for smuggling, the parasite riding inside the inspector own glasses silently swaps in tinted lenses that blot out the…",
          "technicalParallel": "Symbiote also hooked fopen(\"/proc/net/tcp\") and removed lines matching its active connections so netstat and ss could not see its sockets either.",
          "accentHex": "#22D3EE",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Coatroom",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Socket Sieve",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Mist Hook",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "intezer-blackberry-symbiote-linux-ldpreload",
      "sectionKey": "step-1",
      "sceneKind": "krn-symbiote-step-1",
      "stageBadge": "STEP #1 · PERSISTENCE",
      "title": "Global Dynamic Linker Injection via /etc/ld.so.preload",
      "storyCue": "Rather than hiring a separate intruder who would show up on the employee attendance sheet, the spy hangs a rigged lining inside the building universal uniform rack. From that second forward, every single worker who clocks in slips the hidden parasite onto their own sleeves automatically.",
      "technicalCue": "T1574.006 · PERSISTENCE — Rather than running as a separate process, Symbiote was deployed as a shared library (e.g., /usr/lib/liblinux.so) and added to /etc/ld.so.preload (a system-wide configuration file read by the…",
      "storyMappings": [
        {
          "storyTerm": "Universal uniform rack",
          "technicalTerm": "System-wide /etc/ld.so.preload dynamic linker configuration",
          "tone": "amber"
        },
        {
          "storyTerm": "Rigged lining hung on the rack",
          "technicalTerm": "Malicious ELF shared library (/usr/lib/liblinux.so)",
          "tone": "sky"
        },
        {
          "storyTerm": "No separate name on the attendance sheet",
          "technicalTerm": "No standalone malware process visible in ps or top listings",
          "tone": "rose"
        },
        {
          "storyTerm": "Every worker clocking in automatically wearing it",
          "technicalTerm": "Dynamic linker mapping Symbiote first into every newly launched Linux binary",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-symbiote-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Universal uniform rack",
          "subtitle": "System-wide /etc/ld.so.preload dynamic linker configuration",
          "tone": "amber"
        },
        {
          "id": "krn-symbiote-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Rigged lining hung on the rack",
          "subtitle": "Malicious ELF shared library (/usr/lib/liblinux.so)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Rack",
          "stageTag": "STEP 01 · SETUP",
          "title": "Universal uniform rack",
          "storyExcerpt": "Rather than hiring a separate intruder who would show up on the employee attendance sheet, the spy hangs a rigged lining inside the building universal uniform rack.",
          "technicalParallel": "If an administrator runs cat /etc/ld.so.preload, ls /usr/lib, or ldd /bin/ls using standard dynamically linked system binaries, Symbiote’s hooked fopen and getdents64 functions filter out its own…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Hung Rack",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Rigged lining hung on the rack",
          "storyExcerpt": "From that second forward, every single worker who clocks in slips the hidden parasite onto their own sleeves automatically.",
          "technicalParallel": "Rather than running as a separate process, Symbiote was deployed as a shared library (e.g., /usr/lib/liblinux.so) and added to /etc/ld.so.preload (a system-wide configuration file read by the GNU dynamic…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. No Name",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Every worker clocking in automatically wearing it",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across every worker clocking in automatically wearing it while locking down no separate name on the attendance sheet.",
          "technicalParallel": "Inspecting /etc/ld.so.preload and /proc/1/maps using a statically compiled binary (which does not use ld-linux.so and is immune to LD_PRELOAD userland hooks) or kernel-level eBPF sensors.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Coatroom",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Socket Sieve",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Mist Hook",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1574.006"
    },
    "step-2": {
      "scenarioId": "intezer-blackberry-symbiote-linux-ldpreload",
      "sectionKey": "step-2",
      "sceneKind": "krn-symbiote-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "PAM Backdoor Authentication & ssh/scp libc_read Keystroke Harvesting",
      "storyCue": "Riding inside the sleeves of every courier and gate clerk, the parasite silently transcribes every vault combination typed at the dispatch desk into a locked notebook, while secretly installing a master override phrase that lets the spy walk through the front gate under any clerk name.",
      "technicalCue": "T1556.003 · CREDENTIAL ACCESS — When loaded inside ssh or scp client processes, Symbiote hooked libc’s read() function to capture administrator passwords and keystrokes into an RC4-encrypted stash file (/var/tmp/.certs).",
      "storyMappings": [
        {
          "storyTerm": "Couriers typing vault combinations",
          "technicalTerm": "Administrator ssh and scp client sessions with hooked libc read()",
          "tone": "amber"
        },
        {
          "storyTerm": "Locked notebook storing copied combinations",
          "technicalTerm": "RC4-encrypted credential stash file hidden on disk (/var/tmp/...)",
          "tone": "sky"
        },
        {
          "storyTerm": "Master override phrase at the front gate",
          "technicalTerm": "PAM authentication backdoor permitting root login with a hardcoded password",
          "tone": "rose"
        },
        {
          "storyTerm": "Riding inside clerk sleeves",
          "technicalTerm": "In-process userland symbol interposition inside sshd and ssh clients",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-symbiote-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Couriers typing vault combinations",
          "subtitle": "Administrator ssh and scp client sessions with hooked libc…",
          "tone": "amber"
        },
        {
          "id": "krn-symbiote-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Locked notebook storing copied…",
          "subtitle": "RC4-encrypted credential stash file hidden on disk…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Gate Desk",
          "stageTag": "STEP 02 · SETUP",
          "title": "Couriers typing vault combinations",
          "storyExcerpt": "Riding inside the sleeves of every courier and gate clerk, the parasite silently transcribes every vault combination typed at the dispatch desk into a locked notebook, while secretly installing…",
          "technicalParallel": "Harvesting outbound ssh and scp credentials from compromised jump boxes allowed the attackers to pivot laterally across segmented banking infrastructure.",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Gate",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Locked notebook storing copied combinations",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses locked notebook storing copied combinations to advance toward master override phrase at the front gate.",
          "technicalParallel": "When loaded inside ssh or scp client processes, Symbiote hooked libc’s read() function to capture administrator passwords and keystrokes into an RC4-encrypted stash file (/var/tmp/.certs).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Gate",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Riding inside clerk sleeves",
          "storyExcerpt": "Behind the scenes, riding inside clerk sleeves captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Use kernel-level eBPF or auditd telemetry to inspect /proc/[pid]/maps on sshd (listing every shared library mapped into the SSH daemon straight from kernel memory) and alert on unexpected shared objects…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Coatroom",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Socket Sieve",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Mist Hook",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1556.003"
    },
    "step-3": {
      "scenarioId": "intezer-blackberry-symbiote-linux-ldpreload",
      "sectionKey": "step-3",
      "sceneKind": "krn-symbiote-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "libpcap Function Hooking & Kernel BPF Bytecode Scrubbing Against tcpdump",
      "storyCue": "Whenever building inspectors raise a magnifying glass to watch outgoing mail trucks for smuggling, the parasite riding inside the inspector own glasses silently swaps in tinted lenses that blot out the spy truck license plates before the report even reaches the page.",
      "technicalCue": "T1014 · DEFENSE EVASION — To defeat live network forensics on the infected host, Symbiote hooked pcap_compile() in libpcap and setsockopt(..., SO_ATTACH_FILTER...) in libc.",
      "storyMappings": [
        {
          "storyTerm": "Inspectors watching outgoing mail trucks",
          "technicalTerm": "DFIR analysts running tcpdump or packet sniffers directly on the infected host",
          "tone": "amber"
        },
        {
          "storyTerm": "Swapping in tinted lenses inside the inspector glasses",
          "technicalTerm": "Hooking libpcap pcap_compile() and libc setsockopt(SO_ATTACH_FILTER)",
          "tone": "sky"
        },
        {
          "storyTerm": "Blotting out the spy truck license plates",
          "technicalTerm": "Injecting BPF bytecode exclusions that scrub C2 IP addresses and ports from captures",
          "tone": "rose"
        },
        {
          "storyTerm": "Off-site rooftop camera catching the truth",
          "technicalTerm": "Out-of-band switch SPAN port or hardware network tap immune to host hooks",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-symbiote-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Inspectors watching outgoing mail trucks",
          "subtitle": "DFIR analysts running tcpdump or packet sniffers directly on…",
          "tone": "amber"
        },
        {
          "id": "krn-symbiote-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Swapping in tinted lenses inside the…",
          "subtitle": "Hooking libpcap pcap_compile() and libc…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Mail",
          "stageTag": "STEP 03 · SETUP",
          "title": "Inspectors watching outgoing mail trucks",
          "storyExcerpt": "Whenever building inspectors raise a magnifying glass to watch outgoing mail trucks for smuggling, the parasite riding inside the inspector own glasses silently swaps in tinted lenses that blot…",
          "technicalParallel": "Symbiote also hooked fopen(\"/proc/net/tcp\") and removed lines matching its active connections so netstat and ss could not see its sockets either.",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Out",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Swapping in tinted lenses inside the inspector glasses",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses swapping in tinted lenses inside the inspector glasses to advance toward blotting out the spy truck license plates.",
          "technicalParallel": "To defeat live network forensics on the infected host, Symbiote hooked pcap_compile() in libpcap and setsockopt(..., SO_ATTACH_FILTER...) in libc.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Out Spy",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Off-site rooftop camera catching the truth",
          "storyExcerpt": "Behind the scenes, off-site rooftop camera catching the truth captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Capture network traffic from an out-of-band switch SPAN port or hardware network tap (which observes raw wire frames outside the compromised OS so host userland hooks cannot scrub them) and compare ss…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Coatroom",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Socket Sieve",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Mist Hook",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1014"
    }
  },
  "kaspersky-cosmicstrand-uefi-spi-rootkit": {
    "briefing": {
      "scenarioId": "kaspersky-cosmicstrand-uefi-spi-rootkit",
      "sectionKey": "briefing",
      "sceneKind": "krn-cosmicstrand-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1542.001",
      "title": "CosmicStrand Motherboard SPI Flash UEFI Rootkit (CSMCORE -> ntoskrnl.exe… — Story-to-Technical Overview",
      "storyCue": "Imagine a saboteur who does not break into a bank lobby at all, but instead carves a hidden mechanical detour directly into the stone foundation chip poured beneath the building. Even if the owners demolish every floor and replace every safe inside, the stone foundation still triggers a three-person baton relay every morning at sunrise, switching off the building alarm clock before the bank governor even takes a single step.",
      "technicalCue": "PERSISTENCE: Motherboard SPI Flash Infection of CSMCORE DXE Driver (HandleProtocol Hook) -> DEFENSE EVASION: Multi-Hop Boot Hooking Relay (bootmgfw.efi -> winload.efi) -> LATERAL & C2: PatchGuard Neutralization, ntoskrnl.exe ZwCreateSection Hook & Kernel C2",
      "storyMappings": [
        {
          "storyTerm": "Stone foundation chip beneath the building",
          "technicalTerm": "Motherboard 8MB SPI NOR flash chip storing UEFI firmware",
          "tone": "amber"
        },
        {
          "storyTerm": "Carved mechanical detour inside the foundation",
          "technicalTerm": "Patched CSMCORE DXE UEFI driver hooking HandleProtocol",
          "tone": "sky"
        },
        {
          "storyTerm": "Three-person morning baton relay",
          "technicalTerm": "Boot hook chain across bootmgfw.efi, winload.efi, and OslArchTransferToKernel",
          "tone": "rose"
        },
        {
          "storyTerm": "Switching off the building alarm clock before the governor wakes",
          "technicalTerm": "Neutralizing PatchGuard (KiFilterFiberContext) and hooking ZwCreateSection in ntoskrnl.exe",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "krn-cosmicstrand-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Stone foundation chip beneath the building",
          "subtitle": "Motherboard 8MB SPI NOR flash chip storing UEFI firmware",
          "tone": "amber"
        },
        {
          "id": "krn-cosmicstrand-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Carved mechanical detour inside the…",
          "subtitle": "Patched CSMCORE DXE UEFI driver hooking HandleProtocol",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Chip",
          "stageTag": "STAGE 01 · PERSISTENCE",
          "title": "Motherboard SPI Flash Infection of CSMCORE DXE Driver (HandleProtocol Hook)",
          "storyExcerpt": "Deep beneath the building floor, the saboteur chisels a secret trigger straight into the permanent stone foundation block that wakes up first every morning. Because that block lives outside the…",
          "technicalParallel": "Because the infection resides entirely inside the motherboard’s SPI flash chip, replacing the SSD/NVMe drive or reinstalling Windows from a clean ISO has zero effect on the rootkit.",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Dawn Trap",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Multi-Hop Boot Hooking Relay (bootmgfw.efi -> winload.efi)",
          "storyExcerpt": "As dawn breaks, the foundation trap passes a hidden baton up a three-stage hallway relay: first catching the front-gate opener as it unlocks the lobby, then tagging the floor-captain loader as it…",
          "technicalParallel": "Because bootmgfw.efi, winload.efi, and ntoskrnl.exe on the disk partition are never modified on disk, offline disk forensics and file-hash checks report 100% clean Microsoft system binaries.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Bell",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "PatchGuard Neutralization, ntoskrnl.exe ZwCreateSection Hook & Kernel C2",
          "storyExcerpt": "One heartbeat before the bank governor opens his eyes, the baton carrier unhooks the master watchdog bell so nobody notices tampered blueprints, plants a secret listener on the room-opening ledger, and…",
          "technicalParallel": "Once Windows networking initialized, the kernel implant resolved its C2 domain via raw kernel sockets (tdi.sys) to fetch second-stage user/kernel payloads.",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "SPI Chip",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Kernel Hook",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Boot Detour",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "kaspersky-cosmicstrand-uefi-spi-rootkit",
      "sectionKey": "step-1",
      "sceneKind": "krn-cosmicstrand-step-1",
      "stageBadge": "STEP #1 · PERSISTENCE",
      "title": "Motherboard SPI Flash Infection of CSMCORE DXE Driver (HandleProtocol Hook)",
      "storyCue": "Deep beneath the building floor, the saboteur chisels a secret trigger straight into the permanent stone foundation block that wakes up first every morning. Because that block lives outside the replaceable floors and storage rooms, tearing out every hard drive in the building never removes the trap.",
      "technicalCue": "T1542.001 · PERSISTENCE — CosmicStrand modified the UEFI firmware image stored inside the motherboard’s physical 8MB SPI NOR flash chip, specifically patching the CSMCORE DXE driver (GUID…",
      "storyMappings": [
        {
          "storyTerm": "Permanent stone foundation block",
          "technicalTerm": "Physical 8MB SPI NOR flash chip on ASUS or Gigabyte H81 motherboards",
          "tone": "amber"
        },
        {
          "storyTerm": "Chiseled secret trigger inside the block",
          "technicalTerm": "Modified CSMCORE DXE driver (GUID {A062CF1F-8473-4AA3-87AF-993111011898})",
          "tone": "sky"
        },
        {
          "storyTerm": "Morning wake-up handshake intercepted",
          "technicalTerm": "Inline hook placed on UEFI Boot Services HandleProtocol",
          "tone": "rose"
        },
        {
          "storyTerm": "Surviving full floor replacement",
          "technicalTerm": "Persistence across complete Windows reinstalls and disk swaps",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-cosmicstrand-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Permanent stone foundation block",
          "subtitle": "Physical 8MB SPI NOR flash chip on ASUS or Gigabyte H81…",
          "tone": "amber"
        },
        {
          "id": "krn-cosmicstrand-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Chiseled secret trigger inside the block",
          "subtitle": "Modified CSMCORE DXE driver (GUID…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Deep Up",
          "stageTag": "STEP 01 · SETUP",
          "title": "Permanent stone foundation block",
          "storyExcerpt": "Deep beneath the building floor, the saboteur chisels a secret trigger straight into the permanent stone foundation block that wakes up first every morning.",
          "technicalParallel": "Because the infection resides entirely inside the motherboard’s SPI flash chip, replacing the SSD/NVMe drive or reinstalling Windows from a clean ISO has zero effect on the rootkit.",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Out Hard",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Chiseled secret trigger inside the block",
          "storyExcerpt": "Because that block lives outside the replaceable floors and storage rooms, tearing out every hard drive in the building never removes the trap.",
          "technicalParallel": "CosmicStrand modified the UEFI firmware image stored inside the motherboard’s physical 8MB SPI NOR flash chip, specifically patching the CSMCORE DXE driver (GUID {A062CF1F-8473-4AA3-8793-600BC4FFE9A8}).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Wake-up",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Surviving full floor replacement",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across surviving full floor replacement while locking down morning wake-up handshake intercepted.",
          "technicalParallel": "Dump the motherboard SPI flash ROM using CHIPSEC or dedicated UEFI firmware scanners (hardware-level inspection tools that read flash memory directly) and flag unexpected modifications to the CSMCORE DXE…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "SPI Chip",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Kernel Hook",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Boot Detour",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1542.001"
    },
    "step-2": {
      "scenarioId": "kaspersky-cosmicstrand-uefi-spi-rootkit",
      "sectionKey": "step-2",
      "sceneKind": "krn-cosmicstrand-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Multi-Hop Boot Hooking Relay (bootmgfw.efi -> winload.efi)",
      "storyCue": "As dawn breaks, the foundation trap passes a hidden baton up a three-stage hallway relay: first catching the front-gate opener as it unlocks the lobby, then tagging the floor-captain loader as it prepares the main hall, making sure the trap rides all the way up to the governor desk.",
      "technicalCue": "T1542.003 · DEFENSE EVASION — When HandleProtocol was called during boot, CosmicStrand scanned memory for bootmgfw.efi and placed an inline hook on Archpx64TransferTo64BitApplicationAsm.",
      "storyMappings": [
        {
          "storyTerm": "Front-gate opener caught at the lobby",
          "technicalTerm": "bootmgfw.efi hooked at Archpx64TransferTo64BitApplicationAsm",
          "tone": "amber"
        },
        {
          "storyTerm": "Floor-captain loader preparing the main hall",
          "technicalTerm": "winload.efi hooked during OS loader preparation",
          "tone": "sky"
        },
        {
          "storyTerm": "Passing the hidden baton upward",
          "technicalTerm": "Multi-hop pre-OS inline hooking chain bridging firmware to OS loader",
          "tone": "rose"
        },
        {
          "storyTerm": "Governor desk handoff point",
          "technicalTerm": "OslArchTransferToKernel transition right before ntoskrnl.exe starts",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-cosmicstrand-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Front-gate opener caught at the lobby",
          "subtitle": "bootmgfw.efi hooked at Archpx64TransferTo64BitApplicationAsm",
          "tone": "amber"
        },
        {
          "id": "krn-cosmicstrand-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Floor-captain loader preparing the main…",
          "subtitle": "winload.efi hooked during OS loader preparation",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Dawn Trap",
          "stageTag": "STEP 02 · SETUP",
          "title": "Front-gate opener caught at the lobby",
          "storyExcerpt": "As dawn breaks, the foundation trap passes a hidden baton up a three-stage hallway relay: first catching the front-gate opener as it unlocks the lobby, then tagging the floor-captain loader as…",
          "technicalParallel": "Because bootmgfw.efi, winload.efi, and ntoskrnl.exe on the disk partition are never modified on disk, offline disk forensics and file-hash checks report 100% clean Microsoft system binaries.",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Main Hall",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Floor-captain loader preparing the main hall",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses floor-captain loader preparing the main hall to advance toward passing the hidden baton upward.",
          "technicalParallel": "When HandleProtocol was called during boot, CosmicStrand scanned memory for bootmgfw.efi and placed an inline hook on Archpx64TransferTo64BitApplicationAsm.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Desk",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Governor desk handoff point",
          "storyExcerpt": "Behind the scenes, governor desk handoff point captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Perform pre-OS boot integrity verification and live kernel memory scanning comparing the in-RAM .text code sections of ntoskrnl.exe against the clean on-disk PE binary (exposing unauthorized pre-boot…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "SPI Chip",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Kernel Hook",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Boot Detour",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1542.003"
    },
    "step-3": {
      "scenarioId": "kaspersky-cosmicstrand-uefi-spi-rootkit",
      "sectionKey": "step-3",
      "sceneKind": "krn-cosmicstrand-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "PatchGuard Neutralization, ntoskrnl.exe ZwCreateSection Hook & Kernel C2",
      "storyCue": "One heartbeat before the bank governor opens his eyes, the baton carrier unhooks the master watchdog bell so nobody notices tampered blueprints, plants a secret listener on the room-opening ledger, and opens a hidden courier line straight from the governor private study.",
      "technicalCue": "T1014 · LATERAL & C2 — At the OslArchTransferToKernel handoff, before ntoskrnl.exe even executed its first instruction, CosmicStrand patched KiFilterFiberContext in ntoskrnl.exe RAM to immediately return (preventing…",
      "storyMappings": [
        {
          "storyTerm": "Unhooking the master watchdog bell",
          "technicalTerm": "Patching KiFilterFiberContext in ntoskrnl.exe RAM to bypass PatchGuard",
          "tone": "amber"
        },
        {
          "storyTerm": "Secret listener on the room-opening ledger",
          "technicalTerm": "Kernel hook placed on ZwCreateSection inside ntoskrnl.exe",
          "tone": "sky"
        },
        {
          "storyTerm": "Governor private study",
          "technicalTerm": "Ring-0 Windows kernel execution context prior to user-mode boot",
          "tone": "rose"
        },
        {
          "storyTerm": "Hidden courier line",
          "technicalTerm": "Kernel-level shellcode deployment and remote C2 payload retrieval",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-cosmicstrand-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Unhooking the master watchdog bell",
          "subtitle": "Patching KiFilterFiberContext in ntoskrnl.exe RAM to bypass…",
          "tone": "amber"
        },
        {
          "id": "krn-cosmicstrand-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Secret listener on the room-opening ledger",
          "subtitle": "Kernel hook placed on ZwCreateSection inside ntoskrnl.exe",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Bell",
          "stageTag": "STEP 03 · SETUP",
          "title": "Unhooking the master watchdog bell",
          "storyExcerpt": "One heartbeat before the bank governor opens his eyes, the baton carrier unhooks the master watchdog bell so nobody notices tampered blueprints, plants a secret listener on the room-opening…",
          "technicalParallel": "Once Windows networking initialized, the kernel implant resolved its C2 domain via raw kernel sockets (tdi.sys) to fetch second-stage user/kernel payloads.",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Room-opening",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Secret listener on the room-opening ledger",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses secret listener on the room-opening ledger to advance toward governor private study.",
          "technicalParallel": "At the OslArchTransferToKernel handoff, before ntoskrnl.exe even executed its first instruction, CosmicStrand patched KiFilterFiberContext in ntoskrnl.exe RAM to immediately return (preventing Windows…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Line",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Hidden courier line",
          "storyExcerpt": "Behind the scenes, hidden courier line captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Live kernel memory forensics (Volatility / EDR kernel integrity scan) detecting inline hooks on ntoskrnl.exe!ZwCreateSection and patched bytes at ntoskrnl.exe!KiFilterFiberContext.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "SPI Chip",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Kernel Hook",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Boot Detour",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1014"
    }
  },
  "linux-bpfdoor-ebpf-socket-filter-apt": {
    "briefing": {
      "scenarioId": "linux-bpfdoor-ebpf-socket-filter-apt",
      "sectionKey": "briefing",
      "sceneKind": "krn-bpfdoor-apt-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1036.004",
      "title": "BPFDoor Passive Linux Rootkit & Classic BPF Magic Packet Filter (Red… — Story-to-Technical Overview",
      "storyCue": "Imagine a silent spy who moves into a temporary hallway locker inside a busy central post office, burns the paper lease behind them, and clips on a maintenance janitor badge. Instead of renting an office doorway that shows up on the building floor plan, the spy snaps a tiny acoustic sieve straight onto the main mail chute and sleeps invisibly for years until a single envelope carrying a secret wax seal drops past the chute, waking the spy to open a private back staircase.",
      "technicalCue": "DEFENSE EVASION: In-Memory /dev/shm/kdmtmpflush Execution, Unlinking & Process Masquerading -> PERSISTENCE: Attaching Kernel Berkeley Packet Filter via setsockopt(SO_ATTACH_FILTER) -> LATERAL & C2: Magic Packet Activation, iptables Port Redirection & Memory-Only PTY Shell",
      "storyMappings": [
        {
          "storyTerm": "Temporary hallway locker with a burned paper lease",
          "technicalTerm": "Unlinked ELF binary executing from RAM-backed /dev/shm/kdmtmpflush",
          "tone": "amber"
        },
        {
          "storyTerm": "Maintenance janitor badge",
          "technicalTerm": "Masqueraded argv[0] process name disguising the active implant",
          "tone": "sky"
        },
        {
          "storyTerm": "Tiny acoustic sieve on the main mail chute with no doorway",
          "technicalTerm": "Raw AF_PACKET socket with SO_ATTACH_FILTER classic BPF bytecode and zero open ports",
          "tone": "rose"
        },
        {
          "storyTerm": "Envelope carrying a secret wax seal opening a back staircase",
          "technicalTerm": "Magic packet (0x7255 / 0x5293) triggering iptables redirect and memory-only PTY shell",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "krn-bpfdoor-apt-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Temporary hallway locker with a burned…",
          "subtitle": "Unlinked ELF binary executing from RAM-backed…",
          "tone": "amber"
        },
        {
          "id": "krn-bpfdoor-apt-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Maintenance janitor badge",
          "subtitle": "Masqueraded argv[0] process name disguising the active implant",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Upon Post",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "In-Memory /dev/shm/kdmtmpflush Execution, Unlinking & Process Masquerading",
          "storyExcerpt": "Upon entering the post office with master keys, the spy steps into a temporary memory-only hallway locker, backdates the locker stamp by more than a decade, shreds the locker key tag so nothing appears…",
          "technicalParallel": "Standard administrator checks like ps aux displayed a convincing Linux system daemon name, while disk-based antivirus scans found nothing because the executable file had already been unlinked.",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Open Hour",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "Attaching Kernel Berkeley Packet Filter via setsockopt(SO_ATTACH_FILTER)",
          "storyExcerpt": "Refusing to open a visible service window that guards check every hour, the spy clips a tiny 30-step mechanical sieve directly onto the main incoming mail chute. Every letter streaming into the building…",
          "technicalParallel": "Because AF_PACKET sockets do not bind a TCP or UDP port, netstat -tlpn, ss -tlpn, and external port scanners (nmap) show zero open backdoor ports, and the attacker can send the magic packet to any port…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Tiny Main",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "Magic Packet Activation, iptables Port Redirection & Memory-Only PTY Shell",
          "storyExcerpt": "The instant a passing letter carries the secret wax stamp and matching passphrase, the spy wakes up, briefly swings a hidden wall panel to steer the caller around the lobby metal detector, and opens a…",
          "technicalParallel": "As soon as the interactive session ended, BPFDoor executed iptables -t nat -D PREROUTING ... to delete the temporary NAT redirection rule and return to passive dormancy.",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Socket Sieve",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Silent Wire",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Magic Bell",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "linux-bpfdoor-ebpf-socket-filter-apt",
      "sectionKey": "step-1",
      "sceneKind": "krn-bpfdoor-apt-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "In-Memory /dev/shm/kdmtmpflush Execution, Unlinking & Process Masquerading",
      "storyCue": "Upon entering the post office with master keys, the spy steps into a temporary memory-only hallway locker, backdates the locker stamp by more than a decade, shreds the locker key tag so nothing appears on the shelf, and pins on a routine building-service nametag.",
      "technicalCue": "T1036.004 · DEFENSE EVASION — When launched as root, BPFDoor copied its ELF binary to /dev/shm/kdmtmpflush (the RAM-backed tmpfs shared memory filesystem), timestomped its modification date to 2008-10-30, re-executed itself…",
      "storyMappings": [
        {
          "storyTerm": "Memory-only hallway locker",
          "technicalTerm": "RAM-backed tmpfs staging file /dev/shm/kdmtmpflush",
          "tone": "amber"
        },
        {
          "storyTerm": "Backdating the locker stamp by a decade",
          "technicalTerm": "Timestomping file modification time to 2008-10-30",
          "tone": "sky"
        },
        {
          "storyTerm": "Shredding the locker key tag",
          "technicalTerm": "Self-unlinking binary leaving a /proc/<pid>/exe (deleted) trace",
          "tone": "rose"
        },
        {
          "storyTerm": "Routine building-service nametag",
          "technicalTerm": "Masqueraded process name hiding BPFDoor in ps output",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-bpfdoor-apt-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Memory-only hallway locker",
          "subtitle": "RAM-backed tmpfs staging file /dev/shm/kdmtmpflush",
          "tone": "amber"
        },
        {
          "id": "krn-bpfdoor-apt-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Backdating the locker stamp by a decade",
          "subtitle": "Timestomping file modification time to 2008-10-30",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Upon Post",
          "stageTag": "STEP 01 · SETUP",
          "title": "Memory-only hallway locker",
          "storyExcerpt": "Upon entering the post office with master keys, the spy steps into a temporary memory-only hallway locker, backdates the locker stamp by more than a decade, shreds the locker key tag so nothing…",
          "technicalParallel": "Standard administrator checks like ps aux displayed a convincing Linux system daemon name, while disk-based antivirus scans found nothing because the executable file had already been unlinked.",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Key",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Backdating the locker stamp by a decade",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses backdating the locker stamp by a decade to advance toward shredding the locker key tag.",
          "technicalParallel": "When launched as root, BPFDoor copied its ELF binary to /dev/shm/kdmtmpflush (the RAM-backed tmpfs shared memory filesystem), timestomped its modification date to 2008-10-30, re-executed itself with…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Key Tag",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Routine building-service nametag",
          "storyExcerpt": "Behind the scenes, routine building-service nametag captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Scan /proc/[0-9]*/exe symbolic links across Linux hosts for targets pointing to /dev/shm/* (deleted) (which exposes memory-backed binaries that erased themselves from disk) and compare /proc/[pid]/comm…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Socket Sieve",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Silent Wire",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Magic Bell",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1036.004"
    },
    "step-2": {
      "scenarioId": "linux-bpfdoor-ebpf-socket-filter-apt",
      "sectionKey": "step-2",
      "sceneKind": "krn-bpfdoor-apt-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Attaching Kernel Berkeley Packet Filter via setsockopt(SO_ATTACH_FILTER)",
      "storyCue": "Refusing to open a visible service window that guards check every hour, the spy clips a tiny 30-step mechanical sieve directly onto the main incoming mail chute. Every letter streaming into the building passes silently over that sieve, which ignores ordinary mail and waits only for the spy secret emblem.",
      "technicalCue": "T1205.002 · PERSISTENCE — BPFDoor called socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP)) to create a raw packet socket and invoked setsockopt(sock, SOL_SOCKET, SO_ATTACH_FILTER, &bpf_prog...) (attaching a 30-instruction…",
      "storyMappings": [
        {
          "storyTerm": "Visible service window checked by guards",
          "technicalTerm": "Standard listening TCP/UDP socket visible to netstat or ss",
          "tone": "amber"
        },
        {
          "storyTerm": "Main incoming mail chute",
          "technicalTerm": "Raw packet socket created via socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP))",
          "tone": "sky"
        },
        {
          "storyTerm": "30-step mechanical sieve",
          "technicalTerm": "Classic BPF bytecode filter attached via setsockopt(SO_ATTACH_FILTER)",
          "tone": "rose"
        },
        {
          "storyTerm": "Secret emblem watched by the sieve",
          "technicalTerm": "Hardcoded magic packet signatures (0x7255 or 0x5293) across TCP, UDP, or ICMP",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-bpfdoor-apt-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Visible service window checked by guards",
          "subtitle": "Standard listening TCP/UDP socket visible to netstat or ss",
          "tone": "amber"
        },
        {
          "id": "krn-bpfdoor-apt-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Main incoming mail chute",
          "subtitle": "Raw packet socket created via socket(AF_PACKET, SOCK_RAW…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Open Hour",
          "stageTag": "STEP 02 · SETUP",
          "title": "Visible service window checked by guards",
          "storyExcerpt": "Refusing to open a visible service window that guards check every hour, the spy clips a tiny 30-step mechanical sieve directly onto the main incoming mail chute.",
          "technicalParallel": "Because AF_PACKET sockets do not bind a TCP or UDP port, netstat -tlpn, ss -tlpn, and external port scanners (nmap) show zero open backdoor ports, and the attacker can send the magic packet to any port…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Main Mail",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Main incoming mail chute",
          "storyExcerpt": "Every letter streaming into the building passes silently over that sieve, which ignores ordinary mail and waits only for the spy secret emblem.",
          "technicalParallel": "BPFDoor called socket(AF_PACKET, SOCK_RAW, htons(ETH_P_IP)) to create a raw packet socket and invoked setsockopt(sock, SOL_SOCKET, SO_ATTACH_FILTER, &bpf_prog...) (attaching a 30-instruction classic…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. 30-step",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Secret emblem watched by the sieve",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across secret emblem watched by the sieve while locking down 30-step mechanical sieve.",
          "technicalParallel": "Running ss -0pb on Linux to enumerate AF_PACKET raw sockets and their attached BPF bytecode filters (specifically looking for decimal constants 29269 (0x7255) and 21139 (0x5293)).",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Socket Sieve",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Silent Wire",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Magic Bell",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1205.002"
    },
    "step-3": {
      "scenarioId": "linux-bpfdoor-ebpf-socket-filter-apt",
      "sectionKey": "step-3",
      "sceneKind": "krn-bpfdoor-apt-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "Magic Packet Activation, iptables Port Redirection & Memory-Only PTY Shell",
      "storyCue": "The instant a passing letter carries the secret wax stamp and matching passphrase, the spy wakes up, briefly swings a hidden wall panel to steer the caller around the lobby metal detector, and opens a private, trace-free speaking tube straight into the post office basement.",
      "technicalCue": "T1205.001 · LATERAL & C2 — Upon receiving a TCP, UDP, or ICMP Echo packet containing 0x7255 / 0x5293 and a valid password hash, BPFDoor forked a child process, allocated a pseudo-terminal (/dev/ptmx without recording a…",
      "storyMappings": [
        {
          "storyTerm": "Passing letter with secret wax stamp and passphrase",
          "technicalTerm": "Magic TCP, UDP, or ICMP packet bearing 0x7255 / 0x5293 and valid password hash",
          "tone": "amber"
        },
        {
          "storyTerm": "Swinging a wall panel around the metal detector",
          "technicalTerm": "Dynamic iptables NAT/PREROUTING rule redirecting traffic past host firewalls",
          "tone": "sky"
        },
        {
          "storyTerm": "Private trace-free speaking tube",
          "technicalTerm": "Forked child process allocating a /dev/ptmx pseudo-terminal without utmp logging",
          "tone": "rose"
        },
        {
          "storyTerm": "Post office basement access",
          "technicalTerm": "Interactive root shell session lasting only while the magic session stays active",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-bpfdoor-apt-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Passing letter with secret wax stamp and…",
          "subtitle": "Magic TCP, UDP, or ICMP packet bearing 0x7255 / 0x5293 and…",
          "tone": "amber"
        },
        {
          "id": "krn-bpfdoor-apt-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Swinging a wall panel around the metal…",
          "subtitle": "Dynamic iptables NAT/PREROUTING rule redirecting traffic past…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Wax Spy",
          "stageTag": "STEP 03 · SETUP",
          "title": "Passing letter with secret wax stamp and passphrase",
          "storyExcerpt": "The instant a passing letter carries the secret wax stamp and matching passphrase, the spy wakes up, briefly swings a hidden wall panel to steer the caller around the lobby metal detector, and…",
          "technicalParallel": "As soon as the interactive session ended, BPFDoor executed iptables -t nat -D PREROUTING ... to delete the temporary NAT redirection rule and return to passive dormancy.",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Wall",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Swinging a wall panel around the metal detector",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses swinging a wall panel around the metal detector to advance toward private trace-free speaking tube.",
          "technicalParallel": "Upon receiving a TCP, UDP, or ICMP Echo packet containing 0x7255 / 0x5293 and a valid password hash, BPFDoor forked a child process, allocated a pseudo-terminal (/dev/ptmx without recording a login in…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tube",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Post office basement access",
          "storyExcerpt": "Behind the scenes, post office basement access captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Network IDS rules matching 0x7255 / 0x5293 magic payloads and Linux auditd monitoring for setsockopt (SO_ATTACH_FILTER) and unexpected iptables -t nat invocations.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Socket Sieve",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Silent Wire",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Magic Bell",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1205.001"
    }
  },
  "sentinelone-terminator-zemana-byovd": {
    "briefing": {
      "scenarioId": "sentinelone-terminator-zemana-byovd",
      "sectionKey": "briefing",
      "sceneKind": "krn-terminator-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1068",
      "title": "Terminator EDR Killer Abusing Signed Zemana AntiMalware Driver… — Story-to-Technical Overview",
      "storyCue": "Imagine a burglar carrying a genuinely stamped security-vendor master badge bought from an underground broker. After dropping that legitimate badge into the building engine room, the burglar walks up to an unguarded badge-enrollment desk that forgets to check identity, writes their own badge number onto the VIP master roster, and then walks in an endless loop shutting off every security camera and guard station across the building.",
      "technicalCue": "DEFENSE EVASION: Dropping Randomized Signed Zemana Driver (zam64.sys) into System32\\drivers -> DEFENSE EVASION: Self-Allowlisting Caller PID via Unauthenticated IOCTL 0x80002010 (CVE-2021-31728) -> DEFENSE EVASION: Continuous Ring-0 Termination Loop via IOCTL 0x80002048",
      "storyMappings": [
        {
          "storyTerm": "Genuinely stamped security-vendor master badge",
          "technicalTerm": "Signed vulnerable Zemana AntiMalware kernel driver (zam64.sys)",
          "tone": "amber"
        },
        {
          "storyTerm": "Unguarded badge-enrollment desk",
          "technicalTerm": "Unauthenticated IOCTL 0x80002010 self-allowlisting flaw (CVE-2021-31728)",
          "tone": "sky"
        },
        {
          "storyTerm": "VIP master roster",
          "technicalTerm": "Internal zam64.sys trusted Process ID allowlist in kernel memory",
          "tone": "rose"
        },
        {
          "storyTerm": "Endless loop shutting off every guard station",
          "technicalTerm": "Continuous while(true) IOCTL 0x80002048 Ring-0 termination of 24 EDR agents",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#FACC15",
      "durationSec": 18,
      "callouts": [
        {
          "id": "krn-terminator-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Genuinely stamped security-vendor master…",
          "subtitle": "Signed vulnerable Zemana AntiMalware kernel driver (zam64.sys)",
          "tone": "amber"
        },
        {
          "id": "krn-terminator-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Unguarded badge-enrollment desk",
          "subtitle": "Unauthenticated IOCTL 0x80002010 self-allowlisting flaw…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Keys Name",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "Dropping Randomized Signed Zemana Driver (zam64.sys) into System32\\drivers",
          "storyExcerpt": "Holding administrator keys, the burglar unpacks a genuinely signed third-party security driver, stamps a random cover name onto its tag so simple filename checklists overlook it, and plugs it straight…",
          "technicalParallel": "Regardless of the randomized .sys filename on disk, the driver’s DriverEntry routine always creates the fixed device symbolic link \\\\.\\ZemanaAntiMalware (or \\\\.\\B94B8021-5217-4091-96E5-6353272B9429).",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Desk",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Self-Allowlisting Caller PID via Unauthenticated IOCTL 0x80002010 (CVE-2021-31728)",
          "storyExcerpt": "Even though the driver only obeys badge numbers written on its VIP security roster, its enrollment window never checks who is asking to be added. The burglar simply taps the enrollment code and writes…",
          "technicalParallel": "Once a PID is registered via 0x80002010, zam64.sys unlocks its full suite of administrative IOCTLs, including process termination, registry manipulation, and direct SCSI/disk read-write, for that caller.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Now Vip",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Continuous Ring-0 Termination Loop via IOCTL 0x80002048",
          "storyExcerpt": "Now accepted as a VIP security supervisor, the burglar paces the hallways in a relentless circle, comparing every guard uniform against a pocket hit-list of 24 known security agencies and flipping the…",
          "technicalParallel": "Modern EDRs neutralize Terminator prior to 0x80002048 by blocking the load of zam64.sys at NtLoadDriver / DriverLoad time using behavioral prevention and kernel blocklists.",
          "accentHex": "#FACC15",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Enroll Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Guard Core",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "VIP Pass",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "sentinelone-terminator-zemana-byovd",
      "sectionKey": "step-1",
      "sceneKind": "krn-terminator-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "Dropping Randomized Signed Zemana Driver (zam64.sys) into System32\\drivers",
      "storyCue": "Holding administrator keys, the burglar unpacks a genuinely signed third-party security driver, stamps a random cover name onto its tag so simple filename checklists overlook it, and plugs it straight into the building core engine room.",
      "technicalCue": "T1068 · DEFENSE EVASION — When executed with administrator privileges, Terminator.exe wrote an embedded copy of zam64.sys (a kernel driver validly signed by Zemana Ltd. and countersigned by Microsoft) into…",
      "storyMappings": [
        {
          "storyTerm": "Genuinely signed third-party security driver",
          "technicalTerm": "Embedded zam64.sys validly signed by Zemana Ltd. and countersigned by Microsoft",
          "tone": "amber"
        },
        {
          "storyTerm": "Random cover name on the tag",
          "technicalTerm": "Randomized driver filename written under C:\\Windows\\System32\\drivers\\",
          "tone": "sky"
        },
        {
          "storyTerm": "Burglar carrying administrator keys",
          "technicalTerm": "Terminator.exe user-mode wrapper executing with local admin rights",
          "tone": "rose"
        },
        {
          "storyTerm": "Building core engine room",
          "technicalTerm": "Windows Ring-0 kernel driver space accepting the signed driver",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-terminator-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Genuinely signed third-party security…",
          "subtitle": "Embedded zam64.sys validly signed by Zemana Ltd. and…",
          "tone": "amber"
        },
        {
          "id": "krn-terminator-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Random cover name on the tag",
          "subtitle": "Randomized driver filename written under…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Keys Name",
          "stageTag": "STEP 01 · SETUP",
          "title": "Genuinely signed third-party security driver",
          "storyExcerpt": "Holding administrator keys, the burglar unpacks a genuinely signed third-party security driver, stamps a random cover name onto its tag so simple filename checklists overlook it, and plugs it…",
          "technicalParallel": "Regardless of the randomized .sys filename on disk, the driver’s DriverEntry routine always creates the fixed device symbolic link \\\\.\\ZemanaAntiMalware (or \\\\.\\B94B8021-5217-4091-96E5-6353272B9429).",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Name Tag",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Random cover name on the tag",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses random cover name on the tag to advance toward burglar carrying administrator keys.",
          "technicalParallel": "When executed with administrator privileges, Terminator.exe wrote an embedded copy of zam64.sys (a kernel driver validly signed by Zemana Ltd. and countersigned by Microsoft) into…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Keys",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Building core engine room",
          "storyExcerpt": "Behind the scenes, building core engine room captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Sysmon EventID 6 matching the SHA-256 hash, PE OriginalFileName (zam64.sys / zamguard64.sys), or Zemana Ltd. certificate thumbprint regardless of filename.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Enroll Desk",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Guard Core",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "VIP Pass",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1068"
    },
    "step-2": {
      "scenarioId": "sentinelone-terminator-zemana-byovd",
      "sectionKey": "step-2",
      "sceneKind": "krn-terminator-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Self-Allowlisting Caller PID via Unauthenticated IOCTL 0x80002010 (CVE-2021-31728)",
      "storyCue": "Even though the driver only obeys badge numbers written on its VIP security roster, its enrollment window never checks who is asking to be added. The burglar simply taps the enrollment code and writes their own badge number straight onto the VIP list.",
      "technicalCue": "T1068 · DEFENSE EVASION — Although zam64.sys checks an internal allowlist of trusted Process IDs before permitting privileged operations like process termination or raw disk access, it exposes IOCTL 0x80002010…",
      "storyMappings": [
        {
          "storyTerm": "VIP security roster",
          "technicalTerm": "Internal zam64.sys allowlist of authorized caller Process IDs",
          "tone": "amber"
        },
        {
          "storyTerm": "Enrollment window that never checks identity",
          "technicalTerm": "Unauthenticated IOCTL 0x80002010 exposed by \\\\.\\ZemanaAntiMalware (CVE-2021-31728)",
          "tone": "sky"
        },
        {
          "storyTerm": "Writing their own badge number onto the list",
          "technicalTerm": "Terminator.exe registering its own PID as a trusted kernel caller",
          "tone": "rose"
        },
        {
          "storyTerm": "Privileged master controls unlocked",
          "technicalTerm": "Arbitrary Ring-0 process termination and raw disk access granted to the caller",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-terminator-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "VIP security roster",
          "subtitle": "Internal zam64.sys allowlist of authorized caller Process IDs",
          "tone": "amber"
        },
        {
          "id": "krn-terminator-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Enrollment window that never checks…",
          "subtitle": "Unauthenticated IOCTL 0x80002010 exposed by…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Even Only",
          "stageTag": "STEP 02 · SETUP",
          "title": "VIP security roster",
          "storyExcerpt": "Even though the driver only obeys badge numbers written on its VIP security roster, its enrollment window never checks who is asking to be added.",
          "technicalParallel": "Once a PID is registered via 0x80002010, zam64.sys unlocks its full suite of administrative IOCTLs, including process termination, registry manipulation, and direct SCSI/disk read-write, for that caller.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Taps Code",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Enrollment window that never checks identity",
          "storyExcerpt": "The burglar simply taps the enrollment code and writes their own badge number straight onto the VIP list.",
          "technicalParallel": "Although zam64.sys checks an internal allowlist of trusted Process IDs before permitting privileged operations like process termination or raw disk access, it exposes IOCTL 0x80002010…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Own Onto",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Privileged master controls unlocked",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across privileged master controls unlocked while locking down writing their own badge number onto the list.",
          "technicalParallel": "Enable kernel ETW and EDR behavioral monitoring (low-level Windows kernel event tracing that watches device handle communications) alerting on any binary opening \\\\.\\ZemanaAntiMalware and sending IOCTL…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Enroll Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Guard Core",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "VIP Pass",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1068"
    },
    "step-3": {
      "scenarioId": "sentinelone-terminator-zemana-byovd",
      "sectionKey": "step-3",
      "sceneKind": "krn-terminator-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Continuous Ring-0 Termination Loop via IOCTL 0x80002048",
      "storyCue": "Now accepted as a VIP security supervisor, the burglar paces the hallways in a relentless circle, comparing every guard uniform against a pocket hit-list of 24 known security agencies and flipping the master kill switch on every matching guard before they can sound the alarm.",
      "technicalCue": "T1562.001 · DEFENSE EVASION — In an infinite while (true) loop, Terminator.exe called CreateToolhelp32Snapshot to enumerate active processes, compared each executable name against a hardcoded array of 24 security vendors…",
      "storyMappings": [
        {
          "storyTerm": "Pacing the hallways in a relentless circle",
          "technicalTerm": "Infinite while(true) loop calling CreateToolhelp32Snapshot to scan active PIDs",
          "tone": "amber"
        },
        {
          "storyTerm": "Pocket hit-list of 24 security agencies",
          "technicalTerm": "Hardcoded array of 24 AV and EDR executable names targeted by Terminator.exe",
          "tone": "sky"
        },
        {
          "storyTerm": "Master kill switch",
          "technicalTerm": "IOCTL 0x80002048 invoking kernel-level process termination via zam64.sys",
          "tone": "rose"
        },
        {
          "storyTerm": "Silenced guard stations",
          "technicalTerm": "Terminated endpoint protection agents leaving the host defenseless",
          "tone": "emerald"
        }
      ],
      "accentHex": "#FACC15",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "krn-terminator-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Pacing the hallways in a relentless circle",
          "subtitle": "Infinite while(true) loop calling CreateToolhelp32Snapshot to…",
          "tone": "amber"
        },
        {
          "id": "krn-terminator-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Pocket hit-list of 24 security agencies",
          "subtitle": "Hardcoded array of 24 AV and EDR executable names targeted by…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Now Vip",
          "stageTag": "STEP 03 · SETUP",
          "title": "Pacing the hallways in a relentless circle",
          "storyExcerpt": "Now accepted as a VIP security supervisor, the burglar paces the hallways in a relentless circle, comparing every guard uniform against a pocket hit-list of 24 known security agencies and…",
          "technicalParallel": "Modern EDRs neutralize Terminator prior to 0x80002048 by blocking the load of zam64.sys at NtLoadDriver / DriverLoad time using behavioral prevention and kernel blocklists.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Hit-list 24",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Pocket hit-list of 24 security agencies",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses pocket hit-list of 24 security agencies to advance toward master kill switch.",
          "technicalParallel": "In an infinite while (true) loop, Terminator.exe called CreateToolhelp32Snapshot to enumerate active processes, compared each executable name against a hardcoded array of 24 security vendors…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Kill",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Silenced guard stations",
          "storyExcerpt": "Behind the scenes, silenced guard stations captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Enforce pre-execution blocking of zam64.sys via the Microsoft Vulnerable Driver Blocklist and HVCI driver-load policies (which reject known vulnerable driver hashes inside the kernel loader before any…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Enroll Desk",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Guard Core",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "VIP Pass",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1562.001"
    }
  }
};
