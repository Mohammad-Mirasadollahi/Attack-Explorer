import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'splunk-citrix-bleed-session-hijack',
    briefing: {
      headline: 'Scenario Briefing: Citrix Bleed (CVE-2023-4966), Leaking Session Tokens from NetScaler Memory to Bypass MFA',
      storyAnalogy:
        'Imagine asking a hotel clerk to write your name on six lines of a 1-page welcome form, and then photocopy that page for you. Instead of giving a normal 10-letter name, you hand the clerk a 24,000-letter name (Host: header). The clerk’s 1-page form runs out of space after line 5, so the clerk stops writing, but when they walk over to the photocopier, they tell the machine: "Copy 147,000 letters worth of paper from my desk!" The photocopier copies the 1-page welcome form PLUS the confidential ledger sitting right next to it on the desk, which contains the active VIP room key (NSC_AAAC session cookie) of an administrator who already passed MFA.',
      plainSummary:
        'In this scenario (CVE-2023-4966, Splunk STRT, Mandiant & CISA - Citrix Bleed: NetScaler OOB Memory Leak & NSC_AAAC Hijack), the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: sending an Oversized HTTP "Host" Header, then extracting the 65-Character "NSC_AAAC", then pivoting from the Hijacked Citrix VDI. Steps #1–#3 walk that chain end-to-end by covering Sending an Oversized HTTP "Host" Header, then Extracting the 65-Character "NSC_AAAC", then Pivoting from the Hijacked Citrix VDI, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection correlates Sysmon Event 1 with the documented host and network chain.',
      diagramTopologySummary:
        'On the diagram: Node ① (Attacker) sends the oversized Host header request to Node ②/③ (Citrix NetScaler Gateway nsppe). Node ④ (nsppe Memory Buffer & Session Replay) leaks the 65-byte NSC_AAAC token, allowing the attacker to hijack a Virtual Desktop session and pivot via DCOM to Node ⑤ (Internal Domain Server), alerted by Node ⑥ (Splunk SIEM).',
      documentedAdvisory: 'Assetnote CVE-2023-4966 Root-Cause · CISA/Mandiant AA23-325A · Splunk SURGe Citrix Bleed Analysis · MITRE T1539',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Sending an Oversized HTTP "Host" Header to Leak Adjacent NetScaler RAM (CVE-2023-4966)',
        storyAnalogy:
          'The attacker asks the public OpenID info desk (/oauth/idp/.well-known/openid-configuration) for its standard welcome sheet while supplying a 24,576-byte Host name. Because snprintf() reports how many bytes it wanted to write (147 KB) rather than the size of the 131 KB paper sheet, the server sends back 16 KB of raw adjacent RAM right after the welcome sheet.',
        simpleExplanation:
          'As reverse-engineered by Assetnote, the attacker sends an unauthenticated HTTPS GET request to /oauth/idp/.well-known/openid-configuration (a public discovery page on the Citrix NetScaler Gateway whose ns_aaa_oauthrp_send_openid_config function inserts the caller’s HTTP Host header into six JSON URL fields: issuer, authorization_endpoint, token_endpoint, jwks_uri, userinfo_endpoint, and end_session_endpoint). By sending a 24,576-byte Host header, the 6 copies total ~147 KB, exceeding the server’s 131,072-byte (0x20000) stack response buffer. Because C’s snprintf() function returns how many bytes it wanted to write (147 KB) rather than how many bytes actually fit in the 128 KB buffer, NetScaler’s SSL_write transmits the 128 KB buffer PLUS ~16 KB of raw adjacent nsppe memory straight back to the attacker.',
        howItWorksInPractice:
          'In the C standard library, snprintf(buf, size, fmt...) stops writing at size bytes to prevent a crash, but returns the theoretical total length of the formatted string. Passing that unchecked return value directly to the HTTP socket writer causes an out-of-bounds memory over-read (CVE-2023-4966) from the NetScaler packet engine (nsppe). In the documented Suricata CVE-2023-4966 exchange from Threat Actor (LockBit / UNC) to DMZ Reverse Proxy & SPAN Tap, DMZ Reverse Proxy & SPAN Tap responds with ALERT 148 KB Leak (confirming that the CITRIX BLEED GET request succeeded on DMZ Reverse Proxy & SPAN Tap and establishing the runtime state required for Step #2 NSC_AAAC SESSION COOKIE EXTRACTION & MFA BYPASS).',
        diagramAlignment:
          'On the diagram, arrow #1→ sends the 24 KB Host header from Node ① to Node ②/③ (Citrix NetScaler /oauth/idp/), and ⇠#1 returns HTTP 200 OK leaking 131 KB of memory.',
        detectionAndEvidence:
          'Documented in Assetnote, CISA AA23-325A & Suricata SID 2048918: GET /oauth/idp/.well-known/openid-configuration with oversized Host header and >130 KB HTTP 200 response.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1539',
        plainTitle: 'Extracting the 65-Character "NSC_AAAC" Cookie & Hijacking an Active MFA Session',
        storyAnalogy:
          'Scanning the accidentally photocopied desk pages, the attacker spots a 65-digit hexadecimal VIP wristband (NSC_AAAC) belonging to an administrator who is currently logged in. Clipping that wristband onto their own browser lets the attacker step straight into the admin’s active Citrix Virtual Desktop without any password or MFA prompt.',
        simpleExplanation:
          'Scanning the leaked raw memory dump with a regular expression ([0-9a-f]{32,65}), the attacker extracts a 65-character hexadecimal string: a live NSC_AAAC session cookie (the master authentication token stored in nsppe memory for a user who has already logged in and passed Multi-Factor Authentication). By pasting Cookie: NSC_AAAC=<leaked_token> into their own browser, the attacker hijacks the administrator’s active Citrix session (bypassing both the password screen and MFA completely).',
        howItWorksInPractice:
          'Because the NSC_AAAC cookie represents an active server-side AAA session in NetScaler memory, even patching the appliance or resetting the victim’s Active Directory password does not kick the attacker out unless the administrator explicitly flushes active sessions on the appliance via kill aaa session -all and kill icaconnection -all. In the documented NetScaler SSLVPN Log exchange from DMZ Reverse Proxy & SPAN Tap to Citrix NetScaler ADC / Gateway, Citrix NetScaler ADC / Gateway responds with RESP IP Mismatch (confirming that the REPLAY NSC_AAAC request succeeded on Citrix NetScaler ADC / Gateway and establishing the runtime state required for Step #3 CITRIX ICA VDI LAUNCH & INTERNAL AD RECONNAISSANCE).',
        diagramAlignment:
          'On the diagram, arrow #2→ replays the leaked NSC_AAAC cookie on Node ③/④ (NetScaler Session Engine), and ⇠#2 grants VDI ICA desktop access without MFA.',
        detectionAndEvidence:
          'Documented in Splunk SURGe and NetScaler AAA Syslog (ns.log session tracking records): Same NSC_AAAC session identifier active across two different client IP addresses / ASNs without a new authentication event (confirming that a stolen session cookie was replayed from an external host). Correlate Sysmon or Windows Security Event telemetry for T1539 (pairing parent/child process and destination fields) and contain the offending session.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1021.003',
        plainTitle: 'Pivoting from the Hijacked Citrix VDI Desktop into Internal Servers via DCOM/RPC',
        storyAnalogy:
          'Now sitting at the administrator’s virtual desk inside the building, the attacker uses the internal intercom (DCOM MMC20.Application over port 135) to command neighboring Windows servers to run commands on their behalf.',
        simpleExplanation:
          'Inside the hijacked Citrix Virtual Desktop (VDI) session, the attacker runs Active Directory discovery tools (adfind / SoftPerfect netscan), deploys remote management tunnels (AnyDesk / eHorus), and uses Distributed COM (DCOM, invoking the MMC20.Application COM object over RPC port 135, which instructs a remote Windows server to silently launch mmc.exe -Embedding and execute commands via Document.ActiveView.ExecuteShellCommand without creating a noisy new Windows service).',
        howItWorksInPractice:
          'Unlike PsExec or sc.exe (which register a new Windows Service and trigger System EventID 7045 on the target server), lateral movement via DCOM MMC20.Application abuses an already-registered Microsoft COM class over TCP/135. Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, arrow #3→ pivots from Node ④ (VDI Session) to Node ⑤ (Internal Server via DCOM :135) while Node ⑥ (Splunk SIEM) correlates the session hijack.',
        detectionAndEvidence:
          'Documented in CISA AA23-325A and Mandiant (post-hijack lateral movement indicators): mmc.exe -Embedding spawned on remote servers via DCOM following Citrix ICA session IP change (linking the hijacked remote session to internal network movement). Correlate Sysmon or Windows Security Event telemetry for T1550.004 (pairing parent/child process and destination fields) and contain the offending session.',
      },
    ],
  };
