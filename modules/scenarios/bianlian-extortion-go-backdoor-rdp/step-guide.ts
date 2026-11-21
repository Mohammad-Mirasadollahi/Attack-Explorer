import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'bianlian-extortion-go-backdoor-rdp',
    briefing: {
      headline:
        'BianLian operators abandon file encryption in favor of pure data-exfiltration extortion (AA23-136A), deploying a custom Golang mTLS backdoor with an embedded yamux/go-socks5 proxy and exfiltrating terabytes of data via renamed rclone binaries.',
      storyAnalogy:
        'Imagine a modern heist crew that realizes blowing up the bank vault (ransomware encryption) sets off every alarm in the city and forces the bank to rebuild from backups anyway. Instead, they slip in quietly, install a single custom-built periscope (Golang mTLS + SOCKS5 Backdoor) that lets them peer into every room from across the ocean, photocopy every confidential legal and financial contract (rclone), and leave a quiet note on the CEO’s desk without touching a single lock.',
      plainSummary:
        'In this scenario (T1573.002, BianLian Custom Golang mTLS Backdoor, Built-In SOCKS5 & Pure Extortion (AA23-136A)), the attacker follows one continuous arc: deploying Custom Golang mTLS Backdoor with Hardcoded, then in-Memory Yamux Multiplexing, then pure Data-Exfiltration Extortion via Rclone. Steps #1–#3 examine #1 Deploying Custom Golang mTLS Backdoor with Hardcoded; #2 In-Memory Yamux Multiplexing; #3 Pure Data-Exfiltration Extortion via Rclone. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
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
