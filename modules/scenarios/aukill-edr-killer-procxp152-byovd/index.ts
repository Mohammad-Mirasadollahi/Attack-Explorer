import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';
import { AUKILL_TELEMETRY } from './telemetry';

export const scenario: AttackScenario = {
  id: 'aukill-edr-killer-procxp152-byovd',
  code: 'T1543.003',
  name: 'AuKill EDR Killer — BYOVD Signed PROCEXP152.SYS PPL Bypass & HVCI Containment',
  shortSubtitle: 'Kernel & BYOVD · Signed Process Explorer Driver, IOCTL 0x8335003C/0004 Kill Loop & CodeIntegrity EID 3077',
  category: 'KERNEL_FIRMWARE_BYOVD',
  severity: 'CRITICAL',
  primaryMitrePhase: 4,
  overview:
    'Ransomware affiliates deploy AuKill (aukill.exe PID 5104) to drop an outdated Microsoft-signed Sysinternals Process Explorer driver (PROCEXP152.SYS) into Ring 0, abusing unauthenticated IOCTLs 0x8335003C (ZwOpenProcess) and 0x83350004 (ZwTerminateProcess) to bypass Protected Process Light (PPL) and continuously blind EDR sensors until HVCI and Microsoft Vulnerable Driver Block Rules halt the driver pre-load.',
  specs: [
    { term: 'MITRE TECHNIQUES', value: 'T1543.003 (Kernel Service) · T1068 (Driver Exploit) · T1562.001 · T1486' },
    { term: 'VULNERABLE DRIVER', value: 'PROCEXP152.SYS v16.32 (Valid Microsoft Signature · Outdated)' },
    { term: 'KERNEL IOCTLS', value: '0x8335003C (ZwOpenProcess) · 0x83350004 (nt!ZwTerminateProcess)' },
    { term: 'BYPASSED ARMOR', value: 'PsProtectedSignerAntimalware-Light (PPL · MsMpEng.exe PID 2188)' },
    { term: 'HOST TELEMETRY', value: 'Sysmon EID 6 + System EID 7045/7031 + CodeIntegrity EID 3077' },
    { term: 'CASE GROUNDING', value: 'Sophos X-Ops AuKill Report, Microsoft Driver Blocklist & LOLDrivers' },
  ],
  nodes: [
    {
      id: 'aukill-loader',
      label: 'AuKill User-Mode Loader',
      sublabel: 'aukill.exe · PID 5104 Admin',
      role: 'attacker',
      x: 8,
      y: 26,
      details: {
        osOrType: 'Pre-Ransomware User-Mode BYOVD Binary (SRV-APP-09)',
        pidOrPort: 'PID 5104 · Impersonates TrustedInstaller',
        privilege: 'Local Administrator (Ring 3)',
        artifacts: [
          'Extracts embedded outdated PROCEXP152.SYS into System32\\drivers\\',
          'Opens device symbolic link \\\\.\\PROCEXP152 without authorization',
          'Runs infinite polling loop killing EDR processes as SCM restarts them',
        ],
        description:
          'User-mode ransomware affiliate utility that drops a legitimately signed vulnerable driver to blind security sensors from Ring 0.',
      },
    },
    {
      id: 'scm-service',
      label: 'Service Control Manager',
      sublabel: 'SCM EID 7045 · Type 0x1 Driver',
      role: 'victim_host',
      x: 28,
      y: 26,
      details: {
        osOrType: 'Windows services.exe & Driver Signature Enforcement (DSE)',
        pidOrPort: 'System Event ID 7045 · Sysmon EID 6',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'Verifies valid Microsoft Authenticode signature on PROCEXP152.SYS',
          'Loads kernel driver into Ring 0 at base 0xFFFFF80541200000',
          'Emits System EID 7045 and Sysmon EID 6 DriverLoaded telemetry',
        ],
        description:
          'Windows service registration and driver-loading path that admits outdated signed drivers when HVCI blocklists are disabled.',
      },
    },
    {
      id: 'ring0-driver',
      label: 'Ring 0 PROCEXP152.SYS',
      sublabel: 'IOCTL 0x8335003C & 0x83350004',
      role: 'memory',
      x: 50,
      y: 20,
      details: {
        osOrType: 'Outdated Signed Sysinternals Process Explorer Kernel Driver',
        pidOrPort: '\\\\.\\PROCEXP152 · Base 0xFFFFF80541200000',
        privilege: 'Windows Kernel Ring 0 (Unrestricted)',
        artifacts: [
          'Missing caller ACL check allows any admin process to send IOCTLs',
          'IOCTL 0x8335003C runs ZwOpenProcess returning full handle 0x03A4',
          'IOCTL 0x83350004 executes nt!ZwTerminateProcess bypassing PPL',
        ],
        description:
          'Legitimately signed kernel driver abused as a Ring 0 proxy to open and terminate Protected Process Light security processes.',
      },
    },
    {
      id: 'edr-ppl',
      label: 'PPL-Protected EDR Sensors',
      sublabel: 'MsMpEng.exe · PID 2188 Blinded',
      role: 'process',
      x: 74,
      y: 26,
      details: {
        osOrType: 'Protected Process Light Antimalware & EDR Agents',
        pidOrPort: 'PsProtectedSignerAntimalware-Light',
        privilege: 'Protected User-Mode Security Boundary',
        artifacts: [
          'Immune to standard user-mode TerminateProcess even from SYSTEM',
          'Repeatedly killed by Ring 0 IOCTL 0x83350004 before restart completes',
          'Generates System EID 7031 crash bursts and SOC heartbeat silence',
        ],
        description:
          'Endpoint security agents armored by PPL that lose visibility once an attacker gains arbitrary Ring 0 process termination.',
      },
    },
    {
      id: 'ransom-stage',
      label: 'File Vault & Ransom Stage',
      sublabel: 'LockBit / MedusaLocker Window',
      role: 'server',
      x: 72,
      y: 66,
      details: {
        osOrType: 'Enterprise Application Server Shares (SRV-APP-09)',
        pidOrPort: 'Pre-Ransomware Staging Window',
        privilege: 'Uncontested Local Encryption Risk',
        artifacts: [
          'Affiliates launch encryption payloads once EDR telemetry goes dark',
          'Behavioral prevention stays fully online on HVCI-hardened servers',
          'Blocked BYOVD load gives SOC immediate pre-impact warning',
        ],
        description:
          'Downstream business data targeted for encryption immediately after AuKill blinds endpoint defenses.',
      },
    },
    {
      id: 'hvci-siem',
      label: 'HVCI Blocklist & SOC SIEM',
      sublabel: 'CodeIntegrity EID 3077 · 0xC0000428',
      role: 'firewall_siem',
      x: 34,
      y: 68,
      details: {
        osOrType: 'Hypervisor-Protected Code Integrity (CI.dll) & SIEM',
        pidOrPort: 'CodeIntegrity EID 3077 · LOLDrivers',
        privilege: 'Hardware-Isolated Kernel Enforcement',
        artifacts: [
          'Matches PROCEXP152.SYS hash against Microsoft Recommended Block Rules',
          'Denies driver load with STATUS_INVALID_IMAGE_HASH (0xC0000428)',
          'Triggers zero-false-positive P1 SIEM alert before Ring 0 exposure',
        ],
        description:
          'Preventive kernel enforcement and SOC alerting layer stopping known vulnerable drivers prior to Ring 0 initialization.',
      },
    },
  ],
  processTree: [
    {
      pid: 5104,
      ppid: 3420,
      name: 'aukill.exe (BYOVD EDR Killer Utility)',
      commandLine: 'C:\\Users\\Public\\aukill.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 1,
      apiCalls: [
        'CreateServiceW("PROCEXP152", SERVICE_KERNEL_DRIVER) -> Loads signed driver',
        'DeviceIoControl(0x8335003C -> Handle 0x03A4) + DeviceIoControl(0x83350004 Kill Loop)',
      ],
      memoryBlocks: [
        {
          address: '0xFFFFF80541200000',
          section: 'PROCEXP152.SYS Dispatch · Unauthenticated IOCTL 0x8335003C/0004',
          permissions: 'R-X',
          size: '48 KB',
          status: 'injected',
          description:
            'Kernel driver IRP_MJ_DEVICE_CONTROL dispatch handler executing ZwOpenProcess and nt!ZwTerminateProcess without caller validation.',
          hexPreview: '3C 00 35 83 04 00 35 83 50 52 4F 43 45 58 50 31  <.5...5.PROCEXP1',
        },
        {
          address: '0xFFFFC28910440000',
          section: 'EPROCESS.Protection · PPL Antimalware-Light Bypassed by Ring 0',
          permissions: 'RW-',
          size: '16 KB',
          status: 'patched',
          description:
            'MsMpEng.exe (PID 2188) EPROCESS protection field ignored by kernel-mode ZwOpenProcess invoked inside PROCEXP152.SYS.',
          hexPreview: '50 50 4C 5F 41 4E 54 49 4D 41 4C 57 41 52 45 5F  PPL_ANTIMALWARE_',
        },
        {
          address: '0xFFFFF80109A00000',
          section: 'HVCI CI.dll Policy · STATUS_INVALID_IMAGE_HASH (0xC0000428)',
          permissions: 'R--',
          size: '32 KB',
          status: 'clean',
          description:
            'Microsoft Recommended Driver Block Rules enforced inside hypervisor-isolated Code Integrity rejecting PROCEXP152.SYS pre-load.',
          hexPreview: '48 56 43 49 5F 42 4C 4F 43 4B 5F 30 78 43 30 30  HVCI_BLOCK_0xC00',
        },
      ],
    },
    {
      pid: 2188,
      ppid: 680,
      name: 'MsMpEng.exe (Microsoft Defender PPL Sensor)',
      commandLine: '"C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\MsMpEng.exe"',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: [
        'Protected by PsProtectedSignerAntimalware-Light (PPL)',
        'Terminated unexpectedly (System EID 7031) unless HVCI blocks PROCEXP152.SYS',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'Signed PROCEXP152.SYS Driver Drop & Kernel Service Load',
      subtitle: 'Outdated Microsoft-Signed Sysinternals Driver Passes Standard DSE Into Ring 0',
      description:
        'aukill.exe (PID 5104) drops outdated PROCEXP152.SYS into System32\\drivers and registers kernel service PROCEXP152, logged by Sysmon Event ID 6 and System Event ID 7045.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1543.003',
      mitreTechniqueName: 'Create or Modify System Process: Windows Service (BYOVD)',
      activeNodeIds: ['aukill-loader', 'scm-service', 'ring0-driver'],
      compromisedNodeIds: ['aukill-loader', 'scm-service', 'ring0-driver'],
      keySpecs: [
        { term: 'DROPPED DRIVER', value: 'C:\\Windows\\System32\\drivers\\PROCEXP152.sys (v16.32)' },
        { term: 'SIGNATURE CHECK', value: 'Valid Microsoft Corporation (Bypasses Standard DSE)' },
        { term: 'HOST TELEMETRY', value: 'Sysmon Event ID 6 + System Event ID 7045 (Type 0x1)' },
      ],
    },
    {
      index: 2,
      title: 'Ring 0 IOCTL 0x8335003C Opens Privileged Handle to PPL EDR',
      subtitle: 'Unauthenticated DeviceIoControl Executes ZwOpenProcess From Kernel Mode',
      description:
        'aukill.exe opens \\\\.\\PROCEXP152 and issues IOCTL 0x8335003C, receiving a full-access kernel handle (0x03A4) to PPL-protected MsMpEng.exe (PID 2188).',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1068',
      mitreTechniqueName: 'Exploitation for Privilege Escalation (BYOVD IOCTL)',
      activeNodeIds: ['scm-service', 'ring0-driver', 'edr-ppl'],
      compromisedNodeIds: ['aukill-loader', 'scm-service', 'ring0-driver'],
      keySpecs: [
        { term: 'DEVICE LINK', value: '\\\\.\\PROCEXP152 (Zero Caller ACL Enforcement)' },
        { term: 'OPEN IOCTL', value: '0x8335003C -> Kernel ZwOpenProcess -> Handle 0x03A4' },
        { term: 'BYPASSED ARMOR', value: 'PsProtectedSignerAntimalware-Light (PPL)' },
      ],
    },
    {
      index: 3,
      title: 'Continuous IOCTL 0x83350004 Loop Blinds All EDR Watchtowers',
      subtitle: 'Ring 0 nt!ZwTerminateProcess Defeats SCM Auto-Restart & Silences Heartbeats',
      description:
        'Using handle 0x03A4, aukill.exe loops IOCTL 0x83350004 (nt!ZwTerminateProcess) across Defender, CrowdStrike, SentinelOne, and Sophos processes, causing System Event ID 7031 crash bursts.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1562.001',
      mitreTechniqueName: 'Impair Defenses: Disable or Modify Tools',
      activeNodeIds: ['ring0-driver', 'edr-ppl', 'hvci-siem'],
      compromisedNodeIds: ['aukill-loader', 'scm-service', 'ring0-driver', 'edr-ppl'],
      keySpecs: [
        { term: 'KILL IOCTL', value: '0x83350004 -> nt!ZwTerminateProcess (Ring 0)' },
        { term: 'LOOP EVASION', value: 'Continuous Poll Kills Security Services Faster Than Restart' },
        { term: 'SOC EVIDENCE', value: 'System Event ID 7031/7034 Burst + Sensor Heartbeat Silence' },
      ],
    },
    {
      index: 4,
      title: 'HVCI & Vulnerable Driver Blocklist Catch (CodeIntegrity EID 3077)',
      subtitle: 'Stopping Pre-Ransomware Blinding Pre-Load With STATUS_INVALID_IMAGE_HASH',
      description:
        'On HVCI-protected endpoints with Microsoft Recommended Driver Block Rules, CI.dll blocks PROCEXP152.SYS with 0xC0000428 (CodeIntegrity EID 3077), keeping PPL EDR online to stop ransomware.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1486',
      mitreTechniqueName: 'Data Encrypted for Impact (Pre-Ransomware HVCI Containment)',
      activeNodeIds: ['ransom-stage', 'hvci-siem', 'edr-ppl'],
      compromisedNodeIds: ['aukill-loader'],
      keySpecs: [
        { term: 'BLOCK POLICY', value: 'HVCI + Microsoft Recommended Driver Block Rules' },
        { term: 'KERNEL STATUS', value: 'STATUS_INVALID_IMAGE_HASH (0xC0000428)' },
        { term: 'SIEM SIGNAL', value: 'CodeIntegrity/Operational EID 3077 (Zero False Positives)' },
      ],
    },
  ],
  telemetry: AUKILL_TELEMETRY,
};

export const stepGuide: RawScenarioStepGuideData = {
  scenarioId: 'aukill-edr-killer-procxp152-byovd',
  briefing: {
    headline: 'How an Outdated Factory-Stamped Wrench Lets Attackers Shut Down Security Watchtowers',
    storyAnalogy:
      'Think of a high-security power plant whose sapphire security watchtowers sit behind armored blast doors so even a senior floor manager cannot switch them off. Rather than breaking the doors, an intruder carries in an old factory-stamped brass emergency wrench from an obsolete maintenance kit. Because the wrench still carries an authentic factory stamp, the reactor pit guard waves it straight into the deepest control room. Once plugged into the master power bus, the wrench lets the intruder flip off every watchtower circuit breaker in an endless loop, plunging the plant into darkness right before looting the vaults unless an emerald factory-recall shutter blocks the outdated wrench at the entrance.',
    plainSummary:
      'In this scenario (MITRE T1543.003, AuKill EDR Killer Abusing Signed PROCEXP152.SYS) on SRV-APP-09, ransomware operators abuse a Bring Your Own Vulnerable Driver chain to blind armored endpoint security sensors from kernel space. The attack unfolds in one continuous arc: loading an outdated Microsoft-signed Sysinternals driver into Ring 0, then sending an unauthenticated control code to acquire a kernel handle past PPL protection, then running a continuous terminate loop against EDR services, then contrasting that blinding window against HVCI blocklist enforcement. Steps #1 through #4 trace each driver load, control call, service crash, and block event while the Memory tab contrasts Ring 0 driver dispatch against CodeIntegrity blocklist policy. Primary detection correlates Sysmon Event ID 6, System Event ID 7031, and CodeIntegrity Event ID 3077.',
    diagramTopologySummary:
      'Six-node kernel BYOVD chain connecting AuKill Loader (PID 5104), Service Control Manager (SCM), Ring 0 PROCEXP152.SYS, PPL-Protected EDR Sensors (MsMpEng.exe), File Vault & Ransom Stage, and HVCI Blocklist & SOC SIEM.',
    documentedAdvisory:
      'Grounded in Sophos X-Ops AuKill BYOVD Report, Microsoft Vulnerable Driver Blocklist, LOLDrivers, and MITRE ATT&CK T1562.001 / T1543.003.',
  },
  steps: [
    {
      stepNumber: 1,
      mitreId: 'T1543.003',
      plainTitle: 'Smuggling an Outdated Microsoft-Signed Driver Into Kernel Ring 0',
      storyAnalogy:
        'Carrying an old brass emergency wrench tucked inside a regular toolkit, the intruder steps up to the heavily guarded reactor pit door. The checkpoint guard inspects only the factory stamp embossed on the handle, confirms it was genuinely forged by the plant builder years ago, and waves the obsolete wrench straight down into the deepest control chamber.',
      simpleExplanation:
        'With local administrator privileges on SRV-APP-09, aukill.exe (PID 5104, the user-mode BYOVD utility deployed by ransomware affiliates) extracts an embedded copy of PROCEXP152.SYS (an outdated version 16.32 Sysinternals Process Explorer kernel driver carrying a real Microsoft digital signature) into C:\\Windows\\System32\\drivers\\ and registers kernel service PROCEXP152. Because Windows Driver Signature Enforcement checks only cryptographic validity by default, the OS loads the vulnerable driver straight into Ring 0 (the highest-privilege kernel layer).',
      howItWorksInPractice:
        'Unlike unsigned rootkits that Windows refuses to load, Bring Your Own Vulnerable Driver (BYOVD, smuggling a legitimate signed third-party driver that contains dangerous functionality) satisfies standard Authenticode signature checks. Registering the service emits Windows System Event ID 7045 (ServiceType kernel mode driver 0x1) while Sysmon Event ID 6 records the exact driver file path, Microsoft signature string, and SHA-256 hash as the driver maps at kernel base 0xFFFFF80541200000.',
      diagramAlignment:
        'Follow Step #1 from Node 1 (AuKill User-Mode Loader) through Node 2 (Service Control Manager) into Node 3 (Ring 0 PROCEXP152.SYS).',
      detectionAndEvidence:
        'Monitor Sysmon Event ID 6 (DriverLoaded) and System Event ID 7045 for PROCEXP152.sys loading from unexpected callers or paths, and cross-check loaded kernel driver hashes against the LOLDrivers community catalog.',
    },
    {
      stepNumber: 2,
      mitreId: 'T1068',
      plainTitle: 'Abusing Unauthenticated IOCTL 0x8335003C to Bypass PPL Armor',
      storyAnalogy:
        'Down inside the reactor pit, the outdated brass wrench snaps directly onto an unguarded master dial that never asks who is turning it. Because commands coming from the deep reactor pit automatically outrank every upstairs armor plate, the wrench effortlessly clicks open the master lock controlling the sapphire security watchtowers.',
      simpleExplanation:
        'Modern antivirus and EDR sensors like MsMpEng.exe (PID 2188) run as Protected Process Light (PPL, a Windows security boundary that prevents even local SYSTEM user-mode programs from opening terminate handles to security agents). AuKill sidesteps PPL completely by opening device link \\\\.\\PROCEXP152 (the user-to-kernel communication channel exposed by the loaded driver) and issuing DeviceIoControl code 0x8335003C (a driver command that runs ZwOpenProcess inside kernel Ring 0 without checking whether the caller is genuinely Process Explorer).',
      howItWorksInPractice:
        'Inside the driver dispatch handler at 0xFFFFF80541200000, PROCEXP152.SYS executes in kernel mode where EPROCESS.Protection PPL restrictions do not block kernel callers (allowing Ring 0 code to obtain handles to protected processes unconditionally). When aukill.exe passes target PID 2188 in the input buffer, the driver calls kernel ZwOpenProcess (a Ring 0 handle-creation routine that bypasses user-mode access checks) and hands back handle 0x000003A4 carrying full PROCESS_ALL_ACCESS permissions directly into user-mode PID 5104.',
      diagramAlignment:
        'Follow Step #2 between Node 2 (Service Control Manager) and Node 3 (Ring 0 PROCEXP152.SYS) as IOCTL 0x8335003C yields handle 0x03A4.',
      detectionAndEvidence:
        'Hunt EDR DeviceEvents and kernel ETW logs via KQL for any non-Sysinternals binary opening symbolic link \\\\.\\PROCEXP152 or issuing DeviceIoControl codes 0x8335003C and 0x83350004.',
    },
    {
      stepNumber: 3,
      mitreId: 'T1562.001',
      plainTitle: 'Continuous Kernel Terminate Loop Blinds Every Security Watchtower',
      storyAnalogy:
        'Holding the unlocked master handle, the intruder cranks the shutoff dial repeatedly in an endless rhythm. One by one, the tall sapphire security watchtowers click dark, and every time an automatic backup generator tries to bring a watchtower back online, the wrench snaps its breaker right back down before a single camera can wake up.',
      simpleExplanation:
        'Immediately after grabbing handle 0x03A4, aukill.exe invokes DeviceIoControl code 0x83350004 (the driver kill routine that calls nt!ZwTerminateProcess from Ring 0) to terminate MsMpEng.exe and loops continuously across a built-in list of EDR and antivirus process names. Even when the Windows Service Control Manager tries to auto-restart crashed security services, the tight kernel loop kills them again within milliseconds, silencing endpoint telemetry.',
      howItWorksInPractice:
        'Because the termination originates from Ring 0 via a Microsoft-signed driver, user-mode self-defense hooks inside the EDR agent never receive an opportunity to block the call. Each forced kill stamps Windows System Event ID 7031 or 7034 (reporting that a critical security service terminated unexpectedly) while the SOC dashboard observes an abrupt drop to zero sensor heartbeats on SRV-APP-09.',
      diagramAlignment:
        'Follow Step #3 from Node 3 (Ring 0 PROCEXP152.SYS) to Node 4 (PPL-Protected EDR Sensors), raising crash telemetry at Node 6 (HVCI Blocklist & SOC SIEM).',
      detectionAndEvidence:
        'Trigger high-priority Sigma alerts on Windows System Event ID 7031 and 7034 for repeated Defender, CrowdStrike, SentinelOne, or Sophos crashes correlated with sudden SOC EDR heartbeat silence.',
    },
    {
      stepNumber: 4,
      mitreId: 'T1486',
      plainTitle: 'Pre-Ransomware Impact vs HVCI Vulnerable Driver Blocklist Containment',
      storyAnalogy:
        'On an unguarded plant floor, darkness across the watchtowers lets crimson vault-breaking crews rush in unopposed. On the hardened sister plant next door, however, an emerald factory-recall shutter checks the brass wrench serial number at the pit doorway and slams shut instantly, leaving every sapphire watchtower bright and fully armed.',
      simpleExplanation:
        'Operators deploy AuKill specifically to open a blind window for rapid ransomware staging (such as LockBit or MedusaLocker) with zero active behavioral EDR prevention. Conversely, enabling Hypervisor-Protected Code Integrity (HVCI, which enforces hardware-isolated kernel code checks) alongside Microsoft Recommended Driver Block Rules (a maintained deny-list of known vulnerable signed driver hashes) causes CI.dll to block PROCEXP152.SYS with STATUS_INVALID_IMAGE_HASH (0xC0000428) before it ever loads.',
      howItWorksInPractice:
        'When CI.dll rejects the revoked driver hash, Windows writes Microsoft-Windows-CodeIntegrity/Operational Event ID 3077 naming \\Windows\\System32\\drivers\\PROCEXP152.sys and the enforcing block policy (halting the BYOVD chain prior to Ring 0 initialization). Not only does the PPL-protected EDR remain completely intact to quarantine the subsequent ransomware payload, but Event ID 3077 itself serves as a zero-false-positive SOC alarm confirming an active local-admin compromise.',
      diagramAlignment:
        'Follow Step #4 between Node 5 (File Vault & Ransom Stage) and Node 6 (HVCI Blocklist & SOC SIEM) as CI.dll blocks the vulnerable driver pre-load.',
      detectionAndEvidence:
        'Alert immediately in SIEM via KQL on Microsoft-Windows-CodeIntegrity/Operational Event ID 3076 and 3077 referencing PROCEXP152, rtcore64, or truesight, and enforce HVCI + Driver Blocklist via Group Policy or Intune.',
    },
  ],
};
