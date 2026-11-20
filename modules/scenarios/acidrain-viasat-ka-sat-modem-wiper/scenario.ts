import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

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
