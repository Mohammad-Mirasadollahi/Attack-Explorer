import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
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
  };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'sentinelone-terminator-zemana-byovd',
    briefing: {
      headline:
        'Sold on cybercrime forums as "Terminator", this EDR killer drops a signed Zemana AntiMalware driver (zam64.sys), registers its own PID in the driver’s allowlist via unauthenticated IOCTL 0x80002010 (CVE-2021-31728), and loops IOCTL 0x80002048 to kill 24+ EDR/AV agents from Ring 0.',
      storyAnalogy:
        'Imagine an armored security van (zam64.sys) that promises it will only take orders from people whose names are written on its VIP clipboard. However, the van has a public window (IOCTL 0x80002010) where any stranger on the street can walk up and say, "Please write my name on the VIP clipboard!" Once their name is on the clipboard, the stranger uses the van’s roof cannon (IOCTL 0x80002048) to blast every police car on the block.',
      plainSummary:
        'In this scenario (T1068, Terminator EDR Killer Abusing Signed Zemana AntiMalware Driver (zam64.sys / CVE-2021-31728)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: dropping Randomized Signed Zemana Driver, then self-Allowlisting Caller PID, then continuous Ring-0 Termination Loop via IOCTL. Steps #1–#3 walk that chain end-to-end by covering Dropping Randomized Signed Zemana Driver, then Self-Allowlisting Caller PID, then Continuous Ring-0 Termination Loop via IOCTL, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 6 with the documented host and network chain.',
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
          'Regardless of the randomized .sys filename on disk, the driver’s DriverEntry routine always creates the fixed device symbolic link \\\\.\\ZemanaAntiMalware (or \\\\.\\B94B8021-5217-4091-96E5-6353272B9429). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Terminator.exe User-Mode Binary to the Signed Zemana Driver (zam64.sys) as the randomized service is loaded.',
        detectionAndEvidence:
          'Sysmon EventID 6 matching the SHA-256 hash, PE OriginalFileName (zam64.sys / zamguard64.sys), or Zemana Ltd. certificate thumbprint regardless of filename. Preserve the raw event fields and the related containment ticket for forensic replay.',
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
          'Enforce pre-execution blocking of zam64.sys via the Microsoft Vulnerable Driver Blocklist and HVCI driver-load policies (which reject known vulnerable driver hashes inside the kernel loader before any IOCTL device link can be created). Correlate Sysmon or Windows Security Event telemetry for T1562.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
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
          'Enforce pre-execution blocking of zam64.sys via the Microsoft Vulnerable Driver Blocklist and HVCI driver-load policies (which reject known vulnerable driver hashes inside the kernel loader before any IOCTL device link can be created). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1562.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    },
  };
