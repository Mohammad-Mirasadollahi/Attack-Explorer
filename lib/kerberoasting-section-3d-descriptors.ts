import type { Section3DDescriptor, Section3DKey } from './section-3d-registry';

/**
 * Bespoke 3D Section Descriptors for Scenario #031 (`ad-kerberoasting`).
 * Universe: Grand Hotel Concierge Lobby, Mahogany VIP Bellboard, Brass Ticket Pneumatic Tube & Basement Safecracker Bench.
 * All story fields are 100% jargon-free (`findTechnicalJargonInStory() === []`).
 */
export const KERBEROASTING_SECTION_SCENES: Partial<
  Record<Section3DKey, Section3DDescriptor>
> = {
  briefing: {
    scenarioId: 'ad-kerberoasting',
    sectionKey: 'briefing',
    sceneKind: 'kerb-lobby-briefing',
    stageBadge: 'BRIEFING #0 · GRAND HOTEL LOBBY DIORAMA',
    mitreId: 'T1558.003',
    title: 'Grand Hotel Concierge Desk, Soft Bronze Voucher & Basement Safecracker',
    storyCue:
      'In a grand hotel lobby, an ordinary guest reads the public mahogany VIP bellboard, sends a brass pneumatic request to the concierge desk for a soft-bronze sealed suite voucher, slips that voucher down into a soundproof basement safecracker bench to pop the weak lock open in silence, and returns upstairs with a master keycard to enter the finance suite.',
    technicalCue:
      'LDAP SPN query (TCP/389) -> Kerberos TGS-REQ RC4-HMAC 0x17 (Security EID 4769) -> Offline Hashcat -m 13100 cracking -> Pass-the-Hash SMB/445 (EID 4624/7045) vs. AES-256 gMSA.',
    storyMappings: [
      {
        storyTerm: 'Mahogany VIP Suite Bellboard',
        technicalTerm: 'Active Directory LDAP servicePrincipalName (SPN) Query (TCP/389)',
        tone: 'amber',
      },
      {
        storyTerm: 'Brass Concierge Ticket Desk',
        technicalTerm: 'Domain Controller KDC (CORP-DC01 · TCP/88) Issuing TGS Tickets',
        tone: 'sky',
      },
      {
        storyTerm: 'Soft-Bronze Wax Sealed Voucher',
        technicalTerm: 'Kerberos TGS Ticket Encrypted With RC4-HMAC (0x17 / etype 23)',
        tone: 'rose',
      },
      {
        storyTerm: 'Basement Safecracker Workbench',
        technicalTerm: 'Offline GPU Hashcat (-m 13100) Cracking With Zero DC Lockouts',
        tone: 'rose',
      },
      {
        storyTerm: 'Master Brass Keycard Swipe',
        technicalTerm: 'Pass-the-Hash Lateral Movement (Security EID 4624 LogonType 3)',
        tone: 'amber',
      },
      {
        storyTerm: 'Armored Emerald Suite Shield',
        technicalTerm: 'AES-256 (0x12) Kerberos Enforcement + 120-Char Auto-Rotated gMSA',
        tone: 'emerald',
      },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#E11D48',
    durationSec: 20,
    callouts: [
      {
        id: 'kerb-desk',
        tag: 'TICKET COUNTER',
        title: 'Brass Concierge Desk',
        subtitle: 'CORP-DC01 KDC · EID 4769 (0x17)',
        tone: 'amber',
      },
      {
        id: 'kerb-bench',
        tag: 'OFFLINE BENCH',
        title: 'Basement Safecracker',
        subtitle: 'Hashcat -m 13100 · Zero Lockouts',
        tone: 'rose',
      },
    ],
    phases: [
      {
        id: 1,
        shortLabel: '1. Bellboard',
        stageTag: 'ACT 01 · DISCOVERY',
        title: 'Guest Scans Public Mahogany VIP Suite Bellboard',
        storyExcerpt:
          'Standing in the main lobby, an ordinary guest reads every private penthouse suite name posted on the mahogany bellboard.',
        technicalParallel:
          'Standard domain user CORP\\j.miller runs LDAP SPN filter locating MSSQLSvc/FIN-SQL01.corp.local (svc_sql_prod).',
        accentHex: '#F59E0B',
        startSec: 0,
        endSec: 4,
      },
      {
        id: 2,
        shortLabel: '2. Bronze Seal',
        stageTag: 'ACT 02 · TGS 0x17',
        title: 'Concierge Stamps Soft-Bronze Sealed Suite Voucher',
        storyExcerpt:
          'The brass pneumatic tube carries a request to the ticket desk, which stamps and returns a soft-bronze sealed voucher.',
        technicalParallel:
          'CORP-DC01 issues an RC4-HMAC (0x17) Kerberos TGS ticket encrypted with svc_sql_prod NTLM hash (EID 4769).',
        accentHex: '#E11D48',
        startSec: 4,
        endSec: 8.4,
      },
      {
        id: 3,
        shortLabel: '3. Crack Offline',
        stageTag: 'ACT 03 · HASHCAT',
        title: 'Basement Safecracker Spins Weak Lock Tumblers Silently',
        storyExcerpt:
          'In the cutaway basement workshop, spinning brass tumblers crack the weak bronze seal open without ringing a single hotel alarm.',
        technicalParallel:
          'Offline GPU rig runs hashcat -m 13100 at 1.42 GH/s, recovering Winter2024!SQL with zero EID 4625 lockouts.',
        accentHex: '#F43F5E',
        startSec: 8.4,
        endSec: 13,
      },
      {
        id: 4,
        shortLabel: '4. Suite Pivot',
        stageTag: 'ACT 04 · PTH SMB',
        title: 'Freshly Cut Master Keycard Opens Restricted Finance Suite',
        storyExcerpt:
          'A golden master keycard glides up from the basement bench and unlocks the restricted finance doorway.',
        technicalParallel:
          'Pass-the-Hash over SMB/445 logs Security EID 4624 (LogonType 3 NTLM) and installs SqlHealthDiag (EID 7045).',
        accentHex: '#FACC15',
        startSec: 13,
        endSec: 16.8,
      },
      {
        id: 5,
        shortLabel: '5. Emerald Lock',
        stageTag: 'ACT 05 · AES gMSA',
        title: 'Hotel Upgrades Suite Doors to Armored Emerald Seals',
        storyExcerpt:
          'Security auditors flag the unusual voucher stamp and bolt an unbreakable glowing emerald shield across the penthouse door.',
        technicalParallel:
          'SIEM correlates EID 4769 (0x17) + EID 4624, while GPO enforces AES-256 (0x12) and 120-character gMSAs.',
        accentHex: '#10B981',
        startSec: 16.8,
        endSec: 20,
      },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 5.2, 16.4], target: [0.2, 2.55, 0.0] },
      { id: 'VIEW_A', label: 'Bellboard', position: [-5.2, 3.2, 6.8], target: [-5.2, 1.9, 0.15] },
      { id: 'VIEW_B', label: 'Ticket Desk', position: [-1.2, 3.4, 7.2], target: [-1.35, 1.9, 0.25] },
      { id: 'VIEW_C', label: 'Safecracker', position: [3.2, 3.6, 7.4], target: [2.8, 1.9, 0.25] },
    ],
  },

  'step-1': {
    scenarioId: 'ad-kerberoasting',
    sectionKey: 'step-1',
    sceneKind: 'kerb-step1-spn',
    stageBadge: 'STEP #1 · VIP BELLBOARD DIRECTORY',
    mitreId: 'T1558.003',
    title: 'Reading the Public Lobby VIP Bellboard Without Admin Clearance',
    storyCue:
      'Any ordinary guest standing in the hotel lobby can read the mahogany VIP bellboard posted in plain sight, spotting every private staff suite and copying down the head financial suite name without tripping any security desk alarm.',
    technicalCue:
      'CORP\\j.miller queries LDAP (TCP/389) for (&(objectClass=user)(servicePrincipalName=*)(!(objectClass=computer))) -> MSSQLSvc/FIN-SQL01.corp.local.',
    storyMappings: [
      { storyTerm: 'Mahogany VIP Bellboard', technicalTerm: 'Active Directory LDAP Directory Service (TCP/389)', tone: 'amber' },
      { storyTerm: 'Ordinary Guest Room Badge', technicalTerm: 'Standard Unprivileged Domain User Token (CORP\\j.miller)', tone: 'sky' },
      { storyTerm: 'Private Staff Suite Plaque', technicalTerm: 'servicePrincipalName (SPN) on Human-Managed svc_sql_prod', tone: 'rose' },
      { storyTerm: 'Lobby Directory Watcher', technicalTerm: 'Directory Service Event ID 1644 & Zeek LDAP Monitoring', tone: 'emerald' },
    ],
    accentHex: '#F59E0B',
    secondaryHex: '#38BDF8',
    durationSec: 15,
    callouts: [
      { id: 'kerb-s1-board', tag: 'PUBLIC DIRECTORY', title: 'VIP Suite Bellboard', subtitle: 'LDAP TCP/389 · servicePrincipalName=*', tone: 'amber' },
      { id: 'kerb-s1-target', tag: 'HIGH-VALUE TARGET', title: 'Finance Suite Plaque', subtitle: 'MSSQLSvc/FIN-SQL01 -> svc_sql_prod', tone: 'rose' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Walk Lobby', stageTag: 'STEP 01 · ACCESS', title: 'Standard Guest Approaches Public Directory', storyExcerpt: 'With only a regular room badge, the visitor walks up to the open lobby bellboard.', technicalParallel: 'Any Authenticated User in Active Directory has default read access to SPN attributes.', accentHex: '#38BDF8', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Spot Suite', stageTag: 'STEP 01 · SPN', title: 'Highlight Human-Managed Financial Suite Account', storyExcerpt: 'Three private service plaques glow on the board, revealing the privileged financial suite.', technicalParallel: 'Rubeus / DirectorySearcher filters admincount=1 and returns svc_sql_prod.', accentHex: '#F59E0B', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Copy Target', stageTag: 'STEP 01 · AUDIT', title: 'Directory Lookup Sets Up Voucher Request', storyExcerpt: 'With the exact suite name copied down, the visitor heads straight for the ticket counter.', technicalParallel: 'Defenders detect broad SPN sweeps via LDAP Event ID 1644 and honey-SPN canary accounts.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.3, 12.6], target: [0.0, 2.45, 0.0] },
      { id: 'VIEW_A', label: 'Bellboard', position: [0.0, 2.6, 5.8], target: [0.0, 2.0, 0.2] },
      { id: 'VIEW_B', label: 'Left Angle', position: [-3.8, 3.1, 6.4], target: [0.0, 2.0, 0.2] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.0, 6.4, 6.2], target: [0.0, 2.0, 0.2] },
    ],
  },

  'step-2': {
    scenarioId: 'ad-kerberoasting',
    sectionKey: 'step-2',
    sceneKind: 'kerb-step2-tgs',
    stageBadge: 'STEP #2 · SOFT-BRONZE VOUCHER STAMP',
    mitreId: 'T1558.003',
    title: 'Requesting a Soft-Bronze Sealed Suite Voucher From the Concierge',
    storyCue:
      'Shooting a request capsule through the brass pneumatic tube, the guest asks the concierge counter to stamp a suite entry voucher using the hotel’s legacy soft-bronze seal—and the counter complies automatically without verifying penthouse ownership.',
    technicalCue:
      'Rubeus sends TGS-REQ advertising RC4-HMAC (0x17) -> CORP-DC01 issues $krb5tgs$23$ encrypted with svc_sql_prod NTLM hash (Security EID 4769).',
    storyMappings: [
      { storyTerm: 'Brass Pneumatic Request Tube', technicalTerm: 'Kerberos TGS-REQ Packet Sent Over TCP/88 to CORP-DC01', tone: 'sky' },
      { storyTerm: 'Mechanical Crimson Stamp Arm', technicalTerm: 'KDC Encrypting EncTicketPart With svc_sql_prod NTLM Hash', tone: 'rose' },
      { storyTerm: 'Soft-Bronze Sealed Voucher', technicalTerm: 'TicketEncryptionType 0x17 (RC4-HMAC-MD5) · Options 0x40810000', tone: 'amber' },
      { storyTerm: 'Concierge Ledger Entry', technicalTerm: 'Windows Security Event ID 4769 (Non-$ Service + 0x17 Alert)', tone: 'emerald' },
    ],
    accentHex: '#E11D48',
    secondaryHex: '#F59E0B',
    durationSec: 15,
    callouts: [
      { id: 'kerb-s2-tube', tag: 'PNEUMATIC REQUEST', title: 'Brass Pneumatic Tube', subtitle: 'Kerberos TGS-REQ · etype 23 (0x17)', tone: 'sky' },
      { id: 'kerb-s2-voucher', tag: 'WEAK SEAL TICKET', title: 'Soft-Bronze Voucher', subtitle: '$krb5tgs$23$ · Security EID 4769', tone: 'rose' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Send Tube', stageTag: 'STEP 02 · TGS-REQ', title: 'Pneumatic Capsule Delivers Suite Ticket Request', storyExcerpt: 'The golden capsule zips through the glass tube straight into the concierge counter.', technicalParallel: 'Client submits valid TGT and requests service ticket for MSSQLSvc/FIN-SQL01.corp.local.', accentHex: '#38BDF8', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Bronze Stamp', stageTag: 'STEP 02 · RC4 0x17', title: 'Desk Stamps Voucher With Soft-Bronze Wax Seal', storyExcerpt: 'The crimson mechanical stamp presses a weak bronze seal straight onto the voucher.', technicalParallel: 'KDC honors RC4-HMAC downgrade (0x17), sealing the ticket with svc_sql_prod raw NTLM hash.', accentHex: '#E11D48', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Log EID 4769', stageTag: 'STEP 02 · AUDIT', title: 'Concierge Ledger Records Unusual Bronze Ticket', storyExcerpt: 'Even as the voucher slides out, the hotel counter log records the soft-bronze request.', technicalParallel: 'Security Event ID 4769 logs TicketEncryptionType=0x17 against non-machine account svc_sql_prod.', accentHex: '#F59E0B', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.2, 4.4, 13.4], target: [0.25, 2.55, 0.0] },
      { id: 'VIEW_A', label: 'Pneumatic Tube', position: [-3.6, 3.0, 6.2], target: [-1.8, 2.1, 0.2] },
      { id: 'VIEW_B', label: 'Stamp Press', position: [0.3, 3.2, 5.8], target: [0.3, 2.0, 0.25] },
      { id: 'VIEW_C', label: 'Bronze Pass', position: [3.2, 2.9, 5.4], target: [1.2, 1.7, 0.35] },
    ],
  },

  'step-3': {
    scenarioId: 'ad-kerberoasting',
    sectionKey: 'step-3',
    sceneKind: 'kerb-step3-crack',
    stageBadge: 'STEP #3 · SILENT BASEMENT SAFECRACKER',
    mitreId: 'T1558.003',
    title: 'Cracking the Weak Bronze Seal Offline With Zero Lobby Alarms',
    storyCue:
      'Down in a soundproof basement workshop away from every hotel guard, three high-speed brass tumbler wheels spin relentlessly against the soft-bronze seal until the hidden suite password pops open in complete silence.',
    technicalCue:
      'Offline GPU rig runs hashcat -m 13100 hashes.txt (1.42 GH/s), recovering Winter2024!SQL in 6 seconds with zero Active Directory failed-logon alerts.',
    storyMappings: [
      { storyTerm: 'Soundproof Basement Workshop', technicalTerm: 'Off-Network Attacker GPU Rig (198.51.100.77 — Zero DC Traffic)', tone: 'sky' },
      { storyTerm: 'Spinning Brass Tumbler Wheels', technicalTerm: 'Hashcat Mode 13100 Testing 1.42 Billion RC4 Candidates/Sec', tone: 'rose' },
      { storyTerm: 'Silent Unalarmed Lock Pick', technicalTerm: 'Zero Security Event ID 4625 Failed Logons or Account Lockouts', tone: 'amber' },
      { storyTerm: 'Popped Golden Master Keycard', technicalTerm: 'Recovered svc_sql_prod Password & NTLM Hash (8846F7EA...586C)', tone: 'emerald' },
    ],
    accentHex: '#F43F5E',
    secondaryHex: '#F59E0B',
    durationSec: 15,
    callouts: [
      { id: 'kerb-s3-wheels', tag: 'OFFLINE CRACKING', title: 'Spinning Tumbler Wheels', subtitle: 'hashcat -m 13100 · 1.42 GH/s RC4', tone: 'rose' },
      { id: 'kerb-s3-key', tag: 'RECOVERED SECRET', title: 'Golden Master Keycard', subtitle: 'svc_sql_prod · Zero DC Lockouts', tone: 'amber' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Load Voucher', stageTag: 'STEP 03 · EXPORT', title: 'Soft-Bronze Voucher Enters Soundproof Bench', storyExcerpt: 'Safely away from the lobby, the cutaway glass opens to reveal the offline cracking bench.', technicalParallel: 'Extracted $krb5tgs$23$ blob is copied to an off-network GPU host completely invisible to AD.', accentHex: '#38BDF8', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Spin Tumblers', stageTag: 'STEP 03 · 13100', title: 'High-Speed Tumblers Test Weak Seasonal Phrases', storyExcerpt: 'All three brass tumblers blur at high speed, testing dictionary patterns against the soft seal.', technicalParallel: 'Unsalted MD4/RC4-HMAC lets GPUs test 1.42 GH/s using best64 rules without touching CORP-DC01.', accentHex: '#F43F5E', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Mint Keycard', stageTag: 'STEP 03 · SECRET', title: 'Master Keycard Pops Out Ready for Penthouse Entry', storyExcerpt: 'The glowing golden master keycard rises cleanly from the bench, ready for upstairs use.', technicalParallel: 'Winter2024!SQL and NTLM hash 8846F7EAEE8FB117AD06BDD830B7586C recovered in 6 seconds.', accentHex: '#FACC15', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.4, 13.0], target: [0.0, 2.5, 0.0] },
      { id: 'VIEW_A', label: 'Tumblers', position: [-2.6, 2.8, 5.4], target: [0.0, 1.7, 0.3] },
      { id: 'VIEW_B', label: 'Master Key', position: [2.6, 3.6, 5.4], target: [0.0, 2.7, 0.4] },
      { id: 'VIEW_C', label: 'Top Cutaway', position: [0.0, 6.8, 5.6], target: [0.0, 1.8, 0.25] },
    ],
  },

  'step-4': {
    scenarioId: 'ad-kerberoasting',
    sectionKey: 'step-4',
    sceneKind: 'kerb-step4-pth',
    stageBadge: 'STEP #4 · SUITE PIVOT & EMERALD HARDENING',
    mitreId: 'T1550.002',
    title: 'Swiping the Master Keycard at the Finance Suite vs. Emerald Vault Defense',
    storyCue:
      'Gliding straight from the basement bench to the restricted finance suite door, the stolen master keycard flips the doorway lamp crimson—until security auditors catch the abnormal staff swipe and bolt an unbreakable emerald vault shield over the door.',
    technicalCue:
      'Pass-the-Hash over SMB/445 logs Security EID 4624 (LogonType 3 NTLM) + EID 7045 (SqlHealthDiag) on FIN-SQL01; AES-256 + gMSA blocks repeat compromise.',
    storyMappings: [
      { storyTerm: 'Gliding Golden Master Keycard', technicalTerm: 'Pass-the-Hash NTLM Authentication (svc_sql_prod -> FIN-SQL01)', tone: 'amber' },
      { storyTerm: 'Crimson Finance Suite Lamp', technicalTerm: 'Security EID 4624 (LogonType 3 NTLM) + System EID 7045 Service', tone: 'rose' },
      { storyTerm: 'Abnormal Staff Swipe Alarm', technicalTerm: 'SIEM Alert on svc_* Account NTLM Logon From User Workstation', tone: 'sky' },
      { storyTerm: 'Glowing Emerald Vault Shield', technicalTerm: 'AES-256 Only Kerberos (0x12) + 120-Char gMSA + Auth Policy Silos', tone: 'emerald' },
    ],
    accentHex: '#10B981',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      { id: 'kerb-s4-key', tag: 'STOLEN HASH', title: 'Forged Master Keycard', subtitle: 'Pass-the-Hash · SMB/445 (EID 4624)', tone: 'amber' },
      { id: 'kerb-s4-door', tag: 'FINANCE SERVER', title: 'Finance Suite Door', subtitle: 'FIN-SQL01 · EID 7045 -> AES gMSA', tone: 'emerald' },
    ],
    phases: [
      { id: 1, shortLabel: '1. Card Glide', stageTag: 'STEP 04 · PTH', title: 'Cracked Master Keycard Travels to Finance Suite', storyExcerpt: 'The golden keycard lifts from the basement bench and glides across the hall toward the suite.', technicalParallel: 'Attacker passes NTLM hash 8846F7EA...586C from WKS-OPS-12 to FIN-SQL01 over SMB TCP/445.', accentHex: '#F59E0B', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Door Breach', stageTag: 'STEP 04 · EID 4624', title: 'Finance Suite Door Lamp Flips Crimson on Entry', storyExcerpt: 'The restricted suite turnstile unlocks and flashes crimson as the impostor steps inside.', technicalParallel: 'FIN-SQL01 records Security EID 4624 (LogonType 3 NTLM) and System EID 7045 installing SqlHealthDiag.', accentHex: '#E11D48', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. Emerald Lock', stageTag: 'STEP 04 · HARDEN', title: 'Auditors Bolt Unbreakable Emerald Shield Across Door', storyExcerpt: 'Guards revoke the bronze system and seal the suite behind a glowing emerald automatic lock.', technicalParallel: 'Enforcing AES-256 (0x12), rotating service credentials to gMSAs, and enabling Auth Policy Silos closes the path.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 4.6, 13.6], target: [0.1, 2.55, 0.0] },
      { id: 'VIEW_A', label: 'Keycard Path', position: [-3.4, 3.2, 6.2], target: [-1.2, 2.3, 0.25] },
      { id: 'VIEW_B', label: 'Finance Door', position: [3.2, 3.2, 6.2], target: [2.8, 2.1, 0.2] },
      { id: 'VIEW_C', label: 'Overhead', position: [0.0, 7.6, 6.8], target: [0.0, 2.1, 0.2] },
    ],
  },

  'memory-forensics': {
    scenarioId: 'ad-kerberoasting',
    sectionKey: 'memory-forensics',
    sceneKind: 'kerb-memory-rc4diff',
    stageBadge: 'MEMORY FORENSICS · WEAK BRONZE SEAL VS. EMERALD VAULT',
    mitreId: 'T1558.003',
    title: 'Soft Bronze Service Voucher (RC4 0x17) vs. Hardened Emerald Vault (AES-256 gMSA)',
    storyCue:
      'Place the spinning basement safecracker bench directly beside the armored emerald suite lock. A golden audit bar sweeps across both sides, showing how quickly weak seasonal locks pop open while an automatically rotating emerald vault stops every tumbler cold.',
    technicalCue:
      'Comparing lsass.exe cached Kerberos TGS ticket encrypted with RC4-HMAC 0x17 (1.42 GH/s crackable) against AES256-CTS-HMAC-SHA1-96 (0x12) + 120-character gMSA.',
    storyMappings: [
      { storyTerm: 'Spinning Left Safecracker Bench', technicalTerm: 'RC4-HMAC (0x17) Ticket @ 0x00007FF9B4100000 · Cracked in 6s', tone: 'rose' },
      { storyTerm: 'Armored Right Emerald Vault', technicalTerm: 'AES-256 (0x12) Ticket @ 0x00007FF9B4200000 · 120-Char gMSA', tone: 'emerald' },
      { storyTerm: 'Sweeping Golden Audit Beam', technicalTerm: 'AD Tier-0 Audit Checking msDS-SupportedEncryptionTypes & SPNs', tone: 'amber' },
      { storyTerm: 'Zero-Traffic Offline Risk', technicalTerm: 'KerbRetrieveEncodedTicketMessage Exporting $krb5tgs$23$ From RAM', tone: 'sky' },
    ],
    accentHex: '#38BDF8',
    secondaryHex: '#E11D48',
    durationSec: 15,
    callouts: [
      { id: 'kerb-mem-rc4', tag: 'WEAK SEAL (0x17)', title: 'Cracked Bronze Bench', subtitle: 'RC4-HMAC · 1.42 GH/s Offline Crack', tone: 'rose' },
      { id: 'kerb-mem-aes', tag: 'HARDENED SEAL (0x12)', title: 'Armored Emerald Lock', subtitle: 'AES-256 + 120-Char Auto-Rotated gMSA', tone: 'emerald' },
    ],
    phases: [
      { id: 1, shortLabel: '1. RC4 Cache', stageTag: 'DIFF · 0x17', title: 'Soft-Bronze Ticket Exposed in Memory Cache', storyExcerpt: 'On the left, spinning tumblers chew right through the flimsy bronze voucher seal.', technicalParallel: '0x00007FF9B4100000 holds RC4-HMAC 0x17 ciphertext derived directly from svc_sql_prod NTLM hash.', accentHex: '#E11D48', startSec: 0, endSec: 5 },
      { id: 2, shortLabel: '2. Audit Sweep', stageTag: 'DIFF · AUDIT', title: 'Golden Comparison Beam Inspects Both Encryption Seals', storyExcerpt: 'The golden audit bar glides across the lobby floor contrasting both seal strengths side by side.', technicalParallel: 'Blue team audits msDS-SupportedEncryptionTypes = 0x18 (AES128/AES256 only) across all SPNs.', accentHex: '#FACC15', startSec: 5, endSec: 10 },
      { id: 3, shortLabel: '3. AES gMSA', stageTag: 'DIFF · 0x12', title: 'Emerald Auto-Rotating Vault Stops Offline Cracking Cold', storyExcerpt: 'On the right, the glowing emerald shield locks out every basement tumbler permanently.', technicalParallel: 'AES256-CTS-HMAC-SHA1-96 (0x12) + 120-char gMSA passwords render offline Hashcat -m 19700 infeasible.', accentHex: '#10B981', startSec: 10, endSec: 15 },
    ],
    cameraPresets: [
      { id: 'DIRECTOR', label: 'Director', position: [0.0, 5.2, 15.2], target: [0.0, 2.55, 0.0] },
      { id: 'VIEW_A', label: 'RC4 Bench', position: [-5.2, 3.6, 7.6], target: [-3.2, 2.1, 0.2] },
      { id: 'VIEW_B', label: 'AES Vault', position: [5.2, 3.6, 7.6], target: [3.2, 2.1, 0.2] },
      { id: 'VIEW_C', label: 'Top Audit', position: [0.0, 8.2, 7.4], target: [0.0, 2.1, 0.2] },
    ],
  },
};
