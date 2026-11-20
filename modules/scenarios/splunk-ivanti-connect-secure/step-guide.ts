import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'splunk-ivanti-connect-secure',
    briefing: {
      headline: 'Scenario Briefing: Ivanti Connect Secure Zero-Day Chain (CVE-2023-46805 & CVE-2024-21887), "WIREFIRE" Webshell',
      storyAnalogy:
        'Imagine a secure government building where visitors must show an ID badge at the outer checkpoint before reaching any internal office. However, a hallway shortcut (../ path traversal) lets anyone walk around the outer checkpoint straight to the Python maintenance office (/api/v1/license/keys-status/). Once at the maintenance office window, the visitor hands over a form containing ; shell_command #, and the clerk types it straight into the building’s root terminal and installs a hidden translator (WIREFIRE) inside the public login page.',
      plainSummary:
        'Documented by Volexity, Mandiant, CISA (Emergency Directive 24-01), and Splunk SURGe (January 2024), this scenario traces the two-bug zero-day chain used by UTA0178 to compromise Ivanti Connect Secure VPN appliances. By combining CVE-2023-46805 (an authentication bypass using "../../" path traversal inside /api/v1/totp/user-backup-code/../../license/keys-status/ so the outer web gatekeeper thinks the user is visiting an unauthenticated login-helper page) with CVE-2024-21887 (an OS command injection flaw where the backend Python service passes the URL parameter directly into a root popen() shell call), an unauthenticated attacker executes arbitrary root commands and implants the WIREFIRE Python webshell.',
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
          'Because the authentication filter checked the raw un-normalized URI prefix (startswith("/api/v1/totp/user-backup-code")) before the backend web framework normalized "../" segments (CVE-2023-46805), any unauthenticated internet client can reach any internal REST API endpoint on the VPN appliance.',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① (Attacker) to Node ②/③ (Ivanti VPN Gateway /api/v1/totp/user-backup-code/../../license/keys-status/), and return arrow ⇠#1 bypassing the auth filter.',
        detectionAndEvidence:
          'Documented in CISA ED 24-01 & Splunk SURGe: HTTP requests containing /api/v1/totp/user-backup-code/.. or /api/v1/cav/client/status/...',
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
          'Why did the attacker chain two CVEs? Because CVE-2024-21887 (command injection in keys-status) normally required an administrator login, and CVE-2023-46805 (path traversal) only bypassed authentication without running code. Combining both inside a single HTTP URL turns them into a 1-packet unauthenticated root RCE.',
        diagramAlignment:
          'On the diagram, arrow #2→ triggers popen() inside Node ④ (Ivanti Python REST Backend), and ⇠#2 executes the stage-1 payload as root.',
        detectionAndEvidence:
          'Documented by Volexity & Mandiant: Ivanti unallocated log / syslog entries showing /api/v1/license/keys-status/; followed by unexpected child processes of the web daemon.',
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
          'As Mandiant UNC5221 documented, the threat actor also patches ComponentIntegrity.pm (so Ivanti’s built-in Integrity Checker Tool reports "0 modified files" when an admin runs an internal self-check, which is why CISA ED 24-01 mandated running the external offline ICT snapshot tool).',
        diagramAlignment:
          'On the diagram, arrow #3→ implants WIREFIRE/ZIPLINE on Node ④ and harvests VPN user credentials via WARPWIRE on Node ⑤, while Node ⑥ (Splunk SIEM / External ICT) detects the visits.py modification and outbound traffic.',
        detectionAndEvidence:
          'Documented by Volexity (UTA0178) & Mandiant (UNC5221): modification of visits.py, libsecure.so (ZIPLINE), and ComponentIntegrity.pm discovered via external Integrity Checker Tool (ICT) snapshots.',
      },
    ],
  };
