import type { ScenarioStandardPatch } from '@/modules/scenarios/contracts';

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
