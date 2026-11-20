import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a bank whose active guardroom holds every unlocked employee keycard inside live working memory so workers do not have to re-type passwords all day. Instead of bringing in a banned lockpicking kit that front-desk scanners instantly recognize, an intruder unlocks a special debugger pass, calls over a genuinely signed built-in crash-snapshot clerk to photograph the entire guardroom memory onto a hidden file stamped with a telltale four-letter wax header, and quietly carries the photograph offsite to extract every keycard.',
      storyMappings: [
        {
          storyTerm: 'Unlocking a special debugger pass to spot the guardroom',
          technicalTerm: 'SeDebugPrivilege enablement (EventID 4672) and LSASS PID discovery',
          tone: 'amber',
        },
        {
          storyTerm: 'Calling a signed built-in crash-snapshot clerk to photograph memory',
          technicalTerm: 'rundll32.exe comsvcs.dll, MiniDump invoking OpenProcess + MiniDumpWriteDump (Sysmon EventID 10)',
          tone: 'sky',
        },
        {
          storyTerm: 'Hidden file stamped with a telltale four-letter wax header',
          technicalTerm: 'Output dump file beginning with MDMP magic bytes (4D 44 4D 50)',
          tone: 'rose',
        },
        {
          storyTerm: 'Extracting every keycard quietly offsite',
          technicalTerm: 'Offline Pypykatz / Mimikatz parsing of LSASS memory dump for NTLM hashes and Kerberos tickets',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'Holding administrator clearance, the intruder switches on the master debugging badge that lets an examiner peer inside other locked rooms, then looks up the exact room number assigned to the central credential guardroom.',
        storyMappings: [
          {
            storyTerm: 'Switching on the master debugging badge',
            technicalTerm: 'Enabling SeDebugPrivilege recorded in Windows Security EventID 4672',
            tone: 'amber',
          },
          {
            storyTerm: 'Central credential guardroom',
            technicalTerm: 'Windows Local Security Authority Subsystem Service (lsass.exe)',
            tone: 'sky',
          },
          {
            storyTerm: 'Looking up the exact room number',
            technicalTerm: 'Enumerating lsass.exe Process ID via tasklist or Get-Process lsass',
            tone: 'rose',
          },
          {
            storyTerm: 'Setting up a living-off-the-land extraction',
            technicalTerm: 'Preparing target PID argument for signed comsvcs.dll MiniDump export',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Rather than launching a notorious hacker utility, the intruder invokes a signed Microsoft system helper library to open a deep inspection door into the guardroom and snap a complete memory photograph straight to disk while the hallway sensor stamps the exact permission mask used.',
        storyMappings: [
          {
            storyTerm: 'Signed Microsoft system helper library',
            technicalTerm: 'rundll32.exe C:\\Windows\\System32\\comsvcs.dll, MiniDump <lsass_pid> <out> full',
            tone: 'amber',
          },
          {
            storyTerm: 'Deep inspection door opened into the guardroom',
            technicalTerm: 'Cross-process OpenProcess handle request to lsass.exe (GrantedAccess 0x1010 / 0x1FFFFF)',
            tone: 'sky',
          },
          {
            storyTerm: 'Snapping a complete memory photograph',
            technicalTerm: 'MiniDumpWriteDump writing live LSASS virtual memory pages to disk',
            tone: 'rose',
          },
          {
            storyTerm: 'Hallway sensor stamping the exact permission mask',
            technicalTerm: 'Sysmon EventID 10 (ProcessAccess) capturing SourceImage, TargetImage lsass.exe, and CallTrace',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'Even if the intruder disguises the resulting photograph with an innocent-looking text or picture filename, the file opening four bytes still carry the unmistakable MDMP studio watermark, letting defenders spot the theft while the attacker parses credentials offline.',
        storyMappings: [
          {
            storyTerm: 'Unmistakable four-byte studio watermark inside the file',
            technicalTerm: 'Windows Minidump file magic header MDMP (hex bytes 4D 44 4D 50)',
            tone: 'amber',
          },
          {
            storyTerm: 'Disguised innocent filename on disk',
            technicalTerm: 'Renamed dump file (e.g., C:\\Windows\\Temp\\debug.txt) flagged by magic-byte scanning',
            tone: 'sky',
          },
          {
            storyTerm: 'Parsing every keycard safely offsite',
            technicalTerm: 'Offline pypykatz lsa minidump extraction of NTLM hashes, Kerberos tickets, and DPAPI keys',
            tone: 'rose',
          },
          {
            storyTerm: 'Hardening the guardroom door permanently',
            technicalTerm: 'Enabling LSASS RunAsPPL (Protected Process Light) and Credential Guard',
            tone: 'emerald',
          },
        ],
      },
    },
  };
