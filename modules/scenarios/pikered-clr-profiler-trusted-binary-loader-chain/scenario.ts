import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'pikered-clr-profiler-trusted-binary-loader-chain',
    title: 'PikeRed Research & MITRE T1574.012 — Abusing the .NET CLR Profiler: VHDX MotW Bypass & Trusted-Binary Loader Chain (KeePass.exe -> clr.dll)',
    category: 'MALWARE',
    mitreId: 'T1574.012',
    description:
      'Grounded in PikeRed cybersecurity research ("Abusing the CLR Profiler: A Trusted-Binary Loader Chain for Initial Access") and MITRE ATT&CK T1574.012: an attacker delivers a weaponized `.vhdx` container that strips Mark-of-the-Web (`Zone.Identifier` ADS) upon mounting, conceals operational binaries using Windows `Hidden` + `System` (`+h +s`) file attributes, and sets `.NET` Common Language Runtime (CLR) diagnostic environment variables (`COR_ENABLE_PROFILING=1`, `COR_PROFILER`, `COR_PROFILER_PATH`) before launching a signed, trusted `.NET` application (`KeePass.exe`) so `clr.dll!ProfilingAPIUtility::LoadProfiler` automatically loads an unmanaged COM profiler DLL (`ICorProfilerCallback::Initialize`) in-process.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Initial Access Delivery (Weaponized .vhdx)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Mounted VHDX Volume (MotW Stripped + attrib +h +s)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Launcher Setting COR_ENABLE_PROFILING=1 & COR_PROFILER_PATH', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'PikeRed / Sysmon EID 1, 7 & VHDMP Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Signed KeePass.exe -> clr.dll -> ICorProfilerCallback::Initialize', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: VHDX Container Mounting (MotW Bypass) & `attrib +h +s` Super-Hidden File Concealment',
        narration:
          'The user opens a weaponized `.vhdx` virtual hard disk (`Payroll_2026.vhdx`). Windows mounts the virtual disk via `vhdmp.sys` (logging VHDMP Operational EventID 1 / 12), and because NTFS `Zone.Identifier` Mark-of-the-Web (MotW) streams are not propagated to files inside mounted VHDX volumes, SmartScreen is bypassed. Inside the mounted drive (`E:\\`), the signed `.NET` host binary (`KeePass.exe`) and custom profiler DLL (`ProfilerLoader.dll`) are marked with both `FILE_ATTRIBUTE_HIDDEN` and `FILE_ATTRIBUTE_SYSTEM` (`attrib +h +s`), leaving only a single decoy shortcut visible in Explorer even when "Show hidden files" is enabled.',
        activeNodes: ['attacker', 'firewall', 'siem'],
        mitreTactic: 'Initial Access & Defense Evasion (T1553.005 - Mark-of-the-Web Bypass / T1564.001 - Hidden Files)',
        technicalCommands: [
          'Mount-DiskImage -ImagePath "C:\\Users\\victim\\Downloads\\Payroll_2026.vhdx" (Mounts volume E:\\ without Zone.Identifier MotW)',
          'attrib.exe +h +s E:\\.runtime\\KeePass.exe && attrib.exe +h +s E:\\.runtime\\ProfilerLoader.dll',
        ],
        defenseMitigation:
          'Block `.vhdx`, `.vhd`, and `.iso` auto-mounting via Group Policy or file-extension association hardening, and correlate `Microsoft-Windows-VHDMP-Operational` EventID 12 with process creation from newly mounted drive letters.',
        logs: [
          {
            id: 'pikered-1',
            timestamp: '11:04:10.115',
            source: 'Windows Event Log',
            severity: 'critical',
            EventCode: 12,
            ProcessName: 'explorer.exe',
            raw: 'LogName: Microsoft-Windows-VHDMP-Operational | EventID: 12 | VhdFile: C:\\Users\\victim\\Downloads\\Payroll_2026.vhdx | MountedVolume: E:\\ | FileAttributes: FILE_ATTRIBUTE_HIDDEN | FILE_ATTRIBUTE_SYSTEM (+h +s) on E:\\.runtime\\* | Reference: PikeRed CLR Profiler Research',
            parsedFields: {
              ContainerFormat: 'VHDX Virtual Hard Disk (Bypassing NTFS Zone.Identifier MotW)',
              FileConcealment: 'attrib +h +s (Hidden + System super-hidden attributes)',
              VisibleTrigger: 'Decoy LNK Shortcut on Mounted Volume E:\\',
            },
          },
        ],
        packets: [],
      },
      {
        id: 2,
        title: 'Stage 2: Process Environment Seeding (`COR_ENABLE_PROFILING=1`, `COR_PROFILER`, `COR_PROFILER_PATH`)',
        narration:
          'When the user double-clicks the decoy shortcut on `E:\\`, the execution trigger populates three Common Language Runtime (CLR) profiling variables inside the child process environment block—`COR_ENABLE_PROFILING=1`, `COR_PROFILER={B7A3F9E1-4C2D-4A8B-9E10-C1D2E3F4A5B6}`, and `COR_PROFILER_PATH=E:\\.runtime\\ProfilerLoader.dll`—and immediately spawns the legitimate, digitally signed `.NET` application (`KeePass.exe`) without writing any registry keys (`HKCU\\Software\\Classes\\CLSID` is not needed when `COR_PROFILER_PATH` is used on .NET 4+).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Persistence, Privilege Escalation & Defense Evasion (T1574.012 - Hijack Execution Flow: COR_PROFILER)',
        technicalCommands: [
          'cmd.exe /c "set COR_ENABLE_PROFILING=1 && set COR_PROFILER={B7A3F9E1-4C2D-4A8B-9E10-C1D2E3F4A5B6} && set COR_PROFILER_PATH=E:\\.runtime\\ProfilerLoader.dll && start \"\" E:\\.runtime\\KeePass.exe"',
        ],
        defenseMitigation:
          'Inspect the `Environment` field in Sysmon EventID 1 or EDR process creation telemetry for `COR_ENABLE_PROFILING=1` and `COR_PROFILER_PATH=` on non-developer workstations.',
        logs: [
          {
            id: 'pikered-2',
            timestamp: '11:04:14.380',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'KeePass.exe',
            CommandLine: 'E:\\.runtime\\KeePass.exe',
            raw: 'EventID: 1 | Image: E:\\.runtime\\KeePass.exe | Signed: true (Dominik Reichl / Trusted .NET Assembly) | Environment: COR_ENABLE_PROFILING=1; COR_PROFILER={B7A3F9E1-4C2D-4A8B-9E10-C1D2E3F4A5B6}; COR_PROFILER_PATH=E:\\.runtime\\ProfilerLoader.dll',
            parsedFields: {
              TrustedHostBinary: 'KeePass.exe (Legitimate Signed .NET Framework Executable)',
              CorEnableProfiling: 'COR_ENABLE_PROFILING=1',
              CorProfilerGuid: '{B7A3F9E1-4C2D-4A8B-9E10-C1D2E3F4A5B6}',
              CorProfilerPath: 'E:\\.runtime\\ProfilerLoader.dll (Registry-free .NET 4+ loading)',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: `mscoree.dll` -> `clr.dll!ProfilingAPIUtility::LoadProfiler` & `ICorProfilerCallback::Initialize` Execution',
        narration:
          'During `KeePass.exe` startup, the .NET shim (`mscoree.dll`) initializes the Common Language Runtime (`clr.dll`). `clr.dll!ProfilingAPIUtility::LoadProfiler` reads `COR_ENABLE_PROFILING=1` and `COR_PROFILER_PATH`, loads the unmanaged C++ COM server `ProfilerLoader.dll` into `KeePass.exe` via `LoadLibraryW`, resolves `DllGetClassObject` + `IClassFactory::CreateInstance`, and invokes `ICorProfilerCallback::Initialize(IUnknown *pICorProfilerInfoUnk)`, executing the attacker’s payload inside the trusted `KeePass.exe` process without any cross-process injection API calls.',
        activeNodes: ['target', 'ad', 'siem'],
        mitreTactic: 'Defense Evasion & Execution (T1574.012 - COR_PROFILER / Trusted-Binary Loader Chain)',
        technicalCommands: [
          'clr.dll!ProfilingAPIUtility::LoadProfiler() -> LoadLibraryW("E:\\.runtime\\ProfilerLoader.dll") -> DllGetClassObject()',
          'ProfilerLoader.dll!ICorProfilerCallback2::Initialize(pICorProfilerInfoUnk) -> Executes C2 loader inside signed KeePass.exe',
        ],
        defenseMitigation:
          'Correlate Windows Application Event Log ID `1022` (`.NET Runtime` profiler loaded notification) and Sysmon EventID 7 where a signed `.NET` binary loads an unsigned unmanaged DLL from a mounted VHDX or user-writable path.',
        logs: [
          {
            id: 'pikered-3',
            timestamp: '11:04:14.920',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 7,
            ProcessName: 'KeePass.exe',
            raw: 'EventID: 7 | Image: E:\\.runtime\\KeePass.exe | ImageLoaded: E:\\.runtime\\ProfilerLoader.dll | Signed: false | CallTrace: mscoree.dll -> clr.dll!ProfilingAPIUtility::LoadProfiler -> ProfilerLoader.dll!ICorProfilerCallback::Initialize | .NET Runtime EventID: 1022',
            parsedFields: {
              ClrRuntimeEngine: 'mscoree.dll -> clr.dll!ProfilingAPIUtility::LoadProfiler',
              ComEntryPoint: 'DllGetClassObject -> ICorProfilerCallback::Initialize()',
              DotNetEventLog: '.NET Runtime EventID 1022 (Profiler was loaded successfully)',
              ReferenceUrl: 'https://www.pikered.com/en/learn/abusing-the-clr-profiler-a-trusted-binary-loader-chain-for-initial-access/',
            },
          },
        ],
        packets: [],
      },
    ],
  };
