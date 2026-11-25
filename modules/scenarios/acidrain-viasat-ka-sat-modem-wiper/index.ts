import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'acidrain-viasat-ka-sat-modem-wiper',
    title: 'AcidRain MIPS ELF Satellite Modem Wiper (/dev/mtd MEMERASE / Viasat KA-SAT)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1561.001',
    description:
      'Attributed to Russian GRU actors during the February 2022 Viasat KA-SAT intrusion, the AcidRain 32-bit MIPS ELF wiper is pushed via the TR-069 management plane to tens of thousands of SurfBeam2 satellite modems, recursively wiping filesystems and issuing MEMERASE, MEMWRITEOOB, and MEMUNLOCK IOCTLs against /dev/mtd* SPI flash memory.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Compromised SATCOM TR-069 ACS Server', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'KA-SAT SurfBeam2 Modem (ukrop ELF)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Linux MTD Subsystem (/dev/mtd0..99)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'SentinelOne / Viasat SATCOM Telemetry', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Bricked SPI NOR/NAND Flash & Turbines', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Management Plane Compromise & TR-069 CWMP Push of MIPS ELF Binary (ukrop)',
        narration:
          'After breaching a misconfigured VPN into the trusted Viasat KA-SAT ground management segment, the attackers abuse the TR-069 Auto-Configuration Server (ACS) to push a 32-bit big-endian MIPS ELF binary (`ukrop` / AcidRain) to tens of thousands of SurfBeam2 satellite modems simultaneously.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Initial Access & Execution (T1199 - Trusted Relationship / TR-069 Management Plane)',
        technicalCommands: [
          'TR-069 CWMP Download RPC -> Pushes 32-bit MIPS ELF (/tmp/ukrop) to SurfBeam2 UT (User Terminals)',
          'Forks daemon process & iterates non-standard filesystem directories for recursive overwrite',
        ],
        defenseMitigation:
          'Cryptographically sign all firmware and management commands pushed via TR-069/CWMP and strictly segment satellite ground-station management networks with hardware MFA and command rate-limiting.',
        logs: [
          {
            id: 'acid-1',
            timestamp: '03:02:05.114',
            source: 'Firewall',
            severity: 'critical',
            raw: 'SATCOM Management Plane Alert | Protocol: TR-069 (CWMP) | Source: ACS Ground Segment | TargetFleet: SurfBeam2 Modems | PushedBinary: /tmp/ukrop (ELF 32-bit MSB executable, MIPS, MIPS32 version 1 - AcidRain Wiper)',
            parsedFields: {
              DeliveryMechanism: 'TR-069 CWMP Management Plane Push',
              BinaryPath: '/tmp/ukrop (AcidRain Wiper)',
              Architecture: '32-bit MIPS Big-Endian ELF',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Block Device Enumeration (/dev/sda, /dev/mmcblk) & Sequential Overwrite',
        narration:
          'Running as root (UID 0), AcidRain first recursively overwrites non-system files on the root filesystem, then loops through every standard storage block device identifier (/dev/sda..z, /dev/hda..z, /dev/VG/LV, /dev/mmcblk0..9) and overwrites up to 384KB with random or zero bytes.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Impact (T1561.002 - Disk Structure Wipe)',
        technicalCommands: [
          'Iterate block devices: /dev/sda..z, /dev/hda..z, /dev/mtdblock0..99, /dev/mmcblk0..9',
          'open(dev, O_WRONLY) -> Overwrite initial sectors & issue BLKSECDISCARD / BLKDISCARD IOCTLs',
        ],
        defenseMitigation:
          'Enforce read-only SquashFS root filesystems and mandatory code-signing (`IMA/EVM`) on embedded Linux routers and SATCOM terminals.',
        logs: [
          {
            id: 'acid-2',
            timestamp: '03:02:09.450',
            source: 'EDR',
            severity: 'critical',
            raw: 'Embedded Linux Storage Wipe Alert | Process: /tmp/ukrop (UID 0) | EnumeratedDevices: /dev/sda..z, /dev/mmcblk0..9, /dev/mtdblock0..99 | IssuedIOCTLs: BLKDISCARD (0x1277), BLKSECDISCARD (0x127d)',
            parsedFields: {
              TargetedBlockDevices: '/dev/sd*, /dev/hd*, /dev/mmcblk*, /dev/mtdblock*',
              BlockEraseIoctls: 'BLKDISCARD, BLKSECDISCARD, BLKZEROOUT',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Raw SPI Flash /dev/mtd0..99 Destruction via MEMUNLOCK, MEMERASE & MEMWRITEOOB',
        narration:
          'To permanently brick embedded satellite modems (which store their bootloader and firmware in raw NOR/NAND flash rather than SATA drives), AcidRain opens `/dev/mtd0` through `/dev/mtd99` and issues Linux Memory Technology Device (MTD) IOCTLs `MEMUNLOCK`, `MEMERASE`, and `MEMWRITEOOB` before calling `reboot(RB_AUTOBOOT)`.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Impact (T1495 - Firmware Corruption / T1561.001)',
        technicalCommands: [
          'open("/dev/mtd0" .. "/dev/mtd99", O_RDWR)',
          'ioctl(fd, MEMUNLOCK, &ei) -> ioctl(fd, MEMERASE, &ei) -> ioctl(fd, MEMWRITEOOB, &oob) -> reboot(RB_AUTOBOOT)',
        ],
        defenseMitigation:
          'Hardware-lock bootloader flash sectors (`WP#` pin on SPI NOR flash) so software `MEMUNLOCK` / `MEMERASE` IOCTLs cannot erase the primary U-Boot bootloader partition (`/dev/mtd0`).',
        logs: [
          {
            id: 'acid-3',
            timestamp: '03:02:14.882',
            source: 'EDR',
            severity: 'critical',
            raw: 'Hardware Flash Corruption Alert (SentinelLabs AcidRain) | Device: /dev/mtd0 (U-Boot Bootloader Partition) | Syscalls: ioctl(MEMUNLOCK) -> ioctl(MEMERASE) -> ioctl(MEMWRITEOOB) -> reboot() | Impact: Modem permanently bricked (Factory replacement required)',
            parsedFields: {
              MtdDevicesTargeted: '/dev/mtd0 through /dev/mtd99',
              DestructiveMtdIoctls: 'MEMUNLOCK, MEMERASE, MEMWRITEOOB',
              PhysicalImpact: '40,000+ SATCOM Modems & 5,800 Enercon Wind Turbines Offline',
            },
          },
        ],
        packets: [],
      },
    ],
  };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'acidrain-viasat-ka-sat-modem-wiper',
    briefing: {
      headline:
        'Pushed via the TR-069 management plane during the February 2022 Viasat KA-SAT cyberattack, the AcidRain 32-bit MIPS ELF wiper bricks tens of thousands of SurfBeam2 satellite modems by issuing MEMUNLOCK, MEMERASE, and MEMWRITEOOB IOCTLs against /dev/mtd* SPI flash memory.',
      storyAnalogy:
        'Imagine 40,000 remote satellite dishes across Europe that all listen to a single central control tower (TR-069 ACS) for automatic software updates. Saboteurs break into the control tower and broadcast a tiny self-destruct program (AcidRain / ukrop) that tells every satellite modem not just to delete its files, but to use a blowtorch (MEMERASE / MEMWRITEOOB IOCTLs) to melt the permanent flash memory chip (/dev/mtd*) holding its startup brain, turning the hardware into a dead brick.',
      plainSummary:
        'In this scenario (T1199, AcidRain MIPS ELF Satellite Modem Wiper (/dev/mtd MEMERASE / Viasat KA-SAT)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: management Plane Compromise, then block Device Enumeration, then raw SPI Flash /dev/mtd0..99 Destruction. Steps #1–#3 walk that chain end-to-end by covering Management Plane Compromise, then Block Device Enumeration, then Raw SPI Flash /dev/mtd0..99 Destruction, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'Compromised SATCOM TR-069 ACS Server -> KA-SAT SurfBeam2 Modem (ukrop ELF) -> Linux MTD Subsystem (/dev/mtd0..99) -> Bricked SPI NOR/NAND Flash & Turbines -> SentinelOne / Viasat SATCOM Telemetry.',
      documentedAdvisory:
        'SentinelLabs AcidRain: A Modem Wiper Rains Down on Europe / Viasat KA-SAT Incident Report / CISA & NSA SATCOM Advisory AA22-076A',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1199',
        plainTitle: 'Management Plane Compromise & TR-069 CWMP Push of MIPS ELF Binary (ukrop)',
        storyAnalogy:
          'Rather than hacking 40,000 modems over the air one by one, the attackers hijack the central ground station that every modem trusts for remote management commands.',
        simpleExplanation:
          'After exploiting a VPN misconfiguration to enter the trusted management segment of the Viasat KA-SAT ground network, the threat actors issued mass management commands over the TR-069 (CWMP) protocol to deliver and execute a 140KB statically linked 32-bit MIPS ELF binary named ukrop (AcidRain) across tens of thousands of online SurfBeam2 satellite modems.',
        howItWorksInPractice:
          'Because ukrop had zero external library dependencies and brute-forced every conceivable Linux storage device path, it served as a universal embedded Linux/router/modem wiper. In the documented Firewall exchange from Compromised SATCOM TR-069 ACS Server to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK T1199 (confirming that the Stage 1: Management Plane Compromise & TR-069 CWMP Push of MIPS ELF Binary (ukrop) request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: Block Device Enumeration (/dev/sda, /dev/mmcblk) & Sequential Overwrite).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Compromised SATCOM TR-069 ACS Server to the KA-SAT SurfBeam2 Modem (ukrop ELF).',
        detectionAndEvidence:
          'Monitor SATCOM management-plane telemetry for sudden mass TR-069 Download or firmware execution broadcasts (which deviate sharply from staged maintenance waves) paired with embedded host alerts for unsigned ELF binaries executing out of /tmp. Correlate Sysmon or Windows Security Event telemetry for T1199 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1561.002',
        plainTitle: 'Block Device Enumeration (/dev/sda, /dev/mmcblk) & Sequential Overwrite',
        storyAnalogy:
          'First, the wiper walks through every possible hard drive, SD card, and flash partition name in the Linux dictionary and scrambles their contents.',
        simpleExplanation:
          'Forking into the background as root (UID 0), AcidRain first recursively overwrote files across non-essential filesystem directories, then systematically generated device paths for /dev/sda../dev/sdz, /dev/hda../dev/hdz, /dev/mmcblk0../dev/mmcblk9, and /dev/mtdblock0../dev/mtdblock99 (overwriting the first 384KB of each device and issuing BLKDISCARD, BLKSECDISCARD, and BLKZEROOUT kernel IOCTLs to erase storage blocks).',
        howItWorksInPractice:
          'By brute-forcing hundreds of device node names in a loop, AcidRain did not need to parse /proc/partitions or sysfs and worked across any embedded Linux distribution. In the documented EDR exchange from Perimeter Firewall & NDR Tap to KA-SAT SurfBeam2 Modem (ukrop ELF), KA-SAT SurfBeam2 Modem (ukrop ELF) responds with ALERT T1561.002 (confirming that the Stage 2: Block Device Enumeration (/dev/sda, /dev/mmcblk) & Sequential Overwrite request succeeded on KA-SAT SurfBeam2 Modem (ukrop ELF) and establishing the runtime state required for Step #3 Stage 3: Raw SPI Flash /dev/mtd0..99 Destruction via MEMUNLOCK, MEMERASE & MEMWRITEOOB).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the SurfBeam2 Modem (ukrop ELF) to the Linux MTD & Block Subsystem and triggers the SentinelOne / Viasat SATCOM Telemetry sensor.',
        detectionAndEvidence:
          'Enable embedded Linux syscall auditing (monitoring low-level kernel open and write calls) alerting whenever processes other than signed firmware upgrade daemons open /dev/mtdblock* or /dev/mmcblk* with O_WRONLY or O_RDWR write flags. Correlate Sysmon or Windows Security Event telemetry for T1561.002 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1495',
        plainTitle: 'Raw SPI Flash /dev/mtd0..99 Destruction via MEMUNLOCK, MEMERASE & MEMWRITEOOB',
        storyAnalogy:
          'Finally, the wiper unlocks the raw silicon flash chip holding the modem’s bootloader (U-Boot), erases every sector, and reboots, leaving the modem unable to ever turn back on.',
        simpleExplanation:
          'For character-mode flash devices /dev/mtd0 through /dev/mtd99, AcidRain queried flash geometry via MEMGETINFO and then looped through every eraseblock issuing ioctl(fd, MEMUNLOCK) (unlocking software-protected flash sectors), ioctl(fd, MEMERASE) (physically erasing NOR/NAND flash blocks to 0xFF), and ioctl(fd, MEMWRITEOOB) (corrupting NAND flash Out-Of-Band ECC metadata), before invoking reboot(RB_AUTOBOOT) to permanently brick the modem.',
        howItWorksInPractice:
          'Because /dev/mtd0 holds the primary U-Boot bootloader on embedded MIPS routers and satellite modems, erasing /dev/mtd0 rendered the modems physically unbootable and required physical hardware replacement or JTAG/SPI chip reflashing. In the documented EDR exchange from KA-SAT SurfBeam2 Modem (ukrop ELF) to Linux MTD Subsystem (/dev/mtd0..99), Linux MTD Subsystem (/dev/mtd0..99) responds with ALERT T1495 (confirming that the Stage 3: Raw SPI Flash /dev/mtd0..99 Destruction via MEMUNLOCK, MEMERASE & MEMWRITEOOB request succeeded on Linux MTD Subsystem (/dev/mtd0..99) and completing the final execution objective of AcidRain MIPS ELF Satellite Modem Wiper (/dev/mtd MEMERASE / Viasat KA-SAT)).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the Linux MTD Subsystem (/dev/mtd0..99) executing MEMERASE to leave Bricked SPI NOR/NAND Flash & Turbines.',
        detectionAndEvidence:
          'Hardware write-protect strapping (WP# pin grounded) on bootloader SPI NOR flash regions so software MEMUNLOCK/MEMERASE IOCTLs are rejected by the flash chip hardware. Correlate Sysmon or Windows Security Event telemetry for T1495 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a satellite television control hub wired to tens of thousands of rooftop receiver boxes across an entire continent. Breaking into the trusted central management deck, a saboteur pushes one tiny remote-maintenance package down to every rooftop dish simultaneously; inside each box, the package first sweeps all ordinary storage cards and then fires raw hardware erase bolts directly into the soldered memory chips themselves, permanently silencing tens of thousands of satellite modems in one stroke.',
      storyMappings: [
        {
          storyTerm: 'Central management deck pushing one maintenance package to every dish',
          technicalTerm: 'Management plane compromise and mass TR-069 CWMP push of MIPS ELF wiper (ukrop)',
          tone: 'amber',
        },
        {
          storyTerm: 'Sweeping all ordinary storage cards sequentially',
          technicalTerm: 'Recursive overwrite of /dev/sda, /dev/mmcblk, and non-essential filesystem directories',
          tone: 'sky',
        },
        {
          storyTerm: 'Firing raw hardware erase bolts into soldered memory chips',
          technicalTerm: 'Raw SPI flash /dev/mtd0..99 destruction via MEMUNLOCK, MEMERASE, and MEMWRITEOOB',
          tone: 'rose',
        },
        {
          storyTerm: 'Permanently silencing tens of thousands of satellite modems',
          technicalTerm: 'Irrecoverable bricking of Viasat KA-SAT consumer and wind-turbine terminals',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Slipping past a misconfigured perimeter gate into the satellite ground-station master control room, the saboteur hijacks the official remote-update broadcaster and beams a tiny specialized demolition program simultaneously into tens of thousands of distant rooftop modems.',
        storyMappings: [
          {
            storyTerm: 'Satellite ground-station master control room',
            technicalTerm: 'Trusted management segment of the Viasat KA-SAT satellite network',
            tone: 'amber',
          },
          {
            storyTerm: 'Official remote-update broadcaster',
            technicalTerm: 'TR-069 CPE WAN Management Protocol (CWMP) pushing mass firmware commands',
            tone: 'sky',
          },
          {
            storyTerm: 'Tiny specialized demolition program',
            technicalTerm: 'Compact MIPS ELF AcidRain wiper binary (ukrop) staged into /tmp',
            tone: 'rose',
          },
          {
            storyTerm: 'Simultaneous fleet-wide arrival',
            technicalTerm: 'Mass execution across tens of thousands of SurfBeam 2 embedded Linux modems',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor SATCOM management-plane telemetry for sudden mass TR-069 Download or firmware execution broadcasts (which deviate sharply from staged maintenance waves) paired with embedded host alerts for unsigned ELF binaries executing out of /tmp. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1199 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      2: {
        storyAnalogy:
          'Waking up inside each modem with master system authority, the demolition program forks quietly into the background and sweeps across every attached storage partition and memory card, scrubbing every directory clean before turning to the raw hardware chips.',
        storyMappings: [
          {
            storyTerm: 'Forking quietly into the background with master authority',
            technicalTerm: 'AcidRain daemonizing as root (UID 0) on the embedded Linux modem OS',
            tone: 'amber',
          },
          {
            storyTerm: 'Sweeping every attached storage partition and memory card',
            technicalTerm: 'Iterative overwrite across /dev/sda*, /dev/mmcblk*, and non-essential directories',
            tone: 'sky',
          },
          {
            storyTerm: 'Writing straight over raw block devices',
            technicalTerm: 'Opening /dev/mtdblock* and /dev/mmcblk* with O_WRONLY / O_RDWR flags',
            tone: 'rose',
          },
          {
            storyTerm: 'Embedded system watchman catching the wipe',
            technicalTerm: 'Syscall auditing alerting on raw block-device writes outside firmware upgraders',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Enable embedded Linux syscall auditing (monitoring low-level kernel open and write calls) alerting whenever processes other than signed firmware upgrade daemons open /dev/mtdblock* or /dev/mmcblk* with O_WRONLY or O_RDWR write flags. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1561.002 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      3: {
        storyAnalogy:
          'Finally, the wiper speaks straight to the modem raw soldered flash chips from slot zero through ninety-nine, reading each chip physical geometry, flipping off hardware write-locks, and issuing direct chip-erase pulses so the modem cannot even read its own startup instructions after reboot.',
        storyMappings: [
          {
            storyTerm: 'Raw soldered flash chips from slot zero through ninety-nine',
            technicalTerm: 'Character-mode Memory Technology Devices /dev/mtd0 through /dev/mtd99',
            tone: 'amber',
          },
          {
            storyTerm: 'Reading physical geometry and flipping off hardware locks',
            technicalTerm: 'Linux MTD ioctl calls MEMGETINFO followed by MEMUNLOCK',
            tone: 'sky',
          },
          {
            storyTerm: 'Direct chip-erase pulses destroying startup instructions',
            technicalTerm: 'Raw hardware flash erasure via MEMERASE and MEMWRITEOOB ioctls',
            tone: 'rose',
          },
          {
            storyTerm: 'Permanently silenced hardware requiring physical replacement',
            technicalTerm: 'Unbootable bricked modems requiring hardware swap across European deployments',
            tone: 'emerald',
          },
        ],
      },
    },
  };
