import type { AttackScenario } from '../types';

export const scenario: AttackScenario = {
  id: 'kaspersky-lazarus-byovd-fudmodule',
  code: 'CVE-2024-21338',
  name: 'Kaspersky, Microsoft & Avast — Lazarus Group (Diamond Sleet): appid.sys Zero-Day & FUDModule Rootkit',
  shortSubtitle: 'Kaspersky GReAT / Avast / Microsoft · CVE-2024-21338 AppLocker Driver IOCTL & FUDModule DKOM Blindness',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 4,
  overview:
    'Documented by Avast, Kaspersky GReAT, and Microsoft Threat Intelligence (Diamond Sleet / Lazarus Group, Feb 2024), North Korean APT operators exploited a zero-day arbitrary kernel pointer dereference in the native Windows AppLocker driver C:\\Windows\\System32\\drivers\\appid.sys (CVE-2024-21338) as well as BYOVD drivers (dbutil_2_3.sys). Using kernel read/write primitives, Lazarus deployed the in-memory FUDModule v3 rootkit to perform Direct Kernel Object Manipulation (DKOM)—zeroing out PsSetCreateProcessNotifyRoutine, ObRegisterCallbacks, minifilters, and EtwThreatIntProvRegHandle to completely blind Sysmon and EDR.',
  specs: [
    {
      term: 'PRIMARY SOURCE',
      value: 'Avast, Kaspersky GReAT & Microsoft Threat Intelligence — Lazarus FUDModule & CVE-2024-21338',
    },
    {
      term: 'MITRE TECHNIQUES',
      value: 'T1068 (CVE-2024-21338 appid.sys EoP) · T1562.001 (Disable Kernel Callbacks & ETW-Ti) · T1014 (DKOM)',
    },
    {
      term: 'VULNERABLE DRIVER',
      value: 'C:\\Windows\\System32\\drivers\\appid.sys (IOCTL 0x22A018) / Dell dbutil_2_3.sys',
    },
    {
      term: 'DKOM TARGETS',
      value: 'PspCreateProcessNotifyRoutine, ObRegisterCallbacks, FltGlobals & EtwThreatIntProvRegHandle',
    },
  ],
  nodes: [
    {
      id: 'lazarus_c2_node',
      label: 'Lazarus (Diamond Sleet) C2',
      sublabel: '198.51.100.188:443 (Kaolin RAT C2)',
      role: 'attacker',
      x: 15,
      y: 44,
      details: {
        osOrType: 'Lazarus Group (Andariel / Diamond Sleet) C2',
        pidOrPort: 'HTTPS :443',
        privilege: 'Nation-State APT Operator',
        artifacts: [
          'Delivers FUDModule DLL & Kaolin RAT',
          'Targets Defense, Aerospace & Semiconductor R&D',
        ],
        description:
          'Lazarus Group C2 server delivering the FUDModule rootkit and receiving exfiltrated R&D source code after EDR sensors are blinded.',
      },
    },
    {
      id: 'wks_appid_host',
      label: 'appid.sys (AppLocker Driver)',
      sublabel: 'IOCTL 0x22A018 · RND-WKS-05 (10.10.40.15)',
      role: 'victim_host',
      x: 44,
      y: 28,
      details: {
        osOrType: 'Windows 11 Built-in AppLocker Kernel Driver',
        pidOrPort: 'Device: \\\\?\\GLOBALROOT\\Device\\AppId (IOCTL 0x22A018)',
        privilege: 'LOCAL SERVICE -> Kernel Ring-0',
        artifacts: [
          'CVE-2024-21338: AipSmartHashImageFile Spoofed Function Pointer',
          'Token Manipulation: PreviousMode -> 0 (KernelMode)',
        ],
        description:
          'Native Windows AppLocker driver (appid.sys) exploited via IOCTL 0x22A018 to flip ETHREAD.PreviousMode to 0, granting user-mode FUDModule full Ring-0 read/write.',
      },
    },
    {
      id: 'fudmodule_dkom_engine',
      label: 'FUDModule v3 DKOM Engine',
      sublabel: 'Zeroes Kernel Callbacks & ETW-Ti',
      role: 'memory',
      x: 54,
      y: 72,
      details: {
        osOrType: 'In-Memory Rootkit & EDR Blinder (FUDModule)',
        pidOrPort: 'NtReadVirtualMemory / NtWriteVirtualMemory on Kernel Addresses',
        privilege: 'PreviousMode=0 (Kernel Read/Write)',
        artifacts: [
          'Zeroes PspCreateProcessNotifyRoutine & PspCreateThreadNotifyRoutine',
          'Disables EtwThreatIntProvRegHandle & Protected Process Light (PPL)',
        ],
        description:
          'FUDModule rootkit using PreviousMode=0 to directly overwrite ntoskrnl.exe callback arrays and suspend EDR user-mode processes.',
      },
    },
    {
      id: 'kaolin_rat_post',
      label: 'Kaolin RAT & LSASS Dump',
      sublabel: 'Unmonitored Post-Exploitation (PID 7012)',
      role: 'process',
      x: 78,
      y: 30,
      details: {
        osOrType: 'Lazarus Kaolin RAT & Credential Dumper',
        pidOrPort: 'PID 7012 (Invisible to Blinded EDR)',
        privilege: 'NT AUTHORITY\\SYSTEM',
        artifacts: [
          'Direct LSASS Memory Read after ObRegisterCallbacks Removal',
          'Exfiltrates Aerospace & Semiconductor Source Repositories',
        ],
        description:
          'Post-exploitation RAT executing freely once FUDModule has unlinked Sysmon and EDR kernel callbacks.',
      },
    },
    {
      id: 'edr_blindness_siem',
      label: 'Sysmon & Defender XDR Sensor',
      sublabel: 'appid.sys Access & Telemetry Heartbeat Drop',
      role: 'firewall_siem',
      x: 86,
      y: 68,
      details: {
        osOrType: 'SOC SIEM & Kernel Patch Protection Monitor',
        pidOrPort: 'Sysmon EID 1, 10 & Heartbeat Watchdog',
        privilege: 'SOC Detection Engine',
        artifacts: [
          'Alert: Non-AppIDSvc Process Opening \\Device\\AppId (CVE-2024-21338)',
          'Alert: Sudden EDR / Sysmon Kernel Callback Unregistration',
        ],
        description:
          'Detects the pre-blindness token impersonation into LOCAL SERVICE and handle creation to \\Device\\AppId.',
      },
    },
  ],
  processTree: [
    {
      pid: 4820,
      ppid: 890,
      name: 'svchost.exe (Hijacked LocalService)',
      commandLine: 'C:\\Windows\\System32\\svchost.exe -k LocalService (FUDModule Injected)',
      user: 'NT AUTHORITY\\LOCAL SERVICE',
      integrity: 'System' as 'SYSTEM',
      status: 'injected',
      activeFromStage: 1,
      apiCalls: [
        'CreateFileW("\\\\?\\GLOBALROOT\\Device\\AppId")',
        'DeviceIoControl(0x22A018) [CVE-2024-21338]',
        'NtWriteVirtualMemory(KTHREAD.PreviousMode, 0)',
        'NtWriteVirtualMemory(PspCreateProcessNotifyRoutine, NULL)',
      ],
      memoryBlocks: [
        {
          address: '0xFFFFF80142A00000',
          section: 'ntoskrnl.exe!PspCreateProcessNotifyRoutine (DKOM Zeroed)',
          permissions: 'RW-',
          size: '512 Bytes',
          status: 'patched',
          description:
            'Kernel callback array overwritten by FUDModule via PreviousMode=0 to blind Sysmon and EDR drivers.',
          hexPreview: '00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00',
        },
      ],
    },
    {
      pid: 7012,
      ppid: 4820,
      name: 'dllhost.exe (Kaolin RAT)',
      commandLine: 'C:\\Windows\\System32\\dllhost.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'malicious',
      activeFromStage: 3,
      apiCalls: ['OpenProcess(lsass.exe)', 'MiniDumpWriteDump', 'WinHttpSendRequest'],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'APPID.SYS KERNEL ZERO-DAY EXPLOIT (CVE-2024-21338)',
      subtitle: 'Sending crafted IOCTL 0x22A018 to \\Device\\AppId to flip KTHREAD.PreviousMode',
      description:
        'Instead of dropping a noisy third-party BYOVD driver onto disk, Lazarus Group (Diamond Sleet) impersonates LOCAL SERVICE and opens a handle to the built-in Windows AppLocker driver (\\Device\\AppId). By sending a crafted IOCTL 0x22A018 buffer (CVE-2024-21338), AipSmartHashImageFile calls a controlled kernel gadget (kcfg_ObfDereferenceObjectWithTag) that decrements KTHREAD.PreviousMode from 1 (UserMode) to 0 (KernelMode).',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1068',
      mitreTechniqueName: 'Exploitation for Privilege Escalation',
      activeNodeIds: ['wks_appid_host', 'fudmodule_dkom_engine', 'edr_blindness_siem'],
      compromisedNodeIds: ['wks_appid_host'],
      keySpecs: [
        { term: 'ZERO-DAY CVE', value: 'CVE-2024-21338 (Windows AppLocker Driver appid.sys EoP)' },
        { term: 'IOCTL CODE', value: '0x22A018 -> AipSmartHashImageFile Pointer Dereference' },
        { term: 'PRIMITIVE GAINED', value: 'KTHREAD.PreviousMode = 0 (Direct Kernel R/W via NtWriteVirtualMemory)' },
      ],
    },
    {
      index: 2,
      title: 'FUDMODULE V3 DKOM: BLINDING SYSMON, ETW-TI & EDR',
      subtitle: 'Zeroing PspCreateProcessNotifyRoutine, ObRegisterCallbacks & EtwThreatIntProvRegHandle',
      description:
        'With PreviousMode set to 0, user-mode NtReadVirtualMemory and NtWriteVirtualMemory can directly read and modify kernel memory without any custom driver loaded. FUDModule v3 locates ntoskrnl.exe structures and zeroes out Process/Thread/Image notify routines, unlinks EDR Object Callbacks, disables ETW Threat Intelligence, and strips Protected Process Light (PPL) flags.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1562.001',
      mitreTechniqueName: 'Impair Defenses: Disable or Modify Tools',
      activeNodeIds: ['wks_appid_host', 'fudmodule_dkom_engine', 'edr_blindness_siem'],
      compromisedNodeIds: ['wks_appid_host', 'fudmodule_dkom_engine'],
      keySpecs: [
        { term: 'ROOTKIT NAME', value: 'FUDModule v3 (Lazarus Group / Diamond Sleet)' },
        { term: 'DKOM TARGETS', value: 'PspCreateProcessNotifyRoutine, ObRegisterCallbacks, EtwThreatIntProvRegHandle' },
        { term: 'EDR IMPACT', value: 'Complete telemetry blindness for Sysmon, ETW & EDR kernel drivers' },
      ],
    },
    {
      index: 3,
      title: 'UNMONITORED KAOLIN RAT & LSASS CREDENTIAL DUMP',
      subtitle: 'Dumping LSASS memory and deploying Kaolin RAT while EDR is blinded',
      description:
        'Once EDR and Sysmon kernel callbacks are disabled, FUDModule spawns Kaolin RAT and dumps LSASS memory without triggering ObRegisterCallbacks blocks, then restores PreviousMode=1 so Kernel Patch Protection (PatchGuard) does not immediately bugcheck the host.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1003.001',
      mitreTechniqueName: 'OS Credential Dumping: LSASS Memory',
      activeNodeIds: ['fudmodule_dkom_engine', 'kaolin_rat_post', 'lazarus_c2_node'],
      compromisedNodeIds: ['wks_appid_host', 'fudmodule_dkom_engine', 'kaolin_rat_post'],
      keySpecs: [
        { term: 'RAT PAYLOAD', value: 'Kaolin RAT (Loaded in memory after DKOM blindness)' },
        { term: 'LSASS ACCESS', value: 'Unrestricted PROCESS_VM_READ after ObRegisterCallbacks removal' },
        { term: 'THREAT ACTOR', value: 'Lazarus Group / Diamond Sleet (DPRK)' },
      ],
    },
  ],
  telemetry: [
    {
      id: 'kas-laz-1',
      no: 1,
      stageIndex: 1,
      timestamp: '05:19:04.215',
      sourceNodeId: 'wks_appid_host',
      targetNodeId: 'edr_blindness_siem',
      sourceLabel: 'svchost.exe (PID 4820)',
      targetLabel: '\\Device\\AppId (appid.sys)',
      sourceType: 'WIN32_API',
      protocolOrEventId: 'CVE-2024-21338 IOCTL',
      shortAction: 'APPID.SYS IOCTL 0x22A018',
      info: 'DeviceIoControl("\\\\?\\GLOBALROOT\\Device\\AppId", 0x22A018) -> AipSmartHashImageFile',
      sizeOrCode: 'PreviousMode=0',
      severity: 'CRITICAL',
      mitreId: 'T1068',
      explanation:
        'Avast and Kaspersky GReAT documented that CVE-2024-21338 is triggered by a process running as LOCAL SERVICE opening \\Device\\AppId and sending IOCTL 0x22A018.',
      rawLog: `[ETW_KERNEL_FILE_AND_IOCTL_TRACE]
Process: C:\\Windows\\System32\\svchost.exe (PID 4820, User: NT AUTHORITY\\LOCAL SERVICE)
TargetDevice: \\Device\\AppId (C:\\Windows\\System32\\drivers\\appid.sys)
IoControlCode: 0x0022A018 (AipSmartHashImageFile)
KernelCall: nt!ObfDereferenceObjectWithTag -> Decrements KTHREAD(0xFFFFCA8124908080)+0x232 (PreviousMode: 1 -> 0)`,
      detectionRule: {
        type: 'YARA',
        title: 'Avast / Kaspersky GReAT — Lazarus FUDModule CVE-2024-21338 Rootkit',
        ruleCode: `rule Lazarus_DiamondSleet_FUDModule_CVE_2024_21338 {
  meta:
    author = "Avast / Kaspersky GReAT"
    cve = "CVE-2024-21338"
  strings:
    $dev = "\\\\?\\GLOBALROOT\\Device\\AppId" wide ascii
    $ioctl = { 18 A0 22 00 }
    $fn1 = "EtwThreatIntProvRegHandle" ascii
    $fn2 = "PspCreateProcessNotifyRoutine" ascii
  condition:
    uint16(0) == 0x5A4D and ($dev and $ioctl) or ($fn1 and $fn2)
}`,
        mitigation:
          'Apply the February 2024 Microsoft security update patching CVE-2024-21338 in appid.sys and enable Hypervisor-Protected Code Integrity (HVCI).',
      },
    },
    {
      id: 'kas-laz-2',
      no: 2,
      stageIndex: 2,
      timestamp: '05:19:04.580',
      sourceNodeId: 'fudmodule_dkom_engine',
      targetNodeId: 'edr_blindness_siem',
      sourceLabel: 'FUDModule DKOM',
      targetLabel: 'ntoskrnl Callbacks',
      sourceType: 'MEMORY_SCAN',
      protocolOrEventId: 'DKOM Callback Wipe',
      shortAction: 'BLIND SYSMON & ETW-TI',
      info: 'NtWriteVirtualMemory zeroes PspCreateProcessNotifyRoutine, ObRegisterCallbacks & EtwThreatIntProvRegHandle',
      sizeOrCode: 'EDR Blinded',
      severity: 'CRITICAL',
      mitreId: 'T1562.001',
      explanation:
        'Using PreviousMode=0, FUDModule overwrites kernel notification arrays and ETW-Ti provider handles directly from user mode, silencing endpoint telemetry.',
      rawLog: `[DEFENDER_TAMPER_TELEMETRY_FINAL_EVENT]
Host: RND-WKS-05.corp.local
Anomaly: Kernel Callback Integrity Violation Detected Prior to Sensor Silence
Modified Symbols:
  - nt!PspCreateProcessNotifyRoutine[0..8] -> 0x0000000000000000
  - nt!EtwThreatIntProvRegHandle -> Provider Registration Cleared
  - fltmgr!FltGlobals -> Minifilter Frame Unlinked`,
      detectionRule: {
        type: 'SIGMA',
        title: 'Sudden Endpoint Telemetry Silence After LocalService Token Manipulation',
        ruleCode: `title: Suspicious Access to AppLocker Driver Device AppId
logsource:
  category: file_access
  product: windows
detection:
  selection:
    TargetFilename|contains: '\\Device\\AppId'
  filter_legit:
    Image|endswith: '\\svchost.exe'
    CommandLine|contains: 'AppIDSvc'
  condition: selection and not filter_legit
level: critical`,
        mitigation:
          'Monitor endpoint agent heartbeats in the SIEM: a sudden total drop in Sysmon/EDR events from an active workstation indicates possible DKOM blinding.',
      },
    },
    {
      id: 'kas-laz-3',
      no: 3,
      stageIndex: 3,
      timestamp: '05:19:12.900',
      sourceNodeId: 'kaolin_rat_post',
      targetNodeId: 'lazarus_c2_node',
      sourceLabel: '10.10.40.15 (RND-WKS-05)',
      targetLabel: '198.51.100.188:443',
      sourceType: 'IDS_ALERT',
      protocolOrEventId: 'Zeek / Suricata NDR',
      shortAction: 'KAOLIN RAT C2',
      info: 'Network Firewall logs TLS C2 session from RND-WKS-05 with ZERO corresponding Sysmon EID 3 host log',
      sizeOrCode: 'Host/NDR Gap',
      severity: 'CRITICAL',
      mitreId: 'T1003.001',
      explanation:
        'Because FUDModule blinded the host sensor, the perimeter NDR/Firewall captures outbound Kaolin RAT traffic from 10.10.40.15 while the host Sysmon EID 3 log is completely absent.',
      rawLog: `[SIEM_HOST_VS_NDR_CORRELATION_ALERT]
SourceHost: 10.10.40.15 (RND-WKS-05.corp.local)
Firewall/Zeek Log: TCP 10.10.40.15:54192 -> 198.51.100.188:443 (BytesSent: 4,812,900)
Host Sysmon EID 3 (NetworkConnect): 0 events received in last 10 minutes (EXPECTED >= 1)
Verdict: CRITICAL — Host Kernel Sensor Blinded (DKOM / FUDModule)`,
      detectionRule: {
        type: 'KQL',
        title: 'Network Firewall Egress Without Matching Endpoint Network Telemetry (DKOM Blindness)',
        ruleCode: `CommonSecurityLog
| where SourceIP == "10.10.40.15" and DestinationPort == 443
| join kind=leftanti (
    DeviceNetworkEvents
    | where LocalIP == "10.10.40.15"
) on $left.DestinationIP == $right.RemoteIP`,
        mitigation:
          'Correlate perimeter NDR/Firewall connection logs against endpoint EDR network telemetry to detect hosts whose kernel callbacks have been blinded by rootkits.',
      },
    },
  ],
};
