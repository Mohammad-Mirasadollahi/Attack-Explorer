import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'splunk-ivanti-connect-secure',
    briefing: {
      headline: 'Scenario Briefing: Ivanti Connect Secure Zero-Day Chain (CVE-2023-46805 & CVE-2024-21887), "WIREFIRE" Webshell',
      storyAnalogy:
        'Imagine a secure government building where visitors must show an ID badge at the outer checkpoint before reaching any internal office. However, a hallway shortcut (../ path traversal) lets anyone walk around the outer checkpoint straight to the Python maintenance office (/api/v1/license/keys-status/). Once at the maintenance office window, the visitor hands over a form containing ; shell_command #, and the clerk types it straight into the building’s root terminal and installs a hidden translator (WIREFIRE) inside the public login page.',
      plainSummary:
        'In this scenario (CVE-2024-21887, Splunk STRT & Mandiant - Ivanti Connect Secure (UNC5221): Auth Bypass, RCE & ZIPLINE Backdoor), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: bypassing Authentication With ../../, then injecting Shell Commands Into keys-status, then implanting "WIREFIRE" in visits.py. Steps #1–#3 walk that chain end-to-end by covering Bypassing Authentication With ../../, then Injecting Shell Commands Into keys-status, then Implanting "WIREFIRE" in visits.py, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (UTA0178 Operator), send the path-traversal + command-injection request to Node ②/③ (Ivanti Connect Secure /api/v1/totp/user-backup-code/../../license/keys-status/), trace the popen() root execution and WIREFIRE webshell injection inside Node ④ (web REST Daemon & visits.py), and follow the VPN credential harvesting on Node ⑤ monitored by Node ⑥ (Splunk SIEM).',
      documentedAdvisory: 'CISA Emergency Directive 24-01 · Volexity UTA0178 & Mandiant UNC5221 Ivanti Zero-Day Analysis · CVE-2023-46805 & CVE-2024-21887',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Bypassing Authentication With ../../ Traversal Through /api/v1/totp/user-backup-code/ (CVE-2023-46805)',
        storyAnalogy:
          'The outer door guard (web daemon) has a checklist that says: "Anyone walking down the /api/v1/totp/user-backup-code/ hallway does not need to be logged in yet." The attacker starts down that hallway, but immediately takes two ../../ steps backward into the restricted /license/keys-status/ room, slipping right past the outer guard.',
        simpleExplanation:
          'In Ivanti Connect Secure, the outer web gatekeeper checks whether a requested URL starts with a public prefix like /api/v1/totp/user-backup-code/ (an endpoint that must be reachable before login so users who lost their phone can submit a backup 2FA code). By requesting /api/v1/totp/user-backup-code/../../license/keys-status/, the outer gatekeeper sees the allowed prefix and waves the request through without asking for a password, while the internal Python router resolves the "../../" path traversal and hands the request straight to the restricted admin-only /api/v1/license/keys-status/ endpoint.',
        howItWorksInPractice:
          'Because the authentication filter checked the raw un-normalized URI prefix (startswith("/api/v1/totp/user-backup-code")) before the backend web framework normalized "../" segments (CVE-2023-46805), any unauthenticated internet client can reach any internal REST API endpoint on the VPN appliance. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (Attacker) to Node ②/③ (Ivanti VPN Gateway /api/v1/totp/user-backup-code/../../license/keys-status/), and return arrow ⇠#1 bypassing the auth filter.',
        detectionAndEvidence:
          'Documented in CISA ED 24-01 and Splunk SURGe (emergency federal directive and detection rules for gateway traversal): HTTP requests containing /api/v1/totp/user-backup-code/.. or /api/v1/cav/client/status/.. (which reveal attempts to step out of public routes into restricted administrative handlers). Correlate Sysmon or Windows Security Event telemetry for T1190 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.004',
        plainTitle: 'Injecting Shell Commands Into keys-status URL Parameters (CVE-2024-21887)',
        storyAnalogy:
          'Now standing at the restricted /license/keys-status/ counter without ever logging in, the attacker writes ;python -c ... # in the node-name field. The Python clerk pastes that string straight into a popen() shell command and runs it as root.',
        simpleExplanation:
          'Once the path-traversal request reaches /api/v1/license/keys-status/;python%20-c%20..., the backend Python handler takes the URL parameter and passes it directly into subprocess.Popen(..., shell=True) without input sanitization (CVE-2024-21887, an OS command injection flaw where untrusted URL characters are interpreted as live Linux shell commands). Inside that string, the semicolon (; which in Bash/sh terminates the legitimate license-check command and immediately executes the attacker’s python -c payload right behind it) runs the attacker’s code with full root privileges.',
        howItWorksInPractice:
          'Why did the attacker chain two CVEs? Because CVE-2024-21887 (command injection in keys-status) normally required an administrator login, and CVE-2023-46805 (path traversal) only bypassed authentication without running code. Combining both inside a single HTTP URL turns them into a 1-packet unauthenticated root RCE. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #2→ triggers popen() inside Node ④ (Ivanti Python REST Backend), and ⇠#2 executes the stage-1 payload as root.',
        detectionAndEvidence:
          'Documented by Volexity and Mandiant (incident investigations of chained gateway compromises): Ivanti unallocated log / syslog entries showing /api/v1/license/keys-status/; followed by unexpected child processes of the web daemon (proving command injection after authentication bypass). Correlate Sysmon or Windows Security Event telemetry for T1574.006 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1505.003',
        plainTitle: 'Implanting "WIREFIRE" in visits.py, "ZIPLINE" via LD_PRELOAD & "WARPWIRE" Credential Stealer',
        storyAnalogy:
          'To stay inside permanently, the attacker remounts the read-only floor tiles as writable, slips the WIREFIRE webshell into visits.py, plants the ZIPLINE LD_PRELOAD rootkit in libsecure.so, and modifies the login page JavaScript (WARPWIRE) to steal every employee’s plaintext VPN password as they log in.',
        simpleExplanation:
          'Synthesizing Volexity (UTA0178) and Mandiant (UNC5221) findings, with root access on the VPN appliance the attacker runs mount -o remount,rw / (temporarily unlocking the appliance’s read-only system partition so built-in files can be edited) and deploys a multi-layered malware suite: (1) Volexity’s WIREFIRE Python webshell injected directly inside visits.py (modifying an already-existing API file so basic file-count checks do not spot an extra file) and WARPWIRE JavaScript credential harvester injected into the VPN login page to steal plaintext Active Directory passwords; plus (2) Mandiant’s ZIPLINE passive backdoor loaded via LD_PRELOAD inside libsecure.so (intercepting accept() network calls inside the legitimate Ivanti web daemon).',
        howItWorksInPractice:
          'As Mandiant UNC5221 documented, the threat actor also patches ComponentIntegrity.pm (so Ivanti’s built-in Integrity Checker Tool reports "0 modified files" when an admin runs an internal self-check, which is why CISA ED 24-01 mandated running the external offline ICT snapshot tool). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #3→ implants WIREFIRE/ZIPLINE on Node ④ and harvests VPN user credentials via WARPWIRE on Node ⑤, while Node ⑥ (Splunk SIEM / External ICT) detects the visits.py modification and outbound traffic.',
        detectionAndEvidence:
          'Documented by Volexity (UTA0178) and Mandiant (UNC5221) (forensic artifact lists for persistent gateway backdoors): modification of visits.py, libsecure.so (ZIPLINE), and ComponentIntegrity.pm discovered via external Integrity Checker Tool (ICT) snapshots (because on-box checkers can be blinded by the intruder). Correlate Sysmon or Windows Security Event telemetry for T1556 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
