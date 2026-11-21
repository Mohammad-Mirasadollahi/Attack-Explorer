import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a master lockpicker who does not even need to smuggle a retired third-party pass card into the building because the building\'s own built-in security gatekeeper carries a subtle hidden crack. Opening a direct talk window to that native gatekeeper, the lockpicker sends a precision knock that flips their own hallway badge status from ordinary visitor to supreme core insider, allowing them to walk straight behind the control board and unplug every alarm bell and threat-reporting wire silently.',
      storyMappings: [
        {
          storyTerm: 'Opening a talk window to the building\'s own native gatekeeper',
          technicalTerm: 'Opening a handle to built-in Windows AppLocker driver (appid.sys / \\Device\\AppId)',
          tone: 'amber',
        },
        {
          storyTerm: 'Precision knock flipping badge status from visitor to supreme insider',
          technicalTerm: 'CVE-2024-21338 IOCTL 0x22A018 arbitrary kernel write flipping KTHREAD PreviousMode to 0',
          tone: 'sky',
        },
        {
          storyTerm: 'Unplugging every alarm bell and threat-reporting wire silently',
          technicalTerm: 'FUDModule zeroing PspCreateProcessNotifyRoutine callbacks and EtwThreatIntProvRegHandle',
          tone: 'rose',
        },
        {
          storyTerm: 'Zero foreign third-party pass cards needed',
          technicalTerm: 'Bring-Your-Own-Zero-Day against native signed Windows kernel driver appid.sys',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Running from an elevated service desk, the intruder\'s launcher skips dropping any noisy external pass card altogether and instead opens a direct communication window to the building\'s own built-in application-control gatekeeper.',
        storyMappings: [
          {
            storyTerm: 'Building\'s own built-in application-control gatekeeper',
            technicalTerm: 'Native Microsoft Windows AppLocker driver appid.sys (\\Device\\AppId)',
            tone: 'amber',
          },
          {
            storyTerm: 'Skipping noisy external pass cards',
            technicalTerm: 'Evading Microsoft Vulnerable Driver Blocklist rules targeting third-party BYOVD drivers',
            tone: 'sky',
          },
          {
            storyTerm: 'Opening a direct communication window',
            technicalTerm: 'Non-standard service opening \\Device\\AppId to dispatch IOCTL 0x22A018',
            tone: 'rose',
          },
          {
            storyTerm: 'Elevated local prerequisite',
            technicalTerm: 'LOCAL SERVICE / administrator context needed to reach the AppLocker device handle',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor kernel handle and IOCTL telemetry (tracking user-mode processes talking to protected OS device links) for any non-standard service opening \\Device\\AppId and issuing IOCTL 0x22A018 (the exact CVE-2024-21338 Lazarus FUDModule trigger). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1068 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      2: {
        storyAnalogy:
          'Slipping a carefully sculpted control note through that native window, the lockpicker triggers an unchecked pointer jump inside the central control room that flips one single privilege flag on the intruder\'s own badge from Visitor (1) straight to Core Insider (0), handing the intruder unrestricted read-and-write power over the entire core engine.',
        storyMappings: [
          {
            storyTerm: 'Carefully sculpted control note',
            technicalTerm: 'Crafted IOCTL 0x22A018 input buffer triggering CVE-2024-21338 in appid.sys',
            tone: 'amber',
          },
          {
            storyTerm: 'Flipping one single flag from Visitor (1) to Core Insider (0)',
            technicalTerm: 'Overwriting current KTHREAD PreviousMode field from UserMode (1) to KernelMode (0)',
            tone: 'sky',
          },
          {
            storyTerm: 'Unrestricted read-and-write power over the core engine',
            technicalTerm: 'Data-only kernel arbitrary R/W via NtReadVirtualMemory / NtWriteVirtualMemory',
            tone: 'rose',
          },
          {
            storyTerm: 'Zero foreign custom instructions needed',
            technicalTerm: 'Bypassing HVCI / SMEP by manipulating kernel data structures without executing new code',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate kernel ETW and crash-analysis telemetry (low-level kernel integrity monitoring) flagging IOCTL 0x22A018 dispatched to appid.sys followed immediately by anomalous KTHREAD PreviousMode transitions from 1 to 0. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1562.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      3: {
        storyAnalogy:
          'Wielding pure data-only master access across the core control room, the stealth module erases every security-guard alarm wire and blinds the central threat-reporting feed so subsequent espionage runs completely unseen.',
        storyMappings: [
          {
            storyTerm: 'Erasing every security-guard alarm wire',
            technicalTerm: 'Zeroing PspCreateProcessNotifyRoutine and kernel object callbacks via DKOM',
            tone: 'amber',
          },
          {
            storyTerm: 'Blinding the central threat-reporting feed',
            technicalTerm: 'Tampering with EtwThreatIntProvRegHandle to silence ETW-TI security reporting',
            tone: 'sky',
          },
          {
            storyTerm: 'Core integrity watchdog catching tampered tables',
            technicalTerm: 'PatchGuard / Defender Kernel Integrity alerts on modified callback arrays',
            tone: 'rose',
          },
          {
            storyTerm: 'Stealthy unmonitored handoff',
            technicalTerm: 'Unmonitored follow-on credential theft and Lazarus espionage deployment',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor Kernel Patch Protection (PatchGuard) and Defender Kernel Integrity alerts (ring-0 self-protection checks validating kernel callback arrays) for tampering against PspCreateProcessNotifyRoutine and EtwThreatIntProvRegHandle. Correlate Sysmon Event 1 and Windows Security Event telemetry for T1003.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    },
  };
