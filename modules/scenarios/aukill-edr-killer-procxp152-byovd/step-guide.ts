import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'aukill-edr-killer-procxp152-byovd',
    briefing: {
      headline:
        'Ransomware affiliates deploy AuKill ("EDRKiller"), dropping an older Microsoft-signed Sysinternals Process Explorer driver (PROCEXP152.SYS v16.32) to send IOCTL 0x8335003C and 0x83350004 and terminate Protected Process Light (PPL) EDR agents from Ring 0.',
      storyAnalogy:
        'Imagine a building where normal workers are forbidden from touching the security cameras (Protected Process Light). However, an old master maintenance robot built by the building’s own manufacturer (Sysinternals PROCEXP152.SYS) has a valid master badge and will obey anyone who pushes its buttons (IOCTL 0x8335003C). A burglar wheels the old maintenance robot out of a backpack and orders it to unplug every security camera in the building.',
      plainSummary:
        'Dissected by Sophos X-Ops and Elastic Security Labs in 2023 across Medusa Locker and LockBit intrusions, AuKill is a C++ Bring Your Own Vulnerable Driver (BYOVD) tool. It drops version 16.32 of Microsoft’s signed Sysinternals Process Explorer kernel driver (PROCEXP152.SYS) into System32\\drivers and issues DeviceIoControl codes 0x8335003C (open protected process handle) and 0x83350004 (close handle) to strip handles and kill PPL-protected EDR/AV services from Ring 0.',
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
          'Running with local administrator rights, AuKill unpacked an embedded resource containing version 16.32 of PROCEXP152.SYS into C:\\Windows\\System32\\drivers\\PROCEXP152.SYS and loaded it via CreateServiceW / StartServiceW (bypassing Windows Driver Signature Enforcement because PROCEXP152.SYS v16.32 carries a valid Microsoft Windows Hardware Compatibility Publisher Authenticode signature).',
        howItWorksInPractice:
          'While newer versions of Sysinternals Process Explorer (v17.0+) added security descriptor checks restricting driver access, version 16.32 permitted any local administrator process to open its device object. In the documented EventID 6 exchange from AuKill User-Mode Controller to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK 6 (confirming that the Stage 1: Dropping & Registering Vulnerable Signed PROCEXP152.SYS v16.32 request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: Opening \\.\PROCEXP152 & Issuing IOCTL 0x8335003C / 0x83350004).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the AuKill User-Mode Controller to the SCM Service (PROCEXP152.SYS v16.32) during driver installation.',
        detectionAndEvidence:
          'Sysmon EventID 6 (DriverLoaded) for PROCEXP152.SYS (version 16.32) where the parent/creator process is not a signed procexp.exe or procexp64.exe binary.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: 'Opening \\\\.\\PROCEXP152 & Issuing IOCTL 0x8335003C / 0x83350004',
        storyAnalogy:
          'Once the maintenance robot is switched on in the kernel room, the attacker’s program sends rapid-fire remote control codes telling it which security guard badges to grab and tear up.',
        simpleExplanation:
          'AuKill opened a file handle to \\\\.\\PROCEXP152 and spawned multiple worker threads that enumerated running processes and handles, invoking DeviceIoControl with IOCTL 0x8335003C (IOCTL_OPEN_PROTECTED_PROCESS_HANDLE, which calls ZwOpenProcess from Ring-0 kernel mode to return a full-access handle to any Protected Process Light PID) and IOCTL 0x83350004 (IOCTL_CLOSE_HANDLE, which forces the kernel to close every active handle held by the target security service).',
        howItWorksInPractice:
          'Normally, Windows blocks user-mode administrators from opening PROCESS_TERMINATE handles to PsProtectedSignerAntimalware-Light (PPL) processes, but a ZwOpenProcess call originating from a Ring-0 kernel driver (KernelMode previous mode) bypasses PPL checks completely.',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the PROCEXP152.SYS service to the DeviceIoControl (0x8335003C / 0004) dispatch handler and triggers the Sophos X-Ops / Elastic WDAC sensor.',
        detectionAndEvidence:
          'ETW Microsoft-Windows-Kernel-File events showing non-Sysinternals binaries opening \\Device\\PROCEXP152 and issuing IOCTLs 0x8335003C or 0x83350004.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1486',
        plainTitle: 'Ring-0 Termination of PPL EDR Sensors & Ransomware Detonation',
        storyAnalogy:
          'With every camera and alarm ripped out from the inside, the ransomware crew walks in and locks every file server in silence.',
        simpleExplanation:
          'Using the Ring-0 handle returned by 0x8335003C and the handle-closing primitive 0x83350004, AuKill continuously terminated processes and services matching Microsoft Defender (MsMpEng.exe), Sophos, Elastic, SentinelOne, and Carbon Black, clearing the way for immediate detonation of Medusa Locker or LockBit ransomware.',
        howItWorksInPractice:
          'AuKill keeps its worker threads running in the background during encryption so if the Windows Service Control Manager attempts to restart a crashed EDR service, AuKill kills the new PID within milliseconds. In the documented EventID 5 exchange from SCM Service (PROCEXP152.SYS v16.32) to DeviceIoControl (0x8335003C / 0004), DeviceIoControl (0x8335003C / 0004) responds with ACK 5 (confirming that the Stage 3: Ring-0 Termination of PPL EDR Sensors & Ransomware Detonation request succeeded on DeviceIoControl (0x8335003C / 0004) and completing the final execution objective of AuKill EDR Killer Abusing Signed Sysinternals PROCEXP152.SYS (BYOVD)).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the DeviceIoControl handler neutralizing Terminated PPL EDR & AV Services.',
        detectionAndEvidence:
          'Enabling Microsoft’s Vulnerable Driver Blocklist (SiPolicy.p7b + HVCI) to prevent PROCEXP152.SYS v16.32 from loading in the first place.',
      },
    ],
  };
