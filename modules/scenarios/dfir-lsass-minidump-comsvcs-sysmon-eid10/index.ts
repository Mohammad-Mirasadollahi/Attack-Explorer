import { LSASS_COMSVCS_MINIDUMP_TELEMETRY } from './telemetry';
import type { AttackScenario } from '../types';
import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const scenario: AttackScenario = {
  id: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
  code: 'T1003.001',
  name: 'Microsoft Sysinternals & Splunk SURGe DFIR — LSASS MiniDump via comsvcs.dll & Sysmon EventID 10',
  shortSubtitle: 'Credential Access · rundll32.exe comsvcs.dll,#24, OpenProcess(0x1010) & MDMP Forensics',
  category: 'MALWARE',
  severity: 'CRITICAL',
  primaryMitrePhase: 5,
  overview:
    'In LSASS MiniDump via comsvcs.dll & Sysmon EventID 10 (MITRE ATT&CK T1134, T1218.011, and T1003.001), an elevated administrator on Windows workstation WKS-ADM-07 dumps LSASS credentials using only built-in signed Microsoft binaries instead of dropping Mimikatz or ProcDump. The attack unfolds in one continuous arc: confirming SeDebugPrivilege (Security EID 4672) and locating unprotected lsass.exe (PID 684), then launching signed rundll32.exe (PID 5412) with comsvcs.dll MiniDump (or ordinal #24) to acquire a 0x1010 PROCESS_VM_READ handle, then serializing lsasrv.dll!LogonSessionList and msv1_0.dll/kerberos.dll via dbgcore.dll!MiniDumpWriteDump into a 48.2 MB MDMP file (C:\\Windows\\Temp\\debug.dmp) for offline pypykatz extraction, while Sysmon Event ID 10 CallTrace correlation exposes the dump and RunAsPPL + VBS Credential Guard defeat it at the kernel layer. Steps #1-#4 trace the full DFIR chain; Memory Forensics compares unprotected LSASS reads against RunAsPPL kernel enforcement.',
  specs: [
    { term: 'MITRE TECHNIQUES', value: 'T1134 (SeDebugPrivilege) · T1218.011 (Rundll32 Proxy) · T1003.001 (LSASS Dump)' },
    { term: 'LOLBIN COMMAND', value: 'rundll32.exe C:\\Windows\\System32\\comsvcs.dll, #24 684 C:\\Windows\\Temp\\debug.dmp full' },
    { term: 'PROCESS HANDLE', value: 'OpenProcess(0x1010) -> PROCESS_QUERY_LIMITED_INFORMATION | PROCESS_VM_READ' },
    { term: 'DUMP ARTIFACT', value: 'C:\\Windows\\Temp\\debug.dmp (48.2 MB · Magic 4D 44 4D 50 93 A7 "MDMP")' },
    { term: 'KERNEL WITNESS', value: 'Sysmon EID 10 CallTrace: ntdll.dll -> KERNELBASE.dll -> comsvcs.dll -> dbgcore.dll' },
    { term: 'HARDENING CONTROLS', value: 'RunAsPPL = 1 (PsProtectedSignerLsa-Light) + VBS Credential Guard (LsaIso.exe)' },
  ],
  nodes: [
    {
      id: 'admin_cmd',
      label: 'cmd.exe (PID 4920)',
      sublabel: 'SeDebugPrivilege · High Integrity',
      role: 'victim_host',
      x: 10,
      y: 26,
      details: {
        osOrType: 'Windows 11 Enterprise (WKS-ADM-07 · 10.20.14.37)',
        pidOrPort: 'PID 4920 (CORP\\adm_jchen · High)',
        privilege: 'Local Administrator + SeDebugPrivilege',
        artifacts: [
          'Security EID 4672: SeDebugPrivilege assigned',
          'tasklist /fi "imagename eq lsass.exe" -> PID 684',
          'Spawns Microsoft-signed rundll32.exe (PID 5412)',
        ],
        description:
          'Elevated administrative command prompt confirming SeDebugPrivilege and locating lsass.exe PID 684 before launching the signed Living-off-the-Land credential dump.',
      },
    },
    {
      id: 'rundll32_lolbin',
      label: 'rundll32.exe (PID 5412)',
      sublabel: 'Signed LOLBin · comsvcs.dll,#24',
      role: 'process',
      x: 34,
      y: 26,
      details: {
        osOrType: 'Microsoft-Signed System32 Proxy Binary',
        pidOrPort: 'PID 5412 (PPID 4920 cmd.exe)',
        privilege: 'High Integrity · SeDebugPrivilege Enabled',
        artifacts: [
          'rundll32.exe C:\\Windows\\System32\\comsvcs.dll, MiniDump 684 C:\\Windows\\Temp\\debug.dmp full',
          'Ordinal evasion variant: comsvcs.dll,#24 684 ... full',
          'Zero third-party unsigned binaries dropped on host',
        ],
        description:
          'Native Windows DLL launcher abused to invoke the exported MiniDump function (ordinal #24) inside comsvcs.dll without deploying Mimikatz on the target endpoint.',
      },
    },
    {
      id: 'comsvcs_minidump',
      label: 'comsvcs.dll -> dbgcore.dll',
      sublabel: 'MiniDumpW -> MiniDumpWriteDump',
      role: 'memory',
      x: 34,
      y: 68,
      details: {
        osOrType: 'Signed COM+ Services & Debugging DLL Chain',
        pidOrPort: 'Export Ordinal #24 -> MiniDumpWriteDump(0x2)',
        privilege: 'In-Process Signed Call Stack',
        artifacts: [
          'Enables SeDebugPrivilege internally via RtlAdjustPrivilege',
          'Calls OpenProcess(0x1010 / 0x1FFFFF, FALSE, 684)',
          'Invokes dbgcore.dll!MiniDumpWriteDump with MiniDumpWithFullMemory',
        ],
        description:
          'Windows COM+ service library whose MiniDump export automatically adjusts token debug privilege, opens a handle to the target PID, and delegates full memory serialization to dbgcore.dll.',
      },
    },
    {
      id: 'lsass_vault',
      label: 'lsass.exe (PID 684)',
      sublabel: 'LogonSessionList · NTLM & Kerberos',
      role: 'process',
      x: 64,
      y: 26,
      details: {
        osOrType: 'Local Security Authority Subsystem Service',
        pidOrPort: 'PID 684 (PPID 620 services.exe · SYSTEM)',
        privilege: 'NT AUTHORITY\\SYSTEM (Unprotected PPL=0)',
        artifacts: [
          'lsasrv.dll!LogonSessionList @ 0x00007FF7A8100000',
          'msv1_0.dll & kerberos.dll cached credentials @ 0x00007FFAD4200000',
          'Read via OpenProcess(0x1010) -> ReadProcessMemory',
        ],
        description:
          'Core Windows authentication process storing active logon session credentials, NTLM hashes, and Kerberos tickets in virtual memory—vulnerable to user-mode reads when RunAsPPL is disabled.',
      },
    },
    {
      id: 'mdmp_dump_file',
      label: 'C:\\Windows\\Temp\\debug.dmp',
      sublabel: '48.2 MB MDMP (4D 44 4D 50 93 A7)',
      role: 'server',
      x: 64,
      y: 68,
      details: {
        osOrType: 'Windows Minidump Artifact (Staged for Offline Parse)',
        pidOrPort: 'Magic Bytes: 4D 44 4D 50 93 A7 ("MDMP")',
        privilege: 'Written by rundll32.exe (PID 5412)',
        artifacts: [
          'Sysmon EID 11: FileCreate C:\\Windows\\Temp\\debug.dmp',
          'Contains lsasrv.dll, msv1_0.dll & kerberos.dll memory streams',
          'Parsed offline via pypykatz lsa minidump debug.dmp',
        ],
        description:
          'Full user-mode memory snapshot of lsass.exe written to disk so the adversary can exfiltrate the file and extract NTLM hashes and Kerberos tickets offline without triggering AV on Mimikatz.',
      },
    },
    {
      id: 'sysmon_eid10_booth',
      label: 'Sysmon EID 10 & PPL Watch',
      sublabel: 'CallTrace + GrantedAccess 0x1010',
      role: 'firewall_siem',
      x: 88,
      y: 47,
      details: {
        osOrType: 'Sysmon Kernel Driver + EDR + RunAsPPL',
        pidOrPort: 'EventID 10 · 0x1010 · comsvcs.dll|dbgcore.dll',
        privilege: 'Kernel ObRegisterCallbacks Visibility',
        artifacts: [
          'Sysmon EID 10: rundll32.exe -> lsass.exe (0x1010)',
          'CallTrace exposes comsvcs.dll + dbgcore.dll even if ordinal #24 used',
          'Mitigation: RunAsPPL = 1 + Credential Guard blocks OpenProcess',
        ],
        description:
          'Kernel-level handle telemetry and defense layer that catches signed comsvcs.dll memory reads regardless of command-line obfuscation or dump renaming, and blocks access entirely when RunAsPPL is enabled.',
      },
    },
  ],
  processTree: [
    {
      pid: 620,
      ppid: 4,
      name: 'services.exe',
      commandLine: 'C:\\Windows\\System32\\services.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'normal',
      activeFromStage: 1,
      apiCalls: ['CreateProcessW("lsass.exe")'],
    },
    {
      pid: 684,
      ppid: 620,
      name: 'lsass.exe',
      commandLine: 'C:\\Windows\\System32\\lsass.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      integrity: 'SYSTEM',
      status: 'injected',
      activeFromStage: 2,
      apiCalls: [
        'Handle Opened by rundll32.exe (PID 5412) -> GrantedAccess 0x1010 (PROCESS_VM_READ)',
        'ReadProcessMemory(lsasrv.dll!LogonSessionList, 0x00007FF7A8100000)',
        'MiniDumpWriteDump() reads msv1_0.dll & kerberos.dll credential structures',
      ],
      memoryBlocks: [
        {
          address: '0x00007FF7A8100000',
          section: 'lsasrv.dll!LogonSessionList (Private Heap)',
          permissions: 'RW-',
          size: '128 KB',
          status: 'patched',
          description:
            'Linked list of active interactive and network logon sessions inside lsass.exe. Read directly across process boundaries by rundll32.exe via OpenProcess(0x1010) when RunAsPPL is disabled.',
          hexPreview: '4C 53 41 53 52 56 00 00 10 00 00 00 F0 4A 22 A8  LSASRV.......J".',
        },
        {
          address: '0x00007FFAD4200000',
          section: 'msv1_0.dll & kerberos.dll Credential Cache',
          permissions: 'R--',
          size: '64 KB',
          status: 'injected',
          description:
            'In-memory primary NTLM hash buffers and Kerberos ticket-granting ticket (TGT) structures plus LSA encryption keys copied verbatim into the full minidump stream.',
          hexPreview: '4D 53 56 31 5F 30 00 00 31 D6 CF E0 D1 6A E9 31  MSV1_0..1....j.1',
        },
        {
          address: '0x000001C840200000',
          section: 'dbgcore.dll MDMP Serialization Buffer (debug.dmp)',
          permissions: 'RW-',
          size: '48 MB',
          status: 'shellcode',
          description:
            'Serialized Windows Minidump stream beginning with signature 4D 44 4D 50 93 A7 ("MDMP") written to C:\\Windows\\Temp\\debug.dmp by MiniDumpWriteDump(MiniDumpWithFullMemory).',
          hexPreview: '4D 44 4D 50 93 A7 00 00 0F 00 00 00 20 00 00 00  MDMP........ ...',
        },
      ],
    },
    {
      pid: 4920,
      ppid: 3104,
      name: 'cmd.exe',
      commandLine: 'C:\\Windows\\System32\\cmd.exe',
      user: 'CORP\\adm_jchen',
      integrity: 'High',
      status: 'suspicious',
      activeFromStage: 1,
      apiCalls: [
        'Security EID 4672 -> SeDebugPrivilege assigned to High-integrity token',
        'tasklist /fi "imagename eq lsass.exe" -> resolves PID 684',
      ],
    },
    {
      pid: 5412,
      ppid: 4920,
      name: 'rundll32.exe',
      commandLine:
        'C:\\Windows\\System32\\rundll32.exe C:\\Windows\\System32\\comsvcs.dll, MiniDump 684 C:\\Windows\\Temp\\debug.dmp full',
      user: 'CORP\\adm_jchen',
      integrity: 'High',
      status: 'malicious',
      activeFromStage: 2,
      apiCalls: [
        'LoadLibraryW("C:\\Windows\\System32\\comsvcs.dll") -> GetProcAddress(Ordinal #24 / MiniDump)',
        'RtlAdjustPrivilege(SE_DEBUG_PRIVILEGE, TRUE)',
        'OpenProcess(0x1010, FALSE, 684) -> Sysmon Event ID 10 triggered',
        'dbgcore.dll!MiniDumpWriteDump(hLsass, 684, hFile, MiniDumpWithFullMemory)',
      ],
    },
  ],
  stages: [
    {
      index: 1,
      title: 'SeDebugPrivilege Elevation & LSASS Process ID (PID 684) Discovery',
      subtitle: 'High-Integrity Admin Token Confirmed via EID 4672 Before Targeting lsass.exe',
      description:
        'An elevated administrative shell (cmd.exe PID 4920) verifies SeDebugPrivilege via Security Event ID 4672 and runs tasklist to obtain the live numeric PID (684) of lsass.exe required by comsvcs.dll.',
      mitreTacticPhase: 3,
      mitreTechniqueId: 'T1134',
      mitreTechniqueName: 'Access Token Manipulation (SeDebugPrivilege)',
      activeNodeIds: ['admin_cmd', 'rundll32_lolbin', 'sysmon_eid10_booth'],
      compromisedNodeIds: ['admin_cmd'],
      keySpecs: [
        { term: 'PRIVILEGE GATE', value: 'SeDebugPrivilege (Security EID 4672 · High Integrity)' },
        { term: 'DISCOVERY CMD', value: 'tasklist /fi "imagename eq lsass.exe" -> PID 684' },
        { term: 'HOST & ACTOR', value: 'WKS-ADM-07 (10.20.14.37) · CORP\\adm_jchen' },
      ],
    },
    {
      index: 2,
      title: 'Signed LOLBin Execution (rundll32.exe + comsvcs.dll,#24) & OpenProcess(0x1010)',
      subtitle: 'Microsoft-Signed DLL Requests PROCESS_VM_READ on lsass.exe (Sysmon EID 10)',
      description:
        'rundll32.exe (PID 5412) loads Microsoft-signed comsvcs.dll and invokes MiniDump (or ordinal #24 to evade string matching), opening a 0x1010 handle to lsass.exe (PID 684) recorded verbatim by Sysmon Event ID 10.',
      mitreTacticPhase: 4,
      mitreTechniqueId: 'T1218.011',
      mitreTechniqueName: 'System Binary Proxy Execution: Rundll32',
      activeNodeIds: ['rundll32_lolbin', 'comsvcs_minidump', 'lsass_vault', 'sysmon_eid10_booth'],
      compromisedNodeIds: ['admin_cmd', 'rundll32_lolbin', 'comsvcs_minidump'],
      keySpecs: [
        { term: 'LOLBIN COMMAND', value: 'rundll32.exe comsvcs.dll, MiniDump (#24) 684 debug.dmp full' },
        { term: 'HANDLE MASK', value: 'GrantedAccess 0x1010 (PROCESS_QUERY_LIMITED | VM_READ)' },
        { term: 'SYSMON CALLTRACE', value: 'ntdll.dll -> KERNELBASE.dll -> comsvcs.dll -> dbgcore.dll' },
      ],
    },
    {
      index: 3,
      title: 'MiniDumpWriteDump Full-Memory Serialization to C:\\Windows\\Temp\\debug.dmp',
      subtitle: '48.2 MB MDMP (4D 44 4D 50 93 A7) Snapshot Captures NTLM & Kerberos RAM',
      description:
        'dbgcore.dll!MiniDumpWriteDump copies lsasrv.dll!LogonSessionList, msv1_0.dll, and kerberos.dll memory regions into a 48.2 MB MDMP file on disk (Sysmon EID 11) ready for covert exfiltration.',
      mitreTacticPhase: 5,
      mitreTechniqueId: 'T1003.001',
      mitreTechniqueName: 'OS Credential Dumping: LSASS Memory',
      activeNodeIds: ['comsvcs_minidump', 'lsass_vault', 'mdmp_dump_file', 'sysmon_eid10_booth'],
      compromisedNodeIds: ['admin_cmd', 'rundll32_lolbin', 'comsvcs_minidump', 'lsass_vault', 'mdmp_dump_file'],
      keySpecs: [
        { term: 'DUMP API', value: 'dbgcore.dll!MiniDumpWriteDump (MiniDumpWithFullMemory 0x2)' },
        { term: 'MAGIC SIGNATURE', value: '4D 44 4D 50 93 A7 ("MDMP") · 48.2 MB (Sysmon EID 11)' },
        { term: 'STOLEN REGIONS', value: 'lsasrv.dll!LogonSessionList + msv1_0.dll + kerberos.dll' },
      ],
    },
    {
      index: 4,
      title: 'Offline Credential Parsing (pypykatz) vs. Sysmon EID 10 & RunAsPPL Defense',
      subtitle: 'Zero Mimikatz on Disk Caught by CallTrace Correlation & Blocked by PPL',
      description:
        'The adversary moves debug.dmp off-host to extract NTLM hashes and Kerberos TGTs offline with pypykatz, while blue-team defenders correlate Sysmon EID 1 + 10 + 11 and enforce RunAsPPL + Credential Guard to defeat future dumps.',
      mitreTacticPhase: 7,
      mitreTechniqueId: 'T1003.001',
      mitreTechniqueName: 'OS Credential Dumping: LSASS Memory (Detection & Hardening)',
      activeNodeIds: ['mdmp_dump_file', 'sysmon_eid10_booth', 'lsass_vault'],
      compromisedNodeIds: ['admin_cmd', 'rundll32_lolbin', 'comsvcs_minidump', 'lsass_vault', 'mdmp_dump_file'],
      keySpecs: [
        { term: 'OFFLINE PARSER', value: 'pypykatz lsa minidump debug.dmp (Zero AV Trigger on Host)' },
        { term: 'SIEM CORRELATION', value: 'Sysmon EID 1 (ordinal #24) + EID 10 (0x1010) + EID 11 (MDMP)' },
        { term: 'KERNEL HARDENING', value: 'HKLM\\...\\Lsa\\RunAsPPL=1 + VBS Credential Guard' },
      ],
    },
  ],
  telemetry: LSASS_COMSVCS_MINIDUMP_TELEMETRY,
};

export const stepGuide: RawScenarioStepGuideData = {
  scenarioId: 'dfir-lsass-minidump-comsvcs-sysmon-eid10',
  briefing: {
    headline: 'Scenario Briefing: LSASS MiniDump via comsvcs.dll & Sysmon EventID 10 (T1003.001)',
    storyAnalogy:
      'Imagine an armored marble bank safe-deposit vault where every VIP safety-deposit box holds golden master passkeys behind a circular brushed-steel vault door, watched from across the hall by a glass security guard booth. Instead of bringing bolt cutters or breaking the hinges, a rogue insider flashes an elevated golden inspector badge, calls in the bank’s own certified brass-framed vault photographer carrying an official X-ray camera, and asks the photographer to snap a full cross-section X-ray photograph of every open safety-deposit drawer inside the vault. In a single bright crimson camera flash, an instant X-ray photo negative slides out onto a plain cardboard packing table in the hallway, where the insider drops it into an unlabeled courier envelope to develop the master passkeys offline later—never realizing the glass security guard booth logged the exact X-ray camera badge number, the camera’s wide-open lens setting, and the exact aisle path straight to the vault door.',
    plainSummary:
      'In this flagship Windows DFIR scenario (MITRE ATT&CK T1134, T1218.011, and T1003.001) grounded in Microsoft Sysinternals, Microsoft Learn, and Splunk SURGe research, an elevated administrator dumps LSASS credentials on WKS-ADM-07 using only built-in signed Microsoft binaries. The attack unfolds in one continuous arc: verifying SeDebugPrivilege and lsass.exe PID 684, then invoking Microsoft-signed rundll32.exe with comsvcs.dll MiniDump (or ordinal #24) to acquire a 0x1010 PROCESS_VM_READ handle, then writing a 48.2 MB MDMP snapshot (C:\\Windows\\Temp\\debug.dmp) for offline NTLM/Kerberos extraction, while Sysmon Event ID 10 CallTrace correlation exposes the theft and RunAsPPL blocks it at the kernel layer. Steps #1-#4 trace every forensic artifact end-to-end, and Memory Forensics contrasts unprotected LSASS reads against RunAsPPL kernel enforcement.',
    diagramTopologySummary:
      'On the diagram: Follow Step #1 from Node ① (cmd.exe PID 4920 with SeDebugPrivilege) resolving PID 684, watch Step #2 spawn Node ② (rundll32.exe PID 5412) and invoke Node ③ (comsvcs.dll -> dbgcore.dll) to open Node ④ (lsass.exe PID 684), see Step #3 write Node ⑤ (C:\\Windows\\Temp\\debug.dmp 48.2 MB MDMP), and track Step #4 as Node ⑥ (Sysmon EID 10 & PPL Watch) exposes the CallTrace and enforces RunAsPPL.',
    documentedAdvisory:
      'Microsoft Sysinternals Sysmon EID 10 · Microsoft Learn RunAsPPL & MiniDumpWriteDump · Splunk SURGe & LOLBAS comsvcs.dll',
  },
  steps: [
    {
      stepNumber: 1,
      mitreId: 'T1134',
      plainTitle: 'SeDebugPrivilege Elevation & lsass.exe PID 684 Lookup',
      storyAnalogy:
        'At the administrative brass desk on the left side of the marble bank hall, a rogue insider flashes an elevated golden inspector badge that unlocks private back-office access. Before summoning the photographer, the insider checks the bank’s glowing room directory plaque to note the exact vault door number where the VIP safety-deposit boxes sit.',
      simpleExplanation:
        'Windows blocks standard users from reading another system process’s memory, so LSASS dumping first requires a High-integrity administrative token holding SeDebugPrivilege (a privileged right allowing a process to inspect and open handles to SYSTEM processes). Security Event ID 4672 records SeDebugPrivilege assignment at logon for CORP\\adm_jchen, and the operator executes tasklist /fi "imagename eq lsass.exe" from cmd.exe (PID 4920) to resolve the live numeric Process ID (684) that comsvcs.dll expects as its first MiniDump parameter.',
      howItWorksInPractice:
        'Because comsvcs.dll!MiniDump requires a numeric target Process ID rather than a symbolic process name, attackers almost always enumerate lsass.exe via tasklist /fi "imagename eq lsass.exe", PowerShell Get-Process lsass, or wmic process get Name,ProcessId moments before executing rundll32.exe. Internally, Windows kernel SeSinglePrivilegeCheck honors SeDebugPrivilege (privilege LUID 20) to override standard discretionary access control lists on SYSTEM processes—making a High-integrity Security Event ID 4672 followed within seconds by lsass.exe PID discovery an early, high-signal precursor before any credential bytes ever leave memory.',
      diagramAlignment:
        'On the diagram, Step #1 starts at Node ① (cmd.exe PID 4920 on WKS-ADM-07) confirming SeDebugPrivilege and staging Node ② (rundll32.exe PID 5412), observed by Node ⑥ (Sysmon EID 10 & PPL Watch).',
      detectionAndEvidence:
        'Correlate Windows Security Event ID 4672 (Special Privileges Assigned containing SeDebugPrivilege) with Sysmon Event ID 1 / Windows Security Event ID 4688 process creation logs showing cmd.exe (PID 4920) or PowerShell querying lsass.exe process IDs, enforced via Sigma hunting rules in SIEM and EDR telemetry.',
    },
    {
      stepNumber: 2,
      mitreId: 'T1218.011',
      plainTitle: 'Signed rundll32.exe Proxy & comsvcs.dll Ordinal #24 OpenProcess(0x1010)',
      storyAnalogy:
        'Instead of smuggling contraband tools past the front door, the insider wheels the bank’s own certified brass-framed vault photographer right down the marble aisle to the circular steel vault door. Turning the brass aperture ring wide open on the official X-ray camera, the photographer requests full read-through viewing access straight into the glowing vault drawers.',
      simpleExplanation:
        'To evade antivirus signatures targeting Mimikatz or ProcDump, the operator runs Microsoft-signed C:\\Windows\\System32\\rundll32.exe (Windows’ native DLL execution proxy binary) pointing at C:\\Windows\\System32\\comsvcs.dll, MiniDump 684 C:\\Windows\\Temp\\debug.dmp full (or substitutes export ordinal #24 so naive command-line filters matching the literal word MiniDump miss the launch). Internally, comsvcs.dll enables SeDebugPrivilege via RtlAdjustPrivilege (the native Windows syscall that activates held privileges on the current token) and calls OpenProcess against lsass.exe (PID 684) with GrantedAccess 0x1010 (a minimal access mask combining PROCESS_QUERY_LIMITED_INFORMATION and PROCESS_VM_READ to read remote memory), triggering a high-fidelity Sysmon Event ID 10 (ProcessAccess kernel callback record) whose CallTrace stack explicitly lists comsvcs.dll and dbgcore.dll.',
      howItWorksInPractice:
        'Because both rundll32.exe and comsvcs.dll are legitimately Microsoft-signed system binaries already residing in C:\\Windows\\System32, hash-based allowlists, AppLocker default publisher rules, and file-reputation filters will not block them—and switching from the export name "MiniDump" to ordinal "#24" (or copying comsvcs.dll to a renamed temp path) defeats naive command-line string rules. However, Windows kernel ObRegisterCallbacks inside Sysmon64.sys intercepts every NtOpenProcess call targeting lsass.exe, logging GrantedAccess 0x1010 and unwinding the user-mode stack CallTrace through comsvcs.dll and dbgcore.dll with near-zero false positives.',
      diagramAlignment:
        'On the diagram, Step #2 flows from Node ② (rundll32.exe PID 5412) through Node ③ (comsvcs.dll -> dbgcore.dll) into Node ④ (lsass.exe PID 684) while Node ⑥ (Sysmon EID 10 & PPL Watch) logs GrantedAccess=0x1010 and CallTrace.',
      detectionAndEvidence:
        'Inspect Sysmon Event ID 10 (ProcessAccess) and EDR kernel handle telemetry for TargetImage ending in \\lsass.exe with GrantedAccess masks 0x1010, 0x1410, or 0x1FFFFF where CallTrace includes comsvcs.dll and dbgcore.dll, paired with Sigma rules on Sysmon Event ID 1 catching rundll32.exe loading comsvcs.dll by name or ordinal #24.',
    },
    {
      stepNumber: 3,
      mitreId: 'T1003.001',
      plainTitle: 'dbgcore.dll!MiniDumpWriteDump Full-Memory Snapshot (MDMP)',
      storyAnalogy:
        'With the vault glass swung into cutaway view, the brass X-ray camera fires a blazing crimson flash directly through every VIP safety-deposit box inside the vault. Moments later, an instant X-ray photo negative slides out of the camera onto a corridor packing table and slips into a plain courier sleeve so the insider can study every master passkey quietly off-site.',
      simpleExplanation:
        'Once OpenProcess returns a valid handle to lsass.exe (PID 684), comsvcs.dll invokes dbgcore.dll!MiniDumpWriteDump using the MiniDumpWithFullMemory (0x2) flag. Windows reads the private virtual memory pages of lsasrv.dll!LogonSessionList (0x00007FF7A8100000), msv1_0.dll, and kerberos.dll (0x00007FFAD4200000), writing a 48.2 MB minidump file to C:\\Windows\\Temp\\debug.dmp that begins with the unmistakable 6-byte signature 4D 44 4D 50 93 A7 ("MDMP").',
      howItWorksInPractice:
        'When the operator passes the trailing "full" keyword to comsvcs.dll!MiniDump, dbgcore.dll sets MINIDUMP_TYPE = MiniDumpWithFullMemory (0x00000002), enumerating every readable virtual memory range in lsass.exe via NtQueryVirtualMemory and copying them via NtReadVirtualMemory into the output file handle. Renaming the output dump to look harmless (such as report.txt, cache.dat, or logo.png) does not change its 6-byte magic header (4D 44 4D 50 93 A7) or its embedded ModuleListStream entries for lsasrv.dll and msv1_0.dll—so Sysmon Event ID 11 paired with YARA header inspection reliably unmasks the stolen memory snapshot.',
      diagramAlignment:
        'On the diagram, Step #3 streams credential RAM from Node ④ (lsass.exe PID 684) via Node ③ (comsvcs.dll -> dbgcore.dll) onto Node ⑤ (C:\\Windows\\Temp\\debug.dmp 48.2 MB MDMP), firing Sysmon Event ID 11 at Node ⑥ (Sysmon EID 10 & PPL Watch).',
      detectionAndEvidence:
        'Monitor Sysmon Event ID 11 (FileCreate) and EDR file telemetry for rundll32.exe (PID 5412) writing large multi-megabyte files into C:\\Windows\\Temp or C:\\Users\\Public, and run YARA memory/disk scans matching magic header 4D 44 4D 50 93 A7 alongside embedded lsasrv.dll and msv1_0.dll strings.',
    },
    {
      stepNumber: 4,
      mitreId: 'T1003.001',
      plainTitle: 'Offline pypykatz Extraction vs. Sysmon CallTrace Hunting & RunAsPPL',
      storyAnalogy:
        'Even though the insider carries the sealed X-ray negative out of the building to develop the golden passkeys in a distant darkroom, the elevated glass security guard booth has already caught every movement on its central monitor. Locking a violet spotlight beam straight onto the photographer’s camera path, the chief guard triggers an immediate alert and slams an unbreakable steel blast shield across every bank vault so no X-ray lens can ever peer through again.',
      simpleExplanation:
        'After exfiltrating C:\\Windows\\Temp\\debug.dmp off WKS-ADM-07, the attacker parses it offline with pypykatz (pypykatz lsa minidump debug.dmp) or Mimikatz to recover NTLM hashes and Kerberos TGTs without ever running cracking tools on the monitored endpoint. Defenders defeat this entire class of Living-off-the-Land credential theft in two layers: (1) correlating Sysmon Event ID 1 + Event ID 10 (CallTrace: comsvcs.dll + dbgcore.dll) + Event ID 11 in SIEM/EDR for instant containment, and (2) enabling kernel-enforced LSA Protection (RunAsPPL = 1) plus VBS-backed Windows Defender Credential Guard (LsaIso.exe) so rundll32.exe receives STATUS_ACCESS_DENIED (0xC0000022) before reading a single byte of lsass.exe.',
      howItWorksInPractice:
        'Because offline dumping decouples credential extraction from the compromised workstation, waiting for endpoint Mimikatz binary signatures is too late—even if the attacker deletes C:\\Windows\\Temp\\debug.dmp immediately after exfiltration, centralized SIEM forwarding retains the ProcessGuid-linked triad of Sysmon EID 1, EID 10, and EID 11. Permanently closing this attack surface requires enabling HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\RunAsPPL = 1 (PsProtectedSignerLsa-Light, which rejects non-PPL OpenProcess calls at PsTestProtectedProcessIncompatibility) alongside VBS Credential Guard (isolating NTLM/TGT secrets inside VTL1 LsaIso.exe) and Defender ASR LSASS blocking.',
      diagramAlignment:
        'On the diagram, Step #4 links Node ⑤ (C:\\Windows\\Temp\\debug.dmp) and Node ⑥ (Sysmon EID 10 & PPL Watch) back to Node ④ (lsass.exe PID 684) to enforce RunAsPPL kernel protection and trigger SOC credential rotation.',
      detectionAndEvidence:
        'Correlate SIEM alerts across Sysmon Event ID 1 (rundll32 + comsvcs/#24), Sysmon Event ID 10 (0x1010 + dbgcore.dll CallTrace), and Sysmon Event ID 11 (MDMP file creation), verify EDR ASR LSASS block logs, and audit HKLM\\SYSTEM\\CurrentControlSet\\Control\\Lsa\\RunAsPPL = 1 plus Credential Guard status across all Windows endpoints.',
    },
  ],
};

export * from './choreography';
export * from './telemetry';
