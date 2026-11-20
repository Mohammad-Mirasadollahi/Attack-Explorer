import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an intruder who wants a complete photograph of the central credential guardroom without ever opening a suspicious camera lens directly at the guardroom door. Instead, the intruder flips two official diagnostic switches on the building own built-in crash-inspector board so the operating system Error Reporting clerk itself politely photographs the entire guardroom memory into a chosen folder whenever a silent-exit bell is rung.',
      storyMappings: [
        {
          storyTerm: 'Flipping the silent-exit monitoring switch for the guardroom',
          technicalTerm: 'IFEO GlobalFlag set to FLG_MONITOR_SILENT_PROCESS_EXIT (0x200) on lsass.exe',
          tone: 'amber',
        },
        {
          storyTerm: 'Pointing the crash-inspector dump tray at an attacker folder',
          technicalTerm: 'SilentProcessExit\\lsass.exe ReportingMode=2, DumpType=2, and LocalDumpFolder',
          tone: 'sky',
        },
        {
          storyTerm: 'Ringing the silent-exit bell so the official clerk photographs memory',
          technicalTerm: 'Calling RtlReportSilentProcessExit causing signed WerFault.exe to dump full LSASS RAM',
          tone: 'rose',
        },
        {
          storyTerm: 'Catching the registry trap before the bell even rings',
          technicalTerm: 'Sysmon EventID 13 alerting on IFEO and SilentProcessExit registry writes for lsass.exe',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Walking up to the system debugging switchboard, the intruder flips on the special silent-exit watch flag specifically targeting the credential guardroom so the operating system watches for exit notifications on that process.',
        storyMappings: [
          {
            storyTerm: 'System debugging switchboard',
            technicalTerm: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Image File Execution Options\\lsass.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Special silent-exit watch flag',
            technicalTerm: 'GlobalFlag DWORD set to 0x200 (FLG_MONITOR_SILENT_PROCESS_EXIT)',
            tone: 'sky',
          },
          {
            storyTerm: 'Registry guard noticing tampering on a crown-jewel process',
            technicalTerm: 'Sysmon EventID 13 alerting on IFEO GlobalFlag modification targeting lsass.exe',
            tone: 'rose',
          },
          {
            storyTerm: 'Setting up an indirect official dump mechanism',
            technicalTerm: 'Enabling Windows Error Reporting silent-exit hooking without killing lsass.exe',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Next, on the companion Silent Process Exit panel, the intruder specifies Full-Memory Photograph mode and types in their own local drop folder so the official crash clerk knows exactly how much to capture and where to place the file.',
        storyMappings: [
          {
            storyTerm: 'Companion Silent Process Exit panel',
            technicalTerm: 'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SilentProcessExit\\lsass.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Specifying Full-Memory Photograph mode',
            technicalTerm: 'ReportingMode=2 (Local Dump) and DumpType=2 (MiniDumpWithFullMemory)',
            tone: 'sky',
          },
          {
            storyTerm: 'Typing in a custom local drop folder',
            technicalTerm: 'LocalDumpFolder pointing to an attacker-accessible staging directory (e.g., C:\\Temp)',
            tone: 'rose',
          },
          {
            storyTerm: 'Persistent registry evidence left behind',
            technicalTerm: 'Unusual SilentProcessExit\\lsass.exe subkeys flagged during live triage or hive forensics',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Finally, the intruder taps the undocumented silent-exit chime inside a tiny helper tool. Hearing the chime, the signed Microsoft Error Reporting clerk itself marches over, dumps the entire live LSASS credential memory cleanly into the attacker folder, and leaves LSASS running completely undisturbed.',
        storyMappings: [
          {
            storyTerm: 'Tapping the undocumented silent-exit chime',
            technicalTerm: 'Invoking ntdll!RtlReportSilentProcessExit against a handle to lsass.exe',
            tone: 'amber',
          },
          {
            storyTerm: 'Signed Error Reporting clerk capturing full memory',
            technicalTerm: 'Legitimate C:\\Windows\\System32\\WerFault.exe writing a full lsass.exe.dmp file',
            tone: 'sky',
          },
          {
            storyTerm: 'Bypassing naive non-signed-binary LSASS dump rules',
            technicalTerm: 'Delegating OpenProcess + MiniDumpWriteDump to Microsoft-signed WerFault.exe',
            tone: 'rose',
          },
          {
            storyTerm: 'Catching the indirect dump cleanly',
            technicalTerm: 'Alerting on WerFault.exe writing lsass*.dmp files outside standard WER crash queues',
            tone: 'emerald',
          },
        ],
      },
    },
  };
