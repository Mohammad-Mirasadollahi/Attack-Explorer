import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'ad-kerberoasting',
    briefing: {
      headline: 'Scenario Briefing: Active Directory Kerberoasting (MITRE T1558.003): Requesting Service Tickets to Crack Offline',
      storyAnalogy:
        'Imagine a theme park where any visitor with a basic entry wristband is allowed to walk up to the ticket booth and ask for a sealed VIP voucher to the SQL Rollercoaster. The booth seals that voucher using the rollercoaster manager’s secret password. Instead of riding the coaster, the attacker takes the sealed voucher home to their basement and tries millions of passwords per second until the seal pops open, without a single guard at the park knowing they are guessing.',
      plainSummary:
        'In this scenario (T1558.003, Active Directory Kerberoasting & Pass-the-Hash Lateral Movement) at 10.10.1, the attacker follows one continuous intrusion path so each later Step can show the exact handoff that makes the next stage possible. The attack unfolds in one continuous arc: enumerating SPNs, then offline Hashcat Cracking, then remote Service Installation. Steps #1–#3 walk that chain end-to-end by covering Enumerating SPNs, then Offline Hashcat Cracking, then Remote Service Installation, while the Process Hierarchy tab keeps the Parent → Child spawn tree visible so you can see which trusted process launched the next payload. Primary detection pivots on Windows Security Event 4769 correlated across the documented kill chain.',
      diagramTopologySummary:
        'On the diagram: Start at Node ③/④ (Compromised Workstation WS-FINANCE-04 10.10.20.45 / Rubeus.exe PID 3920), follow Step #1 (#1→) requesting the RC4 Kerberos TGS ticket from Node ⑤ (Domain Controller DC01.corp.local 10.10.1.5:88), trace Step #2 (#2→) authenticating with the cracked svc_mssql account over SMB (TCP/445) to SQL01.corp.local (10.10.5.20), and watch Step #3 (#3→) install and run PSEXESVC.exe (PID 5190) as SYSTEM monitored by Node ⑥ (SIEM Log Collector).',
      documentedAdvisory: 'MITRE ATT&CK T1558.003 · T1550.002 · T1569.002 · Windows Security EventID 4769 / 4624 / System EventID 7045',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1558.003',
        plainTitle: 'Enumerating SPNs & Requesting an RC4-Downgraded Kerberos TGS Ticket (Event ID 4769)',
        storyAnalogy:
          'The visitor opens the park’s public phonebook (LDAP), finds the SQL attraction run by a human manager (svc_mssql), and asks the central ticket booth (DC01.corp.local:88) for a voucher sealed with an older, fast-to-crack wax stamp (0x17 RC4-HMAC) instead of modern armor (AES-256).',
        simpleExplanation:
          'From the compromised workstation WS-FINANCE-04 (10.10.20.45) using standard domain account CORP\\m.davis, the attacker runs Rubeus.exe (PID 3920, PPID 2104: Rubeus.exe kerberoast /spn:MSSQLSvc/sql01.corp.local:1433 /nowrap). After querying LDAP (TCP/389) on DC01.corp.local (10.10.1.5) via ldap_search_ext_s("(servicePrincipalName=*)") to locate MSSQLSvc/sql01.corp.local:1433, Rubeus sends a Kerberos TGS-REQ (TCP/88) with TicketOptions = 0x40810000 requesting encryption type 0x17 (RC4-HMAC, a legacy cipher that encrypts the ticket directly with svc_mssql’s NTLM password hash, making it thousands of times faster to brute-force offline than AES-256 / 0x12).',
        howItWorksInPractice:
          'By design in the Kerberos protocol, the Key Distribution Center (KDC) on DC01.corp.local (10.10.1.5) does not check whether CORP\\m.davis has permission to log into SQL01; it immediately encrypts the KRB_TGS_REP service ticket using svc_mssql’s NTLM hash and returns the RC4 ciphertext to Rubeus.exe (PID 3920) on 10.10.20.45 (while logging Windows Security Event ID 4769 with Status = 0x0 and TicketEncryptionType = 0x17).',
        diagramAlignment:
          'On the diagram, follow Step #1 / Link #1 (#1→ / ⇠#1) from Node ③ (WS-FINANCE-04 10.10.20.45 / Rubeus.exe PID 3920) to Node ⑤ (Domain Controller DC01.corp.local 10.10.1.5:88), returning the RC4-encrypted TGS ticket (Event ID 4769, etype 0x17).',
        detectionAndEvidence:
          'Documented in Windows Security EventID 4769 on DC01.corp.local: TargetUserName = m.davis@CORP.LOCAL, ServiceName = svc_mssql, ClientAddress = 10.10.20.45, TicketOptions = 0x40810000, and TicketEncryptionType = 0x17 (RC4-HMAC).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1550.002',
        plainTitle: 'Offline Hashcat Cracking & Lateral SMB Network Logon to SQL01 (Event ID 4624)',
        storyAnalogy:
          'Back in their private workshop, the attacker tests millions of candidate passwords per second against the sealed voucher ($krb5tgs$23$*) until the seal opens, and then walks straight up to the SQL Server’s administration door (SMB TCP/445) wearing the manager’s real badge (svc_mssql).',
        simpleExplanation:
          'The attacker exports the returned RC4 TGS ticket from WS-FINANCE-04 in $krb5tgs$23$* format and cracks it offline using Hashcat (-m 13100, generating zero failed-login alerts on DC01 because every guess runs locally on the attacker’s GPU). Once svc_mssql’s credential is recovered, the attacker initiates a lateral SMB2 network logon (TCP/445) from WS-FINANCE-04 (10.10.20.45) to the target database server SQL01.corp.local (10.10.5.20) using AuthenticationPackageName = NtLmSsp (which SQL01 accepts and records as Windows Security Event ID 4624 with LogonType = 3).',
        howItWorksInPractice:
          'Because svc_mssql was granted local administrator privileges on SQL01.corp.local (10.10.5.20), completing the NTLMSSP network authentication handshake over TCP/445 returns an authenticated administrative SMB session (granting read/write access to \\\\sql01.corp.local\\ADMIN$ and the remote Service Control Manager pipe \\\\sql01.corp.local\\pipe\\svcctl). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, Step #2 / Link #2 (#2→ / ⇠#2) shows Node ③ (WS-FINANCE-04 10.10.20.45) authenticating over SMB2 (TCP/445) as svc_mssql to Node ⑤ (SQL01.corp.local 10.10.5.20), returning an authenticated session and logging Event ID 4624 (LogonType = 3).',
        detectionAndEvidence:
          'Documented in Windows Security EventID 4624 on SQL01.corp.local: TargetUserName = svc_mssql, LogonType = 3 (Network), AuthenticationPackageName = NtLmSsp, IpAddress = 10.10.20.45.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1569.002',
        plainTitle: 'Remote Service Installation & SYSTEM Execution on SQL01 via PsExec (Event ID 7045)',
        storyAnalogy:
          'Now inside the SQL Server’s admin office, the intruder drops an automated worker (PSEXESVC.exe) into the building’s master service directory and tells the building controller (services.exe) to start it with full SYSTEM authority.',
        simpleExplanation:
          'Using the authenticated SMB session on SQL01.corp.local (10.10.5.20), the attacker uploads PSEXESVC.exe to \\\\sql01.corp.local\\ADMIN$\\PSEXESVC.exe and invokes CreateServiceW and StartServiceW on the remote Service Control Manager (services.exe, PID 628, PPID 512) to install and start a new Windows service named PSEXESVC (ImagePath = %SystemRoot%\\PSEXESVC.exe). Windows logs System Event ID 7045 (A service was installed in the system) as services.exe (PID 628) spawns PSEXESVC.exe (PID 5190) under NT AUTHORITY\\SYSTEM (completing privileged takeover of the database server).',
        howItWorksInPractice:
          'When PsExec calls StartServiceW over the svcctl RPC pipe, services.exe (PID 628) starts C:\\Windows\\PSEXESVC.exe (PID 5190) as LocalSystem (NT AUTHORITY\\SYSTEM), which calls CreateNamedPipeW and CreateProcessAsUserW("cmd.exe") (returning an interactive SYSTEM command shell over encrypted SMB named pipes back to the operator on 10.10.20.45). Mechanically, this stage is complete only after [object Object] and [object Object] is observed as live runtime state (the concrete checkpoint proving the previous stage\'s output now drives the next action).',
        diagramAlignment:
          'On the diagram, Step #3 / Link #3 (#3→ / ⇠#3) executes PSEXESVC.exe (PID 5190, spawned by services.exe PID 628) on Node ⑤ (SQL01.corp.local 10.10.5.20) and reports System Event ID 7045 to Node ⑥ (SIEM Log Collector).',
        detectionAndEvidence:
          'Documented in Windows System EventID 7045 (ServiceName = PSEXESVC, ImagePath = %SystemRoot%\\PSEXESVC.exe, Account = LocalSystem) & process tree (PSEXESVC.exe PID 5190 spawned by services.exe PID 628).',
      },
    ],
  };
