import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'dfir-rdp-lateral-movement-tsclient-bitmap-cache',
    title: 'SANS DFIR & Microsoft Event Log — RDP Lateral Movement, Session Reconnection & BMC Bitmap Cache Forensics',
    category: 'ACTIVE_DIRECTORY',
    mitreId: 'T1021.001',
    description:
      'Grounded in SANS DFIR Poster (Windows RDP Forensics), Microsoft TerminalServices Event Log documentation, and MITRE ATT&CK T1021.001: an investigator reconstructs an interactive Remote Desktop lateral movement pivot across source and destination hosts by correlating RdpCoreTS EventID 131, Security EventID 4624 (LogonType 10), LocalSessionManager EventIDs 21/24/25, TerminalServices-RDPClient EventID 1024/1102, and client-side Bitmap Cache (cache*.bin / bmc) tiles.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'Pivot Host WKS-07 (mstsc.exe)', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Internal VLAN Router (:3389)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Target Server SRV-APP02 (TermService)', type: 'server', status: 'compromised' },
      { id: 'siem', label: 'LSM EID 21/24/25 & RdpCoreTS', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'BMC Cache & Default.rdp Registry', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Outbound mstsc.exe Connection, MRU Registry & RDPClient EventID 1024 / 1102 on Source Host',
        narration:
          'When the attacker launches mstsc.exe on source host WKS-07 (10.10.4.19) to connect to SRV-APP02 (10.10.20.45), Windows records the target IP/hostname in NTUSER.DAT (Software\\Microsoft\\Terminal Server Client\\Servers\\10.10.20.45\\UsernameHint) and logs EventID 1024 (RDP ClientActiveX is trying to connect) and EventID 1102 in Microsoft-Windows-TerminalServices-RDPClient/Operational.',
        activeNodes: ['attacker', 'firewall', 'ad'],
        mitreTactic: 'Lateral Movement (T1021.001 - Remote Services: Remote Desktop Protocol)',
        technicalCommands: [
          'mstsc.exe /v:10.10.20.45',
          'Registry Artifact: NTUSER.DAT\\Software\\Microsoft\\Terminal Server Client\\Servers\\10.10.20.45 (UsernameHint + CertHash)',
          'TerminalServices-RDPClient/Operational EventID 1024 & 1102 (Target IP 10.10.20.45)',
        ],
        defenseMitigation:
          'Collect Microsoft-Windows-TerminalServices-RDPClient/Operational logs from workstations and jump hosts to track outbound RDP destinations even if destination server logs are wiped.',
        logs: [
          {
            id: 'dfir-rdp-1',
            timestamp: '22:18:04.112',
            source: 'WinEvent',
            severity: 'high',
            EventCode: 1024,
            ProcessName: 'mstsc.exe',
            CommandLine: 'mstsc.exe /v:10.10.20.45',
            raw: 'LogName: Microsoft-Windows-TerminalServices-RDPClient/Operational | EventID: 1024 | Computer: WKS-07.corp.local | Description: RDP ClientActiveX is trying to connect to the server (10.10.20.45) | NTUSER.DAT UsernameHint: CORP\\admin_db',
            parsedFields: {
              SourceHost: 'WKS-07.corp.local (10.10.4.19)',
              LogChannel: 'Microsoft-Windows-TerminalServices-RDPClient/Operational',
              EventID: '1024 (Connection Attempt) / 1102 (Server IP)',
              RegistryMru: 'Software\\Microsoft\\Terminal Server Client\\Servers\\10.10.20.45',
            },
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: Destination Server NLA Logon (EventID 4624 Type 10 / 7), RdpCoreTS 131 & LSM EventID 21 / 25',
        narration:
          'On destination server SRV-APP02, Microsoft-Windows-RemoteDesktopServices-RdpCoreTS/Operational logs EventID 131 (Client IP:Port 10.10.4.19:54912), Security logs EventID 4624 (LogonType 10 RemoteInteractive or LogonType 7 when reconnecting to a locked session), and TerminalServices-LocalSessionManager/Operational logs EventID 21 (Session logon succeeded, Session ID 2) or EventID 25 (Session reconnection succeeded).',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Lateral Movement (T1021.001 - Destination LSM EventID 21/24/25 & RdpCoreTS 131)',
        technicalCommands: [
          'RemoteDesktopServices-RdpCoreTS/Operational EventID 131: ClientIP=10.10.4.19:54912',
          'Security EventID 4624: LogonType=10 (RemoteInteractive) IpAddress=10.10.4.19',
          'TerminalServices-LocalSessionManager/Operational EventID 21 (Logon), 24 (Disconnected), 25 (Reconnected)',
        ],
        defenseMitigation:
          'Correlate Security EventID 4624 (LogonType 10 and LogonType 7) with TerminalServices-LocalSessionManager/Operational EventIDs 21 and 25 so RDP session reconnections (which log as Type 7 instead of Type 10) are never missed.',
        logs: [
          {
            id: 'dfir-rdp-2',
            timestamp: '22:18:05.340',
            source: 'WinEvent',
            severity: 'critical',
            EventCode: 21,
            ProcessName: 'svchost.exe',
            CommandLine: 'svchost.exe -k NetworkService -s TermService (Session 2 Logon from 10.10.4.19)',
            raw: 'LogName: Microsoft-Windows-TerminalServices-LocalSessionManager/Operational | EventID: 21 | User: CORP\\admin_db | SessionID: 2 | Source Network Address: 10.10.4.19 | Correlated Security EventID 4624 LogonType=10 & RdpCoreTS EventID 131',
            parsedFields: {
              LogChannel: 'TerminalServices-LocalSessionManager/Operational',
              EventID: '21 (Session Logon) / 25 (Session Reconnect) / 24 (Disconnect)',
              SessionId: '2',
              SourceNetworkAddress: '10.10.4.19',
            },
          },
        ],
      },
      {
        id: 3,
        title: 'Stage 3: Client-Side RDP Bitmap Cache (Cache0000.bin / bmc2-tools) Visual Screen Reconstruction',
        narration:
          'During the interactive session on SRV-APP02, mstsc.exe on WKS-07 caches 64x64 pixel screen tiles inside %LOCALAPPDATA%\\Microsoft\\Terminal Server Client\\Cache\\Cache0000.bin (and bcache24.bmc). Using ANSSI bmc-tools and Rdpieces, DFIR analysts carve and reassemble the bitmap tiles from WKS-07 to visually reconstruct the exact GUI tools and commands the attacker ran on SRV-APP02.',
        activeNodes: ['attacker', 'ad', 'siem'],
        mitreTactic: 'Collection (T1021.001 - RDP Bitmap Cache Visual Reconstruction)',
        technicalCommands: [
          'Artifact Path: C:\\Users\\admin_db\\AppData\\Local\\Microsoft\\Terminal Server Client\\Cache\\Cache0000.bin',
          'python3 bmc-tools.py -s Cache0000.bin -d ./extracted_tiles -b',
          'perl rdpieces.pl ./extracted_tiles  # Reconstructs 64x64 pixel GUI frames from the RDP session',
        ],
        defenseMitigation:
          'Preserve %LOCALAPPDATA%\\Microsoft\\Terminal Server Client\\Cache\\*.bin and *.bmc on pivot hosts during incident response to recover visual evidence when destination servers are encrypted or wiped.',
        logs: [
          {
            id: 'dfir-rdp-3',
            timestamp: '22:24:10.900',
            source: 'Sysmon',
            severity: 'high',
            EventCode: 11,
            ProcessName: 'mstsc.exe',
            CommandLine: 'mstsc.exe writing 64x64 RDP bitmap tiles to Cache0000.bin',
            raw: 'EventID: 11 | Computer: WKS-07.corp.local | Image: C:\\Windows\\System32\\mstsc.exe | TargetFilename: C:\\Users\\admin_db\\AppData\\Local\\Microsoft\\Terminal Server Client\\Cache\\Cache0000.bin | ForensicTool: ANSSI bmc-tools (3,412 64x64 bitmap tiles carved)',
            parsedFields: {
              ArtifactFile: '%LOCALAPPDATA%\\Microsoft\\Terminal Server Client\\Cache\\Cache0000.bin',
              TileDimensions: '64x64 Raw Bitmap Tiles',
              ForensicParser: 'ANSSI bmc-tools.py + Rdpieces',
              EvidentiaryValue: 'Visual reconstruction of attacker GUI actions on remote host',
            },
          },
        ],
      },
    ],
  };
