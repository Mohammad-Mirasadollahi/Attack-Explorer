# Bespoke Screenplay #031 — Active Directory Kerberoasting & Pass-the-Hash Lateral Movement (`ad-kerberoasting`)

- **Scenario ID**: `ad-kerberoasting`
- **Sidebar Category**: Active Directory & Identity (`ACTIVE_DIRECTORY`)
- **MITRE ATT&CK**: `T1558.003` (Kerberoasting), `T1550.002` (Pass the Hash), `T1543.003` (Windows Service)
- **Severity**: `HIGH`
- **Bespoke Visual Universe**: **Grand Hotel Concierge Lobby & Brass Ticket Pneumatic Tube**

## 1. Story-to-Technical Metaphor Map (100% Jargon-Free Story Layer)
- **Mahogany VIP Concierge Bellboard** -> Active Directory LDAP `servicePrincipalName` (SPN) query (`MSSQLSvc/sql01.corp.local:1433`)
- **Grand Brass Ticket Desk & Pneumatic Stamp** -> Domain Controller Key Distribution Center (`CORP-DC01`, TCP/88) issuing Kerberos TGS tickets
- **Thin Bronze Service Voucher (Weak Seal)** -> Kerberos TGS Ticket encrypted with legacy RC4-HMAC (`TicketEncryptionType 0x17`) using the service account's NTLM hash
- **Basement Safecracker Workbench** -> Offline GPU cracking (`hashcat -m 13100`) recovering plaintext password of `CORP\svc_sql_prod` with zero DC lockouts
- **Stolen Master Brass Keycard** -> Pass-the-Hash (`LogonType 3` NtLmSsp, Windows Security Event ID `4624`) lateral movement to `FIN-SQL01.corp.local`
- **Armored Emerald Vault Box (Modern Seal)** -> AES256-CTS-HMAC-SHA1-96 (`TicketEncryptionType 0x12`) + 120-character auto-rotated Group Managed Service Account (`gMSA`)

## 2. Five-Act Hero Choreography (`0.0 -> 1.0`, 20s Loop)
1. **Act 1 (`0.00 -> 0.20`) — Bellboard SPN Scan**: Low-privilege lobby guest (`CORP\j.miller`) scans the mahogany VIP bellboard; golden brass room tags light up identifying `svc_sql_prod`.
2. **Act 2 (`0.20 -> 0.42`) — Bronze Voucher Dispatch**: Brass pneumatic tube shoots a request across the marble lobby to the concierge desk; the desk stamps and ejects a glowing crimson-bronze RC4 (`0x17`) voucher (`Security EID 4769`).
3. **Act 3 (`0.42 -> 0.65`) — Cutaway Basement Safecracker**: Floor cutaway opens; the voucher drops onto the offline basement workbench where spinning brass tumbler wheels rapidly crack the weak service password without ringing any lobby bell.
4. **Act 4 (`0.65 -> 0.84`) — Master Keycard Pivot**: Forged master keycard glides from the basement bench up to the restricted Finance Suite turnstile (`FIN-SQL01`), flipping its status lamp crimson (`Security EID 4624` LogonType 3).
5. **Act 5 (`0.84 -> 1.00`) — Concierge Audit Lantern & AES Shield**: Overhead lobby auditor flashes Security `EID 4769 (0x17)` alert beam onto the ticket desk while contrasting the cracked bronze seal against an unbreakable emerald AES-256 gMSA vault.

## 3. Section Media Matrix
- **3D Interactive Stages (6)**: `briefing`, `step-1`, `step-2`, `step-3`, `step-4`, `memory-forensics`
- **2D SVG+GSAP Silent Lecture Clips (5)**: `step-1`, `step-2`, `step-3`, `step-4`, `memory-forensics`
- **Orthogonal Excalidraw Technical Whiteboards (6)**: `briefing`, `step-1`, `step-2`, `step-3`, `step-4`, `memory-forensics`
