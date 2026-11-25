import type { Section3DDescriptor, Section3DKey } from '@/lib/section-3d-registry';

/**
 * Bespoke 3D Story-to-Technical Section Descriptors for ZERO_DAY_APPLIANCES (9 scenarios).
 */
export const ZERO_DAY_APPLIANCES_3D_REGISTRY: Record<
  string,
  Partial<Record<Section3DKey, Section3DDescriptor>>
> = {
  "array-networks-ag-vxag-cve-2023-28461": {
    "briefing": {
      "scenarioId": "array-networks-ag-vxag-cve-2023-28461",
      "sectionKey": "briefing",
      "sceneKind": "zday-array-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Array Networks AG SSL VPN X-AN-FILESHARE flags Header Bypass & LODEINFO… — Story-to-Technical Overview",
      "storyCue": "Imagine a private coastal harbor customs depot where every barge must clear a badge check before entering the warehouse. A smuggler stamps an internal cargo-handling flag onto an uninspected manifest and slips a blank pause into the berth address, tricking the gatekeeper into waving the barge straight into the records room. Once inside, the smuggler copies the harbor master ledger, hides a secret radio clerk behind the crates, and ferries stowaways onto internal city freight trains.",
      "technicalCue": "INITIAL ACCESS: X-AN-FILESHARE flags=00300 Header Authentication Bypass (CVE-2023-28461) -> PERSISTENCE: Arbitrary File Read of Gateway Configs & PHP Webshell Deployment -> DEFENSE EVASION: Internal Lateral Movement & LODEINFO / NOOPDOOR Memory Injection",
      "storyMappings": [
        {
          "storyTerm": "Internal cargo-handling flag on an uninspected manifest",
          "technicalTerm": "Crafted X-AN-FILESHARE flags=00300 HTTP header (CVE-2023-28461)",
          "tone": "amber"
        },
        {
          "storyTerm": "Harbor master ledger",
          "technicalTerm": "Gateway configuration file /ca/conf/default.ampled with VPN and LDAP secrets",
          "tone": "sky"
        },
        {
          "storyTerm": "Secret radio clerk behind the crates",
          "technicalTerm": "Dropped PHP webshell and /tmp/s5n proxy listener on ArrayOS",
          "tone": "rose"
        },
        {
          "storyTerm": "Stowaways boarded onto internal city trains",
          "technicalTerm": "Internal lateral movement deploying LODEINFO and NOOPDOOR in memory",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "zday-array-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Internal cargo-handling flag on an…",
          "subtitle": "Crafted X-AN-FILESHARE flags=00300 HTTP header (CVE-2023-28461)",
          "tone": "amber"
        },
        {
          "id": "zday-array-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Harbor master ledger",
          "subtitle": "Gateway configuration file /ca/conf/default.ampled with VPN…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Flag",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "X-AN-FILESHARE flags=00300 Header Authentication Bypass (CVE-2023-28461)",
          "storyExcerpt": "Approaching the harbor customs booth with zero credentials, the smuggler flashes a stamped internal cargo-sharing tag and inserts a blank pause into the berth path. The automated gatekeeper mistakes the…",
          "technicalParallel": "Combining the flags authentication bypass with the fshare_template relative path traversal gave unauthenticated attackers arbitrary file read and script execution on the SSL VPN appliance.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Book",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "Arbitrary File Read of Gateway Configs & PHP Webshell Deployment",
          "storyExcerpt": "Inside the unlocked customs warehouse, the smuggler copies the harbor master book holding local crew codes and inland rail directory keys, then hides both a silent message clerk and a private relay…",
          "technicalParallel": "Because internal firewalls and EDRs expect user traffic to originate from the SSL VPN appliance’s internal interface IP, routing attacker traffic through /tmp/s5n blended in with legitimate remote-worker…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Rail Live",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Internal Lateral Movement & LODEINFO / NOOPDOOR Memory Injection",
          "storyExcerpt": "Tunneling through the hidden warehouse relay with stolen rail passes, the smuggler boards internal office workstations and hides live espionage gear inside trusted maintenance builders and signed…",
          "technicalParallel": "LODEINFO and NOOPDOOR then performed Active Directory reconnaissance, document theft, and encrypted C2 communication back through the compromised Array AG gateway (completing the documented EventID 1…",
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
          "label": "Gateway Arch",
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
          "label": "Harbor Ledger",
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
          "label": "Flag Bypass",
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
      "scenarioId": "array-networks-ag-vxag-cve-2023-28461",
      "sectionKey": "step-1",
      "sceneKind": "zday-array-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "X-AN-FILESHARE flags=00300 Header Authentication Bypass (CVE-2023-28461)",
      "storyCue": "Approaching the harbor customs booth with zero credentials, the smuggler flashes a stamped internal cargo-sharing tag and inserts a blank pause into the berth path. The automated gatekeeper mistakes the request for an authorized internal transfer and unlocks the customs barrier.",
      "technicalCue": "T1190 · INITIAL ACCESS — Earth Kasha sent an unauthenticated HTTP request to /prx/000/http/localhost/client_sec/%00/add_folder supplying the custom header X-AN-FILESHARE: uname=t; password=t; sp_uname=t; flags=c3248…",
      "storyMappings": [
        {
          "storyTerm": "Stamped internal cargo-sharing tag",
          "technicalTerm": "HTTP request header X-AN-FILESHARE: flags=00300",
          "tone": "amber"
        },
        {
          "storyTerm": "Berth path with a blank pause",
          "technicalTerm": "Target URI /prx/000/http/localhost/client_sec/%00/add_folder",
          "tone": "sky"
        },
        {
          "storyTerm": "Automated gatekeeper unlocking the barrier",
          "technicalTerm": "CVE-2023-28461 authentication bypass on ArrayOS SSL VPN gateway",
          "tone": "rose"
        },
        {
          "storyTerm": "Uninspected external barge",
          "technicalTerm": "Unauthenticated WAN HTTP request from Earth Kasha infrastructure",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-array-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Stamped internal cargo-sharing tag",
          "subtitle": "HTTP request header X-AN-FILESHARE: flags=00300",
          "tone": "amber"
        },
        {
          "id": "zday-array-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Berth path with a blank pause",
          "subtitle": "Target URI /prx/000/http/localhost/client_sec/%00/add_folder",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Zero Tag",
          "stageTag": "STEP 01 · SETUP",
          "title": "Stamped internal cargo-sharing tag",
          "storyExcerpt": "Approaching the harbor customs booth with zero credentials, the smuggler flashes a stamped internal cargo-sharing tag and inserts a blank pause into the berth path.",
          "technicalParallel": "Combining the flags authentication bypass with the fshare_template relative path traversal gave unauthenticated attackers arbitrary file read and script execution on the SSL VPN appliance.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Path",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Berth path with a blank pause",
          "storyExcerpt": "The automated gatekeeper mistakes the request for an authorized internal transfer and unlocks the customs barrier.",
          "technicalParallel": "Earth Kasha sent an unauthenticated HTTP request to /prx/000/http/localhost/client_sec/%00/add_folder supplying the custom header X-AN-FILESHARE: uname=t; password=t; sp_uname=t; flags=c3248…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Uninspected external barge",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across uninspected external barge while locking down automated gatekeeper unlocking the barrier.",
          "technicalParallel": "Configure perimeter WAF and IDS rules to inspect external HTTP requests containing the X-AN-FILESHARE header or /prx/000/http/localhost/client_sec URIs carrying %00 null-byte or .. traversal sequences…",
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
          "label": "Gateway Arch",
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
          "label": "Harbor Ledger",
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
          "label": "Flag Bypass",
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
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "array-networks-ag-vxag-cve-2023-28461",
      "sectionKey": "step-2",
      "sceneKind": "zday-array-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Arbitrary File Read of Gateway Configs & PHP Webshell Deployment",
      "storyCue": "Inside the unlocked customs warehouse, the smuggler copies the harbor master book holding local crew codes and inland rail directory keys, then hides both a silent message clerk and a private relay station behind the crates to route traffic straight into the city.",
      "technicalCue": "T1505.003 · PERSISTENCE — Using the CVE-2023-28461 primitive, Earth Kasha read /ca/conf/default.ampled (extracting local VPN accounts, RADIUS/LDAP secrets, and internal routing tables), wrote a PHP webshell (cals.php)…",
      "storyMappings": [
        {
          "storyTerm": "Harbor master book",
          "technicalTerm": "Gateway file /ca/conf/default.ampled containing VPN and RADIUS/LDAP secrets",
          "tone": "amber"
        },
        {
          "storyTerm": "Silent message clerk",
          "technicalTerm": "Dropped PHP webshell written onto the ArrayOS web filesystem",
          "tone": "sky"
        },
        {
          "storyTerm": "Private relay station behind the crates",
          "technicalTerm": "Unauthorized ELF SOCKS proxy binary running as /tmp/s5n",
          "tone": "rose"
        },
        {
          "storyTerm": "Inland rail directory keys",
          "technicalTerm": "Extracted internal RADIUS and Active Directory LDAP bind credentials",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-array-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Harbor master book",
          "subtitle": "Gateway file /ca/conf/default.ampled containing VPN and…",
          "tone": "amber"
        },
        {
          "id": "zday-array-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Silent message clerk",
          "subtitle": "Dropped PHP webshell written onto the ArrayOS web filesystem",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Book",
          "stageTag": "STEP 02 · SETUP",
          "title": "Harbor master book",
          "storyExcerpt": "Inside the unlocked customs warehouse, the smuggler copies the harbor master book holding local crew codes and inland rail directory keys, then hides both a silent message clerk and a private…",
          "technicalParallel": "Because internal firewalls and EDRs expect user traffic to originate from the SSL VPN appliance’s internal interface IP, routing attacker traffic through /tmp/s5n blended in with legitimate remote-worker…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Silent message clerk",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses silent message clerk to advance toward private relay station behind the crates.",
          "technicalParallel": "Using the CVE-2023-28461 primitive, Earth Kasha read /ca/conf/default.ampled (extracting local VPN accounts, RADIUS/LDAP secrets, and internal routing tables), wrote a PHP webshell (cals.php) into the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Rail Keys",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Inland rail directory keys",
          "storyExcerpt": "Behind the scenes, inland rail directory keys captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Perform ArrayOS filesystem integrity auditing for newly written .php webshells, unauthorized ELF listener binaries in /tmp (such as /tmp/s5n), and unexpected outbound SMB or WMI connections originating…",
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
          "label": "Gateway Arch",
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
          "label": "Harbor Ledger",
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
          "label": "Flag Bypass",
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
      "mitreId": "T1505.003"
    },
    "step-3": {
      "scenarioId": "array-networks-ag-vxag-cve-2023-28461",
      "sectionKey": "step-3",
      "sceneKind": "zday-array-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Internal Lateral Movement & LODEINFO / NOOPDOOR Memory Injection",
      "storyCue": "Tunneling through the hidden warehouse relay with stolen rail passes, the smuggler boards internal office workstations and hides live espionage gear inside trusted maintenance builders and signed security helper tools so guards overlook the active payload.",
      "technicalCue": "T1127.001 · DEFENSE EVASION — Pivoting through /tmp/s5n with credentials harvested from the gateway, Earth Kasha moved laterally onto internal Windows servers and executed NOOPDOOR via MSBuild.exe C:\\ProgramData\\update.xml…",
      "storyMappings": [
        {
          "storyTerm": "Hidden warehouse relay",
          "technicalTerm": "SOCKS pivot through /tmp/s5n into the internal corporate network",
          "tone": "amber"
        },
        {
          "storyTerm": "Trusted maintenance builder",
          "technicalTerm": "Abused MSBuild.exe executing malicious XML project payloads from C:\\ProgramData",
          "tone": "sky"
        },
        {
          "storyTerm": "Signed security helper tool carrying hidden gear",
          "technicalTerm": "DLL side-loading of unsigned K7DbgMN.dll by legitimate K7SysMn1.exe",
          "tone": "rose"
        },
        {
          "storyTerm": "Live espionage gear in memory",
          "technicalTerm": "LODEINFO and NOOPDOOR in-memory backdoor implants",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-array-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Hidden warehouse relay",
          "subtitle": "SOCKS pivot through /tmp/s5n into the internal corporate network",
          "tone": "amber"
        },
        {
          "id": "zday-array-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Trusted maintenance builder",
          "subtitle": "Abused MSBuild.exe executing malicious XML project payloads…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Rail Live",
          "stageTag": "STEP 03 · SETUP",
          "title": "Hidden warehouse relay",
          "storyExcerpt": "Tunneling through the hidden warehouse relay with stolen rail passes, the smuggler boards internal office workstations and hides live espionage gear inside trusted maintenance builders and…",
          "technicalParallel": "LODEINFO and NOOPDOOR then performed Active Directory reconnaissance, document theft, and encrypted C2 communication back through the compromised Array AG gateway (completing the documented EventID 1…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Tool",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Trusted maintenance builder",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses trusted maintenance builder to advance toward signed security helper tool carrying hidden gear.",
          "technicalParallel": "Pivoting through /tmp/s5n with credentials harvested from the gateway, Earth Kasha moved laterally onto internal Windows servers and executed NOOPDOOR via MSBuild.exe C:\\ProgramData\\update.xml (abusing…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tool Gear",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Live espionage gear in memory",
          "storyExcerpt": "Behind the scenes, live espionage gear in memory captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Correlate Sysmon EventID 1 (Process Creation) and EventID 7 (Image Loaded, tracking DLLs mapped into processes) alerting on MSBuild.exe compiling XML files from C:\\ProgramData and signed K7SysMn1.exe…",
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
          "label": "Gateway Arch",
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
          "label": "Harbor Ledger",
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
          "label": "Flag Bypass",
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
      "mitreId": "T1127.001"
    }
  },
  "check-point-vpn-cve-2024-24919-info-leak": {
    "briefing": {
      "scenarioId": "check-point-vpn-cve-2024-24919-info-leak",
      "sectionKey": "briefing",
      "sceneKind": "zday-checkpoint-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Check Point Security Gateway /clients/MyCRL Path Traversal & AD… — Story-to-Technical Overview",
      "storyCue": "Imagine a fortified castle gatehouse with a public certificate window where travelers can ask to see revoked pass lists. Instead of naming a public notice, a spy slides a stair-stepping folder slip under the glass that tells the clerk to walk backward out of the public booth and into the castle private archives. The clerk obediently hands over the local guard password book and the courier badge for the royal palace, allowing the spy to walk right through the main drawbridge and empty the kingdom directory vault.",
      "technicalCue": "INITIAL ACCESS: Unauthenticated Path Traversal POST Request to /clients/MyCRL (CVE-2024-24919) -> CREDENTIAL ACCESS: Harvesting /etc/shadow, SSH Keys & AD LDAP Bind Credentials -> CREDENTIAL ACCESS: VPN Tunnel Establishment & Active Directory ntds.dit Extraction",
      "storyMappings": [
        {
          "storyTerm": "Public certificate window",
          "technicalTerm": "Check Point /clients/MyCRL HTTPS endpoint on vpnd",
          "tone": "amber"
        },
        {
          "storyTerm": "Stair-stepping folder slip",
          "technicalTerm": "Directory traversal payload (aCSHELL/../../../../../../../etc/shadow)",
          "tone": "sky"
        },
        {
          "storyTerm": "Local guard password book and courier badge",
          "technicalTerm": "/etc/shadow hashes, SSH keys, and AD LDAP service credentials",
          "tone": "rose"
        },
        {
          "storyTerm": "Kingdom directory vault",
          "technicalTerm": "Active Directory ntds.dit database on the Domain Controller",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#FACC15",
      "durationSec": 18,
      "callouts": [
        {
          "id": "zday-checkpoint-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Public certificate window",
          "subtitle": "Check Point /clients/MyCRL HTTPS endpoint on vpnd",
          "tone": "amber"
        },
        {
          "id": "zday-checkpoint-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Stair-stepping folder slip",
          "subtitle": "Directory traversal payload (aCSHELL/../../../../../../../etc/s…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Spy Slip",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Unauthenticated Path Traversal POST Request to /clients/MyCRL (CVE-2024-24919)",
          "storyExcerpt": "At the castle gatehouse certificate window, the spy hands the clerk a forged request slip packed with backward step markers instead of a valid public list name. Because the clerk follows the backward…",
          "technicalParallel": "watchTowr Labs demonstrated through binary diffing that the patch added an explicit substring check rejecting requests containing .. or / inside the /clients/MyCRL handler.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Open",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "Harvesting /etc/shadow, SSH Keys & AD LDAP Bind Credentials",
          "storyExcerpt": "Using the open archive chute, the spy pulls out two distinct stolen secrets: first, the local gatehouse password book to unlock spare traveler accounts, and second, the palace courier badge that the…",
          "technicalParallel": "Even if all human employees used MFA for VPN logins, organizations frequently had a forgotten local \"test\" or vendor VPN user configured with password-only authentication in fwauth.NDB or an…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Book",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "VPN Tunnel Establishment & Active Directory ntds.dit Extraction",
          "storyExcerpt": "Wearing a cracked traveler pass, the spy strolls straight across the front drawbridge into the inner courtyard, then flashes the stolen palace courier badge at the royal registry to copy the entire…",
          "technicalParallel": "In documented incidents, the entire kill chain from initial /clients/MyCRL file read to full ntds.dit Active Directory compromise completed in less than three hours.",
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
          "label": "Cert Window",
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
          "label": "Shadow Vault",
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
          "label": "Path Climb",
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
      "scenarioId": "check-point-vpn-cve-2024-24919-info-leak",
      "sectionKey": "step-1",
      "sceneKind": "zday-checkpoint-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Unauthenticated Path Traversal POST Request to /clients/MyCRL (CVE-2024-24919)",
      "storyCue": "At the castle gatehouse certificate window, the spy hands the clerk a forged request slip packed with backward step markers instead of a valid public list name. Because the clerk follows the backward steps blindly without checking whether they stay inside the public shelf, the spy peeks straight into restricted archive rooms.",
      "technicalCue": "T1190 · INITIAL ACCESS — The attacker sent an unauthenticated HTTP POST request to /clients/MyCRL with body aCSHELL/../../../../../../../etc/shadow.",
      "storyMappings": [
        {
          "storyTerm": "Gatehouse certificate window",
          "technicalTerm": "Unauthenticated POST /clients/MyCRL handler in vpnd",
          "tone": "amber"
        },
        {
          "storyTerm": "Backward step markers",
          "technicalTerm": "Relative path traversal sequences (../) bypassing web root confinement",
          "tone": "sky"
        },
        {
          "storyTerm": "Public shelf boundary",
          "technicalTerm": "Check Point CRL directory scope on the Security Gateway",
          "tone": "rose"
        },
        {
          "storyTerm": "Restricted archive rooms",
          "technicalTerm": "Underlying Gaia Linux root filesystem files (/etc/shadow)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-checkpoint-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Gatehouse certificate window",
          "subtitle": "Unauthenticated POST /clients/MyCRL handler in vpnd",
          "tone": "amber"
        },
        {
          "id": "zday-checkpoint-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Backward step markers",
          "subtitle": "Relative path traversal sequences (../) bypassing web root…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Spy Slip",
          "stageTag": "STEP 01 · SETUP",
          "title": "Gatehouse certificate window",
          "storyExcerpt": "At the castle gatehouse certificate window, the spy hands the clerk a forged request slip packed with backward step markers instead of a valid public list name.",
          "technicalParallel": "watchTowr Labs demonstrated through binary diffing that the patch added an explicit substring check rejecting requests containing .. or / inside the /clients/MyCRL handler.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. They Stay",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Backward step markers",
          "storyExcerpt": "Because the clerk follows the backward steps blindly without checking whether they stay inside the public shelf, the spy peeks straight into restricted archive rooms.",
          "technicalParallel": "The attacker sent an unauthenticated HTTP POST request to /clients/MyCRL with body aCSHELL/../../../../../../../etc/shadow.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Restricted archive rooms",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across restricted archive rooms while locking down public shelf boundary.",
          "technicalParallel": "Inspect Check Point web and VPN gateway logs alongside IPS signatures alerting on HTTP POST requests to /clients/MyCRL or /clients/MyCRL/ containing .. directory traversal sequences (identifying…",
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
          "label": "Cert Window",
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
          "label": "Shadow Vault",
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
          "label": "Path Climb",
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
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "check-point-vpn-cve-2024-24919-info-leak",
      "sectionKey": "step-2",
      "sceneKind": "zday-checkpoint-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Harvesting /etc/shadow, SSH Keys & AD LDAP Bind Credentials",
      "storyCue": "Using the open archive chute, the spy pulls out two distinct stolen secrets: first, the local gatehouse password book to unlock spare traveler accounts, and second, the palace courier badge that the gatehouse uses to ask the royal palace who is allowed inside.",
      "technicalCue": "T1552.001 · CREDENTIAL ACCESS — Using the arbitrary file-read primitive, the attacker downloaded /etc/shadow (containing password hashes for local gateway accounts and legacy password-only VPN test users)…",
      "storyMappings": [
        {
          "storyTerm": "Open archive chute",
          "technicalTerm": "Repeatable CVE-2024-24919 arbitrary file-read primitive",
          "tone": "amber"
        },
        {
          "storyTerm": "Local gatehouse password book",
          "technicalTerm": "/etc/shadow password hashes for local password-only VPN accounts",
          "tone": "sky"
        },
        {
          "storyTerm": "Palace courier badge",
          "technicalTerm": "Active Directory LDAP bind service account credentials on the gateway",
          "tone": "rose"
        },
        {
          "storyTerm": "Spare traveler accounts",
          "technicalTerm": "Legacy password-only Remote Access VPN accounts lacking MFA",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-checkpoint-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Open archive chute",
          "subtitle": "Repeatable CVE-2024-24919 arbitrary file-read primitive",
          "tone": "amber"
        },
        {
          "id": "zday-checkpoint-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Local gatehouse password book",
          "subtitle": "/etc/shadow password hashes for local password-only VPN accounts",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Open",
          "stageTag": "STEP 02 · SETUP",
          "title": "Open archive chute",
          "storyExcerpt": "Using the open archive chute, the spy pulls out two distinct stolen secrets: first, the local gatehouse password book to unlock spare traveler accounts, and second, the palace courier badge…",
          "technicalParallel": "Even if all human employees used MFA for VPN logins, organizations frequently had a forgotten local \"test\" or vendor VPN user configured with password-only authentication in fwauth.NDB or an…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Book",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Local gatehouse password book",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses local gatehouse password book to advance toward palace courier badge.",
          "technicalParallel": "Using the arbitrary file-read primitive, the attacker downloaded /etc/shadow (containing password hashes for local gateway accounts and legacy password-only VPN test users), /home/admin/.ssh/id_rsa, and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Open Spy",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Spare traveler accounts",
          "storyExcerpt": "Behind the scenes, spare traveler accounts captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Audit Check Point gateway logs for sequential /clients/MyCRL POST requests followed shortly by Remote Access VPN login attempts from commercial VPS or Tor exit IPs using legacy local firewall accounts…",
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
          "label": "Cert Window",
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
          "label": "Shadow Vault",
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
          "label": "Path Climb",
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
      "mitreId": "T1552.001"
    },
    "step-3": {
      "scenarioId": "check-point-vpn-cve-2024-24919-info-leak",
      "sectionKey": "step-3",
      "sceneKind": "zday-checkpoint-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "VPN Tunnel Establishment & Active Directory ntds.dit Extraction",
      "storyCue": "Wearing a cracked traveler pass, the spy strolls straight across the front drawbridge into the inner courtyard, then flashes the stolen palace courier badge at the royal registry to copy the entire kingdom master ledger of every citizen secret.",
      "technicalCue": "T1003.003 · CREDENTIAL ACCESS — Mnemonic incident responders observed threat actors logging into the Check Point VPN using cracked local credentials and then authenticating to the internal Domain Controller with the stolen…",
      "storyMappings": [
        {
          "storyTerm": "Front drawbridge",
          "technicalTerm": "Remote Access VPN tunnel into the internal corporate network",
          "tone": "amber"
        },
        {
          "storyTerm": "Stolen palace courier badge",
          "technicalTerm": "Firewall LDAP service account (svc_*) authenticating to the Domain Controller",
          "tone": "sky"
        },
        {
          "storyTerm": "Royal registry",
          "technicalTerm": "Internal Windows Active Directory Domain Controller",
          "tone": "rose"
        },
        {
          "storyTerm": "Kingdom master ledger",
          "technicalTerm": "Extracted ntds.dit database dumped via ntdsutil.exe or vssadmin.exe",
          "tone": "emerald"
        }
      ],
      "accentHex": "#FACC15",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-checkpoint-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Front drawbridge",
          "subtitle": "Remote Access VPN tunnel into the internal corporate network",
          "tone": "amber"
        },
        {
          "id": "zday-checkpoint-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Stolen palace courier badge",
          "subtitle": "Firewall LDAP service account (svc_*) authenticating to the…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass Spy",
          "stageTag": "STEP 03 · SETUP",
          "title": "Front drawbridge",
          "storyExcerpt": "Wearing a cracked traveler pass, the spy strolls straight across the front drawbridge into the inner courtyard, then flashes the stolen palace courier badge at the royal registry to copy the…",
          "technicalParallel": "In documented incidents, the entire kill chain from initial /clients/MyCRL file read to full ntds.dit Active Directory compromise completed in less than three hours.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Stolen palace courier badge",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses stolen palace courier badge to advance toward royal registry.",
          "technicalParallel": "Mnemonic incident responders observed threat actors logging into the Check Point VPN using cracked local credentials and then authenticating to the internal Domain Controller with the stolen svc_cp_ldap…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Pass Spy",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Kingdom master ledger",
          "storyExcerpt": "Behind the scenes, kingdom master ledger captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Monitor Sysmon EventID 1 (Process Creation recording exact parent-child command lines) on Domain Controllers for ntdsutil.exe or vssadmin.exe spawned under firewall LDAP service accounts (svc_*), paired…",
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
          "label": "Cert Window",
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
          "label": "Shadow Vault",
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
          "label": "Path Climb",
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
    }
  },
  "fortimanager-fgd-jump-cve-2024-47575": {
    "briefing": {
      "scenarioId": "fortimanager-fgd-jump-cve-2024-47575",
      "sectionKey": "briefing",
      "sceneKind": "zday-fortimanager-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "FortiManager fgfmsd Unauthenticated API RCE (\"FortiJump\" CVE-2024-47575… — Story-to-Technical Overview",
      "storyCue": "Imagine a national railway central switchboard tower that controls track signals for hundreds of branch stations. Because the tower side telegraph line accepts any caller presenting a homemade brass emblem without checking the official station roster, an intruder registers a counterfeit branch box, slips a forged override note into the tower blueprint checkout lever to seize master keys, and packs every real station schematic and vault code into a single steamer trunk.",
      "technicalCue": "INITIAL ACCESS: Unauthenticated FGFM TLS Handshake & Rogue Device Registration (TCP/541) -> EXECUTION: FGFM put_json / rcs_checkout Command Injection as Root -> EXFIL & IMPACT: Exfiltration of Managed FortiGate Configurations (/var/fwclient & globaldb)",
      "storyMappings": [
        {
          "storyTerm": "Central switchboard tower",
          "technicalTerm": "FortiManager central management appliance (fgfmsd daemon)",
          "tone": "amber"
        },
        {
          "storyTerm": "Side telegraph line accepting homemade brass emblems",
          "technicalTerm": "TCP port 541 FGFM protocol lacking certificate validation (CVE-2024-47575)",
          "tone": "sky"
        },
        {
          "storyTerm": "Blueprint checkout lever",
          "technicalTerm": "Internal action=put_json rcs_checkout command injection handler",
          "tone": "rose"
        },
        {
          "storyTerm": "Steamer trunk of branch schematics and vault codes",
          "technicalTerm": "Exfiltrated /tmp/.tm.tar.gz archive of /var/fwclient and globaldb configs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "zday-fortimanager-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Central switchboard tower",
          "subtitle": "FortiManager central management appliance (fgfmsd daemon)",
          "tone": "amber"
        },
        {
          "id": "zday-fortimanager-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Side telegraph line accepting homemade…",
          "subtitle": "TCP port 541 FGFM protocol lacking certificate validation…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Side Line",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Unauthenticated FGFM TLS Handshake & Rogue Device Registration (TCP/541)",
          "storyExcerpt": "From outside the rail yard, the intruder dials the tower side telegraph line, flashes a self-stamped brass emblem, and registers a phantom branch station on the live switchboard without anyone verifying…",
          "technicalParallel": "FortiManager’s default setting (fgfm-deny-unknown disable) allowed unknown FortiGate serial numbers to register dynamically in the Unregistered Devices table and immediately invoke internal FGFM protocol…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Side Line",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "FGFM put_json / rcs_checkout Command Injection as Root",
          "storyExcerpt": "Over the newly approved telegraph line, the intruder sends a blueprint-checkout order with hidden workshop commands tucked behind a punctuation break. The switchboard tower passes the whole note straight…",
          "technicalParallel": "Rapid7 and Mandiant documented how put_json requests routed through umath_handler to rcs_checkout allowed immediate non-interactive command execution or interactive reverse shells over TLS.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Keys All",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Exfiltration of Managed FortiGate Configurations (/var/fwclient & globaldb)",
          "storyExcerpt": "Holding master tower keys, the intruder sweeps every branch-station filing cabinet, packs all firewall maps, tunnel passphrases, and master password records into a tightly bound steamer trunk, and ships…",
          "technicalParallel": "With the full running configurations of all managed FortiGate appliances, an adversary can crack weak administrator hashes offline, decrypt Reversible ENC secrets using knowledge of FortiOS key…",
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
          "label": "Switchboard",
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
          "label": "Emblem Press",
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
          "label": "Rogue Link",
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
      "scenarioId": "fortimanager-fgd-jump-cve-2024-47575",
      "sectionKey": "step-1",
      "sceneKind": "zday-fortimanager-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Unauthenticated FGFM TLS Handshake & Rogue Device Registration (TCP/541)",
      "storyCue": "From outside the rail yard, the intruder dials the tower side telegraph line, flashes a self-stamped brass emblem, and registers a phantom branch station on the live switchboard without anyone verifying whether that station exists in the company registry.",
      "technicalCue": "T1190 · INITIAL ACCESS — UNC5820 connected to TCP port 541 on internet-facing FortiManager appliances, completed a mutual TLS handshake using an arbitrary/self-signed certificate, and transmitted an FGFM request=get…",
      "storyMappings": [
        {
          "storyTerm": "Tower side telegraph line",
          "technicalTerm": "Internet-exposed FortiManager FGFM service on TCP port 541",
          "tone": "amber"
        },
        {
          "storyTerm": "Self-stamped brass emblem",
          "technicalTerm": "Arbitrary or self-signed TLS client certificate accepted by fgfmsd",
          "tone": "sky"
        },
        {
          "storyTerm": "Phantom branch station registration",
          "technicalTerm": "Unauthenticated FGFM device registration request (CVE-2024-47575)",
          "tone": "rose"
        },
        {
          "storyTerm": "Live switchboard",
          "technicalTerm": "Active fgfmsd management session granted to the rogue peer",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-fortimanager-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Tower side telegraph line",
          "subtitle": "Internet-exposed FortiManager FGFM service on TCP port 541",
          "tone": "amber"
        },
        {
          "id": "zday-fortimanager-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Self-stamped brass emblem",
          "subtitle": "Arbitrary or self-signed TLS client certificate accepted by…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Side Line",
          "stageTag": "STEP 01 · SETUP",
          "title": "Tower side telegraph line",
          "storyExcerpt": "From outside the rail yard, the intruder dials the tower side telegraph line, flashes a self-stamped brass emblem, and registers a phantom branch station on the live switchboard without anyone…",
          "technicalParallel": "FortiManager’s default setting (fgfm-deny-unknown disable) allowed unknown FortiGate serial numbers to register dynamically in the Unregistered Devices table and immediately invoke internal FGFM protocol…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Self-stamped",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Self-stamped brass emblem",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses self-stamped brass emblem to advance toward phantom branch station registration.",
          "technicalParallel": "UNC5820 connected to TCP port 541 on internet-facing FortiManager appliances, completed a mutual TLS handshake using an arbitrary/self-signed certificate, and transmitted an FGFM request=get packet with…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Live",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Live switchboard",
          "storyExcerpt": "Behind the scenes, live switchboard captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Inspect FortiManager event logs for unregistered device registration entries containing hostname=\"localhost\" or unknown serial numbers originating from external WAN IP addresses on TCP port 541…",
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
          "label": "Switchboard",
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
          "label": "Emblem Press",
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
          "label": "Rogue Link",
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
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "fortimanager-fgd-jump-cve-2024-47575",
      "sectionKey": "step-2",
      "sceneKind": "zday-fortimanager-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "FGFM put_json / rcs_checkout Command Injection as Root",
      "storyCue": "Over the newly approved telegraph line, the intruder sends a blueprint-checkout order with hidden workshop commands tucked behind a punctuation break. The switchboard tower passes the whole note straight to the master mechanic, who executes the hidden commands with full building authority.",
      "technicalCue": "T1059.004 · EXECUTION — Through the established FGFM session, the attacker sent an action=put_json message invoking the internal revision control method rcs_checkout (a backend handler in fgfmsd that passes the JSON…",
      "storyMappings": [
        {
          "storyTerm": "Blueprint-checkout order",
          "technicalTerm": "FGFM action=put_json request invoking rcs_checkout",
          "tone": "amber"
        },
        {
          "storyTerm": "Hidden commands behind a punctuation break",
          "technicalTerm": "Unsanitized shell metacharacters injected into /usr/bin/rcs -l",
          "tone": "sky"
        },
        {
          "storyTerm": "Master mechanic with full building authority",
          "technicalTerm": "/bin/fgfmsd spawning /bin/sh -c running as root (UID 0)",
          "tone": "rose"
        },
        {
          "storyTerm": "Secret workshop drop folder",
          "technicalTerm": "Staged attacker payload and staging path in /tmp/.tm",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-fortimanager-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Blueprint-checkout order",
          "subtitle": "FGFM action=put_json request invoking rcs_checkout",
          "tone": "amber"
        },
        {
          "id": "zday-fortimanager-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Hidden commands behind a punctuation break",
          "subtitle": "Unsanitized shell metacharacters injected into /usr/bin/rcs -l",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Over Line",
          "stageTag": "STEP 02 · SETUP",
          "title": "Blueprint-checkout order",
          "storyExcerpt": "Over the newly approved telegraph line, the intruder sends a blueprint-checkout order with hidden workshop commands tucked behind a punctuation break.",
          "technicalParallel": "Rapid7 and Mandiant documented how put_json requests routed through umath_handler to rcs_checkout allowed immediate non-interactive command execution or interactive reverse shells over TLS.",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Note Who",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Hidden commands behind a punctuation break",
          "storyExcerpt": "The switchboard tower passes the whole note straight to the master mechanic, who executes the hidden commands with full building authority.",
          "technicalParallel": "Through the established FGFM session, the attacker sent an action=put_json message invoking the internal revision control method rcs_checkout (a backend handler in fgfmsd that passes the JSON \"file\"…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Full",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Secret workshop drop folder",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across secret workshop drop folder while locking down master mechanic with full building authority.",
          "technicalParallel": "Monitor Linux process telemetry on FortiManager for /bin/fgfmsd spawning /bin/sh -c /usr/bin/rcs -l containing shell metacharacters such as semicolons or backticks, alongside unexplained files under…",
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
          "label": "Switchboard",
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
          "label": "Emblem Press",
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
          "label": "Rogue Link",
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
      "mitreId": "T1059.004"
    },
    "step-3": {
      "scenarioId": "fortimanager-fgd-jump-cve-2024-47575",
      "sectionKey": "step-3",
      "sceneKind": "zday-fortimanager-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Exfiltration of Managed FortiGate Configurations (/var/fwclient & globaldb)",
      "storyCue": "Holding master tower keys, the intruder sweeps every branch-station filing cabinet, packs all firewall maps, tunnel passphrases, and master password records into a tightly bound steamer trunk, and ships the entire bundle out of the rail yard.",
      "technicalCue": "T1005 · EXFIL & IMPACT — Running as root, UNC5820 compressed /var/fwclient and /var/fds/data into /tmp/.tm.tar.gz and exfiltrated the archive (capturing the complete FortiOS configuration files, IPsec VPN pre-shared…",
      "storyMappings": [
        {
          "storyTerm": "Branch-station filing cabinets",
          "technicalTerm": "Managed FortiGate configuration stores in /var/fwclient and /var/fds/data",
          "tone": "amber"
        },
        {
          "storyTerm": "Tightly bound steamer trunk",
          "technicalTerm": "Compressed staging archive /tmp/.tm.tar.gz",
          "tone": "sky"
        },
        {
          "storyTerm": "Firewall maps and tunnel passphrases",
          "technicalTerm": "FortiOS configurations, IPsec VPN pre-shared keys, and admin password hashes",
          "tone": "rose"
        },
        {
          "storyTerm": "Shipping the bundle out of the rail yard",
          "technicalTerm": "Exfiltration of managed device configurations by UNC5820",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-fortimanager-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Branch-station filing cabinets",
          "subtitle": "Managed FortiGate configuration stores in /var/fwclient and…",
          "tone": "amber"
        },
        {
          "id": "zday-fortimanager-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Tightly bound steamer trunk",
          "subtitle": "Compressed staging archive /tmp/.tm.tar.gz",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Keys All",
          "stageTag": "STEP 03 · SETUP",
          "title": "Branch-station filing cabinets",
          "storyExcerpt": "Holding master tower keys, the intruder sweeps every branch-station filing cabinet, packs all firewall maps, tunnel passphrases, and master password records into a tightly bound steamer trunk…",
          "technicalParallel": "With the full running configurations of all managed FortiGate appliances, an adversary can crack weak administrator hashes offline, decrypt Reversible ENC secrets using knowledge of FortiOS key…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Maps",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Tightly bound steamer trunk",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses tightly bound steamer trunk to advance toward firewall maps and tunnel passphrases.",
          "technicalParallel": "Running as root, UNC5820 compressed /var/fwclient and /var/fds/data into /tmp/.tm.tar.gz and exfiltrated the archive (capturing the complete FortiOS configuration files, IPsec VPN pre-shared keys…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Maps",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Shipping the bundle out of the rail yard",
          "storyExcerpt": "Behind the scenes, shipping the bundle out of the rail yard captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Hunt for staging artifacts in /tmp/.tm or /var/tmp, unexpected archive creation targeting /var/fwclient or /var/fds/data, and unauthorized FGFM configuration pushes to downstream FortiGates (detecting…",
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
          "label": "Switchboard",
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
          "label": "Emblem Press",
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
          "label": "Rogue Link",
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
      "mitreId": "T1005"
    }
  },
  "ivanti-vtm-apache-ofbiz-auth-bypass-cve-2024-7593-audit": {
    "briefing": {
      "scenarioId": "ivanti-vtm-apache-ofbiz-auth-bypass-cve-2024-7593-audit",
      "sectionKey": "briefing",
      "sceneKind": "zday-ivanti-vtm-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Ivanti Virtual Traffic Manager (vTM) Admin UI Auth Bypass Audit… — Story-to-Technical Overview",
      "storyCue": "Imagine a busy highway toll-plaza control tower whose initial setup side window was left unlatched facing a public access ramp. An intruder reaches straight through the setup window without showing an employee badge, writes a brand-new supervisor name directly into the tower permanent staffing roster, and then walks calmly through the front supervisor door to swap the automated traffic-routing rules.",
      "technicalCue": "INITIAL ACCESS: Unauthenticated Access to wizard.fcgi on Port 9090 (CVE-2024-7593) -> PERSISTENCE: Unauthorized Local Administrator Account Creation in $ZEUSHOME/zxtm/conf/users -> EXECUTION: Authenticated Admin Session & Custom Action Program Execution Audit",
      "storyMappings": [
        {
          "storyTerm": "Unlatched initial setup side window",
          "technicalTerm": "Unauthenticated wizard.fcgi handler exposed on management port 9090 (CVE-2024-7593)",
          "tone": "amber"
        },
        {
          "storyTerm": "Tower permanent staffing roster",
          "technicalTerm": "Local administrator user file at $ZEUSHOME/zxtm/conf/users",
          "tone": "sky"
        },
        {
          "storyTerm": "Brand-new supervisor name",
          "technicalTerm": "Unauthorized Full Administrator account (support_svc) written to disk",
          "tone": "rose"
        },
        {
          "storyTerm": "Swapping automated traffic-routing rules",
          "technicalTerm": "Authenticated upload and execution of custom Action Programs on vTM",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "zday-ivanti-vtm-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Unlatched initial setup side window",
          "subtitle": "Unauthenticated wizard.fcgi handler exposed on management port…",
          "tone": "amber"
        },
        {
          "id": "zday-ivanti-vtm-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Tower permanent staffing roster",
          "subtitle": "Local administrator user file at $ZEUSHOME/zxtm/conf/users",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Ramp",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Unauthenticated Access to wizard.fcgi on Port 9090 (CVE-2024-7593)",
          "storyExcerpt": "Driving up the exposed management ramp, the intruder bypasses the locked main guard booth completely and reaches straight through the unlatched setup-wizard side window, which fails to demand any…",
          "technicalParallel": "Under the hood, the observed step executes grep -rn \"wizard.fcgi\" /var/log/zeus/admin_access.log (which executes the technical command / telemetry directive , grep -rn \"wizard.fcgi\"…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Toll-plaza",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "Unauthorized Local Administrator Account Creation in $ZEUSHOME/zxtm/conf/users",
          "storyExcerpt": "Reaching through the open setup window, the intruder writes a brand-new Full Supervisor name and password straight into the toll-plaza master employee ledger, creating a legitimate-looking insider…",
          "technicalParallel": "Under the hood, the observed step executes grep -E \"user|admin|wizard\" /usr/local/zeus/zxtm/log/events (which executes the technical command / telemetry directive , grep -E \"user|admin|wizard\"…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Door",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "Authenticated Admin Session & Custom Action Program Execution Audit",
          "storyExcerpt": "Returning to the front supervisor door with the freshly minted badge, the intruder signs in like an authorized manager and installs a custom automated lane-switching script, gaining direct command over…",
          "technicalParallel": "Under the hood, the observed step executes ls -la /usr/local/zeus/zxtm/conf/actions/ /usr/local/zeus/zxtm/conf/extra/ (which executes the technical command / telemetry directive , ls -la…",
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
          "label": "Setup Window",
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
          "label": "Staff Roster",
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
          "label": "Admin Key",
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
      "scenarioId": "ivanti-vtm-apache-ofbiz-auth-bypass-cve-2024-7593-audit",
      "sectionKey": "step-1",
      "sceneKind": "zday-ivanti-vtm-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Unauthenticated Access to wizard.fcgi on Port 9090 (CVE-2024-7593)",
      "storyCue": "Driving up the exposed management ramp, the intruder bypasses the locked main guard booth completely and reaches straight through the unlatched setup-wizard side window, which fails to demand any employee badge before accepting changes.",
      "technicalCue": "T1190 · INITIAL ACCESS — When the Ivanti Virtual Traffic Manager (vTM) management interface on TCP port 9090 is reachable from untrusted networks, an unauthenticated request to /apps/zxtm/wizard.fcgi invokes the…",
      "storyMappings": [
        {
          "storyTerm": "Exposed management ramp",
          "technicalTerm": "Ivanti vTM management interface reachable on TCP port 9090",
          "tone": "amber"
        },
        {
          "storyTerm": "Unlatched setup-wizard side window",
          "technicalTerm": "CVE-2024-7593 authentication bypass in wizard.fcgi",
          "tone": "sky"
        },
        {
          "storyTerm": "Locked main guard booth",
          "technicalTerm": "Normal authenticated vTM Admin UI login workflow",
          "tone": "rose"
        },
        {
          "storyTerm": "Missing badge check",
          "technicalTerm": "Unauthenticated HTTP POST accepted directly by the setup controller",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-ivanti-vtm-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Exposed management ramp",
          "subtitle": "Ivanti vTM management interface reachable on TCP port 9090",
          "tone": "amber"
        },
        {
          "id": "zday-ivanti-vtm-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Unlatched setup-wizard side window",
          "subtitle": "CVE-2024-7593 authentication bypass in wizard.fcgi",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Ramp",
          "stageTag": "STEP 01 · SETUP",
          "title": "Exposed management ramp",
          "storyExcerpt": "Driving up the exposed management ramp, the intruder bypasses the locked main guard booth completely and reaches straight through the unlatched setup-wizard side window, which fails to demand…",
          "technicalParallel": "Under the hood, the observed step executes grep -rn \"wizard.fcgi\" /var/log/zeus/admin_access.log (which executes the technical command / telemetry directive , grep -rn \"wizard.fcgi\"…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Side",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Unlatched setup-wizard side window",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses unlatched setup-wizard side window to advance toward locked main guard booth.",
          "technicalParallel": "When the Ivanti Virtual Traffic Manager (vTM) management interface on TCP port 9090 is reachable from untrusted networks, an unauthenticated request to /apps/zxtm/wizard.fcgi invokes the password-reset /…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Main",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Missing badge check",
          "storyExcerpt": "Behind the scenes, missing badge check captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Web Access Log Event 200 (recording VulnerabilityId=CVE-2024-7593 , CVSS 9.8 Critical, Ivanti vTM Authentication Bypass, TargetEndpoint=POST…",
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
          "label": "Setup Window",
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
          "label": "Staff Roster",
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
          "label": "Admin Key",
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
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "ivanti-vtm-apache-ofbiz-auth-bypass-cve-2024-7593-audit",
      "sectionKey": "step-2",
      "sceneKind": "zday-ivanti-vtm-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Unauthorized Local Administrator Account Creation in $ZEUSHOME/zxtm/conf/users",
      "storyCue": "Reaching through the open setup window, the intruder writes a brand-new Full Supervisor name and password straight into the toll-plaza master employee ledger, creating a legitimate-looking insider credential that survives ordinary shift changes.",
      "technicalCue": "T1136.001 · PERSISTENCE — Through the wizard.fcgi handler, the unauthenticated request creates a new Full Administrator user inside the local vTM configuration file ($ZEUSHOME/zxtm/conf/users) and emits an INFO/AUDIT…",
      "storyMappings": [
        {
          "storyTerm": "Toll-plaza master employee ledger",
          "technicalTerm": "$ZEUSHOME/zxtm/conf/users local administrator configuration file",
          "tone": "amber"
        },
        {
          "storyTerm": "Brand-new Full Supervisor name",
          "technicalTerm": "Rogue Full Administrator account (support_svc) provisioned via wizard.fcgi",
          "tone": "sky"
        },
        {
          "storyTerm": "Open setup window",
          "technicalTerm": "Unauthenticated wizard.fcgi account provisioning routine",
          "tone": "rose"
        },
        {
          "storyTerm": "Surviving ordinary shift changes",
          "technicalTerm": "Persistent local admin access remaining active even after patching",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-ivanti-vtm-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Toll-plaza master employee ledger",
          "subtitle": "$ZEUSHOME/zxtm/conf/users local administrator configuration file",
          "tone": "amber"
        },
        {
          "id": "zday-ivanti-vtm-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Brand-new Full Supervisor name",
          "subtitle": "Rogue Full Administrator account (support_svc) provisioned via…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Toll-plaza",
          "stageTag": "STEP 02 · SETUP",
          "title": "Toll-plaza master employee ledger",
          "storyExcerpt": "Reaching through the open setup window, the intruder writes a brand-new Full Supervisor name and password straight into the toll-plaza master employee ledger, creating a legitimate-looking…",
          "technicalParallel": "Under the hood, the observed step executes grep -E \"user|admin|wizard\" /usr/local/zeus/zxtm/log/events (which executes the technical command / telemetry directive , grep -E \"user|admin|wizard\"…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Full Name",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Brand-new Full Supervisor name",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses brand-new full supervisor name to advance toward open setup window.",
          "technicalParallel": "Through the wizard.fcgi handler, the unauthenticated request creates a new Full Administrator user inside the local vTM configuration file ($ZEUSHOME/zxtm/conf/users) and emits an INFO/AUDIT entry in the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Open",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Surviving ordinary shift changes",
          "storyExcerpt": "Behind the scenes, surviving ordinary shift changes captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 1136 (recording ModifiedConfigFile=/usr/local/zeus/zxtm/conf/users, CreatedAccount=support_svc , Assigned to Group: Admin, AuditLogSource=/usr/local/zeus/zxtm/log/events…",
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
          "label": "Setup Window",
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
          "label": "Staff Roster",
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
          "label": "Admin Key",
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
      "mitreId": "T1136.001"
    },
    "step-3": {
      "scenarioId": "ivanti-vtm-apache-ofbiz-auth-bypass-cve-2024-7593-audit",
      "sectionKey": "step-3",
      "sceneKind": "zday-ivanti-vtm-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "Authenticated Admin Session & Custom Action Program Execution Audit",
      "storyCue": "Returning to the front supervisor door with the freshly minted badge, the intruder signs in like an authorized manager and installs a custom automated lane-switching script, gaining direct command over the control tower machinery.",
      "technicalCue": "T1059.004 · EXECUTION — Authenticating with the newly created support_svc administrator account on port 9090, the operator uploads or configures a vTM Action Program ($ZEUSHOME/zxtm/conf/actions/ or extra/ scripts)…",
      "storyMappings": [
        {
          "storyTerm": "Front supervisor door",
          "technicalTerm": "Authenticated vTM Admin UI session on TCP port 9090",
          "tone": "amber"
        },
        {
          "storyTerm": "Freshly minted supervisor badge",
          "technicalTerm": "Rogue support_svc administrator login credentials",
          "tone": "sky"
        },
        {
          "storyTerm": "Custom automated lane-switching script",
          "technicalTerm": "Uploaded Custom Action Program executed by the vTM appliance",
          "tone": "rose"
        },
        {
          "storyTerm": "Control tower machinery",
          "technicalTerm": "Underlying Linux appliance OS and enterprise load-balanced traffic plane",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-ivanti-vtm-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Front supervisor door",
          "subtitle": "Authenticated vTM Admin UI session on TCP port 9090",
          "tone": "amber"
        },
        {
          "id": "zday-ivanti-vtm-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Freshly minted supervisor badge",
          "subtitle": "Rogue support_svc administrator login credentials",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Door",
          "stageTag": "STEP 03 · SETUP",
          "title": "Front supervisor door",
          "storyExcerpt": "Returning to the front supervisor door with the freshly minted badge, the intruder signs in like an authorized manager and installs a custom automated lane-switching script, gaining direct…",
          "technicalParallel": "Under the hood, the observed step executes ls -la /usr/local/zeus/zxtm/conf/actions/ /usr/local/zeus/zxtm/conf/extra/ (which executes the technical command / telemetry directive , ls -la…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Freshly minted supervisor badge",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses freshly minted supervisor badge to advance toward custom automated lane-switching script.",
          "technicalParallel": "Authenticating with the newly created support_svc administrator account on port 9090, the operator uploads or configures a vTM Action Program ($ZEUSHOME/zxtm/conf/actions/ or extra/ scripts) that spawns…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Lane-switching",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Control tower machinery",
          "storyExcerpt": "Behind the scenes, control tower machinery captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording ParentProcess=zeus.zxtm , PID 1840, running as uid=0 root, ExecutedArtifact=/usr/local/zeus/zxtm/conf/extra/healthcheck_diag.sh, ForensicIndicator=Config…",
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
          "label": "Setup Window",
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
          "label": "Staff Roster",
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
          "label": "Admin Key",
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
      "mitreId": "T1059.004"
    }
  },
  "paloalto-expedition-cve-2024-5910-chain": {
    "briefing": {
      "scenarioId": "paloalto-expedition-cve-2024-5910-chain",
      "sectionKey": "briefing",
      "sceneKind": "zday-expedition-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Palo Alto Expedition Admin Reset (CVE-2024-5910) & Cron RCE Chain… — Story-to-Technical Overview",
      "storyCue": "Imagine a master locksmith migration workshop that holds spare keys and floor plans for every fortress gate across an entire kingdom. An intruder spots an unguarded emergency reset button on the front counter that resets the shop manager lock back to the factory code, then slides a forged work ticket onto the workshop automated task belt to seize full control of the shop, and finally unlocks the safe to copy every live fortress gate key.",
      "technicalCue": "INITIAL ACCESS: Unauthenticated Admin Credential Reset via restoreAdmin.php (CVE-2024-5910) -> EXECUTION: OS Command Injection via Cron/Checkpoint Import Handler (CVE-2024-9463 / CVE-2024-9464) -> CREDENTIAL ACCESS: Dumping MySQL PAN-OS Firewall API Keys & Multi-Vendor Config Backups",
      "storyMappings": [
        {
          "storyTerm": "Locksmith migration workshop",
          "technicalTerm": "Palo Alto Networks Expedition configuration migration server",
          "tone": "amber"
        },
        {
          "storyTerm": "Unguarded emergency reset button",
          "technicalTerm": "Unauthenticated /OS/startup/restoreAdmin.php endpoint (CVE-2024-5910)",
          "tone": "sky"
        },
        {
          "storyTerm": "Workshop automated task belt",
          "technicalTerm": "CHECKPOINT.php import handler and MySQL cron job execution (CVE-2024-9463)",
          "tone": "rose"
        },
        {
          "storyTerm": "Live fortress gate keys in the workshop safe",
          "technicalTerm": "Decrypted PAN-OS XML API keys (LUFRPT1) stored in pandb.devices",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F97316",
      "secondaryHex": "#38BDF8",
      "durationSec": 18,
      "callouts": [
        {
          "id": "zday-expedition-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Locksmith migration workshop",
          "subtitle": "Palo Alto Networks Expedition configuration migration server",
          "tone": "amber"
        },
        {
          "id": "zday-expedition-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Unguarded emergency reset button",
          "subtitle": "Unauthenticated /OS/startup/restoreAdmin.php endpoint…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Shop",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Unauthenticated Admin Credential Reset via restoreAdmin.php (CVE-2024-5910)",
          "storyExcerpt": "Walking up to the locksmith workshop front counter without showing an employee badge, the intruder presses the exposed emergency reset switch. Instantly, the shop manager padlock reverts to the factory…",
          "technicalParallel": "In less than two HTTP requests, an unauthenticated remote attacker gained full administrative access to the Expedition web application.",
          "accentHex": "#F97316",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Form",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "OS Command Injection via Cron/Checkpoint Import Handler (CVE-2024-9463 / CVE-2024-9464)",
          "storyExcerpt": "Now holding the shop manager key, the intruder writes hidden workshop commands into a migration intake form and drops them onto the shop automated scheduling belt, tricking the back-room web clerk into…",
          "technicalParallel": "Because Expedition runs a root-privileged cron script every minute that reads job commands from the local MySQL database (whose credentials root / paloalto are hardcoded on the host), www-data execution…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Task Belt",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "Dumping MySQL PAN-OS Firewall API Keys & Multi-Vendor Config Backups",
          "storyExcerpt": "With complete control of the locksmith shop, the intruder opens the ledger cabinet, grabs the shop own master decoding key off the wall, and unlocks every stored fortress gate key and backup blueprint…",
          "technicalParallel": "Using a stolen LUFRPT1... API key, the attacker could immediately query https://<firewall>/api/?type=export&category=configuration or create administrative accounts on production PAN-OS firewalls.",
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
          "label": "Key Vault",
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
          "label": "Reset Switch",
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
          "label": "Master Reset",
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
      "scenarioId": "paloalto-expedition-cve-2024-5910-chain",
      "sectionKey": "step-1",
      "sceneKind": "zday-expedition-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Unauthenticated Admin Credential Reset via restoreAdmin.php (CVE-2024-5910)",
      "storyCue": "Walking up to the locksmith workshop front counter without showing an employee badge, the intruder presses the exposed emergency reset switch. Instantly, the shop manager padlock reverts to the factory combination printed in the public manual.",
      "technicalCue": "T1190 · INITIAL ACCESS — The attacker sent an unauthenticated HTTP request to /OS/startup/restoreAdmin.php on the Palo Alto Expedition web interface.",
      "storyMappings": [
        {
          "storyTerm": "Exposed emergency reset switch",
          "technicalTerm": "Unauthenticated HTTP request to /OS/startup/restoreAdmin.php",
          "tone": "amber"
        },
        {
          "storyTerm": "Missing employee badge check",
          "technicalTerm": "CVE-2024-5910 missing session authentication check",
          "tone": "sky"
        },
        {
          "storyTerm": "Factory combination in the public manual",
          "technicalTerm": "Default Expedition admin credentials restored on the appliance",
          "tone": "rose"
        },
        {
          "storyTerm": "Shop manager padlock",
          "technicalTerm": "Expedition web interface administrative account",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F97316",
      "secondaryHex": "#F97316",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-expedition-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Exposed emergency reset switch",
          "subtitle": "Unauthenticated HTTP request to /OS/startup/restoreAdmin.php",
          "tone": "amber"
        },
        {
          "id": "zday-expedition-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Missing employee badge check",
          "subtitle": "CVE-2024-5910 missing session authentication check",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Up Shop",
          "stageTag": "STEP 01 · SETUP",
          "title": "Exposed emergency reset switch",
          "storyExcerpt": "Walking up to the locksmith workshop front counter without showing an employee badge, the intruder presses the exposed emergency reset switch.",
          "technicalParallel": "In less than two HTTP requests, an unauthenticated remote attacker gained full administrative access to the Expedition web application.",
          "accentHex": "#F97316",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Shop",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Missing employee badge check",
          "storyExcerpt": "Instantly, the shop manager padlock reverts to the factory combination printed in the public manual.",
          "technicalParallel": "The attacker sent an unauthenticated HTTP request to /OS/startup/restoreAdmin.php on the Palo Alto Expedition web interface.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Shop",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Shop manager padlock",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across shop manager padlock while locking down factory combination in the public manual.",
          "technicalParallel": "Inspect Apache web access logs on the Expedition host for any GET or POST requests to /OS/startup/restoreAdmin.php (which should never be invoked during normal operations and directly confirms…",
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
          "label": "Key Vault",
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
          "label": "Reset Switch",
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
          "label": "Master Reset",
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
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "paloalto-expedition-cve-2024-5910-chain",
      "sectionKey": "step-2",
      "sceneKind": "zday-expedition-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "OS Command Injection via Cron/Checkpoint Import Handler (CVE-2024-9463 / CVE-2024-9464)",
      "storyCue": "Now holding the shop manager key, the intruder writes hidden workshop commands into a migration intake form and drops them onto the shop automated scheduling belt, tricking the back-room web clerk into running full operating commands across the workshop.",
      "technicalCue": "T1059.004 · EXECUTION — Using the hijacked admin session (or directly via unauthenticated CVE-2024-9463), the attacker submitted crafted parameters containing backticks/shell metacharacters to…",
      "storyMappings": [
        {
          "storyTerm": "Migration intake form with hidden commands",
          "technicalTerm": "Crafted shell metacharacters submitted to CHECKPOINT.php (CVE-2024-9463)",
          "tone": "amber"
        },
        {
          "storyTerm": "Automated scheduling belt",
          "technicalTerm": "Expedition MySQL cron job table and periodic task runner",
          "tone": "sky"
        },
        {
          "storyTerm": "Back-room web clerk",
          "technicalTerm": "/usr/sbin/apache2 process running as www-data",
          "tone": "rose"
        },
        {
          "storyTerm": "Full operating commands across the workshop",
          "technicalTerm": "Spawned /bin/sh -c command execution escalating to root",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F97316",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-expedition-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Migration intake form with hidden commands",
          "subtitle": "Crafted shell metacharacters submitted to CHECKPOINT.php…",
          "tone": "amber"
        },
        {
          "id": "zday-expedition-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Automated scheduling belt",
          "subtitle": "Expedition MySQL cron job table and periodic task runner",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Form",
          "stageTag": "STEP 02 · SETUP",
          "title": "Migration intake form with hidden commands",
          "storyExcerpt": "Now holding the shop manager key, the intruder writes hidden workshop commands into a migration intake form and drops them onto the shop automated scheduling belt, tricking the back-room web…",
          "technicalParallel": "Because Expedition runs a root-privileged cron script every minute that reads job commands from the local MySQL database (whose credentials root / paloalto are hardcoded on the host), www-data execution…",
          "accentHex": "#F97316",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Belt",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Automated scheduling belt",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses automated scheduling belt to advance toward back-room web clerk.",
          "technicalParallel": "Using the hijacked admin session (or directly via unauthenticated CVE-2024-9463), the attacker submitted crafted parameters containing backticks/shell metacharacters to…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Back-room Web",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Full operating commands across the workshop",
          "storyExcerpt": "Behind the scenes, full operating commands across the workshop captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Monitor Linux process execution logs for /usr/sbin/apache2 spawning /bin/sh -c from CHECKPOINT.php alongside unauthorized rows inserted into the Expedition MySQL cron job table (identifying active…",
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
          "label": "Key Vault",
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
          "label": "Reset Switch",
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
          "label": "Master Reset",
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
      "mitreId": "T1059.004"
    },
    "step-3": {
      "scenarioId": "paloalto-expedition-cve-2024-5910-chain",
      "sectionKey": "step-3",
      "sceneKind": "zday-expedition-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Dumping MySQL PAN-OS Firewall API Keys & Multi-Vendor Config Backups",
      "storyCue": "With complete control of the locksmith shop, the intruder opens the ledger cabinet, grabs the shop own master decoding key off the wall, and unlocks every stored fortress gate key and backup blueprint for the kingdom perimeter walls.",
      "technicalCue": "T1552.001 · CREDENTIAL ACCESS — The attacker dumped the pandb.devices MySQL table and extracted the stored encryption key from the Expedition codebase to decrypt the saved PAN-OS XML API keys (LUFRPT1..., long-lived…",
      "storyMappings": [
        {
          "storyTerm": "Ledger cabinet",
          "technicalTerm": "Expedition pandb.devices MySQL database table",
          "tone": "amber"
        },
        {
          "storyTerm": "Master decoding key off the wall",
          "technicalTerm": "Stored decryption key extracted from the Expedition PHP codebase",
          "tone": "sky"
        },
        {
          "storyTerm": "Stored fortress gate keys",
          "technicalTerm": "Decrypted PAN-OS XML API keys (LUFRPT1 administrative bearer tokens)",
          "tone": "rose"
        },
        {
          "storyTerm": "Backup blueprints for the perimeter walls",
          "technicalTerm": "Imported Cisco ASA, Fortinet, and Check Point firewall configurations",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-expedition-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Ledger cabinet",
          "subtitle": "Expedition pandb.devices MySQL database table",
          "tone": "amber"
        },
        {
          "id": "zday-expedition-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Master decoding key off the wall",
          "subtitle": "Stored decryption key extracted from the Expedition PHP codebase",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Shop Shop",
          "stageTag": "STEP 03 · SETUP",
          "title": "Stage 3: Dumping MySQL PAN-OS Firewall API Keys &…",
          "storyExcerpt": "With complete control of the locksmith shop, the intruder opens the ledger cabinet, grabs the shop own master decoding key off the wall, and unlocks every stored fortress gate key and backup…",
          "technicalParallel": "Using a stolen LUFRPT1... API key, the attacker could immediately query https://<firewall>/api/?type=export&category=configuration or create administrative accounts on production PAN-OS firewalls.",
          "accentHex": "#F97316",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Key Off",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Master decoding key off the wall",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses master decoding key off the wall to advance toward stored fortress gate keys.",
          "technicalParallel": "The attacker dumped the pandb.devices MySQL table and extracted the stored encryption key from the Expedition codebase to decrypt the saved PAN-OS XML API keys (LUFRPT1..., long-lived administrative…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Gate Keys",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Backup blueprints for the perimeter walls",
          "storyExcerpt": "Behind the scenes, backup blueprints for the perimeter walls captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "PAN-OS system/config logs showing XML API requests (type=export, type=config, type=op) originating from the Expedition host IP or unknown internal hosts.",
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
          "label": "Key Vault",
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
          "label": "Reset Switch",
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
          "label": "Master Reset",
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
      "mitreId": "T1552.001"
    }
  },
  "sonicwall-sslvpn-cve-2024-40766-akira": {
    "briefing": {
      "scenarioId": "sonicwall-sslvpn-cve-2024-40766-akira",
      "sectionKey": "briefing",
      "sceneKind": "zday-sonicwall-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "SonicWall SonicOS SSLVPN Access Control Bypass & Akira/Fog Ransomware… — Story-to-Technical Overview",
      "storyCue": "Imagine a modern office tower whose lobby revolving door has a faulty lock mechanism on its remote visitor keypad. An intruder exploits that latch flaw to slip through the front lobby using a local staff door code with no second-factor check, walks upstairs to map every department and bolt a private remote intercom onto the maintenance room, and finally shreds every backup binder before padlocking every filing cabinet across the building for ransom.",
      "technicalCue": "INITIAL ACCESS: SonicOS SSLVPN Improper Access Control Exploitation (CVE-2024-40766) -> LATERAL & C2: Network Scanning, Impacket SMB Execution & AnyDesk Persistence -> EXFIL & IMPACT: PowerShell CIM Shadow Copy Deletion & Akira/Fog Encryption",
      "storyMappings": [
        {
          "storyTerm": "Lobby revolving door keypad",
          "technicalTerm": "Internet-exposed SonicWall SonicOS SSLVPN portal (TCP/4433 or 443)",
          "tone": "amber"
        },
        {
          "storyTerm": "Faulty lock mechanism",
          "technicalTerm": "CVE-2024-40766 improper access control vulnerability in SonicOS",
          "tone": "sky"
        },
        {
          "storyTerm": "Private remote intercom",
          "technicalTerm": "Unauthorized AnyDesk remote management tool deployed for persistence",
          "tone": "rose"
        },
        {
          "storyTerm": "Shredding backup binders and padlocking cabinets",
          "technicalTerm": "Win32_ShadowCopy deletion followed by Akira or Fog ransomware encryption",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "zday-sonicwall-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Lobby revolving door keypad",
          "subtitle": "Internet-exposed SonicWall SonicOS SSLVPN portal (TCP/4433 or…",
          "tone": "amber"
        },
        {
          "id": "zday-sonicwall-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Faulty lock mechanism",
          "subtitle": "CVE-2024-40766 improper access control vulnerability in SonicOS",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Door",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "SonicOS SSLVPN Improper Access Control Exploitation (CVE-2024-40766)",
          "storyExcerpt": "Standing outside the office tower lobby, the intruder triggers the faulty latch on the remote visitor door and walks inside under a local staff code that never asks for a pocket token, quietly claiming…",
          "technicalParallel": "Once the SSLVPN session established from a commercial VPS IP, the SonicWall appliance assigned an internal virtual IP from the SSLVPN address pool (e.g., 10.212.134.105), placing the attacker directly on…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Lock",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "Network Scanning, Impacket SMB Execution & AnyDesk Persistence",
          "storyExcerpt": "Once past the lobby, the intruder reads the hallway floor directory to locate the executive offices, sends remote maintenance orders down the building service pipes to take over neighboring rooms, and…",
          "technicalParallel": "By deploying AnyDesk or Cloudflared tunnels within minutes of initial SSLVPN entry, Akira and Fog affiliates retained access even after administrators applied the SonicOS firmware patch.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Out Dock",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "PowerShell CIM Shadow Copy Deletion & Akira/Fog Encryption",
          "storyExcerpt": "After wheeling cartons of confidential company files out the loading dock, the intruder runs an industrial shredder through every backup binder in the storage vault and snaps heavy combination padlocks…",
          "technicalParallel": "Akira operators also deployed their Linux/ESXi Rust/C++ encryptor (akira_esxi) via SSH onto VMware ESXi hypervisors to encrypt .vmdk and .vswp virtual machine disks simultaneously.",
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
          "label": "Door Keypad",
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
          "label": "Backup Vault",
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
          "label": "Latch Breach",
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
      "scenarioId": "sonicwall-sslvpn-cve-2024-40766-akira",
      "sectionKey": "step-1",
      "sceneKind": "zday-sonicwall-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "SonicOS SSLVPN Improper Access Control Exploitation (CVE-2024-40766)",
      "storyCue": "Standing outside the office tower lobby, the intruder triggers the faulty latch on the remote visitor door and walks inside under a local staff code that never asks for a pocket token, quietly claiming an internal building pass.",
      "technicalCue": "T1190 · INITIAL ACCESS — Targeting WAN-exposed SonicWall SSLVPN interfaces (commonly on TCP port 4433 or 443), the attacker exploited CVE-2024-40766 (an improper access control vulnerability in the SonicOS SSLVPN…",
      "storyMappings": [
        {
          "storyTerm": "Remote visitor door",
          "technicalTerm": "WAN-facing SonicWall SSLVPN service (Gen 5, Gen 6, or Gen 7)",
          "tone": "amber"
        },
        {
          "storyTerm": "Faulty latch flaw",
          "technicalTerm": "CVE-2024-40766 improper access control bypass",
          "tone": "sky"
        },
        {
          "storyTerm": "Local staff code without a pocket token",
          "technicalTerm": "Local SonicOS firewall user account lacking TOTP MFA enforcement",
          "tone": "rose"
        },
        {
          "storyTerm": "Internal building pass",
          "technicalTerm": "Allocated corporate SSLVPN IP lease inside the internal LAN",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-sonicwall-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Remote visitor door",
          "subtitle": "WAN-facing SonicWall SSLVPN service (Gen 5, Gen 6, or Gen 7)",
          "tone": "amber"
        },
        {
          "id": "zday-sonicwall-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Faulty latch flaw",
          "subtitle": "CVE-2024-40766 improper access control bypass",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Door",
          "stageTag": "STEP 01 · SETUP",
          "title": "Remote visitor door",
          "storyExcerpt": "Standing outside the office tower lobby, the intruder triggers the faulty latch on the remote visitor door and walks inside under a local staff code that never asks for a pocket token, quietly…",
          "technicalParallel": "Once the SSLVPN session established from a commercial VPS IP, the SonicWall appliance assigned an internal virtual IP from the SSLVPN address pool (e.g., 10.212.134.105), placing the attacker directly on…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Flaw",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Faulty latch flaw",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses faulty latch flaw to advance toward local staff code without a pocket token.",
          "technicalParallel": "Targeting WAN-exposed SonicWall SSLVPN interfaces (commonly on TCP port 4433 or 443), the attacker exploited CVE-2024-40766 (an improper access control vulnerability in the SonicOS SSLVPN authentication…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Code",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Internal building pass",
          "storyExcerpt": "Behind the scenes, internal building pass captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "SonicOS SSLVPN logs showing sessions established from commercial hosting ASNs (45.86.201.0/24, etc.) and logins by local firewall accounts lacking TOTP MFA.",
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
          "label": "Door Keypad",
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
          "label": "Backup Vault",
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
          "label": "Latch Breach",
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
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "sonicwall-sslvpn-cve-2024-40766-akira",
      "sectionKey": "step-2",
      "sceneKind": "zday-sonicwall-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "Network Scanning, Impacket SMB Execution & AnyDesk Persistence",
      "storyCue": "Once past the lobby, the intruder reads the hallway floor directory to locate the executive offices, sends remote maintenance orders down the building service pipes to take over neighboring rooms, and bolts a private intercom box onto the wall so they can walk back in even if the lobby lock gets repaired.",
      "technicalCue": "T1021.002 · LATERAL & C2 — From the allocated SSLVPN IP, the operator ran Active Directory discovery (nltest /dclist, net group \"Domain Admins\" /domain), used Impacket wmiexec.py (which executes commands remotely via…",
      "storyMappings": [
        {
          "storyTerm": "Hallway floor directory",
          "technicalTerm": "Active Directory enumeration via nltest /dclist and net group queries",
          "tone": "amber"
        },
        {
          "storyTerm": "Remote maintenance orders over service pipes",
          "technicalTerm": "Impacket wmiexec.py lateral execution over SMB and WMI (WmiPrvSE.exe)",
          "tone": "sky"
        },
        {
          "storyTerm": "Private intercom box",
          "technicalTerm": "Unauthorized AnyDesk.exe installation for out-of-band persistence",
          "tone": "rose"
        },
        {
          "storyTerm": "Neighboring rooms",
          "technicalTerm": "Internal Windows domain servers and workstations",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-sonicwall-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Hallway floor directory",
          "subtitle": "Active Directory enumeration via nltest /dclist and net group…",
          "tone": "amber"
        },
        {
          "id": "zday-sonicwall-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Remote maintenance orders over service…",
          "subtitle": "Impacket wmiexec.py lateral execution over SMB and WMI…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Past Down",
          "stageTag": "STEP 02 · SETUP",
          "title": "Hallway floor directory",
          "storyExcerpt": "Once past the lobby, the intruder reads the hallway floor directory to locate the executive offices, sends remote maintenance orders down the building service pipes to take over neighboring…",
          "technicalParallel": "By deploying AnyDesk or Cloudflared tunnels within minutes of initial SSLVPN entry, Akira and Fog affiliates retained access even after administrators applied the SonicOS firmware patch.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Over",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Remote maintenance orders over service pipes",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses remote maintenance orders over service pipes to advance toward private intercom box.",
          "technicalParallel": "From the allocated SSLVPN IP, the operator ran Active Directory discovery (nltest /dclist, net group \"Domain Admins\" /domain), used Impacket wmiexec.py (which executes commands remotely via Windows…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Past Down",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Neighboring rooms",
          "storyExcerpt": "Behind the scenes, neighboring rooms captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert on Sysmon EventID 1 (Process Creation telemetry capturing full process lineage and command lines) showing WmiPrvSE.exe spawning cmd.exe /Q /c redirected to \\\\127.0.0.1\\ADMIN$\\__* (the unmistakable…",
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
          "label": "Door Keypad",
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
          "label": "Backup Vault",
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
          "label": "Latch Breach",
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
    "step-3": {
      "scenarioId": "sonicwall-sslvpn-cve-2024-40766-akira",
      "sectionKey": "step-3",
      "sceneKind": "zday-sonicwall-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "PowerShell CIM Shadow Copy Deletion & Akira/Fog Encryption",
      "storyCue": "After wheeling cartons of confidential company files out the loading dock, the intruder runs an industrial shredder through every backup binder in the storage vault and snaps heavy combination padlocks onto every filing cabinet, leaving a ransom note demanding payment for the combinations.",
      "technicalCue": "T1490 · EXFIL & IMPACT — After exfiltrating sensitive data with Rclone or WinSCP, the attacker executed powershell.exe -Command \"Get-CimInstance Win32_ShadowCopy | Remove-CimInstance\" (deleting Volume Shadow Copies via…",
      "storyMappings": [
        {
          "storyTerm": "Wheeling cartons out the loading dock",
          "technicalTerm": "Data exfiltration using Rclone or WinSCP to attacker-controlled storage",
          "tone": "amber"
        },
        {
          "storyTerm": "Industrial shredder destroying backup binders",
          "technicalTerm": "PowerShell Get-CimInstance Win32_ShadowCopy | Remove-CimInstance",
          "tone": "sky"
        },
        {
          "storyTerm": "Heavy combination padlocks on filing cabinets",
          "technicalTerm": "Akira or Fog ransomware mass file encryption (.akira / .fog extensions)",
          "tone": "rose"
        },
        {
          "storyTerm": "Ransom note demanding payment",
          "technicalTerm": "Double-extortion ransom note dropped after volume shadow copy wipe",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-sonicwall-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Wheeling cartons out the loading dock",
          "subtitle": "Data exfiltration using Rclone or WinSCP to…",
          "tone": "amber"
        },
        {
          "id": "zday-sonicwall-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Industrial shredder destroying backup…",
          "subtitle": "PowerShell Get-CimInstance Win32_ShadowCopy | Remove-CimInstance",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Out Dock",
          "stageTag": "STEP 03 · SETUP",
          "title": "Wheeling cartons out the loading dock",
          "storyExcerpt": "After wheeling cartons of confidential company files out the loading dock, the intruder runs an industrial shredder through every backup binder in the storage vault and snaps heavy combination…",
          "technicalParallel": "Akira operators also deployed their Linux/ESXi Rust/C++ encryptor (akira_esxi) via SSH onto VMware ESXi hypervisors to encrypt .vmdk and .vswp virtual machine disks simultaneously.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Industrial shredder destroying backup binders",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses industrial shredder destroying backup binders to advance toward heavy combination padlocks on filing cabinets.",
          "technicalParallel": "After exfiltrating sensitive data with Rclone or WinSCP, the attacker executed powershell.exe -Command \"Get-CimInstance Win32_ShadowCopy | Remove-CimInstance\" (deleting Volume Shadow Copies via the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Note",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Ransom note demanding payment",
          "storyExcerpt": "Behind the scenes, ransom note demanding payment captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Correlate PowerShell ScriptBlock Logging EventID 4104 (which records full deobfuscated PowerShell script contents executed in memory) capturing Win32_ShadowCopy | Remove-CimInstance with EDR…",
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
          "label": "Door Keypad",
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
          "label": "Backup Vault",
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
          "label": "Latch Breach",
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
      "mitreId": "T1490"
    }
  },
  "sophos-firewall-cve-2022-3236-asnarok": {
    "briefing": {
      "scenarioId": "sophos-firewall-cve-2022-3236-asnarok",
      "sectionKey": "briefing",
      "sceneKind": "zday-sophos-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Sophos Firewall User Portal/Webadmin JSON Code Injection (CVE-2022-3236… — Story-to-Technical Overview",
      "storyCue": "Imagine a two-desk embassy reception hall where every visitor hands over a written entry slip. The front guard inspects the slip for forbidden instructions, but stops reading the instant they hit an invisible blank stamp. Behind the curtain, the back-office director reads right past the blank stamp and obeys the hidden orders written after it, handing the spy master control to wire a secret carbon-copy pad under the login book and tunnel straight into the embassy.",
      "technicalCue": "INITIAL ACCESS: Crafted JSON mode=151 Request to /webconsole/Controller (CVE-2022-3236) -> EXECUTION: Cyberoam System Controller (csc) Perl/Shell Evaluation as Root -> CREDENTIAL ACCESS: Trojanized Login CGI Credential Harvesting & Persistent Reverse Tunnel",
      "storyMappings": [
        {
          "storyTerm": "Front guard stopping at an invisible blank stamp",
          "technicalTerm": "Java servlet filter stopping validation at a null byte (\\u0000 / %00)",
          "tone": "amber"
        },
        {
          "storyTerm": "Back-office director obeying hidden orders",
          "technicalTerm": "Privileged backend csc daemon evaluating injected shell commands as root",
          "tone": "sky"
        },
        {
          "storyTerm": "Secret carbon-copy pad under the login book",
          "technicalTerm": "Trojanized User Portal and Webadmin login scripts logging cleartext credentials",
          "tone": "rose"
        },
        {
          "storyTerm": "Hidden tunnel into the embassy",
          "technicalTerm": "Persistent socat TLS reverse relay into the internal corporate LAN",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "zday-sophos-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Front guard stopping at an invisible…",
          "subtitle": "Java servlet filter stopping validation at a null byte (\\u0000…",
          "tone": "amber"
        },
        {
          "id": "zday-sophos-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Back-office director obeying hidden orders",
          "subtitle": "Privileged backend csc daemon evaluating injected shell…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Crafted JSON mode=151 Request to /webconsole/Controller (CVE-2022-3236)",
          "storyExcerpt": "At the front reception desk, the spy submits a normal-looking entry slip with an invisible blank stamp placed right before a line of secret orders. The front guard checks the harmless name before the…",
          "technicalParallel": "Because mode=151 is the standard pre-authentication login request handler for both the User Portal and Webadmin, the exploit worked without any prior credentials.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Keys",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "Cyberoam System Controller (csc) Perl/Shell Evaluation as Root",
          "storyExcerpt": "In the back room, the senior controller who carries master building keys reads the entire slip past the blank stamp and executes the hidden instructions immediately, fetching a second stage of spy tools…",
          "technicalParallel": "Volexity observed DriftingCloud using this primitive to selectively target high-value organizations in South Asia while leaving minimal disk artifacts.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Sign-in Book",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "Trojanized Login CGI Credential Harvesting & Persistent Reverse Tunnel",
          "storyExcerpt": "Now owning the embassy gatehouse, the spy slips a carbon-copy sheet underneath the reception sign-in book so every employee badge code gets silently copied into a hidden pocket, and opens a private…",
          "technicalParallel": "Even after the CVE-2022-3236 hotfix was applied, harvested cleartext VPN and Active Directory credentials allowed the threat actor to authenticate legitimately unless passwords were rotated.",
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
          "label": "Guard Stamp",
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
          "label": "Login Ledger",
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
          "label": "Back Relay",
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
      "scenarioId": "sophos-firewall-cve-2022-3236-asnarok",
      "sectionKey": "step-1",
      "sceneKind": "zday-sophos-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Crafted JSON mode=151 Request to /userportal/Controller (CVE-2022-3236)",
      "storyCue": "At the front reception desk, the spy submits a normal-looking entry slip with an invisible blank stamp placed right before a line of secret orders. The front guard checks the harmless name before the blank stamp, marks the slip clean, and slides it through the slot to the back room.",
      "technicalCue": "T1190 · INITIAL ACCESS — DriftingCloud sent an unauthenticated HTTP POST request to /userportal/Controller (or /webconsole/Controller) with mode=151 and a json parameter whose \"username\" field contained a null byte…",
      "storyMappings": [
        {
          "storyTerm": "Front reception desk",
          "technicalTerm": "Pre-authentication /userportal/Controller and /webconsole/Controller endpoints",
          "tone": "amber"
        },
        {
          "storyTerm": "Normal-looking entry slip",
          "technicalTerm": "HTTP POST mode=151 JSON authentication request",
          "tone": "sky"
        },
        {
          "storyTerm": "Invisible blank stamp",
          "technicalTerm": "Null byte (\\u0000 or %00) triggering the CVE-2022-3236 parser differential",
          "tone": "rose"
        },
        {
          "storyTerm": "Front guard marking the slip clean",
          "technicalTerm": "Java servlet input filter halting inspection before the injected commands",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-sophos-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Front reception desk",
          "subtitle": "Pre-authentication /userportal/Controller and…",
          "tone": "amber"
        },
        {
          "id": "zday-sophos-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Normal-looking entry slip",
          "subtitle": "HTTP POST mode=151 JSON authentication request",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STEP 01 · SETUP",
          "title": "Front reception desk",
          "storyExcerpt": "At the front reception desk, the spy submits a normal-looking entry slip with an invisible blank stamp placed right before a line of secret orders.",
          "technicalParallel": "Because mode=151 is the standard pre-authentication login request handler for both the User Portal and Webadmin, the exploit worked without any prior credentials.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Slip",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Normal-looking entry slip",
          "storyExcerpt": "The front guard checks the harmless name before the blank stamp, marks the slip clean, and slides it through the slot to the back room.",
          "technicalParallel": "DriftingCloud sent an unauthenticated HTTP POST request to /userportal/Controller (or /webconsole/Controller) with mode=151 and a json parameter whose \"username\" field contained a null byte (\\u0000) or…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Slip",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Front guard marking the slip clean",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across front guard marking the slip clean while locking down invisible blank stamp.",
          "technicalParallel": "Review Sophos /log/apache_access.log and perimeter WAF alerts for HTTP POST mode=151 requests containing %00, \\u0000, %0a, or shell metacharacters inside the json parameter (identifying…",
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
          "label": "Guard Stamp",
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
          "label": "Login Ledger",
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
          "label": "Back Relay",
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
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "sophos-firewall-cve-2022-3236-asnarok",
      "sectionKey": "step-2",
      "sceneKind": "zday-sophos-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Cyberoam System Controller (csc) Perl/Shell Evaluation as Root",
      "storyCue": "In the back room, the senior controller who carries master building keys reads the entire slip past the blank stamp and executes the hidden instructions immediately, fetching a second stage of spy tools straight into memory without leaving papers on the desk.",
      "technicalCue": "T1059.004 · EXECUTION — When the front-end Java controller forwarded the JSON payload to the backend Cyberoam System Controller (csc) daemon, csc evaluated the unsanitized parameter inside a privileged Perl/shell…",
      "storyMappings": [
        {
          "storyTerm": "Senior controller with master building keys",
          "technicalTerm": "Cyberoam System Controller (/bin/csc) running as root (UID 0)",
          "tone": "amber"
        },
        {
          "storyTerm": "Executing hidden instructions immediately",
          "technicalTerm": "Unsanitized Perl/shell evaluation spawning /bin/sh -c",
          "tone": "sky"
        },
        {
          "storyTerm": "Fetching spy tools straight into memory",
          "technicalTerm": "In-memory fetch and execution of DriftingCloud second-stage shell script",
          "tone": "rose"
        },
        {
          "storyTerm": "Leaving no papers on the desk",
          "technicalTerm": "Minimal on-disk payload footprint during initial memory staging",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-sophos-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Senior controller with master building…",
          "subtitle": "Cyberoam System Controller (/bin/csc) running as root (UID 0)",
          "tone": "amber"
        },
        {
          "id": "zday-sophos-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Executing hidden instructions immediately",
          "subtitle": "Unsanitized Perl/shell evaluation spawning /bin/sh -c",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Keys",
          "stageTag": "STEP 02 · SETUP",
          "title": "Senior controller with master building keys",
          "storyExcerpt": "In the back room, the senior controller who carries master building keys reads the entire slip past the blank stamp and executes the hidden instructions immediately, fetching a second stage of…",
          "technicalParallel": "Volexity observed DriftingCloud using this primitive to selectively target high-value organizations in South Asia while leaving minimal disk artifacts.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Spy",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Executing hidden instructions immediately",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses executing hidden instructions immediately to advance toward fetching spy tools straight into memory.",
          "technicalParallel": "When the front-end Java controller forwarded the JSON payload to the backend Cyberoam System Controller (csc) daemon, csc evaluated the unsanitized parameter inside a privileged Perl/shell routine…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. No Desk",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Leaving no papers on the desk",
          "storyExcerpt": "Behind the scenes, leaving no papers on the desk captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Check /log/csc.log for malformed opcode or JSON parsing errors paired with host telemetry showing /bin/csc spawning child /bin/sh processes (confirming that the payload crossed from the Java servlet into…",
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
          "label": "Guard Stamp",
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
          "label": "Login Ledger",
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
          "label": "Back Relay",
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
      "mitreId": "T1059.004"
    },
    "step-3": {
      "scenarioId": "sophos-firewall-cve-2022-3236-asnarok",
      "sectionKey": "step-3",
      "sceneKind": "zday-sophos-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Trojanized Login CGI Credential Harvesting & Persistent Reverse Tunnel",
      "storyCue": "Now owning the embassy gatehouse, the spy slips a carbon-copy sheet underneath the reception sign-in book so every employee badge code gets silently copied into a hidden pocket, and opens a private encrypted crawlspace leading straight into the inner embassy offices.",
      "technicalCue": "T1556 · CREDENTIAL ACCESS — Running as root on the perimeter appliance, DriftingCloud modified the User Portal/Webadmin authentication scripts to intercept and log cleartext passwords to a hidden stash file…",
      "storyMappings": [
        {
          "storyTerm": "Carbon-copy sheet under the sign-in book",
          "technicalTerm": "Trojanized User Portal and Webadmin CGI login authentication scripts",
          "tone": "amber"
        },
        {
          "storyTerm": "Hidden pocket storing copied badge codes",
          "technicalTerm": "Cleartext credential stash file written to /var/tmp/.auth.log",
          "tone": "sky"
        },
        {
          "storyTerm": "Private encrypted crawlspace",
          "technicalTerm": "Persistent socat TLS reverse tunnel proxying into the internal corporate LAN",
          "tone": "rose"
        },
        {
          "storyTerm": "Employee badge codes",
          "technicalTerm": "Harvested VPN and Active Directory credentials remaining valid after patching",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-sophos-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Carbon-copy sheet under the sign-in book",
          "subtitle": "Trojanized User Portal and Webadmin CGI login authentication…",
          "tone": "amber"
        },
        {
          "id": "zday-sophos-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Hidden pocket storing copied badge codes",
          "subtitle": "Cleartext credential stash file written to /var/tmp/.auth.log",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Sign-in Book",
          "stageTag": "STEP 03 · SETUP",
          "title": "Carbon-copy sheet under the sign-in book",
          "storyExcerpt": "Now owning the embassy gatehouse, the spy slips a carbon-copy sheet underneath the reception sign-in book so every employee badge code gets silently copied into a hidden pocket, and opens a…",
          "technicalParallel": "Even after the CVE-2022-3236 hotfix was applied, harvested cleartext VPN and Active Directory credentials allowed the threat actor to authenticate legitimately unless passwords were rotated.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Hidden pocket storing copied badge codes",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses hidden pocket storing copied badge codes to advance toward private encrypted crawlspace.",
          "technicalParallel": "Running as root on the perimeter appliance, DriftingCloud modified the User Portal/Webadmin authentication scripts to intercept and log cleartext passwords to a hidden stash file (/var/tmp/.auth.log)…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Now Spy",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Employee badge codes",
          "storyExcerpt": "Behind the scenes, employee badge codes captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Run filesystem integrity checks across /usr/share/userportal and /usr/share/webconsole, audit running firewall processes for unauthorized socat or ssh binaries, and inspect outbound TLS connections from…",
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
          "label": "Guard Stamp",
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
          "label": "Login Ledger",
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
          "label": "Back Relay",
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
      "mitreId": "T1556"
    }
  },
  "versa-director-sdwan-guiclient-jar-upload-cve-2024-39717-audit": {
    "briefing": {
      "scenarioId": "versa-director-sdwan-guiclient-jar-upload-cve-2024-39717-audit",
      "sectionKey": "briefing",
      "sceneKind": "zday-versa-sdwan-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Versa Director SD-WAN Port 4566 Favicon Upload & Java Agent Audit… — Story-to-Technical Overview",
      "storyCue": "Imagine a regional air-traffic dispatch center with a side emblem chute meant solely for small painted station logos. Because the chute never checks whether an incoming emblem is truly a flat picture or a folded clockwork mechanism, an intruder slides a hidden gear assembly disguised as a logo inside, snaps that gear directly onto the spinning dispatch turntable while it runs, and then shreds the original paper wrapper so a routine desk inspection sees nothing until investigators photograph the spinning turntable itself.",
      "technicalCue": "INITIAL ACCESS: Port 4566 /portalapi change_Dynamic_Favicon File Type Validation Bypass (CVE-2024-39717) -> PERSISTENCE: JVM VirtualMachine.attach & Java Instrumentation Agent Injection (VersaMem) -> DEFENSE EVASION: On-Disk JAR Deletion & Live JVM Heap / Class Dump Forensics",
      "storyMappings": [
        {
          "storyTerm": "Side emblem chute meant for painted station logos",
          "technicalTerm": "Port 4566 /portalapi change_Dynamic_Favicon upload endpoint (CVE-2024-39717)",
          "tone": "amber"
        },
        {
          "storyTerm": "Folded clockwork gear disguised as a logo",
          "technicalTerm": "Malicious JAR archive with ZIP magic bytes (50 4B 03 04) saved as favicon_brand.png",
          "tone": "sky"
        },
        {
          "storyTerm": "Snapping the gear onto the spinning dispatch turntable",
          "technicalTerm": "JVM VirtualMachine.attach loading VersaMem Java Instrumentation Agent into Tomcat",
          "tone": "rose"
        },
        {
          "storyTerm": "Shredding the paper wrapper while investigators photograph the turntable",
          "technicalTerm": "On-disk unlinkat deletion countered by live jmap JVM heap forensic dump",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "zday-versa-sdwan-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Side emblem chute meant for painted…",
          "subtitle": "Port 4566 /portalapi change_Dynamic_Favicon upload endpoint…",
          "tone": "amber"
        },
        {
          "id": "zday-versa-sdwan-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Folded clockwork gear disguised as a logo",
          "subtitle": "Malicious JAR archive with ZIP magic bytes (50 4B 03 04) saved…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Side",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Port 4566 /portalapi change_Dynamic_Favicon File Type Validation Bypass (CVE-2024-39717)",
          "storyExcerpt": "Approaching the dispatch center side coordination chute, the intruder drops in a dense metal clockwork assembly painted to look like a harmless little station badge. Because the chute only checks the…",
          "technicalParallel": "Under the hood, the observed step executes grep -rn \"change_Dynamic_Favicon\" /var/log/versa/vnms/ (which executes the technical command / telemetry directive , grep -rn \"change_Dynamic_Favicon\"…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Gear Logo",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "JVM VirtualMachine.attach & Java Instrumentation Agent Injection (VersaMem)",
          "storyExcerpt": "Using an official maintenance coupling socket built into the live dispatch console, the intruder snaps the disguised clockwork gear directly onto the spinning traffic-routing turntable. From that moment…",
          "technicalParallel": "Under the hood, the observed step executes jcmd $(pgrep -f tomcat) VM.class_hierarchy -i org.apache.catalina.core.ApplicationFilterChain (which invokes or targets the host daemon/process , jcmd $, pgrep…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Gear Onto",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "On-Disk JAR Deletion & Live JVM Heap / Class Dump Forensics",
          "storyExcerpt": "Once the clockwork gear is locked onto the spinning turntable, the intruder sweeps the original badge package into an incinerator so a casual look inside the emblem drawer finds nothing unusual. Skilled…",
          "technicalParallel": "Under the hood, the observed step executes jmap -dump:live,format=b,file=/cases/versa_tomcat_heap.hprof $(pgrep -f tomcat) (which invokes or targets the host daemon/process , jmap…",
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
          "label": "Emblem Chute",
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
          "label": "Spinning Gear",
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
          "label": "Heap Audit",
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
      "scenarioId": "versa-director-sdwan-guiclient-jar-upload-cve-2024-39717-audit",
      "sectionKey": "step-1",
      "sceneKind": "zday-versa-sdwan-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Port 4566 /portalapi change_Dynamic_Favicon File Type Validation Bypass (CVE-2024-39717)",
      "storyCue": "Approaching the dispatch center side coordination chute, the intruder drops in a dense metal clockwork assembly painted to look like a harmless little station badge. Because the chute only checks the paper label instead of weighing or X-raying the package, it shelves the disguised mechanism inside the station emblem drawer.",
      "technicalCue": "T1190 · INITIAL ACCESS — When Versa Director SD-WAN orchestration port 4566 (intended for internal HA/Spring Boot communication) or the tenant portal API is reachable, a caller invokes POST…",
      "storyMappings": [
        {
          "storyTerm": "Side coordination chute",
          "technicalTerm": "Exposed Versa Director port 4566 change_Dynamic_Favicon API (CVE-2024-39717)",
          "tone": "amber"
        },
        {
          "storyTerm": "Metal clockwork assembly painted like a badge",
          "technicalTerm": "Executable JAR payload carrying ZIP magic bytes (50 4B 03 04)",
          "tone": "sky"
        },
        {
          "storyTerm": "Paper label check without X-raying",
          "technicalTerm": "Filename extension check (.png) without file magic-byte verification",
          "tone": "rose"
        },
        {
          "storyTerm": "Station emblem drawer",
          "technicalTerm": "/var/versa/vnms/web/custom_logo/favicon_brand.png on disk",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-versa-sdwan-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Side coordination chute",
          "subtitle": "Exposed Versa Director port 4566 change_Dynamic_Favicon API…",
          "tone": "amber"
        },
        {
          "id": "zday-versa-sdwan-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Metal clockwork assembly painted like a…",
          "subtitle": "Executable JAR payload carrying ZIP magic bytes (50 4B 03 04)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Side",
          "stageTag": "STEP 01 · SETUP",
          "title": "Side coordination chute",
          "storyExcerpt": "Approaching the dispatch center side coordination chute, the intruder drops in a dense metal clockwork assembly painted to look like a harmless little station badge.",
          "technicalParallel": "Under the hood, the observed step executes grep -rn \"change_Dynamic_Favicon\" /var/log/versa/vnms/ (which executes the technical command / telemetry directive , grep -rn \"change_Dynamic_Favicon\"…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Like",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Metal clockwork assembly painted like a badge",
          "storyExcerpt": "Because the chute only checks the paper label instead of weighing or X-raying the package, it shelves the disguised mechanism inside the station emblem drawer.",
          "technicalParallel": "When Versa Director SD-WAN orchestration port 4566 (intended for internal HA/Spring Boot communication) or the tenant portal API is reachable, a caller invokes POST…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. X-raying",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Station emblem drawer",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across station emblem drawer while locking down paper label check without x-raying.",
          "technicalParallel": "Documented in Web Access Log Event 200 (recording VulnerabilityId=CVE-2024-39717 , Versa Director Unrestricted Upload of File with Dangerous Type, TargetEndpoint=POST…",
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
          "label": "Emblem Chute",
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
          "label": "Spinning Gear",
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
          "label": "Heap Audit",
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
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "versa-director-sdwan-guiclient-jar-upload-cve-2024-39717-audit",
      "sectionKey": "step-2",
      "sceneKind": "zday-versa-sdwan-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "JVM VirtualMachine.attach & Java Instrumentation Agent Injection (VersaMem)",
      "storyCue": "Using an official maintenance coupling socket built into the live dispatch console, the intruder snaps the disguised clockwork gear directly onto the spinning traffic-routing turntable. From that moment on, every visitor message passing across the turntable silently runs through the intruder hidden teeth.",
      "technicalCue": "T1505.003 · PERSISTENCE — Once the disguised JAR is written to disk, it is loaded into the running Apache Tomcat JVM process via the Java Attach API (com.sun.tools.attach.VirtualMachine) and…",
      "storyMappings": [
        {
          "storyTerm": "Official maintenance coupling socket",
          "technicalTerm": "JVM Dynamic Attach Unix domain socket (/tmp/.java_pid2418)",
          "tone": "amber"
        },
        {
          "storyTerm": "Snapping the gear onto the spinning turntable",
          "technicalTerm": "VirtualMachine.attach loading the VersaMem Java Instrumentation Agent",
          "tone": "sky"
        },
        {
          "storyTerm": "Spinning traffic-routing turntable",
          "technicalTerm": "Running Apache Tomcat ApplicationFilterChain.internalDoFilter method",
          "tone": "rose"
        },
        {
          "storyTerm": "Hidden teeth intercepting every message",
          "technicalTerm": "In-memory Javassist bytecode hook harvesting credentials and commands",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-versa-sdwan-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Official maintenance coupling socket",
          "subtitle": "JVM Dynamic Attach Unix domain socket (/tmp/.java_pid2418)",
          "tone": "amber"
        },
        {
          "id": "zday-versa-sdwan-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Snapping the gear onto the spinning…",
          "subtitle": "VirtualMachine.attach loading the VersaMem Java…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Live Gear",
          "stageTag": "STEP 02 · SETUP",
          "title": "Official maintenance coupling socket",
          "storyExcerpt": "Using an official maintenance coupling socket built into the live dispatch console, the intruder snaps the disguised clockwork gear directly onto the spinning traffic-routing turntable.",
          "technicalParallel": "Under the hood, the observed step executes jcmd $(pgrep -f tomcat) VM.class_hierarchy -i org.apache.catalina.core.ApplicationFilterChain (which invokes or targets the host daemon/process , jcmd $, pgrep…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Gear Onto",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Snapping the gear onto the spinning turntable",
          "storyExcerpt": "From that moment on, every visitor message passing across the turntable silently runs through the intruder hidden teeth.",
          "technicalParallel": "Once the disguised JAR is written to disk, it is loaded into the running Apache Tomcat JVM process via the Java Attach API (com.sun.tools.attach.VirtualMachine) and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Hidden teeth intercepting every message",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across hidden teeth intercepting every message while locking down spinning traffic-routing turntable.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording MemoryImplant=VersaMem Java Instrumentation Agent , Javassist Bytecode Hook…",
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
          "label": "Emblem Chute",
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
          "label": "Spinning Gear",
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
          "label": "Heap Audit",
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
      "mitreId": "T1505.003"
    },
    "step-3": {
      "scenarioId": "versa-director-sdwan-guiclient-jar-upload-cve-2024-39717-audit",
      "sectionKey": "step-3",
      "sceneKind": "zday-versa-sdwan-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "On-Disk JAR Deletion & Live JVM Heap / Class Dump Forensics",
      "storyCue": "Once the clockwork gear is locked onto the spinning turntable, the intruder sweeps the original badge package into an incinerator so a casual look inside the emblem drawer finds nothing unusual. Skilled investigators must freeze and photograph the spinning turntable itself before anyone flips the power switch and erases the evidence.",
      "technicalCue": "T1070.004 · DEFENSE EVASION — After attaching to the Tomcat process, the loader deletes /var/versa/vnms/web/custom_logo/favicon_brand.png from disk so filesystem scans find nothing; DFIR analysts recover the hooked bytecode…",
      "storyMappings": [
        {
          "storyTerm": "Sweeping the original package into an incinerator",
          "technicalTerm": "Anti-forensic unlinkat (syscall 263) deleting favicon_brand.png from disk",
          "tone": "amber"
        },
        {
          "storyTerm": "Casual look inside the emblem drawer",
          "technicalTerm": "Standard filesystem antivirus scan missing the memory-resident agent",
          "tone": "sky"
        },
        {
          "storyTerm": "Photographing the spinning turntable before power-off",
          "technicalTerm": "Live JVM heap acquisition via jmap -dump:live to /cases/versa_tomcat_heap.hprof",
          "tone": "rose"
        },
        {
          "storyTerm": "Captured turntable blueprint showing foreign teeth",
          "technicalTerm": "Recovered hooked ApplicationFilterChain bytecode attributed to Volt Typhoon",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-versa-sdwan-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Sweeping the original package into an…",
          "subtitle": "Anti-forensic unlinkat (syscall 263) deleting…",
          "tone": "amber"
        },
        {
          "id": "zday-versa-sdwan-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Casual look inside the emblem drawer",
          "subtitle": "Standard filesystem antivirus scan missing the memory-resident…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Gear Onto",
          "stageTag": "STEP 03 · SETUP",
          "title": "Sweeping the original package into an incinerator",
          "storyExcerpt": "Once the clockwork gear is locked onto the spinning turntable, the intruder sweeps the original badge package into an incinerator so a casual look inside the emblem drawer finds nothing unusual.",
          "technicalParallel": "Under the hood, the observed step executes jmap -dump:live,format=b,file=/cases/versa_tomcat_heap.hprof $(pgrep -f tomcat) (which invokes or targets the host daemon/process , jmap…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Look",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Casual look inside the emblem drawer",
          "storyExcerpt": "Skilled investigators must freeze and photograph the spinning turntable itself before anyone flips the power switch and erases the evidence.",
          "technicalParallel": "After attaching to the Tomcat process, the loader deletes /var/versa/vnms/web/custom_logo/favicon_brand.png from disk so filesystem scans find nothing; DFIR analysts recover the hooked bytecode by…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Captured turntable blueprint showing foreign teeth",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across captured turntable blueprint showing foreign teeth while locking down photographing the spinning turntable before power-off.",
          "technicalParallel": "Documented in Linux Audit Event 263 (recording AntiForensicAction=unlinkat , syscall 263 deleted /var/versa/vnms/web/custom_logo/favicon_brand.png after JVM load, MemoryForensicEvidence=Modified…",
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
          "label": "Emblem Chute",
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
          "label": "Spinning Gear",
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
          "label": "Heap Audit",
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
      "mitreId": "T1070.004"
    }
  },
  "vulncheck-cwp-preauth-module-dispatch-rce": {
    "briefing": {
      "scenarioId": "vulncheck-cwp-preauth-module-dispatch-rce",
      "sectionKey": "briefing",
      "sceneKind": "zday-cwp-rce-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Control Web Panel (CWP) Pre-Auth Module Dispatch to Root RCE… — Story-to-Technical Overview",
      "storyCue": "Imagine a multi-tenant apartment building with a distracted lobby receptionist and an unlocked basement dumbwaiter leading straight to the superintendent boiler room. First, an intruder tests mailbox names and notices that even after the receptionist writes a move-along slip, she still fetches and opens whatever tenant folder was named on the form. Next, the intruder uses that unlocked folder to trigger a self-starting workshop drawer inside a tenant unit, rides the unguarded basement dumbwaiter up to the superintendent office, and slips a forged pass formula into the superintendent guestbook to seize full control of the whole building.",
      "technicalCue": "INITIAL ACCESS: Account Enumeration Oracle, Execution After Redirect (CVE-2026-73696) & Module LFI (CVE-2026-73695) -> EXECUTION: Pre-Auth Hosting Account RCE via phpini_editor.php (CVE-2026-73697) & protected_directory.php (CVE-2026-77876) -> DEFENSE EVASION: Single-Request Root Escalation via Loopback User API 127.0.0.1:2302 (CVE-2026-77877, CVE-2026-77878 & CVE-2026-104080) -> CREDENTIAL ACCESS: Loopback OAuth SQLi Auth Bypass (CVE-2026-77879), /v1/newpass/ Root RCE (CVE-2026-77880) & Blind SQLi (CVE-2026-77881)",
      "storyMappings": [
        {
          "storyTerm": "Lobby receptionist opening folders after a move-along slip",
          "technicalTerm": "Execution-after-redirect (CVE-2026-73696) and module LFI (CVE-2026-73695) on port 2083",
          "tone": "amber"
        },
        {
          "storyTerm": "Self-starting workshop drawer inside a tenant unit",
          "technicalTerm": "File-scope pre-auth PHP execution in phpini_editor.php (CVE-2026-73697)",
          "tone": "sky"
        },
        {
          "storyTerm": "Unguarded basement dumbwaiter to the boiler room",
          "technicalTerm": "Loopback root API on 127.0.0.1:2302 lacking authentication (CVE-2026-77877..104080)",
          "tone": "rose"
        },
        {
          "storyTerm": "Forged pass formula in the superintendent guestbook",
          "technicalTerm": "OAuth SQL injection bypass (CVE-2026-77879) and /v1/newpass/ root RCE (CVE-2026-77880)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 22,
      "callouts": [
        {
          "id": "zday-cwp-rce-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Lobby receptionist opening folders after…",
          "subtitle": "Execution-after-redirect (CVE-2026-73696) and module LFI…",
          "tone": "amber"
        },
        {
          "id": "zday-cwp-rce-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Self-starting workshop drawer inside a…",
          "subtitle": "File-scope pre-auth PHP execution in phpini_editor.php…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Real Name",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Account Enumeration Oracle, Execution After Redirect (CVE-2026-73696) & Module LFI (CVE-2026-73695)",
          "storyExcerpt": "At the apartment lobby counter, the intruder reads the timing of buzzer responses to discover a real tenant name, then asks for an internal room folder without showing a key. The clerk stamps a redirect…",
          "technicalParallel": "In the admin panel on port 2031, CWP calls header Location: /login followed immediately by exit (halting execution before any protected code loads), whereas the refactored user panel on port 2083 omitted…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5.5
        },
        {
          "id": 2,
          "shortLabel": "2. Self-running",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "Pre-Auth Hosting Account RCE via phpini_editor.php (CVE-2026-73697) & protected_directory.php (CVE-2026-77876)",
          "storyExcerpt": "Because one of the tenant workshop drawers starts running its tools the instant anyone slides it open, the intruder simply names that drawer on the lobby request and immediately gains command execution…",
          "technicalParallel": "Even though CWPHttpRequest strips single and double quotes from POST parameters (attempting to neutralize basic string breakouts), splitting PHP open and close tags across the title and value arrays in…",
          "accentHex": "#22D3EE",
          "startSec": 5.5,
          "endSec": 11
        },
        {
          "id": 3,
          "shortLabel": "3. Room",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Single-Request Root Escalation via Loopback User API 127.0.0.1:2302 (CVE-2026-77877, CVE-2026-77878 & CVE-2026-104080)",
          "storyExcerpt": "From inside the tenant apartment, the intruder opens the building internal basement dumbwaiter shaft that connects straight to the superintendent boiler room. Because the boiler-room intercom assumes…",
          "technicalParallel": "Because Stage 2 under CVE-2026-73697 can invoke curl directly inside its hfilename command injection payload (bridging the external port 2083 web session to the internal 127.0.0.1:2302 listener), the…",
          "accentHex": "#F43F5E",
          "startSec": 11,
          "endSec": 16.5
        },
        {
          "id": 4,
          "shortLabel": "4. Pass",
          "stageTag": "STAGE 04 · CREDENTIAL ACCESS",
          "title": "Loopback OAuth SQLi Auth Bypass (CVE-2026-77879), /v1/newpass/ Root RCE (CVE-2026-77880) & Blind SQLi (CVE-2026-77881)",
          "storyExcerpt": "Even on the locked doors inside the superintendent office that do check a visitor passbook, the intruder writes a clever trick question into the pass lookup line that makes the ledger reply yes…",
          "technicalParallel": "VulnCheck's IonCube bytecode analysis across CWP patches 1.8 through 1.30 (using icunpack to inspect obfuscated PHP handlers) showed that August 2026 updates patched only filemanager for CVE-2025-48703…",
          "accentHex": "#10B981",
          "startSec": 16.5,
          "endSec": 22
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
          "label": "Lobby Desk",
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
          "label": "Dumbwaiter",
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
          "label": "Root Pass",
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
      "scenarioId": "vulncheck-cwp-preauth-module-dispatch-rce",
      "sectionKey": "step-1",
      "sceneKind": "zday-cwp-rce-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Account Enumeration Oracle, Execution After Redirect (CVE-2026-73696) & Module LFI (CVE-2026-73695)",
      "storyCue": "At the apartment lobby counter, the intruder reads the timing of buzzer responses to discover a real tenant name, then asks for an internal room folder without showing a key. The clerk stamps a redirect notice telling the intruder to leave, yet forgets to stop working and still pulls the requested folder off the shelf.",
      "technicalCue": "T1190 · INITIAL ACCESS — On port 2083, cwpsrv routes requests matching https://host:2083/<username>/ to a dedicated per-user PHP-FPM Unix socket (returning HTTP 302 Found when the hosting account exists and HTTP 404…",
      "storyMappings": [
        {
          "storyTerm": "Buzzer responses revealing a real tenant name",
          "technicalTerm": "Per-user PHP-FPM socket routing oracle on https://host:2083/<username>/",
          "tone": "amber"
        },
        {
          "storyTerm": "Redirect notice that fails to stop work",
          "technicalTerm": "Missing exit after Location redirect header (CVE-2026-73696)",
          "tone": "sky"
        },
        {
          "storyTerm": "Pulling the requested folder off the shelf",
          "technicalTerm": "Unauthenticated module parameter local file inclusion (CVE-2026-73695)",
          "tone": "rose"
        },
        {
          "storyTerm": "Apartment lobby counter",
          "technicalTerm": "Internet-facing cwpsrv nginx proxy forwarding to user PHP-FPM pools",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-cwp-rce-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Buzzer responses revealing a real tenant…",
          "subtitle": "Per-user PHP-FPM socket routing oracle on…",
          "tone": "amber"
        },
        {
          "id": "zday-cwp-rce-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Redirect notice that fails to stop work",
          "subtitle": "Missing exit after Location redirect header (CVE-2026-73696)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Real Name",
          "stageTag": "STEP 01 · SETUP",
          "title": "Buzzer responses revealing a real tenant name",
          "storyExcerpt": "At the apartment lobby counter, the intruder reads the timing of buzzer responses to discover a real tenant name, then asks for an internal room folder without showing a key.",
          "technicalParallel": "In the admin panel on port 2031, CWP calls header Location: /login followed immediately by exit (halting execution before any protected code loads), whereas the refactored user panel on port 2083 omitted…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Stop Work",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Redirect notice that fails to stop work",
          "storyExcerpt": "The clerk stamps a redirect notice telling the intruder to leave, yet forgets to stop working and still pulls the requested folder off the shelf.",
          "technicalParallel": "On port 2083, cwpsrv routes requests matching https://host:2083/<username>/ to a dedicated per-user PHP-FPM Unix socket (returning HTTP 302 Found when the hosting account exists and HTTP 404 Not Found…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Apartment lobby counter",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across apartment lobby counter while locking down pulling the requested folder off the shelf.",
          "technicalParallel": "Inspect /usr/local/cwpsrv/logs/access_log (the CWP Nginx web access log recording every port 2083 request and response size) for HTTP 302 responses on POST or GET requests to /<user>/index.php?module=...…",
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
          "label": "Lobby Desk",
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
          "label": "Dumbwaiter",
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
          "label": "Root Pass",
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
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "vulncheck-cwp-preauth-module-dispatch-rce",
      "sectionKey": "step-2",
      "sceneKind": "zday-cwp-rce-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Pre-Auth Hosting User RCE via phpini_editor.php (CVE-2026-73697) & protected_directory.php (CVE-2026-77876)",
      "storyCue": "Because one of the tenant workshop drawers starts running its tools the instant anyone slides it open, the intruder simply names that drawer on the lobby request and immediately gains command execution inside that tenant apartment with zero login.",
      "technicalCue": "T1059.004 · EXECUTION — Because modules/phpini_editor.php executes at file scope as soon as Stage 1 includes it, an unauthenticated attacker reaches two pre-auth sinks running as hosting user uid=1000 under…",
      "storyMappings": [
        {
          "storyTerm": "Self-running tenant workshop drawer",
          "technicalTerm": "modules/phpini_editor.php and protected_directory.php executing at file scope",
          "tone": "amber"
        },
        {
          "storyTerm": "Naming the drawer on the lobby request",
          "technicalTerm": "Unauthenticated ?module=phpini_editor dispatch chaining CVE-2026-73697",
          "tone": "sky"
        },
        {
          "storyTerm": "Command execution inside the tenant apartment",
          "technicalTerm": "Pre-auth remote code execution running under the hosting user UID",
          "tone": "rose"
        },
        {
          "storyTerm": "Secondary unlocked tool tray",
          "technicalTerm": "protected_directory.php command injection fallback (CVE-2026-77876)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-cwp-rce-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Self-running tenant workshop drawer",
          "subtitle": "modules/phpini_editor.php and protected_directory.php…",
          "tone": "amber"
        },
        {
          "id": "zday-cwp-rce-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Naming the drawer on the lobby request",
          "subtitle": "Unauthenticated ?module=phpini_editor dispatch chaining…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Self-running",
          "stageTag": "STEP 02 · SETUP",
          "title": "Self-running tenant workshop drawer",
          "storyExcerpt": "Because one of the tenant workshop drawers starts running its tools the instant anyone slides it open, the intruder simply names that drawer on the lobby request and immediately gains command…",
          "technicalParallel": "Even though CWPHttpRequest strips single and double quotes from POST parameters (attempting to neutralize basic string breakouts), splitting PHP open and close tags across the title and value arrays in…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Naming the drawer on the lobby request",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses naming the drawer on the lobby request to advance toward command execution inside the tenant apartment.",
          "technicalParallel": "Because modules/phpini_editor.php executes at file scope as soon as Stage 1 includes it, an unauthenticated attacker reaches two pre-auth sinks running as hosting user uid=1000 under CVE-2026-73697…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tool Tray",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Secondary unlocked tool tray",
          "storyExcerpt": "Behind the scenes, secondary unlocked tool tray captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Correlate cwpsrv access logs showing POST /<user>/index.php?module=phpini_editor&acc=update or acc=addlabelphpiniadv with Linux auditd SYSCALL execve records (syscall 59 capturing every newly spawned…",
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
          "label": "Lobby Desk",
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
          "label": "Dumbwaiter",
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
          "label": "Root Pass",
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
      "mitreId": "T1059.004"
    },
    "step-3": {
      "scenarioId": "vulncheck-cwp-preauth-module-dispatch-rce",
      "sectionKey": "step-3",
      "sceneKind": "zday-cwp-rce-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Loopback User API 127.0.0.1:2302 Missing Auth (CVE-2026-77877) to Root Command Injection (CVE-2026-77878 & CVE-2026-104080)",
      "storyCue": "From inside the tenant apartment, the intruder opens the building internal basement dumbwaiter shaft that connects straight to the superintendent boiler room. Because the boiler-room intercom assumes only trusted staff can reach the basement shaft, it blindly runs the intruder maintenance command with master building privileges.",
      "technicalCue": "T1068 · DEFENSE EVASION — Control Web Panel runs an internal Slim v2 User API bound to https://127.0.0.1:2302 whose PHP-FPM pool executes as root uid=0 (granting unrestricted OS control to any request that reaches its…",
      "storyMappings": [
        {
          "storyTerm": "Basement dumbwaiter shaft",
          "technicalTerm": "Localhost-only Slim v2 User API listening on https://127.0.0.1:2302",
          "tone": "amber"
        },
        {
          "storyTerm": "Boiler-room intercom skipping badge checks",
          "technicalTerm": "Missing authentication middleware on /v1/restoredatabase/ and /valid_token/ (CVE-2026-77877)",
          "tone": "sky"
        },
        {
          "storyTerm": "Maintenance command with hidden separators",
          "technicalTerm": "Root shell injection via unsanitized parameters (CVE-2026-77878 & CVE-2026-104080)",
          "tone": "rose"
        },
        {
          "storyTerm": "Master building privileges",
          "technicalTerm": "Root PHP-FPM worker pool executing /bin/sh -c as UID 0",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-cwp-rce-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Basement dumbwaiter shaft",
          "subtitle": "Localhost-only Slim v2 User API listening on…",
          "tone": "amber"
        },
        {
          "id": "zday-cwp-rce-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Boiler-room intercom skipping badge checks",
          "subtitle": "Missing authentication middleware on /v1/restoredatabase/ and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room",
          "stageTag": "STEP 03 · SETUP",
          "title": "Basement dumbwaiter shaft",
          "storyExcerpt": "From inside the tenant apartment, the intruder opens the building internal basement dumbwaiter shaft that connects straight to the superintendent boiler room.",
          "technicalParallel": "Because Stage 2 under CVE-2026-73697 can invoke curl directly inside its hfilename command injection payload (bridging the external port 2083 web session to the internal 127.0.0.1:2302 listener), the…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Only Can",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Boiler-room intercom skipping badge checks",
          "storyExcerpt": "Because the boiler-room intercom assumes only trusted staff can reach the basement shaft, it blindly runs the intruder maintenance command with master building privileges.",
          "technicalParallel": "Control Web Panel runs an internal Slim v2 User API bound to https://127.0.0.1:2302 whose PHP-FPM pool executes as root uid=0 (granting unrestricted OS control to any request that reaches its handlers).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Master building privileges",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across master building privileges while locking down maintenance command with hidden separators.",
          "technicalParallel": "Monitor Linux auditd execve (syscall 59, which logs every program launch with its exact user ID and arguments) where uid=0 and euid=0 spawn /bin/sh -c running mysql or grep with shell separators (; or…",
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
          "label": "Lobby Desk",
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
          "label": "Dumbwaiter",
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
          "label": "Root Pass",
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
    "step-4": {
      "scenarioId": "vulncheck-cwp-preauth-module-dispatch-rce",
      "sectionKey": "step-4",
      "sceneKind": "zday-cwp-rce-step-4",
      "stageBadge": "STEP #4 · CREDENTIAL ACCESS",
      "title": "OAuth Gate SQLi Bypass as root@localhost (CVE-2026-77879), /v1/newpass/ Root RCE (CVE-2026-77880) & Blind SQLi (CVE-2026-77881)",
      "storyCue": "Even on the locked doors inside the superintendent office that do check a visitor passbook, the intruder writes a clever trick question into the pass lookup line that makes the ledger reply yes automatically, unlocking the master password reset desk to claim permanent control of the entire apartment complex.",
      "technicalCue": "T1552.001 · CREDENTIAL ACCESS — For routes on 127.0.0.1:2302 that do invoke the access_token middleware in services/user_api/v1/index.php, the function connects to MySQL using /root/.my.cnf as root@localhost and concatenates…",
      "storyMappings": [
        {
          "storyTerm": "Locked doors checking a visitor passbook",
          "technicalTerm": "access_token() middleware in services/user_api/v1/index.php",
          "tone": "amber"
        },
        {
          "storyTerm": "Trick question making the ledger reply yes",
          "technicalTerm": "SQL injection bypass in OAuth token lookup as root@localhost (CVE-2026-77879)",
          "tone": "sky"
        },
        {
          "storyTerm": "Master password reset desk",
          "technicalTerm": "/v1/newpass/ endpoint root command injection (CVE-2026-77880)",
          "tone": "rose"
        },
        {
          "storyTerm": "Hidden yes-or-no ledger peephole",
          "technicalTerm": "Blind SQL injection information disclosure vector (CVE-2026-77881)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "zday-cwp-rce-step-4-left",
          "tag": "STEP 4 · FOCUS",
          "title": "Locked doors checking a visitor passbook",
          "subtitle": "access_token() middleware in services/user_api/v1/index.php",
          "tone": "amber"
        },
        {
          "id": "zday-cwp-rce-step-4-right",
          "tag": "STEP 4 · ACTION",
          "title": "Trick question making the ledger reply yes",
          "subtitle": "SQL injection bypass in OAuth token lookup as root@localhost…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Even Do",
          "stageTag": "STEP 04 · SETUP",
          "title": "Locked doors checking a visitor passbook",
          "storyExcerpt": "Even on the locked doors inside the superintendent office that do check a visitor passbook, the intruder writes a clever trick question into the pass lookup line that makes the ledger reply yes…",
          "technicalParallel": "VulnCheck's IonCube bytecode analysis across CWP patches 1.8 through 1.30 (using icunpack to inspect obfuscated PHP handlers) showed that August 2026 updates patched only filemanager for CVE-2025-48703…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Yes",
          "stageTag": "STEP 04 · MECHANISM",
          "title": "Trick question making the ledger reply yes",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses trick question making the ledger reply yes to advance toward master password reset desk.",
          "technicalParallel": "For routes on 127.0.0.1:2302 that do invoke the access_token middleware in services/user_api/v1/index.php, the function connects to MySQL using /root/.my.cnf as root@localhost and concatenates raw POST…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Desk",
          "stageTag": "STEP 04 · EVIDENCE",
          "title": "Hidden yes-or-no ledger peephole",
          "storyExcerpt": "Behind the scenes, hidden yes-or-no ledger peephole captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Audit MySQL general and slow query logs (recording every SQL statement executed by root@localhost against oauth_authorization_codes and oauth_clients) for UNION SELECT or SLEEP subqueries, and verify CWP…",
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
          "label": "Lobby Desk",
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
          "label": "Dumbwaiter",
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
          "label": "Root Pass",
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
      "mitreId": "T1552.001"
    }
  }
};
