import type { RawScenarioStepGuideData } from '../scenario-step-guides';

export const BATCH2_AD_EXCHANGE_WINDOWS_STEP_GUIDES: Record<string, RawScenarioStepGuideData> = {
  'nopac-samaccountname-cve-2021-42278-42287': {
    scenarioId: 'nopac-samaccountname-cve-2021-42278-42287',
    briefing: {
      headline: 'Scenario Briefing: Active Directory "noPac" (CVE-2021-42278 & CVE-2021-42287) — Domain User to Domain Admin in 3 Seconds',
      storyAnalogy:
        'Imagine an office building where any regular employee is allowed to register up to 10 company laptops (`ms-DS-MachineAccountQuota = 10`). Normally, every laptop nametag must end with a `$` symbol (`FAKEPC01$`). However, the badge clerk (`CVE-2021-42278`) forgets to check for the `$` when someone *renames* a laptop! So the employee renames their laptop to `CORP-DC01` (the exact name of the Chief Security Officer’s vault computer, minus the `$`), grabs a temporary lobby ticket (`TGT`), and immediately renames their laptop back to `FAKEPC01$`. Next, they hand that `CORP-DC01` lobby ticket to the inner vault desk (`KDC S4U2self`) and ask for an Admin pass. When the vault clerk looks up `CORP-DC01` and sees it no longer exists, the clerk has a quirky habit (`CVE-2021-42287`): "Let me add a `$` to the end and check again!" Adding `$` matches the real Chief Security Officer’s vault (`CORP-DC01$`)—so the clerk prints a full Domain Admin master key for the real Domain Controller!',
      plainSummary:
        'Synthesizing Microsoft MSRC advisories, CrowdStrike Falcon Threat Intelligence, and Splunk SURGe detection research (November–December 2021), "noPac" chains two Active Directory flaws—CVE-2021-42278 (`sAMAccountName` spoofing) and CVE-2021-42287 (KDC `$` fallback)—to elevate any low-privilege domain user to Domain Administrator in seconds. The attacker creates a machine account via `ms-DS-MachineAccountQuota`, renames its `sAMAccountName` to match a Domain Controller without the trailing `$`, requests a Kerberos TGT, renames the account back, and uses `S4U2self` to trick the KDC into issuing a Domain Admin service ticket encrypted for the real `CORP-DC01$` Domain Controller.',
      diagramTopologySummary:
        'On the diagram: Node ① (`lowpriv_user` Workstation) creates and renames a machine account on Node ②/③ (`CORP-DC01` LDAP & KDC), triggers the `S4U2self` `"$"` lookup fallback inside Node ④ (`kdcsvc.dll`), and uses the resulting Domain Admin ticket to run `DCSync` on Node ⑤ (`NTDS.dit`), detected via EventID 4741/4781/4769 on Node ⑥ (Splunk SIEM).',
      documentedAdvisory: 'Microsoft CVE-2021-42278 & CVE-2021-42287 · CrowdStrike & Splunk SURGe noPac Analysis · MITRE T1068 / T1558',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1068',
        plainTitle: 'Creating a Machine Account & Spoofing the DC’s `sAMAccountName` Without `$` (CVE-2021-42278)',
        storyAnalogy:
          'Using the default quota that lets any user add 10 computers to the domain (`ms-DS-MachineAccountQuota = 10`), the attacker creates `FAKEPC01$`, strips off the `$` to rename it `CORP-DC01`, and asks the KDC for a Kerberos TGT.',
        simpleExplanation:
          'By default in Active Directory, the attribute ms-DS-MachineAccountQuota is set to 10 (meaning any standard domain user can create up to 10 new computer accounts over LDAP without needing administrator rights). The attacker creates a computer account named FAKEPC01$, and then exploits CVE-2021-42278 (an LDAP validation flaw where Active Directory forgot to enforce that a computer account’s sAMAccountName must end with a trailing "$" sign when modified) to rename the computer’s sAMAccountName to CORP-DC01—matching the exact hostname of the target Domain Controller—and requests a Kerberos TGT (EventID 4768).',
        howItWorksInPractice:
          'Why didn’t Active Directory block the rename as a duplicate name? Because the real Domain Controller’s sAMAccountName is "CORP-DC01$" (with a dollar sign), so "CORP-DC01" (without a dollar sign) is treated by LDAP as a distinct string.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the LDAP `sAMAccountName` rename and `KRB_AS_REQ` from Node ① to Node ②/③ (`CORP-DC01`), and ⇠#1.2 returns the TGT for `"CORP-DC01"` (logging EventID 4781 & 4768).',
        detectionAndEvidence:
          'Documented by Splunk SURGe & CrowdStrike: Windows Security EventID 4741 (computer created) followed by EventID 4781 (`OldTargetUserName` ending in `$` renamed to `NewTargetUserName` without `$`).',
      },
      {
        stepNumber: 2,
        mitreId: 'T1558.001',
        plainTitle: 'Renaming the Account Back & Triggering the KDC `S4U2self` `$` Fallback (CVE-2021-42287)',
        storyAnalogy:
          'While holding the `CORP-DC01` TGT in their hand, the attacker renames their fake computer back to `FAKEPC01$` and asks the KDC for an `S4U2self` service ticket. When the KDC can’t find `CORP-DC01`, it automatically adds `$` (`CORP-DC01$`) and issues a ticket for the real Domain Controller!',
        simpleExplanation:
          'Holding the valid TGT for "CORP-DC01", the attacker renames their machine account back to FAKEPC01$ over LDAP (so no account named "CORP-DC01" exists in Active Directory anymore) and sends a Kerberos S4U2self TGS request (KRB_TGS_REQ — asking the KDC to issue a service ticket impersonating the Domain Administrator to itself). When the KDC looks up the TGT’s client name ("CORP-DC01") and fails to find it, CVE-2021-42287 triggers: kdcsvc.dll automatically appends a trailing "$" ("CORP-DC01$") and searches again—matching the real Domain Controller and encrypting a Domain Admin service ticket with the real Domain Controller’s secret key!',
        howItWorksInPractice:
          'Why is CVE-2021-42287 so critical? Because the KDC validates the incoming TGT using the attacker’s key, but encrypts the outgoing S4U2self TGS ticket (and its high-privilege Domain Admin PAC) for the real Domain Controller ("CORP-DC01$").',
        diagramAlignment:
          'On the diagram, arrow #2.1→ triggers the `S4U2self` lookup inside Node ④ (`kdcsvc.dll`), and ⇠#2.2 returns the forged `cifs/CORP-DC01.corp.local` Domain Admin ticket.',
        detectionAndEvidence:
          'Documented by Microsoft & Splunk SURGe: Windows Security EventID 4769 (`S4U2self` TGS request for `cifs/CORP-DC01` immediately following EventID 4781).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1003.006',
        plainTitle: 'Presenting the Forged `cifs/CORP-DC01` Ticket to Execute `DCSync`',
        storyAnalogy:
          'The attacker walks up to the real Domain Controller (`CORP-DC01`) and hands over the freshly minted `cifs/CORP-DC01` Domain Admin ticket—dumping every password hash in the company from `NTDS.dit`.',
        simpleExplanation:
          'Presenting the forged cifs/CORP-DC01.corp.local Kerberos service ticket (which carries a valid Privilege Attribute Certificate for the Domain Administrator signed by the KDC itself), the attacker authenticates to the Domain Controller and invokes the MS-DRSR directory replication protocol (DCSync — DrsGetNCChanges, which instructs the Domain Controller to replicate the NTLM and AES password hashes of krbtgt and all domain users from NTDS.dit).',
        howItWorksInPractice:
          'From start to finish, tools like noPac.exe and sam_the_admin.py complete all three steps automatically in under 3 seconds.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ executes `DCSync` against Node ⑤ (`NTDS.dit` Vault) while Node ⑥ (Splunk SIEM) alerts on the 4781 -> 4769 -> 4662 chain.',
        detectionAndEvidence:
          'Documented in CISA & CrowdStrike advisories: Windows Security EventID 4662 (`DS-Replication-Get-Changes-All`) from a workstation IP.',
      },
    ],
  },

  'zerologon-netlogon-cve-2020-1472': {
    scenarioId: 'zerologon-netlogon-cve-2020-1472',
    briefing: {
      headline: 'Scenario Briefing: Active Directory "Zerologon" (CVE-2020-1472) — Breaking Netlogon AES-CFB8 with 8 Zero Bytes',
      storyAnalogy:
        'Imagine a high-security vault door (`Netlogon MS-NRPC`) where the guard tests visitors by handing them a secret key calculator (`AES-CFB8`). Normally, scrambling an 8-digit number with a secret key produces a completely unpredictable 8-digit answer. However, the engineer who built the calculator made a fatal mistake: they wired the starting dial (`Initialization Vector / IV`) permanently to `0000000000000000`! Because of how `AES-CFB8` math works when the starting dial is all zeroes, if a visitor types in `00000000` as their challenge, there is an exact **1-in-256 chance** that the encrypted answer is ALSO `00000000`—no matter what the Domain Controller’s secret password is! By knocking on the door ~256 times in 3 seconds with all zeroes, the attacker gets waved right in and resets the Domain Controller’s own password to blank.',
      plainSummary:
        'Discovered by Tom Tervoort of Secura and mandated for emergency patching under CISA Emergency Directive 20-04 (August–September 2020), "Zerologon" (CVE-2020-1472, CVSS 10.0) is a catastrophic cryptographic flaw in the Windows Netlogon Remote Protocol (`MS-NRPC`). Because `ComputeNetlogonCredential()` used `AES-CFB8` with a fixed all-zero 16-byte IV, supplying an 8-byte client challenge of all zeroes (`0x00*8`) yields an all-zero credential for 1 out of every 256 random session keys. In ~3 seconds without any domain credentials, an attacker bypasses `NetrServerAuthenticate3`, calls `NetrServerPasswordSet2` to overwrite the Domain Controller’s `CORP-DC01$` machine password with an empty string (EventID 4742), and dumps `NTDS.dit` via `DCSync`.',
      diagramTopologySummary:
        'On the diagram: Node ① (Unauthenticated LAN Attacker) sends ~256 `NetrServerAuthenticate3` zero-challenge calls to Node ②/③ (`CORP-DC01` Netlogon RPC), triggers `NetrServerPasswordSet2` inside Node ④ (`netlogon.dll`) to blank the `CORP-DC01$` password, and runs `DCSync` on Node ⑤ (`NTDS.dit`), detected via System EID 5805 and Security EID 4742 on Node ⑥ (SIEM).',
      documentedAdvisory: 'Secura Zerologon Whitepaper · CISA Emergency Directive 20-04 · CrowdStrike & Microsoft CVE-2020-1472 · MITRE T1210',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1210',
        plainTitle: 'Sending ~256 All-Zero `ClientChallenge` Handshakes to Bypass `AES-CFB8` (CVE-2020-1472)',
        storyAnalogy:
          'Because `ComputeNetlogonCredential` uses `AES-CFB8` with an all-zero IV, sending 8 zero bytes as the `ClientChallenge` has a 1-in-256 chance of producing 8 zero bytes as the `ClientCredential`. In less than 3 seconds, one of the 256 tries hits the jackpot!',
        simpleExplanation:
          'As proven by Secura, in the Netlogon handshake (NetrServerReqChallenge followed by NetrServerAuthenticate3), the client proves it knows the machine password by encrypting an 8-byte ClientChallenge using ComputeNetlogonCredential(). However, Microsoft implemented this function using AES-CFB8 (8-bit Cipher Feedback mode, which encrypts 1 byte at a time by XORing each plaintext byte with the first byte of AES applied to a 16-byte sliding window) and hardcoded the 16-byte Initialization Vector (IV) to all zeroes (0x00*16 — violating the fundamental rule of cryptography that an IV must be random). When the attacker sets ClientChallenge = 0x0000000000000000, there is a 1-in-256 probability that the first AES block starts with 0x00—causing all 8 encrypted bytes to stay 0x0000000000000000!',
        howItWorksInPractice:
          'Because Netlogon has no rate-limiting or account lockout on computer accounts, an unauthenticated attacker on the network can fire ~256 RPC attempts in under 3 seconds until the random session key happens to produce the all-zero output.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends the `NetrServerAuthenticate3` zero-challenge loop from Node ① to Node ②/③ (`CORP-DC01` Netlogon), and ⇠#1.2 accepts the 1-in-256 spoofed handshake.',
        detectionAndEvidence:
          'Documented by Secura, CrowdStrike & Suricata SID 2030870: Burst of `NetrServerAuthenticate3` RPC calls with `0x0000000000000000` and Windows System EventID 5805.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1098',
        plainTitle: 'Calling `NetrServerPasswordSet2` to Overwrite the Domain Controller’s Password with Zeroes',
        storyAnalogy:
          'Even though the attacker passed the front-door check, they still don’t know what random `SessionKey` the Domain Controller picked. So they uncheck the "Encrypt Our Conversation" box (`Flags = 0x212fffff`) and tell the Domain Controller (`NetrServerPasswordSet2`): "Change your own `CORP-DC01$` password to blank!"',
        simpleExplanation:
          'During the NetrServerAuthenticate3 call, the attacker clears the Netlogon Sealing flag (NegotiateFlags = 0x212fffff — telling the Domain Controller not to require RPC packet encryption on this session, which was still allowed by default in 2020 for backwards compatibility) and then invokes NetrServerPasswordSet2 with a 516-byte buffer of all zeroes. Because encrypting 516 zero bytes with AES-CFB8 and an all-zero IV also produces all zeroes, the Domain Controller overwrites its own computer account password (CORP-DC01$) in Active Directory NTDS.dit with an empty password (NTLM hash 31d6cfe0d16ae931b73c59d7e0c089c0).',
        howItWorksInPractice:
          'Because this RPC call runs over an unauthenticated network pipe rather than a logged-in user session, Windows logs Security EventID 4742 ("A computer account was modified") with SubjectUserName: ANONYMOUS LOGON.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ invokes `NetrServerPasswordSet2` inside Node ④ (`netlogon.dll`), and ⇠#2.2 sets `CORP-DC01$` password to empty in `NTDS.dit` (logging EventID 4742).',
        detectionAndEvidence:
          'Documented by Microsoft & CrowdStrike: Windows Security EventID 4742 where `SubjectUserName` is `ANONYMOUS LOGON` and `TargetUserName` is `CORP-DC01$`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1003.006',
        plainTitle: 'Running `DCSync` as `CORP-DC01$` & Restoring the Original `$MACHINE.ACC` Password',
        storyAnalogy:
          'Now that `CORP-DC01$` has a blank password in Active Directory, the attacker logs in as `CORP-DC01$` with no password, downloads every password hash in the company via `DCSync`, and then puts the original password back from the DC’s local registry so nobody notices the DC broke!',
        simpleExplanation:
          'Because a Domain Controller’s computer account (CORP-DC01$) automatically belongs to the Enterprise Domain Controllers group, the attacker authenticates over SMB/RPC as CORP\\CORP-DC01$ using the empty NTLM hash (31d6cfe0d16ae931b73c59d7e0c089c0) and runs DCSync (DrsGetNCChanges — dumping the Domain Administrator and krbtgt hashes from NTDS.dit). Finally, because wiping CORP-DC01$’s password in AD causes it to go out of sync with the password stored in the DC’s local registry (HKLM\\SECURITY\\Policy\\Secrets\\$MACHINE.ACC — which would break DNS and AD replication), the attacker uses their new Domain Admin credentials to read $MACHINE.ACC and restore the original machine password.',
        howItWorksInPractice:
          'Why did Zerologon break Domain Controllers when naive attackers forgot Step 3? Because NetrServerPasswordSet2 updates NTDS.dit without updating the DC’s local LSA secret ($MACHINE.ACC), locking the DC out of its own domain until restored.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ executes `DCSync` on Node ⑤ (`NTDS.dit`) and restores `$MACHINE.ACC` while Node ⑥ (SIEM) alerts on the `ANONYMOUS LOGON` 4742 + `CORP-DC01$` network logon.',
        detectionAndEvidence:
          'Documented in CISA ED 20-04: Security EventID 4624 (LogonType 3 for `CORP-DC01$` from a non-DC IP) followed by EventID 4662 (`DCSync`).',
      },
    ],
  },

  'proxyshell-exchange-cve-2021-34473': {
    scenarioId: 'proxyshell-exchange-cve-2021-34473',
    briefing: {
      headline: 'Scenario Briefing: Microsoft Exchange "ProxyShell" (CVE-2021-34473 / 34523 / 31207) — 3-Bug Chain to SYSTEM Webshell',
      storyAnalogy:
        'Imagine a corporate mailroom (`Exchange Client Access Frontend :443`) where a receptionist is trained to help people find their mailbox settings (`/autodiscover/autodiscover.json`). If someone writes `/autodiscover/autodiscover.json/alice@corp.com/settings`, the receptionist crosses out `/autodiscover/autodiscover.json/alice@corp.com` and forwards `/settings` to the high-security back office (`Exchange Backend :444`) stamped with the building’s master `SYSTEM` seal. Orange Tsai discovered that if you request `/autodiscover/autodiscover.json?@foo.com/powershell/`, the receptionist gets confused by the `?@`, crosses out `/autodiscover/autodiscover.json?@foo.com`, and forwards `/powershell/` straight into the restricted Admin PowerShell room! Once inside, you hand the clerk a forged ID card (`X-Rps-CAT`), grant yourself "Mailbox Export" rights, and export a booby-trapped email directly into the public web folder as `shell.aspx`!',
      plainSummary:
        'Discovered by Orange Tsai of DEVCORE (Pwn2Own 2021) and documented by Joint CISA Advisory AA21-265A, Mandiant, and Splunk SURGe, "ProxyShell" chains three Microsoft Exchange vulnerabilities into a 1-click unauthenticated `SYSTEM` RCE: (1) CVE-2021-34473 (pre-auth URL path confusion via `/autodiscover/autodiscover.json?@foo.com/powershell/` to reach the backend PowerShell endpoint as `SYSTEM`), (2) CVE-2021-34523 (`X-Rps-CAT` token deserialization to impersonate the Exchange Administrator), and (3) CVE-2021-31207 (`New-MailboxExportRequest` arbitrary file write to drop a polyglot `.pst`/`.aspx` webshell into `C:\\inetpub\\wwwroot\\aspnet_client\\`).',
      diagramTopologySummary:
        'On the diagram: Node ① (ProxyShell Operator) sends the `/autodiscover/autodiscover.json?@foo.com/powershell/` request to Node ②/③ (Exchange CAS Frontend `:443`), which proxies it to Node ④ (Exchange PowerShell Backend `:444` with `X-Rps-CAT`) to run `New-MailboxExportRequest` and drop Node ⑤ (`aspnet_client\\shell.aspx`), detected by Node ⑥ (SIEM).',
      documentedAdvisory: 'Orange Tsai (DEVCORE) ProxyShell Research · CISA Alert AA21-265A · Mandiant & Splunk SURGe · CVE-2021-34473',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Bypassing Frontend Authentication with `/autodiscover/autodiscover.json?@foo.com/powershell/` (CVE-2021-34473)',
        storyAnalogy:
          'Exchange’s `RemoveExplicitLogonFromUrlAnchoredXml` function tries to delete the email address from the URL, but a missing `/` check in its regex lets `?@foo.com` trick it into deleting `/autodiscover/autodiscover.json?@foo.com`—turning the URL into `/powershell/`!',
        simpleExplanation:
          'In Microsoft Exchange’s Architecture, the internet-facing Frontend Client Access Service (CAS on TCP 443) authenticates users and proxies their requests to the internal Backend server (on TCP 444) using Exchange’s own machine certificate (NT AUTHORITY\\SYSTEM). As Orange Tsai discovered, when a URL starts with /autodiscover/autodiscover.json?@foo.com/powershell/, the frontend’s Explicit-Logon parser strips "/autodiscover/autodiscover.json?@foo.com" thinking it is an email address prefix, and proxies the remaining path—/powershell/—straight to the internal Backend server with full SYSTEM authentication (CVE-2021-34473 — bypassing all frontend login checks).',
        howItWorksInPractice:
          'Attackers also used an alternate form discovered in the wild: placing the path inside an HTTP cookie (Cookie: Email=autodiscover/autodiscover.json%3F@foo.com) so simple URL filters looking for "@foo.com" in the URI query string would miss it.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends `/autodiscover/autodiscover.json?@foo.com/powershell/` from Node ① to Node ②/③ (Exchange CAS Frontend), and ⇠#1.2 proxies `/powershell/` to the Backend as `SYSTEM`.',
        detectionAndEvidence:
          'Documented in CISA AA21-265A & Splunk SURGe: IIS W3SVC logs showing `/autodiscover/autodiscover.json` paired with `/powershell` or `/mapi/nspi`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1059.001',
        plainTitle: 'Injecting a Forged `X-Rps-CAT` Token to Impersonate the Exchange Admin in PowerShell (CVE-2021-34523)',
        storyAnalogy:
          'When the proxied request arrives in the Backend `/powershell/` room, the clerk says: "I see the building’s `SYSTEM` stamp, but which user am I running commands for?" The attacker hands over `?X-Rps-CAT=...` containing the Exchange Administrator’s SID!',
        simpleExplanation:
          'When the proxied request reaches the Backend PowerShell endpoint (:444/powershell/), it initially fails because the NT AUTHORITY\\SYSTEM computer account does not have a user security token attached. Exploiting CVE-2021-34523, the attacker appends the query parameter ?X-Rps-CAT=<Base64_CommonAccessToken> (a serialized Windows CommonAccessToken structure that the Backend PowerShell module trusts without signature verification, allowing the attacker to plug in the Exchange Administrator’s Security Identifier / SID and open a full administrative Exchange PowerShell session). Inside that session, the attacker runs New-ManagementRoleAssignment -Role "Mailbox Import Export" -User "admin@corp.local".',
        howItWorksInPractice:
          'How did the attacker know the Exchange Administrator’s SID before logging in? By first sending a quick autodiscover/mapi request through the same CVE-2021-34473 proxy to convert the administrator’s email address into their legacyExchangeDN and Windows SID.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ deserializes `X-Rps-CAT` inside Node ④ (Exchange PowerShell Backend `:444`) and runs `New-ManagementRoleAssignment`, with ⇠#2.2 granting Mailbox Export privileges.',
        detectionAndEvidence:
          'Documented by Mandiant & DEVCORE: `X-Rps-CAT=` in IIS query strings and `New-ManagementRoleAssignment -Role "Mailbox Import Export"` in `MSExchange Management` logs.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1505.003',
        plainTitle: 'Using `New-MailboxExportRequest` to Write a PST/ASPX Polyglot Webshell (CVE-2021-31207)',
        storyAnalogy:
          'Normally `New-MailboxExportRequest` saves a `.pst` email archive file. By hiding an ASPX webshell inside a draft email and telling Exchange to export that mailbox to `\\\\127.0.0.1\\c$\\inetpub\\wwwroot\\aspnet_client\\shell.aspx`, IIS runs the email attachment as a live `SYSTEM` webshell!',
        simpleExplanation:
          'With the "Mailbox Import Export" role assigned, the attacker saves a draft email containing an encoded JScript/C# ASPX webshell, and then executes New-MailboxExportRequest -Mailbox admin@corp.local -FilePath "\\\\127.0.0.1\\c$\\inetpub\\wwwroot\\aspnet_client\\shell.aspx" (CVE-2021-31207 — abusing the Exchange Mailbox Replication service, which runs as SYSTEM, to write a file to any UNC path on the server). Even though the exported file is a binary .PST mailbox archive (starting with magic bytes !BDN), naming it .aspx causes IIS’s ASP.NET engine to ignore the binary PST header and execute the `<script runat="server">` webshell inside it as NT AUTHORITY\\SYSTEM!',
        howItWorksInPractice:
          'Why did the raw ASPX code have to be specially encoded inside the draft email? Because Exchange normally compresses or encodes email bodies inside a PST file; Orange Tsai used a custom UTF-7 / uncompressed attachment trick so the exact ASCII characters `<%@ Page ... %>` appeared intact inside the binary PST file.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ exports the PST/ASPX polyglot webshell to Node ⑤ (`aspnet_client\\shell.aspx`) while Node ⑥ (SIEM) alerts on the `.aspx` MailboxExport.',
        detectionAndEvidence:
          'Documented in CISA AA21-265A: `MSExchange Management` EventID 1 (`New-MailboxExportRequest` with `.aspx`) and Sysmon EventID 11 (`MSExchangeMailboxReplication.exe` creating `.aspx` in `aspnet_client`).',
      },
    ],
  },

  'printnightmare-spooler-cve-2021-34527': {
    scenarioId: 'printnightmare-spooler-cve-2021-34527',
    briefing: {
      headline: 'Scenario Briefing: Windows "PrintNightmare" (CVE-2021-34527) — Remote SYSTEM DLL Injection via Print Spooler',
      storyAnalogy:
        'Imagine a corporate print room (`spoolsv.exe`, running as `SYSTEM` on every Windows server and Domain Controller) where only IT Administrators are supposed to install new printer driver software (`ValidateObjectAccess`). However, the rulebook for the `RpcAddPrinterDriverEx` command has a bizarre loophole written in the fine print: "If the caller checks the `0x8000` box (`APD_INSTALL_WARNED_DRIVER`), skip the ID check!" By checking that `0x8000` box and telling the Print Spooler that the printer’s "configuration helper file" (`pConfigFile`) is sitting on the attacker’s own shared folder (`\\\\10.10.20.55\\share\\evil.dll`), any regular employee can trick a Domain Controller’s Print Spooler into downloading and running `evil.dll` as `NT AUTHORITY\\SYSTEM`!',
      plainSummary:
        'Synthesizing Microsoft MSRC advisories, Rapid7’s RPC reverse engineering, and Elastic Security Labs’ telemetry analysis (June–July 2021), "PrintNightmare" (CVE-2021-34527 / CVE-2021-1675) is a critical remote code execution vulnerability in the Windows Print Spooler service (`spoolsv.exe`). By calling `RpcAddPrinterDriverEx()` over `\\pipe\\spoolss` (`MS-RPRN`) or `RpcAsyncAddPrinterDriver()` (`MS-PAR`) with bit `0x8000` (`APD_INSTALL_WARNED_DRIVER`) set in `dwFileCopyFlags`, any authenticated domain user bypasses `ValidateObjectAccess()` and forces the remote server’s `spoolsv.exe` (`SYSTEM`) to copy and `LoadLibraryW()` an arbitrary DLL from an attacker-controlled UNC share.',
      diagramTopologySummary:
        'On the diagram: Node ① (Low-Privilege Domain User + SMB Share) calls `RpcAddPrinterDriverEx` (`dwFileCopyFlags = 0x8014`) on Node ②/③ (Target Server / DC `spoolsv.exe`), forcing Node ④ (`spoolsv.exe` Driver Loader) to copy and load `evil.dll` from `\\spool\\drivers\\x64\\3\\` and spawn Node ⑤ (`SYSTEM` Shell), alerted by Node ⑥ (Elastic EDR / SIEM).',
      documentedAdvisory: 'Microsoft CVE-2021-34527 · CISA Alert AA21-200B · Rapid7 & Elastic Security Labs PrintNightmare Analysis · MITRE T1210',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1210',
        plainTitle: 'Passing `APD_INSTALL_WARNED_DRIVER` (`0x8000`) to Skip `ValidateObjectAccess()` (CVE-2021-34527)',
        storyAnalogy:
          'Normally `localspl.dll` checks if the caller is a Server Administrator before installing a printer driver. Setting bit `0x8000` (`dwFileCopyFlags = 0x8014`) jumps right over the `ValidateObjectAccess()` check!',
        simpleExplanation:
          'As reverse-engineered by Rapid7 and security researchers, the Windows Print Spooler (spoolsv.exe — which runs by default as NT AUTHORITY\\SYSTEM on all Windows workstations, member servers, and Domain Controllers) exposes the MS-RPRN RPC interface over SMB named pipe \\pipe\\spoolss. Inside localspl.dll’s SplAddPrinterDriverEx() function, the code checked: if ((dwFileCopyFlags & 0x8000) == 0) { ValidateObjectAccess(...); } (meaning that simply setting the flag APD_INSTALL_WARNED_DRIVER = 0x8000 inside dwFileCopyFlags caused the Print Spooler to skip the administrator permission check completely — CVE-2021-34527).',
        howItWorksInPractice:
          'Even after Microsoft patched the legacy MS-RPRN interface in June 2021 (CVE-2021-1675), researchers discovered that the asynchronous RPC interface MS-PAR (RpcAsyncAddPrinterDriver) had the exact same missing check (tracked as CVE-2021-34527).',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends `RpcAddPrinterDriverEx(dwFileCopyFlags=0x8014)` from Node ① to Node ②/③ (`spoolsv.exe`), and ⇠#1.2 bypasses `ValidateObjectAccess()`.',
        detectionAndEvidence:
          'Documented by Rapid7, CISA & Suricata SID 2033224: `MS-RPRN` Opnum 89 (`RpcAddPrinterDriverEx`) over `\\pipe\\spoolss` with flags `0x8014`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1547.012',
        plainTitle: 'Pointing `pConfigFile` to a Remote UNC Share so `spoolsv.exe` Copies & Loads `evil.dll`',
        storyAnalogy:
          'To pass Windows’ driver file checks, the attacker points the main printer driver (`pDriverPath`) to a real Microsoft `UNIDRV.DLL` already on the server, while pointing the helper configuration file (`pConfigFile`) to `\\\\10.10.20.55\\share\\evil.dll`.',
        simpleExplanation:
          'In the DRIVER_CONTAINER structure sent to RpcAddPrinterDriverEx(), the attacker sets pDriverPath to a genuine Microsoft inbox printer driver already on the target’s disk (such as UNIDRV.DLL so basic driver header checks pass), and sets pConfigFile to a remote SMB UNC path: \\\\10.10.20.55\\share\\evil.dll. Because the flags 0x0004 (APD_COPY_ALL_FILES) and 0x0010 (APD_COPY_FROM_DIRECTORY) are also set, spoolsv.exe reaches out over SMB, copies evil.dll into C:\\Windows\\System32\\spool\\drivers\\x64\\3\\, and immediately calls LoadLibraryW() on it in memory.',
        howItWorksInPractice:
          'When an exploit script calls RpcAddPrinterDriverEx multiple times, Windows moves the previous copy of the DLL into backup numbered subfolders like C:\\Windows\\System32\\spool\\drivers\\x64\\3\\Old\\1\\evil.dll—a classic forensic indicator on disk.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ copies `evil.dll` from Node ①’s SMB share into Node ④ (`spoolsv.exe` Driver Loader), and ⇠#2.2 triggers `LoadLibraryW()` (logging Sysmon EventID 11 & 7).',
        detectionAndEvidence:
          'Documented by Elastic Security Labs: Sysmon EventID 11 (`FileCreate`) and EventID 7 (`ImageLoad` of unsigned DLL) in `C:\\Windows\\System32\\spool\\drivers\\x64\\3\\` by `spoolsv.exe`.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1068',
        plainTitle: 'Executing `DllMain` as `NT AUTHORITY\\SYSTEM` Inside `spoolsv.exe`',
        storyAnalogy:
          'The instant `spoolsv.exe` loads `evil.dll` to ask about printer settings, the attacker’s `DllMain` code runs with full `SYSTEM` privileges on the Domain Controller.',
        simpleExplanation:
          'The moment spoolsv.exe calls LoadLibraryW() and DrvConvertDevMode() on the copied configuration DLL, the attacker’s DllMain(DLL_PROCESS_ATTACH) routine executes inside the spoolsv.exe process as NT AUTHORITY\\SYSTEM (giving the attacker immediate SYSTEM code execution on the target server or Domain Controller to create a new Domain Admin account or launch a reverse shell).',
        howItWorksInPractice:
          'Why do security guides recommend disabling the Print Spooler service completely on Domain Controllers? Because a Domain Controller never needs to manage physical office paper printers, and stopping spoolsv.exe eliminates the entire MS-RPRN / MS-PAR attack surface (including both PrintNightmare and SpoolSample).',
        diagramAlignment:
          'On the diagram, arrow #3.1→ spawns Node ⑤ (`SYSTEM` Shell / Domain Admin Creation) from Node ④ while Node ⑥ (SIEM) alerts on `spoolsv.exe` spawning `cmd.exe`.',
        detectionAndEvidence:
          'Documented in CISA AA21-200B: `Microsoft-Windows-PrintService/Admin` EventID 316 / 808 and Sysmon EventID 1 (`spoolsv.exe` spawning `cmd.exe` or `net.exe`).',
      },
    ],
  },

  'sharepoint-cve-2023-29357-24955-chain': {
    scenarioId: 'sharepoint-cve-2023-29357-24955-chain',
    briefing: {
      headline: 'Scenario Briefing: Microsoft SharePoint Pre-Auth RCE Chain (CVE-2023-29357 & CVE-2023-24955) — JWT "alg:none" to BCS Assembly Load',
      storyAnalogy:
        'Imagine a VIP corporate portal (`SharePoint Server`) that accepts digital passports (`OAuth2 JSON Web Tokens / JWT`). Every passport has a top section (`Header`) that tells the guard which cryptographic signature pen was used to sign it (`RS256`), and a bottom section (`Signature`). At Pwn2Own 2023, STAR Labs discovered that if you print a fake passport whose top section says `"alg": "none"` ("No signature pen used!") and leave the signature blank, the SharePoint guard (`SPJsonWebSecurityBaseTokenHandler`) says: "Well, since it says `none`, I don’t need to check a signature—welcome in, Farm Administrator!" Once inside as the Farm Admin, the attacker imports a custom "Business Data Connector" (`.bdcm` file) containing a compiled C# program (`DotNetAssembly`) that SharePoint loads straight into memory!',
      plainSummary:
        'Discovered by Nguyễn Tiến Giang (Jang) of STAR Labs at Pwn2Own Vancouver 2023 and documented by Microsoft MSRC, Rapid7, and CISA KEV, this scenario chains two flaws in on-premises Microsoft SharePoint Server: (1) CVE-2023-29357 (CVSS 9.8 pre-authentication privilege escalation via unsigned `"alg": "none"` OAuth2 JSON Web Tokens) and (2) CVE-2023-24955 (authenticated Remote Code Execution via Business Connectivity Services `.bdcm` `DotNetAssembly` loading inside `w3wp.exe`).',
      diagramTopologySummary:
        'On the diagram: Node ① (Remote Attacker) sends the forged `"alg": "none"` Bearer JWT to Node ②/③ (SharePoint IIS Server `/_api/web/siteusers`), elevates to Farm Administrator inside Node ④ (OAuth2 JWT Claims Handler), and imports a malicious `.bdcm` `DotNetAssembly` on Node ⑤ (BCS Runtime RCE), detected via `eyJhbGciOiJub25l` headers and `w3wp.exe` child shells on Node ⑥ (SIEM).',
      documentedAdvisory: 'STAR Labs Pwn2Own Research · Microsoft CVE-2023-29357 & CVE-2023-24955 · Rapid7 & CISA KEV · MITRE T1190 / T1550.001',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1190',
        plainTitle: 'Sending an Unsigned `"alg": "none"` OAuth JWT to `/_api/web/siteusers` (CVE-2023-29357)',
        storyAnalogy:
          'By setting `"alg": "none"` (`eyJhbGciOiJub25l...`) and `"isloopback": "true"` inside a self-made JWT token, the attacker tricks SharePoint into skipping cryptographic signature verification completely and handing over the list of Site Administrators.',
        simpleExplanation:
          'As detailed by STAR Labs and Rapid7, the attacker first sends an unauthenticated request with Authorization: Bearer to SharePoint to read the server’s Realm UUID from the HTTP 401 WWW-Authenticate response header. Next, the attacker constructs a JSON Web Token (JWT) whose header specifies {"alg":"none","typ":"JWT"} (Base64 prefix eyJhbGciOiJub25l — instructing the parser that no cryptographic signature is attached) and whose payload includes "isloopback":"true" (a SharePoint-internal claim that tells the token handler to skip verifying the HTTP request’s endpoint URI) and "nameid":"00000003-0000-0ff1-ce00-000000000000". Because CVE-2023-29357 failed to reject the "none" algorithm when reading x5t/metadata tokens, sending this unsigned token to GET /_api/web/siteusers with header X-RequestForceAuthentication: true grants elevated app-level read access and dumps all site administrator accounts!',
        howItWorksInPractice:
          'Why is the Base64 string "eyJhbGciOiJub25l" such a reliable network detection signature? Because the ASCII JSON header `{"alg":"none"` always Base64URL-encodes to that exact 16-character prefix in the Authorization: Bearer header.',
        diagramAlignment:
          'On the diagram, arrow #1.1→ sends `GET /_api/web/siteusers` with `Bearer eyJhbGciOiJub25l...` from Node ① to Node ②/③ (SharePoint IIS Server), and ⇠#1.2 returns the XML list of site administrators.',
        detectionAndEvidence:
          'Documented by STAR Labs, Rapid7 & Suricata SID 2048312: `Authorization: Bearer eyJhbGciOiJub25l` header targeting `/_api/web/siteusers`.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1550.001',
        plainTitle: 'Minting a Second `"alg": "none"` JWT with the Farm Administrator’s `nameid` (SID)',
        storyAnalogy:
          'Reading the XML response from `/_api/web/siteusers`, the attacker copies the Farm Administrator’s Windows SID (`nameid`) and issuer (`nii`), pastes them into a second `"alg": "none"` JWT, and becomes the SharePoint Farm Administrator!',
        simpleExplanation:
          'From the /_api/web/siteusers response, the attacker extracts a Site Collection or Farm Administrator’s UserId.NameId (their Windows Active Directory SID, e.g., s-1-5-21-...-500) and UserId.NameIdIssuer (urn:office:idp:activedirectory). The attacker then mints a second unsigned "alg":"none" JWT placing those two values into the nameid and nii claims (allowing the attacker to impersonate that specific human Administrator on any SharePoint REST API or Central Administration page without knowing their password or passing MFA).',
        howItWorksInPractice:
          'Because CVE-2023-29357 only grants SharePoint application-level administrator privileges rather than direct OS command execution, the attacker needs a post-authentication SharePoint RCE primitive (Step 3) to run operating-system commands.',
        diagramAlignment:
          'On the diagram, arrow #2.1→ validates the second Admin JWT inside Node ④ (OAuth2 JWT Claims Handler), and ⇠#2.2 establishes the impersonated Farm Admin session.',
        detectionAndEvidence:
          'Documented in SharePoint ULS Logs: `SPJsonWebSecurityTokenHandler` validating an `isloopback=true` token for an administrator `nameid` from an external IP.',
      },
      {
        stepNumber: 3,
        mitreId: 'T1505.003',
        plainTitle: 'Importing a Malicious BCS `.bdcm` `DotNetAssembly` Model for In-Memory RCE (CVE-2023-24955)',
        storyAnalogy:
          'Now acting as the SharePoint Farm Admin, the attacker uploads a Business Connectivity Services (`.bdcm`) catalog file containing a compiled C# DLL (`Type="DotNetAssembly"`). SharePoint loads that DLL straight into `w3wp.exe` and runs `powershell.exe`!',
        simpleExplanation:
          'Using the forged Farm Administrator JWT, the attacker chains CVE-2023-24955 by uploading a crafted Business Data Connectivity Model (.bdcm) XML file to SharePoint’s Business Connectivity Services (BCS) catalog. Inside the .bdcm XML, the attacker defines a LobSystem with Type="DotNetAssembly" (a BCS feature that allows SharePoint to load a compiled .NET DLL byte stream directly into the w3wp.exe worker process via Assembly.Load() and invoke its methods when an External List or Finder method is queried). The loaded C# method calls System.Diagnostics.Process.Start() to spawn powershell.exe under the high-privilege SharePoint Farm account (CORP\\sp_farm).',
        howItWorksInPractice:
          'Because the malicious .NET assembly is stored inside the SharePoint SQL database and loaded directly into w3wp.exe memory via Assembly.Load(byte[]), no `.aspx` webshell file needs to be written to the IIS webroot on disk.',
        diagramAlignment:
          'On the diagram, arrow #3.1→ imports and executes the `.bdcm` `DotNetAssembly` on Node ⑤ (BCS Runtime in `w3wp.exe`) while Node ⑥ (SIEM) flags `w3wp.exe` spawning `powershell.exe`.',
        detectionAndEvidence:
          'Documented by STAR Labs & Microsoft MSRC: Sysmon EventID 1 (`w3wp.exe` spawning `cmd.exe` / `powershell.exe`) following `/_api/web/siteusers` access.',
      },
    ],
  },
};
