import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'unit42-panos-midnight-eclipse',
    briefing: {
      headline: 'Scenario Briefing: Operation Midnight Eclipse (CVE-2024-3400), Palo Alto PAN-OS GlobalProtect Zero-Day',
      storyAnalogy:
        'Imagine a hotel front desk where any guest can hand the clerk a luggage tag (SESSID cookie). The clerk simply uses the guest’s tag name to create an empty note file in a back-office folder, and once every minute, a night janitor reads every filename in that folder out loud into the building’s master Intercom system (bash -c). By writing a file path and a shell command inside the luggage tag itself, the attacker tricks the front desk into planting a booby-trapped filename that the janitor executes with full master-key privileges.',
      plainSummary:
        'In this scenario (CVE-2024-3400, Unit 42 - Operation MidnightEclipse: PAN-OS GlobalProtect RCE & UPSTYLE Backdoor), the attacker follows one continuous arc: directory Traversal in the "SESSID" Cookie Creates, then the Root Telemetry Cron Job Executes the Malicious, then deploying the "UPSTYLE" Python Webshell. Steps #1–#3 examine #1 Directory Traversal in the "SESSID" Cookie Creates; #2 The Root Telemetry Cron Job Executes the Malicious; #3 Deploying the "UPSTYLE" Python Webshell. The Process Hierarchy tab shows the Parent → Child spawn tree. Primary detection correlates process, authentication, and network telemetry for CVE-2024-3400 across the documented kill chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (UTA0218 Attacker Infrastructure), send the crafted SESSID cookie to Node ②/③ (PAN-OS GlobalProtect Portal :443), watch the file land in /opt/panlogs/tmp/device_telemetry/minute/ and trigger root execution inside Node ④ (dt_curl Telemetry Cron), and trace the UPSTYLE Python backdoor implanted in Node ⑤ (Nginx CSS Path) while Node ⑥ (Cortex XSIAM / SIEM) captures the telemetry.',
      documentedAdvisory: 'Palo Alto Unit 42 MidnightEclipse · Volexity UTA0218 · Rapid7 Root-Cause Analysis · CVE-2024-3400 · CISA KEV',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Directory Traversal in the "SESSID" Cookie Creates a File With Backtick Shell Commands',
        storyAnalogy:
          'The intruder walks up to the GlobalProtect VPN check-in window and presents a forged SESSID luggage tag that starts with ../../../../, forcing the session clerk to place an empty file directly inside the root janitor’s "To-Do" folder, with a shell command disguised as the filename itself.',
        simpleExplanation:
          'The attacker sends an unauthenticated HTTPS POST request to /ssl-vpn/hipreport.esp (the Host Information Profile endpoint on the GlobalProtect VPN portal, which is reachable from the internet before a user finishes logging in). Instead of a normal session ID, the Cookie: SESSID= header contains ../../../../opt/panlogs/tmp/device_telemetry/minute/aacurl ... | sh (where the "../" path traversal climbs out of the session folder into the firewall’s telemetry queue directory, and the backticks ... embed a Linux shell command directly inside the filename itself).',
        howItWorksInPractice:
          'When GlobalProtect processes hipreport.esp, its session serializer calls fopen() using the raw SESSID cookie value as the file path without stripping "../" sequences (creating an empty 0-byte file on disk, which is all the attacker needs, because the exploit payload lives inside the file’s name, not its contents). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (UTA0218 Attacker) to Node ②/③ (PAN-OS GlobalProtect /ssl-vpn/hipreport.esp), and return arrow ⇠#1 as the 0-byte file is created in /opt/panlogs/tmp/device_telemetry/minute/.',
        detectionAndEvidence:
          'Documented in Unit 42, Volexity, and Rapid7 CVE-2024-3400 advisories (incident response reports detailing perimeter appliance exploitation): PAN-OS appweb3 logs showing Cookie: SESSID=../../../../opt/panlogs/tmp/device_telemetry/minute/ and zero-byte file creation errors (which expose path traversal attempts targeting the telemetry staging folder). Correlate Sysmon or Windows Security Event telemetry for T1190 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.004',
        plainTitle: 'The Root Telemetry Cron Job ("dt_curl") Executes the Malicious Filename as Root',
        storyAnalogy:
          'Sixty seconds later, the automated root janitor (dt_curl) walks into the telemetry folder to upload files, reads the booby-trapped filename out loud inside a shell command without quotation marks, and accidentally runs the attacker’s script as root.',
        simpleExplanation:
          'Once every minute, the PAN-OS device telemetry cron job (dt_curl / sendTelemetry, a scheduled background script running with full uid=0(root) privileges) loops through every file in /opt/panlogs/tmp/device_telemetry/minute/ and pastes each filename directly into a shell command string without escaping special characters. When the Linux shell parses that command string, it sees the backticks (curl ... | sh, which in Bash/sh means "execute the command inside these backticks first and substitute its output"), immediately running the attacker’s payload as root.',
        howItWorksInPractice:
          'Because the attacker never needed to write data into the file, only control its filename via the Step 1 path traversal, even a 0-byte file in the minute/ telemetry folder triggers unauthenticated root Remote Code Execution the next time the cron job ticks. In the documented Auditd SYSCALL 59 exchange from DMZ Reverse Proxy & SPAN Tap to PAN-OS GlobalProtect Edge, PAN-OS GlobalProtect Edge responds with ACK UID 0 (root) (confirming that the CRON RCE (ROOT) request succeeded on PAN-OS GlobalProtect Edge and establishing the runtime state required for Step #3 UPSTYLE PYTHON .PTH PERSISTENCE & LOG C2).',
        diagramAlignment:
          'On the diagram, arrow #2→ shows Node ③ triggering Node ④ (dt_curl root cron job evaluating the backtick filename), and ⇠#2 spawns /bin/sh as uid=0(root) to fetch the stage-2 script.',
        detectionAndEvidence:
          'Documented by Unit 42 and Volexity (forensic analysis of compromised PAN-OS telemetry logs): /var/log/pan/device_telemetry_send.log containing shell syntax fragments and unexpected outbound connections initiated by dt_curl (proving that a crafted filename was evaluated as an operating system command). Correlate Sysmon or Windows Security Event telemetry for T1059.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1505.003',
        plainTitle: 'Deploying the "UPSTYLE" Python Webshell in system.pth and Stealing running-config.xml',
        storyAnalogy:
          'Now holding the building’s master key, the intruder copies the master blueprint (running-config.xml), slips an auto-start hook into Python’s startup list (system.pth), installs a hidden listener inside the hotel’s public stylesheet file (bootstrap.min.css), and sets a timer that wipes the security logs the moment a command finishes.',
        simpleExplanation:
          'Combining Volexity’s and Unit 42’s forensic findings: with root access on the firewall, the attacker steals /opt/pancfg/mgmt/saved-configs/running-config.xml (the master PAN-OS configuration file containing VPN pre-shared keys, administrator hashes, and internal network routes used by UTA0218 to pivot into internal Windows Domain Controllers via SMB/winexe) and injects the UPSTYLE Python backdoor into /usr/lib/python3.6/site-packages/system.pth (a Python path-configuration file that Python automatically executes every time any system script starts on the appliance). UPSTYLE monitors /var/log/pan/sslvpn_ngx_error.log for crafted HTTPS requests and writes command output into /var/appweb/sslvpndocs/global-protect/portal/css/bootstrap.min.css (the public CSS stylesheet of the VPN login page, letting the attacker read command results over port 443).',
        howItWorksInPractice:
          'When the attacker sends a specially formatted HTTPS request with a bogus URL that logs an error into sslvpn_ngx_error.log, the background UPSTYLE inotify daemon parses the embedded Base64 command, appends the output inside a CSS comment /*...*/ in bootstrap.min.css, and 15 seconds later restores the original CSS file and deletes the offending log line (erasing both the command and output traces).',
        diagramAlignment:
          'On the diagram, arrow #3→ implants UPSTYLE into Node ⑤ (PAN-OS system.pth, bootstrap.min.css & running-config.xml), while Node ⑥ (SIEM / Cortex XDR) flags the CSS modification timestamp and config exfiltration.',
        detectionAndEvidence:
          'Documented in Unit 42 & Volexity advisories: unauthorized entries in /usr/lib/python3.6/site-packages/system.pth, rogue Python processes running exec(base64.b64decode(...)), and unexpected mtime changes on bootstrap.min.css. Correlate Sysmon or Windows Security Event telemetry for T1546.016 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
