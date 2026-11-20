import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an intruder who renames a heavy data-theft truck to look like a harmless system broom, drives off with gigabytes of company files, and shreds the truck afterward. Investigators expose the heist using two quiet building efficiency meters: the morning fast-loader notebook records exactly how many times that disguised broom ran, its last eight timestamps, and every folder it touched, while the power-and-data utility meter logs the exact number of outbound megabytes that specific broom shipped out of the building.',
      storyMappings: [
        {
          storyTerm: 'Morning fast-loader notebook tracking every launch and touched folder',
          technicalTerm: 'Windows Prefetch (MAM-compressed .pf files) recording run count, last 8 timestamps, and file handles',
          tone: 'amber',
        },
        {
          storyTerm: 'Power-and-data utility meter logging exact outbound megabytes per tool',
          technicalTerm: 'SRUM database (SRUDB.dat) Network Data Usage table ({973F5D5C-1D90-4944-BE8E-24B94231A174})',
          tone: 'sky',
        },
        {
          storyTerm: 'Heavy data-theft truck disguised as a harmless system broom',
          technicalTerm: 'Masqueraded exfiltration binary (e.g., svchost_sync.exe / renamed rclone) run from Temp',
          tone: 'rose',
        },
        {
          storyTerm: 'Proving exact stolen data volume even after binary deletion',
          technicalTerm: 'Correlating PECmd Prefetch timelines with SRUM BytesSent per AppId and UserSid',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'When the intruder launches a renamed exfiltration tool from a temporary folder, the operating system built-in launch-accelerator service watches the first ten seconds of execution to learn which files and libraries the tool loads.',
        storyMappings: [
          {
            storyTerm: 'Renamed exfiltration tool run from a temporary folder',
            technicalTerm: 'Masqueraded rclone / custom exfiltrator executed out of C:\\Windows\\Temp',
            tone: 'amber',
          },
          {
            storyTerm: 'Built-in launch-accelerator service watching the first ten seconds',
            technicalTerm: 'Windows SysMain (Superfetch) Prefetcher tracing loaded DLLs and accessed paths',
            tone: 'sky',
          },
          {
            storyTerm: 'Compressed fast-start card saved automatically',
            technicalTerm: 'MAM-compressed .pf artifact written to C:\\Windows\\Prefetch\\<EXE>-<HASH>.pf',
            tone: 'rose',
          },
          {
            storyTerm: 'Surviving rapid deletion of the malware',
            technicalTerm: 'Prefetch file persisting on disk long after the attacker deletes the executable',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'Decompressing that fast-start card offline, forensic analysts immediately read three golden clues: total launch count, up to the last eight exact execution timestamps, and the exact list of staged ZIP archives or folders the tool opened.',
        storyMappings: [
          {
            storyTerm: 'Decompressing the fast-start card offline',
            technicalTerm: 'Parsing MAM-compressed Windows 10/11 .pf files with PECmd',
            tone: 'amber',
          },
          {
            storyTerm: 'Total launches and up to eight exact timestamps',
            technicalTerm: 'Prefetch RunCount and last 8 execution UTC timestamps embedded in .pf metadata',
            tone: 'sky',
          },
          {
            storyTerm: 'Exact list of staged archives and folders opened',
            technicalTerm: 'Prefetch referenced file/directory paths proving which victim archives the tool touched',
            tone: 'rose',
          },
          {
            storyTerm: 'Unique path fingerprint stamped in the filename',
            technicalTerm: '8-character Prefetch path hash verifying the exact directory where the binary ran',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'To quantify exactly how many gigabytes of corporate secrets left the building, analysts open the System Resource Usage Meter database, which quietly tracks every outbound byte sent per executable and per user account for thirty to sixty days.',
        storyMappings: [
          {
            storyTerm: 'System Resource Usage Meter database',
            technicalTerm: 'ESE database C:\\Windows\\System32\\sru\\SRUDB.dat',
            tone: 'amber',
          },
          {
            storyTerm: 'Network Data Usage table recording exact outbound bytes',
            technicalTerm: 'SRUM GUID {973F5D5C-1D90-4944-BE8E-24B94231A174} logging BytesSent and BytesRecvd',
            tone: 'sky',
          },
          {
            storyTerm: 'Attributing stolen volume to the exact binary and user',
            technicalTerm: 'Joining SruDbIdMapTable AppId and UserSid to pinpoint the exfiltrating account',
            tone: 'rose',
          },
          {
            storyTerm: 'Defeating zero-network-log blind spots',
            technicalTerm: 'Proving multi-gigabyte exfiltration on hosts lacking firewall or NetFlow telemetry',
            tone: 'emerald',
          },
        ],
      },
    },
  };
