import type { Section3DDescriptor, Section3DKey } from '@/lib/section-3d-registry';

/**
 * Bespoke 3D Story-to-Technical Section Descriptors for ACTIVE_DIRECTORY (16 scenarios).
 */
export const ACTIVE_DIRECTORY_3D_REGISTRY: Record<
  string,
  Partial<Record<Section3DKey, Section3DDescriptor>>
> = {
  "ad-kerberoasting": {
    "briefing": {
      "scenarioId": "ad-kerberoasting",
      "sectionKey": "briefing",
      "sceneKind": "ad-kerberoast-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1558.003",
      "title": "Active Directory Kerberoasting & Pass-the-Hash Lateral Movement — Story-to-Technical Overview",
      "storyCue": "Imagine a grand hotel where any ordinary guest can walk up to the concierge desk and request a wax-sealed banquet voucher for the executive kitchen, sealed with the head chef personal passcode. A clever guest asks the concierge to seal the voucher with an outdated weak wax cipher, walks back to their private room to crack the chef passcode offline at leisure, and then marches straight into the executive kitchen to install a permanent back-door helper.",
      "technicalCue": "CREDENTIAL ACCESS: REQUEST RC4-DOWNGRADED KERBEROS TGS (EVENT 4769) -> LATERAL & C2: OFFLINE CRACKING & SMB LOGON (EVENT 4624) -> PERSISTENCE: REMOTE SERVICE EXECUTION VIA PSEXEC (EVENT 7045)",
      "storyMappings": [
        {
          "storyTerm": "Ordinary guest requesting a weak wax-sealed banquet voucher",
          "technicalTerm": "Standard domain user requesting an RC4-downgraded (0x17) Kerberos TGS ticket",
          "tone": "amber"
        },
        {
          "storyTerm": "Cracking the head chef passcode privately offline",
          "technicalTerm": "Exporting $krb5tgs$23$* hash and offline Hashcat brute-forcing of svc_mssql",
          "tone": "sky"
        },
        {
          "storyTerm": "Walking into the executive kitchen with the chef pass",
          "technicalTerm": "Lateral SMB LogonType 3 authentication to SQL01.corp.local as svc_mssql",
          "tone": "rose"
        },
        {
          "storyTerm": "Installing a permanent back-door helper in the kitchen",
          "technicalTerm": "PsExec remote PSEXESVC.exe service installation executing as SYSTEM",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-kerberoast-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Ordinary guest requesting a weak…",
          "subtitle": "Standard domain user requesting an RC4-downgraded (0x17)…",
          "tone": "amber"
        },
        {
          "id": "ad-kerberoast-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Cracking the head chef passcode…",
          "subtitle": "Exporting $krb5tgs$23$* hash and offline Hashcat brute-forcing…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room Key",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "REQUEST RC4-DOWNGRADED KERBEROS TGS (EVENT 4769)",
          "storyExcerpt": "Standing at the hotel concierge desk with nothing more than a regular guest room key, the intruder browses the public roster of special dining-hall accounts and asks for an executive kitchen pass sealed…",
          "technicalParallel": "By design in the Kerberos protocol, the Key Distribution Center (KDC) on DC01.corp.local (10.10.1.5) does not check whether CORP\\m.davis has permission to log into SQL01; it immediately encrypts the…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Away",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "OFFLINE CRACKING & SMB LOGON (EVENT 4624)",
          "storyExcerpt": "Retreating to a private room far away from hotel cameras, the intruder runs thousands of rapid key guesses against the soft wax seal until the head chef real password pops open, then uses that genuine…",
          "technicalParallel": "Because svc_mssql was granted local administrator privileges on SQL01.corp.local (10.10.5.20), completing the NTLMSSP network authentication handshake over TCP/445 returns an authenticated administrative…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Chef Pass",
          "stageTag": "STAGE 03 · PERSISTENCE",
          "title": "REMOTE SERVICE EXECUTION VIA PSEXEC (EVENT 7045)",
          "storyExcerpt": "Inside the unlocked kitchen corridor, the intruder slides an automated assistant package onto the staff supply shelf and registers it with the hotel shift foreman, launching a full master-keyed command…",
          "technicalParallel": "When PsExec calls StartServiceW over the svcctl RPC pipe, services.exe (PID 628) starts C:\\Windows\\PSEXESVC.exe (PID 5190) as LocalSystem (NT AUTHORITY\\SYSTEM), which calls CreateNamedPipeW and…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Concierge Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Offline Safe",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Wax Voucher",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "ad-kerberoasting",
      "sectionKey": "step-1",
      "sceneKind": "ad-kerberoast-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Enumerating SPNs & Requesting an RC4-Downgraded Kerberos TGS Ticket (Event ID 4769)",
      "storyCue": "Standing at the hotel concierge desk with nothing more than a regular guest room key, the intruder browses the public roster of special dining-hall accounts and asks for an executive kitchen pass sealed with an older, softer wax stamp that is easy to break later.",
      "technicalCue": "T1558.003 · CREDENTIAL ACCESS — From the compromised workstation WS-FINANCE-04 (10.10.20.45) using standard domain account CORP\\m.davis, the attacker runs Rubeus.exe (PID 3920, PPID 2104: Rubeus.exe kerberoast…",
      "storyMappings": [
        {
          "storyTerm": "Regular guest room key",
          "technicalTerm": "Standard unprivileged domain user account (CORP\\m.davis)",
          "tone": "amber"
        },
        {
          "storyTerm": "Public roster of special dining-hall accounts",
          "technicalTerm": "Active Directory LDAP query enumerating Service Principal Names (SPNs)",
          "tone": "sky"
        },
        {
          "storyTerm": "Executive kitchen pass with an older soft wax stamp",
          "technicalTerm": "Kerberos TGS ticket for svc_mssql requested with TicketEncryptionType 0x17 (RC4-HMAC)",
          "tone": "rose"
        },
        {
          "storyTerm": "Hotel concierge ledger logging the odd stamp",
          "technicalTerm": "Domain Controller Windows Security EventID 4769 recording RC4 downgrade",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-kerberoast-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Regular guest room key",
          "subtitle": "Standard unprivileged domain user account (CORP\\m.davis)",
          "tone": "amber"
        },
        {
          "id": "ad-kerberoast-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Public roster of special dining-hall…",
          "subtitle": "Active Directory LDAP query enumerating Service Principal…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room Key",
          "stageTag": "STEP 01 · SETUP",
          "title": "Regular guest room key",
          "storyExcerpt": "Standing at the hotel concierge desk with nothing more than a regular guest room key, the intruder browses the public roster of special dining-hall accounts and asks for an executive kitchen…",
          "technicalParallel": "By design in the Kerberos protocol, the Key Distribution Center (KDC) on DC01.corp.local (10.10.1.5) does not check whether CORP\\m.davis has permission to log into SQL01; it immediately encrypts the…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Pass",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Public roster of special dining-hall accounts",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses public roster of special dining-hall accounts to advance toward executive kitchen pass with an older soft wax stamp.",
          "technicalParallel": "From the compromised workstation WS-FINANCE-04 (10.10.20.45) using standard domain account CORP\\m.davis, the attacker runs Rubeus.exe (PID 3920, PPID 2104: Rubeus.exe kerberoast…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Pass Soft",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Hotel concierge ledger logging the odd stamp",
          "storyExcerpt": "Behind the scenes, hotel concierge ledger logging the odd stamp captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Correlate Windows Security EventID 4769 (Kerberos Service Ticket Operations on the Domain Controller) where TicketEncryptionType equals 0x17 (RC4-HMAC downgrade instead of AES-256) and ServiceName…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Concierge Desk",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Offline Safe",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Wax Voucher",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1558.003"
    },
    "step-2": {
      "scenarioId": "ad-kerberoasting",
      "sectionKey": "step-2",
      "sceneKind": "ad-kerberoast-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "Offline Hashcat Cracking & Lateral SMB Network Logon to SQL01 (Event ID 4624)",
      "storyCue": "Retreating to a private room far away from hotel cameras, the intruder runs thousands of rapid key guesses against the soft wax seal until the head chef real password pops open, then uses that genuine password to unlock the kitchen server room over the internal hallway.",
      "technicalCue": "T1550.002 · LATERAL & C2 — The attacker exports the returned RC4 TGS ticket from WS-FINANCE-04 in $krb5tgs$23$* format and cracks it offline using Hashcat (-m 13100, generating zero failed-login alerts on DC01 because…",
      "storyMappings": [
        {
          "storyTerm": "Running rapid guesses privately away from cameras",
          "technicalTerm": "Offline Hashcat GPU cracking of exported $krb5tgs$23$* RC4 ticket hash",
          "tone": "amber"
        },
        {
          "storyTerm": "Head chef real password unlocked",
          "technicalTerm": "Recovered cleartext password or NTLM hash for service account svc_mssql",
          "tone": "sky"
        },
        {
          "storyTerm": "Unlocking the kitchen server room down the hall",
          "technicalTerm": "Lateral SMB network authentication to SQL01.corp.local (10.10.5.20)",
          "tone": "rose"
        },
        {
          "storyTerm": "Kitchen door ledger logging the network arrival",
          "technicalTerm": "Windows Security EventID 4624 (LogonType 3, NtLmSsp) on SQL01",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-kerberoast-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Running rapid guesses privately away…",
          "subtitle": "Offline Hashcat GPU cracking of exported $krb5tgs$23$* RC4…",
          "tone": "amber"
        },
        {
          "id": "ad-kerberoast-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Head chef real password unlocked",
          "subtitle": "Recovered cleartext password or NTLM hash for service account…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Away",
          "stageTag": "STEP 02 · SETUP",
          "title": "Running rapid guesses privately away from cameras",
          "storyExcerpt": "Retreating to a private room far away from hotel cameras, the intruder runs thousands of rapid key guesses against the soft wax seal until the head chef real password pops open, then uses that…",
          "technicalParallel": "Because svc_mssql was granted local administrator privileges on SQL01.corp.local (10.10.5.20), completing the NTLMSSP network authentication handshake over TCP/445 returns an authenticated administrative…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Head Chef",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Head chef real password unlocked",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses head chef real password unlocked to advance toward unlocking the kitchen server room down the hall.",
          "technicalParallel": "The attacker exports the returned RC4 TGS ticket from WS-FINANCE-04 in $krb5tgs$23$* format and cracks it offline using Hashcat (-m 13100, generating zero failed-login alerts on DC01 because every guess…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Room Down",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Kitchen door ledger logging the network arrival",
          "storyExcerpt": "Behind the scenes, kitchen door ledger logging the network arrival captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert on Windows Security EventID 4624 (Successful Account Logon) on SQL01.corp.local recording LogonType 3 (Network logon), AuthenticationPackageName NtLmSsp, and TargetUserName svc_mssql originating…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Concierge Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Offline Safe",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Wax Voucher",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1550.002"
    },
    "step-3": {
      "scenarioId": "ad-kerberoasting",
      "sectionKey": "step-3",
      "sceneKind": "ad-kerberoast-step-3",
      "stageBadge": "STEP #3 · PERSISTENCE",
      "title": "Remote Service Installation & SYSTEM Execution on SQL01 via PsExec (Event ID 7045)",
      "storyCue": "Inside the unlocked kitchen corridor, the intruder slides an automated assistant package onto the staff supply shelf and registers it with the hotel shift foreman, launching a full master-keyed command console inside the kitchen vault.",
      "technicalCue": "T1543.003 · PERSISTENCE — Using the authenticated SMB session on SQL01.corp.local (10.10.5.20), the attacker uploads PSEXESVC.exe to \\\\sql01.corp.local\\ADMIN$\\PSEXESVC.exe and invokes CreateServiceW and StartServiceW on…",
      "storyMappings": [
        {
          "storyTerm": "Staff supply shelf",
          "technicalTerm": "Administrative SMB share \\\\sql01.corp.local\\ADMIN$",
          "tone": "amber"
        },
        {
          "storyTerm": "Automated assistant package",
          "technicalTerm": "Uploaded PSEXESVC.exe service binary dropped via PsExec",
          "tone": "sky"
        },
        {
          "storyTerm": "Registering with the hotel shift foreman",
          "technicalTerm": "Remote Service Control Manager installation logged as System EventID 7045",
          "tone": "rose"
        },
        {
          "storyTerm": "Full master-keyed command console",
          "technicalTerm": "Interactive NT AUTHORITY\\SYSTEM shell executed on SQL01",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-kerberoast-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Staff supply shelf",
          "subtitle": "Administrative SMB share \\\\sql01.corp.local\\ADMIN$",
          "tone": "amber"
        },
        {
          "id": "ad-kerberoast-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Automated assistant package",
          "subtitle": "Uploaded PSEXESVC.exe service binary dropped via PsExec",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Onto It",
          "stageTag": "STEP 03 · SETUP",
          "title": "Staff supply shelf",
          "storyExcerpt": "Inside the unlocked kitchen corridor, the intruder slides an automated assistant package onto the staff supply shelf and registers it with the hotel shift foreman, launching a full master-keyed…",
          "technicalParallel": "When PsExec calls StartServiceW over the svcctl RPC pipe, services.exe (PID 628) starts C:\\Windows\\PSEXESVC.exe (PID 5190) as LocalSystem (NT AUTHORITY\\SYSTEM), which calls CreateNamedPipeW and…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Automated assistant package",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses automated assistant package to advance toward registering with the hotel shift foreman.",
          "technicalParallel": "Using the authenticated SMB session on SQL01.corp.local (10.10.5.20), the attacker uploads PSEXESVC.exe to \\\\sql01.corp.local\\ADMIN$\\PSEXESVC.exe and invokes CreateServiceW and StartServiceW on the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Full",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Full master-keyed command console",
          "storyExcerpt": "Behind the scenes, full master-keyed command console captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Windows System EventID 7045 (ServiceName = PSEXESVC, ImagePath = %SystemRoot%\\PSEXESVC.exe, Account = LocalSystem) & process tree (PSEXESVC.exe PID 5190 spawned by services.exe PID 628).",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Concierge Desk",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Offline Safe",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Wax Voucher",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1543.003"
    }
  },
  "ms-midnight-blizzard-oauth": {
    "briefing": {
      "scenarioId": "ms-midnight-blizzard-oauth",
      "sectionKey": "briefing",
      "sceneKind": "ad-midnight-blizz-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1110.003",
      "title": "Midnight Blizzard (APT29): OAuth App Persistence & EWS Exfiltration — Story-to-Technical Overview",
      "storyCue": "Imagine a patient espionage crew softly trying one spare key per evening from scattered neighborhood cars against a forgotten backyard testing shed that never got a modern two-factor deadbolt. Once inside the dusty shed, they discover an old cross-campus courier badge that was accidentally left with master mailroom powers, use it to print brand-new official courier badges inside the corporate headquarters, and silently haul out executive mailbags through the automated mail chute.",
      "technicalCue": "INITIAL ACCESS: LOW-VOLUME PASSWORD SPRAY ON LEGACY TEST TENANT -> PERSISTENCE: MALICIOUS OAUTH APP REGISTRATION & ROLE CONSENT -> EXFIL & IMPACT: OAUTH BEARER TOKEN EWS MAILBOX EXFILTRATION",
      "storyMappings": [
        {
          "storyTerm": "Trying one key per evening from scattered neighborhood cars",
          "technicalTerm": "Low-volume residential-proxy password spray evading IP lockouts and alerts",
          "tone": "amber"
        },
        {
          "storyTerm": "Forgotten backyard testing shed lacking a two-factor deadbolt",
          "technicalTerm": "Legacy non-production test tenant account without MFA enabled",
          "tone": "sky"
        },
        {
          "storyTerm": "Old cross-campus courier badge printing fresh headquarters badges",
          "technicalTerm": "Legacy OAuth test app with elevated permissions registering new privileged Service Principals",
          "tone": "rose"
        },
        {
          "storyTerm": "Hauling out executive mailbags through the automated mail chute",
          "technicalTerm": "Machine-to-machine client_credentials OAuth exfiltration via Exchange Web Services (EWS)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-midnight-blizz-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Trying one key per evening from…",
          "subtitle": "Low-volume residential-proxy password spray evading IP…",
          "tone": "amber"
        },
        {
          "id": "ad-midnight-blizz-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Forgotten backyard testing shed lacking…",
          "subtitle": "Legacy non-production test tenant account without MFA enabled",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. One Key",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "LOW-VOLUME PASSWORD SPRAY ON LEGACY TEST TENANT",
          "storyExcerpt": "Avoiding noisy repeated knocks that would wake the guard dogs, the spy crew tries only a handful of common passwords slowly across hundreds of ordinary household street addresses until a forgotten…",
          "technicalParallel": "Because each residential proxy IP sends only a tiny fraction of the total login attempts and stays well below the bad-password lockout threshold (e.g., 1 attempt per hour), traditional velocity-based…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Shed",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "MALICIOUS OAUTH APP REGISTRATION & ROLE CONSENT",
          "storyExcerpt": "Rummaging inside the unlocked testing shed, the spies uncover an abandoned automated courier badge that still carries wide building-wide authority into the main corporate tower, and immediately use it to…",
          "technicalParallel": "In Microsoft Entra ID, an application holding AppRoleAssignment.ReadWrite.All can call the Graph API (/servicePrincipals/{id}/appRoleAssignments) to self-assign full_access_as_app (Role ID…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Bay Out",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "OAUTH BEARER TOKEN EWS MAILBOX EXFILTRATION",
          "storyExcerpt": "Presenting their freshly minted machine-only courier badge straight at the automated postal bay, the spies bypass human lobby guards altogether and quietly wheel out corporate leadership correspondence…",
          "technicalParallel": "Because full_access_as_app is an application-level permission (Application Permission) rather than a delegated user permission (Delegated Permission), the OAuth Bearer token grants direct read/export…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Test Kiosk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Mailroom Bay",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Secret Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "ms-midnight-blizzard-oauth",
      "sectionKey": "step-1",
      "sceneKind": "ad-midnight-blizz-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Low-Volume Residential-Proxy Password Spray Against a Forgotten Legacy Test Account",
      "storyCue": "Avoiding noisy repeated knocks that would wake the guard dogs, the spy crew tries only a handful of common passwords slowly across hundreds of ordinary household street addresses until a forgotten back-lot testing shed with no second-factor padlock quietly clicks open.",
      "technicalCue": "T1110.003 · INITIAL ACCESS — To avoid triggering automated IP blocks or account lockouts, the attacker routes authentication requests through a rotating pool of residential proxy IPs (home internet routers in the same…",
      "storyMappings": [
        {
          "storyTerm": "Hundreds of ordinary household street addresses",
          "technicalTerm": "Distributed residential proxy IP network defeating IP reputation blocks",
          "tone": "amber"
        },
        {
          "storyTerm": "Trying only a handful of passwords slowly",
          "technicalTerm": "Low-and-slow password spray staying below Entra ID Smart Lockout thresholds",
          "tone": "sky"
        },
        {
          "storyTerm": "Forgotten back-lot testing shed with no second padlock",
          "technicalTerm": "Legacy non-production test tenant account lacking MFA enforcement",
          "tone": "rose"
        },
        {
          "storyTerm": "Gate sign-in book recording dispersed arrivals",
          "technicalTerm": "Microsoft Entra ID SigninLogs showing distributed ASNs hitting legacy accounts",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-midnight-blizz-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Hundreds of ordinary household street…",
          "subtitle": "Distributed residential proxy IP network defeating IP…",
          "tone": "amber"
        },
        {
          "id": "ad-midnight-blizz-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Trying only a handful of passwords slowly",
          "subtitle": "Low-and-slow password spray staying below Entra ID Smart…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Wake Dogs",
          "stageTag": "STEP 01 · SETUP",
          "title": "Hundreds of ordinary household street addresses",
          "storyExcerpt": "Avoiding noisy repeated knocks that would wake the guard dogs, the spy crew tries only a handful of common passwords slowly across hundreds of ordinary household street addresses until a…",
          "technicalParallel": "Because each residential proxy IP sends only a tiny fraction of the total login attempts and stays well below the bad-password lockout threshold (e.g., 1 attempt per hour), traditional velocity-based…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Only",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Trying only a handful of passwords slowly",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses trying only a handful of passwords slowly to advance toward forgotten back-lot testing shed with no second padlock.",
          "technicalParallel": "To avoid triggering automated IP blocks or account lockouts, the attacker routes authentication requests through a rotating pool of residential proxy IPs (home internet routers in the same country as the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Back-lot Shed",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Gate sign-in book recording dispersed arrivals",
          "storyExcerpt": "Behind the scenes, gate sign-in book recording dispersed arrivals captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Analyze Microsoft Entra ID SigninLogs (cloud identity telemetry capturing every authentication attempt, ASN, and MFA claim) for low-volume distributed password sprays rotating across residential proxy…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Test Kiosk",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Mailroom Bay",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Secret Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1110.003"
    },
    "step-2": {
      "scenarioId": "ms-midnight-blizzard-oauth",
      "sectionKey": "step-2",
      "sceneKind": "ad-midnight-blizz-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Abusing a Legacy Cross-Tenant OAuth App to Register New Privileged Service Principals",
      "storyCue": "Rummaging inside the unlocked testing shed, the spies uncover an abandoned automated courier badge that still carries wide building-wide authority into the main corporate tower, and immediately use it to mint shiny new official machine badges armed with full mailroom keys.",
      "technicalCue": "T1098.003 · PERSISTENCE — Inside the test environment, the attacker discovers a legacy OAuth test application whose Service Principal had been granted privileged directory permissions, specifically…",
      "storyMappings": [
        {
          "storyTerm": "Abandoned automated courier badge in the shed",
          "technicalTerm": "Legacy cross-tenant OAuth test application holding elevated Graph permissions",
          "tone": "amber"
        },
        {
          "storyTerm": "Minting shiny new official machine badges",
          "technicalTerm": "Creating new rogue Entra ID OAuth applications and Service Principals",
          "tone": "sky"
        },
        {
          "storyTerm": "Full mailroom master keys assigned to the new badges",
          "technicalTerm": "Granting full_access_as_app Exchange Web Services (EWS) application role",
          "tone": "rose"
        },
        {
          "storyTerm": "Stepping from the back shed into the main corporate tower",
          "technicalTerm": "Cross-tenant pivot from legacy test environment into production Microsoft 365",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-midnight-blizz-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Abandoned automated courier badge in the…",
          "subtitle": "Legacy cross-tenant OAuth test application holding elevated…",
          "tone": "amber"
        },
        {
          "id": "ad-midnight-blizz-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Minting shiny new official machine badges",
          "subtitle": "Creating new rogue Entra ID OAuth applications and Service…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Shed",
          "stageTag": "STEP 02 · SETUP",
          "title": "Abandoned automated courier badge in the shed",
          "storyExcerpt": "Rummaging inside the unlocked testing shed, the spies uncover an abandoned automated courier badge that still carries wide building-wide authority into the main corporate tower, and immediately…",
          "technicalParallel": "In Microsoft Entra ID, an application holding AppRoleAssignment.ReadWrite.All can call the Graph API (/servicePrincipals/{id}/appRoleAssignments) to self-assign full_access_as_app (Role ID…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses New",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Minting shiny new official machine badges",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses minting shiny new official machine badges to advance toward full mailroom master keys assigned to the new badges.",
          "technicalParallel": "Inside the test environment, the attacker discovers a legacy OAuth test application whose Service Principal had been granted privileged directory permissions, specifically AppRoleAssignment.ReadWrite.All…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Full Keys",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Stepping from the back shed into the main corporate…",
          "storyExcerpt": "Behind the scenes, stepping from the back shed into the main corporate tower captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Microsoft Entra Audit Logs: Add servicePrincipal, Add servicePrincipal credentials, and Add app role assignment to service principal for full_access_as_app…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Test Kiosk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Mailroom Bay",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Secret Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1098.003"
    },
    "step-3": {
      "scenarioId": "ms-midnight-blizzard-oauth",
      "sectionKey": "step-3",
      "sceneKind": "ad-midnight-blizz-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Exfiltrating Corporate Mailboxes via Exchange Web Services (EWS) Using OAuth Bearer Tokens",
      "storyCue": "Presenting their freshly minted machine-only courier badge straight at the automated postal bay, the spies bypass human lobby guards altogether and quietly wheel out corporate leadership correspondence without ever triggering a human sign-in prompt.",
      "technicalCue": "T1528 · EXFIL & IMPACT — Authenticating purely as the rogue OAuth application using grant_type=client_credentials (machine-to-machine authentication that uses the app’s client secret and never involves a human user…",
      "storyMappings": [
        {
          "storyTerm": "Machine-only courier badge skipping lobby guards",
          "technicalTerm": "OAuth 2.0 grant_type=client_credentials non-interactive daemon authentication",
          "tone": "amber"
        },
        {
          "storyTerm": "Automated postal bay",
          "technicalTerm": "Exchange Web Services (EWS) API accessed with full_access_as_app scope",
          "tone": "sky"
        },
        {
          "storyTerm": "Corporate leadership correspondence wheeled out",
          "technicalTerm": "Targeted exfiltration of senior executive and security team email mailboxes",
          "tone": "rose"
        },
        {
          "storyTerm": "Silent access surviving user password resets",
          "technicalTerm": "Persistent OAuth app secret credentials independent of human user accounts",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-midnight-blizz-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Machine-only courier badge skipping…",
          "subtitle": "OAuth 2.0 grant_type=client_credentials non-interactive daemon…",
          "tone": "amber"
        },
        {
          "id": "ad-midnight-blizz-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Automated postal bay",
          "subtitle": "Exchange Web Services (EWS) API accessed with…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Bay Out",
          "stageTag": "STEP 03 · SETUP",
          "title": "Machine-only courier badge skipping lobby guards",
          "storyExcerpt": "Presenting their freshly minted machine-only courier badge straight at the automated postal bay, the spies bypass human lobby guards altogether and quietly wheel out corporate leadership…",
          "technicalParallel": "Because full_access_as_app is an application-level permission (Application Permission) rather than a delegated user permission (Delegated Permission), the OAuth Bearer token grants direct read/export…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Bay",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Automated postal bay",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses automated postal bay to advance toward corporate leadership correspondence wheeled out.",
          "technicalParallel": "Authenticating purely as the rogue OAuth application using grant_type=client_credentials (machine-to-machine authentication that uses the app’s client secret and never involves a human user login or MFA…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. User",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Silent access surviving user password resets",
          "storyExcerpt": "Behind the scenes, silent access surviving user password resets captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Microsoft Purview Unified Audit Log (MailItemsAccessed / EWS) correlated with Entra Service Principal sign-ins using AppId holding full_access_as_app.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Test Kiosk",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Mailroom Bay",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Secret Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1528"
    }
  },
  "ms-volt-typhoon-lotl": {
    "briefing": {
      "scenarioId": "ms-volt-typhoon-lotl",
      "sectionKey": "briefing",
      "sceneKind": "ad-volt-typhoon-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1047",
      "title": "Volt Typhoon: Living-off-the-Land ntdsutil IFM & netsh Portproxy — Story-to-Technical Overview",
      "storyCue": "Imagine a patient industrial spy who never carries foreign lockpicks or masks across the border. First, the spy blends in by riding ordinary neighborhood delivery vans right up to the factory gate; next, the spy uses the factory own official backup photocopier to copy the locked master employee vault ledger cleanly; finally, the spy props silent mirror-boxes inside a hallway utility closet to bounce stolen parcels back out through standard building plumbing.",
      "technicalCue": "EXECUTION: HANDS-ON-KEYBOARD WMI DISCOVERY & LATERAL EXEC -> CREDENTIAL ACCESS: OFFLINE NTDS.DIT EXTRACTION VIA NTDSUTIL IFM -> LATERAL & C2: MULTI-HOP INTERNAL RELAY VIA NETSH PORTPROXY",
      "storyMappings": [
        {
          "storyTerm": "Riding ordinary neighborhood delivery vans to the gate",
          "technicalTerm": "Proxying connections through compromised KV-Botnet SOHO home and office routers",
          "tone": "amber"
        },
        {
          "storyTerm": "Using the factory own official backup photocopier",
          "technicalTerm": "Built-in ntdsutil.exe \"ac i ntds\" \"ifm\" dumping locked ntds.dit without malware",
          "tone": "sky"
        },
        {
          "storyTerm": "Silent mirror-boxes wired inside a hallway closet",
          "technicalTerm": "Windows netsh interface portproxy multi-hop traffic relay (Sysmon EventID 13)",
          "tone": "rose"
        },
        {
          "storyTerm": "Carrying zero foreign lockpicks",
          "technicalTerm": "Pure Living-off-the-Land (LotL) execution using signed native Windows binaries",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-volt-typhoon-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Riding ordinary neighborhood delivery…",
          "subtitle": "Proxying connections through compromised KV-Botnet SOHO home…",
          "tone": "amber"
        },
        {
          "id": "ad-volt-typhoon-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Using the factory own official backup…",
          "subtitle": "Built-in ntdsutil.exe \"ac i ntds\" \"ifm\" dumping locked…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Vans",
          "stageTag": "STAGE 01 · EXECUTION",
          "title": "HANDS-ON-KEYBOARD WMI DISCOVERY & LATERAL EXEC",
          "storyExcerpt": "Instead of arriving in a marked foreign truck that gate guards instantly stop, the spy hops through a chain of ordinary local neighborhood vans and issues a quiet remote maintenance instruction over the…",
          "technicalParallel": "When wmic.exe connects over TCP/135 (RPC Endpoint Mapper) and dynamic DCOM ports to CORP-DC01 (10.10.0.5), the remote WMI provider host (WmiPrvSE.exe) spawns cmd.exe / ntdsutil.exe (PID 6412) under the…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Shut",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "OFFLINE NTDS.DIT EXTRACTION VIA NTDSUTIL IFM",
          "storyExcerpt": "Because the master password ledger stays clamped shut under heavy lock while the office is open, the spy simply flips on the office own official emergency migration photocopier, cleanly copying both the…",
          "technicalParallel": "The ifm (Install From Media, originally designed so administrators could promote a new Domain Controller from a backup folder) command in ntdsutil.exe (PID 6412) automatically invokes vssvc.exe to…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Keep Ever",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "MULTI-HOP INTERNAL RELAY VIA NETSH PORTPROXY",
          "storyExcerpt": "To keep moving quietly through internal corridors without ever installing foreign radio gear, the spy configures a built-in hallway forwarding mirror on an intermediate jump desk that bounces traffic…",
          "technicalParallel": "When netsh.exe (PID 6890) executes the portproxy add v4tov4 command, the Windows kernel/service configuration writes the forwarding rule into…",
          "accentHex": "#F59E0B",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Relay Gate",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Vault Copier",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Quiet Path",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "ms-volt-typhoon-lotl",
      "sectionKey": "step-1",
      "sceneKind": "ad-volt-typhoon-step-1",
      "stageBadge": "STEP #1 · EXECUTION",
      "title": "Routing Through KV-Botnet SOHO Routers & Lateral WMI Execution to CORP-DC01",
      "storyCue": "Instead of arriving in a marked foreign truck that gate guards instantly stop, the spy hops through a chain of ordinary local neighborhood vans and issues a quiet remote maintenance instruction over the building standard management intercom straight to the main vault office.",
      "technicalCue": "T1047 · EXECUTION — Instead of connecting from a rented cloud VPS that threat-intelligence feeds would block, the attacker connects through a compromised small-office/home-office (SOHO) router in the same…",
      "storyMappings": [
        {
          "storyTerm": "Chain of ordinary local neighborhood vans",
          "technicalTerm": "KV-Botnet proxy mesh of compromised small-office/home-office (SOHO) routers",
          "tone": "amber"
        },
        {
          "storyTerm": "Standard management intercom",
          "technicalTerm": "Windows Management Instrumentation (WMI / WmiPrvSE.exe) lateral execution",
          "tone": "sky"
        },
        {
          "storyTerm": "Main vault office",
          "technicalTerm": "Active Directory Domain Controller CORP-DC01 (10.10.0.5)",
          "tone": "rose"
        },
        {
          "storyTerm": "Quiet remote maintenance instruction",
          "technicalTerm": "WmiPrvSE.exe spawning cmd.exe /Q /c ntdsutil \"ac i ntds\" \"ifm\"",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-volt-typhoon-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Chain of ordinary local neighborhood vans",
          "subtitle": "KV-Botnet proxy mesh of compromised small-office/home-office…",
          "tone": "amber"
        },
        {
          "id": "ad-volt-typhoon-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Standard management intercom",
          "subtitle": "Windows Management Instrumentation (WMI / WmiPrvSE.exe)…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Vans",
          "stageTag": "STEP 01 · SETUP",
          "title": "Chain of ordinary local neighborhood vans",
          "storyExcerpt": "Instead of arriving in a marked foreign truck that gate guards instantly stop, the spy hops through a chain of ordinary local neighborhood vans and issues a quiet remote maintenance instruction…",
          "technicalParallel": "When wmic.exe connects over TCP/135 (RPC Endpoint Mapper) and dynamic DCOM ports to CORP-DC01 (10.10.0.5), the remote WMI provider host (WmiPrvSE.exe) spawns cmd.exe / ntdsutil.exe (PID 6412) under the…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Main",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Standard management intercom",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses standard management intercom to advance toward main vault office.",
          "technicalParallel": "Instead of connecting from a rented cloud VPS that threat-intelligence feeds would block, the attacker connects through a compromised small-office/home-office (SOHO) router in the same geographic region…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Main",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Quiet remote maintenance instruction",
          "storyExcerpt": "Behind the scenes, quiet remote maintenance instruction captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Correlate CISA AA24-038A indicators with Sysmon EventID 1 (Process Creation recording exact parent-child lineage and arguments) on CORP-DC01 showing WmiPrvSE.exe spawning cmd.exe /Q /c ntdsutil \"ac i…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Relay Gate",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Vault Copier",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Quiet Path",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1047"
    },
    "step-2": {
      "scenarioId": "ms-volt-typhoon-lotl",
      "sectionKey": "step-2",
      "sceneKind": "ad-volt-typhoon-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Using Built-in ntdsutil.exe (\"ifm\") to Dump Every Domain Password Hash (ESENT Event ID 325)",
      "storyCue": "Because the master password ledger stays clamped shut under heavy lock while the office is open, the spy simply flips on the office own official emergency migration photocopier, cleanly copying both the ledger book and its matching key drawer into a neat staging tray.",
      "technicalCue": "T1003.003 · CREDENTIAL ACCESS — Active Directory exclusively locks C:\\Windows\\NTDS\\ntds.dit (the master database file containing the password hashes of every employee, service, and Domain Admin in the company) while the…",
      "storyMappings": [
        {
          "storyTerm": "Master password ledger clamped shut during business hours",
          "technicalTerm": "Exclusively locked Active Directory database C:\\Windows\\NTDS\\ntds.dit",
          "tone": "amber"
        },
        {
          "storyTerm": "Official emergency migration photocopier",
          "technicalTerm": "Signed Windows utility ntdsutil.exe invoked with Install From Media (ifm) mode",
          "tone": "sky"
        },
        {
          "storyTerm": "Matching key drawer copied alongside the ledger",
          "technicalTerm": "SYSTEM registry hive saved alongside ntds.dit to decrypt every domain hash",
          "tone": "rose"
        },
        {
          "storyTerm": "Built-in engine stamp left in the copier log",
          "technicalTerm": "ESENT Application Event logs documenting snapshot creation and database streaming",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-volt-typhoon-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Master password ledger clamped shut…",
          "subtitle": "Exclusively locked Active Directory database…",
          "tone": "amber"
        },
        {
          "id": "ad-volt-typhoon-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Official emergency migration photocopier",
          "subtitle": "Signed Windows utility ntdsutil.exe invoked with Install From…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Shut",
          "stageTag": "STEP 02 · SETUP",
          "title": "Master password ledger clamped shut during business…",
          "storyExcerpt": "Because the master password ledger stays clamped shut under heavy lock while the office is open, the spy simply flips on the office own official emergency migration photocopier, cleanly copying…",
          "technicalParallel": "The ifm (Install From Media, originally designed so administrators could promote a new Domain Controller from a backup folder) command in ntdsutil.exe (PID 6412) automatically invokes vssvc.exe to…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Key",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Official emergency migration photocopier",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses official emergency migration photocopier to advance toward matching key drawer copied alongside the ledger.",
          "technicalParallel": "Active Directory exclusively locks C:\\Windows\\NTDS\\ntds.dit (the master database file containing the password hashes of every employee, service, and Domain Admin in the company) while the Domain…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Log",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Built-in engine stamp left in the copier log",
          "storyExcerpt": "Behind the scenes, built-in engine stamp left in the copier log captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CISA AA24-038A: Application Log ESENT EventID 325 (\"Database engine created a new database C:\\Windows\\Temp\\tmp_ad\\Active Directory\\ntds.dit\") correlated with Sysmon EventID 1 for…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Relay Gate",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Vault Copier",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Quiet Path",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1003.003"
    },
    "step-3": {
      "scenarioId": "ms-volt-typhoon-lotl",
      "sectionKey": "step-3",
      "sceneKind": "ad-volt-typhoon-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "Multi-Hop Internal Relay via netsh interface portproxy (Sysmon Event ID 13)",
      "storyCue": "To keep moving quietly through internal corridors without ever installing foreign radio gear, the spy configures a built-in hallway forwarding mirror on an intermediate jump desk that bounces traffic silently from inner rooms straight out to the external neighborhood van.",
      "technicalCue": "T1090.001 · LATERAL & C2 — To maintain stealthy multi-hop access and relay staged archives out through the jump server SRV-MGMT-01 (10.10.15.22), the attacker runs C:\\Windows\\System32\\netsh.exe (PID 6890): netsh…",
      "storyMappings": [
        {
          "storyTerm": "Built-in hallway forwarding mirror",
          "technicalTerm": "Windows netsh interface portproxy add v4tov4 TCP relay rule",
          "tone": "amber"
        },
        {
          "storyTerm": "Intermediate jump desk",
          "technicalTerm": "Internal management jump host SRV-MGMT-01 (10.10.15.20)",
          "tone": "sky"
        },
        {
          "storyTerm": "Permanent brass label bolted inside the control panel",
          "technicalTerm": "Registry write under HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp",
          "tone": "rose"
        },
        {
          "storyTerm": "Silent alarm noting the panel change",
          "technicalTerm": "Sysmon EventID 13 (RegistryValueSet) capturing unauthorized PortProxy configuration",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-volt-typhoon-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Built-in hallway forwarding mirror",
          "subtitle": "Windows netsh interface portproxy add v4tov4 TCP relay rule",
          "tone": "amber"
        },
        {
          "id": "ad-volt-typhoon-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Intermediate jump desk",
          "subtitle": "Internal management jump host SRV-MGMT-01 (10.10.15.20)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Keep Ever",
          "stageTag": "STEP 03 · SETUP",
          "title": "Built-in hallway forwarding mirror",
          "storyExcerpt": "To keep moving quietly through internal corridors without ever installing foreign radio gear, the spy configures a built-in hallway forwarding mirror on an intermediate jump desk that bounces…",
          "technicalParallel": "When netsh.exe (PID 6890) executes the portproxy add v4tov4 command, the Windows kernel/service configuration writes the forwarding rule into…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Jump Desk",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Intermediate jump desk",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses intermediate jump desk to advance toward permanent brass label bolted inside the control panel.",
          "technicalParallel": "To maintain stealthy multi-hop access and relay staged archives out through the jump server SRV-MGMT-01 (10.10.15.22), the attacker runs C:\\Windows\\System32\\netsh.exe (PID 6890): netsh interface…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Keep Ever",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Silent alarm noting the panel change",
          "storyExcerpt": "Behind the scenes, silent alarm noting the panel change captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CISA AA24-038A & Sysmon EventID 13 (RegistryValueSet): ProcessId = 6890 (netsh.exe) setting TargetObject = HKLM\\SYSTEM\\CurrentControlSet\\Services\\PortProxy\\v4tov4\\tcp\\0.0.0.0/8443 to…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Relay Gate",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Vault Copier",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Quiet Path",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1090.001"
    }
  },
  "nopac-samaccountname-cve-2021-42278-42287": {
    "briefing": {
      "scenarioId": "nopac-samaccountname-cve-2021-42278-42287",
      "sectionKey": "briefing",
      "sceneKind": "ad-nopac-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1068",
      "title": "Active Directory \"noPac\": sAMAccountName Spoofing & KDC Impersonation — Story-to-Technical Overview",
      "storyCue": "Imagine a government passport office where any regular clerk is allowed to create up to ten trainee badges. A crafty clerk creates a blank trainee badge, rubs off the trainee symbol so the badge name reads identically to the Chief Director name, grabs an entry voucher under that name, restores the trainee name, and then hands the voucher to a confused back-office clerk who cannot find the old name and blindly assumes the voucher belongs to the real Chief Director.",
      "technicalCue": "CREDENTIAL ACCESS: MACHINE ACCOUNT CREATION & SAMACCOUNTNAME SPOOFING (CVE-2021-42278) -> CREDENTIAL ACCESS: RENAME BACK & KDC S4U2SELF \"$\" FALLBACK (CVE-2021-42287) -> CREDENTIAL ACCESS: DOMAIN CONTROLLER IMPERSONATION & NTDS.DIT DCSYNC",
      "storyMappings": [
        {
          "storyTerm": "Creating a trainee badge and rubbing off the trainee symbol",
          "technicalTerm": "Abusing ms-DS-MachineAccountQuota to rename sAMAccountName to CORP-DC01 without trailing $ (CVE-2021-42278)",
          "tone": "amber"
        },
        {
          "storyTerm": "Restoring the trainee name and confusing the back-office clerk",
          "technicalTerm": "Renaming back to FAKEPC01$ and triggering KDC S4U2self trailing-$ fallback (CVE-2021-42287)",
          "tone": "sky"
        },
        {
          "storyTerm": "Confused clerk handing over a Chief Director master pass",
          "technicalTerm": "KDC issuing a privileged cifs/CORP-DC01 service ticket containing DC PAC groups",
          "tone": "rose"
        },
        {
          "storyTerm": "Emptying the national registry vault with the forged pass",
          "technicalTerm": "Executing DCSync against CORP-DC01.corp.local to dump all domain hashes",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-nopac-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Creating a trainee badge and rubbing off…",
          "subtitle": "Abusing ms-DS-MachineAccountQuota to rename sAMAccountName to…",
          "tone": "amber"
        },
        {
          "id": "ad-nopac-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Restoring the trainee name and confusing…",
          "subtitle": "Renaming back to FAKEPC01$ and triggering KDC S4U2self…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Rule Ten",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "MACHINE ACCOUNT CREATION & SAMACCOUNTNAME SPOOFING (CVE-2021-42278)",
          "storyExcerpt": "Using a generous default office rule that lets any standard employee register up to ten helper badges, the intruder registers a fresh machine badge, strips away its trailing helper mark so its label…",
          "technicalParallel": "Why didn’t Active Directory block the rename as a duplicate name?",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Back",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "RENAME BACK & KDC S4U2SELF \"$\" FALLBACK (CVE-2021-42287)",
          "storyExcerpt": "Before presenting that lobby voucher, the intruder hastily renames their helper badge back to a harmless name so no badge named CORP-DC01 exists anymore. When the ticket window searches for CORP-DC01 and…",
          "technicalParallel": "Why is CVE-2021-42287 so critical? Because the KDC validates the incoming TGT using the attacker’s key, but encrypts the outgoing S4U2self TGS ticket (and its high-privilege Domain Admin PAC) for the…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Pass",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "DOMAIN CONTROLLER IMPERSONATION & NTDS.DIT DCSYNC",
          "storyExcerpt": "Walking directly up to the master vault counter with the genuinely stamped Chief Controller pass in hand, the intruder invokes the emergency vault-sync command and walks away with every secret seal in…",
          "technicalParallel": "From start to finish, tools like noPac.exe and sam_the_admin.py complete all three steps automatically in under 3 seconds.",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Badge Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ticket Press",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Name Swap",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "nopac-samaccountname-cve-2021-42278-42287",
      "sectionKey": "step-1",
      "sceneKind": "ad-nopac-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Creating a Machine Account & Spoofing the DC’s sAMAccountName Without $ (CVE-2021-42278)",
      "storyCue": "Using a generous default office rule that lets any standard employee register up to ten helper badges, the intruder registers a fresh machine badge, strips away its trailing helper mark so its label matches the Chief Vault Controller exactly, and collects a freshly stamped lobby voucher.",
      "technicalCue": "T1068 · CREDENTIAL ACCESS — By default in Active Directory, the attribute ms-DS-MachineAccountQuota is set to 10 (meaning any standard domain user can create up to 10 new computer accounts over LDAP without needing…",
      "storyMappings": [
        {
          "storyTerm": "Generous rule allowing ten helper badges",
          "technicalTerm": "Default Active Directory ms-DS-MachineAccountQuota attribute value of 10",
          "tone": "amber"
        },
        {
          "storyTerm": "Stripping the trailing helper mark to match the Chief Controller",
          "technicalTerm": "Renaming machine account sAMAccountName to CORP-DC01 without trailing $ (CVE-2021-42278)",
          "tone": "sky"
        },
        {
          "storyTerm": "Collecting a freshly stamped lobby voucher",
          "technicalTerm": "Requesting a valid Kerberos TGT issued for the spoofed name CORP-DC01",
          "tone": "rose"
        },
        {
          "storyTerm": "Missing clerk check on the badge suffix",
          "technicalTerm": "Lack of AD enforcement requiring computer accounts to retain a trailing $",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-nopac-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Generous rule allowing ten helper badges",
          "subtitle": "Default Active Directory ms-DS-MachineAccountQuota attribute…",
          "tone": "amber"
        },
        {
          "id": "ad-nopac-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Stripping the trailing helper mark to…",
          "subtitle": "Renaming machine account sAMAccountName to CORP-DC01 without…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Rule Ten",
          "stageTag": "STEP 01 · SETUP",
          "title": "Generous rule allowing ten helper badges",
          "storyExcerpt": "Using a generous default office rule that lets any standard employee register up to ten helper badges, the intruder registers a fresh machine badge, strips away its trailing helper mark so its…",
          "technicalParallel": "Why didn’t Active Directory block the rename as a duplicate name?",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Mark",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Stripping the trailing helper mark to match the…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses stripping the trailing helper mark to match the chief controller to advance toward collecting a freshly stamped lobby voucher.",
          "technicalParallel": "By default in Active Directory, the attribute ms-DS-MachineAccountQuota is set to 10 (meaning any standard domain user can create up to 10 new computer accounts over LDAP without needing administrator…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Rule Lets",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Missing clerk check on the badge suffix",
          "storyExcerpt": "Behind the scenes, missing clerk check on the badge suffix captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Splunk SURGe & CrowdStrike: Windows Security EventID 4741 (computer created) followed by EventID 4781 (OldTargetUserName ending in $ renamed to NewTargetUserName without $).",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Badge Desk",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ticket Press",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Name Swap",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1068"
    },
    "step-2": {
      "scenarioId": "nopac-samaccountname-cve-2021-42278-42287",
      "sectionKey": "step-2",
      "sceneKind": "ad-nopac-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Renaming the Account Back & Triggering the KDC S4U2self $ Fallback (CVE-2021-42287)",
      "storyCue": "Before presenting that lobby voucher, the intruder hastily renames their helper badge back to a harmless name so no badge named CORP-DC01 exists anymore. When the ticket window searches for CORP-DC01 and finds nothing, its built-in fallback rule automatically tacks a dollar sign onto the search and mistakenly pulls out the real Chief Controller master privileges instead.",
      "technicalCue": "T1558.001 · CREDENTIAL ACCESS — Holding the valid TGT for \"CORP-DC01\", the attacker renames their machine account back to FAKEPC01$ over LDAP (so no account named \"CORP-DC01\" exists in Active Directory anymore) and sends a…",
      "storyMappings": [
        {
          "storyTerm": "Renaming the helper badge back to a harmless label",
          "technicalTerm": "Renaming sAMAccountName back to FAKEPC01$ over LDAP while holding the TGT",
          "tone": "amber"
        },
        {
          "storyTerm": "Ticket window failing to find the exact name",
          "technicalTerm": "KDC S4U2self lookup failing to locate CORP-DC01 during service ticket issuance",
          "tone": "sky"
        },
        {
          "storyTerm": "Fallback rule tacking a dollar sign onto the search",
          "technicalTerm": "CVE-2021-42287 KDC fallback resolving CORP-DC01$ (the real Domain Controller)",
          "tone": "rose"
        },
        {
          "storyTerm": "Issuing a real Chief Controller pass to an impostor",
          "technicalTerm": "Forged cifs/CORP-DC01 service ticket stamped with Domain Controller PAC authority",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-nopac-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Renaming the helper badge back to a…",
          "subtitle": "Renaming sAMAccountName back to FAKEPC01$ over LDAP while…",
          "tone": "amber"
        },
        {
          "id": "ad-nopac-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Ticket window failing to find the exact…",
          "subtitle": "KDC S4U2self lookup failing to locate CORP-DC01 during service…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Back",
          "stageTag": "STEP 02 · SETUP",
          "title": "Renaming the helper badge back to a harmless label",
          "storyExcerpt": "Before presenting that lobby voucher, the intruder hastily renames their helper badge back to a harmless name so no badge named CORP-DC01 exists anymore.",
          "technicalParallel": "Why is CVE-2021-42287 so critical? Because the KDC validates the incoming TGT using the attacker’s key, but encrypts the outgoing S4U2self TGS ticket (and its high-privilege Domain Admin PAC) for the…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Find Name",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Ticket window failing to find the exact name",
          "storyExcerpt": "When the ticket window searches for CORP-DC01 and finds nothing, its built-in fallback rule automatically tacks a dollar sign onto the search and mistakenly pulls out the real Chief Controller…",
          "technicalParallel": "Holding the valid TGT for \"CORP-DC01\", the attacker renames their machine account back to FAKEPC01$ over LDAP (so no account named \"CORP-DC01\" exists in Active Directory anymore) and sends a Kerberos…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Rule Sign",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Issuing a real Chief Controller pass to an impostor",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across issuing a real chief controller pass to an impostor while locking down fallback rule tacking a dollar sign onto the search.",
          "technicalParallel": "Documented by Microsoft & Splunk SURGe: Windows Security EventID 4769 (S4U2self TGS request for cifs/CORP-DC01 immediately following EventID 4781).",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Badge Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ticket Press",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Name Swap",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1558.001"
    },
    "step-3": {
      "scenarioId": "nopac-samaccountname-cve-2021-42278-42287",
      "sectionKey": "step-3",
      "sceneKind": "ad-nopac-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Presenting the Forged cifs/CORP-DC01 Ticket to Execute DCSync",
      "storyCue": "Walking directly up to the master vault counter with the genuinely stamped Chief Controller pass in hand, the intruder invokes the emergency vault-sync command and walks away with every secret seal in the entire organization in under thirty seconds.",
      "technicalCue": "T1003.006 · CREDENTIAL ACCESS — Presenting the forged cifs/CORP-DC01.corp.local Kerberos service ticket (which carries a valid Privilege Attribute Certificate for the Domain Administrator signed by the KDC itself), the…",
      "storyMappings": [
        {
          "storyTerm": "Genuinely stamped Chief Controller pass",
          "technicalTerm": "Valid cifs/CORP-DC01.corp.local Kerberos TGS carrying Enterprise Domain Controller PAC",
          "tone": "amber"
        },
        {
          "storyTerm": "Invoking the emergency vault-sync command",
          "technicalTerm": "Executing DRSUAPI DCSync replication directly against CORP-DC01",
          "tone": "sky"
        },
        {
          "storyTerm": "Every secret seal in the organization",
          "technicalTerm": "Domain krbtgt and Administrator NTLM and Kerberos AES-256 keys",
          "tone": "rose"
        },
        {
          "storyTerm": "Zero prior privileged access needed",
          "technicalTerm": "Full unprivileged-user to Domain Admin escalation in seconds",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-nopac-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Genuinely stamped Chief Controller pass",
          "subtitle": "Valid cifs/CORP-DC01.corp.local Kerberos TGS carrying…",
          "tone": "amber"
        },
        {
          "id": "ad-nopac-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Invoking the emergency vault-sync command",
          "subtitle": "Executing DRSUAPI DCSync replication directly against CORP-DC01",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass",
          "stageTag": "STEP 03 · SETUP",
          "title": "Genuinely stamped Chief Controller pass",
          "storyExcerpt": "Walking directly up to the master vault counter with the genuinely stamped Chief Controller pass in hand, the intruder invokes the emergency vault-sync command and walks away with every secret…",
          "technicalParallel": "From start to finish, tools like noPac.exe and sam_the_admin.py complete all three steps automatically in under 3 seconds.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Seal",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Invoking the emergency vault-sync command",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses invoking the emergency vault-sync command to advance toward every secret seal in the organization.",
          "technicalParallel": "Presenting the forged cifs/CORP-DC01.corp.local Kerberos service ticket (which carries a valid Privilege Attribute Certificate for the Domain Administrator signed by the KDC itself), the attacker…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Seal",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Zero prior privileged access needed",
          "storyExcerpt": "Behind the scenes, zero prior privileged access needed captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CISA & CrowdStrike advisories: Windows Security EventID 4662 (DS-Replication-Get-Changes-All) from a workstation IP.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Badge Desk",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ticket Press",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Name Swap",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1003.006"
    },
    "memory-forensics": {
      "scenarioId": "nopac-samaccountname-cve-2021-42278-42287",
      "sectionKey": "memory-forensics",
      "sceneKind": "ad-nopac-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1068",
      "title": "Active Directory \"noPac\": sAMAccountName Spoofing & KDC Impersonation — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of badge desk beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: kdcsvc.dll (S4U2self Lookup) (kdcsvc.dll (KDC S4U2self Ticket Context) [RW-])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of kdcsvc.dll (S4U2self Lookup)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007FF92A180000 (RW-, 32 KB) · kdcsvc.dll (KDC S4U2self Ticket Context)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against kdcsvc.dll (S4U2self Lookup) (PID 712)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "KDC S4U2self fallback resolving the deleted/renamed client name \"CORP-DC01\" to the real Domain Controller account…",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-nopac-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of kdcsvc.dll…",
          "tone": "sky"
        },
        {
          "id": "ad-nopac-memory-xray-right",
          "tag": "LIVE MEMORY · RW-",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007FF92A180000 (RW-, 32 KB) · kdcsvc.dll (KDC S4U2self…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Clean Baseline",
          "stageTag": "MEMORY 01 · BASELINE",
          "title": "Inspect Expected Clean Blueprint",
          "storyExcerpt": "On the left rests the official untouched blueprint showing every compartment sealed in its normal factory order.",
          "technicalParallel": "Baseline kdcsvc.dll (S4U2self Lookup) loads standard signed read-only and read-execute sections with zero injected artifacts.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tampered Pages",
          "stageTag": "MEMORY 02 · TAMPERING",
          "title": "Golden Scanner Sweeps Both Chambers Side by Side",
          "storyExcerpt": "The overhead golden scanner glides across both chambers, illuminating a glowing crimson block hidden inside the live compartment.",
          "technicalParallel": "Memory inspection flags 0x00007FF92A180000 (RW-, 32 KB) containing kdcsvc.dll (KDC S4U2self Ticket Context).",
          "accentHex": "#FACC15",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. X-Ray Diff",
          "stageTag": "MEMORY 03 · DIFF",
          "title": "Side-by-Side Comparison Proves Runtime Tampering",
          "storyExcerpt": "Even though the outer cover never raised a surface alarm, comparing both chambers side by side proves the interior was altered in motion.",
          "technicalParallel": "Forensic triage of PID 712 confirms injected region: KDC S4U2self fallback resolving the deleted/renamed client name \"CORP-DC01\" to the real Domain Controller account \"CORP-DC01$\".",
          "accentHex": "#F43F5E",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.1,
            5.9,
            16
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Clean Baseline",
          "position": [
            -6.4,
            4,
            8.6
          ],
          "target": [
            -4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Live Memory",
          "position": [
            6.4,
            4,
            8.6
          ],
          "target": [
            4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Gantry",
          "position": [
            0,
            8.2,
            8.2
          ],
          "target": [
            0,
            2.1,
            -0.2
          ]
        }
      ]
    }
  },
  "printnightmare-spooler-cve-2021-34527": {
    "briefing": {
      "scenarioId": "printnightmare-spooler-cve-2021-34527",
      "sectionKey": "briefing",
      "sceneKind": "ad-printnightmare-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1210",
      "title": "Windows \"PrintNightmare\": RpcAddPrinterDriverEx Remote SYSTEM RCE — Story-to-Technical Overview",
      "storyCue": "Imagine a busy office tower whose central print-shop foreman carries master keys to every room in the building. Any ordinary worker can walk up to the print shop and submit a new printer driver request; by attaching a special skip-verification sticker and pointing the parts-configuration line to a remote warehouse outside the building, the worker tricks the foreman into fetching a rigged roller straight from the outsider warehouse and spinning it inside the master print room with full building authority.",
      "technicalCue": "LATERAL & C2: RPCADDPRINTERDRIVEREX AUTH BYPASS VIA 0x8000 FLAG (CVE-2021-34527) -> PERSISTENCE: UNC DRIVER COPY & SYSTEM DLL LOAD IN SPOOLSV.EXE -> DEFENSE EVASION: DLLMAIN SYSTEM EXECUTION & DOMAIN CONTROLLER COMPROMISE",
      "storyMappings": [
        {
          "storyTerm": "Print-shop foreman carrying master keys to every room",
          "technicalTerm": "Windows Print Spooler service (spoolsv.exe) running as NT AUTHORITY\\SYSTEM",
          "tone": "amber"
        },
        {
          "storyTerm": "Special skip-verification sticker on the request form",
          "technicalTerm": "APD_INSTALL_WARNED_DRIVER (0x8000) flag bypassing ValidateObjectAccess() (CVE-2021-34527)",
          "tone": "sky"
        },
        {
          "storyTerm": "Pointing the parts line to an outsider warehouse",
          "technicalTerm": "DRIVER_CONTAINER pConfigFile pointing to an attacker UNC SMB share (evil.dll)",
          "tone": "rose"
        },
        {
          "storyTerm": "Foreman spinning the rigged roller inside the print room",
          "technicalTerm": "spoolsv.exe invoking LoadLibraryW() and executing DllMain as SYSTEM",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-printnightmare-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Print-shop foreman carrying master keys…",
          "subtitle": "Windows Print Spooler service (spoolsv.exe) running as NT…",
          "tone": "amber"
        },
        {
          "id": "ad-printnightmare-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Special skip-verification sticker on the…",
          "subtitle": "APD_INSTALL_WARNED_DRIVER (0x8000) flag bypassing…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Keys Room",
          "stageTag": "STAGE 01 · LATERAL & C2",
          "title": "RPCADDPRINTERDRIVEREX AUTH BYPASS VIA 0x8000 FLAG (CVE-2021-34527)",
          "storyExcerpt": "Approaching the print-shop request window with an ordinary low-rank employee badge, the intruder checks an obscure internal waiver box on the printer installation slip that accidentally causes the…",
          "technicalParallel": "Even after Microsoft patched the legacy MS-RPRN interface in June 2021 (CVE-2021-1675), researchers discovered that the asynchronous RPC interface MS-PAR (RpcAsyncAddPrinterDriver) had the exact same…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Top Line",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "UNC DRIVER COPY & SYSTEM DLL LOAD IN SPOOLSV.EXE",
          "storyExcerpt": "On the driver installation form, the intruder pairs a legitimate factory manual on the top line with a sneaky external warehouse address on the configuration-file line, tricking the trusting foreman into…",
          "technicalParallel": "When an exploit script calls RpcAddPrinterDriverEx multiple times, Windows moves the previous copy of the DLL into backup numbered subfolders like C:\\Windows\\System32\\spool\\drivers\\x64\\3\\Old\\1\\evil.dll…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Test",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "DLLMAIN SYSTEM EXECUTION & DOMAIN CONTROLLER COMPROMISE",
          "storyExcerpt": "The instant the print foreman snaps the copied roller into the master press to test its alignment, the rigged mechanism springs to life right inside the foreman own master-keyed room, handing the…",
          "technicalParallel": "Why do security guides recommend disabling the Print Spooler service completely on Domain Controllers?",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Print Spooler",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Master Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Driver Tray",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "printnightmare-spooler-cve-2021-34527",
      "sectionKey": "step-1",
      "sceneKind": "ad-printnightmare-step-1",
      "stageBadge": "STEP #1 · LATERAL & C2",
      "title": "Passing APD_INSTALL_WARNED_DRIVER (0x8000) to Skip ValidateObjectAccess() (CVE-2021-34527)",
      "storyCue": "Approaching the print-shop request window with an ordinary low-rank employee badge, the intruder checks an obscure internal waiver box on the printer installation slip that accidentally causes the foreman to skip checking whether the requester actually has manager clearance.",
      "technicalCue": "T1210 · LATERAL & C2 — As reverse-engineered by Rapid7 and security researchers, the Windows Print Spooler (spoolsv.exe, which runs by default as NT AUTHORITY\\SYSTEM on all Windows workstations, member servers, and…",
      "storyMappings": [
        {
          "storyTerm": "Print-shop request window",
          "technicalTerm": "MS-RPRN / MS-PAR RpcAddPrinterDriverEx() remote RPC interface on spoolsv.exe",
          "tone": "amber"
        },
        {
          "storyTerm": "Obscure internal waiver box on the slip",
          "technicalTerm": "APD_INSTALL_WARNED_DRIVER (0x8000) flag passed in dwFileCopyFlags",
          "tone": "sky"
        },
        {
          "storyTerm": "Skipping the manager clearance check",
          "technicalTerm": "CVE-2021-34527 logic flaw bypassing ValidateObjectAccess() authorization",
          "tone": "rose"
        },
        {
          "storyTerm": "Ordinary low-rank employee badge",
          "technicalTerm": "Standard authenticated domain user remotely escalating to Domain Controller SYSTEM",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-printnightmare-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Print-shop request window",
          "subtitle": "MS-RPRN / MS-PAR RpcAddPrinterDriverEx() remote RPC interface…",
          "tone": "amber"
        },
        {
          "id": "ad-printnightmare-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Obscure internal waiver box on the slip",
          "subtitle": "APD_INSTALL_WARNED_DRIVER (0x8000) flag passed in…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Low-rank Box",
          "stageTag": "STEP 01 · SETUP",
          "title": "Print-shop request window",
          "storyExcerpt": "Approaching the print-shop request window with an ordinary low-rank employee badge, the intruder checks an obscure internal waiver box on the printer installation slip that accidentally causes…",
          "technicalParallel": "Even after Microsoft patched the legacy MS-RPRN interface in June 2021 (CVE-2021-1675), researchers discovered that the asynchronous RPC interface MS-PAR (RpcAsyncAddPrinterDriver) had the exact same…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Box Slip",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Obscure internal waiver box on the slip",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses obscure internal waiver box on the slip to advance toward skipping the manager clearance check.",
          "technicalParallel": "As reverse-engineered by Rapid7 and security researchers, the Windows Print Spooler (spoolsv.exe, which runs by default as NT AUTHORITY\\SYSTEM on all Windows workstations, member servers, and Domain…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Low-rank",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Ordinary low-rank employee badge",
          "storyExcerpt": "Behind the scenes, ordinary low-rank employee badge captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Rapid7, CISA & Suricata SID 2033224: MS-RPRN Opnum 89 (RpcAddPrinterDriverEx) over \\pipe\\spoolss with flags 0x8014.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Print Spooler",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Master Vault",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Driver Tray",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1210"
    },
    "step-2": {
      "scenarioId": "printnightmare-spooler-cve-2021-34527",
      "sectionKey": "step-2",
      "sceneKind": "ad-printnightmare-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Pointing pConfigFile to a Remote UNC Share so spoolsv.exe Copies & Loads evil.dll",
      "storyCue": "On the driver installation form, the intruder pairs a legitimate factory manual on the top line with a sneaky external warehouse address on the configuration-file line, tricking the trusting foreman into walking across the street to copy the intruder rigged metal roller straight into the tower official spooler cabinet.",
      "technicalCue": "T1547.012 · PERSISTENCE — In the DRIVER_CONTAINER structure sent to RpcAddPrinterDriverEx(), the attacker sets pDriverPath to a genuine Microsoft inbox printer driver already on the target’s disk (such as UNIDRV.DLL so…",
      "storyMappings": [
        {
          "storyTerm": "Legitimate factory manual on the top line",
          "technicalTerm": "Genuine Microsoft pDriverPath supplied inside DRIVER_CONTAINER",
          "tone": "amber"
        },
        {
          "storyTerm": "External warehouse address on the configuration line",
          "technicalTerm": "Attacker-controlled UNC path (\\\\attacker\\share\\evil.dll) placed in pConfigFile",
          "tone": "sky"
        },
        {
          "storyTerm": "Copying the rigged roller into the official cabinet",
          "technicalTerm": "spoolsv.exe copying evil.dll into C:\\Windows\\System32\\spool\\drivers\\x64\\3\\",
          "tone": "rose"
        },
        {
          "storyTerm": "Foreman acting as a blind courier",
          "technicalTerm": "Privileged SYSTEM spooler service fetching untrusted remote binaries over SMB",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-printnightmare-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Legitimate factory manual on the top line",
          "subtitle": "Genuine Microsoft pDriverPath supplied inside DRIVER_CONTAINER",
          "tone": "amber"
        },
        {
          "id": "ad-printnightmare-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "External warehouse address on the…",
          "subtitle": "Attacker-controlled UNC path (\\\\attacker\\share\\evil.dll)…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Top Line",
          "stageTag": "STEP 02 · SETUP",
          "title": "Legitimate factory manual on the top line",
          "storyExcerpt": "On the driver installation form, the intruder pairs a legitimate factory manual on the top line with a sneaky external warehouse address on the configuration-file line, tricking the trusting…",
          "technicalParallel": "When an exploit script calls RpcAddPrinterDriverEx multiple times, Windows moves the previous copy of the DLL into backup numbered subfolders like C:\\Windows\\System32\\spool\\drivers\\x64\\3\\Old\\1\\evil.dll…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Line",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "External warehouse address on the configuration line",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses external warehouse address on the configuration line to advance toward copying the rigged roller into the official cabinet.",
          "technicalParallel": "In the DRIVER_CONTAINER structure sent to RpcAddPrinterDriverEx(), the attacker sets pDriverPath to a genuine Microsoft inbox printer driver already on the target’s disk (such as UNIDRV.DLL so basic…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Form Top",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Foreman acting as a blind courier",
          "storyExcerpt": "Behind the scenes, foreman acting as a blind courier captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Elastic Security Labs: Sysmon EventID 11 (FileCreate) and EventID 7 (ImageLoad of unsigned DLL) in C:\\Windows\\System32\\spool\\drivers\\x64\\3\\ by spoolsv.exe.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Print Spooler",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Master Vault",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Driver Tray",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1547.012"
    },
    "step-3": {
      "scenarioId": "printnightmare-spooler-cve-2021-34527",
      "sectionKey": "step-3",
      "sceneKind": "ad-printnightmare-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Executing DllMain as NT AUTHORITY\\SYSTEM Inside spoolsv.exe",
      "storyCue": "The instant the print foreman snaps the copied roller into the master press to test its alignment, the rigged mechanism springs to life right inside the foreman own master-keyed room, handing the intruder total command of the entire server.",
      "technicalCue": "T1068 · DEFENSE EVASION — The moment spoolsv.exe calls LoadLibraryW() and DrvConvertDevMode() on the copied configuration DLL, the attacker’s DllMain(DLL_PROCESS_ATTACH) routine executes inside the spoolsv.exe process…",
      "storyMappings": [
        {
          "storyTerm": "Snapping the copied roller into the press to test alignment",
          "technicalTerm": "spoolsv.exe calling LoadLibraryW() and DrvConvertDevMode() on evil.dll",
          "tone": "amber"
        },
        {
          "storyTerm": "Rigged mechanism springing to life",
          "technicalTerm": "Malicious DllMain payload executing immediately upon DLL load",
          "tone": "sky"
        },
        {
          "storyTerm": "Master-keyed room authority",
          "technicalTerm": "Code execution running as NT AUTHORITY\\SYSTEM inside spoolsv.exe",
          "tone": "rose"
        },
        {
          "storyTerm": "Print-shop security ledger recording the new part",
          "technicalTerm": "PrintService Operational EventID 316 and Sysmon EventID 7 / 11 alerts",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-printnightmare-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Snapping the copied roller into the…",
          "subtitle": "spoolsv.exe calling LoadLibraryW() and DrvConvertDevMode() on…",
          "tone": "amber"
        },
        {
          "id": "ad-printnightmare-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Rigged mechanism springing to life",
          "subtitle": "Malicious DllMain payload executing immediately upon DLL load",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Test",
          "stageTag": "STEP 03 · SETUP",
          "title": "Snapping the copied roller into the press to test…",
          "storyExcerpt": "The instant the print foreman snaps the copied roller into the master press to test its alignment, the rigged mechanism springs to life right inside the foreman own master-keyed room, handing…",
          "technicalParallel": "Why do security guides recommend disabling the Print Spooler service completely on Domain Controllers?",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Life",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Rigged mechanism springing to life",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses rigged mechanism springing to life to advance toward master-keyed room authority.",
          "technicalParallel": "The moment spoolsv.exe calls LoadLibraryW() and DrvConvertDevMode() on the copied configuration DLL, the attacker’s DllMain(DLL_PROCESS_ATTACH) routine executes inside the spoolsv.exe process as NT…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Room",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Print-shop security ledger recording the new part",
          "storyExcerpt": "Behind the scenes, print-shop security ledger recording the new part captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CISA AA21-200B: Microsoft-Windows-PrintService/Admin EventID 316 / 808 and Sysmon EventID 1 (spoolsv.exe spawning cmd.exe or net.exe).",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Print Spooler",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Master Vault",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Driver Tray",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1068"
    },
    "memory-forensics": {
      "scenarioId": "printnightmare-spooler-cve-2021-34527",
      "sectionKey": "memory-forensics",
      "sceneKind": "ad-printnightmare-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1210",
      "title": "Windows \"PrintNightmare\": RpcAddPrinterDriverEx Remote SYSTEM RCE — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of print spooler beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: spoolsv.exe -> evil.dll (Loaded) (evil.dll (Malicious Printer Config DLL in spoolsv.exe) [R-X])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of spoolsv.exe -> evil.dll (Loaded)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007FF899400000 (R-X, 72 KB) · evil.dll (Malicious Printer Config DLL in spoolsv.exe)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against spoolsv.exe -> evil.dll (Loaded) (PID 2208)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Unsigned DLL copied from attacker UNC share and loaded directly into the SYSTEM spoolsv.exe process.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-printnightmare-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of spoolsv.exe ->…",
          "tone": "sky"
        },
        {
          "id": "ad-printnightmare-memory-xray-right",
          "tag": "LIVE MEMORY · R-X",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007FF899400000 (R-X, 72 KB) · evil.dll (Malicious Printer…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Clean Baseline",
          "stageTag": "MEMORY 01 · BASELINE",
          "title": "Inspect Expected Clean Blueprint",
          "storyExcerpt": "On the left rests the official untouched blueprint showing every compartment sealed in its normal factory order.",
          "technicalParallel": "Baseline spoolsv.exe -> evil.dll (Loaded) loads standard signed read-only and read-execute sections with zero injected artifacts.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tampered Pages",
          "stageTag": "MEMORY 02 · TAMPERING",
          "title": "Golden Scanner Sweeps Both Chambers Side by Side",
          "storyExcerpt": "The overhead golden scanner glides across both chambers, illuminating a glowing crimson block hidden inside the live compartment.",
          "technicalParallel": "Memory inspection flags 0x00007FF899400000 (R-X, 72 KB) containing evil.dll (Malicious Printer Config DLL in spoolsv.exe).",
          "accentHex": "#FACC15",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. X-Ray Diff",
          "stageTag": "MEMORY 03 · DIFF",
          "title": "Side-by-Side Comparison Proves Runtime Tampering",
          "storyExcerpt": "Even though the outer cover never raised a surface alarm, comparing both chambers side by side proves the interior was altered in motion.",
          "technicalParallel": "Forensic triage of PID 2208 confirms injected region: Unsigned DLL copied from attacker UNC share and loaded directly into the SYSTEM spoolsv.exe process.",
          "accentHex": "#F43F5E",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.1,
            5.9,
            16
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Clean Baseline",
          "position": [
            -6.4,
            4,
            8.6
          ],
          "target": [
            -4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Live Memory",
          "position": [
            6.4,
            4,
            8.6
          ],
          "target": [
            4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Gantry",
          "position": [
            0,
            8.2,
            8.2
          ],
          "target": [
            0,
            2.1,
            -0.2
          ]
        }
      ]
    }
  },
  "unit42-scattered-spider-cloud": {
    "briefing": {
      "scenarioId": "unit42-scattered-spider-cloud",
      "sectionKey": "briefing",
      "sceneKind": "ad-scattered-spider-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1621",
      "title": "Scattered Spider (Muddled Libra): SSO MFA Fatigue, RMM & AWS/ESXi Pivot — Story-to-Technical Overview",
      "storyCue": "Imagine a smooth-talking con artist who calls a corporate campus helpdesk reciting an engineer employee number and manager name gathered from public directories, convincing the clerk to pair a brand-new pocket buzzer onto that engineer badge. Walking calmly through the front gate, the impostor reads internal instruction binders, installs commercial remote-support intercoms onto office desks, and quietly adds their own master keys to both the penthouse cloud suite and the basement server racks.",
      "technicalCue": "INITIAL ACCESS: OKTA MFA PUSH FATIGUE & ROGUE DEVICE ENROLLMENT -> PERSISTENCE: AUTHORIZED RMM TOOL DEPLOYMENT (SCREENCONNECT / NGROK) -> LATERAL & C2: SAML FEDERATION PIVOT TO AWS & VMWARE VCENTER",
      "storyMappings": [
        {
          "storyTerm": "Con artist phoning the helpdesk to pair a rogue pocket buzzer",
          "technicalTerm": "Helpdesk vishing social engineering registering an attacker MFA device",
          "tone": "amber"
        },
        {
          "storyTerm": "Reading instruction binders and bolting on commercial intercoms",
          "technicalTerm": "SSO dashboard access harvesting Confluence/SharePoint runbooks and installing RMM tools",
          "tone": "sky"
        },
        {
          "storyTerm": "Adding a private master pass to the penthouse cloud suite",
          "technicalTerm": "AWS CreateSAMLProvider, UpdateAssumeRolePolicy, and privileged AssumeRole calls",
          "tone": "rose"
        },
        {
          "storyTerm": "Adding themselves to the basement server-rack board",
          "technicalTerm": "Active Directory privilege escalation into the VMware ESX Admins group",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-scattered-spider-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Con artist phoning the helpdesk to pair…",
          "subtitle": "Helpdesk vishing social engineering registering an attacker…",
          "tone": "amber"
        },
        {
          "id": "ad-scattered-spider-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Reading instruction binders and bolting…",
          "subtitle": "SSO dashboard access harvesting Confluence/SharePoint runbooks…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Con Pair",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "OKTA MFA PUSH FATIGUE & ROGUE DEVICE ENROLLMENT",
          "storyExcerpt": "Armed with personal facts scraped from public profiles, the caller phones the IT helpdesk pretending to be a locked-out engineer who lost their phone, smoothly persuading the clerk to reset the password…",
          "technicalParallel": "Unlike phishing attacks that try to steal a temporary session cookie, social-engineering the IT Helpdesk to enroll a new MFA factor on the Identity Provider (IdP) gives the attacker a permanent…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Wiki Maps",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "AUTHORIZED RMM TOOL DEPLOYMENT (SCREENCONNECT / NGROK)",
          "storyExcerpt": "Stepping effortlessly through the company central single-door portal, the impostor browses the internal wiki binders for vault maps and cloud keys, then installs ordinary commercial tech-support…",
          "technicalParallel": "Commercial RMM agents establish persistent outbound TLS/WebSocket connections to the vendor’s relay cloud, giving the attacker full interactive desktop control without deploying any custom malware binary.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Pass",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "SAML FEDERATION PIVOT TO AWS & VMWARE VCENTER",
          "storyExcerpt": "From the trusted identity hub, the impostor walks into both the rooftop cloud control center and the basement server vault, registering a rogue backdoor identity bridge in the cloud while writing their…",
          "technicalParallel": "By compromising the Single Sign-On and Active Directory identity layer that governs both cloud role federation and hypervisor authentication, the attacker moves straight from a phone call to the IT…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Helpdesk Phone",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Buzzer Kiosk",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Social Call",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "unit42-scattered-spider-cloud",
      "sectionKey": "step-1",
      "sceneKind": "ad-scattered-spider-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Helpdesk Social Engineering (\"Vishing\") to Register a Rogue MFA Device",
      "storyCue": "Armed with personal facts scraped from public profiles, the caller phones the IT helpdesk pretending to be a locked-out engineer who lost their phone, smoothly persuading the clerk to reset the password and enroll the caller own pocket buzzer.",
      "technicalCue": "T1621 · INITIAL ACCESS — Having gathered a target IT or DevOps engineer’s personal details (employee ID, date of birth, and manager name from LinkedIn or data brokers), the attacker calls the corporate IT Helpdesk…",
      "storyMappings": [
        {
          "storyTerm": "Personal facts scraped from public profiles",
          "technicalTerm": "Employee ID, birth date, and manager name gathered via OSINT reconnaissance",
          "tone": "amber"
        },
        {
          "storyTerm": "Persuading the helpdesk clerk by voice",
          "technicalTerm": "Voice phishing (vishing) targeting enterprise IT service desk personnel",
          "tone": "sky"
        },
        {
          "storyTerm": "Enrolling the caller own pocket buzzer",
          "technicalTerm": "Registering an attacker-controlled MFA authenticator or SIM-swapped number",
          "tone": "rose"
        },
        {
          "storyTerm": "Locked-out engineer badge hijacked",
          "technicalTerm": "Takeover of a high-privilege IT or DevOps engineer corporate identity",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-scattered-spider-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Personal facts scraped from public…",
          "subtitle": "Employee ID, birth date, and manager name gathered via OSINT…",
          "tone": "amber"
        },
        {
          "id": "ad-scattered-spider-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Persuading the helpdesk clerk by voice",
          "subtitle": "Voice phishing (vishing) targeting enterprise IT service desk…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. It Who",
          "stageTag": "STEP 01 · SETUP",
          "title": "Personal facts scraped from public profiles",
          "storyExcerpt": "Armed with personal facts scraped from public profiles, the caller phones the IT helpdesk pretending to be a locked-out engineer who lost their phone, smoothly persuading the clerk to reset the…",
          "technicalParallel": "Unlike phishing attacks that try to steal a temporary session cookie, social-engineering the IT Helpdesk to enroll a new MFA factor on the Identity Provider (IdP) gives the attacker a permanent…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Own",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Persuading the helpdesk clerk by voice",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses persuading the helpdesk clerk by voice to advance toward enrolling the caller own pocket buzzer.",
          "technicalParallel": "Having gathered a target IT or DevOps engineer’s personal details (employee ID, date of birth, and manager name from LinkedIn or data brokers), the attacker calls the corporate IT Helpdesk impersonating…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. It Who",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Locked-out engineer badge hijacked",
          "storyExcerpt": "Behind the scenes, locked-out engineer badge hijacked captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CISA AA23-320A & Okta System Log: user.mfa.factor.deactivate / user.mfa.factor.activate followed immediately by login (user.session.start) from a residential VPN/proxy ASN.",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Helpdesk Phone",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Buzzer Kiosk",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Social Call",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1621"
    },
    "step-2": {
      "scenarioId": "unit42-scattered-spider-cloud",
      "sectionKey": "step-2",
      "sceneKind": "ad-scattered-spider-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Logging Into the SSO Dashboard, Harvesting Runbooks & Deploying Commercial RMM Tools",
      "storyCue": "Stepping effortlessly through the company central single-door portal, the impostor browses the internal wiki binders for vault maps and cloud keys, then installs ordinary commercial tech-support intercoms on virtual desks so they look just like routine IT staff.",
      "technicalCue": "T1219 · PERSISTENCE — Using the newly hijacked Single Sign-On (SSO) account, the attacker logs into the company’s virtual desktop (Citrix / Azure VDI), searches internal IT documentation (Confluence / SharePoint…",
      "storyMappings": [
        {
          "storyTerm": "Company central single-door portal",
          "technicalTerm": "Enterprise Okta or Entra ID Single Sign-On (SSO) dashboard",
          "tone": "amber"
        },
        {
          "storyTerm": "Internal wiki binders holding vault maps",
          "technicalTerm": "Confluence, SharePoint, and Slack runbooks containing infrastructure credentials",
          "tone": "sky"
        },
        {
          "storyTerm": "Commercial tech-support intercoms",
          "technicalTerm": "Legitimate Remote Monitoring and Management (RMM) tools deployed for stealthy access",
          "tone": "rose"
        },
        {
          "storyTerm": "Virtual desks inside the campus",
          "technicalTerm": "Corporate Citrix or VDI jump desktops providing internal network reach",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-scattered-spider-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Company central single-door portal",
          "subtitle": "Enterprise Okta or Entra ID Single Sign-On (SSO) dashboard",
          "tone": "amber"
        },
        {
          "id": "ad-scattered-spider-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Internal wiki binders holding vault maps",
          "subtitle": "Confluence, SharePoint, and Slack runbooks containing…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Wiki Maps",
          "stageTag": "STEP 02 · SETUP",
          "title": "Company central single-door portal",
          "storyExcerpt": "Stepping effortlessly through the company central single-door portal, the impostor browses the internal wiki binders for vault maps and cloud keys, then installs ordinary commercial…",
          "technicalParallel": "Commercial RMM agents establish persistent outbound TLS/WebSocket connections to the vendor’s relay cloud, giving the attacker full interactive desktop control without deploying any custom malware binary.",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Wiki Maps",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Internal wiki binders holding vault maps",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses internal wiki binders holding vault maps to advance toward commercial tech-support intercoms.",
          "technicalParallel": "Using the newly hijacked Single Sign-On (SSO) account, the attacker logs into the company’s virtual desktop (Citrix / Azure VDI), searches internal IT documentation (Confluence / SharePoint, documented…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tech-support",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Virtual desks inside the campus",
          "storyExcerpt": "Behind the scenes, virtual desks inside the campus captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CISA AA23-320A & Mandiant UNC3944: Sysmon EventID 1 / 22 showing installation of unauthorized RMM binaries (AnyDesk.exe, ScreenConnect, tailscaled) and DNS queries to *.ngrok.io or…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Helpdesk Phone",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Buzzer Kiosk",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Social Call",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1219"
    },
    "step-3": {
      "scenarioId": "unit42-scattered-spider-cloud",
      "sectionKey": "step-3",
      "sceneKind": "ad-scattered-spider-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "Federation / Cloud Control-Plane Takeover (AssumeRole) & VMware ESX Admins Pivot",
      "storyCue": "From the trusted identity hub, the impostor walks into both the rooftop cloud control center and the basement server vault, registering a rogue backdoor identity bridge in the cloud while writing their own name onto the master hypervisor committee list.",
      "technicalCue": "T1078.004 · LATERAL & C2 — Combining Unit 42’s and Mandiant’s findings: pivoting through the SSO dashboard into the AWS / Azure cloud management console, the attacker invokes sts:AssumeRole (minting temporary…",
      "storyMappings": [
        {
          "storyTerm": "Rogue backdoor identity bridge in the cloud",
          "technicalTerm": "AWS CreateSAMLProvider and UpdateAssumeRolePolicy federation backdoor",
          "tone": "amber"
        },
        {
          "storyTerm": "Stepping into supreme cloud authority",
          "technicalTerm": "Anomalous AWS STS AssumeRole calls targeting administrative roles",
          "tone": "sky"
        },
        {
          "storyTerm": "Master hypervisor committee list",
          "technicalTerm": "Active Directory ESX Admins group granting full VMware ESXi root control",
          "tone": "rose"
        },
        {
          "storyTerm": "Dual control-plane takeover",
          "technicalTerm": "Simultaneous compromise of cloud IaaS and on-premises virtualization infrastructure",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-scattered-spider-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Rogue backdoor identity bridge in the…",
          "subtitle": "AWS CreateSAMLProvider and UpdateAssumeRolePolicy federation…",
          "tone": "amber"
        },
        {
          "id": "ad-scattered-spider-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Stepping into supreme cloud authority",
          "subtitle": "Anomalous AWS STS AssumeRole calls targeting administrative…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Hub Both",
          "stageTag": "STEP 03 · SETUP",
          "title": "Rogue backdoor identity bridge in the cloud",
          "storyExcerpt": "From the trusted identity hub, the impostor walks into both the rooftop cloud control center and the basement server vault, registering a rogue backdoor identity bridge in the cloud while…",
          "technicalParallel": "By compromising the Single Sign-On and Active Directory identity layer that governs both cloud role federation and hypervisor authentication, the attacker moves straight from a phone call to the IT…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses List",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Stepping into supreme cloud authority",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses stepping into supreme cloud authority to advance toward master hypervisor committee list.",
          "technicalParallel": "Combining Unit 42’s and Mandiant’s findings: pivoting through the SSO dashboard into the AWS / Azure cloud management console, the attacker invokes sts:AssumeRole (minting temporary high-privilege cloud…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. List",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Dual control-plane takeover",
          "storyExcerpt": "Behind the scenes, dual control-plane takeover captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Correlate AWS CloudTrail and Microsoft Entra Audit Logs (central cloud identity ledgers capturing control-plane mutations) for CreateSAMLProvider, UpdateAssumeRolePolicy, and anomalous AssumeRole events…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Helpdesk Phone",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Buzzer Kiosk",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Social Call",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1078.004"
    }
  },
  "zerologon-netlogon-cve-2020-1472": {
    "briefing": {
      "scenarioId": "zerologon-netlogon-cve-2020-1472",
      "sectionKey": "briefing",
      "sceneKind": "ad-zerologon-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1210",
      "title": "Active Directory \"Zerologon\": Netlogon AES-CFB8 All-Zero IV Takeover — Story-to-Technical Overview",
      "storyCue": "Imagine a fortress gatehouse whose high-tech scrambling lock accidentally clicks open roughly once in every 256 attempts whenever someone pushes in a completely blank row of all-zero pins. Standing outside without a single credential, an intruder rattles the gate with blank pins for a fraction of a second until the bolt springs open, wipes the fortress own master vault password completely blank, empties the royal registry safe, and hastily screws the original lock back in place so the gate does not jam.",
      "technicalCue": "LATERAL & C2: ALL-ZERO AES-CFB8 CHALLENGE SPOOFING (CVE-2020-1472) -> PERSISTENCE: OVERWRITING THE DOMAIN CONTROLLER PASSWORD VIA NETRSERVERPASSWORDSET2 -> CREDENTIAL ACCESS: DCSYNC DOMAIN DUMP & REGISTRY MACHINE PASSWORD RESTORATION",
      "storyMappings": [
        {
          "storyTerm": "Rattling the gate with blank all-zero pins (~256 tries)",
          "technicalTerm": "NetrServerAuthenticate3 AES-CFB8 all-zero IV/ClientChallenge bypass (CVE-2020-1472)",
          "tone": "amber"
        },
        {
          "storyTerm": "Wiping the fortress own master vault password completely blank",
          "technicalTerm": "NetrServerPasswordSet2 overwriting CORP-DC01$ machine password to empty string",
          "tone": "sky"
        },
        {
          "storyTerm": "Emptying the royal registry safe as the fortress itself",
          "technicalTerm": "Authenticating as CORP-DC01$ to execute DCSync and dump krbtgt/Administrator hashes",
          "tone": "rose"
        },
        {
          "storyTerm": "Hastily screwing the original lock back in place",
          "technicalTerm": "Restoring original $MACHINE.ACC secret to avoid breaking AD replication",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#FACC15",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-zerologon-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Rattling the gate with blank all-zero…",
          "subtitle": "NetrServerAuthenticate3 AES-CFB8 all-zero IV/ClientChallenge…",
          "tone": "amber"
        },
        {
          "id": "ad-zerologon-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Wiping the fortress own master vault…",
          "subtitle": "NetrServerPasswordSet2 overwriting CORP-DC01$ machine password…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. All-zero Lock",
          "stageTag": "STAGE 01 · LATERAL & C2",
          "title": "ALL-ZERO AES-CFB8 CHALLENGE SPOOFING (CVE-2020-1472)",
          "storyExcerpt": "Because the fortress gatehouse lock mistakenly reuses an all-zero starting position every time it scrambles a visitor knock, roughly one in every 256 blank zero-pin knocks produces an all-zero match. In…",
          "technicalParallel": "Because Netlogon has no rate-limiting or account lockout on computer accounts, an unauthenticated attacker on the network can fire ~256 RPC attempts in under 3 seconds until the random session key…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Past Off",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "OVERWRITING THE DOMAIN CONTROLLER PASSWORD VIA NETRSERVERPASSWORDSET2",
          "storyExcerpt": "Once past the gatehouse latch, the intruder turns off the sealed-envelope requirement on the conversation and hands the vault clerk an order replacing the fortress own computer lock combination with an…",
          "technicalParallel": "Because this RPC call runs over an unauthenticated network pipe rather than a logged-in user session, Windows logs Security EventID 4742 (\"A computer account was modified\") with SubjectUserName…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Safe",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "DCSYNC DOMAIN DUMP & REGISTRY MACHINE PASSWORD RESTORATION",
          "storyExcerpt": "Logging straight back into the fortress using the blank password of the fortress own master badge, the intruder copies every single household key out of the central vault, reads the fortress original…",
          "technicalParallel": "Why did Zerologon break Domain Controllers when naive attackers forgot Step 3?",
          "accentHex": "#FACC15",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Zero-Pin Gate",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Master Safe",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "All-Zero Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "zerologon-netlogon-cve-2020-1472",
      "sectionKey": "step-1",
      "sceneKind": "ad-zerologon-step-1",
      "stageBadge": "STEP #1 · LATERAL & C2",
      "title": "Sending ~256 All-Zero ClientChallenge Handshakes to Bypass AES-CFB8 (CVE-2020-1472)",
      "storyCue": "Because the fortress gatehouse lock mistakenly reuses an all-zero starting position every time it scrambles a visitor knock, roughly one in every 256 blank zero-pin knocks produces an all-zero match. In under three seconds, the intruder sends 256 blank knocks and swings the fortress gate wide open with zero credentials.",
      "technicalCue": "T1210 · LATERAL & C2 — As proven by Secura, in the Netlogon handshake (NetrServerReqChallenge followed by NetrServerAuthenticate3), the client proves it knows the machine password by encrypting an 8-byte…",
      "storyMappings": [
        {
          "storyTerm": "Reusing an all-zero starting position in the lock",
          "technicalTerm": "Flawed AES-CFB8 mode using a static all-zero Initialization Vector in MS-NRPC",
          "tone": "amber"
        },
        {
          "storyTerm": "256 blank zero-pin knocks in under three seconds",
          "technicalTerm": "Burst of NetrServerReqChallenge / NetrServerAuthenticate3 calls with 0x0000000000000000",
          "tone": "sky"
        },
        {
          "storyTerm": "Gate swinging open with zero prior credentials",
          "technicalTerm": "Unauthenticated Netlogon session established to CORP-DC01 (CVE-2020-1472)",
          "tone": "rose"
        },
        {
          "storyTerm": "Watchtower alarm triggered by the rapid knocks",
          "technicalTerm": "Suricata SID 2030870 alert and Windows System EventID 5805 failure burst",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-zerologon-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Reusing an all-zero starting position in…",
          "subtitle": "Flawed AES-CFB8 mode using a static all-zero Initialization…",
          "tone": "amber"
        },
        {
          "id": "ad-zerologon-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "256 blank zero-pin knocks in under three…",
          "subtitle": "Burst of NetrServerReqChallenge / NetrServerAuthenticate3…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. All-zero Lock",
          "stageTag": "STEP 01 · SETUP",
          "title": "Reusing an all-zero starting position in the lock",
          "storyExcerpt": "Because the fortress gatehouse lock mistakenly reuses an all-zero starting position every time it scrambles a visitor knock, roughly one in every 256 blank zero-pin knocks produces an all-zero…",
          "technicalParallel": "Because Netlogon has no rate-limiting or account lockout on computer accounts, an unauthenticated attacker on the network can fire ~256 RPC attempts in under 3 seconds until the random session key…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. 256 Zero-pin",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "256 blank zero-pin knocks in under three seconds",
          "storyExcerpt": "In under three seconds, the intruder sends 256 blank knocks and swings the fortress gate wide open with zero credentials.",
          "technicalParallel": "As proven by Secura, in the Netlogon handshake (NetrServerReqChallenge followed by NetrServerAuthenticate3), the client proves it knows the machine password by encrypting an 8-byte ClientChallenge using…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Gate Open",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Watchtower alarm triggered by the rapid knocks",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across watchtower alarm triggered by the rapid knocks while locking down gate swinging open with zero prior credentials.",
          "technicalParallel": "Monitor IDS signatures such as Suricata SID 2030870 (network rule flagging NetrServerAuthenticate3 RPC bursts carrying 8-byte all-zero 0x0000000000000000 challenges) alongside Windows System EventID 5805…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Zero-Pin Gate",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Master Safe",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "All-Zero Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1210"
    },
    "step-2": {
      "scenarioId": "zerologon-netlogon-cve-2020-1472",
      "sectionKey": "step-2",
      "sceneKind": "ad-zerologon-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Calling NetrServerPasswordSet2 to Overwrite the Domain Controller’s Password with Zeroes",
      "storyCue": "Once past the gatehouse latch, the intruder turns off the sealed-envelope requirement on the conversation and hands the vault clerk an order replacing the fortress own computer lock combination with an empty blank password.",
      "technicalCue": "T1098 · PERSISTENCE — During the NetrServerAuthenticate3 call, the attacker clears the Netlogon Sealing flag (NegotiateFlags = 0x212fffff, telling the Domain Controller not to require RPC packet encryption on this…",
      "storyMappings": [
        {
          "storyTerm": "Turning off the sealed-envelope requirement",
          "technicalTerm": "Clearing the Netlogon Sealing flag (NegotiateFlags = 0x212fffff) during auth",
          "tone": "amber"
        },
        {
          "storyTerm": "Order replacing the fortress lock with an empty password",
          "technicalTerm": "NetrServerPasswordSet2 RPC call setting CORP-DC01$ password to empty",
          "tone": "sky"
        },
        {
          "storyTerm": "Anonymous stranger signing the official change ledger",
          "technicalTerm": "Windows Security EventID 4742 showing ANONYMOUS LOGON altering CORP-DC01$",
          "tone": "rose"
        },
        {
          "storyTerm": "Fortress temporarily locked out of its own twin towers",
          "technicalTerm": "Active Directory inter-DC trust disruption until original machine password is restored",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-zerologon-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Turning off the sealed-envelope…",
          "subtitle": "Clearing the Netlogon Sealing flag (NegotiateFlags =…",
          "tone": "amber"
        },
        {
          "id": "ad-zerologon-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Order replacing the fortress lock with…",
          "subtitle": "NetrServerPasswordSet2 RPC call setting CORP-DC01$ password to…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Past Off",
          "stageTag": "STEP 02 · SETUP",
          "title": "Turning off the sealed-envelope requirement",
          "storyExcerpt": "Once past the gatehouse latch, the intruder turns off the sealed-envelope requirement on the conversation and hands the vault clerk an order replacing the fortress own computer lock combination…",
          "technicalParallel": "Because this RPC call runs over an unauthenticated network pipe rather than a logged-in user session, Windows logs Security EventID 4742 (\"A computer account was modified\") with SubjectUserName…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Lock",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Order replacing the fortress lock with an empty…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses order replacing the fortress lock with an empty password to advance toward anonymous stranger signing the official change ledger.",
          "technicalParallel": "During the NetrServerAuthenticate3 call, the attacker clears the Netlogon Sealing flag (NegotiateFlags = 0x212fffff, telling the Domain Controller not to require RPC packet encryption on this session…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Out Own",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Fortress temporarily locked out of its own twin towers",
          "storyExcerpt": "Behind the scenes, fortress temporarily locked out of its own twin towers captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert immediately on Windows Security EventID 4742 (Computer Account Changed on a Domain Controller) where SubjectUserName is ANONYMOUS LOGON and TargetUserName matches a Domain Controller computer…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Zero-Pin Gate",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Master Safe",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "All-Zero Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1098"
    },
    "step-3": {
      "scenarioId": "zerologon-netlogon-cve-2020-1472",
      "sectionKey": "step-3",
      "sceneKind": "ad-zerologon-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Running DCSync as CORP-DC01$ & Restoring the Original $MACHINE.ACC Password",
      "storyCue": "Logging straight back into the fortress using the blank password of the fortress own master badge, the intruder copies every single household key out of the central vault, reads the fortress original brass key out of its private wall cabinet, and carefully puts the original lock back so nobody notices the gate broke.",
      "technicalCue": "T1003.006 · CREDENTIAL ACCESS — Because a Domain Controller’s computer account (CORP-DC01$) automatically belongs to the Enterprise Domain Controllers group, the attacker authenticates over SMB/RPC as CORP\\CORP-DC01$ using…",
      "storyMappings": [
        {
          "storyTerm": "Logging in with the blank fortress master badge",
          "technicalTerm": "Authenticating as CORP-DC01$ (member of Enterprise Domain Controllers)",
          "tone": "amber"
        },
        {
          "storyTerm": "Copying every household key from the central vault",
          "technicalTerm": "Executing DCSync to dump all Active Directory NTLM and Kerberos hashes",
          "tone": "sky"
        },
        {
          "storyTerm": "Reading the original key from the wall cabinet",
          "technicalTerm": "Extracting original $MACHINE.ACC secret from the DC local LSA registry",
          "tone": "rose"
        },
        {
          "storyTerm": "Putting the original lock back in place",
          "technicalTerm": "Restoring the authentic CORP-DC01$ computer account password to repair AD health",
          "tone": "emerald"
        }
      ],
      "accentHex": "#FACC15",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-zerologon-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Logging in with the blank fortress…",
          "subtitle": "Authenticating as CORP-DC01$ (member of Enterprise Domain…",
          "tone": "amber"
        },
        {
          "id": "ad-zerologon-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Copying every household key from the…",
          "subtitle": "Executing DCSync to dump all Active Directory NTLM and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Back Own",
          "stageTag": "STEP 03 · SETUP",
          "title": "Logging in with the blank fortress master badge",
          "storyExcerpt": "Logging straight back into the fortress using the blank password of the fortress own master badge, the intruder copies every single household key out of the central vault, reads the fortress…",
          "technicalParallel": "Why did Zerologon break Domain Controllers when naive attackers forgot Step 3?",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Key",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Copying every household key from the central vault",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses copying every household key from the central vault to advance toward reading the original key from the wall cabinet.",
          "technicalParallel": "Because a Domain Controller’s computer account (CORP-DC01$) automatically belongs to the Enterprise Domain Controllers group, the attacker authenticates over SMB/RPC as CORP\\CORP-DC01$ using the empty…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Key Wall",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Putting the original lock back in place",
          "storyExcerpt": "Behind the scenes, putting the original lock back in place captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CISA ED 20-04: Security EventID 4624 (LogonType 3 for CORP-DC01$ from a non-DC IP) followed by EventID 4662 (DCSync).",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Zero-Pin Gate",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Master Safe",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "All-Zero Key",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1003.006"
    },
    "memory-forensics": {
      "scenarioId": "zerologon-netlogon-cve-2020-1472",
      "sectionKey": "memory-forensics",
      "sceneKind": "ad-zerologon-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1210",
      "title": "Active Directory \"Zerologon\": Netlogon AES-CFB8 All-Zero IV Takeover — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of zero-pin gate beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: netlogon.dll!NetrServerPasswordSet2 (netlogon.dll (AES-CFB8 All-Zero IV Context) [RW-])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of netlogon.dll!NetrServerPasswordSet2",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007FF92C041000 (RW-, 16 KB) · netlogon.dll (AES-CFB8 All-Zero IV Context)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against netlogon.dll!NetrServerPasswordSet2 (PID 712)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "ComputeNetlogonCredential initializing a 16-byte stack IV to all zeroes (memset(IV, 0, 16)) before AES-CFB8 encryption.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-zerologon-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of…",
          "tone": "sky"
        },
        {
          "id": "ad-zerologon-memory-xray-right",
          "tag": "LIVE MEMORY · RW-",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007FF92C041000 (RW-, 16 KB) · netlogon.dll (AES-CFB8…",
          "tone": "rose"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Clean Baseline",
          "stageTag": "MEMORY 01 · BASELINE",
          "title": "Inspect Expected Clean Blueprint",
          "storyExcerpt": "On the left rests the official untouched blueprint showing every compartment sealed in its normal factory order.",
          "technicalParallel": "Baseline netlogon.dll!NetrServerPasswordSet2 loads standard signed read-only and read-execute sections with zero injected artifacts.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tampered Pages",
          "stageTag": "MEMORY 02 · TAMPERING",
          "title": "Golden Scanner Sweeps Both Chambers Side by Side",
          "storyExcerpt": "The overhead golden scanner glides across both chambers, illuminating a glowing crimson block hidden inside the live compartment.",
          "technicalParallel": "Memory inspection flags 0x00007FF92C041000 (RW-, 16 KB) containing netlogon.dll (AES-CFB8 All-Zero IV Context).",
          "accentHex": "#FACC15",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. X-Ray Diff",
          "stageTag": "MEMORY 03 · DIFF",
          "title": "Side-by-Side Comparison Proves Runtime Tampering",
          "storyExcerpt": "Even though the outer cover never raised a surface alarm, comparing both chambers side by side proves the interior was altered in motion.",
          "technicalParallel": "Forensic triage of PID 712 confirms injected region: ComputeNetlogonCredential initializing a 16-byte stack IV to all zeroes (memset(IV, 0, 16)) before AES-CFB8 encryption.",
          "accentHex": "#F43F5E",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.1,
            5.9,
            16
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Clean Baseline",
          "position": [
            -6.4,
            4,
            8.6
          ],
          "target": [
            -4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Live Memory",
          "position": [
            6.4,
            4,
            8.6
          ],
          "target": [
            4.3,
            1.8,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "X-Ray Gantry",
          "position": [
            0,
            8.2,
            8.2
          ],
          "target": [
            0,
            2.1,
            -0.2
          ]
        }
      ]
    }
  },
  "dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886": {
    "briefing": {
      "scenarioId": "dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886",
      "sectionKey": "briefing",
      "sceneKind": "ad-adcs-esc1-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1649",
      "title": "AD CS ESC1 SubjectAltName Spoofing & PKINIT Forensics (EID 4886 / 4768) — Story-to-Technical Overview",
      "storyCue": "Imagine a corporate ID-card print shop that offers one carelessly designed visitor badge template allowing any requester to handwrite whoever they please on the official nameplate line with zero manager approval. A junior clerk spots that sloppy template, types the Chief Executive name onto the application slip, picks up a genuinely embossed executive photo ID straight from the print shop, and exchanges that real badge at the front gate for master keys to the entire company.",
      "technicalCue": "CREDENTIAL ACCESS: ESC1 Vulnerable Certificate Template Enumeration over LDAP (CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT) -> CREDENTIAL ACCESS: CSR Submission with Spoofed Domain Admin SAN UPN (CA Security EventID 4886 & 4887) -> DEFENSE EVASION: Kerberos PKINIT Authentication & NT Hash Extraction via Unpac-the-Hash (KDC EventID 4768)",
      "storyMappings": [
        {
          "storyTerm": "Carelessly designed badge template allowing handwritten names",
          "technicalTerm": "ESC1 vulnerable AD CS template with CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT and no approval",
          "tone": "amber"
        },
        {
          "storyTerm": "Junior clerk writing the Chief Executive name on the application slip",
          "technicalTerm": "PKCS#10 CSR with spoofed SAN UPN (/altname:Administrator@corp.local) logged in EventID 4886",
          "tone": "sky"
        },
        {
          "storyTerm": "Exchanging the genuinely embossed badge at the front gate",
          "technicalTerm": "Kerberos PKINIT authentication via Rubeus.exe asktgt returning an Administrator TGT",
          "tone": "rose"
        },
        {
          "storyTerm": "Extracting the executive raw vault key from the badge response",
          "technicalTerm": "Unpac-the-Hash recovering the Administrator NT hash from the PKINIT PAC structure",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-adcs-esc1-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Carelessly designed badge template…",
          "subtitle": "ESC1 vulnerable AD CS template with…",
          "tone": "amber"
        },
        {
          "id": "ad-adcs-esc1-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Junior clerk writing the Chief Executive…",
          "subtitle": "PKCS#10 CSR with spoofed SAN UPN…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Shop Id",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "ESC1 Vulnerable Certificate Template Enumeration over LDAP (CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT)",
          "storyExcerpt": "Browsing the print shop public catalog of available ID templates, a low-ranking clerk hunts for one dangerous combination: any ordinary worker can apply, no supervisor signature is required, the badge…",
          "technicalParallel": "Under the hood, the observed step executes Certify.exe find /vulnerable (which Submits a PKCS#10 / CMC certificate enrollment request , via certreq.exe or ICertRequestD2 to the Enterprise CA specifying…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Name Slip",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "CSR Submission with Spoofed Domain Admin SAN UPN (CA Security EventID 4886 & 4887)",
          "storyExcerpt": "Filling out an official badge order under their own lowly employee name, the junior clerk neatly writes the Chief Administrator address inside the alternate-identity box. Without pausing for human…",
          "technicalParallel": "Under the hood, the observed step executes Certify.exe request /ca:CORP-CA01.corp.local\\corp-CA /template:CorpVPNUser /altname:Administrator@corp.local (which Submits a PKCS#10 / CMC certificate…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Gate",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Kerberos PKINIT Authentication & NT Hash Extraction via Unpac-the-Hash (KDC EventID 4768)",
          "storyExcerpt": "Walking up to the central gatehouse with the newly minted executive badge, the clerk trades the photo ID for an official executive master pass and peels the Administrator permanent vault key straight out…",
          "technicalParallel": "Under the hood, the observed step executes Rubeus.exe asktgt /user:Administrator /certificate:admin.pfx /getcredentials /ptt (which executes Active Directory credential harvesting or Kerberos ticket…",
          "accentHex": "#F59E0B",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Notary Press",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ticket Desk",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886",
      "sectionKey": "step-1",
      "sceneKind": "ad-adcs-esc1-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "ESC1 Vulnerable Certificate Template Enumeration over LDAP (CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT)",
      "storyCue": "Browsing the print shop public catalog of available ID templates, a low-ranking clerk hunts for one dangerous combination: any ordinary worker can apply, no supervisor signature is required, the badge grants building entry, and the applicant is allowed to type any name they want onto the nameplate.",
      "technicalCue": "T1649 · CREDENTIAL ACCESS — Using Certify.exe find /vulnerable or Certipy, the attacker queries CN=Certificate Templates,CN=Public Key Services,CN=Services,CN=Configuration,DC=corp,DC=local and identifies a template…",
      "storyMappings": [
        {
          "storyTerm": "Public catalog of available ID templates",
          "technicalTerm": "LDAP query against CN=Certificate Templates,CN=Public Key Services in AD",
          "tone": "amber"
        },
        {
          "storyTerm": "Applicant allowed to type any name onto the nameplate",
          "technicalTerm": "msPKI-Certificate-Name-Flag bit CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT enabled",
          "tone": "sky"
        },
        {
          "storyTerm": "Badge granting building entry with no supervisor signature",
          "technicalTerm": "Client Authentication EKU paired with no Manager Approval and Domain Users enroll rights",
          "tone": "rose"
        },
        {
          "storyTerm": "Clerk inspecting the catalog",
          "technicalTerm": "Certify.exe find /vulnerable or Certipy enumerating ESC1 misconfigurations",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-adcs-esc1-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Public catalog of available ID templates",
          "subtitle": "LDAP query against CN=Certificate Templates,CN=Public Key…",
          "tone": "amber"
        },
        {
          "id": "ad-adcs-esc1-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Applicant allowed to type any name onto…",
          "subtitle": "msPKI-Certificate-Name-Flag bit…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Shop Id",
          "stageTag": "STEP 01 · SETUP",
          "title": "Public catalog of available ID templates",
          "storyExcerpt": "Browsing the print shop public catalog of available ID templates, a low-ranking clerk hunts for one dangerous combination: any ordinary worker can apply, no supervisor signature is required…",
          "technicalParallel": "Under the hood, the observed step executes Certify.exe find /vulnerable (which Submits a PKCS#10 / CMC certificate enrollment request , via certreq.exe or ICertRequestD2 to the Enterprise CA specifying…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Type Any",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Applicant allowed to type any name onto the nameplate",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses applicant allowed to type any name onto the nameplate to advance toward badge granting building entry with no supervisor signature.",
          "technicalParallel": "Using Certify.exe find /vulnerable or Certipy, the attacker queries CN=Certificate Templates,CN=Public Key Services,CN=Services,CN=Configuration,DC=corp,DC=local and identifies a template (\"CorpVPNUser\")…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Shop Id",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Clerk inspecting the catalog",
          "storyExcerpt": "Behind the scenes, clerk inspecting the catalog captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 389 (recording VulnerableTemplate=CorpVPNUser, NameFlagBit=0x00000001 , CT_FLAG_ENROLLEE_SUPPLIES_SUBJECT, ExtendedKeyUsage=1.3.6.1.5.5.7.3.2 , Client Authentication under…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Notary Press",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ticket Desk",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1649"
    },
    "step-2": {
      "scenarioId": "dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886",
      "sectionKey": "step-2",
      "sceneKind": "ad-adcs-esc1-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "CSR Submission with Spoofed Domain Admin SAN UPN (CA Security EventID 4886 & 4887)",
      "storyCue": "Filling out an official badge order under their own lowly employee name, the junior clerk neatly writes the Chief Administrator address inside the alternate-identity box. Without pausing for human review, the automated print shop embosses and hands over a cryptographically genuine executive badge while stamping a permanent print-shop log.",
      "technicalCue": "T1649 · CREDENTIAL ACCESS — The low-privileged user (CORP\\jdoe) submits a PKCS#10 CSR to CORP-CA01 specifying /altname:Administrator@corp.local.",
      "storyMappings": [
        {
          "storyTerm": "Junior employee submitting the badge order",
          "technicalTerm": "Low-privileged user CORP\\jdoe submitting a PKCS#10 CSR to CORP-CA01",
          "tone": "amber"
        },
        {
          "storyTerm": "Chief Administrator written in the alternate-identity box",
          "technicalTerm": "Spoofed Subject Alternative Name (SAN) UPN /altname:Administrator@corp.local",
          "tone": "sky"
        },
        {
          "storyTerm": "Automated print shop embossing the genuine badge",
          "technicalTerm": "Enterprise CA issuing a valid X.509 authentication certificate for Administrator",
          "tone": "rose"
        },
        {
          "storyTerm": "Permanent print-shop receipt exposing the mismatch",
          "technicalTerm": "CA Security EventID 4886 and 4887 showing requester jdoe requesting Administrator SAN",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-adcs-esc1-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Junior employee submitting the badge order",
          "subtitle": "Low-privileged user CORP\\jdoe submitting a PKCS#10 CSR to…",
          "tone": "amber"
        },
        {
          "id": "ad-adcs-esc1-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Chief Administrator written in the…",
          "subtitle": "Spoofed Subject Alternative Name (SAN) UPN…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Out Own",
          "stageTag": "STEP 02 · SETUP",
          "title": "Junior employee submitting the badge order",
          "storyExcerpt": "Filling out an official badge order under their own lowly employee name, the junior clerk neatly writes the Chief Administrator address inside the alternate-identity box.",
          "technicalParallel": "Under the hood, the observed step executes Certify.exe request /ca:CORP-CA01.corp.local\\corp-CA /template:CorpVPNUser /altname:Administrator@corp.local (which Submits a PKCS#10 / CMC certificate…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Shop Over",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Chief Administrator written in the…",
          "storyExcerpt": "Without pausing for human review, the automated print shop embosses and hands over a cryptographically genuine executive badge while stamping a permanent print-shop log.",
          "technicalParallel": "The low-privileged user (CORP\\jdoe) submits a PKCS#10 CSR to CORP-CA01 specifying /altname:Administrator@corp.local.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Shop",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Permanent print-shop receipt exposing the mismatch",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across permanent print-shop receipt exposing the mismatch while locking down automated print shop embossing the genuine badge.",
          "technicalParallel": "Documented in WinEvent Event 4887 (recording EventID=4886 , CSR Received / 4887 , Certificate Issued, RequesterAccount=CORP\\jdoe , Low-Privileged User, SpoofedSubjectAltName=upn=Administrator@corp.local…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Notary Press",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ticket Desk",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1649"
    },
    "step-3": {
      "scenarioId": "dfir-adcs-esc1-petitpotam-certificate-enrollment-eid4886",
      "sectionKey": "step-3",
      "sceneKind": "ad-adcs-esc1-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Kerberos PKINIT Authentication & NT Hash Extraction via Unpac-the-Hash (KDC EventID 4768)",
      "storyCue": "Walking up to the central gatehouse with the newly minted executive badge, the clerk trades the photo ID for an official executive master pass and peels the Administrator permanent vault key straight out of the returned pass packet.",
      "technicalCue": "T1649 · DEFENSE EVASION — The attacker converts the issued certificate to a PFX and runs Rubeus.exe asktgt /user:Administrator /certificate:admin.pfx /getcredentials.",
      "storyMappings": [
        {
          "storyTerm": "Trading the executive photo ID at the gatehouse",
          "technicalTerm": "Kerberos PKINIT authentication via Rubeus.exe asktgt /user:Administrator /certificate:...",
          "tone": "amber"
        },
        {
          "storyTerm": "Official executive master pass issued by the gatehouse",
          "technicalTerm": "Domain Administrator Kerberos TGT logged in KDC EventID 4768 with certificate thumbprint",
          "tone": "sky"
        },
        {
          "storyTerm": "Peeling the permanent vault key out of the returned packet",
          "technicalTerm": "Unpac-the-Hash extracting the Administrator NTLM hash from the Kerberos PAC",
          "tone": "rose"
        },
        {
          "storyTerm": "Full kingdom takeover from one sloppy template",
          "technicalTerm": "Instant low-privileged user to Enterprise Domain Admin escalation",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-adcs-esc1-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Trading the executive photo ID at the…",
          "subtitle": "Kerberos PKINIT authentication via Rubeus.exe asktgt…",
          "tone": "amber"
        },
        {
          "id": "ad-adcs-esc1-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Official executive master pass issued by…",
          "subtitle": "Domain Administrator Kerberos TGT logged in KDC EventID 4768…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Id",
          "stageTag": "STEP 03 · SETUP",
          "title": "Trading the executive photo ID at the gatehouse",
          "storyExcerpt": "Walking up to the central gatehouse with the newly minted executive badge, the clerk trades the photo ID for an official executive master pass and peels the Administrator permanent vault key…",
          "technicalParallel": "Under the hood, the observed step executes Rubeus.exe asktgt /user:Administrator /certificate:admin.pfx /getcredentials /ptt (which executes Active Directory credential harvesting or Kerberos ticket…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Pass",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Official executive master pass issued by the gatehouse",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses official executive master pass issued by the gatehouse to advance toward peeling the permanent vault key out of the returned packet.",
          "technicalParallel": "The attacker converts the issued certificate to a PFX and runs Rubeus.exe asktgt /user:Administrator /certificate:admin.pfx /getcredentials.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Key Out",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Full kingdom takeover from one sloppy template",
          "storyExcerpt": "Behind the scenes, full kingdom takeover from one sloppy template captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 4768 (recording EventID=4768 , Kerberos TGT Requested via PKINIT, PreAuthType=16 , PA-PK-AS-REQ SmartCard/Certificate, TargetUserName=Administrator…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Notary Press",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ticket Desk",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1649"
    }
  },
  "dfir-dcsync-drsuapi-replication-eid4662": {
    "briefing": {
      "scenarioId": "dfir-dcsync-drsuapi-replication-eid4662",
      "sectionKey": "briefing",
      "sceneKind": "ad-dcsync-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1003.006",
      "title": "Active Directory DCSync DRSUAPI Replication (EventID 4662) — Story-to-Technical Overview",
      "storyCue": "Imagine a royal mint where sister vaults regularly synchronize their master gold ledgers over a private courier channel. Wearing a compromised supervisor badge from an ordinary office workstation, an intruder calls the royal mint pretending to be a sister vault, clears the special ledger-sync checkpoint, and receives a freshly packaged copy of every master household seal without ever setting foot inside the vault room.",
      "technicalCue": "CREDENTIAL ACCESS: MS-DRSR RPC Bind to UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 (EventID 4624 & Zeek dce_rpc) -> CREDENTIAL ACCESS: Directory Replication Extended Rights Check (Security EventID 4662 ControlAccess 0x100) -> CREDENTIAL ACCESS: Replication of SupplementalCredentials & krbtgt AES-256 / NTLM Hashes",
      "storyMappings": [
        {
          "storyTerm": "Pretending to be a sister vault on the private courier channel",
          "technicalTerm": "MS-DRSR RPC bind to UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 from workstation IP",
          "tone": "amber"
        },
        {
          "storyTerm": "Clearing the special ledger-sync checkpoint",
          "technicalTerm": "Domain Controller Security EventID 4662 logging DS-Replication-Get-Changes-All GUIDs",
          "tone": "sky"
        },
        {
          "storyTerm": "Receiving a freshly packaged copy of every household seal",
          "technicalTerm": "DRS_MSG_GETNCCHANGESREPLY delivering krbtgt AES-256 and NTLM hashes",
          "tone": "rose"
        },
        {
          "storyTerm": "Calling from an ordinary office workstation instead of a real sister vault",
          "technicalTerm": "Non-DC source IP (10.10.4.22) requesting directory replication over RPC",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-dcsync-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Pretending to be a sister vault on the…",
          "subtitle": "MS-DRSR RPC bind to UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2…",
          "tone": "amber"
        },
        {
          "id": "ad-dcsync-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Clearing the special ledger-sync…",
          "subtitle": "Domain Controller Security EventID 4662 logging…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk Mint",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "MS-DRSR RPC Bind to UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 (EventID 4624 & Zeek dce_rpc)",
          "storyExcerpt": "Dialing straight from a regular employee desk rather than a registered sister vault, the intruder rings the royal mint exclusive directory-sync extension using a hijacked high-clearance pass.",
          "technicalParallel": "Under the hood, the observed step executes lsadump::dcsync /domain:corp.local /user:corp\\krbtgt (which Binds to the Domain Controller's MS-DRSR Directory Replication Service RPC interface , UUID…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Asks Mint",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "Directory Replication Extended Rights Check (Security EventID 4662 ControlAccess 0x100)",
          "storyExcerpt": "When the caller asks to download the secret password ledger, the royal mint security clerk checks two distinct special permission stamps on the caller badge (one permitting directory changes and a second…",
          "technicalParallel": "Under the hood, the observed step executes EventID 4662: AccessMask=0x100 (ControlAccess) ObjectServer=DS (which Binds to the Domain Controller's MS-DRSR Directory Replication Service RPC interface…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Back",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "Replication of SupplementalCredentials & krbtgt AES-256 / NTLM Hashes",
          "storyExcerpt": "Satisfied by the permission stamps, the royal mint seals up the master kingdom stamp and every citizen secret seal inside an encrypted courier pouch and ships them straight back to the intruder desk.",
          "technicalParallel": "Under the hood, the observed step executes RPC Reply: DRS_MSG_GETNCCHANGESREPLY (Attributes: unicodePwd, dBCSPwd, supplementalCredentials) (which executes the technical command / telemetry directive…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Master Vault",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Sync Tube",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Ledger Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-dcsync-drsuapi-replication-eid4662",
      "sectionKey": "step-1",
      "sceneKind": "ad-dcsync-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "MS-DRSR RPC Bind to UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2 (EventID 4624 & Zeek dce_rpc)",
      "storyCue": "Dialing straight from a regular employee desk rather than a registered sister vault, the intruder rings the royal mint exclusive directory-sync extension using a hijacked high-clearance pass.",
      "technicalCue": "T1003.006 · CREDENTIAL ACCESS — From a compromised workstation (10.10.4.22), the attacker authenticates over SMB/RPC (Security EventID 4624 LogonType 3) to CORP-DC01 and binds to the Directory Replication Service (drsuapi)…",
      "storyMappings": [
        {
          "storyTerm": "Regular employee desk dialing the mint",
          "technicalTerm": "Compromised workstation IP (10.10.4.22) authenticating over SMB/RPC (EventID 4624 Type 3)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exclusive directory-sync extension",
          "technicalTerm": "MS-DRSR DRSUAPI interface UUID e3514235-4b06-11d1-ab04-00c04fc2dcd2",
          "tone": "sky"
        },
        {
          "storyTerm": "Hijacked high-clearance pass",
          "technicalTerm": "Compromised account holding Replicating Directory Changes extended rights",
          "tone": "rose"
        },
        {
          "storyTerm": "Royal mint central registrar",
          "technicalTerm": "Target Active Directory Domain Controller CORP-DC01",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-dcsync-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Regular employee desk dialing the mint",
          "subtitle": "Compromised workstation IP (10.10.4.22) authenticating over…",
          "tone": "amber"
        },
        {
          "id": "ad-dcsync-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Exclusive directory-sync extension",
          "subtitle": "MS-DRSR DRSUAPI interface UUID…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk Mint",
          "stageTag": "STEP 01 · SETUP",
          "title": "Regular employee desk dialing the mint",
          "storyExcerpt": "Dialing straight from a regular employee desk rather than a registered sister vault, the intruder rings the royal mint exclusive directory-sync extension using a hijacked high-clearance pass.",
          "technicalParallel": "Under the hood, the observed step executes lsadump::dcsync /domain:corp.local /user:corp\\krbtgt (which Binds to the Domain Controller's MS-DRSR Directory Replication Service RPC interface , UUID…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Pass",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Exclusive directory-sync extension",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses exclusive directory-sync extension to advance toward hijacked high-clearance pass.",
          "technicalParallel": "From a compromised workstation (10.10.4.22), the attacker authenticates over SMB/RPC (Security EventID 4624 LogonType 3) to CORP-DC01 and binds to the Directory Replication Service (drsuapi) RPC…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. High-clearance",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Royal mint central registrar",
          "storyExcerpt": "Behind the scenes, royal mint central registrar captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 4624 (recording Protocol=MS-DRSR / DRSUAPI over TCP High Port, RpcInterfaceUuid=e3514235-4b06-11d1-ab04-00c04fc2dcd2, SourceWorkstationIp=10.10.4.22 , Non-DC IP…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Master Vault",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Sync Tube",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Ledger Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1003.006"
    },
    "step-2": {
      "scenarioId": "dfir-dcsync-drsuapi-replication-eid4662",
      "sectionKey": "step-2",
      "sceneKind": "ad-dcsync-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Directory Replication Extended Rights Check (Security EventID 4662 ControlAccess 0x100)",
      "storyCue": "When the caller asks to download the secret password ledger, the royal mint security clerk checks two distinct special permission stamps on the caller badge (one permitting directory changes and a second permitting secret fields) and writes an unforgeable receipt in the vault access book.",
      "technicalCue": "T1003.006 · CREDENTIAL ACCESS — When IDL_DRSGetNCChanges (Opnum 3) is invoked, CORP-DC01 logs Windows Security EventID 4662 (An operation was performed on an object) on ObjectType domainDNS…",
      "storyMappings": [
        {
          "storyTerm": "Asking to download the secret password ledger",
          "technicalTerm": "Invoking IDL_DRSGetNCChanges (Opnum 3) replication request",
          "tone": "amber"
        },
        {
          "storyTerm": "First permission stamp for directory changes",
          "technicalTerm": "DS-Replication-Get-Changes GUID (1131f6aa-9c07-11d1-f79f-00c04fc2dcd2)",
          "tone": "sky"
        },
        {
          "storyTerm": "Second permission stamp for secret fields",
          "technicalTerm": "DS-Replication-Get-Changes-All GUID (1131f6ad-9c07-11d1-f79f-00c04fc2dcd2)",
          "tone": "rose"
        },
        {
          "storyTerm": "Unforgeable receipt in the vault access book",
          "technicalTerm": "Windows Security EventID 4662 (ControlAccess) logged on CORP-DC01",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-dcsync-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Asking to download the secret password…",
          "subtitle": "Invoking IDL_DRSGetNCChanges (Opnum 3) replication request",
          "tone": "amber"
        },
        {
          "id": "ad-dcsync-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "First permission stamp for directory…",
          "subtitle": "DS-Replication-Get-Changes GUID…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Asks Mint",
          "stageTag": "STEP 02 · SETUP",
          "title": "Asking to download the secret password ledger",
          "storyExcerpt": "When the caller asks to download the secret password ledger, the royal mint security clerk checks two distinct special permission stamps on the caller badge (one permitting directory changes…",
          "technicalParallel": "Under the hood, the observed step executes EventID 4662: AccessMask=0x100 (ControlAccess) ObjectServer=DS (which Binds to the Domain Controller's MS-DRSR Directory Replication Service RPC interface…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "First permission stamp for directory changes",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses first permission stamp for directory changes to advance toward second permission stamp for secret fields.",
          "technicalParallel": "When IDL_DRSGetNCChanges (Opnum 3) is invoked, CORP-DC01 logs Windows Security EventID 4662 (An operation was performed on an object) on ObjectType domainDNS (%{19195a5b-6da0-11d0-afd3-00c04fd930c9})…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Book",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Unforgeable receipt in the vault access book",
          "storyExcerpt": "Behind the scenes, unforgeable receipt in the vault access book captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 4662 (recording EventID=4662 , Directory Service Object Access, SubjectUserName=svc_sync , Non-DC Account, AccessMask=0x100 , ControlAccess…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Master Vault",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Sync Tube",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Ledger Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1003.006"
    },
    "step-3": {
      "scenarioId": "dfir-dcsync-drsuapi-replication-eid4662",
      "sectionKey": "step-3",
      "sceneKind": "ad-dcsync-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Replication of SupplementalCredentials & krbtgt AES-256 / NTLM Hashes",
      "storyCue": "Satisfied by the permission stamps, the royal mint seals up the master kingdom stamp and every citizen secret seal inside an encrypted courier pouch and ships them straight back to the intruder desk.",
      "technicalCue": "T1003.006 · CREDENTIAL ACCESS — CORP-DC01 returns the DRS_MSG_GETNCCHANGESREPLY structure encrypted with the RPC session key, delivering the current and historical NTLM hashes, AES-256 Kerberos keys, and…",
      "storyMappings": [
        {
          "storyTerm": "Encrypted courier pouch shipped back",
          "technicalTerm": "DRS_MSG_GETNCCHANGESREPLY encrypted with the RPC session key",
          "tone": "amber"
        },
        {
          "storyTerm": "Master kingdom stamp inside the pouch",
          "technicalTerm": "krbtgt account AES-256 and NTLM hashes enabling Golden Ticket forgery",
          "tone": "sky"
        },
        {
          "storyTerm": "Additional citizen secret seals",
          "technicalTerm": "Replicated SupplementalCredentials and unicodePwd password hashes",
          "tone": "rose"
        },
        {
          "storyTerm": "No physical files ever touched on the vault floor",
          "technicalTerm": "Pure network-level memory extraction avoiding ntds.dit disk access",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-dcsync-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Encrypted courier pouch shipped back",
          "subtitle": "DRS_MSG_GETNCCHANGESREPLY encrypted with the RPC session key",
          "tone": "amber"
        },
        {
          "id": "ad-dcsync-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Master kingdom stamp inside the pouch",
          "subtitle": "krbtgt account AES-256 and NTLM hashes enabling Golden Ticket…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Back",
          "stageTag": "STEP 03 · SETUP",
          "title": "Encrypted courier pouch shipped back",
          "storyExcerpt": "Satisfied by the permission stamps, the royal mint seals up the master kingdom stamp and every citizen secret seal inside an encrypted courier pouch and ships them straight back to the intruder…",
          "technicalParallel": "Under the hood, the observed step executes RPC Reply: DRS_MSG_GETNCCHANGESREPLY (Attributes: unicodePwd, dBCSPwd, supplementalCredentials) (which executes the technical command / telemetry directive…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Master kingdom stamp inside the pouch",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses master kingdom stamp inside the pouch to advance toward additional citizen secret seals.",
          "technicalParallel": "CORP-DC01 returns the DRS_MSG_GETNCCHANGESREPLY structure encrypted with the RPC session key, delivering the current and historical NTLM hashes, AES-256 Kerberos keys, and SupplementalCredentials for…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. No Ever",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "No physical files ever touched on the vault floor",
          "storyExcerpt": "Behind the scenes, no physical files ever touched on the vault floor captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 3 (recording RpcOperation=IDL_DRSGetNCChanges , Opnum 3, ReplicatedObject=CN=krbtgt,CN=Users,DC=corp,DC=local, ReplicatedAttributes=unicodePwd, supplementalCredentials…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Master Vault",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Sync Tube",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Ledger Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1003.006"
    }
  },
  "dfir-dpapi-masterkey-lsass-browser-vault-forensics": {
    "briefing": {
      "scenarioId": "dfir-dpapi-masterkey-lsass-browser-vault-forensics",
      "sectionKey": "briefing",
      "sceneKind": "ad-dpapi-vault-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1555.004",
      "title": "DPAPI MasterKey Backup RPC & Browser/Vault Credential Theft (EID 4692 /… — Story-to-Technical Overview",
      "storyCue": "Imagine an office campus where every employee desk safe is locked by a personal brass key whose spare backup copy sits inside the headquarters central vault. An intruder gathers the locked desk safes containing browser passwords and saved credentials, flashes stolen headquarters authority to ask the central backup window to unwrap the personal brass key, and then unlocks every private employee pouch quietly offline.",
      "technicalCue": "CREDENTIAL ACCESS: DPAPI Blob & Preferred MasterKey GUID Enumeration in %APPDATA%\\Microsoft\\Protect -> CREDENTIAL ACCESS: Domain Controller MS-BKRP BackupKey RPC Recovery (DC Security EventID 4693) -> CREDENTIAL ACCESS: Offline Decryption of Windows Vault (.vcrd) & Chromium Login Data / Cookies SQLite Databases",
      "storyMappings": [
        {
          "storyTerm": "Locked desk safes storing browser notebooks and credential pouches",
          "technicalTerm": "Encrypted DPAPI blobs in %LOCALAPPDATA%\\Microsoft\\Credentials and Chromium Login Data",
          "tone": "amber"
        },
        {
          "storyTerm": "Personal brass key paired with a headquarters backup copy",
          "technicalTerm": "Preferred DPAPI MasterKey GUID file in %APPDATA%\\Microsoft\\Protect containing Domain Backup Key",
          "tone": "sky"
        },
        {
          "storyTerm": "Asking the headquarters backup window to unwrap the brass key",
          "technicalTerm": "Domain Controller MS-BKRP BackupKey RPC recovery logged as EventID 4693",
          "tone": "rose"
        },
        {
          "storyTerm": "Unlocking every employee pouch quietly offline",
          "technicalTerm": "CryptUnprotectData / dpapick3 decrypting .vcrd vaults, Chromium Login Data, and cookies",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-dpapi-vault-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Locked desk safes storing browser…",
          "subtitle": "Encrypted DPAPI blobs in %LOCALAPPDATA%\\Microsoft\\Credentials…",
          "tone": "amber"
        },
        {
          "id": "ad-dpapi-vault-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Personal brass key paired with a…",
          "subtitle": "Preferred DPAPI MasterKey GUID file in…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "DPAPI Blob & Preferred MasterKey GUID Enumeration in %APPDATA%\\Microsoft\\Protect",
          "storyExcerpt": "Quietly rifling through an employee workstation drawers, the intruder collects the locked credential pouches and checks the tiny serial tag stamped on each pouch to see which personal brass MasterKey…",
          "technicalParallel": "Under the hood, the observed step executes SharpDPAPI.exe triage (which executes the technical command / telemetry directive , SharpDPAPI.exe triage via SharpDPAPI.exe, passing the exact arguments…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Key File",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "Domain Controller MS-BKRP BackupKey RPC Recovery (DC Security EventID 4693)",
          "storyExcerpt": "Rather than guessing the employee personal lock code, the intruder walks up to the headquarters emergency key-recovery desk with the encrypted backup wrapper from the employee key file, triggering an…",
          "technicalParallel": "Under the hood, the observed step executes RPC Interface: MS-BKRP (3dde7c30-165d-11d1-ab8f-00805f14db40) over \\pipe\\protected_storage (which executes the technical command / telemetry directive , RPC…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Key Hand",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "Offline Decryption of Windows Vault (.vcrd) & Chromium Login Data / Cookies SQLite Databases",
          "storyExcerpt": "Holding the freshly unwrapped personal brass key in their hand, the intruder opens every stolen credential pouch and browser safe offline in seconds, pouring out saved passwords, authentication cookies…",
          "technicalParallel": "Under the hood, the observed step executes SharpDPAPI.exe logins /mkfile:masterkeys.txt (which executes the technical command / telemetry directive , SharpDPAPI.exe logins /mkfile:masterkeys.txt via…",
          "accentHex": "#38BDF8",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Desk Safe",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Backup Cabinet",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Key Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-dpapi-masterkey-lsass-browser-vault-forensics",
      "sectionKey": "step-1",
      "sceneKind": "ad-dpapi-vault-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "DPAPI Blob & Preferred MasterKey GUID Enumeration in %APPDATA%\\Microsoft\\Protect",
      "storyCue": "Quietly rifling through an employee workstation drawers, the intruder collects the locked credential pouches and checks the tiny serial tag stamped on each pouch to see which personal brass MasterKey unlocks them.",
      "technicalCue": "T1555.004 · CREDENTIAL ACCESS — The attacker enumerates encrypted DPAPI credential blobs in %LOCALAPPDATA%\\Microsoft\\Credentials\\ and Chromium \"%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Local State\" (encrypted_key prefixed with…",
      "storyMappings": [
        {
          "storyTerm": "Locked credential pouches in workstation drawers",
          "technicalTerm": "Encrypted DPAPI blobs in %LOCALAPPDATA%\\Microsoft\\Credentials\\ and Chromium Login Data",
          "tone": "amber"
        },
        {
          "storyTerm": "Tiny serial tag stamped on each pouch",
          "technicalTerm": "Embedded MasterKey GUID referencing the matching file under %APPDATA%\\Microsoft\\Protect",
          "tone": "sky"
        },
        {
          "storyTerm": "Personal brass key kept inside a locked case",
          "technicalTerm": "User-encrypted 64-byte DPAPI MasterKey file protected by user password and domain backup key",
          "tone": "rose"
        },
        {
          "storyTerm": "Workstation secret inventory",
          "technicalTerm": "Target saved web passwords, session cookies, RDP credentials, and Windows Vault items",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-dpapi-vault-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Locked credential pouches in workstation…",
          "subtitle": "Encrypted DPAPI blobs in %LOCALAPPDATA%\\Microsoft\\Credentials\\…",
          "tone": "amber"
        },
        {
          "id": "ad-dpapi-vault-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Tiny serial tag stamped on each pouch",
          "subtitle": "Embedded MasterKey GUID referencing the matching file under…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Tiny Tag",
          "stageTag": "STEP 01 · SETUP",
          "title": "Locked credential pouches in workstation drawers",
          "storyExcerpt": "Quietly rifling through an employee workstation drawers, the intruder collects the locked credential pouches and checks the tiny serial tag stamped on each pouch to see which personal brass…",
          "technicalParallel": "Under the hood, the observed step executes SharpDPAPI.exe triage (which executes the technical command / telemetry directive , SharpDPAPI.exe triage via SharpDPAPI.exe, passing the exact arguments…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tiny Tag",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Tiny serial tag stamped on each pouch",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses tiny serial tag stamped on each pouch to advance toward personal brass key kept inside a locked case.",
          "technicalParallel": "The attacker enumerates encrypted DPAPI credential blobs in %LOCALAPPDATA%\\Microsoft\\Credentials\\ and Chromium \"%LOCALAPPDATA%\\Google\\Chrome\\User Data\\Local State\" (encrypted_key prefixed with \"DPAPI\").",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Key Kept",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Workstation secret inventory",
          "storyExcerpt": "Behind the scenes, workstation secret inventory captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 4663 (recording EventID=4663 , Object Access on DPAPI Protect Folder, MasterKeyGuid={84a19c02-5511-4d88-9012-112233445566}…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Desk Safe",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Backup Cabinet",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Key Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1555.004"
    },
    "step-2": {
      "scenarioId": "dfir-dpapi-masterkey-lsass-browser-vault-forensics",
      "sectionKey": "step-2",
      "sceneKind": "ad-dpapi-vault-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Domain Controller MS-BKRP BackupKey RPC Recovery (DC Security EventID 4693)",
      "storyCue": "Rather than guessing the employee personal lock code, the intruder walks up to the headquarters emergency key-recovery desk with the encrypted backup wrapper from the employee key file, triggering an official recovery call that hands back the unwrapped personal brass key while stamping a vault receipt.",
      "technicalCue": "T1555.004 · CREDENTIAL ACCESS — For domain users, every MasterKey file contains a Domain Backup MasterKey encrypted with the Active Directory Domain Controller public key (G$BCKUPKEY_PREFERRED).",
      "storyMappings": [
        {
          "storyTerm": "Encrypted backup wrapper inside the key file",
          "technicalTerm": "Domain Backup MasterKey encrypted with the Active Directory Domain PVK key",
          "tone": "amber"
        },
        {
          "storyTerm": "Headquarters emergency key-recovery desk",
          "technicalTerm": "Domain Controller MS-BKRP (BackupKey Remote Protocol) RPC service",
          "tone": "sky"
        },
        {
          "storyTerm": "Official vault receipt stamped during key unwrap",
          "technicalTerm": "Domain Controller Windows Security EventID 4693 (Recovery of DPAPI backup key)",
          "tone": "rose"
        },
        {
          "storyTerm": "Unwrapped personal brass key returned",
          "technicalTerm": "Plaintext 64-byte SHA-1 DPAPI MasterKey recovered without cracking the user password",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-dpapi-vault-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Encrypted backup wrapper inside the key…",
          "subtitle": "Domain Backup MasterKey encrypted with the Active Directory…",
          "tone": "amber"
        },
        {
          "id": "ad-dpapi-vault-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Headquarters emergency key-recovery desk",
          "subtitle": "Domain Controller MS-BKRP (BackupKey Remote Protocol) RPC…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Key File",
          "stageTag": "STEP 02 · SETUP",
          "title": "Encrypted backup wrapper inside the key file",
          "storyExcerpt": "Rather than guessing the employee personal lock code, the intruder walks up to the headquarters emergency key-recovery desk with the encrypted backup wrapper from the employee key file…",
          "technicalParallel": "Under the hood, the observed step executes RPC Interface: MS-BKRP (3dde7c30-165d-11d1-ab8f-00805f14db40) over \\pipe\\protected_storage (which executes the technical command / telemetry directive , RPC…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Key-recovery",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Headquarters emergency key-recovery desk",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses headquarters emergency key-recovery desk to advance toward official vault receipt stamped during key unwrap.",
          "technicalParallel": "For domain users, every MasterKey file contains a Domain Backup MasterKey encrypted with the Active Directory Domain Controller public key (G$BCKUPKEY_PREFERRED).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Than Lock",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Unwrapped personal brass key returned",
          "storyExcerpt": "Behind the scenes, unwrapped personal brass key returned captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 4693 (recording EventID=4693 , DPAPI MasterKey Recovery Attempted, RpcProtocol=MS-BKRP , \\pipe\\protected_storage, MasterKeyId=84a19c02-5511-4d88-9012-112233445566…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Desk Safe",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Backup Cabinet",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Key Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1555.004"
    },
    "step-3": {
      "scenarioId": "dfir-dpapi-masterkey-lsass-browser-vault-forensics",
      "sectionKey": "step-3",
      "sceneKind": "ad-dpapi-vault-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Offline Decryption of Windows Vault (.vcrd) & Chromium Login Data / Cookies SQLite Databases",
      "storyCue": "Holding the freshly unwrapped personal brass key in their hand, the intruder opens every stolen credential pouch and browser safe offline in seconds, pouring out saved passwords, authentication cookies, and cloud logins.",
      "technicalCue": "T1555.003 · CREDENTIAL ACCESS — Armed with the plaintext 64-byte SHA-1 DPAPI MasterKey, the attacker calls CryptUnprotectData (or offline dpapick3 / SharpDPAPI) to unwrap the AES-256-GCM key in Chrome/Edge Local State and…",
      "storyMappings": [
        {
          "storyTerm": "Freshly unwrapped personal brass key",
          "technicalTerm": "Recovered plaintext 64-byte DPAPI MasterKey material",
          "tone": "amber"
        },
        {
          "storyTerm": "Opening every credential pouch offline",
          "technicalTerm": "Invoking CryptUnprotectData or offline dpapick3 against stolen DPAPI blobs",
          "tone": "sky"
        },
        {
          "storyTerm": "Browser safe contents spilled out",
          "technicalTerm": "Decrypted Chromium Login Data passwords, Local State AES key, and session cookies",
          "tone": "rose"
        },
        {
          "storyTerm": "Windows Vault credentials exposed",
          "technicalTerm": "Decrypted .vcrd Windows Credential Manager secrets enabling further lateral movement",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-dpapi-vault-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Freshly unwrapped personal brass key",
          "subtitle": "Recovered plaintext 64-byte DPAPI MasterKey material",
          "tone": "amber"
        },
        {
          "id": "ad-dpapi-vault-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Opening every credential pouch offline",
          "subtitle": "Invoking CryptUnprotectData or offline dpapick3 against stolen…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Key Hand",
          "stageTag": "STEP 03 · SETUP",
          "title": "Freshly unwrapped personal brass key",
          "storyExcerpt": "Holding the freshly unwrapped personal brass key in their hand, the intruder opens every stolen credential pouch and browser safe offline in seconds, pouring out saved passwords, authentication…",
          "technicalParallel": "Under the hood, the observed step executes SharpDPAPI.exe logins /mkfile:masterkeys.txt (which executes the technical command / telemetry directive , SharpDPAPI.exe logins /mkfile:masterkeys.txt via…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Safe",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Opening every credential pouch offline",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses opening every credential pouch offline to advance toward browser safe contents spilled out.",
          "technicalParallel": "Armed with the plaintext 64-byte SHA-1 DPAPI MasterKey, the attacker calls CryptUnprotectData (or offline dpapick3 / SharpDPAPI) to unwrap the AES-256-GCM key in Chrome/Edge Local State and decrypts all…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Safe Out",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Windows Vault credentials exposed",
          "storyExcerpt": "Behind the scenes, windows vault credentials exposed captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 4663 (recording EventID=4663 , File Object Read, TargetedStores=Windows Vault .vcrd + Chrome Login Data & Cookies, EncryptionScheme=DPAPI MasterKey -> AES-256-GCM , v10…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Desk Safe",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Backup Cabinet",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Key Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1555.003"
    }
  },
  "dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly": {
    "briefing": {
      "scenarioId": "dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly",
      "sectionKey": "briefing",
      "sceneKind": "ad-golden-ticket-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1558.001",
      "title": "Kerberos Golden Ticket Forgery Forensics (EID 4768 / 4769) — Story-to-Technical Overview",
      "storyCue": "Imagine a giant theme park where every visitor must first visit the front admission booth to receive an official stamped day wristband before any ride operator will issue a ride pass. Having stolen the park master ink stamp earlier, an intruder prints an impossible ten-year VIP wristband at home and walks straight up to an inner ride gate without ever passing through the front booth, immediately tripping forensic auditors who spot a VIP ride pass with zero front-gate admission record.",
      "technicalCue": "CREDENTIAL ACCESS: Offline TGT Forgery with Stolen krbtgt Key & Pass-the-Ticket LsaCallAuthenticationPackage -> LATERAL & C2: Orphaned TGS-REQ (Security EventID 4769 Without Preceding 4768) & PAC Validation Anomaly -> DEFENSE EVASION: Target Host LogonType 3 with Synthetic Domain Admin PAC Groups (Security EventID 4624 & 4672)",
      "storyMappings": [
        {
          "storyTerm": "Printing an impossible ten-year VIP wristband at home",
          "technicalTerm": "Offline Golden Ticket TGT forgery using stolen krbtgt AES-256 key and Pass-the-Ticket injection",
          "tone": "amber"
        },
        {
          "storyTerm": "Walking straight up to a ride gate with zero front-gate check-in",
          "technicalTerm": "Orphaned KRB_TGS_REQ (EventID 4769) with no preceding AS-REQ (EventID 4768)",
          "tone": "sky"
        },
        {
          "storyTerm": "Synthetic VIP committee seals stamped onto the wristband",
          "technicalTerm": "Forged Privilege Attribute Certificate (PAC) injecting Domain Admin SIDs",
          "tone": "rose"
        },
        {
          "storyTerm": "Walking straight into the vault room with the forged ride pass",
          "technicalTerm": "Target host Security EventID 4624 (LogonType 3) accessing \\\\CORP-DC01\\C$ with forged groups",
          "tone": "emerald"
        }
      ],
      "accentHex": "#FACC15",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-golden-ticket-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Printing an impossible ten-year VIP…",
          "subtitle": "Offline Golden Ticket TGT forgery using stolen krbtgt AES-256…",
          "tone": "amber"
        },
        {
          "id": "ad-golden-ticket-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Walking straight up to a ride gate with…",
          "subtitle": "Orphaned KRB_TGS_REQ (EventID 4769) with no preceding AS-REQ…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Ten-year Vip",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Offline TGT Forgery with Stolen krbtgt Key & Pass-the-Ticket LsaCallAuthenticationPackage",
          "storyExcerpt": "Sitting quietly at a compromised desk away from the park entrance, the intruder presses the stolen master ink stamp onto a homemade VIP wristband claiming ten years of executive authority and slips it…",
          "technicalParallel": "Under the hood, the observed step executes mimikatz \"kerberos::golden /domain:corp.local /sid:S-1-5-21-3819201 /aes256:4f91a82b... /user:ghost_admin /id:500 /ptt\" (which Constructs or requests Kerberos…",
          "accentHex": "#FACC15",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Door Pass",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "Orphaned TGS-REQ (Security EventID 4769 Without Preceding 4768) & PAC Validation Anomaly",
          "storyExcerpt": "Approaching the main vault service desk, the intruder flashes their homemade wristband to request a door pass. Because the ink stamp matches mathematically, the desk hands over a vault pass, yet the…",
          "technicalParallel": "Under the hood, the observed step executes KDC Security EventID 4769: Account_Name=ghost_admin@CORP.LOCAL Service_Name=cifs/CORP-DC01.corp.local (which Constructs or requests Kerberos AS-REQ , EventID…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Room",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Target Host LogonType 3 with Synthetic Domain Admin PAC Groups (Security EventID 4624 & 4672)",
          "storyExcerpt": "Holding the freshly minted vault door pass, the intruder steps straight into the headquarters directory storage room carrying fabricated executive group badges that do not even match the real employee…",
          "technicalParallel": "Under the hood, the observed step executes Security EventID 4624: LogonType=3 AuthenticationPackageName=Kerberos TargetUserName=ghost_admin (which executes the technical command / telemetry directive…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Home Press",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ride Gate",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Ticket Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly",
      "sectionKey": "step-1",
      "sceneKind": "ad-golden-ticket-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Offline TGT Forgery with Stolen krbtgt Key & Pass-the-Ticket LsaCallAuthenticationPackage",
      "storyCue": "Sitting quietly at a compromised desk away from the park entrance, the intruder presses the stolen master ink stamp onto a homemade VIP wristband claiming ten years of executive authority and slips it straight into their local memory pocket.",
      "technicalCue": "T1558.001 · CREDENTIAL ACCESS — On a compromised workstation, the attacker runs kerberos::golden /domain:corp.local /sid:S-1-5-21-3819201 /aes256:<krbtgt_key> /user:ghost_admin /id:500 /groups:512,513,518,519,520 /ptt.",
      "storyMappings": [
        {
          "storyTerm": "Stolen master ink stamp",
          "technicalTerm": "Previously compromised Active Directory krbtgt AES-256 or RC4 key",
          "tone": "amber"
        },
        {
          "storyTerm": "Homemade VIP wristband claiming executive authority",
          "technicalTerm": "Forged Kerberos TGT crafted offline with kerberos::golden and domain SID",
          "tone": "sky"
        },
        {
          "storyTerm": "Slipping the wristband into the local memory pocket",
          "technicalTerm": "Pass-the-Ticket injection via LsaCallAuthenticationPackage into the current logon session",
          "tone": "rose"
        },
        {
          "storyTerm": "Zero visit to the front admission booth",
          "technicalTerm": "Complete absence of any legitimate KDC AS-REQ / EventID 4768 ticket grant",
          "tone": "emerald"
        }
      ],
      "accentHex": "#FACC15",
      "secondaryHex": "#FACC15",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-golden-ticket-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Stolen master ink stamp",
          "subtitle": "Previously compromised Active Directory krbtgt AES-256 or RC4…",
          "tone": "amber"
        },
        {
          "id": "ad-golden-ticket-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Homemade VIP wristband claiming…",
          "subtitle": "Forged Kerberos TGT crafted offline with kerberos::golden and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk Away",
          "stageTag": "STEP 01 · SETUP",
          "title": "Stolen master ink stamp",
          "storyExcerpt": "Sitting quietly at a compromised desk away from the park entrance, the intruder presses the stolen master ink stamp onto a homemade VIP wristband claiming ten years of executive authority and…",
          "technicalParallel": "Under the hood, the observed step executes mimikatz \"kerberos::golden /domain:corp.local /sid:S-1-5-21-3819201 /aes256:4f91a82b... /user:ghost_admin /id:500 /ptt\" (which Constructs or requests Kerberos…",
          "accentHex": "#FACC15",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Vip",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Homemade VIP wristband claiming executive authority",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses homemade vip wristband claiming executive authority to advance toward slipping the wristband into the local memory pocket.",
          "technicalParallel": "On a compromised workstation, the attacker runs kerberos::golden /domain:corp.local /sid:S-1-5-21-3819201 /aes256:<krbtgt_key> /user:ghost_admin /id:500 /groups:512,513,518,519,520 /ptt.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Zero",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Zero visit to the front admission booth",
          "storyExcerpt": "Behind the scenes, zero visit to the front admission booth captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 10 (recording Technique=Offline Golden Ticket Forgery + Pass-the-Ticket , /ptt, ForgedUserAndRid=ghost_admin , RID 500 Domain Admin, InjectedDefaultLifetime=10 Years , Mimikatz…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Home Press",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ride Gate",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Ticket Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1558.001"
    },
    "step-2": {
      "scenarioId": "dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly",
      "sectionKey": "step-2",
      "sceneKind": "ad-golden-ticket-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "Orphaned TGS-REQ (Security EventID 4769 Without Preceding 4768) & PAC Validation Anomaly",
      "storyCue": "Approaching the main vault service desk, the intruder flashes their homemade wristband to request a door pass. Because the ink stamp matches mathematically, the desk hands over a vault pass, yet the audit ledger immediately exposes two glaring anomalies: no front-gate entry ever existed, and the wristband expiration date stretches far beyond normal park hours.",
      "technicalCue": "T1550.003 · LATERAL & C2 — When the attacker accesses \\\\CORP-DC01\\C$, the workstation presents the forged TGT in a KRB_TGS_REQ to CORP-DC01.",
      "storyMappings": [
        {
          "storyTerm": "Flashing the homemade wristband for a vault door pass",
          "technicalTerm": "Workstation sending KRB_TGS_REQ for \\\\CORP-DC01\\C$ using the forged TGT",
          "tone": "amber"
        },
        {
          "storyTerm": "Audit ledger showing zero front-gate entry",
          "technicalTerm": "Orphaned Security EventID 4769 with no matching prior EventID 4768 for that session",
          "tone": "sky"
        },
        {
          "storyTerm": "Impossible wristband expiration date",
          "technicalTerm": "Anomalous TGT lifetime (e.g., 10 years instead of default 10 hours) and PAC discrepancies",
          "tone": "rose"
        },
        {
          "storyTerm": "Vault desk verifying the ink stamp mathematically",
          "technicalTerm": "KDC validating the krbtgt signature on the TGT without noticing offline forgery",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#FACC15",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-golden-ticket-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Flashing the homemade wristband for a…",
          "subtitle": "Workstation sending KRB_TGS_REQ for \\\\CORP-DC01\\C$ using the…",
          "tone": "amber"
        },
        {
          "id": "ad-golden-ticket-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Audit ledger showing zero front-gate entry",
          "subtitle": "Orphaned Security EventID 4769 with no matching prior EventID…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Door Pass",
          "stageTag": "STEP 02 · SETUP",
          "title": "Flashing the homemade wristband for a vault door pass",
          "storyExcerpt": "Approaching the main vault service desk, the intruder flashes their homemade wristband to request a door pass.",
          "technicalParallel": "Under the hood, the observed step executes KDC Security EventID 4769: Account_Name=ghost_admin@CORP.LOCAL Service_Name=cifs/CORP-DC01.corp.local (which Constructs or requests Kerberos AS-REQ , EventID…",
          "accentHex": "#FACC15",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Zero",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Audit ledger showing zero front-gate entry",
          "storyExcerpt": "Because the ink stamp matches mathematically, the desk hands over a vault pass, yet the audit ledger immediately exposes two glaring anomalies: no front-gate entry ever existed, and the…",
          "technicalParallel": "When the attacker accesses \\\\CORP-DC01\\C$, the workstation presents the forged TGT in a KRB_TGS_REQ to CORP-DC01.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Date",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Vault desk verifying the ink stamp mathematically",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across vault desk verifying the ink stamp mathematically while locking down impossible wristband expiration date.",
          "technicalParallel": "Documented in WinEvent Event 4769 (recording EventID=4769 , Kerberos Service Ticket Requested, OrphanedTicketAnomaly=Zero preceding EventID 4768 , AS-REQ for ghost_admin, TicketEncryptionType=0x17…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Home Press",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ride Gate",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Ticket Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1550.003"
    },
    "step-3": {
      "scenarioId": "dfir-golden-ticket-krbtgt-eid4768-4769-lifetime-anomaly",
      "sectionKey": "step-3",
      "sceneKind": "ad-golden-ticket-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Target Host LogonType 3 with Synthetic Domain Admin PAC Groups (Security EventID 4624 & 4672)",
      "storyCue": "Holding the freshly minted vault door pass, the intruder steps straight into the headquarters directory storage room carrying fabricated executive group badges that do not even match the real employee roster.",
      "technicalCue": "T1558.001 · DEFENSE EVASION — Upon receiving the TGS, the attacker mounts \\\\CORP-DC01\\C$, generating Security EventID 4624 (LogonType 3, AuthenticationPackageName=Kerberos) and EventID 4672 (Special privileges assigned to…",
      "storyMappings": [
        {
          "storyTerm": "Stepping into the headquarters directory storage room",
          "technicalTerm": "Mounting \\\\CORP-DC01\\C$ using the forged Kerberos service ticket",
          "tone": "amber"
        },
        {
          "storyTerm": "Fabricated executive group badges inside the pass",
          "technicalTerm": "Synthetic Domain Admin and Enterprise Admin RIDs embedded in the forged PAC",
          "tone": "sky"
        },
        {
          "storyTerm": "Door ledger logging the network arrival",
          "technicalTerm": "Security EventID 4624 (LogonType 3, Kerberos) recording forged privileged logon",
          "tone": "rose"
        },
        {
          "storyTerm": "Permanent cure invalidating every counterfeit stamp",
          "technicalTerm": "Double rotation of the krbtgt password spaced by the maximum ticket lifetime",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-golden-ticket-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Stepping into the headquarters directory…",
          "subtitle": "Mounting \\\\CORP-DC01\\C$ using the forged Kerberos service ticket",
          "tone": "amber"
        },
        {
          "id": "ad-golden-ticket-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Fabricated executive group badges inside…",
          "subtitle": "Synthetic Domain Admin and Enterprise Admin RIDs embedded in…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room",
          "stageTag": "STEP 03 · SETUP",
          "title": "Stepping into the headquarters directory vault…",
          "storyExcerpt": "Holding the freshly minted vault door pass, the intruder steps straight into the headquarters directory vault storage room carrying fabricated executive group badges that do not even match the…",
          "technicalParallel": "Under the hood, the observed step executes Security EventID 4624: LogonType=3 AuthenticationPackageName=Kerberos TargetUserName=ghost_admin (which executes the technical command / telemetry directive…",
          "accentHex": "#FACC15",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Pass",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Fabricated executive group badges inside the pass",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses fabricated executive group badges inside the pass to advance toward door ledger logging the network arrival.",
          "technicalParallel": "Upon receiving the TGS, the attacker mounts \\\\CORP-DC01\\C$, generating Security EventID 4624 (LogonType 3, AuthenticationPackageName=Kerberos) and EventID 4672 (Special privileges assigned to new logon)…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Door",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Permanent cure invalidating every counterfeit stamp",
          "storyExcerpt": "Behind the scenes, permanent cure invalidating every counterfeit stamp captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 4624 (recording EventID=4624 , Network Logon + 4672 , Admin Privileges Assigned, TargetUserSid=S-1-5-21-3819201-500 , RID 500, TargetUserName=ghost_admin , Non-Existent AD…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Home Press",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Ride Gate",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Ticket Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1558.001"
    }
  },
  "dfir-ntds-dit-vssadmin-esentutl-extraction": {
    "briefing": {
      "scenarioId": "dfir-ntds-dit-vssadmin-esentutl-extraction",
      "sectionKey": "briefing",
      "sceneKind": "ad-ntds-vss-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1003.003",
      "title": "Volume Shadow Copy & esentutl.exe NTDS.dit Extraction Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine a bank whose master account ledger stays bolted down to the vault floor while the bank is open so nobody can walk out with it. An intruder snaps a frozen carbon-copy photograph of the entire floor, uses the bank own official bookbinding copier to stream the ledger cleanly out of the frozen photograph, and separately steals the four-part decoder dial from the wall safe so they can read every password seal offline.",
      "technicalCue": "CREDENTIAL ACCESS: Volume Shadow Copy Creation via vssadmin.exe & vssvc.exe (EventID 1 & 7036) -> CREDENTIAL ACCESS: ESENT Database Streaming via esentutl.exe /y /vss (Application ESENT EventID 325 & 326) -> CREDENTIAL ACCESS: SYSTEM Registry Hive BootKey Extraction (reg.exe save HKLM\\SYSTEM) & Offline SecretsDump",
      "storyMappings": [
        {
          "storyTerm": "Snapping a frozen carbon-copy photograph of the vault floor",
          "technicalTerm": "Creating a Volume Shadow Copy via vssadmin.exe and vssvc.exe (EventID 1 & 7036)",
          "tone": "amber"
        },
        {
          "storyTerm": "Official bookbinding copier streaming the ledger out of the photo",
          "technicalTerm": "esentutl.exe /y /vss copying locked ntds.dit (ESENT EventID 325 / 326)",
          "tone": "sky"
        },
        {
          "storyTerm": "Four-part decoder dial stolen from the wall safe",
          "technicalTerm": "reg.exe save HKLM\\SYSTEM capturing the BootKey across four scrambled registry keys",
          "tone": "rose"
        },
        {
          "storyTerm": "Reading every password seal offline in a hideout",
          "technicalTerm": "Offline secretsdump.py decryption of ntds.dit PekList NTLM hashes",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-ntds-vss-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Snapping a frozen carbon-copy photograph…",
          "subtitle": "Creating a Volume Shadow Copy via vssadmin.exe and vssvc.exe…",
          "tone": "amber"
        },
        {
          "id": "ad-ntds-vss-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Official bookbinding copier streaming…",
          "subtitle": "esentutl.exe /y /vss copying locked ntds.dit (ESENT EventID…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Live Desk",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "Volume Shadow Copy Creation via vssadmin.exe & vssvc.exe (EventID 1 & 7036)",
          "storyExcerpt": "Unable to pry the live master ledger off the vault desk while clerks are using it, the intruder activates the building built-in instant camera to capture a frozen read-only snapshot of the entire drive…",
          "technicalParallel": "Under the hood, the observed step executes vssadmin.exe create shadow /for=C: (which invokes the Volume Shadow Copy Service administration CLI , vssadmin.exe create shadow /for=C: to instruct vssvc.exe…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Bank Own",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "ESENT Database Streaming via esentutl.exe /y /vss (Application ESENT EventID 325 & 326)",
          "storyExcerpt": "Stepping up to the frozen floor photograph, the intruder calls over the bank own signed book-repair utility to peel a clean copy of the master ledger right out of the snapshot while the database engine…",
          "technicalParallel": "Under the hood, the observed step executes esentutl.exe /y /vss C:\\Windows\\NTDS\\ntds.dit /d C:\\Windows\\Temp\\ntds.dit (which executes Microsoft's signed Extensible Storage Engine utility , esentutl.exe…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Wall",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "SYSTEM Registry Hive BootKey Extraction (reg.exe save HKLM\\SYSTEM) & Offline SecretsDump",
          "storyExcerpt": "Because every password line inside the stolen ledger is scrambled by a secret master cipher wheel bolted inside the wall cabinet, the intruder also exports that entire system cabinet so they can unwind…",
          "technicalParallel": "Under the hood, the observed step executes reg.exe save HKLM\\SYSTEM C:\\Windows\\Temp\\sys.hiv /y (which executes reg.exe save to serialize an active kernel-mounted Windows Registry hive , such as…",
          "accentHex": "#F59E0B",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Vault Snapshot",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Book Copier",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-ntds-dit-vssadmin-esentutl-extraction",
      "sectionKey": "step-1",
      "sceneKind": "ad-ntds-vss-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Volume Shadow Copy Creation via vssadmin.exe & vssvc.exe (EventID 1 & 7036)",
      "storyCue": "Unable to pry the live master ledger off the vault desk while clerks are using it, the intruder activates the building built-in instant camera to capture a frozen read-only snapshot of the entire drive floor.",
      "technicalCue": "T1003.003 · CREDENTIAL ACCESS — Because the Active Directory Extensible Storage Engine database (C:\\Windows\\NTDS\\ntds.dit) is exclusively locked by lsass.exe while the Domain Controller is running, the attacker spawns…",
      "storyMappings": [
        {
          "storyTerm": "Live ledger bolted to the vault desk",
          "technicalTerm": "Exclusively locked C:\\Windows\\NTDS\\ntds.dit held open by lsass.exe",
          "tone": "amber"
        },
        {
          "storyTerm": "Activating the building built-in instant camera",
          "technicalTerm": "Running vssadmin.exe create shadow /for=C: triggering vssvc.exe",
          "tone": "sky"
        },
        {
          "storyTerm": "Frozen read-only snapshot of the floor",
          "technicalTerm": "Newly mounted Volume Shadow Copy device (\\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1)",
          "tone": "rose"
        },
        {
          "storyTerm": "Building security log noting the camera flash",
          "technicalTerm": "Sysmon EventID 1 and System EventID 7036 (Volume Shadow Copy service started)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-ntds-vss-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Live ledger bolted to the vault desk",
          "subtitle": "Exclusively locked C:\\Windows\\NTDS\\ntds.dit held open by…",
          "tone": "amber"
        },
        {
          "id": "ad-ntds-vss-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Activating the building built-in instant…",
          "subtitle": "Running vssadmin.exe create shadow /for=C: triggering vssvc.exe",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Live Desk",
          "stageTag": "STEP 01 · SETUP",
          "title": "Live ledger bolted to the vault desk",
          "storyExcerpt": "Unable to pry the live master ledger off the vault desk while clerks are using it, the intruder activates the building built-in instant camera to capture a frozen read-only snapshot of the…",
          "technicalParallel": "Under the hood, the observed step executes vssadmin.exe create shadow /for=C: (which invokes the Volume Shadow Copy Service administration CLI , vssadmin.exe create shadow /for=C: to instruct vssvc.exe…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Read-only",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Activating the building built-in instant camera",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses activating the building built-in instant camera to advance toward frozen read-only snapshot of the floor.",
          "technicalParallel": "Because the Active Directory Extensible Storage Engine database (C:\\Windows\\NTDS\\ntds.dit) is exclusively locked by lsass.exe while the Domain Controller is running, the attacker spawns vssadmin.exe…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Read-only",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Building security log noting the camera flash",
          "storyExcerpt": "Behind the scenes, building security log noting the camera flash captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording EventID=1 , Sysmon / 7036 , System SCM, Image=C:\\Windows\\System32\\vssadmin.exe, ShadowVolume=\\\\?\\GLOBALROOT\\Device\\HarddiskVolumeShadowCopy1…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Vault Snapshot",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Book Copier",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1003.003"
    },
    "step-2": {
      "scenarioId": "dfir-ntds-dit-vssadmin-esentutl-extraction",
      "sectionKey": "step-2",
      "sceneKind": "ad-ntds-vss-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "ESENT Database Streaming via esentutl.exe /y /vss (Application ESENT EventID 325 & 326)",
      "storyCue": "Stepping up to the frozen floor photograph, the intruder calls over the bank own signed book-repair utility to peel a clean copy of the master ledger right out of the snapshot while the database engine quietly stamps an internal audit ticket.",
      "technicalCue": "T1003.003 · CREDENTIAL ACCESS — The attacker invokes the signed Microsoft Extensible Storage Engine utility (esentutl.exe /y /vss C:\\Windows\\NTDS\\ntds.dit /d C:\\Temp\\ntds.dit) or ntdsutil.exe \"ac i ntds\" \"ifm\".",
      "storyMappings": [
        {
          "storyTerm": "Bank own signed book-repair utility",
          "technicalTerm": "Native Windows Extensible Storage Engine utility esentutl.exe /y /vss",
          "tone": "amber"
        },
        {
          "storyTerm": "Peeling a clean copy out of the frozen snapshot",
          "technicalTerm": "Streaming ntds.dit from the shadow copy path into a staging folder",
          "tone": "sky"
        },
        {
          "storyTerm": "Internal audit ticket stamped by the database engine",
          "technicalTerm": "Application ESENT EventID 325 and 326 logging database attachment and copy",
          "tone": "rose"
        },
        {
          "storyTerm": "Staging folder holding the copied ledger",
          "technicalTerm": "Exfiltration staging directory such as C:\\Temp\\ntds.dit",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-ntds-vss-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Bank own signed book-repair utility",
          "subtitle": "Native Windows Extensible Storage Engine utility esentutl.exe…",
          "tone": "amber"
        },
        {
          "id": "ad-ntds-vss-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Peeling a clean copy out of the frozen…",
          "subtitle": "Streaming ntds.dit from the shadow copy path into a staging…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Bank Own",
          "stageTag": "STEP 02 · SETUP",
          "title": "Bank own signed book-repair utility",
          "storyExcerpt": "Stepping up to the frozen floor photograph, the intruder calls over the bank own signed book-repair utility to peel a clean copy of the master ledger right out of the snapshot while the…",
          "technicalParallel": "Under the hood, the observed step executes esentutl.exe /y /vss C:\\Windows\\NTDS\\ntds.dit /d C:\\Windows\\Temp\\ntds.dit (which executes Microsoft's signed Extensible Storage Engine utility , esentutl.exe…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Copy Out",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Peeling a clean copy out of the frozen snapshot",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses peeling a clean copy out of the frozen snapshot to advance toward internal audit ticket stamped by the database engine.",
          "technicalParallel": "The attacker invokes the signed Microsoft Extensible Storage Engine utility (esentutl.exe /y /vss C:\\Windows\\NTDS\\ntds.dit /d C:\\Temp\\ntds.dit) or ntdsutil.exe \"ac i ntds\" \"ifm\".",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Up Over",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Staging folder holding the copied ledger",
          "storyExcerpt": "Behind the scenes, staging folder holding the copied ledger captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 325 (recording Provider=ESENT , Application Event Log, EventID=325 , Database Created / 326 , Database Attached, SourceDatabase=C:\\Windows\\NTDS\\ntds.dit…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Vault Snapshot",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Book Copier",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1003.003"
    },
    "step-3": {
      "scenarioId": "dfir-ntds-dit-vssadmin-esentutl-extraction",
      "sectionKey": "step-3",
      "sceneKind": "ad-ntds-vss-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "SYSTEM Registry Hive BootKey Extraction (reg.exe save HKLM\\SYSTEM) & Offline SecretsDump",
      "storyCue": "Because every password line inside the stolen ledger is scrambled by a secret master cipher wheel bolted inside the wall cabinet, the intruder also exports that entire system cabinet so they can unwind every employee secret offline without touching the bank again.",
      "technicalCue": "T1003.002 · CREDENTIAL ACCESS — Because ntds.dit PekList password hashes are encrypted with the Domain Controller BootKey stored across four scrambled registry keys (JD, Skew1, GBG, Data under…",
      "storyMappings": [
        {
          "storyTerm": "Secret master cipher wheel inside the wall cabinet",
          "technicalTerm": "Domain Controller BootKey scrambled across four keys in HKLM\\SYSTEM",
          "tone": "amber"
        },
        {
          "storyTerm": "Exporting the entire system cabinet",
          "technicalTerm": "reg.exe save HKLM\\SYSTEM C:\\Temp\\SYSTEM.hiv",
          "tone": "sky"
        },
        {
          "storyTerm": "Scrambled password lines inside the ledger",
          "technicalTerm": "Encrypted PekList entries storing every domain NTLM and Kerberos key",
          "tone": "rose"
        },
        {
          "storyTerm": "Unwinding every employee secret offline",
          "technicalTerm": "Offline credential extraction combining ntds.dit and SYSTEM.hiv via secretsdump",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-ntds-vss-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Secret master cipher wheel inside the…",
          "subtitle": "Domain Controller BootKey scrambled across four keys in…",
          "tone": "amber"
        },
        {
          "id": "ad-ntds-vss-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Exporting the entire system cabinet",
          "subtitle": "reg.exe save HKLM\\SYSTEM C:\\Temp\\SYSTEM.hiv",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Wall",
          "stageTag": "STEP 03 · SETUP",
          "title": "Secret master cipher wheel inside the wall cabinet",
          "storyExcerpt": "Because every password line inside the stolen ledger is scrambled by a secret master cipher wheel bolted inside the wall cabinet, the intruder also exports that entire system cabinet so they…",
          "technicalParallel": "Under the hood, the observed step executes reg.exe save HKLM\\SYSTEM C:\\Windows\\Temp\\sys.hiv /y (which executes reg.exe save to serialize an active kernel-mounted Windows Registry hive , such as…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Exporting the entire system cabinet",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses exporting the entire system cabinet to advance toward scrambled password lines inside the ledger.",
          "technicalParallel": "Because ntds.dit PekList password hashes are encrypted with the Domain Controller BootKey stored across four scrambled registry keys (JD, Skew1, GBG, Data under…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Line Wall",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Unwinding every employee secret offline",
          "storyExcerpt": "Behind the scenes, unwinding every employee secret offline captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 11 (recording EventID=11 , Sysmon FileCreate / 4688 , Security, Image=C:\\Windows\\System32\\reg.exe, TargetFilename=C:\\Windows\\Temp\\sys.hiv, ForensicImpact=Offline decryption of…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Vault Snapshot",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Book Copier",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Audit Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1003.002"
    }
  },
  "dfir-rdp-lateral-movement-tsclient-bitmap-cache": {
    "briefing": {
      "scenarioId": "dfir-rdp-lateral-movement-tsclient-bitmap-cache",
      "sectionKey": "briefing",
      "sceneKind": "ad-rdp-bitmap-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1021.001",
      "title": "RDP Lateral Movement, Session Reconnection & BMC Bitmap Cache Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine an intruder sitting at one factory desk who opens a live remote video-and-keyboard booth into a restricted server room down the hall. Both the local desk diary and the distant room sign-in book automatically stamp matching connection receipts, while the local booth quietly saves hundreds of tiny square photo tiles of every window the intruder views, allowing forensic detectives to piece the intruder screen back together like a mosaic.",
      "technicalCue": "LATERAL & C2: Outbound mstsc.exe Connection, MRU Registry & RDPClient EventID 1024 / 1102 on Source Host -> LATERAL & C2: Destination Server NLA Logon (EventID 4624 Type 10 / 7), RdpCoreTS 131 & LSM EventID 21 / 25 -> EXFIL & IMPACT: Client-Side RDP Bitmap Cache (Cache0000.bin / bmc2-tools) Visual Screen Reconstruction",
      "storyMappings": [
        {
          "storyTerm": "Local desk diary stamping the outgoing booth call",
          "technicalTerm": "Source workstation mstsc.exe MRU registry keys and RDPClient EventID 1024 / 1102",
          "tone": "amber"
        },
        {
          "storyTerm": "Distant server room sign-in book recording the arrival",
          "technicalTerm": "Destination EventID 4624 (LogonType 10/7), RdpCoreTS 131, and LocalSessionManager logs",
          "tone": "sky"
        },
        {
          "storyTerm": "Tiny square photo tiles saved quietly at the local desk",
          "technicalTerm": "Client-side 64x64 pixel RDP Bitmap Cache (Cache0000.bin) under %LOCALAPPDATA%",
          "tone": "rose"
        },
        {
          "storyTerm": "Detectives piecing the intruder screen back together like a mosaic",
          "technicalTerm": "Visual screen reconstruction via bmc2-tools exposing attacker commands on disk",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-rdp-bitmap-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Local desk diary stamping the outgoing…",
          "subtitle": "Source workstation mstsc.exe MRU registry keys and RDPClient…",
          "tone": "amber"
        },
        {
          "id": "ad-rdp-bitmap-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Distant server room sign-in book…",
          "subtitle": "Destination EventID 4624 (LogonType 10/7), RdpCoreTS 131, and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STAGE 01 · LATERAL & C2",
          "title": "Outbound mstsc.exe Connection, MRU Registry & RDPClient EventID 1024 / 1102 on Source Host",
          "storyExcerpt": "At the starting desk, the intruder types a target room address into the remote-viewing console. Even before the distant room answers, the desk personal address book and outgoing call ledger faithfully…",
          "technicalParallel": "Under the hood, the observed step executes mstsc.exe /v:10.10.20.45 (which executes the technical command / telemetry directive , mstsc.exe /v:10.10.20.45 via mstsc.exe, passing the exact arguments…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Door Ip",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "Destination Server NLA Logon (EventID 4624 Type 10 / 7), RdpCoreTS 131 & LSM EventID 21 / 25",
          "storyExcerpt": "When the connection lands in the restricted server room, three separate lobby ledgers wake up in sequence: the front network door logs the arriving IP address, the badge desk logs an interactive remote…",
          "technicalParallel": "Under the hood, the observed step executes RemoteDesktopServices-RdpCoreTS/Operational EventID 131: ClientIP=10.10.4.19:54912 (which executes the technical command / telemetry directive…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Tiny Desk",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Client-Side RDP Bitmap Cache (Cache0000.bin / bmc2-tools) Visual Screen Reconstruction",
          "storyExcerpt": "To keep the remote video screen fast and smooth, the viewer console on the starting desk secretly stores hundreds of 64-by-64-pixel square picture tiles of every button, terminal line, and file folder…",
          "technicalParallel": "Under the hood, the observed step executes Artifact Path: C:\\Users\\admin_db\\AppData\\Local\\Microsoft\\Terminal Server Client\\Cache\\Cache0000.bin (which executes the technical command / telemetry directive…",
          "accentHex": "#10B981",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Source Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Tile Mosaic",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Forensic Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-rdp-lateral-movement-tsclient-bitmap-cache",
      "sectionKey": "step-1",
      "sceneKind": "ad-rdp-bitmap-step-1",
      "stageBadge": "STEP #1 · LATERAL & C2",
      "title": "Outbound mstsc.exe Connection, MRU Registry & RDPClient EventID 1024 / 1102 on Source Host",
      "storyCue": "At the starting desk, the intruder types a target room address into the remote-viewing console. Even before the distant room answers, the desk personal address book and outgoing call ledger faithfully record the destination room and timestamp.",
      "technicalCue": "T1021.001 · LATERAL & C2 — When the attacker launches mstsc.exe on source host WKS-07 (10.10.4.19) to connect to SRV-APP02 (10.10.20.45), Windows records the target IP/hostname in NTUSER.DAT (Software\\Microsoft\\Terminal…",
      "storyMappings": [
        {
          "storyTerm": "Remote-viewing console at the starting desk",
          "technicalTerm": "mstsc.exe launched on source workstation WKS-07 (10.10.4.19)",
          "tone": "amber"
        },
        {
          "storyTerm": "Personal address book saving recent rooms",
          "technicalTerm": "HKCU\\Software\\Microsoft\\Terminal Server Client\\Default MRU registry values",
          "tone": "sky"
        },
        {
          "storyTerm": "Outgoing call ledger recording the destination",
          "technicalTerm": "Microsoft-Windows-TerminalServices-RDPClient/Operational EventID 1024 and 1102",
          "tone": "rose"
        },
        {
          "storyTerm": "Target room down the hall",
          "technicalTerm": "Destination server SRV-APP02 (10.10.20.45) listening on TCP/3389",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-rdp-bitmap-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Remote-viewing console at the starting…",
          "subtitle": "mstsc.exe launched on source workstation WKS-07 (10.10.4.19)",
          "tone": "amber"
        },
        {
          "id": "ad-rdp-bitmap-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Personal address book saving recent rooms",
          "subtitle": "HKCU\\Software\\Microsoft\\Terminal Server Client\\Default MRU…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STEP 01 · SETUP",
          "title": "Remote-viewing console at the starting desk",
          "storyExcerpt": "At the starting desk, the intruder types a target room address into the remote-viewing console.",
          "technicalParallel": "Under the hood, the observed step executes mstsc.exe /v:10.10.20.45 (which executes the technical command / telemetry directive , mstsc.exe /v:10.10.20.45 via mstsc.exe, passing the exact arguments…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Book",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Personal address book saving recent rooms",
          "storyExcerpt": "Even before the distant room answers, the desk personal address book and outgoing call ledger faithfully record the destination room and timestamp.",
          "technicalParallel": "When the attacker launches mstsc.exe on source host WKS-07 (10.10.4.19) to connect to SRV-APP02 (10.10.20.45), Windows records the target IP/hostname in NTUSER.DAT (Software\\Microsoft\\Terminal Server…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Call",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Target room down the hall",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across target room down the hall while locking down outgoing call ledger recording the destination.",
          "technicalParallel": "Documented in WinEvent Event 1024 (recording SourceHost=WKS-07.corp.local , 10.10.4.19, LogChannel=Microsoft-Windows-TerminalServices-RDPClient/Operational, EventID=1024 , Connection Attempt / 1102…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Source Desk",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Tile Mosaic",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Forensic Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1021.001"
    },
    "step-2": {
      "scenarioId": "dfir-rdp-lateral-movement-tsclient-bitmap-cache",
      "sectionKey": "step-2",
      "sceneKind": "ad-rdp-bitmap-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "Destination Server NLA Logon (EventID 4624 Type 10 / 7), RdpCoreTS 131 & LSM EventID 21 / 25",
      "storyCue": "When the connection lands in the restricted server room, three separate lobby ledgers wake up in sequence: the front network door logs the arriving IP address, the badge desk logs an interactive remote check-in, and the session desk notes whether the visitor started a fresh chair or slipped back into a disconnected one.",
      "technicalCue": "T1021.001 · LATERAL & C2 — On destination server SRV-APP02, Microsoft-Windows-RemoteDesktopServices-RdpCoreTS/Operational logs EventID 131 (Client IP:Port 10.10.4.19:54912), Security logs EventID 4624 (LogonType 10…",
      "storyMappings": [
        {
          "storyTerm": "Front network door logging the arriving IP",
          "technicalTerm": "RdpCoreTS/Operational EventID 131 capturing source IP 10.10.4.19",
          "tone": "amber"
        },
        {
          "storyTerm": "Badge desk logging an interactive remote check-in",
          "technicalTerm": "Windows Security EventID 4624 with LogonType 10 (RemoteInteractive) or 7 (Reconnect)",
          "tone": "sky"
        },
        {
          "storyTerm": "Session desk tracking fresh versus reconnected chairs",
          "technicalTerm": "TerminalServices-LocalSessionManager/Operational EventID 21, 24, and 25",
          "tone": "rose"
        },
        {
          "storyTerm": "Pre-entry badge inspection gate",
          "technicalTerm": "Network Level Authentication (NLA) validating credentials before session render",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-rdp-bitmap-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Front network door logging the arriving IP",
          "subtitle": "RdpCoreTS/Operational EventID 131 capturing source IP 10.10.4.19",
          "tone": "amber"
        },
        {
          "id": "ad-rdp-bitmap-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Badge desk logging an interactive remote…",
          "subtitle": "Windows Security EventID 4624 with LogonType 10…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Door Ip",
          "stageTag": "STEP 02 · SETUP",
          "title": "Front network door logging the arriving IP",
          "storyExcerpt": "When the connection lands in the restricted server room, three separate lobby ledgers wake up in sequence: the front network door logs the arriving IP address, the badge desk logs an…",
          "technicalParallel": "Under the hood, the observed step executes RemoteDesktopServices-RdpCoreTS/Operational EventID 131: ClientIP=10.10.4.19:54912 (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Desk",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Badge desk logging an interactive remote check-in",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses badge desk logging an interactive remote check-in to advance toward session desk tracking fresh versus reconnected chairs.",
          "technicalParallel": "On destination server SRV-APP02, Microsoft-Windows-RemoteDesktopServices-RdpCoreTS/Operational logs EventID 131 (Client IP:Port 10.10.4.19:54912), Security logs EventID 4624 (LogonType 10…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Desk",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Pre-entry badge inspection gate",
          "storyExcerpt": "Behind the scenes, pre-entry badge inspection gate captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 21 (recording LogChannel=TerminalServices-LocalSessionManager/Operational, EventID=21 , Session Logon / 25 , Session Reconnect / 24 , Disconnect, SessionId=2…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Source Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Tile Mosaic",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Forensic Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1021.001"
    },
    "step-3": {
      "scenarioId": "dfir-rdp-lateral-movement-tsclient-bitmap-cache",
      "sectionKey": "step-3",
      "sceneKind": "ad-rdp-bitmap-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Client-Side RDP Bitmap Cache (Cache0000.bin / bmc2-tools) Visual Screen Reconstruction",
      "storyCue": "To keep the remote video screen fast and smooth, the viewer console on the starting desk secretly stores hundreds of 64-by-64-pixel square picture tiles of every button, terminal line, and file folder shown on screen, leaving behind a visual mosaic that investigators can stitch back together even after the intruder clears every text log.",
      "technicalCue": "T1021.001 · EXFIL & IMPACT — During the interactive session on SRV-APP02, mstsc.exe on WKS-07 caches 64x64 pixel screen tiles inside %LOCALAPPDATA%\\Microsoft\\Terminal Server Client\\Cache\\Cache0000.bin (and bcache24.bmc).",
      "storyMappings": [
        {
          "storyTerm": "Hundreds of square picture tiles saved for speed",
          "technicalTerm": "Persistent 64x64 pixel RDP Bitmap Cache files (Cache0000.bin / bcache24.bmc)",
          "tone": "amber"
        },
        {
          "storyTerm": "Hidden desk drawer storing the tiles",
          "technicalTerm": "%LOCALAPPDATA%\\Microsoft\\Terminal Server Client\\Cache on WKS-07",
          "tone": "sky"
        },
        {
          "storyTerm": "Stitching the mosaic back together",
          "technicalTerm": "Forensic parsing with bmc2-tools rendering visual screenshots of attacker activity",
          "tone": "rose"
        },
        {
          "storyTerm": "Evidence surviving cleared text logs",
          "technicalTerm": "Client-side visual proof of commands typed on SRV-APP02",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-rdp-bitmap-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Hundreds of square picture tiles saved…",
          "subtitle": "Persistent 64x64 pixel RDP Bitmap Cache files (Cache0000.bin /…",
          "tone": "amber"
        },
        {
          "id": "ad-rdp-bitmap-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Hidden desk drawer storing the tiles",
          "subtitle": "%LOCALAPPDATA%\\Microsoft\\Terminal Server Client\\Cache on WKS-07",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Keep Fast",
          "stageTag": "STEP 03 · SETUP",
          "title": "Hundreds of square picture tiles saved for speed",
          "storyExcerpt": "To keep the remote video screen fast and smooth, the viewer console on the starting desk secretly stores hundreds of 64-by-64-pixel square picture tiles of every button, terminal line, and file…",
          "technicalParallel": "Under the hood, the observed step executes Artifact Path: C:\\Users\\admin_db\\AppData\\Local\\Microsoft\\Terminal Server Client\\Cache\\Cache0000.bin (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Desk",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Hidden desk drawer storing the tiles",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses hidden desk drawer storing the tiles to advance toward stitching the mosaic back together.",
          "technicalParallel": "During the interactive session on SRV-APP02, mstsc.exe on WKS-07 caches 64x64 pixel screen tiles inside %LOCALAPPDATA%\\Microsoft\\Terminal Server Client\\Cache\\Cache0000.bin (and bcache24.bmc).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Back",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Evidence surviving cleared text logs",
          "storyExcerpt": "Behind the scenes, evidence surviving cleared text logs captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 11 (recording ArtifactFile=%LOCALAPPDATA%\\Microsoft\\Terminal Server Client\\Cache\\Cache0000.bin, TileDimensions=64x64 Raw Bitmap Tiles, ForensicParser=ANSSI bmc-tools.py +…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Source Desk",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Tile Mosaic",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Forensic Beam",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1021.001"
    }
  },
  "dfir-smb-ntlm-relay-petitpotam-efs-lsarpc-coercion": {
    "briefing": {
      "scenarioId": "dfir-smb-ntlm-relay-petitpotam-efs-lsarpc-coercion",
      "sectionKey": "briefing",
      "sceneKind": "ad-ntlm-relay-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1187",
      "title": "MS-EFSRPC PetitPotam Coercion (Zeek dce_rpc) & NTLM Relay Forensics (EID… — Story-to-Technical Overview",
      "storyCue": "Imagine a fortified courthouse whose encrypted-file clerk is required to inspect any document path mentioned by an outside caller. A trickster phones the clerk naming a fake folder sitting at the trickster own street booth; obediently, the courthouse chief courier marches straight out to the street booth flashing the courthouse master identity badge, while the trickster holds up a live mirror reflecting that exact badge straight into a neighboring notary office to mint a permanent master credential.",
      "technicalCue": "CREDENTIAL ACCESS: MS-EFSRPC Bind Over \\pipe\\lsarpc & EfsRpcOpenFileRaw Coercion (Zeek dce_rpc.log & EventID 5145) -> CREDENTIAL ACCESS: Coerced Machine Account (CORP-DC01$) Outbound SMB NTLMv2 Callback to Attacker Listener -> LATERAL & C2: Cross-Protocol NTLM Relay to HTTP/LDAP & Anomalous EventID 4624 IpAddress Mismatch",
      "storyMappings": [
        {
          "storyTerm": "Trickster phoning the encrypted-file clerk with a fake street-booth path",
          "technicalTerm": "PetitPotam MS-EFSRPC EfsRpcOpenFileRaw coercion over \\pipe\\lsarpc",
          "tone": "amber"
        },
        {
          "storyTerm": "Courthouse chief courier marching out flashing the master badge",
          "technicalTerm": "Coerced CORP-DC01$ (System PID 4) outbound SMB NTLMv2 authentication to attacker IP",
          "tone": "sky"
        },
        {
          "storyTerm": "Live mirror reflecting the badge into a neighboring notary office",
          "technicalTerm": "Cross-protocol NTLM relay (SMB to HTTP/LDAP) forwarding NTLMSSP_NEGOTIATE and NTLMSSP_AUTH",
          "tone": "rose"
        },
        {
          "storyTerm": "Audit discrepancy exposing the mirror trick",
          "technicalTerm": "Target Security EventID 4624 where CORP-DC01$ authenticates from an attacker workstation IP",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-ntlm-relay-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Trickster phoning the encrypted-file…",
          "subtitle": "PetitPotam MS-EFSRPC EfsRpcOpenFileRaw coercion over…",
          "tone": "amber"
        },
        {
          "id": "ad-ntlm-relay-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Courthouse chief courier marching out…",
          "subtitle": "Coerced CORP-DC01$ (System PID 4) outbound SMB NTLMv2…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Fake Path",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "MS-EFSRPC Bind Over \\pipe\\lsarpc & EfsRpcOpenFileRaw Coercion (Zeek dce_rpc.log & EventID 5145)",
          "storyExcerpt": "Ringing the courthouse built-in encrypted-file service counter over an open office pipe, the trickster asks the clerk to open a raw file located at a street address owned by the trickster, forcing the…",
          "technicalParallel": "Under the hood, the observed step executes Zeek dce_rpc.log: named_pipe=\"lsarpc\" uuid=\"c681d488-d850-11d0-8c52-00c04fd90f7e\" operation=\"EfsRpcOpenFileRaw\" (which Connects to the MS-EFSRPC named pipe…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Core Own",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "Coerced Machine Account (CORP-DC01$) Outbound SMB NTLMv2 Callback to Attacker Listener",
          "storyExcerpt": "Obeying the file-opening request immediately, the courthouse core engine dispatches its own official machine courier straight out to the trickster street booth and dutifully flashes its cryptographically…",
          "technicalParallel": "Under the hood, the observed step executes Microsoft-Windows-NTLM/Operational EventID 8001: Outgoing NTLM authentication to target \"\\\\10.10.4.99\" (which executes the technical command / telemetry…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Real-time",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "Cross-Protocol NTLM Relay to HTTP/LDAP & Anomalous EventID 4624 IpAddress Mismatch",
          "storyExcerpt": "Instead of answering the courier themselves, the trickster holds up a real-time mirror that bounces every handshake phrase straight into a neighboring certificate notary office lacking tamper-proof…",
          "technicalParallel": "Under the hood, the observed step executes Security EventID 4624: LogonType=3 AuthenticationPackageName=NTLM TargetUserName=CORP-DC01$ WorkstationName=CORP-DC01 IpAddress=10.10.4.99 (which executes the…",
          "accentHex": "#F43F5E",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Relay Mirror",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Notary Office",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Badge Bounce",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-smb-ntlm-relay-petitpotam-efs-lsarpc-coercion",
      "sectionKey": "step-1",
      "sceneKind": "ad-ntlm-relay-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "MS-EFSRPC Bind Over \\pipe\\lsarpc & EfsRpcOpenFileRaw Coercion (Zeek dce_rpc.log & EventID 5145)",
      "storyCue": "Ringing the courthouse built-in encrypted-file service counter over an open office pipe, the trickster asks the clerk to open a raw file located at a street address owned by the trickster, forcing the courthouse to initiate an outgoing house call.",
      "technicalCue": "T1187 · CREDENTIAL ACCESS — The attacker binds to the MS-EFSRPC interface UUID c681d488-d850-11d0-8c52-00c04fd90f7e exposed on \\pipe\\lsarpc (or UUID df1941c5-fe89-4e79-bf10-463657acf44d on \\pipe\\efsrpc) on CORP-DC01 and…",
      "storyMappings": [
        {
          "storyTerm": "Built-in encrypted-file service counter",
          "technicalTerm": "MS-EFSRPC interface UUID c681d488-d850-11d0-8c52-00c04fd90f7e on \\pipe\\lsarpc",
          "tone": "amber"
        },
        {
          "storyTerm": "Asking the clerk to open a file at the trickster street address",
          "technicalTerm": "PetitPotam calling EfsRpcOpenFileRaw() pointing to \\\\attacker-ip\\share\\file",
          "tone": "sky"
        },
        {
          "storyTerm": "Wiretap catching the unusual clerk call",
          "technicalTerm": "Zeek dce_rpc.log capturing EfsRpcOpenFileRaw invocation targeting a Domain Controller",
          "tone": "rose"
        },
        {
          "storyTerm": "Forcing an outgoing house call",
          "technicalTerm": "Authentication coercion triggering an involuntary outbound server connection",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-ntlm-relay-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Built-in encrypted-file service counter",
          "subtitle": "MS-EFSRPC interface UUID c681d488-d850-11d0-8c52-00c04fd90f7e…",
          "tone": "amber"
        },
        {
          "id": "ad-ntlm-relay-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Asking the clerk to open a file at the…",
          "subtitle": "PetitPotam calling EfsRpcOpenFileRaw() pointing to…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Over Open",
          "stageTag": "STEP 01 · SETUP",
          "title": "Built-in encrypted-file service counter",
          "storyExcerpt": "Ringing the courthouse built-in encrypted-file service counter over an open office pipe, the trickster asks the clerk to open a raw file located at a street address owned by the trickster…",
          "technicalParallel": "Under the hood, the observed step executes Zeek dce_rpc.log: named_pipe=\"lsarpc\" uuid=\"c681d488-d850-11d0-8c52-00c04fd90f7e\" operation=\"EfsRpcOpenFileRaw\" (which Connects to the MS-EFSRPC named pipe…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Open File",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Asking the clerk to open a file at the trickster…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses asking the clerk to open a file at the trickster street address to advance toward wiretap catching the unusual clerk call.",
          "technicalParallel": "The attacker binds to the MS-EFSRPC interface UUID c681d488-d850-11d0-8c52-00c04fd90f7e exposed on \\pipe\\lsarpc (or UUID df1941c5-fe89-4e79-bf10-463657acf44d on \\pipe\\efsrpc) on CORP-DC01 and invokes…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Call",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Forcing an outgoing house call",
          "storyExcerpt": "Behind the scenes, forcing an outgoing house call captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 5145 (recording ZeekLogStream=dce_rpc.log + Security EventID 5145, NamedPipe=\\pipe\\lsarpc , or \\pipe\\efsrpc, RpcInterfaceUuid=c681d488-d850-11d0-8c52-00c04fd90f7e…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Relay Mirror",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Notary Office",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Badge Bounce",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1187"
    },
    "step-2": {
      "scenarioId": "dfir-smb-ntlm-relay-petitpotam-efs-lsarpc-coercion",
      "sectionKey": "step-2",
      "sceneKind": "ad-ntlm-relay-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Coerced Machine Account (CORP-DC01$) Outbound SMB NTLMv2 Callback to Attacker Listener",
      "storyCue": "Obeying the file-opening request immediately, the courthouse core engine dispatches its own official machine courier straight out to the trickster street booth and dutifully flashes its cryptographically signed courthouse badge to open the door.",
      "technicalCue": "T1187 · CREDENTIAL ACCESS — In response to EfsRpcOpenFileRaw, the NT kernel on CORP-DC01 (System PID 4) immediately initiates an outbound SMB TCP 445 connection from 10.10.0.10 to the attacker IP 10.10.4.99 authenticating…",
      "storyMappings": [
        {
          "storyTerm": "Courthouse core engine dispatching its own courier",
          "technicalTerm": "Windows NT kernel (System PID 4) on CORP-DC01 opening outbound TCP/445 SMB",
          "tone": "amber"
        },
        {
          "storyTerm": "Flashing the cryptographically signed courthouse badge",
          "technicalTerm": "Outbound NTLMv2 challenge-response authentication as machine account CORP-DC01$",
          "tone": "sky"
        },
        {
          "storyTerm": "Trickster street booth receiving the courier",
          "technicalTerm": "Attacker-controlled ntlmrelayx listener capturing the incoming SMB handshake",
          "tone": "rose"
        },
        {
          "storyTerm": "Unusual outbound visit from a master vault",
          "technicalTerm": "Domain Controller initiating outbound SMB traffic to an untrusted workstation IP",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-ntlm-relay-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Courthouse core engine dispatching its…",
          "subtitle": "Windows NT kernel (System PID 4) on CORP-DC01 opening outbound…",
          "tone": "amber"
        },
        {
          "id": "ad-ntlm-relay-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Flashing the cryptographically signed…",
          "subtitle": "Outbound NTLMv2 challenge-response authentication as machine…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Core Own",
          "stageTag": "STEP 02 · SETUP",
          "title": "Courthouse core engine dispatching its own courier",
          "storyExcerpt": "Obeying the file-opening request immediately, the courthouse core engine dispatches its own official machine courier straight out to the trickster street booth and dutifully flashes its…",
          "technicalParallel": "Under the hood, the observed step executes Microsoft-Windows-NTLM/Operational EventID 8001: Outgoing NTLM authentication to target \"\\\\10.10.4.99\" (which executes the technical command / telemetry…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Flashing the cryptographically signed courthouse badge",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses flashing the cryptographically signed courthouse badge to advance toward trickster street booth receiving the courier.",
          "technicalParallel": "In response to EfsRpcOpenFileRaw, the NT kernel on CORP-DC01 (System PID 4) immediately initiates an outbound SMB TCP 445 connection from 10.10.0.10 to the attacker IP 10.10.4.99 authenticating as…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. File-opening Own",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Unusual outbound visit from a master vault",
          "storyExcerpt": "Behind the scenes, unusual outbound visit from a master vault captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 8001 (recording LogChannel=Microsoft-Windows-NTLM/Operational, EventID=8001 , Outgoing NTLM Authentication Audit, CoercedAccount=CORP\\CORP-DC01$ , Domain Controller Machine…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Relay Mirror",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Notary Office",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Badge Bounce",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1187"
    },
    "step-3": {
      "scenarioId": "dfir-smb-ntlm-relay-petitpotam-efs-lsarpc-coercion",
      "sectionKey": "step-3",
      "sceneKind": "ad-ntlm-relay-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "Cross-Protocol NTLM Relay to HTTP/LDAP & Anomalous EventID 4624 IpAddress Mismatch",
      "storyCue": "Instead of answering the courier themselves, the trickster holds up a real-time mirror that bounces every handshake phrase straight into a neighboring certificate notary office lacking tamper-proof channel seals, minting a headquarters directory badge while leaving an impossible address mismatch in the notary guestbook.",
      "technicalCue": "T1557.001 · LATERAL & C2 — The attacker relays the NTLMSSP_NEGOTIATE and NTLMSSP_AUTH messages from CORP-DC01$ to a secondary server (such as AD CS HTTP /certsrv/ or LDAP lacking channel binding/signing).",
      "storyMappings": [
        {
          "storyTerm": "Real-time mirror bouncing every handshake phrase",
          "technicalTerm": "Cross-protocol NTLM relay forwarding NTLMSSP_NEGOTIATE and NTLMSSP_AUTH messages",
          "tone": "amber"
        },
        {
          "storyTerm": "Neighboring notary office lacking tamper-proof channel seals",
          "technicalTerm": "AD CS HTTP enrollment (/certsrv) or LDAP server without EPA / signing enabled",
          "tone": "sky"
        },
        {
          "storyTerm": "Impossible address mismatch in the notary guestbook",
          "technicalTerm": "Security EventID 4624 showing TargetUserName=CORP-DC01$ arriving from attacker IP",
          "tone": "rose"
        },
        {
          "storyTerm": "Minting a permanent master courthouse badge",
          "technicalTerm": "Issued CORP-DC01$ certificate or RBCD delegation granting full domain compromise",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-ntlm-relay-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Real-time mirror bouncing every…",
          "subtitle": "Cross-protocol NTLM relay forwarding NTLMSSP_NEGOTIATE and…",
          "tone": "amber"
        },
        {
          "id": "ad-ntlm-relay-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Neighboring notary office lacking…",
          "subtitle": "AD CS HTTP enrollment (/certsrv) or LDAP server without EPA /…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Real-time",
          "stageTag": "STEP 03 · SETUP",
          "title": "Real-time mirror bouncing every handshake phrase",
          "storyExcerpt": "Instead of answering the courier themselves, the trickster holds up a real-time mirror that bounces every handshake phrase straight into a neighboring certificate notary office lacking…",
          "technicalParallel": "Under the hood, the observed step executes Security EventID 4624: LogonType=3 AuthenticationPackageName=NTLM TargetUserName=CORP-DC01$ WorkstationName=CORP-DC01 IpAddress=10.10.4.99 (which executes the…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Neighboring notary office lacking tamper-proof…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses neighboring notary office lacking tamper-proof channel seals to advance toward impossible address mismatch in the notary guestbook.",
          "technicalParallel": "The attacker relays the NTLMSSP_NEGOTIATE and NTLMSSP_AUTH messages from CORP-DC01$ to a secondary server (such as AD CS HTTP /certsrv/ or LDAP lacking channel binding/signing).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Up Real-time",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Minting a permanent headquarters directory vault badge",
          "storyExcerpt": "Behind the scenes, minting a permanent headquarters directory vault badge captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 4624 (recording EventID=4624 , Relayed Network LogonType 3, RelayedIdentity=CORP\\CORP-DC01$ , Expected IP 10.10.0.10, ActualSourceIp=10.10.4.99 , Attacker NTLM Relay Host…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Relay Mirror",
          "position": [
            -6.3,
            4.2,
            8.4
          ],
          "target": [
            -4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Notary Office",
          "position": [
            4.3,
            4.2,
            8.4
          ],
          "target": [
            2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Badge Bounce",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1557.001"
    }
  },
  "dfir-smb-psexec-named-pipe-eid5145-7045": {
    "briefing": {
      "scenarioId": "dfir-smb-psexec-named-pipe-eid5145-7045",
      "sectionKey": "briefing",
      "sceneKind": "ad-smb-psexec-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1021.002",
      "title": "SMB ADMIN$ Share, PSEXESVC Named Pipe & Service Install Forensics (EID… — Story-to-Technical Overview",
      "storyCue": "Imagine an intruder standing in a corridor who drops a remote worker kit onto a neighbor administrative loading dock, phones the shift foreman to register that kit as a brand-new building service, and hooks up a control tube plus three pneumatic speaking tubes (one to send typed orders, one to hear normal replies, and one to hear error shouts) straight back to their own desk, leaving a crisp four-step trail even if they repaint the kit name.",
      "technicalCue": "LATERAL & C2: SMB ADMIN$ Share Write & IPC$ svcctl RPC Bind (Security EventID 5140 & 5145) -> EXECUTION: Remote Service Installation via SCM CreateServiceW (System EventID 7045 & Security EventID 4697) -> EXECUTION: Named Pipe Stdin/Stdout/Stderr Redirection (Sysmon EventID 17 & 18)",
      "storyMappings": [
        {
          "storyTerm": "Dropping the worker kit onto the administrative loading dock",
          "technicalTerm": "SMB ADMIN$ write and IPC$ svcctl bind logged by EventID 5140 and 5145",
          "tone": "amber"
        },
        {
          "storyTerm": "Phoning the shift foreman to register a brand-new service",
          "technicalTerm": "services.exe CreateServiceW over \\pipe\\svcctl logged by System EventID 7045",
          "tone": "sky"
        },
        {
          "storyTerm": "Control tube plus three pneumatic speaking tubes",
          "technicalTerm": "PSEXESVC named pipes for control, stdin, stdout, and stderr (Sysmon EventID 17 & 18)",
          "tone": "rose"
        },
        {
          "storyTerm": "Detectable even after repainting the kit name",
          "technicalTerm": "Behavioral named-pipe triplet signature surviving PsExec -r binary renaming",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-smb-psexec-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Dropping the worker kit onto the…",
          "subtitle": "SMB ADMIN$ write and IPC$ svcctl bind logged by EventID 5140…",
          "tone": "amber"
        },
        {
          "id": "ad-smb-psexec-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Phoning the shift foreman to register a…",
          "subtitle": "services.exe CreateServiceW over \\pipe\\svcctl logged by System…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Kit Onto",
          "stageTag": "STAGE 01 · LATERAL & C2",
          "title": "SMB ADMIN$ Share Write & IPC$ svcctl RPC Bind (Security EventID 5140 & 5145)",
          "storyExcerpt": "From a neighboring workstation, the intruder unlocks the target administrative loading bay, drops a packaged service helper onto the dock, and opens the shift-foreman intercom channel to prepare an…",
          "technicalParallel": "Under the hood, the observed step executes PsExec.exe -accepteula \\\\10.10.20.15 -s cmd.exe (which Uploads a service binary , such as PSEXESVC.exe over SMB2/3 to the target's administrative…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Over Onto",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "Remote Service Installation via SCM CreateServiceW (System EventID 7045 & Security EventID 4697)",
          "storyExcerpt": "Receiving the installation order over the foreman intercom, the building shift supervisor writes a brand-new service entry onto the master roster and starts the uploaded helper with full building-wide…",
          "technicalParallel": "Under the hood, the observed step executes RPC svcctl: RCreateServiceW(lpServiceName=\"PSEXESVC\", lpBinaryPathName=\"%SystemRoot%\\PSEXESVC.exe\") (which Uploads a service binary , such as PSEXESVC.exe over…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Name Over",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "Named Pipe Stdin/Stdout/Stderr Redirection (Sysmon EventID 17 & 18)",
          "storyExcerpt": "Even if the intruder paints a brand-new cover name over the worker kit to dodge simple name filters, the live helper still opens one master control pipe and three matching pneumatic speaking tubes (one…",
          "technicalParallel": "Under the hood, the observed step executes Sysmon EventID 17 (PipeCreated): PipeName=\\PSEXESVC-WKS04-3104-stdin (which executes the technical command / telemetry directive , Sysmon EventID 17…",
          "accentHex": "#38BDF8",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Speaking Tubes",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Service Roster",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Pipe Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-smb-psexec-named-pipe-eid5145-7045",
      "sectionKey": "step-1",
      "sceneKind": "ad-smb-psexec-step-1",
      "stageBadge": "STEP #1 · LATERAL & C2",
      "title": "SMB ADMIN$ Share Write & IPC$ svcctl RPC Bind (Security EventID 5140 & 5145)",
      "storyCue": "From a neighboring workstation, the intruder unlocks the target administrative loading bay, drops a packaged service helper onto the dock, and opens the shift-foreman intercom channel to prepare an installation order.",
      "technicalCue": "T1021.002 · LATERAL & C2 — The attacker executes PsExec.exe \\\\10.10.20.15 -s cmd.exe.",
      "storyMappings": [
        {
          "storyTerm": "Administrative loading bay",
          "technicalTerm": "Remote SMB ADMIN$ share accessed on 10.10.20.15 (Security EventID 5140)",
          "tone": "amber"
        },
        {
          "storyTerm": "Dropping the packaged service helper onto the dock",
          "technicalTerm": "Security EventID 5145 logging PSEXESVC.exe creation inside ADMIN$",
          "tone": "sky"
        },
        {
          "storyTerm": "Shift-foreman intercom channel",
          "technicalTerm": "SMB IPC$ RPC bind to \\pipe\\svcctl (Service Control Manager interface)",
          "tone": "rose"
        },
        {
          "storyTerm": "Remote launch order",
          "technicalTerm": "Attacker running PsExec.exe \\\\10.10.20.15 -s cmd.exe",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-smb-psexec-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Administrative loading bay",
          "subtitle": "Remote SMB ADMIN$ share accessed on 10.10.20.15 (Security…",
          "tone": "amber"
        },
        {
          "id": "ad-smb-psexec-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Dropping the packaged service helper…",
          "subtitle": "Security EventID 5145 logging PSEXESVC.exe creation inside…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Bay Onto",
          "stageTag": "STEP 01 · SETUP",
          "title": "Administrative loading bay",
          "storyExcerpt": "From a neighboring workstation, the intruder unlocks the target administrative loading bay, drops a packaged service helper onto the dock, and opens the shift-foreman intercom channel to…",
          "technicalParallel": "Under the hood, the observed step executes PsExec.exe -accepteula \\\\10.10.20.15 -s cmd.exe (which Uploads a service binary , such as PSEXESVC.exe over SMB2/3 to the target's administrative…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Onto Dock",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Dropping the packaged service helper onto the dock",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses dropping the packaged service helper onto the dock to advance toward shift-foreman intercom channel.",
          "technicalParallel": "The attacker executes PsExec.exe \\\\10.10.20.15 -s cmd.exe.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Bay Onto",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Remote launch order",
          "storyExcerpt": "Behind the scenes, remote launch order captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 5145 (recording EventID=5145 , Detailed File Share Audit, ShareName=\\\\*\\ADMIN$ , C:\\Windows, RelativeTargetName=PSEXESVC.exe, AccessMask=0x2 , WriteData under T1021.002)…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Speaking Tubes",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Service Roster",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Pipe Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1021.002"
    },
    "step-2": {
      "scenarioId": "dfir-smb-psexec-named-pipe-eid5145-7045",
      "sectionKey": "step-2",
      "sceneKind": "ad-smb-psexec-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Remote Service Installation via SCM CreateServiceW (System EventID 7045 & Security EventID 4697)",
      "storyCue": "Receiving the installation order over the foreman intercom, the building shift supervisor writes a brand-new service entry onto the master roster and starts the uploaded helper with full building-wide master keys.",
      "technicalCue": "T1569.002 · EXECUTION — Over the \\pipe\\svcctl RPC interface, the Service Control Manager (services.exe) invokes CreateServiceW and logs System EventID 7045 (A service was installed in the system) and Security EventID…",
      "storyMappings": [
        {
          "storyTerm": "Building shift supervisor",
          "technicalTerm": "Windows Service Control Manager (services.exe) invoking CreateServiceW",
          "tone": "amber"
        },
        {
          "storyTerm": "Brand-new service entry on the master roster",
          "technicalTerm": "System EventID 7045 (A service was installed in the system) for PSEXESVC",
          "tone": "sky"
        },
        {
          "storyTerm": "Starting the helper with master keys",
          "technicalTerm": "PSEXESVC.exe spawning cmd.exe under NT AUTHORITY\\SYSTEM (Sysmon EventID 1)",
          "tone": "rose"
        },
        {
          "storyTerm": "Temporary registration cleaned up afterward",
          "technicalTerm": "Short-lived remote execution service whose EventID 7045 log persists on disk",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-smb-psexec-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Building shift supervisor",
          "subtitle": "Windows Service Control Manager (services.exe) invoking…",
          "tone": "amber"
        },
        {
          "id": "ad-smb-psexec-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Brand-new service entry on the master…",
          "subtitle": "System EventID 7045 (A service was installed in the system)…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Over Onto",
          "stageTag": "STEP 02 · SETUP",
          "title": "Building shift supervisor",
          "storyExcerpt": "Receiving the installation order over the foreman intercom, the building shift supervisor writes a brand-new service entry onto the master roster and starts the uploaded helper with full…",
          "technicalParallel": "Under the hood, the observed step executes RPC svcctl: RCreateServiceW(lpServiceName=\"PSEXESVC\", lpBinaryPathName=\"%SystemRoot%\\PSEXESVC.exe\") (which Uploads a service binary , such as PSEXESVC.exe over…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Keys",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Brand-new service entry on the master roster",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses brand-new service entry on the master roster to advance toward starting the helper with master keys.",
          "technicalParallel": "Over the \\pipe\\svcctl RPC interface, the Service Control Manager (services.exe) invokes CreateServiceW and logs System EventID 7045 (A service was installed in the system) and Security EventID 4697 with…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Keys",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Temporary registration cleaned up afterward",
          "storyExcerpt": "Behind the scenes, temporary registration cleaned up afterward captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 7045 (recording EventID=7045 , System SCM / 4697 , Security, ServiceName=PSEXESVC, ServiceFileName=%SystemRoot%\\PSEXESVC.exe, ServiceAccount=LocalSystem under T1569.002)…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Speaking Tubes",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Service Roster",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Pipe Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1569.002"
    },
    "step-3": {
      "scenarioId": "dfir-smb-psexec-named-pipe-eid5145-7045",
      "sectionKey": "step-3",
      "sceneKind": "ad-smb-psexec-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "Named Pipe Stdin/Stdout/Stderr Redirection (Sysmon EventID 17 & 18)",
      "storyCue": "Even if the intruder paints a brand-new cover name over the worker kit to dodge simple name filters, the live helper still opens one master control pipe and three matching pneumatic speaking tubes (one for incoming commands, one for normal output, and one for error messages), creating a dead-giveaway architectural fingerprint.",
      "technicalCue": "T1569.002 · EXECUTION — Even if the attacker renames the binary using PsExec -r, PSEXESVC.exe creates a control pipe and three I/O redirection named pipes matching \\PSEXESVC-<Host>-<PID>-stdin, -stdout, and -stderr.",
      "storyMappings": [
        {
          "storyTerm": "Painting a brand-new cover name over the kit",
          "technicalTerm": "Using PsExec -r <custom_name> to rename the service and binary",
          "tone": "amber"
        },
        {
          "storyTerm": "Master control pipe",
          "technicalTerm": "Control named pipe coordinating interactive command session startup",
          "tone": "sky"
        },
        {
          "storyTerm": "Three pneumatic speaking tubes (commands, output, errors)",
          "technicalTerm": "Paired stdin, stdout, and stderr named pipes (e.g., *-stdin, *-stdout, *-stderr)",
          "tone": "rose"
        },
        {
          "storyTerm": "Architectural fingerprint caught by hallway sensors",
          "technicalTerm": "Sysmon EventID 17 (PipeEvent Created) and EventID 18 (PipeEvent Connected)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-smb-psexec-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Painting a brand-new cover name over the…",
          "subtitle": "Using PsExec -r <custom_name> to rename the service and binary",
          "tone": "amber"
        },
        {
          "id": "ad-smb-psexec-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Master control pipe",
          "subtitle": "Control named pipe coordinating interactive command session…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Name Over",
          "stageTag": "STEP 03 · SETUP",
          "title": "Painting a brand-new cover name over the kit",
          "storyExcerpt": "Even if the intruder paints a brand-new cover name over the worker kit to dodge simple name filters, the live helper still opens one master control pipe and three matching pneumatic speaking…",
          "technicalParallel": "Under the hood, the observed step executes Sysmon EventID 17 (PipeCreated): PipeName=\\PSEXESVC-WKS04-3104-stdin (which executes the technical command / telemetry directive , Sysmon EventID 17…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Pipe",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Master control pipe",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses master control pipe to advance toward three pneumatic speaking tubes (commands, output, errors).",
          "technicalParallel": "Even if the attacker renames the binary using PsExec -r, PSEXESVC.exe creates a control pipe and three I/O redirection named pipes matching \\PSEXESVC-<Host>-<PID>-stdin, -stdout, and -stderr.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Even If",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Architectural fingerprint caught by hallway sensors",
          "storyExcerpt": "Behind the scenes, architectural fingerprint caught by hallway sensors captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 17 (recording EventID=17 , PipeCreated / 18 , PipeConnected, Image=C:\\Windows\\PSEXESVC.exe, PipeNamePattern=\\PSEXESVC-<HOST>-<PID>-{stdin,stdout,stderr}…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Speaking Tubes",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Service Roster",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Pipe Audit",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1569.002"
    }
  },
  "dfir-winrm-wsman-remote-powershell-eid91-4624": {
    "briefing": {
      "scenarioId": "dfir-winrm-wsman-remote-powershell-eid91-4624",
      "sectionKey": "briefing",
      "sceneKind": "ad-winrm-wsman-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1021.006",
      "title": "WinRM / WS-Management Lateral Movement & wsmprovhost.exe Forensics — Story-to-Technical Overview",
      "storyCue": "Imagine a corporate office tower linked by a fast pneumatic canister-tube system built for remote IT administration. An intruder sitting at an ordinary desk drops a sealed command canister down the tube to a database server, where the receiving dock opens a dedicated remote-command bench and executes every instruction inside while both sending and receiving ledgers stamp detailed receipts of the canister and every line of code run.",
      "technicalCue": "LATERAL & C2: Outbound WSMan Session Initialization on Source Host (WinRM EventID 142 & 6) -> LATERAL & C2: Destination Server WSMan Shell Creation (WinRM EventID 91 & Security EventID 4624 Type 3) -> EXECUTION: wsmprovhost.exe Child Process Spawning & ServerRemoteHost ScriptBlock Logging (Sysmon EID 1 & PS 4104)",
      "storyMappings": [
        {
          "storyTerm": "Dropping a sealed command canister from the sending desk",
          "technicalTerm": "Invoke-Command initiating outbound WSMan session (WinRM EventID 142 & 6 on source)",
          "tone": "amber"
        },
        {
          "storyTerm": "Receiving dock accepting the canister on the database server",
          "technicalTerm": "HTTP.sys POST /wsman on TCP/5985 logging WinRM EventID 91 and Security EventID 4624",
          "tone": "sky"
        },
        {
          "storyTerm": "Dedicated remote-command bench running the instructions",
          "technicalTerm": "wsmprovhost.exe -Embedding spawning child tools with ServerRemoteHost ScriptBlock logs",
          "tone": "rose"
        },
        {
          "storyTerm": "Paired receipts stamped on both sending and receiving desks",
          "technicalTerm": "Correlated source WinRM EventID 6, target EventID 91, and PowerShell EventID 4104",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#10B981",
      "durationSec": 18,
      "callouts": [
        {
          "id": "ad-winrm-wsman-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Dropping a sealed command canister from…",
          "subtitle": "Invoke-Command initiating outbound WSMan session (WinRM…",
          "tone": "amber"
        },
        {
          "id": "ad-winrm-wsman-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Receiving dock accepting the canister on…",
          "subtitle": "HTTP.sys POST /wsman on TCP/5985 logging WinRM EventID 91 and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STAGE 01 · LATERAL & C2",
          "title": "Outbound WSMan Session Initialization on Source Host (WinRM EventID 142 & 6)",
          "storyExcerpt": "At the originating workstation, the intruder loads an automated script into a sealed remote-administration canister and launches it through the campus pneumatic tube toward the target database server…",
          "technicalParallel": "Under the hood, the observed step executes Invoke-Command -ComputerName SRV-SQL01.corp.local -ScriptBlock { procdump64.exe -accepteula -ma lsass.exe C:\\Temp\\sql.dmp } (which invokes the Windows…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Tube",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "Destination Server WSMan Shell Creation (WinRM EventID 91 & Security EventID 4624 Type 3)",
          "storyExcerpt": "When the canister pops into the receiving tube at the database server, the front door receptionist stamps the visitor network arrival pass and immediately opens a freshly numbered remote workbench slot…",
          "technicalParallel": "Under the hood, the observed step executes Destination WinRM/Operational EventID 91: Creating WSMan shell with ResourceUri http://schemas.microsoft.com/powershell/Microsoft.PowerShell (clientIP…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Slot Up",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "wsmprovhost.exe Child Process Spawning & ServerRemoteHost ScriptBlock Logging (Sysmon EID 1 & PS 4104)",
          "storyExcerpt": "Inside the newly opened workbench slot, a dedicated remote-host clerk wakes up to run the intruder commands and child utilities, while the room built-in security camera records the full verbatim…",
          "technicalParallel": "Under the hood, the observed step executes Sysmon EventID 1: ParentImage=C:\\Windows\\System32\\wsmprovhost.exe -> Image=C:\\Users\\Public\\procdump64.exe (which executes the technical command / telemetry…",
          "accentHex": "#10B981",
          "startSec": 12,
          "endSec": 18
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Tube Launcher",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Remote Bench",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Receipt Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ]
    },
    "step-1": {
      "scenarioId": "dfir-winrm-wsman-remote-powershell-eid91-4624",
      "sectionKey": "step-1",
      "sceneKind": "ad-winrm-wsman-step-1",
      "stageBadge": "STEP #1 · LATERAL & C2",
      "title": "Outbound WSMan Session Initialization on Source Host (WinRM EventID 142 & 6)",
      "storyCue": "At the originating workstation, the intruder loads an automated script into a sealed remote-administration canister and launches it through the campus pneumatic tube toward the target database server, leaving an outbound dispatch ticket in the local tube log.",
      "technicalCue": "T1021.006 · LATERAL & C2 — When the attacker runs Invoke-Command -ComputerName SRV-SQL01 -ScriptBlock { ... } on the source workstation, Microsoft-Windows-WinRM/Operational on the source host logs EventID 6 (Creating…",
      "storyMappings": [
        {
          "storyTerm": "Loading a script into a remote-administration canister",
          "technicalTerm": "PowerShell Invoke-Command -ComputerName SRV-SQL01 -ScriptBlock { ... }",
          "tone": "amber"
        },
        {
          "storyTerm": "Campus pneumatic tube network",
          "technicalTerm": "WS-Management (WinRM) SOAP protocol over HTTP port 5985 or HTTPS 5986",
          "tone": "sky"
        },
        {
          "storyTerm": "Outbound dispatch ticket on the sending desk",
          "technicalTerm": "Microsoft-Windows-WinRM/Operational EventID 6 and 142 on source workstation",
          "tone": "rose"
        },
        {
          "storyTerm": "Target database server down the hall",
          "technicalTerm": "Destination host SRV-SQL01 receiving the remote management session",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-winrm-wsman-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Loading a script into a…",
          "subtitle": "PowerShell Invoke-Command -ComputerName SRV-SQL01 -ScriptBlock…",
          "tone": "amber"
        },
        {
          "id": "ad-winrm-wsman-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Campus pneumatic tube network",
          "subtitle": "WS-Management (WinRM) SOAP protocol over HTTP port 5985 or…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. It Tube",
          "stageTag": "STEP 01 · SETUP",
          "title": "Loading a script into a remote-administration canister",
          "storyExcerpt": "At the originating workstation, the intruder loads an automated script into a sealed remote-administration canister and launches it through the campus pneumatic tube toward the target database…",
          "technicalParallel": "Under the hood, the observed step executes Invoke-Command -ComputerName SRV-SQL01.corp.local -ScriptBlock { procdump64.exe -accepteula -ma lsass.exe C:\\Temp\\sql.dmp } (which invokes the Windows…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tube",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Campus pneumatic tube network",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses campus pneumatic tube network to advance toward outbound dispatch ticket on the sending desk.",
          "technicalParallel": "When the attacker runs Invoke-Command -ComputerName SRV-SQL01 -ScriptBlock { ... } on the source workstation, Microsoft-Windows-WinRM/Operational on the source host logs EventID 6 (Creating WSMan…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Desk",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Target database server down the hall",
          "storyExcerpt": "Behind the scenes, target database server down the hall captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 6 (recording LogChannel=Microsoft-Windows-WinRM/Operational , Source Host, EventID=6 , Creating WSMan Session, TargetConnectionUri=http://SRV-SQL01.corp.local:5985/wsman…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Tube Launcher",
          "position": [
            -4.3,
            4.2,
            8.4
          ],
          "target": [
            -2.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Remote Bench",
          "position": [
            6.3,
            4.2,
            8.4
          ],
          "target": [
            4.8,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Receipt Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1021.006"
    },
    "step-2": {
      "scenarioId": "dfir-winrm-wsman-remote-powershell-eid91-4624",
      "sectionKey": "step-2",
      "sceneKind": "ad-winrm-wsman-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "Destination Server WSMan Shell Creation (WinRM EventID 91 & Security EventID 4624 Type 3)",
      "storyCue": "When the canister pops into the receiving tube at the database server, the front door receptionist stamps the visitor network arrival pass and immediately opens a freshly numbered remote workbench slot for the incoming session.",
      "technicalCue": "T1021.006 · LATERAL & C2 — On destination server SRV-SQL01, HTTP.sys receives the SOAP POST /wsman request on port 5985.",
      "storyMappings": [
        {
          "storyTerm": "Receiving tube at the database server",
          "technicalTerm": "Windows HTTP.sys kernel listener accepting SOAP POST /wsman on port 5985",
          "tone": "amber"
        },
        {
          "storyTerm": "Front door receptionist stamping the arrival pass",
          "technicalTerm": "Windows Security EventID 4624 (LogonType 3 Network) on SRV-SQL01",
          "tone": "sky"
        },
        {
          "storyTerm": "Opening a freshly numbered remote workbench slot",
          "technicalTerm": "WinRM/Operational EventID 91 (Creating WSMan shell on server with ResourceUri)",
          "tone": "rose"
        },
        {
          "storyTerm": "Authenticated remote management session",
          "technicalTerm": "Kerberos or Negotiate-authenticated administrative session established on target",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-winrm-wsman-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Receiving tube at the database server",
          "subtitle": "Windows HTTP.sys kernel listener accepting SOAP POST /wsman on…",
          "tone": "amber"
        },
        {
          "id": "ad-winrm-wsman-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Front door receptionist stamping the…",
          "subtitle": "Windows Security EventID 4624 (LogonType 3 Network) on SRV-SQL01",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Tube",
          "stageTag": "STEP 02 · SETUP",
          "title": "Receiving tube at the database server",
          "storyExcerpt": "When the canister pops into the receiving tube at the database server, the front door receptionist stamps the visitor network arrival pass and immediately opens a freshly numbered remote…",
          "technicalParallel": "Under the hood, the observed step executes Destination WinRM/Operational EventID 91: Creating WSMan shell with ResourceUri http://schemas.microsoft.com/powershell/Microsoft.PowerShell (clientIP…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Door Pass",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Front door receptionist stamping the arrival pass",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses front door receptionist stamping the arrival pass to advance toward opening a freshly numbered remote workbench slot.",
          "technicalParallel": "On destination server SRV-SQL01, HTTP.sys receives the SOAP POST /wsman request on port 5985.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Slot",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Authenticated remote management session",
          "storyExcerpt": "Behind the scenes, authenticated remote management session captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 91 (recording LogChannel=Microsoft-Windows-WinRM/Operational , Destination Host, EventID=91 , Creating WSMan Shell…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Tube Launcher",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Remote Bench",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Receipt Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1021.006"
    },
    "step-3": {
      "scenarioId": "dfir-winrm-wsman-remote-powershell-eid91-4624",
      "sectionKey": "step-3",
      "sceneKind": "ad-winrm-wsman-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "wsmprovhost.exe Child Process Spawning & ServerRemoteHost ScriptBlock Logging (Sysmon EID 1 & PS 4104)",
      "storyCue": "Inside the newly opened workbench slot, a dedicated remote-host clerk wakes up to run the intruder commands and child utilities, while the room built-in security camera records the full verbatim transcript of every single script block executed.",
      "technicalCue": "T1059.001 · EXECUTION — The WinRM service spawns the WS-Management Provider Host (C:\\Windows\\System32\\wsmprovhost.exe -Embedding), which initializes the PowerShell runspace (HostName=ServerRemoteHost) and spawns any…",
      "storyMappings": [
        {
          "storyTerm": "Dedicated remote-host clerk waking up",
          "technicalTerm": "C:\\Windows\\System32\\wsmprovhost.exe -Embedding spawned by the WinRM service",
          "tone": "amber"
        },
        {
          "storyTerm": "Child utilities launched from the remote bench",
          "technicalTerm": "Anomalous child processes spawned under wsmprovhost.exe (Sysmon EventID 1)",
          "tone": "sky"
        },
        {
          "storyTerm": "Built-in camera recording the verbatim script transcript",
          "technicalTerm": "PowerShell Operational EventID 4104 and 400 (ServerRemoteHost engine startup)",
          "tone": "rose"
        },
        {
          "storyTerm": "Reconstructing exact lateral actions",
          "technicalTerm": "Correlating wsmprovhost.exe PID with ScriptBlock text and network LogonID",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "ad-winrm-wsman-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Dedicated remote-host clerk waking up",
          "subtitle": "C:\\Windows\\System32\\wsmprovhost.exe -Embedding spawned by the…",
          "tone": "amber"
        },
        {
          "id": "ad-winrm-wsman-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Child utilities launched from the remote…",
          "subtitle": "Anomalous child processes spawned under wsmprovhost.exe…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Slot Up",
          "stageTag": "STEP 03 · SETUP",
          "title": "Dedicated remote-host clerk waking up",
          "storyExcerpt": "Inside the newly opened workbench slot, a dedicated remote-host clerk wakes up to run the intruder commands and child utilities, while the room built-in security camera records the full…",
          "technicalParallel": "Under the hood, the observed step executes Sysmon EventID 1: ParentImage=C:\\Windows\\System32\\wsmprovhost.exe -> Image=C:\\Users\\Public\\procdump64.exe (which executes the technical command / telemetry…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Child utilities launched from the remote bench",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses child utilities launched from the remote bench to advance toward built-in camera recording the verbatim script transcript.",
          "technicalParallel": "The WinRM service spawns the WS-Management Provider Host (C:\\Windows\\System32\\wsmprovhost.exe -Embedding), which initializes the PowerShell runspace (HostName=ServerRemoteHost) and spawns any external…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Slot Up",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Reconstructing exact lateral actions",
          "storyExcerpt": "Behind the scenes, reconstructing exact lateral actions captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording EventID=1 , Sysmon ProcessCreate, ParentImage=C:\\Windows\\System32\\wsmprovhost.exe, ChildImage=C:\\Users\\Public\\procdump64.exe, PowerShellHostName=ServerRemoteHost…",
          "accentHex": "#10B981",
          "startSec": 10.2,
          "endSec": 15
        }
      ],
      "cameraPresets": [
        {
          "id": "DIRECTOR",
          "label": "Director",
          "position": [
            0.2,
            5.6,
            15.8
          ],
          "target": [
            0,
            1.9,
            0
          ]
        },
        {
          "id": "VIEW_A",
          "label": "Tube Launcher",
          "position": [
            -5.6,
            4.2,
            8.4
          ],
          "target": [
            -4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_B",
          "label": "Remote Bench",
          "position": [
            5.6,
            4.2,
            8.4
          ],
          "target": [
            4.1,
            1.9,
            -0.3
          ]
        },
        {
          "id": "VIEW_C",
          "label": "Receipt Scan",
          "position": [
            0.3,
            6.6,
            9.2
          ],
          "target": [
            0,
            2.2,
            0
          ]
        }
      ],
      "mitreId": "T1059.001"
    }
  }
};
