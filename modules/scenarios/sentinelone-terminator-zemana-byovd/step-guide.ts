import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'sentinelone-terminator-zemana-byovd',
    briefing: {
      headline:
        'Sold on cybercrime forums as "Terminator", this EDR killer drops a signed Zemana AntiMalware driver (zam64.sys), registers its own PID in the driver’s allowlist via unauthenticated IOCTL 0x80002010 (CVE-2021-31728), and loops IOCTL 0x80002048 to kill 24+ EDR/AV agents from Ring 0.',
      storyAnalogy:
        'Imagine an armored security van (zam64.sys) that promises it will only take orders from people whose names are written on its VIP clipboard. However, the van has a public window (IOCTL 0x80002010) where any stranger on the street can walk up and say, "Please write my name on the VIP clipboard!" Once their name is on the clipboard, the stranger uses the van’s roof cannon (IOCTL 0x80002048) to blast every police car on the block.',
      plainSummary:
        'Marketed on Russian cybercrime forums in May 2023 for $3,000 as a zero-day EDR bypass and rapidly reverse-engineered by SentinelOne and CrowdStrike, "Terminator" is a BYOVD wrapper abusing zam64.sys (a legitimate, Microsoft-signed kernel driver from Zemana AntiMalware vulnerable to CVE-2021-31728). Terminator drops zam64.sys under a random filename, calls DeviceIoControl with 0x80002010 to add its own PID to the driver’s internal trusted process list, and then loops 0x80002048 (ZwTerminateProcess) to kill processes belonging to 24 security vendors.',
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
          'When executed with administrator privileges, Terminator.exe wrote an embedded copy of zam64.sys (a kernel driver validly signed by Zemana Ltd. and countersigned by Microsoft) into C:\\Windows\\System32\\drivers\\ using a randomly generated 5-to-10 character .sys filename (evading naive detection rules that only check if the file path ends in zam64.sys) and started the kernel service via the Service Control Manager.',
        howItWorksInPractice:
          'Regardless of the randomized .sys filename on disk, the driver’s DriverEntry routine always creates the fixed device symbolic link \\\\.\\ZemanaAntiMalware (or \\\\.\\B94B8021-5217-4091-96E5-6353272B9429).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Terminator.exe User-Mode Binary to the Signed Zemana Driver (zam64.sys) as the randomized service is loaded.',
        detectionAndEvidence:
          'Sysmon EventID 6 matching the SHA-256 hash, PE OriginalFileName (zam64.sys / zamguard64.sys), or Zemana Ltd. certificate thumbprint regardless of filename.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1068',
        plainTitle: 'Self-Allowlisting Caller PID via Unauthenticated IOCTL 0x80002010 (CVE-2021-31728)',
        storyAnalogy:
          'The driver checks an internal VIP list before running dangerous commands, but leaves the "Add Me to the VIP List" button completely unguarded.',
        simpleExplanation:
          'Although zam64.sys checks an internal allowlist of trusted Process IDs before permitting privileged operations like process termination or raw disk access, it exposes IOCTL 0x80002010 (IOCTL_REGISTER_PROCESS, tracked as CVE-2021-31728, which accepts any 4-byte DWORD Process ID from user mode and appends it to the driver’s Ring-0 trusted process table without verifying the caller’s executable signature). Terminator.exe simply passed GetCurrentProcessId() to 0x80002010 to authorize itself.',
        howItWorksInPractice:
          'Once a PID is registered via 0x80002010, zam64.sys unlocks its full suite of administrative IOCTLs, including process termination, registry manipulation, and direct SCSI/disk read-write, for that caller. In the documented EDR exchange from Perimeter Firewall & NDR Tap to Signed Zemana Driver (zam64.sys), Signed Zemana Driver (zam64.sys) responds with ALERT T1068 (confirming that the Stage 2: Self-Allowlisting Caller PID via Unauthenticated IOCTL 0x80002010 (CVE-2021-31728) request succeeded on Signed Zemana Driver (zam64.sys) and establishing the runtime state required for Step #3 Stage 3: Continuous Ring-0 Termination Loop via IOCTL 0x80002048).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Signed Zemana Driver (zam64.sys) to the IOCTL 0x80002010 Allowlist Bypass node and triggers the SentinelOne / CrowdStrike Behavioral IOA.',
        detectionAndEvidence:
          'Kernel ETW / EDR behavioral monitoring alerting on any process opening \\\\.\\ZemanaAntiMalware and issuing IOCTL 0x80002010.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1562.001',
        plainTitle: 'Continuous Ring-0 Termination Loop via IOCTL 0x80002048',
        storyAnalogy:
          'Now recognized as a VIP by the kernel driver, the attacker’s program runs an endless loop telling the driver to shoot down every security process that appears.',
        simpleExplanation:
          'In an infinite while (true) loop, Terminator.exe called CreateToolhelp32Snapshot to enumerate active processes, compared each executable name against a hardcoded array of 24 security vendors (CrowdStrike, SentinelOne, Defender, Sophos, Cortex XDR, Kaspersky, McAfee, Trend Micro, etc.), and sent IOCTL 0x80002048 with the matching PID (causing zam64.sys to call ZwTerminateProcess from Ring 0 and bypass User-Mode PPL protections).',
        howItWorksInPractice:
          'Modern EDRs neutralize Terminator prior to 0x80002048 by blocking the load of zam64.sys at NtLoadDriver / DriverLoad time using behavioral prevention and kernel blocklists. In the documented EDR exchange from Signed Zemana Driver (zam64.sys) to IOCTL 0x80002010 Allowlist Bypass, IOCTL 0x80002010 Allowlist Bypass responds with ALERT T1562.001 (confirming that the Stage 3: Continuous Ring-0 Termination Loop via IOCTL 0x80002048 request succeeded on IOCTL 0x80002010 Allowlist Bypass and completing the final execution objective of Terminator EDR Killer Abusing Signed Zemana AntiMalware Driver (zam64.sys / CVE-2021-31728)).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the Allowlist Bypass node invoking IOCTL 0x80002048 Ring-0 Process Kill against endpoint security agents.',
        detectionAndEvidence:
          'Pre-execution blocking of zam64.sys via Microsoft Vulnerable Driver Blocklist and EDR driver-load prevention policies.',
      },
    ],
  };
