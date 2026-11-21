import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'f5-bigip-request-smuggling',
    briefing: {
      headline: 'Scenario Briefing: F5 BIG-IP TMUI Auth Bypass & AJP Request Smuggling (CVE-2023-46747)',
      storyAnalogy:
        'Imagine a building with a strict front-door security guard (Apache httpd) and a trusting back-office clerk (Apache Tomcat) who talk to each other over an internal pneumatic tube (AJP protocol). A visitor sends a single long envelope whose outer label says it is just a public login-page check, so the front-door guard lets it through. Inside the pneumatic tube, however, the oversized message spills over and creates a brand-new second internal work order marked REMOTE_USER = admin. The back-office clerk reads that second forged work order and believes the front guard already verified the visitor as the building’s master administrator.',
      plainSummary:
        'In this scenario (CVE-2023-46747, F5 Security & Mandiant - F5 BIG-IP TMUI AJP Request Smuggling to Root RCE), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: smuggling a Forged Second AJP Request Past, then using the Smuggled Admin Context to Create, then executing Arbitrary root Commands. Steps #1–#3 walk that chain end-to-end by covering Smuggling a Forged Second AJP Request Past, then Using the Smuggled Admin Context to Create, then Executing Arbitrary root Commands, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates process, authentication, and network telemetry for CVE-2023-46747 across the documented kill chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ① (Attacker), send the crafted HTTP request to Node ②/③ (F5 BIG-IP TMUI Front-End Apache :443), trace the smuggled AJP packet (0x1234 prefix + SC_A_REMOTE_USER = admin) entering Node ④ (Back-End Tomcat & tmsh Engine), and watch the tmsh root command execution on Node ⑤ detected by Node ⑥ (BIG-IP Audit & SIEM).',
      documentedAdvisory: 'F5 Security Advisory K000137353 · ProjectDiscovery CVE-2023-46747 Analysis · CISA KEV · MITRE T1190',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Smuggling a Forged Second AJP Request Past Front-End Apache via CVE-2023-46747',
        storyAnalogy:
          'The attacker sends a request to a public login helper page (/tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp) with a precisely sized HTTP header that overflows the internal AJP pneumatic tube packet, sneaking a hidden second AJP message (REMOTE_USER=admin) right behind it.',
        simpleExplanation:
          'The attacker sends an unauthenticated HTTPS POST request to a reachable TMUI endpoint (/tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp). By carefully sizing the HTTP headers and body, mod_proxy_ajp on the front-end Apache server miscalculates the binary AJP packet boundary and forwards the attacker’s raw payload bytes as a brand-new, second AJP request (starting with the AJP magic bytes 0x12 0x34) to the back-end Tomcat server on port 8009, with the internal AJP header attribute SC_A_REMOTE_USER set to "admin" (spoofing a fully authenticated administrator session because Tomcat blindly trusts whichever username the front-end Apache proxy puts in SC_A_REMOTE_USER).',
        howItWorksInPractice:
          'In a two-tier Apache + Tomcat AJP architecture, Tomcat does not re-verify passwords; it assumes the front-end Apache server already checked the user’s login before setting SC_A_REMOTE_USER. Smuggling a raw second AJP frame inside the socket stream lets an unauthenticated attacker inject SC_A_REMOTE_USER=admin directly into Tomcat. In the documented Suricata CVE-2023-46747 exchange from Threat Actor (AJP Smuggler) to DMZ Reverse Proxy & SPAN Tap, DMZ Reverse Proxy & SPAN Tap responds with ALERT HTTP 200 (confirming that the AJP SMUGGLING POST request succeeded on DMZ Reverse Proxy & SPAN Tap and establishing the runtime state required for Step #2 ROGUE ADMIN ACCOUNT CREATION VIA TMSHCMD.JSP).',
        diagramAlignment:
          'On the diagram, follow arrow #1→ from Node ① to Node ②/③ (F5 BIG-IP Apache mod_proxy_ajp), and return arrow ⇠#1 smuggling the forged REMOTE_USER=admin AJP packet into Node ④ (Tomcat :8009).',
        detectionAndEvidence:
          'Documented by ProjectDiscovery and F5 K000137353 (vendor advisory detailing authentication bypass traces): /var/log/httpd/httpd_errors and Tomcat logs showing anomalous AJP header parsing and unauthenticated hits to /tmui/Control/jspmap/ (indicating a smuggled request reached the internal management servlet). Correlate Sysmon or Windows Security Event telemetry for T1190 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098',
        plainTitle: 'Using the Smuggled Admin Context to Create a Rogue BIG-IP Administrator via form_page',
        storyAnalogy:
          'Fooled by the forged REMOTE_USER=admin stamp on the smuggled work order, the back-end Tomcat clerk opens the internal UserCreate ledger and registers a brand-new administrator account with full bash terminal access.',
        simpleExplanation:
          'Executing inside Tomcat under the forged REMOTE_USER=admin identity (which bypasses the outer Apache authentication filter entirely because the smuggled request was born behind the Apache gatekeeper inside the internal AJP pipe), the request invokes the internal TMUI UserCreate handler (/tmui/Control/form) to create a new local BIG-IP administrator account granted Administrator role and Advanced Shell (/bin/bash) terminal access.',
        howItWorksInPractice:
          'When Tomcat processes the smuggled /tmui/Control/form request with SC_A_REMOTE_USER=admin, it communicates with the BIG-IP master control daemon (mcpd) to write the new administrator account into /config/bigip_user.conf. In the documented BIG-IP /var/log/audit exchange from DMZ Reverse Proxy & SPAN Tap to BIG-IP Apache Frontend (httpd), BIG-IP Apache Frontend (httpd) responds with ACK Audit 01070417 (confirming that the CREATE AUTH USER request succeeded on BIG-IP Apache Frontend (httpd) and establishing the runtime state required for Step #3 ROOT BASH EXECUTION & SSL PRIVATE KEY EXFILTRATION).',
        diagramAlignment:
          'On the diagram, arrow #2→ inside Node ④ invokes the TMUI UserCreate handler as admin, and ⇠#2 registers the rogue administrator in /config/bigip_user.conf.',
        detectionAndEvidence:
          'Documented in /var/log/audit and /var/log/ltm (local appliance configuration audit trails): creation of a new user account with role=admin and shell=bash without a preceding interactive web login (a high-confidence indicator of administrative authentication bypass). Correlate Sysmon or Windows Security Event telemetry for T1136.001 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1059.004',
        plainTitle: 'Executing Arbitrary root Commands via tmshCmd.jsp (util bash -c)',
        storyAnalogy:
          'With their newly minted administrator account, the attacker calls the tmsh command runner to launch bash -c as root and extract all SSL private keys and internal server credentials managed by the load balancer.',
        simpleExplanation:
          'Using the newly created admin account (or directly via a smuggled tmshCmd.jsp request), the attacker runs tmsh run /util bash -c "..." (abusing the Traffic Management Shell’s built-in "/util bash" utility to break out of the restricted appliance CLI into an unrestricted Linux root shell). With root access on the load balancer, they extract SSL/TLS private keys (/config/filestore/files_d/Common_d/certificate_key_d/, allowing them to decrypt HTTPS traffic for the company’s web apps) and backend server credentials.',
        howItWorksInPractice:
          'Because an F5 BIG-IP sits at the front of the datacenter terminating TLS connections and load-balancing internal servers, root access on the appliance exposes both private TLS keys and direct network paths into internal application VLANs. In the documented Auditd SYSCALL 59 exchange from BIG-IP Apache Frontend (httpd) to Tomcat AJP Backend & tmsh, Tomcat AJP Backend & tmsh responds with ACK UID 0 (root) (confirming that the TMSH BASH RCE request succeeded on Tomcat AJP Backend & tmsh and completing the final execution objective of F5 Security & Mandiant, F5 BIG-IP TMUI AJP Request Smuggling to Root RCE).',
        diagramAlignment:
          'On the diagram, arrow #3→ executes tmsh run /util bash on Node ⑤ (BIG-IP Root OS & SSL Vault) while Node ⑥ (SIEM) alerts on auditd tmsh bash execution.',
        detectionAndEvidence:
          'Documented in F5 K000137353 (/var/log/audit appliance command logs): mcpd / tmsh audit log entries showing run /util bash -c executed from tmui / tomcat (confirming that the web management interface spawned underlying root shell commands). Correlate Sysmon or Windows Security Event telemetry for T1059.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
