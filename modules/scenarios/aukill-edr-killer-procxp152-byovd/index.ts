import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const scenario: LegacyDraftScenario = {
    id: 'aukill-edr-killer-procxp152-byovd',
    title: 'AuKill EDR Killer Abusing Signed Sysinternals PROCEXP152.SYS (BYOVD)',
    category: 'KERNEL_FIRMWARE_BYOVD',
    mitreId: 'T1562.001',
    description:
      'Ransomware affiliates (Medusa Locker / LockBit) deploy AuKill ("EDRKiller"), which drops an outdated, Microsoft-signed Sysinternals Process Explorer driver (PROCEXP152.SYS v16.32) as a system service and sends IOCTL 0x8335003C and 0x83350004 to close handles and terminate Protected Process Light (PPL) EDR services from Ring 0.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'AuKill User-Mode Controller', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'SCM Service (PROCEXP152.SYS v16.32)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'DeviceIoControl (0x8335003C / 0004)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'Sophos X-Ops / Elastic WDAC Blocklist', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Terminated PPL EDR & AV Services', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Dropping & Registering Vulnerable Signed PROCEXP152.SYS v16.32',
        narration:
          'AuKill unpacks an embedded copy of Sysinternals Process Explorer driver version 16.32 into C:\\Windows\\System32\\drivers\\PROCEXP152.SYS (or a disguised name like rentdrv2.sys) and registers it via CreateServiceW as a kernel driver.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Privilege Escalation (T1543.003 - Windows Service / BYOVD)',
        technicalCommands: [
          'Drop C:\\Windows\\System32\\drivers\\PROCEXP152.SYS (Signed by Microsoft Windows Hardware Compatibility Publisher)',
          'sc.exe create PROCEXP152 type= kernel binPath= "C:\\Windows\\System32\\drivers\\PROCEXP152.SYS" && sc.exe start PROCEXP152',
        ],
        defenseMitigation:
          'Enable the Microsoft Vulnerable Driver Blocklist (`SiPolicy.p7b`) and HVCI so legacy `PROCEXP152.SYS` versions (< v17.0) are blocked from loading into the kernel.',
        logs: [
          {
            id: 'aukill-1',
            timestamp: '04:11:02.119',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 6,
            raw: 'EventID: 6 (DriverLoaded) | ImageLoaded: C:\\Windows\\System32\\drivers\\PROCEXP152.SYS | Version: 16.32 | Signed: true | Signature: Microsoft Windows Hardware Compatibility Publisher | Note: Known BYOVD driver loaded by non-Sysinternals binary',
            parsedFields: {
              DriverPath: 'C:\\Windows\\System32\\drivers\\PROCEXP152.SYS',
              DriverVersion: '16.32 (Vulnerable to Unauthenticated IOCTL)',
              ToolName: 'AuKill (EDRKiller)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Opening \\\\.\\PROCEXP152 & Issuing IOCTL 0x8335003C / 0x83350004',
        narration:
          'AuKill opens a device handle to \\\\.\\PROCEXP152 and spawns continuous worker threads that enumerate running processes for EDR/AV names, invoking DeviceIoControl with IOCTL 0x8335003C (IOCTL_OPEN_PROTECTED_PROCESS_HANDLE) and IOCTL 0x83350004 (IOCTL_CLOSE_HANDLE).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Defense Evasion (T1562.001 - Disable or Modify Tools)',
        technicalCommands: [
          'CreateFileW("\\\\.\\PROCEXP152", GENERIC_READ | GENERIC_WRITE, ...)',
          'DeviceIoControl(hDriver, 0x8335003C, &targetPid, ...) -> ZwOpenProcess + ZwTerminateProcess / ObCloseHandle (0x83350004)',
        ],
        defenseMitigation:
          'Alert on any process other than a verified `procexp64.exe` binary opening a handle to `\\\\.\\PROCEXP152` or loading `PROCEXP152.SYS`.',
        logs: [
          {
            id: 'aukill-2',
            timestamp: '04:11:03.450',
            source: 'EDR',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'aukill.exe',
            raw: 'Kernel Driver Abuse Alert | Caller: C:\\Users\\Public\\aukill.exe | DeviceObject: \\Device\\PROCEXP152 | IssuedIOCTLs: 0x8335003C (Open Protected Process), 0x83350004 (Close Handle) | Target: Protected Process Light (PPL) Security Agents',
            parsedFields: {
              DeviceHandle: '\\\\.\\PROCEXP152',
              OpenProcessIoctl: '0x8335003C',
              CloseHandleIoctl: '0x83350004',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Ring-0 Termination of PPL EDR Sensors & Ransomware Detonation',
        narration:
          'Because PROCEXP152.SYS executes in Ring 0, its calls to ZwTerminateProcess and ObCloseHandle bypass User-Mode Protected Process Light (PPL) boundaries, stripping all active handles and killing Microsoft Defender, Sophos, and Elastic agents immediately prior to LockBit/Medusa ransomware execution.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Impact (T1486 - Data Encrypted for Impact)',
        technicalCommands: [
          'Ring-0 ZwTerminateProcess kills MsMpEng.exe, SophosHealth.exe, and elastic-agent.exe',
          'Launch ransomware encryptor across unmonitored host',
        ],
        defenseMitigation:
          'Combine kernel driver blocklists with tamper-resistant service heartbeats that automatically quarantine hosts from the network switch/VLAN if the EDR sensor stops reporting after a EventID 7045/Sysmon 6 driver load.',
        logs: [
          {
            id: 'aukill-3',
            timestamp: '04:11:05.890',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 5,
            raw: 'EventID: 5 (ProcessTerminated) | TerminatedProcesses: MsMpEng.exe, NisSrv.exe, SophosFileScanner.exe, elastic-agent.exe | Source: Kernel Driver PROCEXP152.SYS | FollowUp: Ransomware payload executed',
            parsedFields: {
              BypassedBoundary: 'Protected Process Light (PsProtectedSignerAntimalware-Light)',
              TerminatedAgents: 'MsMpEng.exe, SophosFileScanner.exe, elastic-agent.exe',
              MitreTechnique: 'T1562.001 (Disable or Modify Tools via BYOVD)',
            },
          },
        ],
        packets: [],
      },
    ],
  };
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'aukill-edr-killer-procxp152-byovd',
    briefing: {
      headline:
        'Ransomware affiliates deploy AuKill ("EDRKiller"), dropping an older Microsoft-signed Sysinternals Process Explorer driver (PROCEXP152.SYS v16.32) to send IOCTL 0x8335003C and 0x83350004 and terminate Protected Process Light (PPL) EDR agents from Ring 0.',
      storyAnalogy:
        'Imagine a building where normal workers are forbidden from touching the security cameras (Protected Process Light). However, an old master maintenance robot built by the building’s own manufacturer (Sysinternals PROCEXP152.SYS) has a valid master badge and will obey anyone who pushes its buttons (IOCTL 0x8335003C). A burglar wheels the old maintenance robot out of a backpack and orders it to unplug every security camera in the building.',
      plainSummary:
        'In this scenario (T1543.003, AuKill EDR Killer Abusing Signed Sysinternals PROCEXP152.SYS (BYOVD)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: dropping, then opening \\\\.\\PROCEXP152, then ring-0 Termination of PPL EDR Sensors. Steps #1–#3 walk that chain end-to-end by covering Dropping, then Opening \\\\.\\PROCEXP152, then Ring-0 Termination of PPL EDR Sensors, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 6 with the documented host and network chain.',
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
          'Normally, Windows blocks user-mode administrators from opening PROCESS_TERMINATE handles to PsProtectedSignerAntimalware-Light (PPL) processes, but a ZwOpenProcess call originating from a Ring-0 kernel driver (KernelMode previous mode) bypasses PPL checks completely. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the PROCEXP152.SYS service to the DeviceIoControl (0x8335003C / 0004) dispatch handler and triggers the Sophos X-Ops / Elastic WDAC sensor.',
        detectionAndEvidence:
          'Monitor ETW Microsoft-Windows-Kernel-File and IOCTL telemetry (kernel tracing that records user-mode binaries opening protected device links) for non-Sysinternals processes opening \\Device\\PROCEXP152 and issuing IOCTL 0x8335003C or 0x83350004 (capturing the live privilege abuse handshake). Correlate Sysmon or Windows Security Event telemetry for T1562.001 (pairing parent/child process and destination fields) and contain the offending session.',
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
          'Enabling Microsoft’s Vulnerable Driver Blocklist (SiPolicy.p7b + HVCI) to prevent PROCEXP152.SYS v16.32 from loading in the first place. Correlate Sysmon or Windows Security Event telemetry for T1486 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a secure office building whose maintenance wing still honors an outdated, genuinely stamped inspector pass card. An intruder drops that retired inspector card onto the desk, opens the inspector service hatch using two special code knocks (one knock to hand over a master guard badge and a second knock to yank out a security guard radio wire), and loops through every hallway knocking out every building alarm before unlocking the safe for ransomware.',
      storyMappings: [
        {
          storyTerm: 'Outdated, genuinely stamped inspector pass card',
          technicalTerm: 'Signed vulnerable Sysinternals PROCEXP152.SYS v16.32 kernel driver (BYOVD)',
          tone: 'amber',
        },
        {
          storyTerm: 'Inspector service hatch',
          technicalTerm: 'Kernel device symbolic link \\\\.\\PROCEXP152 exposed to user-mode callers',
          tone: 'sky',
        },
        {
          storyTerm: 'Two special code knocks (master badge knock and wire-yank knock)',
          technicalTerm: 'IOCTL 0x8335003C (open privileged handle) and IOCTL 0x83350004 (close handle)',
          tone: 'rose',
        },
        {
          storyTerm: 'Knocking out every building alarm before unlocking the safe',
          technicalTerm: 'Ring-0 termination of PPL-protected EDR sensors prior to ransomware execution',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Carrying stolen manager keys, the intruder unpacks a retired but legitimately stamped maintenance-inspector pass card from a briefcase, slides it onto the official building driver rack, and activates it even though no real maintenance engineer is present in the room.',
        storyMappings: [
          {
            storyTerm: 'Retired legitimately stamped pass card',
            technicalTerm: 'Embedded Microsoft-signed Sysinternals PROCEXP152.SYS v16.32',
            tone: 'amber',
          },
          {
            storyTerm: 'Official building driver rack',
            technicalTerm: 'C:\\Windows\\System32\\drivers\\PROCEXP152.SYS registered as a kernel service',
            tone: 'sky',
          },
          {
            storyTerm: 'Briefcase carrying the embedded card',
            technicalTerm: 'AuKill C++ user-mode BYOVD loader running with Administrator rights',
            tone: 'rose',
          },
          {
            storyTerm: 'No real maintenance engineer present',
            technicalTerm: 'Driver loaded by an untrusted binary rather than signed procexp64.exe',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Alert on Sysmon EventID 6 (DriverLoaded, recording kernel drivers loaded alongside their signature and hash) for PROCEXP152.SYS version 16.32 whenever the creating or loading process is not a legitimately signed procexp.exe or procexp64.exe binary (exposing BYOVD weaponization).',
      },
      2: {
        storyAnalogy:
          'The intruder steps up to the newly opened inspector service hatch with a team of helpers and taps two distinct control knocks: the first knock forces the kernel hatch to hand back an all-powerful master handle to protected security guards, and the second knock tells the hatch to snip any open lock handles held by those guards.',
        storyMappings: [
          {
            storyTerm: 'Inspector service hatch',
            technicalTerm: 'Device handle opened to \\\\.\\PROCEXP152 via CreateFile',
            tone: 'amber',
          },
          {
            storyTerm: 'First control knock granting a master handle',
            technicalTerm: 'DeviceIoControl IOCTL 0x8335003C opening full-access Ring-0 process handles',
            tone: 'sky',
          },
          {
            storyTerm: 'Second control knock snipping open lock handles',
            technicalTerm: 'DeviceIoControl IOCTL 0x83350004 forcibly closing target process handles',
            tone: 'rose',
          },
          {
            storyTerm: 'Team of helpers enumerating guards',
            technicalTerm: 'Multi-threaded AuKill worker routines scanning running endpoint security PIDs',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor ETW Microsoft-Windows-Kernel-File and IOCTL telemetry (kernel tracing that records user-mode binaries opening protected device links) for non-Sysinternals processes opening \\Device\\PROCEXP152 and issuing IOCTL 0x8335003C or 0x83350004 (capturing the live privilege abuse handshake). Correlate Sysmon Event 1 and Windows Security Event telemetry for T1562.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      3: {
        storyAnalogy:
          'Armed with both the master handle knock and the wire-snipping knock, the intruder runs endlessly from floor to floor shutting down every armored security monitor even when the monitors try to restart themselves, leaving the whole building blind for the ransomware crew.',
        storyMappings: [
          {
            storyTerm: 'Armored security monitors',
            technicalTerm: 'Protected Process Light (PPL) EDR services such as MsMpEng.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Master handle knock and wire-snipping knock',
            technicalTerm: 'Paired IOCTL 0x8335003C termination and IOCTL 0x83350004 handle closure loop',
            tone: 'sky',
          },
          {
            storyTerm: 'Running endlessly even as monitors restart',
            technicalTerm: 'Continuous AuKill watchdog loop terminating respawning EDR services',
            tone: 'rose',
          },
          {
            storyTerm: 'Blinded building ready for the ransomware crew',
            technicalTerm: 'Unmonitored endpoint enabling Medusa Locker or LockBit mass encryption',
            tone: 'emerald',
          },
        ],
      },
    },
  };
