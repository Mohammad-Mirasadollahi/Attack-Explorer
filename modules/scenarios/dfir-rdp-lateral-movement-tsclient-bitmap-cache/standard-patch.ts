import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine an intruder sitting at one factory desk who opens a live remote video-and-keyboard booth into a restricted server room down the hall. Both the local desk diary and the distant room sign-in book automatically stamp matching connection receipts, while the local booth quietly saves hundreds of tiny square photo tiles of every window the intruder views, allowing forensic detectives to piece the intruder screen back together like a mosaic.',
      storyMappings: [
        {
          storyTerm: 'Local desk diary stamping the outgoing booth call',
          technicalTerm: 'Source workstation mstsc.exe MRU registry keys and RDPClient EventID 1024 / 1102',
          tone: 'amber',
        },
        {
          storyTerm: 'Distant server room sign-in book recording the arrival',
          technicalTerm: 'Destination EventID 4624 (LogonType 10/7), RdpCoreTS 131, and LocalSessionManager logs',
          tone: 'sky',
        },
        {
          storyTerm: 'Tiny square photo tiles saved quietly at the local desk',
          technicalTerm: 'Client-side 64x64 pixel RDP Bitmap Cache (Cache0000.bin) under %LOCALAPPDATA%',
          tone: 'rose',
        },
        {
          storyTerm: 'Detectives piecing the intruder screen back together like a mosaic',
          technicalTerm: 'Visual screen reconstruction via bmc2-tools exposing attacker commands on disk',
          tone: 'emerald',
        },
      ],
    },
    steps: {
      1: {
        storyAnalogy:
          'At the starting desk, the intruder types a target room address into the remote-viewing console. Even before the distant room answers, the desk personal address book and outgoing call ledger faithfully record the destination room and timestamp.',
        storyMappings: [
          {
            storyTerm: 'Remote-viewing console at the starting desk',
            technicalTerm: 'mstsc.exe launched on source workstation WKS-07 (10.10.4.19)',
            tone: 'amber',
          },
          {
            storyTerm: 'Personal address book saving recent rooms',
            technicalTerm: 'HKCU\\Software\\Microsoft\\Terminal Server Client\\Default MRU registry values',
            tone: 'sky',
          },
          {
            storyTerm: 'Outgoing call ledger recording the destination',
            technicalTerm: 'Microsoft-Windows-TerminalServices-RDPClient/Operational EventID 1024 and 1102',
            tone: 'rose',
          },
          {
            storyTerm: 'Target room down the hall',
            technicalTerm: 'Destination server SRV-APP02 (10.10.20.45) listening on TCP/3389',
            tone: 'emerald',
          },
        ],
      },
      2: {
        storyAnalogy:
          'When the connection lands in the restricted server room, three separate lobby ledgers wake up in sequence: the front network door logs the arriving IP address, the badge desk logs an interactive remote check-in, and the session desk notes whether the visitor started a fresh chair or slipped back into a disconnected one.',
        storyMappings: [
          {
            storyTerm: 'Front network door logging the arriving IP',
            technicalTerm: 'RdpCoreTS/Operational EventID 131 capturing source IP 10.10.4.19',
            tone: 'amber',
          },
          {
            storyTerm: 'Badge desk logging an interactive remote check-in',
            technicalTerm: 'Windows Security EventID 4624 with LogonType 10 (RemoteInteractive) or 7 (Reconnect)',
            tone: 'sky',
          },
          {
            storyTerm: 'Session desk tracking fresh versus reconnected chairs',
            technicalTerm: 'TerminalServices-LocalSessionManager/Operational EventID 21, 24, and 25',
            tone: 'rose',
          },
          {
            storyTerm: 'Pre-entry badge inspection gate',
            technicalTerm: 'Network Level Authentication (NLA) validating credentials before session render',
            tone: 'emerald',
          },
        ],
      },
      3: {
        storyAnalogy:
          'To keep the remote video screen fast and smooth, the viewer console on the starting desk secretly stores hundreds of 64-by-64-pixel square picture tiles of every button, terminal line, and file folder shown on screen, leaving behind a visual mosaic that investigators can stitch back together even after the intruder clears every text log.',
        storyMappings: [
          {
            storyTerm: 'Hundreds of square picture tiles saved for speed',
            technicalTerm: 'Persistent 64x64 pixel RDP Bitmap Cache files (Cache0000.bin / bcache24.bmc)',
            tone: 'amber',
          },
          {
            storyTerm: 'Hidden desk drawer storing the tiles',
            technicalTerm: '%LOCALAPPDATA%\\Microsoft\\Terminal Server Client\\Cache on WKS-07',
            tone: 'sky',
          },
          {
            storyTerm: 'Stitching the mosaic back together',
            technicalTerm: 'Forensic parsing with bmc2-tools rendering visual screenshots of attacker activity',
            tone: 'rose',
          },
          {
            storyTerm: 'Evidence surviving cleared text logs',
            technicalTerm: 'Client-side visual proof of commands typed on SRV-APP02',
            tone: 'emerald',
          },
        ],
      },
    },
  };
