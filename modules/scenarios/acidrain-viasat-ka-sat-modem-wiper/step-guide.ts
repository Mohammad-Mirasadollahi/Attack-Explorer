import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

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
