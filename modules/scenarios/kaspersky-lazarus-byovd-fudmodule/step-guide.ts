import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'kaspersky-lazarus-byovd-fudmodule',
    briefing: {
      headline: 'Scenario Briefing: Lazarus Group FudModule Rootkit, Admin-to-Kernel Zero-Day (CVE-2024-21338) Blinding Windows EDR',
      storyAnalogy:
        'In the past, attackers who wanted to cut the security cameras inside the Windows kernel had to smuggle an old, flawed third-party security guard (Bring Your Own Vulnerable Driver) into the building, which modern Windows blocklists immediately spot at gate. In this scenario, Lazarus Group found a zero-day flaw (CVE-2024-21338) in a guard who is already hired and pre-installed inside every Windows building (appid.sys, the built-in AppLocker driver). By whispering a forged instruction (IOCTL 0x22A018) to appid.sys, the attacker tricks the driver into flipping their own clearance badge from "Visitor (UserMode = 1)" to "Supreme Kernel Architect (KernelMode = 0)", and then quietly unplugs the EDR security agent’s cameras (Kernel Callbacks & ETW) without turning the EDR light off.',
      plainSummary:
        'Discovered by Avast and analyzed by Kaspersky and Microsoft (February 2024), this scenario shows how the Lazarus Group upgraded their FudModule rootkit. Previously, attackers had to drop a vulnerable third-party driver onto the system (Bring Your Own Vulnerable Driver, which Microsoft’s Vulnerable Driver Blocklist now blocks). Here, Lazarus exploited a zero-day flaw inside Windows’ own built-in AppLocker driver (appid.sys, CVE-2024-21338, pre-installed and signed by Microsoft on every Windows machine). By sending a crafted IOCTL control code (0x22A018) to appid.sys, the attacker flips their thread’s kernel privilege bit (PreviousMode = 0) and zeroes out the kernel callback tables and ETW sensors that EDR agents rely on.',
      diagramTopologySummary:
        'On the diagram: From a local admin/service foothold (Node ①/②), the attacker runs the FudModule DLL on Node ③ (Windows Host). Node ④ (FudModule IOCTL Exploit) targets the built-in Windows driver appid.sys (CVE-2024-21338) to overwrite Node ⑤ (Kernel PspCreateProcessNotifyRoutine & ETW Ti-Sensor), detected via pre-blind telemetry on Node ⑥ (SIEM).',
      documentedAdvisory: 'Avast / Kaspersky Lazarus FudModule Report · Microsoft CVE-2024-21338 · MITRE ATT&CK T1068 / T1562.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1068',
        plainTitle: 'Opening a Handle to the Built-in Windows AppLocker Driver (\\\\.\\ahcache / appid.sys)',
        storyAnalogy:
          'Instead of sneaking an untrusted third-party driver file onto the disk, the attacker simply walks up to the office door of Windows’ own pre-installed AppLocker driver (\\Device\\AppId / appid.sys) using a LOCAL SERVICE badge.',
        simpleExplanation:
          'Because modern Windows blocks untrusted kernel drivers via Driver Signature Enforcement (DSE) and Microsoft’s Vulnerable Driver Blocklist, the attacker does not drop any third-party .sys file onto the disk. Instead, they elevate a user-mode process to LOCAL SERVICE privileges (required because \\Device\\AppId’s access control list only lets LOCAL SERVICE, rather than standard Administrators, open a communication handle to it) and open a device handle to Windows’ own built-in AppLocker driver: C:\\Windows\\System32\\drivers\\appid.sys.',
        howItWorksInPractice:
          'Abusing a pre-installed inbox Windows driver (appid.sys, Living off the Land in the Kernel) completely sidesteps HVCI / Vulnerable Driver Blocklist checks because appid.sys is an official part of the Windows operating system.',
        diagramAlignment:
          'On the diagram, arrow #1→ shows Node ③ (Userland Service Loader) opening a device handle to Node ④ (appid.sys Kernel Driver), with ⇠#1 returning the valid driver handle.',
        detectionAndEvidence:
          'Documented in Avast & Microsoft CVE-2024-21338 Analysis: Non-standard service process opening device handle to \\Device\\AppId and issuing IOCTL 0x22A018.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1068',
        plainTitle: 'Sending a Crafted IOCTL (0x22A018) to Flip Kernel PreviousMode to 0',
        storyAnalogy:
          'Every thread in Windows wears a tag (KTHREAD.PreviousMode) that says 1 (User Mode: check all permissions) or 0 (Kernel Mode: trust everything). By passing a forged pointer in IOCTL 0x22A018, FudModule tricks appid.sys into reaching over and flipping the attacker thread’s tag from 1 to 0.',
        simpleExplanation:
          'FudModule calls DeviceIoControl with control code IOCTL 0x22A018 (which invokes the internal function AipSmartHashImageFile inside appid.sys) and passes a crafted structure containing a spoofed function/object pointer (CVE-2024-21338). This tricks the kernel driver into decrementing the attacker thread’s KTHREAD.PreviousMode byte in kernel memory from 1 (UserMode, where Windows blocks the thread from touching kernel RAM) to 0 (KernelMode, telling the Windows kernel to treat every subsequent NtReadVirtualMemory and NtWriteVirtualMemory call from this thread as if it came from the kernel itself, granting unlimited Ring-0 memory read/write).',
        howItWorksInPractice:
          'When a thread calls NtWriteVirtualMemory, the kernel checks KTHREAD->PreviousMode: if it is 1 (UserMode), the kernel rejects any target address above 0x7FFFFFFEFFFF (protecting kernel space). Once CVE-2024-21338 flips PreviousMode to 0 (KernelMode), the thread can read and overwrite any address in the Windows kernel directly from user mode.',
        diagramAlignment:
          'On the diagram, arrow #2→ sends IOCTL 0x22A018 inside Node ④ (appid.sys!AipSmartHashImageFile), and ⇠#2 flips KTHREAD.PreviousMode = 0.',
        detectionAndEvidence:
          'Documented in Kernel Crash/ETW Telemetry: IOCTL 0x22A018 targeting appid.sys followed by KTHREAD PreviousMode modification.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1562.001',
        plainTitle: 'Zeroing Out Kernel EDR Callbacks & Disabling Windows Threat-Intelligence ETW',
        storyAnalogy:
          'If a burglar shoots out a security camera, the guard desk immediately sees a "CAMERA OFFLINE" alarm. Instead, FudModule leaves the EDR security program running happily so its green status light stays on, while erasing its phone number from the kernel’s notification list (PspCreateProcessNotifyRoutine) so the kernel never tells the EDR about new malware.',
        simpleExplanation:
          'Instead of killing the endpoint’s EDR security service (which would immediately set off a "Sensor Offline" alarm on the SOC dashboard), FudModule uses its new kernel read/write access (Direct Kernel Object Manipulation, DKOM) to overwrite the kernel’s PspCreateProcessNotifyRoutine, PspCreateThreadNotifyRoutine, and ObRegisterCallbacks arrays with zeroes (erasing the kernel notification hooks that tell the EDR whenever a new process or thread starts) and disables EtwThreatIntProvRegHandle (shutting off Microsoft’s Kernel Threat-Intelligence telemetry feed so the EDR agent stays running with a green status light, but is completely blind and deaf).',
        howItWorksInPractice:
          'By surgically zeroing out the callback pointers registered by the security vendor’s kernel driver (.sys) and flipping the ProviderEnableInfo bit on the ETW Threat-Intelligence provider, Lazarus can subsequently dump LSASS and run malware with zero EDR alerts. In the documented Zeek / Suricata NDR exchange from appid.sys (AppLocker Driver) to FUDModule v3 DKOM Engine, FUDModule v3 DKOM Engine responds with ALERT Host/NDR Gap (confirming that the KAOLIN RAT C2 request succeeded on FUDModule v3 DKOM Engine and completing the final execution objective of Kaspersky, Microsoft & Avast, Lazarus Group (Diamond Sleet): appid.sys Zero-Day & FUDModule Rootkit).',
        diagramAlignment:
          'On the diagram, arrow #3→ overwrites Node ⑤ (Kernel Callback Arrays & ETW Handle) from Node ④ while Node ⑥ (SIEM) logs the sudden telemetry heartbeat drop.',
        detectionAndEvidence:
          'Documented by Kaspersky & Avast: Kernel Patch Protection (PatchGuard) / Defender Kernel Integrity alert on PspCreateProcessNotifyRoutine and EtwThreatIntProvRegHandle tampering.',
      },
    ],
  };
